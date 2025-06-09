import express from 'express';
import * as PaymentMethodController from '../controllers/PaymentMethodController.js';


const router = express.Router();

router.post('/payment-method', PaymentMethodController.createPaymentMethod);
router.get('/payment-method/:uuid', PaymentMethodController.getPaymentMethodById);
router.get('/payment-methods', PaymentMethodController.getPaymentMethods);
router.patch('/payment-method/:uuid', PaymentMethodController.updatePaymentMethod);
router.delete('/payment-method/:uuid', PaymentMethodController.deletePaymentMethod);


export default router;