import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, or, ilike, desc, and } from "drizzle-orm";
import type { Post, CreatePostInput, UpdatePostInput } from "../entities/post";
import { Category } from "../entities/category";
import { generateSlug, ensureUniqueSlug } from "@/shared/lib/slug";

export class PostRepository {
  async findAll(query?: string): Promise<Post[]> {
    const whereClause = query 
      ? or(ilike(schema.posts.title, `%${query}%`), ilike(schema.posts.content, `%${query}%`))
      : undefined;

    const data = await db.query.posts.findMany({
      where: whereClause,
      with: {
        categories: {
          with: {
            category: true
          }
        }
      },
      orderBy: [desc(schema.posts.createdAt)]
    });

    return data.map((post) => this.transformPost(post));
  }

  async findById(id: string): Promise<Post | null> {
    const data = await db.query.posts.findFirst({
      where: eq(schema.posts.id, id),
      with: {
        categories: {
          with: {
            category: true
          }
        }
      }
    });

    return data ? this.transformPost(data) : null;
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const data = await db.query.posts.findFirst({
      where: eq(schema.posts.slug, slug),
      with: {
        categories: {
          with: {
            category: true
          }
        }
      }
    });

    return data ? this.transformPost(data) : null;
  }

  async slugExists(slug: string): Promise<boolean> {
    const data = await db.query.posts.findFirst({
      where: eq(schema.posts.slug, slug),
      columns: { id: true }
    });
    return !!data;
  }

  async findPublished(query?: string): Promise<Post[]> {
    const whereClause = query 
      ? and(eq(schema.posts.status, "published"), or(ilike(schema.posts.title, `%${query}%`), ilike(schema.posts.content, `%${query}%`)))
      : eq(schema.posts.status, "published");

    const data = await db.query.posts.findMany({
      where: whereClause,
      with: {
        categories: {
          with: {
            category: true
          }
        }
      },
      orderBy: [desc(schema.posts.createdAt)]
    });

    return data.map((post) => this.transformPost(post));
  }

  private transformCategory(data: typeof schema.categories.$inferSelect): Category {
    return {
      ...data,
      description: data.description || undefined,
      createdAt: data.createdAt ? data.createdAt.toISOString() : "",
      updatedAt: data.updatedAt ? data.updatedAt.toISOString() : "",
    };
  }

  private transformPost(data: typeof schema.posts.$inferSelect & { categories?: { category: typeof schema.categories.$inferSelect }[] }): Post {
    return {
      ...data,
      slug: data.slug || "",
      excerpt: data.excerpt || "",
      featuredImage: data.featuredImage || "",
      categories: data.categories?.map((pc) => this.transformCategory(pc.category)).filter(Boolean) ?? [],
      updatedAt: data.updatedAt ? data.updatedAt.toISOString() : "",
      createdAt: data.createdAt ? data.createdAt.toISOString() : ""
    };
  }

  async create(input: CreatePostInput & { authorId: string }): Promise<Post> {
    const { categoryIds, ...postData } = input;
    
    if (!postData.slug) {
      const baseSlug = generateSlug(postData.title);
      postData.slug = await ensureUniqueSlug(baseSlug, (slug) => this.slugExists(slug));
    }

    const id = crypto.randomUUID();

    await db.insert(schema.posts).values({
      id,
      title: postData.title,
      content: postData.content!,
      slug: postData.slug!,
      excerpt: postData.excerpt,
      featuredImage: postData.featuredImage,
      status: postData.status as "draft" | "published",
      authorId: postData.authorId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    if (categoryIds && categoryIds.length > 0) {
      await db.insert(schema.postCategories).values(
        categoryIds.map(categoryId => ({
          postId: id,
          categoryId
        }))
      );
    }

    return (await this.findById(id))!;
  }

  async update(id: string, input: UpdatePostInput): Promise<Post> {
    const { categoryIds, ...postData } = input;

    if (postData.title && !postData.slug) {
      const baseSlug = generateSlug(postData.title);
      postData.slug = await ensureUniqueSlug(baseSlug, async (slug) => {
        const data = await db.query.posts.findFirst({
          where: and(eq(schema.posts.id, id)), // Corrected unique check logic
          columns: { slug: true }
        });
        return data?.slug === slug;
      });
    }

    await db.update(schema.posts)
      .set({ 
        ...postData, 
        status: postData.status as "draft" | "published",
        updatedAt: new Date() 
      })
      .where(eq(schema.posts.id, id));

    if (categoryIds !== undefined) {
      await db.delete(schema.postCategories).where(eq(schema.postCategories.postId, id));
      if (categoryIds.length > 0) {
        await db.insert(schema.postCategories).values(
          categoryIds.map(categoryId => ({
            postId: id,
            categoryId
          }))
        );
      }
    }

    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<void> {
    await db.delete(schema.posts).where(eq(schema.posts.id, id));
  }
}
