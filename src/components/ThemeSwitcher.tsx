"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 确保组件挂载后再渲染，避免服务端渲染与客户端不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  // 组件挂载前返回空占位符，避免闪烁
  if (!mounted) {
    return <div className={`w-8 h-8 ${className}`} />;
  }

  return (
    <button 
      onClick={toggleTheme} 
      className={`p-2 rounded-full transition-colors flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gray-800 hover:bg-gray-700 text-yellow-300' 
          : 'bg-gray-200 hover:bg-gray-300 text-blue-600'
      } ${className}`}
      aria-label={theme === 'dark' ? '切换到明亮模式' : '切换到暗黑模式'}
      title={theme === 'dark' ? '切换到明亮模式' : '切换到暗黑模式'}
    >
      {theme === 'dark' ? (
        // 太阳图标 - 明亮模式
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        // 月亮图标 - 暗黑模式
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeSwitcher; 