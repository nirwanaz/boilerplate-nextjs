"use client";

import { useOrders, useCreateCheckout } from "@/domains/payments/hooks/use-payments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default",
  pending: "secondary",
  failed: "destructive",
  refunded: "outline",
};

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();
  const createCheckout = useCreateCheckout();

  async function handleDemoCheckout() {
    try {
      await createCheckout.mutateAsync({
        items: [
          { name: "Demo Product", quantity: 1, unitPrice: 2000 },
          { name: "Add-on Feature", quantity: 2, unitPrice: 500 },
        ],
        currency: "usd",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">Your order history</p>
        </div>
        <Button
          onClick={handleDemoCheckout}
          disabled={createCheckout.isPending}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
        >
          {createCheckout.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <ShoppingCart className="h-4 w-4 mr-2" />
          )}
          Demo Checkout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Order History{" "}
            {orders && (
              <span className="text-muted-foreground font-normal">
                ({orders.length})
              </span>
            )}
          </CardTitle>
          <CardDescription>View and track all your payments</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      No orders yet. Try the demo checkout!
                    </TableCell>
                  </TableRow>
                ) : (
                  orders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">
                        ${(order.amount / 100).toFixed(2)}{" "}
                        <span className="text-muted-foreground uppercase text-xs">
                          {order.currency}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[order.status] ?? "secondary"}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
