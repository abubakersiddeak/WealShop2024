import { connectMongodb } from "@/app/lib/mongodb";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      name,
      description,
      category,
      price,
      brand,
      sizes,
      colors,
      inStock,
      images,
      rating,
      reviewsCount,
      isFeatured,
      sizeGuide,
    } = await request.json();

    await connectMongodb();

    const newProduct = await Product.create({
      name,
      description,
      category,
      price,
      brand,
      sizes,
      colors,
      inStock,
      images,
      rating,
      reviewsCount,
      isFeatured,
      sizeGuide,
    });

    return NextResponse.json(
      { message: "✅ Product saved successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error posting product:", error);
    return NextResponse.json(
      { message: "Failed to post product", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectMongodb();
  const products = await Product.find();
  return NextResponse.json({ products });
}
