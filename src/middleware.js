import axios from "axios";
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (!/^(?!\/_).*/.test(pathname)) return;
  if (/^(\/trueemit)/.test(pathname)) return;
  if (/^(\/api)/.test(pathname)) return;
  return isValid(req);
}

async function isValid(req) {
  try {
    const { data } = await axios.get(
      new URL("/api/trueemit/isValid", req.nextUrl.origin)
    );

    if (data.redirect)
      return NextResponse.redirect(new URL(data.path, req.url));
    else return NextResponse.next();
  } catch (err) {
    console.error(err);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth/* (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
