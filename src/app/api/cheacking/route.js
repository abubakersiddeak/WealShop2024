import { connectMongodb } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/app/lib/auth";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400 }
      );
    }

    await connectMongodb();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    const token = generateToken(user);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true, // client side থেকে JS অ্যাক্সেস পাবে না (সিকিউরিটি বাড়ে)
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // ১ ঘন্টা
      sameSite: "lax",
    });

    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
