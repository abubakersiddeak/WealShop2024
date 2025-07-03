import mongoose from "mongoose";

const extraProfitSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ExtraProfit =
  mongoose.models.ExtraProfit ||
  mongoose.model("ExtraProfit", extraProfitSchema);
export default ExtraProfit;
