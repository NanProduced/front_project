import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#050b1f] overflow-hidden">
      {/* 背景星星效果 */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-500/20"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.3,
              animationDuration: Math.random() * 5 + 3 + 's',
            }}
          />
        ))}
      </div>
      
      {/* 主要内容 */}
      <div className="container mx-auto px-6 md:px-16 z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="md:w-1/2 text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Imagined For<br />
            <span className="text-blue-400">
              The Cloud Platform
            </span>
          </h1>
          <div className="bg-blue-500 h-1 w-16 mb-8"></div>
          <p className="text-xl md:text-2xl mb-6 text-gray-300 font-light">
            A new solution<br />
            for every step
          </p>
          <p className="text-gray-400 mb-10 max-w-lg">
            轻松管理您的LED播放设备，实现高效率的内容控制和管理
          </p>
          <Link href="/login" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-all duration-300 tracking-wide">
            Login Now
          </Link>

          {/* 客户评价 - 移动到按钮下方 */}
          <div className="mt-12 max-w-md flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/30 flex-shrink-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-300 italic mb-1">
                "The best platform for cloud management we've tried — it's loaded with features."
              </p>
              <p className="font-medium text-sm">Clara Smith</p>
              <p className="text-xs text-gray-400">Marketing Director</p>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 relative flex justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            {/* 云图标 - 使用更简洁的设计 */}
            <div className="absolute inset-0 flex items-center justify-center animate-float">
              <div className="w-64 h-64 relative">
                <div className="absolute w-full h-full rounded-full bg-blue-500/5"></div>
                <div className="absolute w-full h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* 底部反光效果 */}
            <div className="absolute bottom-0 w-full flex justify-center">
              <div className="w-48 h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent rounded-full blur-md"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部引导区 */}
      <div className="absolute bottom-4 left-0 right-0 z-10">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-2xl mx-auto bg-[#050f2e]/40 backdrop-blur-sm py-4 px-5 rounded-lg text-center">
            <p className="text-base text-white mb-2 font-light">
              "The best platform for cloud management we've tried — it's loaded with features."
            </p>
            
            <p className="text-gray-400 mt-2 text-xs">
              Are you nerpy to use our platform?
            </p>
            
            {/* 下滑箭头指示器 */}
            <div className="flex justify-center mt-3 animate-bounce">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-blue-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 