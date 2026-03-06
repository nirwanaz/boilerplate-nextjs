import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { ProductService } from "@/domains/products/services/product.service";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";

    const service = new ProductService(supabase);
    const products = await service.list(activeOnly);
    return NextResponse.json(products);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const service = new ProductService(supabase);
    const product = await service.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message.includes("permission") || message.includes("role") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
