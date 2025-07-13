import { getAllNetworkBalances } from "../services/BalanceService.js";

export const getMyBalances = async (req, res) => {
  try {
    const walletAddress = process.env.SENDER_WALLET_ADDRESS; // Atau dari DB
    const balances = await getAllNetworkBalances(walletAddress);
    res.status(200).json({ data: balances });
  } catch (err) {
    res.status(500).json({ msg: "Gagal ambil balance", error: err.message });
  }
};
