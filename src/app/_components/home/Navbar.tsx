"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  BookOpen,
  User,
  Menu,
  X,
  Home,
  Calendar,
  LogIn,
  LogOut,
  Network,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useAccount, useChainId, useDisconnect, useSwitchChain } from "wagmi";
import { SUPPORTED_NETWORKS } from "@/lib/wagmi-config";

import Link from "next/link";

/**
 * 现代化图书馆导航栏组件
 * 具有异形设计和响应式布局，支持多种登录方式
 * 使用useMemo优化，只在登录状态变化时重新渲染
 */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false);

  const { data: session } = useSession();
  const account = useAccount();
  // - wagmi 的默认配置或缓存中保存的是链ID 1
  // - 钱包在重连过程中临时返回主网ID
  const chainId = useChainId();
  const { disconnect: disconnectWallet } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const networkMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭网络菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        networkMenuRef.current &&
        !networkMenuRef.current.contains(event.target as Node)
      ) {
        setIsNetworkMenuOpen(false);
      }
    };

    if (isNetworkMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNetworkMenuOpen]);

  // 支持的网络配置
  const supportedChains = Object.entries(SUPPORTED_NETWORKS).map(
    ([id, info]) => ({
      id: parseInt(id),
      name: info.name,
    }),
  );

  // 只有在钱包已连接且不在重连状态时才查找网络信息
  const currentChain =
    account?.isConnected && !account?.isReconnecting
      ? supportedChains.find((chain) => chain.id === chainId)
      : null;

  /**
   * 切换移动端菜单显示状态
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * 处理搜索框焦点状态
   */
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  /**
   * 处理登出操作
   */
  const handleLogout = async () => {
    if (session) {
      await signOut({ redirect: false });
    }
    if (account.isConnected) {
      disconnectWallet();
    }
  };

  /**
   * 处理网络切换
   */
  const handleNetworkSwitch = async (
    targetChainId: number,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation(); // 阻止事件冒泡
    try {
      switchChain({ chainId: targetChainId });
      setIsNetworkMenuOpen(false);
    } catch (error) {
      console.error("网络切换失败:", error);
    }
  };

  /**
   * 切换网络菜单显示状态
   */
  const toggleNetworkMenu = () => {
    setIsNetworkMenuOpen(!isNetworkMenuOpen);
  };

  /**
   * 获取用户显示信息
   */
  const getUserDisplayInfo = () => {
    if (session?.user) {
      return {
        name: session.user.name ?? session.user.email,
        type: "credentials",
      };
    }
    if (account) {
      return {
        name: account.address
          ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
          : "连接中……",
        type: "web3",
      };
    }
    return null;
  };

  const userInfo = getUserDisplayInfo();
  const isLoggedIn = !!userInfo;

  /**
   * 使用useMemo优化组件渲染，只在登录状态相关依赖变化时重新渲染
   * 依赖项包括：session数据、Web3连接状态、账户地址、链ID
   */
  const navbarContent = useMemo(
    () => (
      <nav className="relative z-[9998] border-b border-white/10 bg-white/5 shadow-2xl backdrop-blur-lg transition-colors duration-300 dark:border-gray-600/20 dark:bg-gray-800/10">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo 区域 - 异形设计 */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="flex h-12 w-12 rotate-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                  <BookOpen className="h-6 w-6 -rotate-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full bg-pink-400"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold tracking-wide text-white transition-colors duration-300 dark:text-gray-100">
                  智慧图书馆
                </h1>
                <p className="-mt-1 text-xs text-purple-200 transition-colors duration-300 dark:text-gray-300">
                  Knowledge Hub
                </p>
              </div>
            </div>

            {/* 中央搜索区域 - 异形搜索框 */}
            <div className="relative z-[1] mx-8 hidden max-w-2xl flex-1 md:flex">
              <div
                className={`relative w-full transition-all duration-300 ${
                  isSearchFocused ? "scale-105 transform" : ""
                }`}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur"></div>
                <div className="relative flex items-center">
                  <Search className="absolute left-4 z-[2] h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索图书、作者、ISBN..."
                    className="w-full rounded-full border-2 border-transparent bg-white/90 py-3 pr-4 pl-12 text-gray-800 placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-white focus:bg-white focus:outline-none dark:bg-gray-800/90 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-gray-300 dark:focus:bg-gray-800"
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                  />
                  <div className="absolute top-1/2 right-2 -translate-y-1/2 transform">
                    <button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-purple-700">
                      搜索
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 导航菜单 - 桌面版 */}
            <div className="hidden items-center space-x-1 lg:flex">
              {[
                { icon: Home, label: "首页", href: "/" },
                { icon: BookOpen, label: "图书目录", href: "/catalog" },
                { icon: Calendar, label: "活动", href: "/events" },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="group relative rounded-xl px-4 py-2 text-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700/30 dark:hover:text-white"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transform bg-gradient-to-r from-yellow-400 to-pink-400 transition-all duration-300 group-hover:w-full"></div>
                  </a>
                );
              })}
            </div>

            {/* 用户区域 */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                /* 已登录状态 */
                <div className="flex items-center space-x-3">
                  {/* 用户信息显示 */}
                  <div className="hidden items-center space-x-2 rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm sm:flex dark:bg-gray-700/30">
                    <div className="relative">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                          userInfo.type === "web3"
                            ? "bg-gradient-to-br from-green-400 to-emerald-500"
                            : "bg-gradient-to-br from-blue-400 to-purple-500"
                        }`}
                      >
                        {userInfo.type === "web3" ? (
                          <div className="h-4 w-4 rounded-sm bg-white"></div>
                        ) : (
                          <User className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-white">{userInfo.name}</p>
                      <p className="text-xs text-white/70">
                        {userInfo.type === "web3"
                          ? `Web3用户 · ${currentChain?.name ?? "获取网络中……"}`
                          : "邮箱用户"}
                      </p>
                    </div>
                  </div>

                  {/* 网络切换按钮 - 仅Web3用户显示 */}
                  {userInfo?.type === "web3" && (
                    <div
                      ref={networkMenuRef}
                      className="relative hidden sm:block"
                    >
                      <button
                        onClick={toggleNetworkMenu}
                        className="flex items-center space-x-2 rounded-xl px-3 py-2 text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white dark:hover:bg-gray-700/30"
                        title="切换网络"
                      >
                        <Network className="h-4 w-4" />
                        <span className="text-sm font-medium">网络</span>
                      </button>

                      {/* 网络切换下拉菜单 */}
                      {isNetworkMenuOpen && (
                        <div className="absolute top-full right-0 z-[9999] mt-2 w-64 rounded-xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-lg dark:border-gray-600/30 dark:bg-gray-800/95">
                          <div className="p-3">
                            <div className="mb-2 px-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                              选择网络
                            </div>
                            <div className="space-y-1">
                              {supportedChains.map((networkChain) => (
                                <button
                                  key={networkChain.id}
                                  onClick={(event) =>
                                    handleNetworkSwitch(networkChain.id, event)
                                  }
                                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                    chainId === networkChain.id
                                      ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                                  }`}
                                >
                                  <span className="font-medium">
                                    {networkChain.name}
                                  </span>
                                  {chainId === networkChain.id && (
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 登出按钮 */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 rounded-xl px-3 py-2 text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white dark:hover:bg-gray-700/30"
                    title="登出"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden text-sm font-medium sm:inline">
                      登出
                    </span>
                  </button>
                </div>
              ) : (
                /* 未登录状态 */
                <Link
                  href="/login"
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-purple-700"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden text-sm font-medium sm:inline">
                    登录
                  </span>
                </Link>
              )}

              {/* 移动端菜单按钮 */}
              <button
                onClick={toggleMenu}
                className="rounded-xl p-2 text-white transition-colors duration-200 hover:bg-white/10 lg:hidden"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* 移动端搜索栏 */}
          <div className="pb-4 md:hidden">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="搜索图书..."
                className="w-full rounded-full border border-white/20 bg-white/90 py-2 pr-4 pl-10 text-gray-800 placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-white focus:bg-white focus:outline-none dark:border-gray-600/30 dark:bg-gray-800/90 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-gray-300 dark:focus:bg-gray-800"
              />
            </div>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 left-0 z-[9999] border-t border-white/10 bg-gradient-to-b from-purple-900/95 to-indigo-900/95 shadow-2xl backdrop-blur-lg transition-colors duration-300 lg:hidden dark:border-gray-600/20 dark:from-gray-900/95 dark:to-gray-800/95">
            <div className="space-y-3 px-4 py-6">
              {[
                { icon: Home, label: "首页", href: "/" },
                { icon: BookOpen, label: "图书目录", href: "/catalog" },
                { icon: Calendar, label: "活动", href: "/events" },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center space-x-3 rounded-xl px-4 py-3 text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700/30 dark:hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                );
              })}

              {/* 移动端登录/登出按钮 */}
              <div className="mt-3 border-t border-white/10 pt-3">
                {isLoggedIn ? (
                  <div className="space-y-3">
                    {/* 移动端用户信息 */}
                    <div className="flex items-center space-x-3 rounded-xl bg-white/10 px-4 py-3">
                      <div className="relative">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                            userInfo.type === "web3"
                              ? "bg-gradient-to-br from-green-400 to-emerald-500"
                              : "bg-gradient-to-br from-blue-400 to-purple-500"
                          }`}
                        >
                          {userInfo.type === "web3" ? (
                            <div className="h-4 w-4 rounded-sm bg-white"></div>
                          ) : (
                            <User className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-white">
                          {userInfo.name}
                        </p>
                        <p className="text-xs text-white/70">
                          {userInfo.type === "web3"
                            ? `Web3用户 · ${currentChain?.name ?? "获取网络中……"}`
                            : "邮箱用户"}
                        </p>
                      </div>
                    </div>

                    {/* 移动端网络切换按钮 */}
                    {userInfo?.type === "web3" && (
                      <div className="space-y-2">
                        <button
                          onClick={toggleNetworkMenu}
                          className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white"
                        >
                          <Network className="h-5 w-5" />
                          <span className="font-medium">切换网络</span>
                        </button>

                        {/* 移动端网络选择 */}
                        {isNetworkMenuOpen && (
                          <div className="relative z-[9999] space-y-2 rounded-xl bg-white/5 p-3">
                            <div className="px-2 text-xs font-medium text-white/70">
                              选择网络
                            </div>
                            {supportedChains.map((networkChain) => (
                              <button
                                key={networkChain.id}
                                onClick={(event) =>
                                  handleNetworkSwitch(networkChain.id, event)
                                }
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                  chainId === networkChain.id
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "text-white/90 hover:bg-white/10"
                                }`}
                              >
                                <span>{networkChain.name}</span>
                                {chainId === networkChain.id && (
                                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 移动端登出按钮 */}
                    <button
                      onClick={() => {
                        void handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">登出</span>
                    </button>
                  </div>
                ) : (
                  /* 移动端登录按钮 */
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full items-center space-x-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-white transition-all duration-200 hover:from-blue-600 hover:to-purple-700"
                  >
                    <LogIn className="h-5 w-5" />
                    <span className="font-medium">登录</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
        {/* eslint-disable-next-line react-hooks/exhaustive-deps */}
      </nav>
    ),
    [
      session?.user?.email, // 只依赖具体的用户标识
      account.address,      // 钱包地址
      account.isConnected,  // 连接状态
      chainId,             // 当前链ID
      isMenuOpen,          // 菜单状态
      isNetworkMenuOpen,   // 网络菜单状态
      isSearchFocused,     // 搜索焦点状态
    ],
  );

  return navbarContent;
}
