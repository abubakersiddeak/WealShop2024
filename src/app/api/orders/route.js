import { NextResponse } from "next/server";
import { connectMongodb } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";
import Product from "@/app/models/product";

export async function POST(request) {
  try {
    await connectMongodb();

    const requestBody = await request.json();
    const { orderData } = requestBody;

    // 🔍 Validation
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

    // 🔁 Prepare bulk operations
    const bulkOps = [];

    for (const item of orderData.items) {
      const { product_id, quantity, size } = item;

      if (!product_id || !size) {
        return NextResponse.json(
          {
            success: false,
            message: "Product ID or size missing in order item",
          },
          { status: 400 }
        );
      }

      const product = await Product.findById(product_id);
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product not found: ${product_id}` },
          { status: 404 }
        );
      }

      // ✅ Match size string with product.sizes array
      const sizeEntry = product.sizes.find((s) => s.size === size);
      if (!sizeEntry) {
        return NextResponse.json(
          {
            success: false,
            message: `Size '${size}' not found for product: ${product.name}`,
          },
          { status: 400 }
        );
      }

      // ✅ Check available stock
      if (sizeEntry.quantity < quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Not enough stock for product: ${product.name}, size: ${size}`,
          },
          { status: 400 }
        );
      }

      // ✅ Check overall quantity
      if (product.quantity < quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Not enough overall stock for product: ${product.name}`,
          },
          { status: 400 }
        );
      }

      // 🛠️ Prepare bulk update (size-based & overall quantity)
      bulkOps.push({
        updateOne: {
          filter: { _id: product_id, "sizes.size": size },
          update: {
            $inc: {
              "sizes.$.quantity": -quantity,
              quantity: -quantity,
            },
          },
        },
      });
    }

    // 💾 Apply stock changes in bulk
    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    // 🧾 Save the order
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
    console.error("❌ Error creating order:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
