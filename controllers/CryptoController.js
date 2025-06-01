import * as cryptoService from "../services/CryptoService.js";

export async function balance(req, res) {
  try {
    const { network } = req.params; // ambil network dari route param
    const { address } = req.params;
    const balance = await cryptoService.getBalance(network, address);
    res.json({ network, address, balance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function send(req, res) {
  try {
    const { network } = req.params;
    const { toAddress, amount } = req.body;
    const txHash = await cryptoService.sendTransaction(
      network,
      toAddress,
      amount
    );
    res.json({ network, message: "Transaction sent!", txHash });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
