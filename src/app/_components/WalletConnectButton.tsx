"use client"

import { useWeb3 } from "../context/Web3ContextNoWC"
import { useState } from "react"

// 使用我们自定义的 Window.ethereum 类型定义
// 类型定义位于 src/types/window.d.ts

/**
 * 钱包连接按钮组件
 * 提供简单的钱包连接/断开功能，不依赖RainbowKit
 */
export function WalletConnectButton() {
  const {
    account,
    chainId,
    networkName,
    isConnected,
    isNetworkSupported,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    availableConnectors
  } = useWeb3()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  // 支持的钱包列表
  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: '最受欢迎的以太坊钱包',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      installed: typeof window !== 'undefined' && window.ethereum?.isMetaMask === true
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: '安全可靠的数字钱包',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      installed: typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet === true
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: '连接移动端钱包',
      installed: true // WalletConnect 总是可用
    },
    {
      id: 'injected',
      name: '其他钱包',
      icon: '💼',
      description: '其他浏览器钱包',
      installed: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
    }
  ]

  /**
   * 处理钱包连接
   * @param walletId - 钱包ID
   */
  const handleWalletConnect = async (walletId: string) => {
    try {
      setIsWalletModalOpen(false)
      // 根据walletId调用对应的连接方法
      connectWallet(walletId)
    } catch (error) {
      console.error('连接钱包失败:', error)
    }
  }

  /**
   * 处理网络切换
   * @param targetChainId - 目标链ID
   */
  const handleSwitchNetwork = async (targetChainId: number) => {
    setIsSwitching(true)
    try {
      await switchNetwork(targetChainId)
    } catch (error) {
      console.error('网络切换失败:', error)
    } finally {
      setIsSwitching(false)
      setIsDropdownOpen(false)
    }
  }

  /**
   * 格式化地址显示
   * @param address - 钱包地址
   * @returns 格式化后的地址
   */
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // 如果未连接钱包，显示连接按钮
  if (!isConnected) {
    return (
      <>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            连接钱包
          </button>
          {availableConnectors.length > 0 && (
            <div className="text-xs text-gray-500">
              支持: {availableConnectors.join(', ')}
            </div>
          )}
        </div>

        {/* 钱包选择模态框 */}
        {isWalletModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsWalletModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw] max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 模态框头部 */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">选择钱包</h2>
                <button
                  onClick={() => setIsWalletModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 钱包选项列表 */}
              <div className="space-y-3">
                {walletOptions.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletConnect(wallet.id)}
                    disabled={!wallet.installed}
                    className={`w-full p-4 rounded-lg border transition-colors duration-200 text-left ${wallet.installed
                        ? 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 cursor-not-allowed opacity-60'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{wallet.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {wallet.name}
                          {!wallet.installed && (
                            <span className="ml-2 text-xs text-gray-500">(未安装)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {wallet.description}
                        </div>
                      </div>
                      {wallet.installed && (
                        <div className="text-blue-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* 底部提示 */}
              <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  💡 提示：如果您没有钱包，建议先安装 MetaMask 或使用 WalletConnect 连接移动端钱包。
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // 已连接钱包的状态
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* 网络状态指示器 */}
        <div className={`w-2 h-2 rounded-full ${isNetworkSupported ? 'bg-green-500' : 'bg-red-500'
          }`} />

        {/* 钱包信息按钮 */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <div className="flex flex-col items-start">
            <div className="text-sm font-medium">
              {account ? formatAddress(account) : '未连接'}
            </div>
            <div className="text-xs text-gray-500">
              {networkName}
            </div>
          </div>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* 下拉菜单 */}
      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {/* 账户信息 */}
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">钱包地址</div>
              <div className="text-xs text-gray-500 font-mono break-all">
                {account}
              </div>
            </div>

            {/* 网络信息 */}
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">当前网络</div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isNetworkSupported ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                <span className="text-sm">{networkName}</span>
                <span className="text-xs text-gray-500">({chainId})</span>
              </div>
            </div>

            {/* 网络切换 */}
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">切换网络</div>
              <div className="grid grid-cols-1 gap-1">
                {Object.entries({
                  1: 'Ethereum',
                  11155111: 'Sepolia',
                  1287: 'Moonbase Alpha',
                  420420421: 'Asset-Hub Westend'
                }).map(([id, name]) => (
                  <button
                    key={id}
                    onClick={() => handleSwitchNetwork(Number(id))}
                    disabled={isSwitching || chainId === Number(id)}
                    className={`px-3 py-2 text-sm rounded transition-colors duration-200 text-left ${chainId === Number(id)
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      } ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* 断开连接按钮 */}
            <button
              onClick={() => {
                disconnectWallet()
                setIsDropdownOpen(false)
              }}
              className="w-full px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 rounded transition-colors duration-200 text-sm font-medium"
            >
              断开连接
            </button>
          </div>
        </div>
      )}
    </div>
  )
}