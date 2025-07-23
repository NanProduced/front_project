'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  fallbackUrl?: string;
}

/**
 * 受保护的路由组件，用于客户端权限控制
 * @param children 子组件
 * @param allowedRoles 允许访问的角色列表（默认为空数组，表示所有已认证用户）
 * @param fallbackUrl 未授权时重定向的URL（默认为/dashboard）
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  fallbackUrl = '/dashboard'
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 如果未认证，重定向到登录页面
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  // 如果指定了允许的角色，并且用户角色不在允许列表中，则重定向到回退URL
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    router.push(fallbackUrl);
    return null;
  }

  // 通过所有检查，渲染子组件
  return <>{children}</>;
};

export default ProtectedRoute; 