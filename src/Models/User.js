import mongoose from "mongoose";

const User = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  role: {
    type: String,
    enum: ["casher", "manager"],
    default: "manager",
  },
});

// Hash password before saving
User.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
Shop.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.user || mongoose.model("user", User);
