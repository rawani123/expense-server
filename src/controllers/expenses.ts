import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Expense from "../models/Expense";
import mongoose from "mongoose";

export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const { from, to, category } = req.query;
    const filter: any = { user: req.userId };
    if (from || to) filter.date = {};
    if (from) filter.date.$gte = new Date(from as string);
    if (to)   filter.date.$lte = new Date(to as string);
    if (category) filter.category = category;
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, description, category, date } = req.body;

    // Parse date carefully — store as proper Date object
    const expenseDate = date ? new Date(date) : new Date();

    console.log("Creating expense with date:", expenseDate, "raw date input:", date);

    const expense = await Expense.create({
      user: req.userId,
      amount,
      description,
      category,
      date: expenseDate,
      createdAt: new Date(),
    });
    res.status(201).json(expense);
  } catch (err) {
    console.error("Create expense error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateExpense = async (req: AuthRequest, res: Response) => {
  try {
    const updateData = { ...req.body };
    if (updateData.date) updateData.date = new Date(updateData.date);

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updateData,
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: "Not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getSummary = async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const summary = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
    ]);

    const total = summary.reduce((a: number, b: any) => a + b.total, 0);
    res.json({ total, byCategory: summary });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};