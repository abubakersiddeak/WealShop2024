import { connectMongodb } from "@/app/lib/mongodb";
import Product from "@/app/models/product";

export async function GET(request) {
  await connectMongodb();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    const related = await Product.find({
      "category.scollection": category,
    });

    return new Response(JSON.stringify(related), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch related products" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
