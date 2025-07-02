// models/Expense.js

import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  { note: String, amount: Number, category: String },
  { timeseries: true }
);

export default mongoose.models.Expense ||
  mongoose.model("Expense", expenseSchema);
