import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["casher", "manager"],
      default: "manager",
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});
// Hash password before update
UserSchema.pre("findOneAndUpdate", async function (next) {
  const salt = await bcryptjs.genSalt(10);
  this._update.password = await bcryptjs.hash(this._update.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

UserSchema.methods.login = async function () {
  this.lastLogin = Date.now();
  await this.save();
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
