const networks = {
  eth_sepolia: {
    name: "Sepolia Testnet",
    rpcUrl: process.env.INFURA_SEPOLIA_URL,
    chainId: 11155111,
  },
  eth_mainnet: {
    name: "Ethereum Mainnet",
    rpcUrl: process.env.INFURA_MAINNET_URL,
    chainId: 1,
  },
  scroll_mainnet: {
    name: "Scroll Mainnet",
    rpcUrl: process.env.SCROLL_MAINNET_RPC,
    chainId: 534353,
  },
  scroll_testnet: {
    name: "Scroll Testnet (Alpha)",
    rpcUrl: process.env.SCROLL_TESTNET_RPC,
    chainId: 534352,
  },
  base_mainnet: {
    name: "Base Mainnet",
    rpcUrl: process.env.BASE_MAINNET_RPC,
    chainId: 8453,
  },
  base_testnet: {
    name: "Base Testnet (Goerli)",
    rpcUrl: process.env.BASE_TESTNET_RPC,
    chainId: 84531,
  },
  optimism_mainnet: {
    name: "Optimism Mainnet",
    rpcUrl: process.env.OPTIMISM_MAINNET_RPC,
    chainId: 10,
  },
  optimism_testnet: {
    name: "Optimism Testnet (Goerli)",
    rpcUrl: process.env.OPTIMISM_TESTNET_RPC,
    chainId: 420,
  },
  arbitrum_mainnet: {
    name: "Arbitrum One Mainnet",
    rpcUrl: process.env.ARBITRUM_MAINNET_RPC,
    chainId: 42161,
  },
  arbitrum_testnet: {
    name: "Arbitrum Goerli Testnet",
    rpcUrl: process.env.ARBITRUM_TESTNET_RPC,
    chainId: 421613,
  },
  polygon_mainnet: {
    name: "Polygon Mainnet",
    rpcUrl: process.env.POLYGON_MAINNET_RPC,
    chainId: 137,
  },
  polygon_testnet: {
    name: "Polygon Mumbai Testnet",
    rpcUrl: process.env.POLYGON_TESTNET_RPC,
    chainId: 80001,
  },
  linea_testnet: {
    name: "Linea Testnet (Goerli)",
    rpcUrl: process.env.LINEA_TESTNET_RPC,
    chainId: 59140,
  },
  bsc_mainnet: {
    name: "Binance Smart Chain Mainnet",
    rpcUrl: process.env.BSC_MAINNET_RPC,
    chainId: 56,
  },
  bsc_testnet: {
    name: "Binance Smart Chain Testnet",
    rpcUrl: process.env.BSC_TESTNET_RPC,
    chainId: 97,
  },
};

export default networks;
