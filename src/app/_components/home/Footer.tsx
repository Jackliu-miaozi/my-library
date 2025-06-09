"use client";
import React from "react";
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Facebook,
  Instagram,
  Heart,
  ArrowUp,
} from "lucide-react";

/**
 * 图书馆Footer组件
 * 具有现代化异形设计和动画效果，与整体风格保持一致
 */
const Footer = () => {
  /**
   * 滚动到页面顶部
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-white/5 text-white backdrop-blur-lg transition-colors duration-300 dark:border-gray-600/20 dark:bg-gray-800/10 dark:text-gray-200">
      {/* 主要内容区域 */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo和简介 */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="flex h-12 w-12 rotate-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                  <BookOpen className="h-6 w-6 -rotate-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full bg-pink-400"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white transition-colors duration-300 dark:text-gray-100">
                  智慧图书馆
                </h3>
                <p className="text-purple-200 transition-colors duration-300 dark:text-gray-400">
                  Knowledge Gateway
                </p>
              </div>
            </div>

            <p className="max-w-md leading-relaxed text-purple-200 transition-colors duration-300 dark:text-gray-300">
              致力于为读者提供最优质的阅读体验和学术研究支持，连接传统与现代，开启知识探索之旅。
            </p>

            {/* 社交媒体链接 */}
            <div className="flex space-x-4">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:text-white dark:border-gray-600/30 dark:bg-gray-800/30 dark:text-gray-300 dark:hover:bg-gray-700/40 dark:hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* 快速链接 */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white transition-colors duration-300 dark:text-gray-100">
              快速链接
            </h4>
            <ul className="space-y-3">
              {[
                "图书检索",
                "数字资源",
                "学术研究",
                "读者服务",
                "新书推荐",
                "活动预告",
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="group flex items-center space-x-2 text-purple-200 transition-colors duration-300 hover:text-white dark:text-gray-400 dark:hover:text-white"
                  >
                    <span className="h-1 w-1 rounded-full bg-purple-400 transition-all duration-300 group-hover:w-2 dark:bg-purple-500"></span>
                    <span>{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 联系信息 */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white transition-colors duration-300 dark:text-gray-100">
              联系我们
            </h4>
            <div className="space-y-4">
              {[
                { icon: MapPin, text: "北京市海淀区知识路123号" },
                { icon: Phone, text: "+86 010-1234-5678" },
                { icon: Mail, text: "info@library.edu.cn" },
              ].map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-purple-200 transition-colors duration-300 dark:text-gray-400"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm dark:bg-gray-800/30">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{contact.text}</span>
                  </div>
                );
              })}
            </div>

            {/* 开放时间 */}
            <div className="mt-6">
              <h5 className="mb-2 text-sm font-medium text-white transition-colors duration-300 dark:text-gray-100">
                开放时间
              </h5>
              <div className="space-y-1 text-sm text-purple-200 transition-colors duration-300 dark:text-gray-400">
                <div>周一至周五: 8:00 - 22:00</div>
                <div>周末假日: 9:00 - 18:00</div>
              </div>
            </div>
          </div>
        </div>

        {/* 分割线 */}
        <div className="mt-12 border-t border-white/10 pt-8 transition-colors duration-300 dark:border-gray-700/30">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            {/* 版权信息 */}
            <div className="flex items-center space-x-2 text-sm text-purple-200 transition-colors duration-300 dark:text-gray-400">
              <span>© 2024 智慧图书馆. 保留所有权利.</span>
              <Heart className="h-4 w-4 animate-pulse text-pink-400" />
              <span>用心服务每一位读者</span>
            </div>

            {/* 回到顶部按钮 */}
            <button
              onClick={scrollToTop}
              className="group flex items-center space-x-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:text-white dark:border-gray-600/30 dark:bg-gray-800/30 dark:text-gray-300 dark:hover:bg-gray-700/40 dark:hover:text-white"
            >
              <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" />
              <span className="text-sm">回到顶部</span>
            </button>
          </div>
        </div>
      </div>
      {/* 浮动装饰点 */}
      <div className="absolute bottom-4 left-4 h-2 w-2 animate-pulse rounded-full bg-yellow-400"></div>
      <div className="absolute right-8 bottom-8 h-3 w-3 animate-pulse rounded-full bg-pink-400 delay-1000"></div>
      <div className="absolute bottom-12 left-1/2 h-1 w-1 animate-pulse rounded-full bg-blue-400 delay-2000"></div>
    </footer>
  );
};

export default Footer;
