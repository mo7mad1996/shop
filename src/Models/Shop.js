import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const ShopSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
    },
    expired: Date,
    logo: String,
    name: String,
    address: String,
    currency: String,
    phone: String,
    tiktok: String,
    twitter: String,
    cr: String,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
ShopSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

// Method to compare password
ShopSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

export default mongoose.models.Shop || mongoose.model("Shop", ShopSchema);
