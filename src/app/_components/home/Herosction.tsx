"use client";
import React, { useState, useEffect } from "react";
import { BookOpen, Search, Star, ArrowRight, Users, Award } from "lucide-react";

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
      color: "from-blue-600 to-purple-600",
    },
    {
      title: "数字化阅读体验",
      subtitle: "传统与现代的完美融合",
      image: "💻",
      color: "from-purple-600 to-pink-600",
    },
    {
      title: "学术研究支持",
      subtitle: "为您的研究提供强大支撑",
      image: "🔬",
      color: "from-pink-600 to-orange-600",
    },
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
        <div className="absolute top-32 right-20 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-yellow-400/15 to-orange-400/15 blur-2xl transition-colors duration-300 dark:from-yellow-600/25 dark:to-orange-600/25"></div>
        <div className="absolute bottom-40 left-16 h-24 w-24 animate-pulse rounded-full bg-gradient-to-r from-cyan-400/15 to-blue-400/15 blur-xl transition-colors delay-1000 duration-300 dark:from-cyan-600/25 dark:to-blue-600/25"></div>
      </div>

      {/* 主要内容区域 */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="grid min-h-[80vh] items-center gap-12 lg:grid-cols-2">
          {/* 左侧内容 */}
          <div
            className={`transform space-y-8 transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-20 opacity-0"
            }`}
          >
            {/* 标题区域 */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm transition-colors duration-300 dark:border-gray-600/30 dark:bg-gray-800/30">
                <Star className="h-4 w-4 animate-spin text-yellow-400 transition-colors duration-300 dark:text-yellow-500" />
                <span className="text-sm font-medium text-white/90 transition-colors duration-300 dark:text-gray-300">
                  智慧图书馆 2024
                </span>
              </div>

              <h1 className="text-5xl leading-tight font-bold text-white transition-colors duration-300 lg:text-7xl dark:text-gray-100">
                <span className="animate-gradient bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent transition-colors duration-300 dark:from-yellow-500 dark:via-pink-500 dark:to-purple-500">
                  {slides[currentSlide]?.title ?? "欢迎来到图书馆"}
                </span>
              </h1>

              <p className="text-xl leading-relaxed text-purple-200 transition-colors duration-300 lg:text-2xl dark:text-gray-300">
                {slides[currentSlide]?.subtitle ?? "欢迎探索"}
              </p>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: BookOpen, number: "50K+", label: "藏书量" },
                { icon: Users, number: "10K+", label: "注册用户" },
                { icon: Award, number: "24/7", label: "在线服务" },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="transform rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 dark:border-gray-600/20 dark:bg-gray-800/20 dark:hover:bg-gray-700/30"
                  >
                    <Icon
                      className="mx-auto mb-2 h-8 w-8 animate-bounce text-purple-400 transition-colors duration-300 dark:text-purple-500"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    />
                    <div className="text-2xl font-bold text-white transition-colors duration-300 dark:text-gray-100">
                      {stat.number}
                    </div>
                    <div className="text-sm text-purple-200 transition-colors duration-300 dark:text-gray-300">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 行动按钮 */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="group relative transform rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-purple-500/25">
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>开始探索</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </button>

              <button className="transform rounded-2xl border-2 border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white/20">
                了解更多
              </button>
            </div>
          </div>

          {/* 右侧视觉区域 */}
          <div
            className={`relative transform transition-all delay-300 duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-20 opacity-0"
            }`}
          >
            {/* 主要展示卡片 */}
            <div className="relative">
              {/* 背景装饰 */}
              <div className="absolute inset-0 scale-105 rotate-6 transform rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"></div>
              <div className="absolute inset-0 scale-110 -rotate-3 transform rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm"></div>

              {/* 主卡片 */}
              <div className="relative rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg">
                {/* 轮播内容 */}
                <div className="space-y-6 text-center">
                  <div className="animate-bounce text-8xl">
                    {slides[currentSlide]?.image}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">
                      {slides[currentSlide]?.title ?? "欢迎来到图书馆"}
                    </h3>
                    <p className="text-purple-200">
                      {slides[currentSlide]?.subtitle ?? "欢迎探索"}
                    </p>
                  </div>

                  {/* 轮播指示器 */}
                  <div className="flex justify-center space-x-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlideChange(index)}
                        className={`h-3 w-3 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? "scale-125 bg-white"
                            : "bg-white/40 hover:bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* 浮动装饰元素 */}
                <div className="absolute -top-4 -right-4 h-8 w-8 animate-pulse rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"></div>
                <div className="absolute -bottom-2 -left-2 h-6 w-6 animate-pulse rounded-full bg-gradient-to-br from-pink-400 to-purple-500 delay-1000"></div>
              </div>

              {/* 周围的小装饰卡片 */}
              <div className="animate-float absolute -top-8 -left-8 h-16 w-16 rotate-12 rounded-2xl bg-gradient-to-br from-blue-400/30 to-purple-400/30 backdrop-blur-sm"></div>
              <div className="animate-float absolute -right-6 -bottom-6 h-12 w-12 -rotate-12 rounded-xl bg-gradient-to-br from-pink-400/30 to-orange-400/30 backdrop-blur-sm delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
      {/* 自定义动画样式 */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(-5px) rotate(-1deg);
          }
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
