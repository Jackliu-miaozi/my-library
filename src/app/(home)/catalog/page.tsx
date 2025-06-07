"use client"

import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, BookOpen, Star, Calendar, User, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

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
  description: string;
  coverUrl?: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  tags: string[];
}

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
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    publishYear: '',
    availability: '',
    rating: ''
  });

  const booksPerPage = 12;

  // 模拟图书数据
  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'JavaScript高级程序设计',
      author: 'Nicholas C. Zakas',
      isbn: '978-7-115-27579-0',
      category: '计算机科学',
      publishYear: 2020,
      publisher: '人民邮电出版社',
      description: '全面深入地介绍了JavaScript语言的核心概念和高级特性。',
      rating: 4.8,
      totalCopies: 10,
      availableCopies: 3,
      tags: ['编程', 'JavaScript', '前端开发']
    },
    {
      id: '2',
      title: 'React技术揭秘',
      author: '卡颂',
      isbn: '978-7-121-41234-5',
      category: '计算机科学',
      publishYear: 2021,
      publisher: '电子工业出版社',
      description: '深入解析React框架的内部实现原理和最佳实践。',
      rating: 4.6,
      totalCopies: 8,
      availableCopies: 5,
      tags: ['React', '前端框架', '源码分析']
    },
    {
      id: '3',
      title: '算法导论',
      author: 'Thomas H. Cormen',
      isbn: '978-7-111-40701-0',
      category: '计算机科学',
      publishYear: 2019,
      publisher: '机械工业出版社',
      description: '计算机算法领域的经典教材，涵盖了算法设计与分析的各个方面。',
      rating: 4.9,
      totalCopies: 15,
      availableCopies: 0,
      tags: ['算法', '数据结构', '计算机理论']
    },
    {
      id: '4',
      title: '深入理解计算机系统',
      author: 'Randal E. Bryant',
      isbn: '978-7-111-54493-7',
      category: '计算机科学',
      publishYear: 2018,
      publisher: '机械工业出版社',
      description: '从程序员的角度深入理解计算机系统的工作原理。',
      rating: 4.7,
      totalCopies: 12,
      availableCopies: 2,
      tags: ['计算机系统', '操作系统', '底层原理']
    },
    {
      id: '5',
      title: '设计模式',
      author: 'Erich Gamma',
      isbn: '978-7-111-21116-6',
      category: '计算机科学',
      publishYear: 2017,
      publisher: '机械工业出版社',
      description: '面向对象软件设计的经典之作，介绍了23种设计模式。',
      rating: 4.5,
      totalCopies: 6,
      availableCopies: 4,
      tags: ['设计模式', '面向对象', '软件工程']
    },
    {
      id: '6',
      title: 'Node.js实战',
      author: 'Mike Cantelon',
      isbn: '978-7-115-35234-1',
      category: '计算机科学',
      publishYear: 2022,
      publisher: '人民邮电出版社',
      description: '全面介绍Node.js开发的实战技巧和最佳实践。',
      rating: 4.4,
      totalCopies: 9,
      availableCopies: 6,
      tags: ['Node.js', '后端开发', 'JavaScript']
    }
  ];

  /**
   * 初始化数据
   */
  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
      setIsLoading(false);
    }, 1000);
  }, []);

  /**
   * 搜索和筛选逻辑
   */
  useEffect(() => {
    let result = books;

    // 搜索过滤
    if (searchTerm) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 分类过滤
    if (filters.category) {
      result = result.filter(book => book.category === filters.category);
    }

    // 出版年份过滤
    if (filters.publishYear) {
      const year = parseInt(filters.publishYear);
      result = result.filter(book => book.publishYear >= year);
    }

    // 可用性过滤
    if (filters.availability === 'available') {
      result = result.filter(book => book.availableCopies > 0);
    } else if (filters.availability === 'unavailable') {
      result = result.filter(book => book.availableCopies === 0);
    }

    // 评分过滤
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      result = result.filter(book => book.rating >= minRating);
    }

    setFilteredBooks(result);
    setCurrentPage(1);
  }, [searchTerm, filters, books]);

  /**
   * 处理筛选条件变化
   */
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  /**
   * 清除所有筛选条件
   */
  const clearFilters = () => {
    setFilters({
      category: '',
      publishYear: '',
      availability: '',
      rating: ''
    });
    setSearchTerm('');
  };

  /**
   * 渲染星级评分
   */
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // 分页计算
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  /**
   * 图书卡片组件
   */
  const BookCard = ({ book }: { book: Book }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* 图书封面 */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <BookOpen className="w-16 h-16 text-blue-500 dark:text-blue-400" />
        )}
        {/* 可用性标识 */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
          book.availableCopies > 0 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {book.availableCopies > 0 ? '可借阅' : '已借完'}
        </div>
      </div>

      {/* 图书信息 */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {book.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <User className="w-4 h-4" />
          <span>{book.author}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{book.publishYear}年 · {book.publisher}</span>
        </div>
        
        {/* 评分 */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {renderStars(book.rating)}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{book.rating}</span>
        </div>
        
        {/* 标签 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {book.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        {/* 库存信息 */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          可借: {book.availableCopies}/{book.totalCopies} 本
        </div>
        
        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium">
            查看详情
          </button>
          <button 
            disabled={book.availableCopies === 0}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
              book.availableCopies > 0
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {book.availableCopies > 0 ? '借阅' : '已借完'}
          </button>
        </div>
      </div>
    </div>
  );

  /**
   * 列表视图图书项组件
   */
  const BookListItem = ({ book }: { book: Book }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4">
      <div className="flex gap-4">
        {/* 图书封面 */}
        <div className="w-20 h-28 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <BookOpen className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          )}
        </div>
        
        {/* 图书信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
              {book.title}
            </h3>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ml-4 ${
              book.availableCopies > 0 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {book.availableCopies > 0 ? '可借阅' : '已借完'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{book.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{book.publishYear}年 · {book.publisher}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {book.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* 评分 */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(book.rating)}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{book.rating}</span>
              </div>
              
              {/* 库存 */}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                可借: {book.availableCopies}/{book.totalCopies}
              </span>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium">
                查看详情
              </button>
              <button 
                disabled={book.availableCopies === 0}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  book.availableCopies > 0
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {book.availableCopies > 0 ? '借阅' : '已借完'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载图书目录中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            图书目录
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            发现知识的宝藏，开启学习的旅程
          </p>
        </div>

        {/* 搜索和筛选栏 */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-600/30 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索图书标题、作者或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            {/* 筛选按钮 */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 font-medium"
            >
              <Filter className="w-5 h-5" />
              筛选
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* 视图切换 */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Grid className="w-4 h-4" />
                网格
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
                列表
              </button>
            </div>
          </div>
          
          {/* 筛选选项 */}
          {isFilterOpen && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 分类筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    分类
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">所有分类</option>
                    <option value="计算机科学">计算机科学</option>
                    <option value="文学">文学</option>
                    <option value="历史">历史</option>
                    <option value="科学">科学</option>
                  </select>
                </div>
                
                {/* 出版年份筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    出版年份
                  </label>
                  <select
                    value={filters.publishYear}
                    onChange={(e) => handleFilterChange('publishYear', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">所有年份</option>
                    <option value="2020">2020年及以后</option>
                    <option value="2015">2015年及以后</option>
                    <option value="2010">2010年及以后</option>
                  </select>
                </div>
                
                {/* 可用性筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    可用性
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) => handleFilterChange('availability', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">全部</option>
                    <option value="available">可借阅</option>
                    <option value="unavailable">已借完</option>
                  </select>
                </div>
                
                {/* 评分筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    最低评分
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">所有评分</option>
                    <option value="4.5">4.5星及以上</option>
                    <option value="4.0">4.0星及以上</option>
                    <option value="3.5">3.5星及以上</option>
                  </select>
                </div>
              </div>
              
              {/* 清除筛选按钮 */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  清除筛选
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 结果统计 */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            共找到 <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredBooks.length}</span> 本图书
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            第 {startIndex + 1}-{Math.min(endIndex, filteredBooks.length)} 本，共 {filteredBooks.length} 本
          </p>
        </div>

        {/* 图书展示区域 */}
        {currentBooks.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              未找到相关图书
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              请尝试调整搜索条件或筛选选项
            </p>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }`}>
            {currentBooks.map((book) => (
              viewMode === 'grid' ? (
                <BookCard key={book.id} book={book} />
              ) : (
                <BookListItem key={book.id} book={book} />
              )
            ))}
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-12 gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
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
                    return <span key={page} className="px-2 py-2 text-gray-400">...</span>;
                  }
                  return null;
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                      isCurrentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              下一页
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}