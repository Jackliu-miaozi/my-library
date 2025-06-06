/**
 * API 相关类型定义
 */

import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

/**
 * TRPC 路由输入类型推断助手
 * 用于推断 TRPC 路由的输入参数类型
 * 
 * @example 
 * type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * TRPC 路由输出类型推断助手
 * 用于推断 TRPC 路由的返回值类型
 * 
 * @example 
 * type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

/**
 * API 响应基础类型
 * 定义 API 响应的通用结构
 */
export interface ApiResponse<T = unknown> {
  /** 响应是否成功 */
  success: boolean;
  /** 响应数据 */
  data?: T;
  /** 错误信息 */
  error?: string;
  /** 响应消息 */
  message?: string;
}

/**
 * 分页参数类型
 * 定义分页查询的参数结构
 */
export interface PaginationParams {
  /** 页码，从1开始 */
  page: number;
  /** 每页数量 */
  limit: number;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc';
}

/**
 * 分页响应类型
 * 定义分页查询的响应结构
 */
export interface PaginatedResponse<T> {
  /** 数据列表 */
  items: T[];
  /** 总数量 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  limit: number;
  /** 总页数 */
  totalPages: number;
  /** 是否有下一页 */
  hasNext: boolean;
  /** 是否有上一页 */
  hasPrev: boolean;
}