"use client"
import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * 主题切换悬浮挂件组件
 * 悬浮在页面右下角，提供主题切换功能
 */
export default function ThemeToggle() {
  const { theme, toggleTheme, isLoading } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 组件挂载后显示动画
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // 获取当前主题图标
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      case 'system':
        return <Monitor className="w-5 h-5" />;
      default:
        return <Palette className="w-5 h-5" />;
    }
  };

  // 获取主题显示文本
  const getThemeText = () => {
    switch (theme) {
      case 'light':
        return '浅色';
      case 'dark':
        return '深色';
      case 'system':
        return '跟随系统';
      default:
        return '主题';
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      {/* 悬浮挂件 */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 主按钮 */}
        <button
          onClick={toggleTheme}
          className={`group relative overflow-hidden bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${
            isHovered ? 'bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30' : ''
          }`}
          aria-label="切换主题"
        >
          {/* 背景动画 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          
          {/* 图标容器 */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="text-white group-hover:text-yellow-300 transition-colors duration-300 transform group-hover:rotate-12">
              {getThemeIcon()}
            </div>
          </div>
          
          {/* 悬浮时的装饰光效 */}
          <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-500"></div>
          </div>
        </button>

        {/* 悬浮提示文本 */}
        <div
          className={`absolute bottom-full right-0 mb-3 px-3 py-2 bg-black/80 backdrop-blur-sm text-white text-sm rounded-lg border border-white/20 whitespace-nowrap transition-all duration-300 transform ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 pointer-events-none'
          }`}
        >
          <span className="font-medium">{getThemeText()}</span>
          <div className="text-xs text-gray-300 mt-1">点击切换主题</div>
          
          {/* 箭头指示器 */}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black/80"></div>
        </div>
      </div>

      {/* 背景装饰粒子 */}
      {isHovered && (
        <div className="fixed bottom-6 right-6 z-40 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => {
            // 使用固定的预定义值避免水合错误
            const particlePositions = [
              { left: -20, top: -15, delay: 0.2, duration: 1.8 },
              { left: 25, top: -25, delay: 0.5, duration: 2.1 },
              { left: -10, top: 20, delay: 0.8, duration: 1.6 },
              { left: 15, top: 10, delay: 0.3, duration: 2.3 },
              { left: -25, top: 5, delay: 0.7, duration: 1.9 },
              { left: 20, top: -20, delay: 0.1, duration: 2.0 }
            ];
            const pos = particlePositions[i];
            
            return (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${pos?.left ?? 0}px`,
                  top: `${pos?.top ?? 0}px`,
                  animationDelay: `${pos?.delay ?? 0}s`,
                  animationDuration: `${pos?.duration ?? 0}s`
                }}
              >
                <div className="w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"></div>
              </div>
            );
          })}
        </div>
      )}

      {/* 自定义动画样式 */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.6), 0 0 40px rgba(236, 72, 153, 0.3); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
