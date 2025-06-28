import { NextResponse } from "next/server";
import { verifyToken } from "./app/lib/auth";

export async function middleware(request) {
  const { pathname, origin } = request.nextUrl;

  // 🔐 শুধু `/dashboard` রুটে authentication চেক করো
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      verifyToken(token);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ✅ dashboard ছাড়া অন্য সব রুটে visitor track করো
  const ip = request.headers.get("x-forwarded-for") || "Unknown";
  const url = pathname;
  const userAgent = request.headers.get("user-agent") || "Unknown";

  try {
    await fetch(`${origin}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip, url, userAgent }),
    });
  } catch (err) {
    console.error("Visitor log fetch error:", err.message);
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/dashboard", "/"],
};
