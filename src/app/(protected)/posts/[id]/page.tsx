"use client";

import { use, useState, useEffect } from "react";
import { usePost, useUpdatePost } from "@/domains/posts/hooks/use-posts";
import { RichTextEditor } from "@/shared/components/rich-text-editor";
import { ImageUpload } from "@/shared/components/image-upload";
import { CategorySelector } from "@/domains/posts/components/category-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: post, isLoading } = usePost(id);
  const updatePost = useUpdatePost();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setSlug(post.slug || "");
      setContent(post.content || "");
      setExcerpt(post.excerpt || "");
      setFeaturedImage(post.featuredImage || "");
      setCategoryIds(post.categories?.map(c => c.id) || []);
      setStatus(post.status);
    }
  }, [post]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!post) return;

    try {
      await updatePost.mutateAsync({ 
        id: post.id, // Use semantic ID for updates
        title, 
        slug,
        content, 
        excerpt: excerpt || undefined,
        featuredImage: featuredImage || undefined,
        categoryIds: categoryIds,
        status 
      });
      toast.success("Post updated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Post not found</p>
        <Button variant="link" asChild className="mt-4">
          <Link href="/posts">Back to posts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/posts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
            <p className="text-muted-foreground mt-1">Update your post content</p>
          </div>
        </div>
        {status === "published" && (
          <Button variant="outline" asChild>
            <Link href={`/blog/${slug || id}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Post Details
            <Badge variant={status === "published" ? "default" : "secondary"}>
              {status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="editTitle" className="text-base font-semibold">
                  Title
                </Label>
                <Input
                  id="editTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter an engaging title for your article..."
                  required
                  className="text-lg h-12"
                />
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="editSlug" className="text-base font-semibold">
                  Slug (URL)
                </Label>
                <Input
                  id="editSlug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="article-url-slug"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  The URL-friendly version of the title.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editExcerpt" className="text-base font-semibold">
                Excerpt (Optional)
              </Label>
              <Textarea
                id="editExcerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Write a short summary of your article..."
                rows={3}
                maxLength={500}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {excerpt.length}/500 characters
              </p>
            </div>

            <ImageUpload
              value={featuredImage}
              onChange={setFeaturedImage}
            />

            <CategorySelector
              selectedIds={categoryIds}
              onChange={setCategoryIds}
            />

            <div className="space-y-2">
              <Label htmlFor="editContent" className="text-base font-semibold">
                Content
              </Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Write your article content... Use the toolbar to format your content."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-semibold">Status</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={status === "draft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatus("draft")}
                >
                  Draft
                </Button>
                <Button
                  type="button"
                  variant={status === "published" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatus("published")}
                >
                  Published
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={updatePost.isPending}
              className="h-11 text-base"
            >
              {updatePost.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
