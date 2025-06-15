import express from "express";
import { getChatHistory } from "../controllers/ChatController.js";
const router = express.Router();

router.get("/history/:roomId", getChatHistory);

export default router;
