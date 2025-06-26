import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  // Delete the token cookie
  cookieStore.set({
    name: "token",
    value: "", // value খালি করে দাও
    path: "/",
    maxAge: 0, // expire করে দাও
  });

  return new Response(JSON.stringify({ message: "Logout successful" }), {
    status: 200,
  });
}
