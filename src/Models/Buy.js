import mongoose from "mongoose";

const BuySchema = new mongoose.Schema(
  {
    items: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        total: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
        selected_unit: { type: Number, default: 0 },
      },
    ],
    notes: { type: String },
    total: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Buy || mongoose.model("Buy", BuySchema);
