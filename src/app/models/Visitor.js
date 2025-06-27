import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    url: { type: String, required: true },
    userAgent: { type: String, required: true },
    visitedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Visitor ||
  mongoose.model("Visitor", visitorSchema);
