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
      
      const response = await getCurrentUser();
      
      if (response.success && response.data) {
        setUser(response.data);
        return response.data;
      } else {
        setError(response.message || '获取用户信息失败');
        return null;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '未知错误');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 初始化时获取用户信息
  useEffect(() => {
    const init = async () => {
      // 如果在登录页面，不需要获取用户信息
      if (typeof window !== 'undefined') {
        if (window.location.pathname === '/login') {
          setIsLoading(false);
          return;
        }
      }
      
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
    return fetchUserInfo();
  };

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