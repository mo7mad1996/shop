import mongoose from "mongoose";

const DebtSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    amount: { type: Number, default: 0 },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Debt || mongoose.model("Debt", DebtSchema);
