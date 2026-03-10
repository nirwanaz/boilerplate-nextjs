"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePosts, useCreatePost, useDeletePost } from "@/domains/posts/hooks/use-posts";
import { createPostSchema, type CreatePostInput } from "@/domains/posts/entities/post";
import { SearchInput } from "@/shared/components/search-input";
import { RichTextEditor } from "@/shared/components/rich-text-editor";
import { ImageUpload } from "@/shared/components/image-upload";
import { CategorySelector } from "@/domains/posts/components/category-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Eye, Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { generateSlug } from "@/shared/lib/slug";
import { cn } from "@/lib/utils";

export default function PostsPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data: posts, isLoading } = usePosts(search);
  const createPost = useCreatePost();
  const deletePost = useDeletePost();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featuredImage: "",
      status: "draft",
      categoryIds: [],
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchTitle = watch("title", "");
  const watchSlug = watch("slug", "");
  const watchContent = watch("content", "");
  const watchExcerpt = watch("excerpt", "");
  const watchFeaturedImage = watch("featuredImage", "");
  const watchCategoryIds = watch("categoryIds", []);

  // Auto-generate slug from title
  useEffect(() => {
    if (watchTitle && !watchSlug) {
      setValue("slug", generateSlug(watchTitle));
    }
  }, [watchTitle, watchSlug, setValue]);

  async function onSubmit(data: CreatePostInput) {
    try {
      await createPost.mutateAsync({
        ...data,
        slug: data.slug || undefined,
        excerpt: data.excerpt || undefined,
        featuredImage: data.featuredImage || undefined,
      });
      toast.success("Post created!");
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create post");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePost.mutateAsync(id);
      toast.success("Post deleted!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete post");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground mt-1">Manage your content</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create New Article</DialogTitle>
              <p className="text-sm text-muted-foreground">Write and publish your article</p>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="postTitle" className="text-base font-semibold">
                    Title *
                  </Label>
                  <Input
                    id="postTitle"
                    {...register("title")}
                    placeholder="Enter an engaging title for your article..."
                    aria-invalid={!!errors.title}
                    className={cn("text-lg h-12", errors.title && "border-rose-500/50")}
                  />
                  {errors.title && <p className="text-xs text-rose-400">{errors.title.message}</p>}
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="postSlug" className="text-base font-semibold">
                    Slug (URL)
                  </Label>
                  <Input
                    id="postSlug"
                    {...register("slug")}
                    placeholder="auto-generated-from-title"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-generated from title. Edit to customize the URL.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postExcerpt" className="text-base font-semibold">
                  Excerpt (Optional)
                </Label>
                <Textarea
                  id="postExcerpt"
                  {...register("excerpt")}
                  placeholder="Write a short summary of your article..."
                  rows={3}
                  maxLength={500}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {(watchExcerpt || "").length}/500 characters
                </p>
              </div>

              <ImageUpload
                value={watchFeaturedImage || ""}
                onChange={(val) => setValue("featuredImage", val)}
              />

              <CategorySelector
                selectedIds={watchCategoryIds || []}
                onChange={(ids) => setValue("categoryIds", ids)}
              />

              <div className="space-y-2">
                <Label htmlFor="postContent" className="text-base font-semibold">
                  Content *
                </Label>
                <RichTextEditor
                  content={watchContent}
                  onChange={(val) => setValue("content", val)}
                  placeholder="Start writing your article... Use the toolbar to format your content."
                />
                {errors.content && <p className="text-xs text-rose-400">{errors.content.message}</p>}
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 text-base" 
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Create Post
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <SearchInput
        onSearch={setSearch}
        placeholder="Search posts..."
        className="max-w-sm"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            All Posts {posts && <span className="text-muted-foreground font-normal">({posts.length})</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No posts found. Create your first post!
                    </TableCell>
                  </TableRow>
                ) : (
                  posts?.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        {post.featuredImage ? (
                          <div className="relative w-16 h-10 rounded overflow-hidden bg-muted">
                            <Image 
                              src={post.featuredImage} 
                              alt={post.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            No Img
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="font-medium truncate" title={post.title}>{post.title}</div>
                        {post.excerpt && (
                          <div className="text-xs text-muted-foreground truncate" title={post.excerpt}>
                            {post.excerpt}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-wrap gap-1">
                          {post.categories && post.categories.length > 0 ? (
                            post.categories.slice(0, 2).map((cat) => (
                              <Badge key={cat.id} variant="outline" className="text-[10px] px-1 py-0 h-5">
                                {cat.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                          {post.categories && post.categories.length > 2 && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">
                              +{post.categories.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2 whitespace-nowrap">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/posts/${post.slug || post.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {post.status === "published" && (
                          <Button variant="ghost" size="icon" asChild title="View Public">
                            <Link href={`/blog/${post.slug || post.id}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(post.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
