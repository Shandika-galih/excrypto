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

export async function getCryptoPrice(symbols = [], availableCoins = {}) {
  const invalidSymbols = symbols.filter((symbol) => !availableCoins[symbol]);
  if (invalidSymbols.length > 0) {
    throw {
      message: `Symbols not found: ${invalidSymbols.join(", ")}`,
      status: 404,
    };
  }
  const urlToFetch = symbols
    .filter((symbol) => availableCoins[symbol])
    .map((symbol) => ({
      symbol,
      url: availableCoins[symbol],
    }));

  try {
    
    const responses = await Promise.all(
      urlToFetch.map((item) => fetch(item.url))
    );

    
    responses.forEach((res, i) => {
      if (!res.ok) {
        throw {
          message: `Failed to fetch ${urlToFetch[i].url} - status ${res.status}`,
          status: res.status,
        };
      }
    });

    
    const jsonData = await Promise.all(responses.map((res) => res.json()));

    const result = {};
    jsonData.forEach((data, index) => {
      const symbol = urlToFetch[index].symbol;

      
      if (!data || !data.ticker) {
        throw {
          message: `No ticker data found for symbol ${symbol}`,
          status: 404,
        };
      }

      result[symbol] = data.ticker;
    });

    return result;
  } catch (error) {
    throw {
      message: error.message || "Failed to fetch crypto prices",
      status: error.status || 500,
    };
  }
}
