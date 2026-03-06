import { SupabaseClient } from "@supabase/supabase-js";
import type { Post, CreatePostInput, UpdatePostInput } from "../entities/post";
import { generateSlug, ensureUniqueSlug } from "@/shared/lib/slug";

export class PostRepository {
  constructor(private supabase: SupabaseClient) {}

  async findAll(query?: string): Promise<Post[]> {
    let builder = this.supabase
      .from("posts")
      .select(`
        *,
        categories:post_categories(
          category:categories(*)
        )
      `)
      .order("created_at", { ascending: false });

    if (query) {
      builder = builder.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
    }

    const { data, error } = await builder;
    if (error) throw error;
    
    return (data ?? []).map((post: any) => this.transformPost(post));
  }

  async findById(id: string): Promise<Post | null> {
    console.log(`[PostRepository] findById called with: ${id}`);
    const { data, error } = await this.supabase
      .from("posts")
      .select(`
        *,
        categories:post_categories(
          category:categories(*)
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.log(`[PostRepository] findById error:`, error.code, error.message);
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    if (data) {
      console.log(`[PostRepository] findById success: Found ${data.id}`);
      return this.transformPost(data);
    }
    
    return data;
  }

  async findBySlug(slug: string): Promise<Post | null> {
    console.log(`[PostRepository] findBySlug called with: ${slug}`);
    const { data, error } = await this.supabase
      .from("posts")
      .select(`
        *,
        categories:post_categories(
          category:categories(*)
        )
      `)
      .eq("slug", slug)
      .single();

    if (error) {
      console.log(`[PostRepository] findBySlug error:`, error.code, error.message);
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    if (data) {
      console.log(`[PostRepository] findBySlug success: Found ${data.id}`);
      return this.transformPost(data);
    }
    
    return data;
  }

  async slugExists(slug: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }

  async findPublished(query?: string): Promise<Post[]> {
    let builder = this.supabase
      .from("posts")
      .select(`
        *,
        categories:post_categories(
          category:categories(*)
        )
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (query) {
      builder = builder.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
    }

    const { data, error } = await builder;
    if (error) throw error;
    
    return (data ?? []).map((post: any) => this.transformPost(post));
  }

  private transformPost(data: any): Post {
    return {
      ...data,
      categories: data.categories?.map((pc: any) => pc.category).filter(Boolean) ?? [],
    };
  }

  async create(input: CreatePostInput & { author_id: string }): Promise<Post> {
    const { category_ids, ...postData } = input;
    
    // Generate slug if not provided
    if (!postData.slug) {
      const baseSlug = generateSlug(postData.title);
      postData.slug = await ensureUniqueSlug(baseSlug, (slug) => this.slugExists(slug));
    }

    // Create the post
    const { data: post, error: postError } = await this.supabase
      .from("posts")
      .insert(postData)
      .select()
      .single();

    if (postError) throw postError;

    // Add categories if provided
    if (category_ids && category_ids.length > 0) {
      const categoryLinks = category_ids.map((category_id) => ({
        post_id: post.id,
        category_id,
      }));

      const { error: catError } = await this.supabase
        .from("post_categories")
        .insert(categoryLinks);

      if (catError) throw catError;
    }

    // Fetch the complete post with categories
    return (await this.findById(post.id))!;
  }

  async update(id: string, input: UpdatePostInput): Promise<Post> {
    const { category_ids, ...postData } = input;

    // Update slug if title changed and slug not explicitly provided
    if (postData.title && !postData.slug) {
      const baseSlug = generateSlug(postData.title);
      postData.slug = await ensureUniqueSlug(baseSlug, async (slug) => {
        const { data } = await this.supabase
          .from("posts")
          .select("id")
          .eq("slug", slug)
          .neq("id", id) // Exclude current post
          .maybeSingle();
        return !!data;
      });
    }

    // Update the post
    const { data: post, error: postError } = await this.supabase
      .from("posts")
      .update({ ...postData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (postError) throw postError;

    // Update categories if provided
    if (category_ids !== undefined) {
      // Remove existing categories
      await this.supabase
        .from("post_categories")
        .delete()
        .eq("post_id", id);

      // Add new categories
      if (category_ids.length > 0) {
        const categoryLinks = category_ids.map((category_id) => ({
          post_id: id,
          category_id,
        }));

        const { error: catError } = await this.supabase
          .from("post_categories")
          .insert(categoryLinks);

        if (catError) throw catError;
      }
    }

    // Fetch the complete post with categories
    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from("posts").delete().eq("id", id);

    if (error) throw error;
  }
}
