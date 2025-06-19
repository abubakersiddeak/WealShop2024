import { NextResponse } from "next/server";
import { connectMongodb } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";
import Product from "@/app/models/product"; // ✅ Product মডেল import

export async function POST(request) {
  try {
    await connectMongodb();

    const requestBody = await request.json();
    const { orderData } = requestBody;

    // ✅ ফর্ম ভ্যালিডেশন
    if (
      typeof orderData.amount !== "number" ||
      !orderData.customer?.name ||
      !orderData.customer?.phone ||
      !orderData.shipping?.address ||
      !Array.isArray(orderData.items) ||
      orderData.items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing or invalid fields: amount, customer.name, customer.phone, shipping.address, or items",
        },
        { status: 400 }
      );
    }

    // ✅ প্রতিটি পণ্যের স্টক হালনাগাদ করা
    for (const item of orderData.items) {
      const productId = item.product_id;

      if (!productId) {
        return NextResponse.json(
          { success: false, message: "Product ID is missing in order item" },
          { status: 400 }
        );
      }

      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product not found: ${productId}` },
          { status: 404 }
        );
      }

      // ✅ চেক করো যথেষ্ট স্টক আছে কিনা
      if (product.quantity < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Not enough stock for product: ${product.name}`,
          },
          { status: 400 }
        );
      }

      // ✅ স্টক কমাও
      product.quantity -= item.quantity;
      await product.save();
    }

    // ✅ অর্ডার সংরক্ষণ
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        order: savedOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
