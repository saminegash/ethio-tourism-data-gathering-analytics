import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define locale settings
const locales = ["en", "am", "om"];
const defaultLocale = "en";

// Define role-based access paths - Single source of truth for route permissions
const roleBasedPaths = {
  admin: [
    "/dashboard",
    "/analytics",
    "/reports",
    "/data-management",
    "/users",
    "/settings",
    "/tourism-sites",
    "/tourists",
    "/visitor-analytics",
    "/revenue-analytics",
    "/accommodation",
    "/transport",
    "/surveys",
    "/export",
    "/system-admin",
    "/audit-logs",
  ],
  partner: [
    "/dashboard",
    "/analytics",
    "/reports",
    "/data-management",
    "/settings",
    "/tourism-sites",
    "/visitor-analytics",
    "/tourists",
    "/revenue-analytics",
    "/accommodation",
    "/transport",
    "/surveys",
    "/export",
  ],
  api_client: [
    "/dashboard",
    "/analytics",
    "/reports",
    "/data-management",
    "/settings",
    "/tourism-sites",
    "/visitor-analytics",
    "/accommodation",
    "/transport",
    "/surveys",
  ],
  viewer: ["/dashboard", "/analytics", "/reports", "/settings"],
};

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/about",
  "/contact",
  "/sprites",
  "/images",
  "/sounds",
  "/api",
  "/sitemap",
  "/sitemap.xml",
  "/robots.txt",
  "/favicon.ico",
];

// Routes that should always be accessible without locale prefix
const nonLocalizedRoutes = [
  "/",
  "/login",
  "/register",
  "/dashboard",
  "/analytics",
  "/reports",
  "/data-management",
  "/users",
  "/settings",
  "/tourism-sites",
  "/visitor-analytics",
  "/revenue-analytics",
  "/accommodation",
  "/transport",
  "/surveys",
  "/export",
  "/system-admin",
  "/audit-logs",
  "/upload",
  "/images",
  "/sprites",
  "/sounds",
  "/sitemap",
  "/sitemap.xml",
  "/robots.txt",
  "/favicon.ico",
];

// Helper function to check if a user has access to a path based on their role
function hasAccessToPath(role: string, pathname: string): boolean {
  const allowedPaths =
    roleBasedPaths[role as keyof typeof roleBasedPaths] || [];
  return allowedPaths.some((path) => pathname.startsWith(path));
}

// Helper function to get home page based on role
function getRoleHomePath(role: string): string {
  switch (role) {
    case "admin":
      return "/dashboard";
    case "partner":
      return "/dashboard";
    case "api_client":
      return "/dashboard";
    case "viewer":
      return "/dashboard";
    default:
      return "/dashboard"; // Default to dashboard instead of login to prevent loops
  }
}

