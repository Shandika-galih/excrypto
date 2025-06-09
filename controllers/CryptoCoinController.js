import { getCryptoPrice } from "../services/cryptoService.js";
import {
  deleteCryptoCoin,
  getCryptoCoinById,
  saveCryptoCoin,
} from "../services/CryptoCoinService.js";
import CryptoCoin from "../models/CryptoCoin.js";
import fs from "fs/promises";
import { error } from "console";

const availableCoins = {
  bnb: "https://indodax.com/api/bnb_idr/ticker",
  eth: "https://indodax.com/api/eth_idr/ticker",
  pol: "https://indodax.com/api/pol_idr/ticker",
};

export async function getCryptoTicker(req, res) {
  const symbols = req.query.symbols?.split(",") || [];

  try {
    const data = await getCryptoPrice(symbols, availableCoins);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: error.message || "Internal Server error",
    });
  }
}

export const getCryptoCoins = async (req, res) => {
  try {
    const response = await CryptoCoin.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status || 500).json({ msg: error.message });
  }
};

export const getCryptoCoin = async (req, res) => {
  try {
    const data = await getCryptoCoinById(req.params.uuid);
    res.status(200).json(data);
  } catch (error) {
    res.status(error.status).json({ msg: error.message });
  }
};
export const deleteCryptoCoinById = async (req, res) => {
  try{
    const {uuid} = req.params;
    const coin = await getCryptoCoinById(uuid);

    if(!coin){
      return res.status(404).json({msg : 'Crypto Coin Not Found'});

    }


    if(coin.logo){
      try{
        await fs.unlink(coin.logo);

      }catch(error){
         throw new Error(`Failed to delete logo file: ${error.message}`);

      }
    }

    await deleteCryptoCoin(uuid);
    res.status(200).json({
      msg: 'Crpto coin deleted successfully'
    });

  }catch(error){
    res.status(500).json({msg : "Error deleting crypto coin :", error: error.message});
  }
};

export const createCryptoCoin = async (req, res) => {
  try {
    const { name, kode, admin_fee, coid_id } = req.body;
    const file = req.file;

    console.log(file);

    if (!file) {
      return res.status(400).json({ message: "Logo file is required" });
    }

    const logoPath = file.path;
    const newCoin = await saveCryptoCoin({ name, kode, admin_fee, logoPath, coid_id});
    res.status(200).json({
      msg: "Crypto coin created",
      data: newCoin,
    });
  } catch (error) {
    res.status(error.status || 500).json({ msg: error.message });
  }
};

export const updateCryptoCoin = async (req, res) => {
  try{
    const {uuid} = req.params;
    // return res.status(200).json({msg : "test",data: req.body});
    const {name, kode, admin_fee} = req.body;
    console.log("body :", req.body);
    const file = req.file;

    

    const coin = await getCryptoCoinById(uuid);
    if(!coin){
      return res.status(404).json({msg : 'Crypto coin not found'});
    }

    let warning = null;

    if(file){
      if(coin.logo){
        try{
          await fs.unlink(coin.logo);

        }catch(err){
          warning = `Failed to delete logo file: ${err.message}`;
        }
      }
      coin.logo = file.path;
    }

    coin.name = name ?? coin.name;
    coin.kode = kode ?? coin.kode;
    coin.admin_fee = admin_fee ?? coin.admin_fee;

    await coin.save();

    res.status(200).json({
      msg : 'Crypto coin updated successfully',
      data: coin,
      ...(warning && {warning})

    })


  }catch(err){
    res.status(err.status || 500).json({msg : 'Server error', error : err.message});

  }
}