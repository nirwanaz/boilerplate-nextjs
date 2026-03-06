"use client";

import { use } from "react";
import { useOrder, useRefundOrder } from "@/domains/payments/hooks/use-payments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Loader2, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default",
  pending: "secondary",
  failed: "destructive",
  refunded: "outline",
};

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { data, isLoading, refetch } = useOrder(id);
  const refundOrder = useRefundOrder();

  async function handleRefund() {
    if (!data?.order) return;
    
    try {
      await refundOrder.mutateAsync(id);
      toast.success("Order refunded successfully");
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Refund failed");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Order not found</p>
        <Button variant="link" asChild className="mt-4">
          <Link href="/admin/payments">Back to orders</Link>
        </Button>
      </div>
    );
  }

  const { order, items } = data;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/payments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">
            {order.id}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Order Summary</CardTitle>
              <Badge variant={statusVariant[order.status] ?? "secondary"}>
                {order.status}
              </Badge>
            </div>
            {order.status === "paid" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Refund
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Refund this order?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will process a full refund via Stripe and update the order status to "refunded".
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRefund}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={refundOrder.isPending}
                    >
                      {refundOrder.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Confirm Refund"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">User ID</span>
              <p className="font-mono text-xs mt-1">{order.user_id}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Date</span>
              <p className="font-medium mt-1">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Amount</span>
              <p className="font-medium text-lg mt-1">
                ${(order.amount / 100).toFixed(2)}{" "}
                <span className="text-muted-foreground uppercase text-xs">
                  {order.currency}
                </span>
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Stripe Session</span>
              <p className="font-mono text-xs mt-1 truncate">
                {order.stripe_session_id || "N/A"}
              </p>
            </div>
          </div>

          {items && items.length > 0 && (
            <>
              <hr />
              <div>
                <CardDescription className="mb-4">Order Items</CardDescription>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item: { id: string; name: string; quantity: number; unit_price: number }) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          ${(item.unit_price / 100).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${((item.unit_price * item.quantity) / 100).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
