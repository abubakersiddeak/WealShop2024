import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    invoiceId: String,
    name: String,
    email: String,
    address: String,
    phone: String,
    city: String,
    postcode: String,
    totalAmount: Number,
    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        price: Number,
        quantity: Number,
        size: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
