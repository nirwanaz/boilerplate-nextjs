import { SupabaseClient } from "@supabase/supabase-js";
import { PostRepository } from "../repositories/post.repository";
import { createPostSchema, updatePostSchema } from "../entities/post";
import type { CreatePostInput, UpdatePostInput, Post } from "../entities/post";
import { requireRole } from "@/shared/auth/rbac";
import type { Role } from "@/shared/types";

export class PostService {
  private repository: PostRepository;

  constructor(private supabase: SupabaseClient) {
    this.repository = new PostRepository(supabase);
  }

  async list(query?: string): Promise<Post[]> {
    return this.repository.findAll(query);
  }

  async getById(idOrSlug: string): Promise<Post | null> {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    if (isUUID) {
      return this.repository.findById(idOrSlug);
    }
    return this.repository.findBySlug(idOrSlug);
  }

  async create(input: CreatePostInput): Promise<Post> {
    const validated = createPostSchema.parse(input);

    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    return this.repository.create({
      ...validated,
      author_id: user.id,
    });
  }

  async update(idOrSlug: string, input: UpdatePostInput): Promise<Post> {
    const validated = updatePostSchema.parse(input);

    // Verify ownership or admin role
    const post = await this.getById(idOrSlug);
    if (!post) throw new Error("Post not found");

    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    if (post.author_id !== user.id) {
      // Only admin/manager can edit others' posts
      await requireRole(this.supabase, ["admin", "manager"] as Role[]);
    }

    return this.repository.update(post.id, validated);
  }

  async delete(idOrSlug: string): Promise<void> {
    const post = await this.getById(idOrSlug);
    if (!post) throw new Error("Post not found");

    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    if (post.author_id !== user.id) {
      await requireRole(this.supabase, ["admin"] as Role[]);
    }

    return this.repository.delete(post.id);
  }
}
