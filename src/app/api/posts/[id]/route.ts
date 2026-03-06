import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { PostService } from "@/domains/posts/services/post.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const service = new PostService(supabase);
    const post = await service.getById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    const service = new PostService(supabase);
    const post = await service.update(id, body);

    return NextResponse.json(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message.includes("Unauthorized") || message.includes("Forbidden") ? 403 : 400;
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

    const service = new PostService(supabase);
    await service.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message.includes("Unauthorized") || message.includes("Forbidden") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
