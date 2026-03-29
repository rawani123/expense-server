import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import expenseRoutes from "./routes/expenses";
import categoryRoutes from "./routes/categories";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use("/api/auth",       authRoutes);
app.use("/api/expenses",   expenseRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
