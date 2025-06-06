import React from 'react'
import Navbar from '../_components/home/Navbar'
import Herosction from '../_components/home/Herosction'
import ThemeToggle from '../_components/ThemeToggle'
import Footer from '../_components/home/Footer'
import UnifiedBackground from '../_components/UnifiedBackground'

export default function page() {
  return (
    <UnifiedBackground>
      {/* 导航栏区域 */}
      <section className="relative">
        <Navbar />
      </section>
      
      {/* 主要内容区域 */}
      <section className="relative">
        <Herosction />
      </section>
      
      {/* 主题切换区域 */}
      <section className="relative py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <ThemeToggle />
        </div>
      </section>
      
      {/* 页脚区域 */}
      <section className="relative">
        <Footer />
      </section>
    </UnifiedBackground>
  )
}
