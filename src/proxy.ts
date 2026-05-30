import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Next.js 16 renamed the `middleware` convention to `proxy` (Node.js runtime).
// Clerk's clerkMiddleware() returns a standard middleware handler, so it slots
// straight in as the default export here. It runs for every matched request,
// attaching auth context that auth()/currentUser() read on the server.

// Only /account requires a signed-in user. Everything else (home, pricing,
// the API routes that gate themselves) stays public.
const isProtectedRoute = createRouteMatcher(["/account(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next internals and static files unless found in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
    // Clerk's auto-proxy path for the Frontend API.
    "/__clerk/(.*)",
  ],
};
