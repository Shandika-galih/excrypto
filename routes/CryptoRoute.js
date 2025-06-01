import express from "express";
import * as cryptoController from "../controllers/cryptoController.js";

const router = express.Router();

router.get("/:network/balance/:address", cryptoController.balance);
router.post("/:network/send", cryptoController.send);

export default router;
