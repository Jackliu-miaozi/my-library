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

interface BookListItemProps {
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
 * 列表视图图书项组件
 * 用于列表视图中展示图书信息
 */
export const BookListItem: React.FC<BookListItemProps> = ({ book, onBorrow }) => {
  return (
    <div className="rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
      <div className="flex gap-4">
        {/* 图书封面 */}
        <div className="flex h-28 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <BookOpen className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          )}
        </div>

        {/* 图书信息 */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="cursor-pointer text-lg font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400">
              {book.title}
            </h3>
            <div
              className={`ml-4 rounded-full px-3 py-1 text-xs font-medium ${
                book.availableCopies > 0
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {book.availableCopies > 0 ? "可借阅" : "已借完"}
            </div>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{book.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {book.publishYear}年 · {book.publisher}
              </span>
            </div>
          </div>

          <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {book.description ?? '暂无描述'}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* 评分 */}
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(book.rating)}</div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {book.rating}
                </span>
              </div>

              {/* 库存 */}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                可借: {book.availableCopies}/{book.totalCopies}
              </span>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700">
                查看详情
              </button>
              <button
                disabled={book.availableCopies === 0}
                onClick={() =>
                  book.availableCopies > 0 && onBorrow?.(book.id)
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
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
      </div>
    </div>
  );
};