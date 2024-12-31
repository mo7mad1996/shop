import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Shop = new mongoose.Schema({
  password: String,
  expired: Date,
  logo: String,
  name: String,
  address: String,
  phone: String,
  tiktok: String,
  twitter: String,
  cr: String,
});

// Hash password before saving
Shop.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
Shop.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.shop || mongoose.model("shop", Shop);
