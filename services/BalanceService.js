import { ethers } from "ethers";
import CryptoCoinNetwork from "../models/CryptoCoinNetwork.js";

export const getAllNetworkBalances = async (walletAddress) => {
  const networks = await CryptoCoinNetwork.findAll();

  const balances = await Promise.all(
    networks.map(async (network) => {
      try {
        const provider = new ethers.JsonRpcProvider(network.rpc_url);
        const balanceBigInt = await provider.getBalance(walletAddress);
        const balance = ethers.formatEther(balanceBigInt);
        return {
          network: network.name,
          chainId: network.chain_id,
          symbol: network.kode,
          balance,
        };
      } catch (err) {
        return {
          network: network.name,
          error: err.message,
        };
      }
    })
  );

  return balances;
};
