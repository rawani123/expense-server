import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
  user:  { type: Schema.Types.ObjectId, ref: "User", required: true },
  name:  { type: String, required: true },
  color: { type: String, default: "#6366f1" },
  icon:  { type: String, default: "tag" },
}, { timestamps: true });

export default mongoose.model("Category", CategorySchema);