"use client";

import { useProducts } from "@/domains/products/hooks/use-products";
import { useCartStore } from "@/shared/hooks/use-cart-store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, ShoppingCart, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts(true); // Only active products
  const { addItem, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  function handleAddToCart(product: any) {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">Browse our product catalog</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/checkout">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart ({totalItems})
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : products?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No products available at the moment. Check back soon!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products?.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader className="pb-4">
                {product.image_url && (
                  <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <Badge variant="secondary">
                    ${(product.price / 100).toFixed(2)}
                  </Badge>
                </div>
                {product.description && (
                  <CardDescription className="mt-2">{product.description}</CardDescription>
                )}
              </CardHeader>
              <CardFooter className="mt-auto pt-4">
                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(product)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
