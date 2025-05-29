import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    tran_id: { type: String, required: true, unique: true },
    val_id: { type: String, required: true },
    amount: { type: Number, required: true },
    store_amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["VALID", "FAILED", "PENDING"],
      default: "PENDING",
    },
    card_type: { type: String, default: null },
    card_no: { type: String, default: null },
    card_issuer: { type: String, default: null },
    tran_date: { type: Date, required: true },
    currency: { type: String, default: "BDT" },

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

    payment_status: {
      type: String,
      enum: ["PAID", "UNPAID", "REFUNDED"],
      default: "UNPAID",
    },

    invoice_number: { type: String, unique: true, sparse: true },

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
  },
  {
    timestamps: true,
  }
);

// ✅ Safe model declaration with optional chaining
const Order = mongoose.models?.Order || mongoose.model("Order", OrderSchema);

export default Order;
