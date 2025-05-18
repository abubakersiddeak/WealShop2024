import { connectMongodb } from "@/app/lib/mongodb";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    // category, sizes, colors যদি string হয়, তাহলে parse করো
    const category =
      typeof body.category === "string"
        ? JSON.parse(body.category)
        : body.category;

    const sizes =
      typeof body.sizes === "string" ? JSON.parse(body.sizes) : body.sizes;

    const colors =
      typeof body.colors === "string" ? JSON.parse(body.colors) : body.colors;

    await connectMongodb();

    const newProduct = await Product.create({
      name: body.name,
      slug: body.slug,
      description: body.description,
      category,
      price: body.price,
      discountPrice: body.discountPrice,
      brand: body.brand,
      sizes,
      colors,
      inStock: body.inStock,
      quantity: body.quantity,
      images: body.images,
      rating: body.rating,
      reviewsCount: body.reviewsCount,
      isFeatured: body.isFeatured,
      sku: body.sku,
      tags: body.tags,
      weight: body.weight,
      dimensions: body.dimensions,
      shippingDetails: body.shippingDetails,
      sizeGuide: body.sizeGuide,
    });

    return NextResponse.json(
      { message: "✅ Product saved successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error posting product:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { message: "Validation error", errors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Duplicate field value", error: error.keyValue },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to post product", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectMongodb();
  const products = await Product.find().sort({ createdAt: -1 }); // sort by newest first
  return NextResponse.json({ products });
}
