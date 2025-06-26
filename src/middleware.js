import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyToken } from "./app/lib/auth";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  try {
    verifyToken(token);

    return NextResponse.next();
  } catch (err) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Apply middleware to specific paths
export const config = {
  matcher: ["/dashboard"],
};
