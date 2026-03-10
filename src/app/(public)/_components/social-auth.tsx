"use client";

import { useState } from "react";
import { authClient } from "@/shared/auth/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function SocialAuth() {
  const [loading, setLoading] = useState<"google" | null>(null);

  async function handleGoogleSignIn() {
    setLoading("google");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign in with Google";
      toast.error(message);
      setLoading(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <Button
        variant="outline"
        type="button"
        disabled={loading !== null}
        onClick={handleGoogleSignIn}
        className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-white transition-all duration-200"
      >
        {loading === "google" ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <svg
            className="mr-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            ></path>
          </svg>
        )}
        Continue with Google
      </Button>
    </div>
  );
}
