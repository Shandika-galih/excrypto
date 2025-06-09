import express from "express";
import * as cryptoController from "../controllers/CryptoController.js";
import * as cryptoCoinController from '../controllers/CryptoCoinController.js';

const router = express.Router();

router.get("/:network/balance/:address", cryptoController.balance);
router.post("/:network/send", cryptoController.send);
router.get("/crypto/tickers", cryptoCoinController.getCryptoTicker);

export default router;
