"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/domains/products/hooks/use-products";
import { createProductSchema, type CreateProductInput, type Product } from "@/domains/products/entities/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Package } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      currency: "usd",
      status: "active",
      imageUrl: "",
    },
  });

  function openCreateDialog() {
    setEditingProduct(null);
    reset({
      name: "",
      description: "",
      price: 0,
      currency: "usd",
      status: "active",
      imageUrl: "",
    });
    setDialogOpen(true);
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description || "",
      price: product.price,
      currency: product.currency,
      status: product.status,
      imageUrl: product.imageUrl || "",
    });
    setDialogOpen(true);
  }

  async function onSubmit(data: CreateProductInput) {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, input: data });
        toast.success("Product updated successfully");
      } else {
        await createProduct.mutateAsync(data);
        toast.success("Product created successfully");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    }
  }

  async function handleDelete() {
    if (!deletingProduct) return;
    try {
      await deleteProduct.mutateAsync(deletingProduct.id);
      toast.success("Product deleted successfully");
      setDeleteDialogOpen(false);
      setDeletingProduct(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchStatus = watch("status");

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            Inventory <span className="text-slate-500 underline decoration-white/10 decoration-2 underline-offset-8">Suite</span>
          </h1>
          <p className="text-slate-500 font-medium">Manage your product catalog with precision.</p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-white text-black hover:bg-slate-200 font-bold px-8 h-12 rounded-xl transition-all shadow-xl shadow-white/10"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="bg-slate-900/40 border-white/[0.05] shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="p-8 border-b border-white/[0.05] flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black text-white tracking-tight">Active Stock</CardTitle>
            <CardDescription className="text-slate-500 font-medium uppercase text-[10px] tracking-widest mt-1">
              Real-time available items
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-white/[0.03] border-white/10 text-slate-400 font-bold px-4 py-1.5 rounded-lg uppercase text-[10px] tracking-widest">
            {products?.length || 0} Total Units
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-40">
              <Loader2 className="h-10 w-10 animate-spin text-slate-700" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.05] hover:bg-transparent">
                  <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6 pl-8">Identity</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6">Pricing</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6">Status</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6">Registered</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6 pr-8 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-32">
                      <div className="flex flex-col items-center justify-center gap-6 opacity-30">
                        <Package className="h-14 w-14 text-slate-400" />
                        <div className="space-y-1">
                          <p className="text-xl font-black text-white uppercase tracking-tighter">Inventory Empty</p>
                          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No products detected in system</p>
                        </div>
                        <Button variant="outline" onClick={openCreateDialog} className="mt-4 border-white/10 text-slate-300 font-bold rounded-xl">
                          INITIALIZE CATALOG
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  products?.map((product) => (
                    <TableRow key={product.id} className="border-white/[0.05] hover:bg-white/[0.02] transition-colors group">
                      <TableCell className="py-6 pl-8">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-slate-950 border border-white/[0.05] flex items-center justify-center font-bold text-lg text-white overflow-hidden shadow-inner group-hover:border-white/10 transition-colors">
                            {product.imageUrl ? (
                              <Image 
                                src={product.imageUrl} 
                                alt={product.name} 
                                width={48} 
                                height={48} 
                                className="h-full w-full object-cover" 
                                unoptimized
                              />
                            ) : (
                              product.name[0].toUpperCase()
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-white text-base tracking-tight truncate max-w-[240px]">
                              {product.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5 truncate max-w-[240px]">
                              {product.description || "No description"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-lg tracking-tighter">
                            ${(product.price / 100).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                            {product.currency}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "uppercase text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-md border-none",
                            product.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-800 text-slate-500"
                          )}
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">
                        {new Date(product.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/[0.05] hover:text-white transition-all" onClick={() => openEditDialog(product)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all" onClick={() => { setDeletingProduct(product); setDeleteDialogOpen(true); }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-950 border-white/10 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white tracking-tight">{editingProduct ? "Edit Product" : "Create Product"}</DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingProduct ? "Update product details" : "Add a new product to your catalog"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Name *</Label>
              <Input
                id="name"
                {...register("name")}
                aria-invalid={!!errors.name}
                className={cn("bg-slate-900 border-white/5 rounded-xl h-12 focus:ring-0 focus:border-white/20 transition-all", errors.name && "border-rose-500/50")}
              />
              {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={3}
                className="bg-slate-900 border-white/5 rounded-xl focus:ring-0 focus:border-white/20 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Price (cents) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  {...register("price", { valueAsNumber: true })}
                  aria-invalid={!!errors.price}
                  className={cn("bg-slate-900 border-white/5 rounded-xl h-12", errors.price && "border-rose-500/50")}
                />
                {errors.price && <p className="text-xs text-rose-400">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Currency *</Label>
                <Input
                  id="currency"
                  {...register("currency")}
                  maxLength={3}
                  aria-invalid={!!errors.currency}
                  className={cn("bg-slate-900 border-white/5 rounded-xl h-12", errors.currency && "border-rose-500/50")}
                />
                {errors.currency && <p className="text-xs text-rose-400">{errors.currency.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</Label>
              <Select
                value={watchStatus}
                onValueChange={(value: "active" | "inactive") => setValue("status", value)}
              >
                <SelectTrigger id="status" className="bg-slate-900 border-white/5 rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                {...register("imageUrl")}
                placeholder="https://example.com/image.jpg"
                aria-invalid={!!errors.imageUrl}
                className={cn("bg-slate-900 border-white/5 rounded-xl h-12", errors.imageUrl && "border-rose-500/50")}
              />
              {errors.imageUrl && <p className="text-xs text-rose-400">{errors.imageUrl.message}</p>}
            </div>
            <DialogFooter className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest text-slate-500">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-white text-black hover:bg-slate-200 h-12 rounded-xl px-10 font-bold uppercase text-[10px] tracking-widest transition-all">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : editingProduct ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-950 border-white/10 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-white tracking-tight">Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              This will permanently delete <strong>{deletingProduct?.name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel onClick={() => setDeletingProduct(null)} className="h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest border-white/10 text-slate-500">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-500 text-white hover:bg-rose-600 h-12 rounded-xl px-10 font-bold uppercase text-[10px] tracking-widest transition-all"
            >
              {deleteProduct.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
