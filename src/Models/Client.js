import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    name: String,
    debt: Number,
    start_debt: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Client || mongoose.model("Client", ClientSchema);
