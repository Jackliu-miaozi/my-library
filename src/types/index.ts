/**
 * 类型定义统一导出文件
 * 提供项目中所有类型定义的统一入口
 */

// Web3 相关类型
export type {
  Web3ContextType,
  Web3ProviderProps,
  WalletType,
  NetworkConfig,
} from './web3';

// 主题相关类型
export type {
  Theme,
  ThemeProviderProps,
  ThemeProviderState,
} from './theme';

// 认证相关类型
export type {
  UserRole,
  LoginFormData,
  RegisterFormData,
} from './auth';

// API 相关类型
export type {
  RouterInputs,
  RouterOutputs,
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
} from './api';

// Window 接口扩展（全局类型，无需导出）
// 该文件会自动被 TypeScript 识别
import './window';