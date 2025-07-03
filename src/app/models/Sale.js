import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productName: String,
    size: String,
    quantity: Number,
    salePrice: Number,
    paidAmount: Number,
    totalAmount: Number,
    dueAmount: Number,
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    }, // এখানে যোগ করো
  },
  { timestamps: true }
);

export default mongoose.models.Sale || mongoose.model("Sale", saleSchema);
