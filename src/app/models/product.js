import mongoose from "mongoose";
const { Schema } = mongoose;

const sizeSchema = new Schema(
  {
    size: { type: String, required: true },
    quantity: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);
const categorySchema = new Schema(
  {
    gender: { type: String, required: true },
    type: { type: String, required: true },
    scollection: { type: String, required: true },
  },
  { _id: false }
);

const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User রেফারেন্স
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    description: { type: String },

    category: { type: categorySchema, required: true },

    salePrice: { type: Number, required: true, min: 0 },
    buyPrice: { type: Number, min: 0 },

    brand: { type: String },
    sizes: [sizeSchema],

    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0, min: 0 },

    images: [{ type: String, required: true }],

    sizeGuide: {
      chest: { type: String },
      length: { type: String },
      waist: { type: String },
      shoulder: { type: String },
      sleeve: { type: String },
    },
    visibility: {
      type: String,
      enum: ["public", "private", "archived"],
      default: "public",
    },
    adminNote: { type: String },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
