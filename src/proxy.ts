import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Session check
  // Note: Better Auth middleware proxy logic
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch (e) {
    // Session check failed, continue as unauthenticated
  }

  // 2. Auth Protection logic
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtectedRoute = 
    pathname.startsWith("/admin") || 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/settings") ||
    pathname.startsWith("/posts") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/checkout");

  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
