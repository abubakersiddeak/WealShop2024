import { NextResponse } from "next/server";
import { connectMongodb } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";
import Product from "@/app/models/product";

export async function POST(request) {
  try {
    await connectMongodb();

    const requestBody = await request.json();
    let { orderData } = requestBody; // Use 'let' so we can modify orderData

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

    // 🔁 Prepare bulk operations and transform orderData.items for schema compatibility
    const bulkOps = [];
    const transformedOrderItems = []; // New array to hold items with string 'size'

    for (const item of orderData.items) {
      const { product_id, quantity } = item;

      // Robustly extract the size string from the item.size for stock update logic
      const itemSizeValue =
        typeof item.size === "object" && item.size !== null
          ? item.size.size // If it's an object, get the 'size' property
          : item.size; // Otherwise, use it directly (it should already be a string)

      // Basic validation for critical item fields
      if (
        !product_id ||
        !itemSizeValue ||
        typeof quantity !== "number" ||
        quantity <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid product_id, size, or quantity in order item",
            item: item, // Include the problematic item for debugging
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

      // ✅ Match size string with product.sizes array for stock checks
      const sizeEntry = product.sizes.find((s) => s.size === itemSizeValue);
      if (!sizeEntry) {
        return NextResponse.json(
          {
            success: false,
            message: `Size '${itemSizeValue}' not found for product: ${product.name}`,
          },
          { status: 400 }
        );
      }

      // ✅ Check available stock for the specific size
      if (sizeEntry.quantity < quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Not enough stock for product: ${product.name}, size: ${itemSizeValue}. Available: ${sizeEntry.quantity}, Requested: ${quantity}`,
          },
          { status: 400 }
        );
      }

      // ✅ Check overall product quantity (this is a redundant check if all sizes are managed,
      // but kept for existing logic; ensure 'quantity' field on product document is accurate)
      if (product.quantity < quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Not enough overall stock for product: ${product.name}. Available: ${product.quantity}, Requested: ${quantity}`,
          },
          { status: 400 }
        );
      }

      // 🛠️ Prepare bulk update (size-based & overall quantity) for products collection
      bulkOps.push({
        updateOne: {
          filter: { _id: product_id, "sizes.size": itemSizeValue },
          update: {
            $inc: {
              "sizes.$.quantity": -quantity,
              quantity: -quantity,
            },
          },
        },
      });

      // 🔄 Prepare item for Order schema (ensure 'size' is a string)
      transformedOrderItems.push({
        ...item, // Copy all existing properties
        size: itemSizeValue, // OVERWRITE 'size' with the string value
      });
    }

    // 💾 Apply stock changes in bulk
    if (bulkOps.length > 0) {
      const bulkResult = await Product.bulkWrite(bulkOps);
    }

    // 🧾 Create the new order with transformed items
    // IMPORTANT: Assign the transformed items array back to orderData before saving
    orderData = { ...orderData, items: transformedOrderItems };
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
    // Provide a more specific error message if it's a known issue
    let errorMessage = "Server error";
    if (error.name === "ValidationError") {
      errorMessage = `Validation Error: ${error.message}`;
    } else if (error.code === 11000) {
      errorMessage =
        "Duplicate key error: A record with this unique identifier already exists.";
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
