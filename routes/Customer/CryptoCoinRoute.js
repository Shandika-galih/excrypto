import * as CustomerCryptoCoinController from '../../controllers/Customer/CryptoCoinController.js';
import express from 'express';

const router = express.Router();

router.get('/customer/cryptocoins', CustomerCryptoCoinController.getCryptoCoin);


export default router;