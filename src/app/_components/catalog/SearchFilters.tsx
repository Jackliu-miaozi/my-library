"use client";

import React from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
} from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  categories?: string[];
  availability: string;
  onAvailabilityChange: (value: string) => void;
  publishYear: string;
  onPublishYearChange: (value: string) => void;
  rating: string;
  onRatingChange: (value: string) => void;
  onClearFilters: () => void;
}

/**
 * 搜索和过滤器组件
 * 提供图书搜索、分类筛选、排序和视图切换功能
 */
export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  showFilters,
  onToggleFilters,
  categories,
  availability,
  onAvailabilityChange,
  publishYear,
  onPublishYearChange,
  rating,
  onRatingChange,
  onClearFilters,
}) => {
  return (
    <div className="mb-6 space-y-4">
      {/* 搜索栏和视图切换 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* 搜索框 */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索图书标题、作者或ISBN..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400"
          />
        </div>

        {/* 右侧控制按钮 */}
        <div className="flex items-center gap-2">
          {/* 过滤器切换 */}
          <button
            onClick={onToggleFilters}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              showFilters
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            过滤器
          </button>

          {/* 视图切换 */}
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`flex items-center gap-1 rounded-l-lg px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <Grid className="h-4 w-4" />
              网格
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`flex items-center gap-1 rounded-r-lg px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <List className="h-4 w-4" />
              列表
            </button>
          </div>
        </div>
      </div>

      {/* 过滤器面板 */}
      {showFilters && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 清除筛选按钮 */}
            <div className="lg:col-span-4 flex justify-end">
              <button
                onClick={onClearFilters}
                className="px-4 py-2 text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                清除筛选
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 分类筛选 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                分类
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400"
              >
                <option value="">所有分类</option>
                {categories?.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* 排序方式 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                排序方式
              </label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400"
              >
                <option value="title">标题 A-Z</option>
                <option value="author">作者 A-Z</option>
                <option value="publishYear">出版年份</option>
                <option value="rating">评分</option>
                <option value="availability">可借数量</option>
              </select>
            </div>

            {/* 出版年份筛选 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                出版年份
              </label>
              <select
                value={publishYear}
                onChange={(e) => onPublishYearChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400"
              >
                <option value="">所有年份</option>
                <option value="2020">2020年及以后</option>
                <option value="2015">2015年及以后</option>
                <option value="2010">2010年及以后</option>
              </select>
            </div>

            {/* 可用性筛选 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                可用性
              </label>
              <select
                value={availability}
                onChange={(e) => onAvailabilityChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400"
              >
                <option value="">全部</option>
                <option value="available">可借阅</option>
                <option value="unavailable">已借完</option>
              </select>
            </div>

            {/* 评分筛选 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                最低评分
              </label>
              <select
                value={rating}
                onChange={(e) => onRatingChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400"
              >
                <option value="">所有评分</option>
                <option value="4.5">4.5星及以上</option>
                <option value="4.0">4.0星及以上</option>
                <option value="3.5">3.5星及以上</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};