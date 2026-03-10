
import { PostRepository } from "@/domains/posts/repositories/post.repository";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Blog - Latest Updates",
  description: "Read our latest articles and updates.",
};

export default async function BlogIndexPage() {
  const repo = new PostRepository();
  const posts = await repo.findPublished();

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 max-w-6xl">
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
          Our Blog
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the latest insights, tutorials, and updates from our team.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No articles published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-none bg-card/50 backdrop-blur-sm">
              <Link href={`/blog/${post.slug || post.id}`} className="block aspect-video relative bg-muted group overflow-hidden">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                    <span className="text-sm">No Image</span>
                  </div>
                )}
              </Link>
              
              <CardHeader className="p-5 pb-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.categories?.map((cat) => (
                    <Badge key={cat.id} variant="secondary" className="text-xs font-normal">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
                <Link href={`/blog/${post.slug || post.id}`} className="hover:underline decoration-blue-500/30 underline-offset-4">
                  <h2 className="text-xl font-bold leading-tight line-clamp-2 min-h-[3rem]">
                    {post.title}
                  </h2>
                </Link>
              </CardHeader>

              <CardContent className="p-5 pt-2 flex-grow">
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {post.excerpt || "No excerpt available."}
                </p>
              </CardContent>

              <CardFooter className="p-5 pt-0 text-xs text-muted-foreground flex items-center gap-4 mt-auto">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(post.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
