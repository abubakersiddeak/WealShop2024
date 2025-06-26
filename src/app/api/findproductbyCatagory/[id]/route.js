import { connectMongodb } from "@/app/lib/mongodb";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectMongodb();
    const category = await params.id;

    const { searchParams } = new URL(request.url);

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    const products = await Product.find({
      "category.scollection": `${category}`,
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}
