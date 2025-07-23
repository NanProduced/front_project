"use client";

import { useState, useEffect, useRef } from 'react';
import { SITES, SiteConfig, SITE_STORAGE_KEY } from '@/config/sites';
import { useRouter } from 'next/navigation';

interface SiteSelectorProps {
  onChange?: (site: SiteConfig) => void;
  className?: string;
  mode?: 'light' | 'dark';
  readOnly?: boolean; // 新增只读模式属性
}

const SiteSelector: React.FC<SiteSelectorProps> = ({ 
  onChange, 
  className = '', 
  mode = 'dark',
  readOnly = false // 默认为可选择模式
}) => {
  // 获取存储的站点ID
  const getStoredSiteId = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SITE_STORAGE_KEY);
    }
    return null;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<SiteConfig | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 初始化选定站点
  useEffect(() => {
    const storedSiteId = getStoredSiteId();
    const initialSite = storedSiteId 
      ? SITES.find(site => site.id === storedSiteId) || SITES.find(site => site.isDefault)
      : SITES.find(site => site.isDefault);
    
    setSelectedSite(initialSite || SITES[0]);
  }, []);

  // 处理点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 选择站点
  const handleSelectSite = (site: SiteConfig) => {
    setSelectedSite(site);
    setIsOpen(false);
    
    // 保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(SITE_STORAGE_KEY, site.id);
    }
    
    // 通知父组件站点变更
    if (onChange) {
      onChange(site);
    }
    
    // 简单提示反馈
    showFeedback(site);
  };

  // 显示切换反馈
  const showFeedback = (site: SiteConfig) => {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-opacity duration-500 flex items-center';
    toast.innerHTML = `
      <span class="mr-2">${site.flag}</span>
      <span>已切换到${site.name}站点</span>
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 淡出效果
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 2000);
  };

  // 暗色/亮色模式样式
  const colorClasses = mode === 'light' 
    ? 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50' 
    : 'bg-[#0f172a] text-gray-300 border-gray-800 hover:bg-[#1a2544]';

  if (!selectedSite) return null;

  // 如果是只读模式，则只显示当前站点信息
  if (readOnly) {
    return (
      <div className={`${className} flex items-center gap-2 px-3 py-2 rounded-md ${mode === 'light' ? 'text-gray-800' : 'text-gray-300'}`}>
        <span className="text-lg mr-0.5">{selectedSite.flag}</span>
        <span className="font-medium whitespace-nowrap">{selectedSite.name}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 选择器按钮 */}
      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-md border ${colorClasses} transition-colors`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="选择服务区域"
      >
        <span className="text-lg mr-0.5">{selectedSite.flag}</span>
        <span className="font-medium whitespace-nowrap">{selectedSite.name}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div 
          className={`absolute z-20 mt-2 w-56 rounded-md shadow-lg overflow-hidden ${mode === 'light' ? 'bg-white' : 'bg-[#0f172a] border border-gray-800'}`}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-700">选择服务区域</div>
            {SITES.map((site) => (
              <button
                key={site.id}
                className={`
                  w-full text-left px-4 py-3 flex items-center gap-3 
                  ${selectedSite.id === site.id ? (mode === 'light' ? 'bg-gray-100' : 'bg-blue-900/20') : ''}
                  ${mode === 'light' ? 'hover:bg-gray-50' : 'hover:bg-[#1a2544]'}
                  ${selectedSite.id === site.id ? (mode === 'light' ? 'font-medium' : 'text-blue-400') : (mode === 'light' ? 'text-gray-700' : 'text-gray-300')}
                `}
                onClick={() => handleSelectSite(site)}
                role="menuitem"
                disabled={site.gatewayUrl === '#'}
              >
                <span className="text-lg flex-shrink-0">{site.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{site.name}</span>
                  <span className="text-xs text-gray-500">{site.region}</span>
                </div>
                {selectedSite.id === site.id && (
                  <svg className="ml-auto h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {site.gatewayUrl === '#' && (
                  <span className="ml-auto text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">即将上线</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteSelector; 