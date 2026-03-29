import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  password:      { type: String, required: true },
  monthlyBudget: { type: Number, default: 0 },
}, { timestamps: true });

UserSchema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = function (pwd: string) {
  return bcrypt.compare(pwd, this.password);
};

export default mongoose.model("User", UserSchema);