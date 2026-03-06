"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/domains/posts/entities/post";

interface CategorySelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  label?: string;
  className?: string;
}

export function CategorySelector({
  selectedIds,
  onChange,
  label = "Categories",
  className,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories from API
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
        setLoading(false);
      });
  }, []);

  const toggleCategory = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((cid) => cid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeCategory = (id: string) => {
    onChange(selectedIds.filter((cid) => cid !== id));
  };

  const selectedCategories = categories.filter((cat) =>
    selectedIds.includes(cat.id)
  );

  if (loading) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label className="text-base font-semibold">{label}</Label>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-base font-semibold">{label}</Label>

      {/* Selected Categories */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/20">
          {selectedCategories.map((category) => (
            <Badge
              key={category.id}
              variant="secondary"
              className="gap-1 pl-3 pr-1"
            >
              {category.name}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeCategory(category.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Available Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedIds.includes(category.id);
          return (
            <Button
              key={category.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => toggleCategory(category.id)}
              className="transition-colors"
            >
              {category.name}
            </Button>
          );
        })}
      </div>

      {categories.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No categories available. Contact an admin to create categories.
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Select one or more categories for this post.
      </p>
    </div>
  );
}
