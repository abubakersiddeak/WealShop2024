import { connectMongodb } from "@/app/lib/mongodb";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json(); // Next.js automatically parses the JSON body

    // FIX: Removed unnecessary JSON.parse calls.
    // The 'body' object received from 'await request.json()' is already parsed.
    // category will be an object, sizes will be an array.

    await connectMongodb();

    const newProduct = await Product.create({
      name: body.name,
      description: body.description,
      category: body.category, // Use directly
      salePrice: body.salePrice,

      buyPrice: body.buyPrice, // Pass this field
      brand: body.brand,
      sizes: body.sizes, // Use directly
      sizeGuide: body.sizeGuide,
      inStock: body.inStock,
      quantity: body.quantity,
      images: body.images,
      isFeatured: body.isFeatured, // Pass this field

      visibility: body.visibility, // Pass this field
      adminNote: body.adminNote, // Pass this field
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
        { status: 400 } // Use 400 for client-side errors (Bad Request)
      );
    }

    if (error.code === 11000) {
      // MongoDB duplicate key error code
      return NextResponse.json(
        {
          message: "Duplicate field value or unique constraint violation.",
          error: error.keyValue,
        },
        { status: 409 } // Use 409 Conflict for duplicate resource
      );
    }

    return NextResponse.json(
      { message: "Failed to post product", error: error.message },
      { status: 500 } // Use 500 for server-side errors
    );
  }
}

export async function GET() {
  try {
    await connectMongodb();
    const products = await Product.find().sort({ createdAt: -1 }); // sort by newest first
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}
