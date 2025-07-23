"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GATEWAY_URL, logout } from "@/config/auth";
import SiteSelector from "@/components/SiteSelector";
import { SiteConfig } from "@/config/sites";
import { getCurrentUser, UserInfoResponse } from "@/services/userService";
import { useApi } from "@/hooks/useApi";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [userName, setUserName] = useState("用户");
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeSite, setActiveSite] = useState<SiteConfig | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // 使用useApi hook获取用户信息
  const { data: userData, loading: userLoading, error: userError, execute: fetchUser } = useApi(getCurrentUser);

  // 处理站点变更
  const handleSiteChange = (site: SiteConfig) => {
    setActiveSite(site);
    // 在实际应用中，这里可能需要重新加载数据或切换API端点
    setIsLoading(true);
    
    // 模拟API调用以获取新站点的数据
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // 获取当前用户信息
    const loadUserInfo = async () => {
      setIsLoading(true);
      try {
        await fetchUser();
      } catch (error) {
        console.error("用户信息获取失败", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [fetchUser]);
  
  // 当用户数据加载完成后更新UI
  useEffect(() => {
    if (userData) {
      console.log("用户数据已加载:", userData);
      setUserName(userData.username || '用户');
      // 获取用户主要角色
      if (userData.roles && userData.roles.length > 0) {
        setUserRole(userData.roles[0].displayName || userData.roles[0].roleName);
      }
    }
  }, [userData]);
  
  // 处理API错误
  useEffect(() => {
    if (userError) {
      console.error("用户信息获取失败:", userError);
      // 如果是未授权错误，重定向到登录页（虽然拦截器已经处理这个问题，这里是双重保险）
      if (userError.message === '登录已过期，请重新登录') {
        logout();
      }
    }
  }, [userError]);

  // 关闭所有弹出菜单
  useEffect(() => {
    const closeMenus = () => {
      setNotificationsOpen(false);
      setUserMenuOpen(false);
    };
    window.addEventListener('click', closeMenus);
    return () => window.removeEventListener('click', closeMenus);
  }, []);

  // 处理退出登录
  const handleLogout = () => {
    logout();
  };

  const toggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotificationsOpen(!isNotificationsOpen);
    setUserMenuOpen(false);
  };

  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserMenuOpen(!isUserMenuOpen);
    setNotificationsOpen(false);
  };

  // 定义导航菜单项
  const navItems = [
    {
      group: "总览",
      items: [
        { path: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "仪表盘" },
      ]
    },
    {
      group: "终端管理",
      items: [
        { path: "/terminals", icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01", label: "终端管理" },
        { path: "/terminals/map", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", label: "终端地图" },
      ]
    },
    {
      group: "内容管理",
      items: [
        { path: "/contents", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", label: "内容库" },
        { path: "/contents/playlists", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z", label: "播放列表" },
        { path: "/contents/schedule", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "发布计划" },
      ]
    },
    {
      group: "系统管理",
      items: [
        { path: "/users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", label: "用户管理" },
        { path: "/users/roles", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", label: "角色管理" },
        { path: "/permissions", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "权限配置" },
      ]
    },
    {
      group: "辅助功能",
      items: [
        { path: "/messages", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z", label: "消息中心" },
        { path: "/analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", label: "数据分析" },
        { path: "/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", label: "系统设置" },
      ]
    },
  ];

  // 获取当前活动页面的面包屑
  const getBreadcrumb = () => {
    if (pathname === "/dashboard") return [];
    
    // 扁平化导航项以便搜索
    const flatNavItems = navItems.flatMap(group => group.items);
    const currentItem = flatNavItems.find(item => item.path === pathname);
    
    if (!currentItem) {
      // 尝试匹配子路径
      const pathSegments = pathname.split('/').filter(Boolean);
      const parentPath = `/${pathSegments[0]}`;
      const parentItem = flatNavItems.find(item => item.path === parentPath);
      
      if (parentItem) {
        return [{
          path: parentItem.path,
          label: parentItem.label
        }, {
          path: pathname,
          label: pathSegments[1] ? pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1) : '详情'
        }];
      }
      
      return [{
        path: pathname,
        label: "当前页面"
      }];
    }
    
    return [{
      path: currentItem.path,
      label: currentItem.label
    }];
  };

  const breadcrumbs = getBreadcrumb();

  // 模拟通知数据
  const notifications = [
    { id: 1, type: 'alert', title: 'LED屏-03离线', message: '设备已离线超过24小时', time: '10分钟前' },
    { id: 2, type: 'info', title: '系统更新', message: '新版本已发布，请查看更新日志', time: '1小时前' },
    { id: 3, type: 'success', title: '内容发布成功', message: '您的内容已成功发布到5台设备', time: '3小时前' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a1022]">
      {/* 顶部导航栏 */}
      <nav className="bg-[#050b1f] border-b border-gray-800 px-6 py-3.5 z-10">
        <div className="flex justify-between items-center w-full">
          {/* 左侧元素 */}
          <div className="flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!isSidebarOpen);
              }}
              className="text-gray-400 hover:text-white mr-4 focus:outline-none"
              aria-label="切换侧边栏"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <Link href="/dashboard" className="text-xl font-bold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 mr-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 3L12 7L8 3" />
                <line x1="12" y1="7" x2="12" y2="17" />
                <line x1="8" y1="11" x2="16" y2="11" />
                <line x1="8" y1="15" x2="16" y2="15" />
              </svg>
              LED云平台
            </Link>
          </div>
          
          {/* 右侧元素 */}
          <div className="flex items-center space-x-6">
            {/* 站点信息显示 - 简洁设计 */}
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">当前站点</span>
              <span className="text-base font-medium text-blue-400 mr-1">
                {activeSite ? activeSite.name : 'CN'}
              </span>
            </div>
            
            {/* 站点信息显示 - 只读模式 (隐藏) */}
            <SiteSelector readOnly={true} className="hidden" />
            
            {/* 通知图标 */}
            <div className="relative">
              <button 
                className="text-gray-400 hover:text-white focus:outline-none"
                onClick={toggleNotifications}
                aria-label="通知"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
              
              {/* 通知下拉面板 */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-1.5 w-72 bg-[#0f172a] border border-gray-800 rounded-md shadow-lg z-20" onClick={e => e.stopPropagation()}>
                  <div className="p-2.5 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="text-xs font-medium text-gray-300">通知</h3>
                    <button className="text-xs text-blue-400 hover:text-blue-300">全部标记为已读</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <div key={notification.id} className="p-3 border-b border-gray-800 hover:bg-gray-800/30">
                        <div className="flex items-start">
                          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 mr-3 ${
                            notification.type === 'alert' ? 'bg-red-500' : 
                            notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-200">{notification.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center">
                    <Link href="/messages" className="text-xs text-blue-400 hover:text-blue-300">
                      查看全部通知
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* 用户信息 */}
            <div className="relative">
              <button
                className="flex items-center focus:outline-none"
                onClick={toggleUserMenu}
                aria-label="用户菜单"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-sm font-medium">{userName ? userName.charAt(0) : '用'}</span>
                </div>
                <span className="text-gray-300 text-sm font-medium">
                  {userLoading ? "加载中..." : (userName || '用户')}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* 用户下拉菜单 */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0f172a] border border-gray-800 rounded-md shadow-lg z-20" onClick={e => e.stopPropagation()}>
                  <div className="p-3 border-b border-gray-800">
                    <p className="text-sm font-medium text-gray-300">{userName || '用户'}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {userData?.roles && userData.roles.length > 0 
                        ? `用户角色：${userRole}` 
                        : '用户角色：普通用户'}
                    </p>
                    {userData?.email && (
                      <p className="text-xs text-gray-500 mt-1 truncate" title={userData.email}>
                        {userData.email}
                      </p>
                    )}
                  </div>
                  <div className="py-1">
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
                      onClick={() => {/* 个人资料功能 */}}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      个人资料
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
                      onClick={() => {/* 设置功能 */}}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      设置
                    </button>
                  </div>
                  <div className="border-t border-gray-800 py-1">
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center"
                      onClick={handleLogout}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      退出登录
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* 退出按钮 - 移到下拉菜单中，此处可以删除 */}
          </div>
        </div>
      </nav>

      {/* 站点切换提示（如果选择了非中国大陆站点，且该站点可用） */}
      {activeSite && activeSite.id !== 'cn-shenzhen' && activeSite.gatewayUrl !== '#' && (
        <div className="bg-blue-900/20 text-blue-200 py-2 px-4 text-sm flex items-center justify-center border-b border-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          您当前正在访问 {activeSite.name}站点
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {/* 侧边导航栏 */}
        <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#050b1f] border-r border-gray-800 transition-all duration-300 overflow-y-auto flex-shrink-0`}>
          <div className="py-4 h-full flex flex-col">
            <nav className="flex-1">
              {navItems.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-6">
                  {isSidebarOpen && (
                    <div className="px-4 py-2">
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        {group.group}
                      </p>
                    </div>
                  )}
                  {group.items.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center px-4 py-3 text-sm ${
                        pathname === item.path 
                          ? 'bg-blue-900/20 text-blue-400 border-l-2 border-blue-400' 
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                      } transition-colors ${!isSidebarOpen && 'justify-center'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isSidebarOpen ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                      </svg>
                      {isSidebarOpen && <span>{item.label}</span>}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
            
            {/* 底部系统信息 */}
            <div className="mt-auto px-4 py-4 border-t border-gray-800">
              {isSidebarOpen ? (
                <>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>系统版本 v1.0.0</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    © 2023 LED云平台
                  </div>
                </>
              ) : (
                <div className="flex justify-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 主内容区域 */}
        <div className="flex-1 overflow-auto flex flex-col">
          {/* 面包屑导航 */}
          <div className="bg-[#0c1424] px-6 py-2 text-sm text-gray-400 flex items-center">
            <Link href="/dashboard" className="hover:text-blue-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              首页
            </Link>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.path}>
                <span className="mx-2">/</span>
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-300">{item.label}</span>
                ) : (
                  <Link href={item.path} className="hover:text-blue-400">
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="p-6 flex-1">
            {children}
          </div>
          
          {/* 页脚 */}
          <footer className="bg-[#0c1424] px-6 py-3 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
              <div className="mb-2 md:mb-0">
                © 2023 LED云平台 版权所有
              </div>
              <div className="flex space-x-4">
                <Link href="/help" className="hover:text-blue-400">帮助中心</Link>
                <Link href="/contact" className="hover:text-blue-400">联系我们</Link>
                <Link href="/privacy" className="hover:text-blue-400">隐私政策</Link>
                <Link href="/terms" className="hover:text-blue-400">使用条款</Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 