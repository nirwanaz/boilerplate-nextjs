import { PostRepository } from "../repositories/post.repository";
import { createPostSchema, updatePostSchema } from "../entities/post";
import type { CreatePostInput, UpdatePostInput, Post } from "../entities/post";
import { hasPermission } from "@/shared/auth/rbac";
import type { Role } from "@/shared/types";
import { getSession } from "@/shared/auth/dal";
import { activityLogService } from "@/domains/activity-logs/services/activity-log.service";

export class PostService {
  private repository: PostRepository;

  constructor() {
    this.repository = new PostRepository();
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

    const session = await getSession();
    if (!session) throw new Error("Forbidden");

    const post = await this.repository.create({
      ...validated,
      authorId: session.user.id,
    });

    await activityLogService.record({
      action: "CREATE_POST",
      entityType: "post",
      entityId: post.id,
      details: JSON.stringify({ title: post.title }),
    });

    return post;
  }

  async update(idOrSlug: string, input: UpdatePostInput): Promise<Post> {
    const validated = updatePostSchema.parse(input);

    // Verify ownership or admin role
    const post = await this.getById(idOrSlug);
    if (!post) throw new Error("Post not found");

    const session = await getSession();
    if (!session) throw new Error("Forbidden");

    if (post.authorId !== session.user.id) {
      // Only admin/manager can edit others' posts
      if (!hasPermission(session.profile.role, ["admin", "manager"] as Role[])) {
        throw new Error("Forbidden");
      }
    }

    const updated = await this.repository.update(post.id, validated);

    await activityLogService.record({
      action: "UPDATE_POST",
      entityType: "post",
      entityId: post.id,
      details: JSON.stringify({ title: updated.title, changes: validated }),
    });

    return updated;
  }

  async delete(idOrSlug: string): Promise<void> {
    const post = await this.getById(idOrSlug);
    if (!post) throw new Error("Post not found");

    const session = await getSession();
    if (!session) throw new Error("Forbidden");

    if (post.authorId !== session.user.id) {
      if (!hasPermission(session.profile.role, ["admin"] as Role[])) {
        throw new Error("Forbidden");
      }
    }

    await this.repository.delete(post.id);

    await activityLogService.record({
      action: "DELETE_POST",
      entityType: "post",
      entityId: post.id,
      details: JSON.stringify({ title: post.title }),
    });
  }
}
