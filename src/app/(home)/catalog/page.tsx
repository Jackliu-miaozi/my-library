"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { api } from "@/trpc/react";
import { BookCard, BookListItem, SearchFilters } from "@/app/_components/catalog";


/**
 * 筛选条件接口
 */
interface FilterOptions {
  category: string;
  publishYear: string;
  availability: string;
  rating: string;
}

/**
 * 图书目录页面组件
 * 提供图书搜索、筛选、展示和分页功能
 */
export default function CatalogPage() {
  // 状态管理
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: "",
    publishYear: "",
    availability: "",
    rating: "",
  });

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const booksPerPage = 12;

  // 获取 tRPC utils 用于缓存管理和预取
  const utils = api.useUtils();

  // 记忆化查询参数
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: booksPerPage,
      search: debouncedSearchTerm || undefined,
      category: filters.category || undefined,
      publishYear: filters.publishYear
        ? parseInt(filters.publishYear)
        : undefined,
      availability: filters.availability
        ? (filters.availability as "available" | "unavailable")
        : undefined,
      minRating: filters.rating ? parseFloat(filters.rating) : undefined,
    }),
    [currentPage, booksPerPage, debouncedSearchTerm, filters],
  );

  // 使用tRPC查询图书数据
  const {
    data: booksData,
    isLoading,
    error,
    refetch,
  } = api.books.getBooks.useQuery(queryParams, {
    // 启用缓存，5分钟内不重新请求
    staleTime: 5 * 60 * 1000,
    // 窗口重新获得焦点时不自动重新请求
    refetchOnWindowFocus: false,
    // 只有在有防抖搜索词或其他筛选条件时才启用查询
    enabled: true,
  });

  // 获取分类列表
  const { data: categories } = api.books.getCategories.useQuery(undefined, {
    // 分类数据变化较少，缓存更长时间
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // 初始化示例数据的mutation
  const seedBooksMutation = api.books.seedBooks.useMutation({
    onSuccess: () => {
      // 使用 utils 失效相关缓存
      void utils.books.getBooks.invalidate();
      void utils.books.getCategories.invalidate();
    },
  });

  // 处理数据
  const books = booksData?.books ?? [];
  const pagination = booksData?.pagination;

  /**
   * 初始化示例数据
   */
  const handleSeedBooks = () => {
    seedBooksMutation.mutate();
  };

  /**
   * 处理图书借阅（模拟功能，使用乐观更新）
   */
  const handleBorrowBook = useCallback(
    async (bookId: string) => {
      // 乐观更新：立即更新UI
      utils.books.getBooks.setData(queryParams, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          books: oldData.books.map((book) =>
            book.id === bookId
              ? {
                  ...book,
                  availableCopies: Math.max(0, book.availableCopies - 1),
                }
              : book,
          ),
        };
      });

      try {
        // 这里应该调用实际的借阅API
        // await api.books.borrowBook.mutate({ bookId });
        console.log(`借阅图书: ${bookId}`);

        // 模拟API延迟
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 成功后可以选择性地重新验证数据
        // utils.books.getBooks.invalidate(queryParams);
      } catch (error) {
        // 如果失败，回滚乐观更新
        void utils.books.getBooks.invalidate(queryParams);
        console.error("借阅失败:", error);
      }
    },
    [queryParams, utils.books.getBooks],
  );

  /**
   * 当筛选条件改变时重置到第一页
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filters]);

  /**
   * 预取下一页数据
   */
  useEffect(() => {
    const totalPages = pagination?.totalPages ?? 0;
    if (currentPage < totalPages) {
      // 预取下一页数据
      void utils.books.getBooks.prefetch({
        ...queryParams,
        page: currentPage + 1,
      });
    }
  }, [currentPage, pagination?.totalPages, queryParams, utils.books.getBooks]);

  /**
   * 智能缓存管理：在用户空闲时预取热门数据
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      // 预取热门分类的数据
      if (categories && categories.length > 0) {
        void utils.books.getBooks.prefetch({
          page: 1,
          limit: booksPerPage,
          category: categories[0],
          sortBy: "rating",
          sortOrder: "desc",
        });
      }
    }, 2000); // 2秒后预取

    return () => clearTimeout(timer);
  }, [categories, utils.books.getBooks, booksPerPage]);

  /**
   * 处理筛选条件变化
   */
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * 清除所有筛选条件
   */
  const clearFilters = useCallback(() => {
    setFilters({
      category: "",
      publishYear: "",
      availability: "",
      rating: "",
    });
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);

    // 清除相关缓存，强制重新获取数据
    void utils.books.getBooks.invalidate();
  }, [utils.books.getBooks]);

  // 分页计算
  const totalPages = pagination?.totalPages ?? 0;
  const currentBooks = books;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">加载图书目录中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
            图书目录
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            发现知识的宝藏，开启学习的旅程
          </p>
        </div>

        {/* 搜索和筛选组件 */}
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={filters.category}
          onCategoryChange={(value) => handleFilterChange("category", value)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showFilters={isFilterOpen}
          onToggleFilters={() => setIsFilterOpen(!isFilterOpen)}
          categories={categories}
          availability={filters.availability}
          onAvailabilityChange={(value) => handleFilterChange("availability", value)}
          publishYear={filters.publishYear}
          onPublishYearChange={(value) => handleFilterChange("publishYear", value)}
          rating={filters.rating}
          onRatingChange={(value) => handleFilterChange("rating", value)}
          onClearFilters={clearFilters}
        />

        {/* 结果统计 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400">
              共找到{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {pagination?.total ?? 0}
              </span>{" "}
              本图书
            </p>
            {books.length === 0 && !isLoading && (
              <button
                onClick={handleSeedBooks}
                disabled={seedBooksMutation.isPending}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50"
              >
                {seedBooksMutation.isPending ? "初始化中..." : "初始化示例数据"}
              </button>
            )}
          </div>
          {pagination && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              第 {(currentPage - 1) * booksPerPage + 1}-
              {Math.min(currentPage * booksPerPage, pagination.total)} 本，共{" "}
              {pagination.total} 本
            </p>
          )}
        </div>

        {/* 加载状态 */}
        {isLoading ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm !== debouncedSearchTerm
                ? "正在搜索..."
                : "正在加载图书数据..."}
            </p>
            {searchTerm !== debouncedSearchTerm && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                搜索词: &quot;{searchTerm}&quot;
              </p>
            )}
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-red-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              加载失败
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              {error.message || "获取图书数据时出现错误"}
            </p>
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
            >
              重试
            </button>
          </div>
        ) : currentBooks.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {books.length === 0 ? "暂无图书数据" : "未找到相关图书"}
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              {books.length === 0
                ? "点击下方按钮初始化示例数据"
                : "请尝试调整搜索条件或筛选选项"}
            </p>
            {books.length === 0 && (
              <button
                onClick={handleSeedBooks}
                disabled={seedBooksMutation.isPending}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50"
              >
                {seedBooksMutation.isPending ? "初始化中..." : "初始化示例数据"}
              </button>
            )}
          </div>
        ) : (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-4"
            }`}
          >
            {currentBooks.map((book) =>
              viewMode === "grid" ? (
                <BookCard key={book.id} book={book} onBorrow={handleBorrowBook} />
              ) : (
                <BookListItem key={book.id} book={book} onBorrow={handleBorrowBook} />
              ),
            )}
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
              上一页
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                const isCurrentPage = page === currentPage;
                const shouldShow =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1);

                if (!shouldShow) {
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 py-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-lg px-4 py-2 transition-colors duration-200 ${
                      isCurrentPage
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              下一页
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* 调试信息面板 */}
      {showDebugInfo && (
        <div className="mt-8 rounded-lg border bg-gray-100 p-4 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            调试信息
          </h3>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                查询状态
              </h4>
              <p>加载中: {isLoading ? "是" : "否"}</p>
              <p>错误: {error ? "是" : "否"}</p>
              <p>数据获取中: {isLoading ? "是" : "否"}</p>
              <p>后台更新: {isLoading ? "是" : "否"}</p>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                搜索状态
              </h4>
              <p>当前搜索词: &quot;{searchTerm}&quot;</p>
              <p>防抖搜索词: &quot;{debouncedSearchTerm}&quot;</p>
              <p>
                搜索延迟:{" "}
                {searchTerm !== debouncedSearchTerm ? "等待中" : "已同步"}
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                分页信息
              </h4>
              <p>当前页: {currentPage}</p>
              <p>总页数: {pagination?.totalPages ?? 0}</p>
              <p>总数量: {pagination?.total ?? 0}</p>
              <p>每页数量: {booksPerPage}</p>
            </div>
          </div>
        </div>
      )}

      {/* 调试开关 */}
      <button
        onClick={() => setShowDebugInfo(!showDebugInfo)}
        className="fixed right-4 bottom-4 z-50 rounded-full bg-blue-600 p-2 text-white shadow-lg transition-colors hover:bg-blue-700"
        title="切换调试信息"
      >
        {showDebugInfo ? "🔍" : "🐛"}
      </button>
    </div>
  );
}
