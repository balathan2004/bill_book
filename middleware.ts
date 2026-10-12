import { NextRequest, NextResponse } from "next/server";


export function middleware(req: NextRequest) {
  const client = req.cookies.get("bill_book_token")?.value || false;

  console.log({ client });

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }


  if ((pathname == "/home" || pathname == "/account") && !client) {
    return NextResponse.redirect(new URL("/", req.url));
  }



  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/account", "/"],
};





