
import { Metadata } from 'next';
import { PostService } from "@/domains/posts/services/post.service";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = new PostService();
  const post = await service.getById(id);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on our blog.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
      type: 'article',
      publishedTime: post.createdAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  
  try {
    const service = new PostService();
    const post = await service.getById(id);

    if (!post || post.status !== 'published') {
      notFound();
    }
  
    return (
      <article className="container mx-auto py-12 px-4 md:px-6 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-6 hover:translate-x-[-4px] transition-transform">
            <Link href="/blog" className="flex items-center gap-2 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </Button>
  
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2">
              {post.categories?.map((cat) => (
                <Badge key={cat.id} variant="secondary">
                  {cat.name}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.createdAt}>
                  {new Date(post.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </div>
          </div>
        </div>

        {post.featuredImage && (
          <div className="rounded-xl overflow-hidden shadow-2xl mb-12 aspect-video relative bg-muted">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {post.excerpt && (
          <div className="text-xl md:text-2xl text-muted-foreground font-medium mb-10 leading-relaxed border-l-4 border-primary pl-6 italic">
            {post.excerpt}
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert prose-blue max-w-none mx-auto">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    );
  } catch {
    notFound();
  }
}
