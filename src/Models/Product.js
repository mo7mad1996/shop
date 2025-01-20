import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    unit: { type: Number, default: 0 },
    store: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 9999 },
    purchase_price: Number,
    selling_price: Number,
    barcode: { type: String, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
