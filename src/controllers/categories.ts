import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Category from "../models/Category";

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await Category.find({ user: req.userId });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, color, icon } = req.body;
    const category = await Category.create({ user: req.userId, name, color, icon });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    await Category.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};