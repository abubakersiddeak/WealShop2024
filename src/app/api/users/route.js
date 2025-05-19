// src/app/api/users/route.js
import { connectMongodb } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectMongodb();

  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return new Response(
      JSON.stringify({ message: "All fields are required" }),
      {
        status: 400,
      }
    );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "Email already registered" }),
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
