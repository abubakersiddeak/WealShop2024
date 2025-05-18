import { connectMongodb } from "@/app/lib/mongodb";
import Product from "@/app/models/product";

export async function GET(req) {
  await connectMongodb();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return Response.json({ products: [] });
  }

  const regex = new RegExp(query, "i"); // case-insensitive search
  const products = await Product.find({ name: regex }).select(
    "name slug images price"
  );

  return Response.json({ products });
}
