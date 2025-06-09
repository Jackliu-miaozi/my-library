/**
 * Web3 相关类型定义
 */

import { type ReactNode } from "react";

/**
 * Web3上下文类型定义
 * 定义了 Web3 上下文中所有可用的状态和方法
 */
export interface Web3ContextType {
  /** 当前账户地址 */
  account: string | undefined;
  /** 当前链ID */
  chainId: number | undefined;
  /** 当前网络名称 */
  networkName: string | null;
  /** 是否已连接钱包 */
  isConnected: boolean;
  /** 当前网络是否受支持 */
  isNetworkSupported: boolean;
  /** 是否是正确的网络 */
  isCorrectNetwork: boolean;
  /** 连接钱包方法，支持指定钱包类型 */
  connectWallet: (walletType?: string) => void;
  /** 断开钱包连接方法 */
  disconnectWallet: () => void;
  /** 切换网络方法 */
  switchNetwork: (chainId: number) => Promise<void>;
  /** 可用的连接器列表 */
  availableConnectors: string[];
}

/**
 * Web3Provider组件属性
 * 定义了 Web3Provider 组件接受的 props
 */
export interface Web3ProviderProps {
  /** 子组件 */
  children: ReactNode;
}

/**
 * 钱包类型枚举
 * 定义支持的钱包类型
 */
export type WalletType = "metamask" | "coinbase" | "walletconnect" | "injected";

/**
 * 网络配置类型
 * 定义网络配置的结构
 */
export interface NetworkConfig {
  /** 网络ID */
  id: number;
  /** 网络名称 */
  name: string;
  /** 网络的原生代币符号 */
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  /** RPC URL列表 */
  rpcUrls: {
    default: {
      http: string[];
    };
  };
  /** 区块浏览器URL列表 */
  blockExplorers?: {
    default: {
      name: string;
      url: string;
    };
  };
}
