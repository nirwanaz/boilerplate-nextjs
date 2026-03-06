-- ============================================
-- Migration: Add post priority features
-- Description: Add slug, excerpt, featured_image, and categories
-- ============================================

-- Add new columns to posts table
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS excerpt TEXT,
  ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- Add unique constraint for slug
ALTER TABLE public.posts
  ADD CONSTRAINT posts_slug_unique UNIQUE (slug);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create junction table for post-category relationship
CREATE TABLE IF NOT EXISTS public.post_categories (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, category_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_featured_image ON public.posts(featured_image) WHERE featured_image IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_post_categories_post ON public.post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_category ON public.post_categories(category_id);

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can read categories
CREATE POLICY "Anyone can read categories"
  ON public.categories FOR SELECT
  USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (public.is_admin());

-- Enable RLS for post_categories
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;

-- Anyone can read post categories
CREATE POLICY "Anyone can read post categories"
  ON public.post_categories FOR SELECT
  USING (true);

-- Authors can manage their own post categories
CREATE POLICY "Authors can manage own post categories"
  ON public.post_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE id = post_id AND author_id = auth.uid()
    )
  );

-- Admins can manage all post categories
CREATE POLICY "Admins can manage all post categories"
  ON public.post_categories FOR ALL
  USING (public.is_admin());

-- Insert some default categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Technology', 'technology', 'Articles about technology and software'),
  ('Lifestyle', 'lifestyle', 'Lifestyle and personal development'),
  ('Business', 'business', 'Business and entrepreneurship'),
  ('Design', 'design', 'Design and creativity'),
  ('News', 'news', 'Latest news and updates')
ON CONFLICT (slug) DO NOTHING;
