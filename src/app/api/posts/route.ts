import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { PostService } from "@/domains/posts/services/post.service";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? undefined;

    const service = new PostService(supabase);
    const posts = await service.list(query);

    return NextResponse.json(posts);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const service = new PostService(supabase);
    const post = await service.create(body);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message.includes("Unauthorized") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
