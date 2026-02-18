import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const auth = req.cookies.get("auth")?.value;
  const onb = req.cookies.get("onb")?.value; // "1" when onboarding complete
  const { pathname, search } = req.nextUrl;

  const isAuth = Boolean(auth);
  const isLogin = pathname === "/login";
  const isSignup = pathname === "/signup";

  if (!isAuth) {
    const protectedPaths = [
      "/dashboard",
      "/simulate",
      "/ai-planner",
      "/settings",
      "/decision",
      "/onboarding",
    ];
    if (protectedPaths.some((p) => pathname.startsWith(p))) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = new URLSearchParams({ from: pathname + search }).toString();
      return NextResponse.redirect(url);
    }
  } else {
    if ((isLogin || isSignup) && onb === "1") {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/simulate/:path*",
    "/ai-planner/:path*",
    "/settings/:path*",
    "/decision/:path*",
    "/onboarding/:path*",
    "/login",
    "/signup",
  ],
};

