import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    category: { type: String },
    price: { type: Number },
    brand: { type: String },
    sizes: [{ type: Number }],
    colors: [{ type: String }],
    inStock: { type: Boolean },
    images: [{ type: String }],
    rating: { type: Number },
    reviewsCount: { type: Number },
    isFeatured: { type: Boolean },
    createdAt: { type: Date },
    sizeGuide: { type: String },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
