"use client"
import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Star, ArrowRight, Users, Award } from 'lucide-react';

/**
 * 图书馆首页 Hero Section 组件
 * 具有现代化异形设计和动画效果
 */
export default function Herosction() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // 轮播数据
  const slides = [
    {
      title: "探索知识可能",
      subtitle: "在这里发现属于你的精神世界",
      image: "📚",
      color: "from-blue-600 to-purple-600"
    },
    {
      title: "数字化阅读体验",
      subtitle: "传统与现代的完美融合",
      image: "💻",
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "学术研究支持",
      subtitle: "为您的研究提供强大支撑",
      image: "🔬",
      color: "from-pink-600 to-orange-600"
    }
  ];

  /**
   * 组件挂载时触发入场动画
   */
  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  /**
   * 处理轮播点击切换
   */
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* 局部装饰 */}
      <div className="absolute inset-0">
        {/* 重点装饰圆形 */}
        <div className="absolute top-32 right-20 w-32 h-32 bg-gradient-to-r from-yellow-400/15 to-orange-400/15 dark:from-yellow-600/25 dark:to-orange-600/25 rounded-full blur-2xl animate-pulse transition-colors duration-300"></div>
        <div className="absolute bottom-40 left-16 w-24 h-24 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 dark:from-cyan-600/25 dark:to-blue-600/25 rounded-full blur-xl animate-pulse delay-1000 transition-colors duration-300"></div>
      </div>

      {/* 主要内容区域 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* 左侧内容 */}
          <div className={`space-y-8 transition-all duration-1000 transform ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
          }`}>
            {/* 标题区域 */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 dark:border-gray-600/30 transition-colors duration-300">
                <Star className="w-4 h-4 text-yellow-400 dark:text-yellow-500 animate-spin transition-colors duration-300" />
                <span className="text-sm text-white/90 dark:text-gray-300 font-medium transition-colors duration-300">智慧图书馆 2024</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white dark:text-gray-100 leading-tight transition-colors duration-300">
                <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 dark:from-yellow-500 dark:via-pink-500 dark:to-purple-500 bg-clip-text text-transparent animate-gradient transition-colors duration-300">
                  {slides[currentSlide]?.title ?? '欢迎来到图书馆'}
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-purple-200 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                {slides[currentSlide]?.subtitle ?? '欢迎探索'}
              </p>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: BookOpen, number: "50K+", label: "藏书量" },
                { icon: Users, number: "10K+", label: "注册用户" },
                { icon: Award, number: "24/7", label: "在线服务" }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="text-center p-4 bg-white/5 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 dark:border-gray-600/20 hover:bg-white/10 dark:hover:bg-gray-700/30 transition-all duration-300 transform hover:scale-105"
                  >
                    <Icon className="w-8 h-8 text-purple-400 dark:text-purple-500 mx-auto mb-2 animate-bounce transition-colors duration-300" style={{ animationDelay: `${index * 0.2}s` }} />
                    <div className="text-2xl font-bold text-white dark:text-gray-100 transition-colors duration-300">{stat.number}</div>
                    <div className="text-sm text-purple-200 dark:text-gray-300 transition-colors duration-300">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* 行动按钮 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>开始探索</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-semibold text-lg border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105">
                了解更多
              </button>
            </div>
          </div>

          {/* 右侧视觉区域 */}
          <div className={`relative transition-all duration-1000 delay-300 transform ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
          }`}>
            {/* 主要展示卡片 */}
            <div className="relative">
              {/* 背景装饰 */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl transform rotate-6 scale-105"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl transform -rotate-3 scale-110"></div>
              
              {/* 主卡片 */}
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                {/* 轮播内容 */}
                <div className="text-center space-y-6">
                  <div className="text-8xl animate-bounce">
                    {slides[currentSlide]?.image}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">
                      {slides[currentSlide]?.title ?? '欢迎来到图书馆'}
                    </h3>
                    <p className="text-purple-200">
                      {slides[currentSlide]?.subtitle ?? '欢迎探索'}
                    </p>
                  </div>
                  
                  {/* 轮播指示器 */}
                  <div className="flex justify-center space-x-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlideChange(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? 'bg-white scale-125'
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* 浮动装饰元素 */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-pulse delay-1000"></div>
              </div>
              
              {/* 周围的小装饰卡片 */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-blue-400/30 to-purple-400/30 backdrop-blur-sm rounded-2xl rotate-12 animate-float"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-br from-pink-400/30 to-orange-400/30 backdrop-blur-sm rounded-xl -rotate-12 animate-float delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
      {/* 自定义动画样式 */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
