import { z } from "zod";
import * as bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { users } from "@/server/db/schema";

/**
 * 用户认证相关的tRPC路由
 */
export const authRouter = createTRPCRouter({
  /**
   * 用户注册
   */
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "用户名至少2个字符").max(50, "用户名最多50个字符"),
        email: z.string().email("请输入有效的邮箱地址"),
        password: z.string().min(6, "密码至少6个字符").max(100, "密码最多100个字符"),
        confirmPassword: z.string(),
      })
    )

    .mutation(async ({ ctx, input }) => {
      const { name, email, password, confirmPassword } = input;

      // 验证密码确认
      if (password !== confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "两次输入的密码不一致",
        });
      }

      try {
        // 检查邮箱是否已存在
        const existingUser = await ctx.db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, email),
        });

        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "该邮箱已被注册",
          });
        }

        // 加密密码
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 创建新用户
        const newUser = await ctx.db.insert(users).values({
          name,
          email,
          password: hashedPassword,
        }).returning({
          id: users.id,
          name: users.name,
          email: users.email,
        });

        return {
          success: true,
          message: "注册成功",
          user: newUser[0],
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("注册错误:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "注册失败，请稍后重试",
        });
      }
    }),
    
    checkEmailAvailability: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const existingUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, input.email),
      });

      return {
        available: !existingUser,
      };
    }),
});