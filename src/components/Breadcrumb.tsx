"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  path: string;
  label: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  homeIcon?: boolean;
  separator?: string | React.ReactNode;
}

const Breadcrumb = ({
  items = [],
  className = "",
  homeIcon = true,
  separator = "/"
}: BreadcrumbProps) => {
  const pathname = usePathname();
  
  // 如果没有提供面包屑项，尝试基于路径自动生成
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs(pathname);
  
  return (
    <nav className={`flex items-center text-sm text-gray-400 ${className}`} aria-label="面包屑导航">
      <Link href="/dashboard" className="hover:text-blue-400 flex items-center" aria-label="首页">
        {homeIcon ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ) : null}
        首页
      </Link>
      
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          <span className="mx-2 text-gray-500" aria-hidden="true">
            {typeof separator === 'string' ? separator : separator}
          </span>
          
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-gray-300" aria-current="page">{item.label}</span>
          ) : (
            <Link href={item.path} className="hover:text-blue-400">
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

/**
 * 根据当前路径自动生成面包屑项
 */
const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  if (pathname === "/dashboard") return [];
  
  // 分割路径并过滤掉空字符串
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // 对特殊路径的映射，用于显示更友好的标签
  const labelMapping: Record<string, string> = {
    "dashboard": "仪表盘",
    "devices": "设备管理",
    "contents": "内容管理",
    "users": "用户管理",
    "permissions": "权限配置",
    "messages": "消息中心",
    "analytics": "数据分析",
    "settings": "系统设置",
    "playlists": "播放列表",
    "schedule": "发布计划",
    "roles": "角色管理",
    "map": "设备地图",
    "groups": "终端组",
    "profile": "个人资料"
  };
  
  // 构建面包屑数组
  return pathSegments.map((segment, index) => {
    // 构建到当前段的完整路径
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    
    // 获取显示标签，优先使用映射，否则将首字母大写
    let label = labelMapping[segment] || 
      (segment.charAt(0).toUpperCase() + segment.slice(1));
    
    // 如果是ID格式（数字或UUID），显示为"详情"
    if (/^\d+$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
      label = "详情";
    }
    
    return {
      path,
      label
    };
  });
};

export default Breadcrumb; 