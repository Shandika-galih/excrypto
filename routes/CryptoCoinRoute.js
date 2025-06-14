import express from "express";
import multer from "multer";
import path from "path";
import { auth, admin } from "../middleware/AuthUser.js";

import {
  createCryptoCoin,
  deleteCryptoCoinById,
  getCryptoCoin,
  getCryptoCoins,
  updateCryptoCoin,
} from "../controllers/CryptoCoinController.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const router = express.Router();

const upload = multer({ storage });

router.post("/cryptocoin", upload.single("logo"), createCryptoCoin);
router.get("/cryptocoins", auth, admin, getCryptoCoins);
router.get("/cryptocoin/:uuid", getCryptoCoin);
router.delete("/cryptocoin/:uuid", deleteCryptoCoinById);
router.patch("/cryptocoin/:uuid", upload.single("logo"), updateCryptoCoin);

export default router;
