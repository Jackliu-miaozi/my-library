"use client";

// 导入必要的React相关依赖
import type React from "react"; // 导入React类型定义
import { createContext, useContext, useMemo, useCallback } from "react"; // 导入Context相关hooks
import { WagmiProvider } from "wagmi"; // 导入wagmi的Provider组件
import { QueryClientProvider } from "@tanstack/react-query"; // 导入数据查询相关组件
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi"; // 导入wagmi的hooks
// 导入类型定义
import type { Web3ContextType, Web3ProviderProps } from "@/types/web3";
// 导入wagmi配置
import {
  wagmiConfig,
  queryClient,
  getCurrentNetworkInfo,
} from "@/lib/wagmi-config";

/**
 * 创建Web3上下文
 */
const Web3Context = createContext<Web3ContextType | undefined>(undefined); // 创建Web3Context

/**
 * Web3Hook - 提供Web3功能的内部组件
 */
function Web3Hook({ children }: { children: React.ReactNode }) {
  // 使用wagmi hooks获取必要的状态和方法
  const { address, isConnected } = useAccount(); // 获取账户信息
  const chainId = useChainId(); // 获取当前链ID
  const { connect, connectors } = useConnect(); // 获取连接相关方法和连接器
  const { disconnect } = useDisconnect(); // 获取断开连接方法
  const { switchChain } = useSwitchChain(); // 获取切换链的方法

  // 计算派生状态
  const networkInfo = getCurrentNetworkInfo(chainId); // 获取当前网络信息
  const networkName = networkInfo?.name || `Chain ID: ${chainId}`; // 获取网络名称
  const isNetworkSupported = networkInfo !== null; // 判断网络是否受支持
  const isCorrectNetwork = chainId === 1287; // 判断是否是正确的网络（Moonbase Alpha）
  const availableConnectors = connectors.map((connector) => connector.name); // 获取可用连接器名称列表

  /**
   * 连接钱包
   * @param walletType - 钱包类型（可选）
   */
  const connectWallet = useCallback(
    (walletType?: string) => {
      // 调试：打印所有可用连接器的信息
      console.log(
        "可用连接器:",
        connectors.map((c) => ({
          id: c.id,
          name: c.name,
          type: c.type,
        })),
      );
      console.log("请求的钱包类型:", walletType);

      let targetConnector;

      if (walletType) {
        // 根据钱包类型选择对应的连接器
        switch (walletType) {
          case "metamask":
            targetConnector = connectors.find(
              (connector) =>
                connector.id === "metaMask" ||
                connector.id === "io.metamask" ||
                connector.name?.toLowerCase().includes("metamask"),
            );
            break;
          case "coinbase":
            targetConnector = connectors.find(
              (connector) =>
                connector.id === "coinbaseWallet" ||
                connector.id === "coinbaseWalletSDK" ||
                connector.name?.toLowerCase().includes("coinbase"),
            );
            break;
          case "walletconnect":
            // 注意：当前配置中没有WalletConnect，回退到注入式
            targetConnector = connectors.find(
              (connector) => connector.id === "injected",
            );
            break;
          case "injected":
          default:
            targetConnector = connectors.find(
              (connector) => connector.id === "injected",
            );
            break;
        }
      }

      console.log(
        "找到的目标连接器:",
        targetConnector
          ? {
              id: targetConnector.id,
              name: targetConnector.name,
              type: targetConnector.type,
            }
          : null,
      );

      // 如果没有找到指定的连接器，使用默认策略
      if (!targetConnector) {
        // 优先尝试注入式连接器
        targetConnector = connectors.find(
          (connector) => connector.id === "injected",
        );

        // 如果没有注入式连接器，使用第一个可用的连接器
        if (!targetConnector && connectors.length > 0) {
          targetConnector = connectors[0];
        }

        console.log(
          "使用默认连接器:",
          targetConnector
            ? {
                id: targetConnector.id,
                name: targetConnector.name,
                type: targetConnector.type,
              }
            : null,
        );
      }

      if (targetConnector) {
        console.log("正在连接钱包:", targetConnector.name);
        connect({ connector: targetConnector });
      } else {
        console.warn("没有可用的钱包连接器");
      }
    },
    [connect, connectors],
  );

  /**
   * 断开钱包连接
   */
  const disconnectWallet = useCallback(() => {
    disconnect(); // 断开钱包连接
  }, [disconnect]);

  /**
   * 切换网络
   * @param targetChainId - 目标链ID
   */
  const switchNetwork = useCallback(
    async (targetChainId: number) => {
      try {
        console.log("正在切换到网络:", targetChainId);
        switchChain({ chainId: targetChainId }); // 切换到目标网络
        console.log("网络切换成功");
      } catch (error) {
        console.error("切换网络失败:", error);
        throw error;
      }
    },
    [switchChain],
  );

  // 使用useMemo优化context值，避免不必要的重新渲染
  const contextValue: Web3ContextType = useMemo(
    () => ({
      account: address,
      chainId,
      networkName,
      isConnected,
      isNetworkSupported,
      isCorrectNetwork,
      connectWallet,
      disconnectWallet,
      switchNetwork,
      availableConnectors,
    }),
    [
      address,
      chainId,
      networkName,
      isConnected,
      isNetworkSupported,
      isCorrectNetwork,
      connectWallet,
      disconnectWallet,
      switchNetwork,
      availableConnectors,
    ],
  );

  return (
    <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
  );
}

/**
 * Web3提供者组件 - 不使用WalletConnect
 * 提供Web3钱包连接、网络切换和状态管理功能
 * 仅使用本地钱包连接器，避免WalletConnect相关问题
 */
export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      {" "}
      {/* 提供wagmi配置 */}
      <QueryClientProvider client={queryClient}>
        {" "}
        {/* 提供React Query客户端 */}
        <Web3Hook>{children}</Web3Hook>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

/**
 * 使用Web3上下文的Hook
 * @returns Web3上下文
 * @throws 如果在Web3Provider外部使用则抛出错误
 */
export function useWeb3() {
  const context = useContext(Web3Context); // 获取Web3Context
  if (context === undefined) {
    throw new Error("useWeb3必须在Web3Provider内部使用");
  }
  return context;
}

// 网络配置和工具函数已从 @/lib/wagmi-config 导入
