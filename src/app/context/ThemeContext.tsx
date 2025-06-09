// 声明这是客户端代码
"use client";

// 导入必要的 React hooks 和类型
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
// 导入类型定义
import type {
  Theme,
  ThemeProviderProps,
  ThemeProviderState,
} from "@/types/theme";

// 定义初始状态
const initialState: ThemeProviderState = {
  theme: "system", // 默认使用系统主题
  setTheme: () => null, // 空函数占位
  toggleTheme: () => null, // 空函数占位
  isLoading: true, // 初始状态为加载中
};

// 创建主题上下文
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/**
 * 主题提供者组件
 * 提供主题切换、持久化存储和系统主题检测功能
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  // 状态管理
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化主题：从本地存储加载或使用默认值
  useEffect(() => {
    // 从本地存储中获取保存的主题设置，如果在服务器端则返回 null
    const savedTheme =
      typeof window !== "undefined"
        ? // 从本地存储中获取主题设置并转换为Theme类型
          (localStorage.getItem(storageKey) as Theme)
        : null;

    // 验证保存的主题是否有效
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setTheme(savedTheme);
    }
    setIsLoading(false);
  }, [storageKey]);

  // 应用主题到 DOM
  useEffect(() => {
    // 如果在服务器端环境下(没有window对象)则直接返回,不执行后续DOM操作
    if (typeof window === "undefined") return;

    // 获取文档根元素(html标签)
    const root = window.document.documentElement;
    // 移除根元素上已有的主题相关class
    root.classList.remove("light", "dark");

    // 如果当前主题设置为"system"，则根据系统偏好设置自动切换主题
    if (theme === "system") {
      // 检测系统是否启用暗色模式
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark" // 系统启用暗色模式时使用dark主题
        : "light"; // 系统未启用暗色模式时使用light主题
      // 将检测到的系统主题应用到根元素
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);

  // 监听系统主题变化
  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;
    // 创建一个媒体查询对象，用于检测系统是否处于深色模式
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // 处理系统主题变化的回调函数
    const handleChange = () => {
      // 获取文档根元素
      const root = window.document.documentElement;
      // 移除当前的主题类名
      root.classList.remove("light", "dark");
      // 根据系统主题偏好添加对应的主题类名
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    };

    // 监听系统主题变化事件
    mediaQuery.addEventListener("change", handleChange);
    // 组件卸载时清理监听器（防止内存泄漏）
    // - ❌ 不会 在 useEffect 执行时立即调用
    // - ❌ 不会 停留在某个位置等待
    // - ✅ 会被 React 保存起来 ，等待特定时机调用
    // 组件卸载时，会执行return的函数
    // 依赖项发生变化时，会执行之前的清理函数，执行新的useEffect函数，等待依赖项再次变化时
    // 执行return的函数，循环往复。
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  /**
   * 设置主题并保存到本地存储
   * @param newTheme - 要设置的主题
   */
  // useCallback 用于缓存函数，避免每次渲染都创建新的函数实例
  const handleSetTheme = useCallback(
    (newTheme: Theme) => {
      // 如果在服务器端环境下(没有window对象)则直接返回,不执行后续操作
      if (typeof window !== "undefined") {
        // 将新的主题设置保存到本地存储
        localStorage.setItem(storageKey, newTheme);
      }
      setTheme(newTheme);
    },
    [storageKey],
  );

  /**
   * 切换主题：light -> dark -> system -> light
   */
  // useCallback主要作用是缓存函数，避免在组件重新渲染时不必要地重新创建函数。
  // const cachedFn = useCallback(fn, dependencies);
  // fn 是你要缓存的函数。
  // dependencies 是一个数组，其中包含了 fn 依赖的变量或其他值。
  // 若依赖项有变化，useCallback 会返回新的函数实例并缓存
  const handleToggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      let newTheme: Theme;

      switch (prevTheme) {
        case "light":
          newTheme = "dark";
          break;
        case "dark":
          newTheme = "system";
          break;
        case "system":
          newTheme = "light";
          break;
        default:
          newTheme = "light";
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, newTheme);
      }
      return newTheme;
    });
  }, [storageKey]);

  // 构建提供给上下文的值
  const value = {
    theme,
    setTheme: handleSetTheme,
    toggleTheme: handleToggleTheme,
    isLoading,
  };

  // 返回 Provider 组件
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * 获取主题上下文的 Hook
 * @returns 主题上下文对象
 * @throws 如果在 ThemeProvider 外部使用会抛出错误
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
