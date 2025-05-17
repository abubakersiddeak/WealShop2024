import { connectMongodb } from "@/app/lib/mongodb";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectMongodb();
    const category = params.id;

    // URL থেকে ক্যাটাগরি কুয়েরি নাও
    const { searchParams } = new URL(request.url);

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // ক্যাটাগরি অনুযায়ী প্রোডাক্ট খুঁজে বের করো
    const products = await Product.find({
      "category.collection": `${category}`,
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}
