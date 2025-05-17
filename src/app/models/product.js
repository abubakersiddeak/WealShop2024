import mongoose from "mongoose";
const { Schema } = mongoose;
const categorySchema = new Schema(
  {
    gender: { type: String, required: true },
    type: { type: String, required: true },
    collection: { type: String, required: true },
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
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },

    category: { type: categorySchema, required: true },

    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },

    brand: { type: String, required: true },
    sizes: [{ type: String }],
    colors: [{ type: String }],

    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0, min: 0 },

    images: [{ type: String, required: true }],

    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    reviews: [reviewSchema],

    isFeatured: { type: Boolean, default: false },

    sku: { type: String, unique: true, sparse: true },
    tags: [{ type: String }],

    weight: { type: Number, min: 0 },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },

    shippingDetails: {
      freeShipping: { type: Boolean, default: false },
      shippingCost: { type: Number, min: 0 },
      estimatedDeliveryDays: { type: Number, min: 0 },
    },

    sizeGuide: { type: String },
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
