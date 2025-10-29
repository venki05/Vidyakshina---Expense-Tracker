import express from "express";
import Expense from "./common/expense.js";
import cors from 'cors';



const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
// Add a new expense
app.post("/api/expenses", async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all expenses (with filters)
app.get("/api/expenses", async (req, res) => {
  try {
    const { category, startDate, endDate, minAmount, maxAmount } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single expense by ID
app.get("/api/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an expense
app.put("/api/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an expense
app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Summary by Category
app.get("/api/expenses/summary/category", async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      { $group: { _id: "$category", totalSpent: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { totalSpent: -1 } }
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Monthly Summary
app.get("/api/expenses/summary/monthly", async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      { $group: { _id: { $month: "$date" }, totalSpent: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } }
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
