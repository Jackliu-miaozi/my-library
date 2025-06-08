"use client"
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, BookOpen, User, Menu, X, Home, Calendar, LogIn, LogOut, Network } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useAccount, useChainId, useDisconnect, useSwitchChain} from 'wagmi';
import { SUPPORTED_NETWORKS } from '@/lib/wagmi-config';

import Link from 'next/link';

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
      if (networkMenuRef.current && !networkMenuRef.current.contains(event.target as Node)) {
        setIsNetworkMenuOpen(false);
      }
    };

    if (isNetworkMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNetworkMenuOpen]);

  // 支持的网络配置
  const supportedChains = Object.entries(SUPPORTED_NETWORKS).map(([id, info]) => ({
    id: parseInt(id),
    name: info.name
  }));

  // 只有在钱包已连接且不在重连状态时才查找网络信息
  const currentChain = (account?.isConnected && !account?.isReconnecting) 
    ? supportedChains.find(chain => chain.id === chainId)
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
  const handleNetworkSwitch = async (targetChainId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // 阻止事件冒泡
    try {
      switchChain({ chainId: targetChainId });
      setIsNetworkMenuOpen(false);
    } catch (error) {
      console.error('网络切换失败:', error);
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
        type: 'credentials'
      };
    }
    if (account) {
      return {
        name: account.address ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : '连接中……',
        type: 'web3'
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
  const navbarContent = useMemo(() =>
    <nav className="relative bg-white/5 dark:bg-gray-800/10 backdrop-blur-lg shadow-2xl border-b border-white/10 dark:border-gray-600/20 transition-colors duration-300 z-[9998]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo 区域 - 异形设计 */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl rotate-12 flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white -rotate-12" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-white dark:text-gray-100 tracking-wide transition-colors duration-300">
                智慧图书馆
              </h1>
              <p className="text-xs text-purple-200 dark:text-gray-300 -mt-1 transition-colors duration-300">Knowledge Hub</p>
            </div>
          </div>

          {/* 中央搜索区域 - 异形搜索框 */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative z-[1]">
            <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''
              }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-gray-400 z-[2]" />
                <input
                  type="text"
                  placeholder="搜索图书、作者、ISBN..."
                  className="w-full pl-12 pr-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full border-2 border-transparent focus:border-white dark:focus:border-gray-300 focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-all duration-300 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-lg">
                    搜索
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 导航菜单 - 桌面版 */}
          <div className="hidden lg:flex items-center space-x-1">
            {[
              { icon: Home, label: '首页', href: '/' },
              { icon: BookOpen, label: '图书目录', href: '/catalog' },
              { icon: Calendar, label: '活动', href: '/events' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className="group relative px-4 py-2 text-white/90 dark:text-gray-300 hover:text-white dark:hover:text-white transition-all duration-300 rounded-xl hover:bg-white/10 dark:hover:bg-gray-700/30 backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-400 group-hover:w-full transition-all duration-300"></div>
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
                <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-white/10 dark:bg-gray-700/30 rounded-xl backdrop-blur-sm">
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${userInfo.type === 'web3'
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                      : 'bg-gradient-to-br from-blue-400 to-purple-500'
                      }`}>
                      {userInfo.type === 'web3' ? (
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-sm">
                    <p className="text-white font-medium">{userInfo.name}</p>
                    <p className="text-white/70 text-xs">
                      {userInfo.type === 'web3' ? `Web3用户 · ${currentChain?.name ?? '获取网络中……'}` : '邮箱用户'}
                    </p>
                  </div>
                </div>

                {/* 网络切换按钮 - 仅Web3用户显示 */}
                {userInfo?.type === 'web3' && (
                  <div ref={networkMenuRef} className="relative hidden sm:block">
                    <button
                      onClick={toggleNetworkMenu}
                      className="flex items-center space-x-2 px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 dark:hover:bg-gray-700/30 rounded-xl transition-all duration-200"
                      title="切换网络"
                    >
                      <Network className="w-4 h-4" />
                      <span className="text-sm font-medium">网络</span>
                    </button>

                    {/* 网络切换下拉菜单 */}
                    {isNetworkMenuOpen && (
                      <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 dark:border-gray-600/30 z-[9999]">
                        <div className="p-3">
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2 px-2">
                            选择网络
                          </div>
                          <div className="space-y-1">
                            {supportedChains.map((networkChain) => (
                              <button
                                key={networkChain.id}
                                onClick={(event) => handleNetworkSwitch(networkChain.id, event)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200 cursor-pointer ${chainId === networkChain.id
                                  ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                  }`}
                              >
                                <span className="font-medium">{networkChain.name}</span>
                                {chainId === networkChain.id && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
                  className="flex items-center space-x-2 px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 dark:hover:bg-gray-700/30 rounded-xl transition-all duration-200"
                  title="登出"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">登出</span>
                </button>
              </div>
            ) : (
              /* 未登录状态 */
              <Link
                href="/login"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">登录</span>
              </Link>
            )}

            {/* 移动端菜单按钮 */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 移动端搜索栏 */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索图书..."
              className="w-full pl-10 pr-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full border border-white/20 dark:border-gray-600/30 focus:border-white dark:focus:border-gray-300 focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-all duration-300 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-purple-900/95 to-indigo-900/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-lg border-t border-white/10 dark:border-gray-600/20 shadow-2xl z-[9999] transition-colors duration-300">
          <div className="px-4 py-6 space-y-3">
            {[
              { icon: Home, label: '首页', href: '/' },
              { icon: BookOpen, label: '图书目录', href: '/catalog' },
              { icon: Calendar, label: '活动', href: '/events' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 text-white/90 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-white/10 dark:hover:bg-gray-700/30 rounded-xl transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            })}

            {/* 移动端登录/登出按钮 */}
            <div className="border-t border-white/10 pt-3 mt-3">
              {isLoggedIn ? (
                <div className="space-y-3">
                  {/* 移动端用户信息 */}
                  <div className="flex items-center space-x-3 px-4 py-3 bg-white/10 rounded-xl">
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${userInfo.type === 'web3'
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                        : 'bg-gradient-to-br from-blue-400 to-purple-500'
                        }`}>
                        {userInfo.type === 'web3' ? (
                          <div className="w-4 h-4 bg-white rounded-sm"></div>
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="text-sm flex-1">
                      <p className="text-white font-medium">{userInfo.name}</p>
                      <p className="text-white/70 text-xs">
                        {userInfo.type === 'web3' ? `Web3用户 · ${currentChain?.name ?? '获取网络中……'}` : '邮箱用户'}
                      </p>
                    </div>
                  </div>

                  {/* 移动端网络切换按钮 */}
                  {userInfo?.type === 'web3' && (
                    <div className="space-y-2">
                      <button
                        onClick={toggleNetworkMenu}
                        className="flex items-center space-x-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 w-full"
                      >
                        <Network className="w-5 h-5" />
                        <span className="font-medium">切换网络</span>
                      </button>

                      {/* 移动端网络选择 */}
                      {isNetworkMenuOpen && (
                        <div className="bg-white/5 rounded-xl p-3 space-y-2 relative z-[9999]">
                          <div className="text-xs text-white/70 px-2 font-medium">
                            选择网络
                          </div>
                          {supportedChains.map((networkChain) => (
                            <button
                              key={networkChain.id}
                              onClick={(event) => handleNetworkSwitch(networkChain.id, event)}
                              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200  ${chainId === networkChain.id
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'text-white/90 hover:bg-white/10'
                                }`}
                            >
                              <span>{networkChain.name}</span>
                              {chainId === networkChain.id && (
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
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
                    className="flex items-center space-x-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">登出</span>
                  </button>
                </div>
              ) : (
                /* 移动端登录按钮 */
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 w-full"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-medium">登录</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      {/* eslint-disable-next-line react-hooks/exhaustive-deps */}
    </nav>, [isSearchFocused, isLoggedIn, userInfo!.type, userInfo!.name, currentChain?.name, toggleNetworkMenu, isNetworkMenuOpen, supportedChains, handleLogout, toggleMenu, isMenuOpen, chainId, handleNetworkSwitch]);

  return navbarContent;
}
