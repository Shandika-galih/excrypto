import express from 'express';
import * as BankController from '../controllers/BankController.js'




const router = express.Router();

router.get('/banks', BankController.getBanks);
router.get('/bank/:uuid', BankController.getBankById);
router.post('/bank', BankController.createBank);
router.patch('/bank/:uuid', BankController.updateBank);
router.delete('bank/:uuid', BankController.deleteBank);


export default router;