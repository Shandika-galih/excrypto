import express from "express";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  getMyTransactions,
  verifyPayment,
  calculateAdminFee,
  getTransactionsAdmin,
} from "../controllers/TransactionController.js";
import { auth, admin } from "../middleware/AuthUser.js";
const router = express.Router();

router.get("/transactions", getTransactions);
router.get("/transaction/:id", getTransactionById);
router.post("/transaction", createTransaction);
router.patch("/transaction/:id", updateTransaction);
router.delete("/transaction/:id", deleteTransaction);
router.get("/my-transactions", auth, getMyTransactions);
router.post("/verify-payment", verifyPayment);
router.get(
  "/transaction/calculate-admin-fee/:transactionId",
  calculateAdminFee
);
router.get("/admin/transactions", auth, admin, getTransactionsAdmin);
export default router;
