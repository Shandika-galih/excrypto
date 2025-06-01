import {
  JsonRpcProvider,
  Wallet,
  isAddress,
  formatEther,
  parseEther,
} from "ethers";
import networks from "../config/networks.js";

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("PRIVATE_KEY not set");
}

function getProvider(networkKey) {
  const network = networks[networkKey];
  if (!network) throw new Error(`Network '${networkKey}' not supported`);
  if (!network.rpcUrl)
    throw new Error(`RPC URL for network '${networkKey}' is not set`);
  return new JsonRpcProvider(network.rpcUrl);
}

function getWallet(networkKey) {
  const provider = getProvider(networkKey);
  return new Wallet(privateKey, provider);
}

export async function getBalance(networkKey, address) {
  if (!isAddress(address)) throw new Error("Invalid Ethereum address");
  const provider = getProvider(networkKey);
  const balanceWei = await provider.getBalance(address);
  return formatEther(balanceWei);
}

export async function sendTransaction(networkKey, toAddress, amount) {
  if (!isAddress(toAddress)) throw new Error("Invalid recipient address");
  if (isNaN(amount) || Number(amount) <= 0) throw new Error("Invalid amount");

  const wallet = getWallet(networkKey);
  const tx = {
    to: toAddress,
    value: parseEther(amount),
  };

  const txResponse = await wallet.sendTransaction(tx);
  await txResponse.wait();

  return txResponse.hash;
}
