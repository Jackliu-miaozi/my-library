"use client";
import React from "react";
import { Sparkles } from "lucide-react";

/**
 * 统一背景组件
 * 为所有section提供一致的背景样式和动画效果
 */
export default function UnifiedBackground({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 transition-colors duration-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${className}`}
    >
      {/* 动态背景装饰 */}
      <div className="absolute inset-0">
        {/* 浮动圆形装饰 */}
        <div className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl transition-colors duration-300 dark:from-blue-600/30 dark:to-purple-600/30"></div>
        <div className="absolute right-10 bottom-20 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-pink-400/20 to-orange-400/20 blur-3xl transition-colors delay-1000 duration-300 dark:from-pink-600/30 dark:to-orange-600/30"></div>
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-gradient-to-r from-yellow-400/10 to-red-400/10 blur-2xl transition-colors delay-2000 duration-300 dark:from-yellow-600/20 dark:to-red-600/20"></div>

        {/* 额外的装饰圆形 */}
        <div className="absolute top-10 right-1/4 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-cyan-400/15 to-blue-400/15 blur-2xl transition-colors delay-500 duration-300 dark:from-cyan-600/25 dark:to-blue-600/25"></div>
        <div className="absolute bottom-32 left-1/3 h-56 w-56 animate-pulse rounded-full bg-gradient-to-r from-emerald-400/15 to-teal-400/15 blur-2xl transition-colors delay-1500 duration-300 dark:from-emerald-600/25 dark:to-teal-600/25"></div>

        {/* 星星动画 */}
        {Array.from({ length: 30 }).map((_, i) => {
          // 使用固定的预定义值避免水合错误
          const positions = [
            { left: 10, top: 20, delay: 0.5, duration: 3.2 },
            { left: 85, top: 15, delay: 1.2, duration: 2.8 },
            { left: 25, top: 70, delay: 2.1, duration: 4.1 },
            { left: 60, top: 35, delay: 0.8, duration: 3.5 },
            { left: 90, top: 80, delay: 1.8, duration: 2.5 },
            { left: 15, top: 45, delay: 3.2, duration: 3.8 },
            { left: 75, top: 25, delay: 0.3, duration: 4.2 },
            { left: 40, top: 85, delay: 2.5, duration: 2.9 },
            { left: 95, top: 10, delay: 1.5, duration: 3.6 },
            { left: 30, top: 60, delay: 4.1, duration: 2.7 },
            { left: 70, top: 90, delay: 0.9, duration: 4.0 },
            { left: 5, top: 75, delay: 2.8, duration: 3.1 },
            { left: 55, top: 5, delay: 1.7, duration: 3.9 },
            { left: 80, top: 55, delay: 3.5, duration: 2.6 },
            { left: 20, top: 30, delay: 0.6, duration: 4.3 },
            { left: 65, top: 75, delay: 2.2, duration: 3.3 },
            { left: 35, top: 95, delay: 1.1, duration: 2.8 },
            { left: 85, top: 40, delay: 3.8, duration: 3.7 },
            { left: 10, top: 65, delay: 0.4, duration: 4.1 },
            { left: 50, top: 20, delay: 2.6, duration: 2.9 },
            { left: 75, top: 85, delay: 1.9, duration: 3.4 },
            { left: 25, top: 50, delay: 4.2, duration: 2.7 },
            { left: 90, top: 30, delay: 0.7, duration: 3.8 },
            { left: 45, top: 10, delay: 2.9, duration: 4.0 },
            { left: 15, top: 80, delay: 1.4, duration: 3.2 },
            { left: 70, top: 60, delay: 3.6, duration: 2.8 },
            { left: 95, top: 45, delay: 0.2, duration: 4.4 },
            { left: 35, top: 25, delay: 2.3, duration: 3.1 },
            { left: 60, top: 90, delay: 1.6, duration: 3.6 },
            { left: 80, top: 15, delay: 4.0, duration: 2.5 },
          ];
          const pos = positions[i % positions.length];

          return (
            <div
              key={i}
              className="animate-twinkle absolute"
              style={{
                left: `${pos?.left ?? 0}%`,
                top: `${pos?.top ?? 0}%`,
                animationDelay: `${pos?.delay ?? 0}s`,
                animationDuration: `${pos?.duration ?? 0}s`,
              }}
            >
              <Sparkles className="h-3 w-3 text-white/20 transition-colors duration-300 dark:text-gray-400/30" />
            </div>
          );
        })}

        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-5 transition-opacity duration-300 dark:opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="relative z-10">{children}</div>

      {/* 自定义动画样式 */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.3) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
