import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { ProductService } from "@/domains/products/services/product.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const service = new ProductService(supabase);
    
    const product = await service.getById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    const service = new ProductService(supabase);
    const product = await service.update(id, body);
    return NextResponse.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message.includes("permission") || message.includes("role") ? 403 : 
                   message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const service = new ProductService(supabase);
    
    await service.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message.includes("permission") || message.includes("role") ? 403 : 
                   message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
