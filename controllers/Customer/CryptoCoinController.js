import db from "../../config/Database.js";
import CryptoCoinNetwork from "../../models/CryptoCoinNetwork.js";
import CryptoCoin from "../../models/CryptoCoin.js";
import axios from "axios";

export const getCryptoCoin = async (req, res) => {
  try {
    const coins = await CryptoCoinNetwork.findAll({
      where: {
        status: "active",
      },
      attributes: ["id", "uuid", "name", "kode", "admin_fee", "logo", "status"],
      include: {
        model: CryptoCoin,
        attributes: [
          "id",
          "uuid",
          "name",
          "kode",
          "admin_fee",
          "logo",
          "wss_indodax_price_code",
          "api_indodax_price_code",
        ],
      },
    });

    if (coins.length > 0) {
      for (const coin of coins) {
        try {
          const url = `https://indodax.com/api/${coin?.CryptoCoin?.kode}_idr/ticker`;
          const priceResponse = await axios.get(url);

          coin.CryptoCoin.price = priceResponse?.data?.ticker?.last;
        } catch (error) {
          console.error(`Failed to fetch price for ${coin?.CryptoCoin?.kode}`);
        }
      }
    }
    res.status(200).json({
      data: coins.map((coin) => ({
        ...coin.toJSON(),
        CryptoCoin: {
          ...coin.CryptoCoin?.toJSON(),
          price: coin.CryptoCoin?.price || null,
        },
      })),
    });
  } catch (error) {
    res.status(error.status || 500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};
