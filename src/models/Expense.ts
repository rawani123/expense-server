import mongoose, { Schema } from "mongoose";

const ExpenseSchema = new Schema({
  user:        { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount:      { type: Number, required: true },
  description: { type: String, required: true },
  category:    { type: String, required: true },
  date:        { type: Date, default: Date.now },
  createdAt:   { type: Date, default: Date.now },
});

export default mongoose.model("Expense", ExpenseSchema);