import express from 'express';
import {
    getProducts, 
    getProductById, 
    createProduct, 
    deleteProduct, 
    updateProduct
} from '../controllers/Products.js'



const router = express.Router();

router.get('/products', getProducts);
router.get('/product/:id', getProductById);
router.post('/products', createProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);


export default router;