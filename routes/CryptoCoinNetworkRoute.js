import express from 'express';
import multer from 'multer';

import {createCryptoCoinNetwork, deleteCryptoCoinNetworkById, getCryptoCoinNetworks, getCryptoCoinNetwork, updateCryptoCoinNetwork} from '../controllers/CryptoCoinNetworkController.js';



const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads');
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
})
const router = express.Router();

const upload = multer({storage});


router.post('/crypto-coin/network', upload.single('logo'), createCryptoCoinNetwork);
router.get('/crypto-coin/networks', getCryptoCoinNetworks);
router.get('/network/:uuid', getCryptoCoinNetwork);
router.delete('/crypto-coin/network/:uuid', deleteCryptoCoinNetworkById);
router.patch('/crypto-coin/network/:uuid', upload.single('logo'), updateCryptoCoinNetwork);



export default router;