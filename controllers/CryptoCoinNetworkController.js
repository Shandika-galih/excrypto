import {
  deleteCryptoCoinNetwork,
  getCryptoCoinNetworkById,
  saveCryptoCoinNetwork,
  getCryptoCoinNetworksService,
} from "../services/CryptoCoinNetworkService.js";
import fs from "fs/promises";

/* export const getCryptoCoinNetworks = async (req, res) => {
  try {
    const response = await getCryptoCoinNetworkService();
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status || 500).json({ msg: error.message });
  }
}; */

export const getCryptoCoinNetwork = async (req, res) => {
  try {
    const data = await getCryptoCoinNetworkById(req.params.uuid);
    res.status(200).json(data);
  } catch (error) {
    res.status(error.status).json({ msg: error.message });
  }
};
export const deleteCryptoCoinNetworkById = async (req, res) => {
  try {
    const { uuid } = req.params;
    const coin = await getCryptoCoinNetworkById(uuid);

    if (!coin) {
      return res.status(404).json({ msg: "Crypto Coin Not Found" });
    }
    if (coin.logo) {
      try {
        await fs.unlink(coin.logo);
      } catch (error) {
        throw new Error(`Failed to delete logo file: ${error.message}`);
      }
    }

    await deleteCryptoCoinNetwork(uuid);
    res.status(200).json({
      msg: "Crypto coin network deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error deleting crypto coin :", error: error.message });
  }
};

export const createCryptoCoinNetwork = async (req, res) => {
  try {
    // return res.status(201).json({
    //   msg: "Crypto coin network created successfully",
    //   data: req.body,
    // });
    const {
      name,
      kode,
      admin_fee,
      rpc_url,
      status,
      chain_id,
      coin_network_id,
    } = req.body;
    const file = req.file;

    let logoPath = null;
    if (file) {
      logoPath = file.path;
    }

    const newCoin = await saveCryptoCoinNetwork(
      name,
      kode,
      admin_fee,
      logoPath,
      rpc_url,
      status,
      chain_id,
      coin_network_id
    );
    res.status(201).json({
      msg: "Crypto coin network created successfully",
      data: newCoin,
    });
  } catch (error) {
    res.status(error.status || 500).json({ msg: error.message });
  }
};

export const updateCryptoCoinNetwork = async (req, res) => {
  try {
    const { uuid } = req.params;
    // return res.status(200).json({msg : "test",data: req.body});
    const { name, kode, admin_fee, rpc_url, status, chain_id, coin_id } =
      req.body;
    console.log("body :", req.body);
    const file = req.file;
    const coin = await getCryptoCoinNetworkById(uuid);
    if (!coin) {
      return res.status(404).json({ msg: "Crypto coin network not found" });
    }

    let warning = null;

    if (file) {
      if (coin.logo) {
        try {
          await fs.unlink(coin.logo);
        } catch (err) {
          warning = `Failed to delete logo file: ${err.message}`;
        }
      }
      coin.logo = file.path;
    }

    coin.name = name ?? coin.name;
    coin.kode = kode ?? coin.kode;
    coin.admin_fee = admin_fee ?? coin.admin_fee;
    coin.rpc_url = rpc_url ?? coin.rpc_url;
    coin.status = status ?? coin.status;
    coin.chain_id = chain_id ?? coin.chain_id;
    coin.coin_id = coin_id ?? coin.coin_id;

    await coin.save();

    res.status(200).json({
      msg: "Crypto coin network updated successfully",
      data: coin,
      ...(warning && { warning }),
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ msg: "Server error", error: err.message });
  }
};

export const getCryptoCoinNetworks = async (req, res) => {
  try {
    const result = await getCryptoCoinNetworksService(req.query); // Memanggil service dengan parameter query

    res.status(200).json(result); // Mengirimkan hasil response
  } catch (error) {
    console.error("Error fetching crypto coin networks:", error.message);
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};
