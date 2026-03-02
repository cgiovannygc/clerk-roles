import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/home(.*)",
  "/api/checkout(.*)",
  "/admin(.*)",
  "/store(.*)",
]);
const isAdminRoute = createRouteMatcher(["/admin/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // recogemos el id de usuario de auth usando await
  const { userId } = await auth();

  // verificamos si esta autenticado el usuario o si la ruta coincide con la lista previamente creada
  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
    // req.url se utiliza para construir la url completa, recoge desde donde se hace la peticion, ej. http://localhost:3000 y le añade el primer parametro, '/login'
  }
  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
    // req.url se utiliza para construir la url completa, recoge desde donde se hace la peticion, ej. http://localhost:3000 y le añade el primer parametro, '/login'
  }
  if (
    isAdminRoute(req) &&
    (await auth()).sessionClaims?.metadata?.role !== "admin"
  ) {
    // si intenta acceder a ruta de admin y no tiene el rol, lo direcciona al inicio
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
