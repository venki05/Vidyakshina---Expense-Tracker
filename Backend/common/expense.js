import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: {
    type: String,
    enum: ["Food", "Transport", "Bills", "Entertainment", "Health", "Other"],
    default: "Other"
  },
  date: { type: Date, default: Date.now },
  description: { type: String }
});

export default mongoose.model("Expense", expenseSchema);
