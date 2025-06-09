/**
 * 主题相关类型定义
 */

import { type ReactNode } from "react";

/**
 * 主题类型
 * 定义应用支持的主题模式
 */
export type Theme = "dark" | "light" | "system";

/**
 * ThemeProvider 组件的属性类型
 * 定义主题提供者组件接受的 props
 */
export type ThemeProviderProps = {
  /** 子组件 */
  children: ReactNode;
  /** 可选的默认主题 */
  defaultTheme?: Theme;
  /** 可选的存储键名，用于本地存储主题设置 */
  storageKey?: string;
};

/**
 * 主题上下文状态的类型
 * 定义主题上下文中所有可用的状态和方法
 */
export type ThemeProviderState = {
  /** 当前主题 */
  theme: Theme;
  /** 设置主题的函数 */
  setTheme: (theme: Theme) => void;
  /** 切换主题的函数 */
  toggleTheme: () => void;
  /** 加载状态 */
  isLoading: boolean;
};
