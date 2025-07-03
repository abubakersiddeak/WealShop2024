import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    note: String,
    amount: Number,
    category: String,
  },
  {
    timestamps: true,
  }
);

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
