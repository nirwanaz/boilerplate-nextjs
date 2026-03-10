"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm font-medium">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-white transition-colors flex items-center"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;
          const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

          // Skip "dashboard" if it's the first segment to avoid duplicates with the home icon
          if (segment === "dashboard" && index === 0) return null;

          return (
            <li key={href} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-slate-600" />
              {isLast ? (
                <span className="text-white font-semibold truncate max-w-[150px] sm:max-w-none">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="text-slate-400 hover:text-white transition-colors truncate max-w-[100px] sm:max-w-none"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
