import { SupabaseClient } from "@supabase/supabase-js";
import { PaymentRepository } from "../repositories/payment.repository";
import { checkoutSchema, productCheckoutSchema } from "../entities/payment";
import type { CheckoutInput, ProductCheckoutInput, Order, OrderItem } from "../entities/payment";
import { stripe } from "@/shared/lib/stripe/server";
import { ProductRepository } from "@/domains/products/repositories/product.repository";

export class PaymentService {
  private repository: PaymentRepository;

  constructor(private supabase: SupabaseClient) {
    this.repository = new PaymentRepository(supabase);
  }

  async listOrders(userId?: string): Promise<Order[]> {
    return this.repository.findAll(userId);
  }

  async getOrder(id: string): Promise<{ order: Order; items: OrderItem[] } | null> {
    const order = await this.repository.findById(id);
    if (!order) return null;

    const items = await this.repository.getOrderItems(id);
    return { order, items };
  }

  async createCheckoutSession(
    input: CheckoutInput,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ url: string }> {
    const validated = checkoutSchema.parse(input);

    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const totalAmount = validated.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: validated.items.map((item) => ({
        price_data: {
          currency: validated.currency,
          product_data: { name: item.name },
          unit_amount: item.unit_price,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { user_id: user.id },
    });

    // Create order in database
    const order = await this.repository.create({
      user_id: user.id,
      amount: totalAmount,
      currency: validated.currency,
      stripe_session_id: session.id,
      status: "pending",
    });

    await this.repository.createItems(order.id, validated.items);

    return { url: session.url! };
  }

  async createProductCheckoutSession(
    input: ProductCheckoutInput,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ url: string }> {
    const validated = productCheckoutSchema.parse(input);

    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Fetch products from database
    const productRepo = new ProductRepository(this.supabase);
    const productIds = validated.items.map((item) => item.product_id);
    
    const products = await Promise.all(
      productIds.map((id) => productRepo.findById(id))
    );

    // Validate all products exist and are active
    const invalidProducts = products.filter((p) => !p || p.status !== "active");
    if (invalidProducts.length > 0) {
      throw new Error("Some products are not available");
    }

    // Build checkout items with product details
    const checkoutItems = validated.items.map((item) => {
      const product = products.find((p) => p!.id === item.product_id)!;
      return {
        name: product.name,
        unit_price: product.price,
        quantity: item.quantity,
      };
    });

    const totalAmount = checkoutItems.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: checkoutItems.map((item) => ({
        price_data: {
          currency: validated.currency,
          product_data: { name: item.name },
          unit_amount: item.unit_price,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { user_id: user.id },
    });

    // Create order in database
    const order = await this.repository.create({
      user_id: user.id,
      amount: totalAmount,
      currency: validated.currency,
      stripe_session_id: session.id,
      status: "pending",
    });

    await this.repository.createItems(order.id, checkoutItems);

    return { url: session.url! };
  }

  async handleWebhookCheckoutComplete(sessionId: string): Promise<void> {
    const order = await this.repository.findByStripeSession(sessionId);
    if (order) {
      await this.repository.updateStatus(order.id, "paid");
    }
  }

  async refundOrder(orderId: string): Promise<Order> {
    const order = await this.repository.findById(orderId);
    if (!order) throw new Error("Order not found");
    
    if (order.status !== "paid") {
      throw new Error("Only paid orders can be refunded");
    }

    if (!order.stripe_session_id) {
      throw new Error("No Stripe session found for this order");
    }

    // Get the payment intent from the checkout session
    const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
    const paymentIntentId = session.payment_intent as string;

    if (!paymentIntentId) {
      throw new Error("No payment intent found");
    }

    // Create refund in Stripe
    await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    // Update order status
    return this.repository.updateStatus(orderId, "refunded");
  }
}
