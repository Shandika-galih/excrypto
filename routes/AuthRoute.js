import express from "express";
const router = express.Router();

import { Login, Logout, Me } from "../controllers/Auth.js";
import {
  requestVerificationEmail,
  verifyToken,
  resetPassword,
} from "../controllers/AuthController.js";

// 🔐 Auth routes
router.get("/me", Me);
router.post("/login", Login);
router.delete("/logout", Logout);

// 📧 Email verification & reset password
router.post("/auth/send-verification", requestVerificationEmail);
router.post("/auth/verify-token", verifyToken);
router.post("/auth/reset-password", resetPassword);

export default router;
