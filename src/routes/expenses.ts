import { Router } from "express";
import { getExpenses, createExpense, updateExpense, deleteExpense, getSummary } from "../controllers/expenses";
import { protect } from "../middleware/auth";

const router = Router();

router.use(protect);
router.get("/summary", getSummary);
router.get("/", getExpenses);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;