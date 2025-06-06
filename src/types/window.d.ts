/**
 * 全局 Window 接口类型声明
 * 覆盖第三方库的 ethereum 类型定义
 */

// 声明全局模块以覆盖第三方库的类型
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      // 添加其他可能需要的属性
      enable?: () => Promise<string[]>;
      selectedAddress?: string;
      networkVersion?: string;
      chainId?: string;
    };
  }
}

// 确保这个文件被视为模块
export {};