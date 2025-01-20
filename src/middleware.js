import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (!/^(?!\/_).*/.test(pathname)) return;
  if (/^(\/trueemit)/.test(pathname)) return;
  if (/^(\/api)/.test(pathname)) return;
  if (/^(\/login)/.test(pathname)) return;
  return isValid(req);
}

async function isValid(req) {
  try {
    const { data } = await axios.get(
      new URL("/api/trueemit/isValid", req.nextUrl.origin)
    );

    if (data.redirect)
      return NextResponse.redirect(new URL(data.path, req.url));
    else return auth(req);
  } catch (err) {
    console.error(err.message);
  }
}

async function auth(req) {
  try {
    const getCookies = await cookies();
    const token = getCookies.get("token")?.value;

    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    else return redirect(req, token);
  } catch (err) {
    console.error(err);
  }
}

async function redirect(req, token) {
  try {
    const res = await axios.get(new URL("/api/user", req.nextUrl.origin), {
      headers: { token },
    });

    const { user, shop } = res?.data;

    if (user) {
      const homepage = `/${user.role}`;
      let res = null;
      if (req.nextUrl.pathname.startsWith(homepage)) {
        res = NextResponse.next();
      } else {
        res = NextResponse.redirect(new URL(homepage, req.url));
      }

      res.headers.set("user", encodeURIComponent(JSON.stringify(user)));
      res.headers.set("shop", encodeURIComponent(JSON.stringify(shop)));

      return res;
    }
    return NextResponse.redirect(new URL("/login", req.url));
  } catch (err) {
    console.error(err);
    console.error(1);
  }
}

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - api/*
//      * - _next
//      * - favicon.ico (favicon file)
//      * - public folder
//      */
//     "/((?!api|_next|favicon.ico|public).*)",
//   ],
// };