// Check if path matches any in the path list
function pathMatches(pathname: string, pathList: string[]): boolean {
  return pathList.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
}

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // Skip middleware for API routes and sitemap
  if (
    pathname.startsWith("/api/") ||
    pathname === "/sitemap" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/favicon.ico"
  ) {
    return res;
  }

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          try {
            res.cookies.set({ name, value, ...options });
          } catch (error) {
            // Unable to set cookie
          }
        },
        remove(name, options) {
          try {
            res.cookies.set({ name, value: "", ...options, maxAge: 0 });
          } catch (error) {
            // Unable to remove cookie
          }
        },
      },
    }
  );

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Debug logging for login page
  if (pathname === "/login") {
    console.log("Middleware debug:", {
      pathname,
      hasUser: !!user,
      userId: user?.id,
      redirectParam: req.nextUrl.searchParams.get("redirect"),
    });
  }

  // ===== AUTHENTICATION CHECKS =====

  // Check if the route is public
  const isPublicRoute = pathMatches(pathname, publicRoutes);

  // Check for redirection loop prevention
  const potentiallyInRedirectLoop = req.cookies.get("redirect_count")?.value;
  let redirectCount = potentiallyInRedirectLoop
    ? parseInt(potentiallyInRedirectLoop)
    : 0;

  // If we detect too many redirects, allow the request to proceed to prevent loops
  if (redirectCount > 2) {
    console.log(
      "Too many redirects detected in middleware, allowing request to proceed"
    );
    res.cookies.set({
      name: "redirect_count",
      value: "0",
      maxAge: 5, // Reset after 5 seconds
    });
    return res;
  }

  // If user is not authenticated and trying to access a protected route
  if (!user && !isPublicRoute) {
    console.log(`Unauthenticated user accessing protected route: ${pathname}`);

    // Increment redirect count
    res.cookies.set({
      name: "redirect_count",
      value: (redirectCount + 1).toString(),
      maxAge: 15, // 15 seconds should be enough to detect loops
    });

    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated but accessing login page, redirect to their role's home page
  if (user && pathname === "/login") {
    console.log(
      "Authenticated user accessing login page, processing redirect..."
    );

    // Check if there's a redirect parameter
    const redirectUrl = req.nextUrl.searchParams.get("redirect");

    if (redirectUrl) {
      // If there's a redirect URL, check if user has access to it
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.log("Profile fetch error during redirect check:", error);
        // If we can't get profile, just redirect to dashboard to prevent loops
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      const role = profile?.role || "viewer";

      console.log("Checking access:", {
        redirectUrl,
        userRole: role,
        hasAccess: hasAccessToPath(role, redirectUrl),
      });

      // Check if user has access to the redirect URL
      if (hasAccessToPath(role, redirectUrl)) {
        console.log(
          `Middleware: Redirecting authenticated user to ${redirectUrl}`
        );
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      } else {
        // If no access to redirect URL, go to their role-appropriate dashboard
        const homePath = getRoleHomePath(role);
        console.log(
          `Middleware: User lacks access to ${redirectUrl}, redirecting to ${homePath}`
        );
        return NextResponse.redirect(new URL(homePath, req.url));
      }
    } else {
      // No redirect parameter, go to role-appropriate home page
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.log("Profile fetch error during login redirect:", error);
        // If we can't get profile, just redirect to dashboard to prevent loops
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      const role = profile?.role || "viewer";
      const homePath = getRoleHomePath(role);
      console.log(
        `Middleware: Redirecting authenticated user to home ${homePath}`
      );
      return NextResponse.redirect(new URL(homePath, req.url));
    }
  } else {
    // Reset redirect count on non-redirecting requests
    if (redirectCount > 0) {
      res.cookies.set({
        name: "redirect_count",
        value: "0",
        maxAge: 5,
      });
    }
  }

  // ===== ROLE-BASED ACCESS CHECKS =====

  // Only apply role checks for non-public routes that are not the home page
  if (user && !isPublicRoute && pathname !== "/") {
    // Get user role from profiles table
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error) {
      return res; // Continue without redirection if we can't determine role
    }

    const role = profile?.role || "viewer"; // Default to viewer role if not specified

    // Check if user has access to the current route
    if (!hasAccessToPath(role, pathname)) {
      // Instead of redirecting to login (which creates loops), redirect to their dashboard
      const homePath = getRoleHomePath(role);
      return NextResponse.redirect(new URL(homePath, req.url));
    }
  }

  // ===== LOCALE HANDLING =====

  // Check if the route already has a locale or is a non-localized route
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const isNonLocalizedRoute = pathMatches(pathname, nonLocalizedRoutes);

  // Skip locale handling if already has locale or is non-localized
  if (pathnameHasLocale || isNonLocalizedRoute) {
    return res;
  }

  // Determine locale, prioritizing cookie, then browser, then default
  const locale =
    req.cookies.get("NEXT_LOCALE")?.value ||
    req.headers.get("accept-language")?.split(",")[0].split("-")[0] ||
    defaultLocale;

  // Construct new URL with locale
  const newUrl = new URL(`/${locale}${pathname}`, req.url);
  return NextResponse.redirect(newUrl);
}

// Matcher for middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
