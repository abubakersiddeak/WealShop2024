import { connectMongodb } from "@/app/lib/mongodb";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
function getCloudinaryPublicId(url) {
  try {
    const parts = url.split("/");
    const fileWithExt = parts[parts.length - 1];
    const publicId = fileWithExt.split(".")[0];
    return publicId;
  } catch (error) {
    return null;
  }
}
export async function GET(request, { params }) {
  await connectMongodb();

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await connectMongodb();

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Cloudinary থেকে ছবি ডিলিট
    if (deletedProduct.images && deletedProduct.images.length > 0) {
      for (const imageUrl of deletedProduct.images) {
        const publicId = getCloudinaryPublicId(imageUrl);
        if (publicId) {
          const result = await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    return NextResponse.json(
      {
        message: "Product and images deleted successfully",
        product: deletedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await connectMongodb();

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true, // updated document return করবে
      runValidators: true, // model validation enforce করবে
    });

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
