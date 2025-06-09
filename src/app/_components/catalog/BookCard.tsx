"use client";

import React from "react";
import {
  BookOpen,
  Star,
  Calendar,
  User,
} from "lucide-react";

/**
 * 图书信息接口
 */
interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishYear: number;
  publisher: string;
  description: string | null;
  coverUrl?: string | null;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  tags: string[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

interface BookCardProps {
  book: Book;
  onBorrow?: (bookId: string) => void;
}

/**
 * 渲染星级评分
 */
const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${
        index < Math.floor(rating)
          ? "fill-current text-yellow-400"
          : "text-gray-300"
      }`}
    />
  ));
};

/**
 * 图书卡片组件
 * 用于网格视图中展示图书信息
 */
export const BookCard: React.FC<BookCardProps> = ({ book, onBorrow }) => {
  return (
    <div className="group overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
      {/* 图书封面 */}
      <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <BookOpen className="h-16 w-16 text-blue-500 dark:text-blue-400" />
        )}
        {/* 可用性标识 */}
        <div
          className={`absolute top-3 right-3 rounded-full px-2 py-1 text-xs font-medium ${
            book.availableCopies > 0
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {book.availableCopies > 0 ? "可借阅" : "已借完"}
        </div>
      </div>

      {/* 图书信息 */}
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
          {book.title}
        </h3>

        <div className="mb-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <User className="h-4 w-4" />
          <span>{book.author}</span>
        </div>

        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>
            {book.publishYear}年 · {book.publisher}
          </span>
        </div>

        {/* 评分 */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex">{renderStars(book.rating)}</div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {book.rating}
          </span>
        </div>

        {/* 标签 */}
        <div className="mb-3 flex flex-wrap gap-1">
          {book.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 库存信息 */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          可借: {book.availableCopies}/{book.totalCopies} 本
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700">
            查看详情
          </button>
          <button
            disabled={book.availableCopies === 0}
            onClick={() =>
              book.availableCopies > 0 && onBorrow?.(book.id)
            }
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              book.availableCopies > 0
                ? "bg-green-600 text-white hover:bg-green-700"
                : "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
            }`}
          >
            {book.availableCopies > 0 ? "借阅" : "已借完"}
          </button>
        </div>
      </div>
    </div>
  );
};