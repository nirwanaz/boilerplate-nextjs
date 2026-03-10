"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Featured Image",
  placeholder = "https://example.com/image.jpg",
  className,
}: ImageUploadProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-base font-semibold">{label}</Label>
      <div className="space-y-3">
        {/* URL Input */}
        <div className="flex gap-2">
          <Input
            type="url"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange("")}
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Image Preview */}
        {value && (
          <div className="relative w-full aspect-video border rounded-lg overflow-hidden bg-muted">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
              onLoadingComplete={(img) => {
                if (img.naturalWidth === 0) {
                  // Fallback logic if needed, but unoptimized handles most dynamic URLs
                }
              }}
            />
            {!value && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No image preview</p>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Enter a valid image URL. This will be used as the featured image for your post.
        </p>
      </div>
    </div>
  );
}
