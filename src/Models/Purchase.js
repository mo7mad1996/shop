import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
  {
    items: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        total: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
        selected_unit: { type: Number, default: 0 },
      },
    ],
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    total: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Purchase ||
  mongoose.model("Purchase", PurchaseSchema);
