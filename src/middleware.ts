import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import path from "path";
// import {default} from "next-auth/middleware";
/**
 *

 */

// This function can be marked `async` if using `await` inside

// this is middleware function whic will run when we hit the matcher routes/paths
export async function middleware(request: NextRequest) {
   // 1 : we get user path where it is
   const pathname = request.nextUrl.pathname;

   const isPublicPath =
      pathname.startsWith("/verify") ||
      pathname.startsWith("/login-in") ||
      pathname.startsWith("/sign-up") ||
      pathname == "/";

   // 2 : get token to make sure user is authenticated and it can access the protected routes but not public routes
   // here we get the token using next-auth method
   const token = await getToken({ req: request });

   // 3 : if user is authenticated and trying to access public path then redirect to home page
   if (token && isPublicPath) {
      return NextResponse.redirect(new URL("/dashbaord", request.url));
   }

   // 4 : if user is not authenticated and trying to access protected path then redirect to login page
   if (!token && !isPublicPath) {
      return NextResponse.redirect(new URL("/sign-up", request.url));
   }
}

// here we need to add the paths that we want to protect so middleware can run before the request reaches the page
export const config = {
   matcher: ["/", "/dashboard/:path*", "/verify/:path*", "/sign-up", "/login-in"],
};
