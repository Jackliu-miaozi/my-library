"use client" // 声明这是一个客户端组件

// 导入必要的React相关依赖
import type React from "react" // 导入React类型定义
import { createContext, useContext } from "react" // 导入Context相关hooks
import { WagmiProvider } from "wagmi" // 导入wagmi的Provider组件
import { mainnet, sepolia, moonbaseAlpha, type Chain } from "wagmi/chains" // 导入支持的区块链网络
import { QueryClient, QueryClientProvider } from "@tanstack/react-query" // 导入数据查询相关组件
import { RainbowKitProvider, getDefaultConfig, darkTheme } from "@rainbow-me/rainbowkit" // 导入RainbowKit相关组件
import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi" // 导入wagmi的hooks
import { http } from "wagmi" // 导入HTTP传输层
import "@rainbow-me/rainbowkit/styles.css" // 导入RainbowKit样式

// 导入类型定义
import type { Web3ContextType, Web3ProviderProps } from "@/types/web3"

/**
 * Asset-Hub Westend Testnet 网络配置
 */
const assetHubWestendTestnet: Chain = {
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
const SUPPORTED_NETWORKS = {
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
const getCurrentNetworkInfo = (chainId: number) => {
  return SUPPORTED_NETWORKS[chainId as keyof typeof SUPPORTED_NETWORKS] || null // 根据chainId返回对应的网络信息，如果不存在返回null
}

/**
 * 获取WalletConnect项目ID
 */
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID // 从环境变量获取WalletConnect项目ID

// 检查项目ID是否存在
if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set in environment variables. Please add it to your .env.local file.")
}

/**
 * Wagmi配置
 * 创建wagmi默认配置，防止重复初始化
 */
const config = getDefaultConfig({ // 创建wagmi默认配置
  appName: "Library Management System", // 应用名称
  projectId: projectId, // WalletConnect项目ID
  chains: [ // 支持的链
    mainnet,
    sepolia,
    moonbaseAlpha,
    assetHubWestendTestnet,
  ],
  ssr: true, // 启用服务端渲染
  transports: { // 各链的传输层配置
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [moonbaseAlpha.id]: http(),
    [assetHubWestendTestnet.id]: http(),
  },
})

/**
 * React Query客户端
 */
const queryClient = new QueryClient({ // 创建React Query客户端实例
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 设置数据过期时间为1分钟
    },
  },
})



/**
 * 创建Web3上下文
 */
const Web3Context = createContext<Web3ContextType | undefined>(undefined) // 创建Web3Context

/**
 * Web3Hook - 提供Web3功能的内部组件
 */
function Web3Hook({ children }: { children: React.ReactNode }) {
  // 使用wagmi hooks获取必要的状态和方法
  const { address, isConnected } = useAccount() // 获取账户信息
  const chainId = useChainId() // 获取当前链ID
  const { connect, connectors } = useConnect() // 获取连接相关方法和连接器
  const { disconnect } = useDisconnect() // 获取断开连接方法
  const { switchChain } = useSwitchChain() // 获取切换链的方法

  // 计算派生状态
  const networkInfo = getCurrentNetworkInfo(chainId) // 获取当前网络信息
  const networkName = networkInfo?.name || `Chain ID: ${chainId}` // 获取网络名称
  const isNetworkSupported = networkInfo !== null // 判断网络是否受支持
  const isCorrectNetwork = chainId === 1287 // 判断是否是正确的网络（Moonbase Alpha）

  /**
   * 连接钱包
   */
  const connectWallet = () => {
    const injectedConnector = connectors.find(connector => connector.id === 'injected') // 查找注入式连接器
    if (injectedConnector) {
      connect({ connector: injectedConnector }) // 使用连接器连接钱包
    }
  }

  /**
   * 断开钱包连接
   */
  const disconnectWallet = () => {
    disconnect() // 断开钱包连接
  }

  /**
   * 切换网络
   * @param targetChainId - 目标链ID
   */
  const switchNetwork = async (targetChainId: number) => {
    try {
      switchChain({ chainId: targetChainId }) // 切换到目标网络
    } catch (error) {
      console.error("切换网络失败:", error)
      throw error
    }
  }

  // 创建context值
  const contextValue: Web3ContextType = {
    account: address,
    chainId,
    networkName,
    isConnected,
    isNetworkSupported,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    availableConnectors: []
  }

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  )
}



/**
 * Web3提供者组件
 * 提供Web3钱包连接、网络切换和状态管理功能
 */
export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}> {/* 提供wagmi配置 */}
      <QueryClientProvider client={queryClient}> {/* 提供React Query客户端 */}
        <RainbowKitProvider 
          theme={darkTheme()}
          showRecentTransactions={true}
          coolMode={true}
        > {/* 提供RainbowKit功能，启用暗色主题 */}
          <Web3Hook>
            {children}
          </Web3Hook>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

/**
 * 使用Web3上下文的Hook
 * @returns Web3上下文
 * @throws 如果在Web3Provider外部使用则抛出错误
 */
export function useWeb3() {
  const context = useContext(Web3Context) // 获取Web3Context
  if (context === undefined) {
    throw new Error("useWeb3必须在Web3Provider内部使用")
  }
  return context
}

// 导出网络配置和工具函数
export { SUPPORTED_NETWORKS, getCurrentNetworkInfo }