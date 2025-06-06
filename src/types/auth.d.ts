/**
 * 认证相关类型定义
 */

import { type DefaultSession } from "next-auth";

/**
 * 扩展 NextAuth 的 Session 接口
 * 添加自定义的用户属性
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // 可以在这里添加其他自定义属性
      // role?: UserRole;
    } & DefaultSession["user"];
  }

  // 如果需要扩展 User 接口，可以取消注释
  // interface User {
  //   // 添加其他自定义属性
  //   // role?: UserRole;
  // }
}

/**
 * 用户角色类型（示例）
 * 可以根据实际需求定义用户角色
 */
export type UserRole = "admin" | "user" | "moderator";

/**
 * 登录表单数据类型
 */
export interface LoginFormData {
  /** 用户邮箱 */
  email: string;
  /** 用户密码 */
  password: string;
  /** 记住我选项 */
  rememberMe?: boolean;
}

/**
 * 注册表单数据类型
 */
export interface RegisterFormData {
  /** 用户名 */
  username: string;
  /** 用户邮箱 */
  email: string;
  /** 用户密码 */
  password: string;
  /** 确认密码 */
  confirmPassword: string;
}