import express from "express";
import { getMyBalances } from "../controllers/BalanceController.js";
import { admin } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/balances", admin, getMyBalances);

export default router;
