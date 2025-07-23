"use client";

import React, { useState, useEffect } from 'react';
import { SITES, SiteConfig } from '@/config/sites';

interface SiteSelectorProps {
  onChange?: (site: SiteConfig) => void;
  className?: string;
  readOnly?: boolean; // 添加只读属性
}

const SiteSelector: React.FC<SiteSelectorProps> = ({ onChange, className = '', readOnly = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<SiteConfig>(SITES[0]);

  useEffect(() => {
    // 关闭下拉菜单的点击外部事件监听
    const handleClickOutside = () => setIsOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSiteChange = (site: SiteConfig) => {
    // 如果是只读模式，则不允许切换站点
    if (readOnly) return;
    
    setSelectedSite(site);
    setIsOpen(false);
    if (onChange) {
      onChange(site);
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    // 如果是只读模式，则不允许打开下拉菜单
    if (readOnly) return;
    
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center px-3 py-1.5 rounded-md ${
          readOnly 
            ? 'text-gray-400 cursor-default' 
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
        disabled={readOnly}
      >
        <span className="mr-2 flex-shrink-0 text-lg">
          {selectedSite.flag}
        </span>
        <span className="text-sm font-medium">{selectedSite.name}</span>
        {!readOnly && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && !readOnly && (
        <div className="absolute right-0 mt-2 w-48 bg-[#0f172a] border border-gray-800 rounded-md shadow-lg z-20">
          <div className="py-1">
            {SITES.map((site) => (
              <button
                key={site.id}
                onClick={() => handleSiteChange(site)}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  selectedSite.id === site.id 
                    ? 'bg-blue-900/20 text-blue-400' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span className="mr-2 flex-shrink-0 text-lg">
                  {site.flag}
                </span>
                {site.name}
                {site.gatewayUrl === '#' && (
                  <span className="ml-auto text-xs text-gray-500">即将上线</span>
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