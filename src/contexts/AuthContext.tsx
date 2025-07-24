"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, getCurrentUser } from '@/services/userService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  refreshUserInfo: () => Promise<User | null>;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  logout: () => {},
  refreshUserInfo: async () => null
});

// 认证上下文提供者组件
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('AuthContext: 开始获取用户信息...');
      const userData = await getCurrentUser();
      
      if (userData) {
        // 将API返回的UserInfoResponse映射到前端User对象
        const mappedUser: User = {
          id: userData.uid.toString(),
          username: userData.username,
          nickname: userData.username, // 如果没有昵称，使用用户名
          email: userData.email,
          phone: userData.phone,
          avatar: undefined,
          role: userData.roles && userData.roles.length > 0 
            ? userData.roles[0].displayName || userData.roles[0].roleName 
            : '普通用户',
          organizationId: userData.oid.toString(),
          organizationName: userData.orgName,
          status: userData.active,
          createdTime: userData.createdAt,
          updatedTime: userData.updatedAt,
          ugid: userData.ugid,
          ugName: userData.ugName
        };
        
        console.log('AuthContext: 用户信息映射成功:', mappedUser);
        setUser(mappedUser);
        return mappedUser;
      } else {
        console.error('AuthContext: 用户数据为空');
        setError('获取用户信息失败');
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('AuthContext: 获取用户信息出错:', error);
      // 如果是401未授权错误，则重定向到登录页面
      if (error instanceof Error && error.message.includes('401')) {
        console.log('AuthContext: 检测到401未授权，准备重定向到登录页...');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      setError(error instanceof Error ? error.message : '未知错误');
      setUser(null);
      return null;
    } finally {
      console.log('AuthContext: fetchUserInfo 完成，设置 isLoading = false');
      setIsLoading(false);
    }
  };

  // 初始化时获取用户信息
  useEffect(() => {
    const init = async () => {
      // 如果在登录页面，不需要获取用户信息
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        console.log('AuthContext: 当前路径:', pathname);
        if (pathname === '/login' || pathname === '/') {
          console.log('AuthContext: 在登录/首页，不获取用户信息，设置 isLoading = false');
          setIsLoading(false);
          return;
        }
      }
      
      console.log('AuthContext: 初始化获取用户信息...');
      await fetchUserInfo();
    };
    
    init();
  }, []);

  // 退出登录
  const logout = () => {
    setUser(null);
    
    // 重定向到登录页面
    if (typeof window !== 'undefined') {
      // 使用配置中的登出函数
      // 这里直接重定向到登录页面，实际项目中应该调用后端登出API
      window.location.href = '/login';
    }
  };

  // 刷新用户信息
  const refreshUserInfo = async () => {
    console.log('AuthContext: 开始刷新用户信息');
    return fetchUserInfo();
  };
  
  // 调试输出当前状态
  useEffect(() => {
    console.log('AuthContext 状态更新:', { 
      isAuthenticated: !!user,
      isLoading, 
      hasError: !!error
    });
  }, [user, isLoading, error]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        logout,
        refreshUserInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 自定义钩子，用于访问认证上下文
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 