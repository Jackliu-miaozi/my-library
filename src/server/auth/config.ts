// import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";

import { db } from "@/server/db";
// import {
//   accounts,
//   sessions,
//   users,
//   verificationTokens,
// } from "@/server/db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
// NextAuth 模块增强已移至 ~/types/auth.d.ts

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    /**
     * Credentials Provider 配置
     * 支持用户名/邮箱和密码登录
     */
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "邮箱",
          type: "email",
          placeholder: "请输入邮箱地址",
        },
        password: {
          label: "密码",
          type: "password",
          placeholder: "请输入密码",
        },
      },
      /**
       * 验证用户凭据的函数
       * @param credentials - 用户提交的凭据
       * @returns 用户对象或 null
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("请提供邮箱和密码");
        }

        try {
          // 从数据库查找用户
          const user = await db.query.users.findFirst({
            where: (users, { eq }) =>
              eq(users.email, credentials.email as string),
          });

          if (!user) {
            throw new Error("用户不存在");
          }

          // 2. 验证密码
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string, // 用户输入的明文密码
            user.password ?? "", // 数据库中的加密密码
          );

          if (!isPasswordValid) {
            throw new Error("密码错误");
          }

          // 返回用户信息（不包含密码）
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("认证错误:", error);
          return null;
        }
      },
    }),
  ],
  // 注释掉 DrizzleAdapter，因为 JWT 策略不需要数据库适配器
  // adapter: DrizzleAdapter(db, {
  //   usersTable: users,
  //   accountsTable: accounts,
  //   sessionsTable: sessions,
  //   verificationTokensTable: verificationTokens,
  // }),
  session: {
    strategy: "jwt", // 修改为 jwt 策略
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  callbacks: {
    /**
     * JWT 回调函数 - 在创建、更新或访问 JWT 时调用
     * @param token - JWT token 对象
     * @param user - 用户对象（仅在登录时提供）
     * @returns 更新后的 token
     */
    jwt: async ({ token, user }) => {
      // 如果是登录时，将用户信息添加到 token 中
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    /**
     * Session 回调函数 - 在获取会话时调用
     * @param session - 会话对象
     * @param token - JWT token 对象
     * @returns 更新后的 session
     */
    session: async ({ session, token }) => {
      // 将 token 中的信息传递给 session
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email!;
        session.user.name = token.name!;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 天
    // 可选：添加 JWT 密钥配置
    // secret: process.env.NEXTAUTH_SECRET,
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;
