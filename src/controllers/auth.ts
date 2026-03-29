import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

const userPayload = (user: any) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  monthlyBudget: user.monthlyBudget || 0,
});

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: signToken(user._id.toString()), user: userPayload(user) });
  } catch { res.status(500).json({ message: "Server error" }); }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await (user as any).comparePassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    res.json({ token: signToken(user._id.toString()), user: userPayload(user) });
  } catch { res.status(500).json({ message: "Server error" }); }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(userPayload(user));
  } catch { res.status(500).json({ message: "Server error" }); }
};

export const updateBudget = async (req: AuthRequest, res: Response) => {
  try {
    const { monthlyBudget } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { monthlyBudget },
      { new: true }
    ).select("-password");
    res.json(userPayload(user));
  } catch { res.status(500).json({ message: "Server error" }); }
};