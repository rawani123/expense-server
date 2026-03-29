import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Expense from "../models/Expense";

export const getExpenses = async (req: AuthRequest, res: Response) => {
  const { from, to, category } = req.query;
  const filter: any = { user: req.userId };
  if (from || to) filter.date = {};
  if (from) filter.date.$gte = new Date(from as string);
  if (to)   filter.date.$lte = new Date(to as string);
  if (category) filter.category = category;
  const expenses = await Expense.find(filter).sort({ date: -1 });
  res.json(expenses);
};

export const createExpense = async (req: AuthRequest, res: Response) => {
  const { amount, description, category, date } = req.body;
  const expense = await Expense.create({
    user: req.userId, amount, description, category,
    date: date || new Date(), createdAt: new Date(),
  });
  res.status(201).json(expense);
};

export const updateExpense = async (req: AuthRequest, res: Response) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body, { new: true }
  );
  if (!expense) return res.status(404).json({ message: "Not found" });
  res.json(expense);
};

export const deleteExpense = async (req: AuthRequest, res: Response) => {
  await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ message: "Deleted" });
};

export const getSummary = async (req: AuthRequest, res: Response) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const summary = await Expense.aggregate([
    { $match: { user: req.userId, date: { $gte: startOfMonth } } },
    { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ]);
  const total = summary.reduce((a, b) => a + b.total, 0);
  res.json({ total, byCategory: summary });
};