# 不使用 WalletConnect 的 Web3 配置指南

本指南将帮助您将项目从使用 WalletConnect 的配置切换到纯 wagmi 配置，避免 WalletConnect 相关的初始化错误。

## 问题背景

WalletConnect 在某些情况下可能会出现以下问题：
- 重复初始化导致内存泄漏
- 需要配置 `projectId` 环境变量
- 在开发环境中可能出现连接不稳定的情况
- RainbowKit 即使不使用 WalletConnect 也会自动初始化

## 解决方案

我们提供了一个不依赖 WalletConnect 的替代方案，仅使用本地钱包连接器（如 MetaMask、Coinbase Wallet 等）。

## 文件说明

### 1. Web3ContextNoWC.tsx

这是不使用 WalletConnect 的 Web3 上下文配置文件，主要特点：

- **移除了 RainbowKit 依赖**：不再使用 `@rainbow-me/rainbowkit`
- **移除了 WalletConnect 配置**：不需要 `projectId` 环境变量
- **使用纯 wagmi 配置**：直接使用 `createConfig` 而不是 `getDefaultConfig`
- **本地钱包连接器**：仅支持注入式钱包（MetaMask、Trust Wallet 等）

支持的连接器：
```typescript
connectors: [
  injected(), // 注入式钱包（如MetaMask、Trust Wallet等）
  metaMask(), // MetaMask专用连接器
  coinbaseWallet({ // Coinbase Wallet连接器
    appName: "Library Management System",
  }),
]
```

### 2. WalletConnectButton.tsx

这是一个简单的钱包连接按钮组件，用于替代 RainbowKit 的 `ConnectButton`：

- **连接/断开钱包功能**
- **网络切换功能**
- **账户信息显示**
- **网络状态指示器**
- **响应式设计**

## 使用步骤

### 步骤 1：更新 layout.tsx

将原来的 `Web3Provider` 替换为新的不使用 WalletConnect 的版本：

```typescript
// 原来的导入
// import { Web3Provider } from "./context/Web3Context"

// 新的导入
import { Web3Provider } from "./context/Web3ContextNoWC"

// layout.tsx 中的使用保持不变
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}
```

### 步骤 2：更新 Navbar 组件

将 RainbowKit 的 `ConnectButton` 替换为自定义的 `WalletConnectButton`：

```typescript
// 原来的导入
// import { ConnectButton } from '@rainbow-me/rainbowkit'

// 新的导入
import { WalletConnectButton } from './WalletConnectButton'

// 在 Navbar 组件中替换
// 原来的使用
// <ConnectButton />

// 新的使用
<WalletConnectButton />
```

### 步骤 3：更新其他组件中的 useWeb3 导入

如果其他组件中使用了 `useWeb3` hook，需要更新导入路径：

```typescript
// 原来的导入
// import { useWeb3 } from '../context/Web3Context'

// 新的导入
import { useWeb3 } from '../context/Web3ContextNoWC'
```

### 步骤 4：移除不需要的环境变量

由于不再使用 WalletConnect，可以从 `.env` 文件中移除以下变量：

```bash
# 可以移除这行
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 步骤 5：可选 - 移除 RainbowKit 依赖

如果完全不使用 RainbowKit，可以从项目中移除相关依赖：

```bash
pnpm remove @rainbow-me/rainbowkit
```

注意：如果项目中其他地方还在使用 RainbowKit，请不要移除此依赖。

## 功能对比

| 功能 | 原配置 (WalletConnect) | 新配置 (无WalletConnect) |
|------|----------------------|------------------------|
| 本地钱包连接 | ✅ | ✅ |
| WalletConnect | ✅ | ❌ |
| 网络切换 | ✅ | ✅ |
| 账户管理 | ✅ | ✅ |
| 美观的UI | ✅ (RainbowKit) | ✅ (自定义) |
| 配置复杂度 | 中等 | 简单 |
| 依赖数量 | 多 | 少 |
| 初始化错误 | 可能出现 | 不会出现 |

## 支持的钱包

新配置支持以下类型的钱包：

1. **注入式钱包**：
   - MetaMask
   - Trust Wallet
   - Brave Wallet
   - 其他支持 EIP-1193 的钱包

2. **专用连接器**：
   - MetaMask（专用连接器）
   - Coinbase Wallet

## 注意事项

1. **移动端支持**：新配置主要支持桌面端浏览器钱包，移动端需要使用支持 WalletConnect 的钱包应用内浏览器。

2. **功能限制**：相比 RainbowKit，自定义组件的功能可能较为基础，但可以根据需要进行扩展。

3. **样式定制**：`WalletConnectButton` 组件使用 Tailwind CSS，可以根据项目需要调整样式。

4. **错误处理**：新配置包含了基本的错误处理，但可能需要根据具体需求进行完善。

## 故障排除

### 问题：钱包连接失败

**解决方案**：
1. 确保浏览器已安装支持的钱包扩展
2. 检查钱包是否已解锁
3. 查看浏览器控制台是否有错误信息

### 问题：网络切换失败

**解决方案**：
1. 确保钱包支持目标网络
2. 检查网络配置是否正确
3. 某些钱包可能需要手动添加自定义网络

### 问题：样式显示异常

**解决方案**：
1. 确保项目已正确配置 Tailwind CSS
2. 检查是否有样式冲突
3. 根据需要调整 `WalletConnectButton` 组件的样式

## 总结

通过使用纯 wagmi 配置，您可以：
- 避免 WalletConnect 相关的初始化错误
- 简化项目配置
- 减少依赖数量
- 获得更稳定的本地钱包连接体验

如果您需要 WalletConnect 功能（如移动端钱包连接），可以随时切换回原来的配置。