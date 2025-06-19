import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },

    customer: {
      name: { type: String, default: null },
      email: { type: String, default: null },
      phone: { type: String, default: null },
    },

    shipping: {
      address: { type: String, default: null },
      city: { type: String, default: null },
      postal_code: { type: String, default: null },
      country: { type: String, default: "Bangladesh" },
    },

    items: [
      {
        product_id: String,
        name: String,
        quantity: Number,
        salePrice: Number,
        size: String,
        buyPrice: {
          type: Number,
          default: null,
        },
      },
    ],
    status: {
      type: String,
      enum: ["VALID", "PROCESSING", "DELIVERED"], // ঐ তিনটি স্ট্যাটাস সাপোর্ট করবে
      default: "VALID",
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Safe model declaration with optional chaining
const Order = mongoose.models?.Order || mongoose.model("Order", OrderSchema);

export default Order;
