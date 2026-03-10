"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2 } from "lucide-react";

interface ContentField {
  section: string;
  key: string;
  value: string;
  label: string;
  type: "text" | "textarea";
}

const defaultFields: ContentField[] = [
  // Hero
  { section: "hero", key: "badge_text", value: "", label: "Badge Text", type: "text" },
  { section: "hero", key: "title_line1", value: "", label: "Heading Line 1", type: "text" },
  { section: "hero", key: "title_line2", value: "", label: "Heading Line 2 (Gradient)", type: "text" },
  { section: "hero", key: "subtitle", value: "", label: "Subtitle", type: "textarea" },
  { section: "hero", key: "cta_primary", value: "", label: "Primary CTA Text", type: "text" },
  { section: "hero", key: "cta_secondary", value: "", label: "Secondary CTA Text", type: "text" },
  { section: "hero", key: "social_proof", value: "", label: "Social Proof Text", type: "text" },
  // Features
  { section: "features", key: "title", value: "", label: "Section Title", type: "text" },
  { section: "features", key: "subtitle", value: "", label: "Section Subtitle", type: "textarea" },
  // Showcase
  { section: "showcase", key: "title", value: "", label: "Section Title", type: "text" },
  { section: "showcase", key: "subtitle", value: "", label: "Section Subtitle", type: "textarea" },
  // How It Works
  { section: "how_it_works", key: "title", value: "", label: "Section Title", type: "text" },
  { section: "how_it_works", key: "subtitle", value: "", label: "Section Subtitle", type: "textarea" },
  // CTA
  { section: "cta", key: "title", value: "", label: "CTA Heading", type: "text" },
  { section: "cta", key: "subtitle", value: "", label: "CTA Subtitle", type: "textarea" },
  { section: "cta", key: "button_text", value: "", label: "CTA Button Text", type: "text" },
];

interface LandingEditorProps {
  initialContent: { section: string; key: string; value: string }[];
}

export default function LandingEditor({ initialContent }: LandingEditorProps) {
  const [fields, setFields] = useState<ContentField[]>(() => {
    return defaultFields.map((field) => {
      const existing = initialContent.find(
        (c) => c.section === field.section && c.key === field.key
      );
      return { ...field, value: existing?.value ?? field.value };
    });
  });

  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const updateField = (section: string, key: string, value: string) => {
    setFields((prev) =>
      prev.map((f) =>
        f.section === section && f.key === key ? { ...f, value } : f
      )
    );
    setSaved(false);
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await fetch("/api/admin/marketing/landing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          fields.map((f) => ({
            section: f.section,
            key: f.key,
            value: f.value,
            sortOrder: 0,
          }))
        ),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    });
  };

  const sections = [
    { id: "hero", title: "🚀 Hero Section", description: "Main banner content" },
    { id: "features", title: "⚡ Features Section", description: "Feature grid header" },
    { id: "showcase", title: "🎯 Showcase Section", description: "Interactive showcase header" },
    { id: "how_it_works", title: "📋 How It Works", description: "Process steps header" },
    { id: "cta", title: "🎉 Call to Action", description: "Bottom CTA section" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Landing Page Content</h1>
          <p className="text-muted-foreground mt-1">
            Edit your landing page text content. Changes go live immediately.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saved ? "Saved ✓" : "Save All Changes"}
        </Button>
      </div>

      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle className="text-lg">{section.title}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields
              .filter((f) => f.section === section.id)
              .map((field) => (
                <div key={`${field.section}-${field.key}`} className="space-y-2">
                  <Label htmlFor={`${field.section}-${field.key}`}>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={`${field.section}-${field.key}`}
                      value={field.value}
                      onChange={(e) => updateField(field.section, field.key, e.target.value)}
                      rows={3}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  ) : (
                    <Input
                      id={`${field.section}-${field.key}`}
                      value={field.value}
                      onChange={(e) => updateField(field.section, field.key, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
