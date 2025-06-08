import { createConfig } from "wagmi"
import { mainnet, sepolia, moonbaseAlpha, type Chain } from "wagmi/chains"
import { QueryClient } from "@tanstack/react-query"
import { http } from "wagmi"
import { injected, metaMask, coinbaseWallet } from "wagmi/connectors"

/**
 * Asset-Hub Westend Testnet 网络配置
 */
export const assetHubWestendTestnet: Chain = {
  id: 420420421,
  name: 'Asset‑Hub Westend Testnet',
  nativeCurrency: {
    name: 'Westend DOT',
    symbol: 'WND',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://westend-asset-hub-eth-rpc.polkadot.io'],
    },
    public: {
      http: ['https://westend-asset-hub-eth-rpc.polkadot.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout-asset-hub.parity-chains-scw.parity.io',
    },
    blockscout: {
      name: 'Blockscout',
      url: 'https://blockscout-asset-hub.parity-chains-scw.parity.io',
    },
  },
  testnet: true,
}

/**
 * 支持的网络配置
 */
export const SUPPORTED_NETWORKS = {
  1: { // Ethereum主网配置
    name: "Ethereum Mainnet",
    symbol: "ETH",
    decimals: 18,
    explorer: "https://etherscan.io"
  },
  11155111: { // Sepolia测试网配置
    name: "Sepolia Testnet",
    symbol: "ETH",
    decimals: 18,
    explorer: "https://sepolia.etherscan.io"
  },
  1287: { // Moonbase Alpha测试网配置
    name: "Moonbase Alpha",
    symbol: "DEV",
    decimals: 18,
    explorer: "https://moonbase.moonscan.io"
  },
  420420421: { // Asset-Hub Westend测试网配置
    name: "Asset‑Hub Westend Testnet",
    symbol: "WND",
    decimals: 18,
    explorer: "https://blockscout-asset-hub.parity-chains-scw.parity.io"
  }
}

/**
 * 获取当前网络信息
 * @param chainId - 链ID
 * @returns 网络信息或null
 */
export const getCurrentNetworkInfo = (chainId: number) => {
  return SUPPORTED_NETWORKS[chainId as keyof typeof SUPPORTED_NETWORKS] || null // 根据chainId返回对应的网络信息，如果不存在返回null
}

/**
 * Wagmi配置 - 不使用WalletConnect
 * 仅使用本地钱包连接器，避免WalletConnect相关错误
 */
export const wagmiConfig = createConfig({
  chains: [ // 支持的链
    mainnet,
    sepolia,
    moonbaseAlpha,
    assetHubWestendTestnet,
  ],
  connectors: [ // 连接器配置 - 仅使用本地钱包
    injected(), // 注入式钱包（如MetaMask、Trust Wallet等）
    metaMask(), // MetaMask专用连接器
    coinbaseWallet({ // Coinbase Wallet连接器
      appName: "Library Management System",
    }),
  ],
  transports: { // 各链的传输层配置
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [moonbaseAlpha.id]: http(),
    [assetHubWestendTestnet.id]: http(),
  },
  ssr: true, // 启用服务端渲染
})

/**
 * React Query客户端
 */
export const queryClient = new QueryClient({ // 创建React Query客户端实例
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 设置数据过期时间为1分钟
    },
  },
})