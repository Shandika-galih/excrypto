import express from 'express';
import { getProfile } from '../../controllers/Customer/ProfilController.js';
import { admin, auth } from "../../middleware/AuthUser.js";


const router = express.Router();

router.get('/customer/profile', auth,getProfile);


export default router;