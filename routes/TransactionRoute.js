import express from 'express';
import {
    getTransactions, 
    getTransactionById, 
    createTransaction, 
    deleteTransaction, 
    updateTransaction,
    getMyTransactions,
    verifyPayment,
    calculateAdminFee
} from '../controllers/TransactionController.js';



const router = express.Router();

router.get('/transactions', getTransactions);
router.get('/transaction/:id', getTransactionById);
router.post('/transaction', createTransaction);
router.patch('/transaction/:id', updateTransaction);
router.delete('/transaction/:id', deleteTransaction);
router.get('/my-transactions', getMyTransactions);
router.post('/verify-payment', verifyPayment);
router.get('/transaction/calculate-admin-fee/:transactionId', calculateAdminFee);


export default router;