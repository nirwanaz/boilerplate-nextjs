"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("idle");
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/marketing/subscribers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, source: "footer" }),
        });

        if (res.ok) {
          setStatus("success");
          setEmail("");
          setMessage("Thanks for subscribing! 🚀");
        } else {
          const data = await res.json();
          setStatus("error");
          setMessage(data.error || "Something went wrong.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Failed to connect. Please try again.");
      }
    });
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium animate-in fade-in slide-in-from-bottom-1">
        <CheckCircle2 className="h-4 w-4" />
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative group">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-violet-500/50 pr-24"
        />
        <Button
          type="submit"
          disabled={isPending}
          size="sm"
          className="absolute right-1 top-1 bottom-1 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all"
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            "Join"
          )}
        </Button>
      </div>
      {status === "error" && (
        <p className="text-xs text-rose-400 font-medium">{message}</p>
      )}
      <p className="text-[10px] text-slate-600">
        By joining, you agree to our Privacy Policy and Terms of Service.
      </p>
    </form>
  );
}
