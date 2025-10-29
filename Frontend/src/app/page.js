"use client";
import { useState, useEffect } from "react";
import styles from "./styles/table.module.css";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "" });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:5000/api/expenses";

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Fetch on page load
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ title: "", amount: "", category: "" });
    setEditingId(null);
    fetchExpenses();
  };

  // Delete expense
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchExpenses();
  };

  // Edit expense
  const handleEdit = (exp) => {
    setForm(exp);
    setEditingId(exp._id);
  };

  // Summary
  const getSummary = () => {
    const summary = {};
    expenses.forEach((e) => {
      summary[e.category] = (summary[e.category] || 0) + e.amount;
    });
    return summary;
  };

  const summary = getSummary();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Expense Tracker</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingId ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      <h2 className={styles.subtitle}>All Expenses</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id}>
              <td>{exp.title}</td>
              <td>₹{exp.amount}</td>
              <td>{exp.category}</td>
              <td>
                <button onClick={() => handleEdit(exp)}>✏️</button>
                <button onClick={() => handleDelete(exp._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className={styles.subtitle}>Summary by Category</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(summary).map((cat) => (
            <tr key={cat}>
              <td>{cat}</td>
              <td>₹{summary[cat]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
