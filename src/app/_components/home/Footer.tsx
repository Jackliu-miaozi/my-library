"use client"
import React from 'react';
import { BookOpen, Mail, Phone, MapPin, Github, Twitter, Facebook, Instagram, Heart, ArrowUp } from 'lucide-react';

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
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative bg-white/5 dark:bg-gray-800/10 backdrop-blur-lg text-white dark:text-gray-200 overflow-hidden border-t border-white/10 dark:border-gray-600/20 transition-colors duration-300">
      {/* 主要内容区域 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo和简介 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl rotate-12 flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white -rotate-12" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white dark:text-gray-100 transition-colors duration-300">智慧图书馆</h3>
                <p className="text-purple-200 dark:text-gray-400 transition-colors duration-300">Knowledge Gateway</p>
              </div>
            </div>

            <p className="text-purple-200 dark:text-gray-300 leading-relaxed max-w-md transition-colors duration-300">
              致力于为读者提供最优质的阅读体验和学术研究支持，连接传统与现代，开启知识探索之旅。
            </p>

            {/* 社交媒体链接 */}
            <div className="flex space-x-4">
              {[
                { icon: Github, href: '#', label: 'GitHub' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' }
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white/80 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/40 hover:text-white dark:hover:text-white hover:scale-110 transition-all duration-300 border border-white/20 dark:border-gray-600/30"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* 快速链接 */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white dark:text-gray-100 transition-colors duration-300">快速链接</h4>
            <ul className="space-y-3">
              {[
                '图书检索',
                '数字资源',
                '学术研究',
                '读者服务',
                '新书推荐',
                '活动预告'
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-purple-200 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <span className="w-1 h-1 bg-purple-400 dark:bg-purple-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                    <span>{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 联系信息 */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white dark:text-gray-100 transition-colors duration-300">联系我们</h4>
            <div className="space-y-4">
              {[
                { icon: MapPin, text: '北京市海淀区知识路123号' },
                { icon: Phone, text: '+86 010-1234-5678' },
                { icon: Mail, text: 'info@library.edu.cn' }
              ].map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 text-purple-200 dark:text-gray-400 transition-colors duration-300">
                    <div className="w-8 h-8 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{contact.text}</span>
                  </div>
                );
              })}
            </div>

            {/* 开放时间 */}
            <div className="mt-6">
              <h5 className="text-sm font-medium text-white dark:text-gray-100 mb-2 transition-colors duration-300">开放时间</h5>
              <div className="text-sm text-purple-200 dark:text-gray-400 space-y-1 transition-colors duration-300">
                <div>周一至周五: 8:00 - 22:00</div>
                <div>周末假日: 9:00 - 18:00</div>
              </div>
            </div>
          </div>
        </div>

        {/* 分割线 */}
        <div className="mt-12 pt-8 border-t border-white/10 dark:border-gray-700/30 transition-colors duration-300">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* 版权信息 */}
            <div className="flex items-center space-x-2 text-purple-200 dark:text-gray-400 text-sm transition-colors duration-300">
              <span>© 2024 智慧图书馆. 保留所有权利.</span>
              <Heart className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>用心服务每一位读者</span>
            </div>

            {/* 回到顶部按钮 */}
            <button
              onClick={scrollToTop}
              className="group flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-full text-white/80 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/40 hover:text-white dark:hover:text-white transition-all duration-300 border border-white/20 dark:border-gray-600/30"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
              <span className="text-sm">回到顶部</span>
            </button>
          </div>
        </div>
      </div>
      {/* 浮动装饰点 */}
      <div className="absolute bottom-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-8 right-8 w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-12 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-2000"></div>
    </footer>
  );
};

export default Footer;
