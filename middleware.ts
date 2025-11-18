import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/signup");
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Check admin role for admin pages
    if (isAdminPage && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/signup");

        // Allow access to auth pages regardless of auth status
        if (isAuthPage) {
          return true;
        }

        // Require auth for protected routes
        return !!token;
      },
    },
  }
);

// Specify which routes should be protected
export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/wishlist/:path*",
    "/login",
    "/signup",
  ],
};
