import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, gte, ilike, or, sql } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { books } from "@/server/db/schema";

/**
 * 图书相关的tRPC路由
 */
export const booksRouter = createTRPCRouter({
  /**
   * 获取所有图书（带分页和筛选）
   */
  getBooks: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(12),
        search: z.string().optional(),
        category: z.string().optional(),
        publishYear: z.number().optional(),
        availability: z.enum(["available", "unavailable"]).optional(),
        minRating: z.number().min(0).max(5).optional(),
        sortBy: z
          .enum(["title", "author", "publishYear", "rating", "createdAt"])
          .default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        page,
        limit,
        search,
        category,
        publishYear,
        availability,
        minRating,
        sortBy,
        sortOrder,
      } = input;

      try {
        // 构建查询条件
        const conditions = [];

        // 搜索条件（标题、作者、标签）
        if (search) {
          conditions.push(
            or(
              ilike(books.title, `%${search}%`),
              ilike(books.author, `%${search}%`),
              ilike(books.tags, `%${search}%`),
            ),
          );
        }

        // 分类筛选
        if (category) {
          conditions.push(eq(books.category, category));
        }

        // 出版年份筛选
        if (publishYear) {
          conditions.push(gte(books.publishYear, publishYear));
        }

        // 可用性筛选
        if (availability === "available") {
          conditions.push(sql`${books.availableCopies} > 0`);
        } else if (availability === "unavailable") {
          conditions.push(eq(books.availableCopies, 0));
        }

        // 评分筛选
        if (minRating) {
          conditions.push(gte(books.rating, minRating));
        }

        // 构建排序
        const orderBy =
          sortOrder === "desc" ? desc(books[sortBy]) : books[sortBy];

        // 计算偏移量
        const offset = (page - 1) * limit;

        // 执行查询
        const [booksData, totalCount] = await Promise.all([
          ctx.db
            .select()
            .from(books)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset),
          ctx.db
            .select({ count: sql<number>`count(*)` })
            .from(books)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .then((result) => result[0]?.count ?? 0),
        ]);

        // 处理标签字段（从JSON字符串转换为数组）
        const processedBooks = booksData.map((book) => ({
          ...book,
          tags: book.tags ? (JSON.parse(book.tags) as string[]) : [],
        }));

        return {
          books: processedBooks,
          pagination: {
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit),
          },
        };
      } catch (error) {
        console.error("获取图书列表错误:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "获取图书列表失败，请稍后重试",
        });
      }
    }),

  /**
   * 根据ID获取单本图书
   */
  getBookById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const book = await ctx.db.query.books.findFirst({
          where: eq(books.id, input.id),
        });

        if (!book) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "图书不存在",
          });
        }

        // 处理标签字段
        return {
          ...book,
          tags: book.tags ? (JSON.parse(book.tags) as string[]) : [],
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("获取图书详情错误:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "获取图书详情失败，请稍后重试",
        });
      }
    }),

  /**
   * 获取所有分类
   */
  getCategories: publicProcedure.query(async ({ ctx }) => {
    try {
      // 确保使用正确的表字段引用
      const categories = await ctx.db
        .select({ category: books.category })
        .from(books)
        .groupBy(books.category)
        .orderBy(books.category);

      return categories.map((item) => item.category);
    } catch (error) {
      console.error("获取分类列表错误:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "获取分类列表失败，请稍后重试",
      });
    }
  }),

  /**
   * 添加图书（管理员功能）
   */
  addBook: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "标题不能为空").max(500, "标题过长"),
        author: z.string().min(1, "作者不能为空").max(255, "作者名过长"),
        isbn: z.string().min(1, "ISBN不能为空").max(20, "ISBN过长"),
        category: z.string().min(1, "分类不能为空").max(100, "分类名过长"),
        publishYear: z.number().min(1000).max(new Date().getFullYear()),
        publisher: z.string().min(1, "出版社不能为空").max(255, "出版社名过长"),
        description: z.string().optional(),
        coverUrl: z.string().url("封面URL格式不正确").optional(),
        rating: z.number().min(0).max(5).default(0),
        totalCopies: z.number().min(1).default(1),
        availableCopies: z.number().min(0).optional(),
        tags: z.array(z.string()).default([]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // 检查ISBN是否已存在
        const existingBook = await ctx.db.query.books.findFirst({
          where: eq(books.isbn, input.isbn),
        });

        if (existingBook) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "该ISBN已存在",
          });
        }

        // 如果没有指定可用数量，默认等于总数量
        const availableCopies = input.availableCopies ?? input.totalCopies;

        const newBook = await ctx.db
          .insert(books)
          .values({
            title: input.title,
            author: input.author,
            isbn: input.isbn,
            category: input.category,
            publishYear: input.publishYear,
            publisher: input.publisher,
            description: input.description,
            coverUrl: input.coverUrl,
            rating: input.rating,
            totalCopies: input.totalCopies,
            availableCopies,
            tags: JSON.stringify(input.tags),
          })
          .returning();

        return {
          success: true,
          message: "图书添加成功",
          book: {
            ...newBook[0],
            tags: input.tags,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("添加图书错误:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "添加图书失败，请稍后重试",
        });
      }
    }),

  /**
   * 初始化示例数据
   */
  seedBooks: publicProcedure.mutation(async ({ ctx }) => {
    try {
      // 检查是否已有数据
      const existingBooks = await ctx.db.select().from(books).limit(1);
      if (existingBooks.length > 0) {
        return {
          success: false,
          message: "数据库中已有图书数据",
        };
      }

      // 示例图书数据
      const sampleBooks = [
        {
          title: "JavaScript高级程序设计",
          author: "Nicholas C. Zakas",
          isbn: "978-7-115-27579-0",
          category: "计算机科学",
          publishYear: 2020,
          publisher: "人民邮电出版社",
          description: "全面深入地介绍了JavaScript语言的核心概念和高级特性。",
          rating: 4.8,
          totalCopies: 10,
          availableCopies: 3,
          tags: JSON.stringify(["编程", "JavaScript", "前端开发"]),
        },
        {
          title: "React技术揭秘",
          author: "卡颂",
          isbn: "978-7-121-41234-5",
          category: "计算机科学",
          publishYear: 2021,
          publisher: "电子工业出版社",
          description: "深入解析React框架的内部实现原理和最佳实践。",
          rating: 4.6,
          totalCopies: 8,
          availableCopies: 5,
          tags: JSON.stringify(["React", "前端框架", "源码分析"]),
        },
        {
          title: "算法导论",
          author: "Thomas H. Cormen",
          isbn: "978-7-111-40701-0",
          category: "计算机科学",
          publishYear: 2019,
          publisher: "机械工业出版社",
          description:
            "计算机算法领域的经典教材，涵盖了算法设计与分析的各个方面。",
          rating: 4.9,
          totalCopies: 15,
          availableCopies: 0,
          tags: JSON.stringify(["算法", "数据结构", "计算机理论"]),
        },
        {
          title: "深入理解计算机系统",
          author: "Randal E. Bryant",
          isbn: "978-7-111-54493-7",
          category: "计算机科学",
          publishYear: 2018,
          publisher: "机械工业出版社",
          description: "从程序员的角度深入理解计算机系统的工作原理。",
          rating: 4.7,
          totalCopies: 12,
          availableCopies: 2,
          tags: JSON.stringify(["计算机系统", "操作系统", "底层原理"]),
        },
        {
          title: "设计模式",
          author: "Erich Gamma",
          isbn: "978-7-111-21116-6",
          category: "计算机科学",
          publishYear: 2017,
          publisher: "机械工业出版社",
          description: "面向对象软件设计的经典之作，介绍了23种设计模式。",
          rating: 4.5,
          totalCopies: 6,
          availableCopies: 4,
          tags: JSON.stringify(["设计模式", "面向对象", "软件工程"]),
        },
        {
          title: "Node.js实战",
          author: "Mike Cantelon",
          isbn: "978-7-115-35234-1",
          category: "计算机科学",
          publishYear: 2022,
          publisher: "人民邮电出版社",
          description: "全面介绍Node.js开发的实战技巧和最佳实践。",
          rating: 4.4,
          totalCopies: 9,
          availableCopies: 6,
          tags: JSON.stringify(["Node.js", "后端开发", "JavaScript"]),
        },
      ];

      await ctx.db.insert(books).values(sampleBooks);

      return {
        success: true,
        message: "示例图书数据初始化成功",
        count: sampleBooks.length,
      };
    } catch (error) {
      console.error("初始化图书数据错误:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "初始化图书数据失败，请稍后重试",
      });
    }
  }),
});
