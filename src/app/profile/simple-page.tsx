"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Card, Spin } from 'antd';
import Link from 'next/link';

export default function SimpleProfilePage() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const { user, isLoading, error, refreshUserInfo } = useAuth();
  
  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `[${new Date().toISOString()}] ${info}`]);
  };
  
  useEffect(() => {
    addDebugInfo(`页面加载 - isLoading: ${isLoading}, user: ${user ? '存在' : '不存在'}`);
    
    if (!user && !isLoading) {
      addDebugInfo('尝试刷新用户信息');
      refreshUserInfo()
        .then(result => {
          addDebugInfo(`刷新用户信息完成 - 结果: ${result ? '成功' : '失败'}`);
        })
        .catch(err => {
          addDebugInfo(`刷新用户信息错误: ${err.message}`);
        });
    }
  }, [user, isLoading, refreshUserInfo]);
  
  // 直接尝试向服务器发起测试请求
  useEffect(() => {
    const testServerConnection = async () => {
      try {
        addDebugInfo('测试服务器连接中...');
        const response = await fetch('/core/api/user/current', {
          credentials: 'include',  // 确保包含cookies
        });
        
        addDebugInfo(`服务器响应状态: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          addDebugInfo(`获取到数据: ${JSON.stringify(data).substring(0, 100)}...`);
        } else {
          addDebugInfo(`请求失败: ${response.statusText}`);
        }
      } catch (error) {
        addDebugInfo(`服务器连接错误: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    
    testServerConnection();
  }, []);
  
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">简化版个人资料页</h1>
      
      <Card className="mb-4">
        <h2 className="font-semibold mb-2">状态</h2>
        <p>加载中: {isLoading ? '是' : '否'}</p>
        <p>用户已登录: {user ? '是' : '否'}</p>
        <p>错误信息: {error || '无'}</p>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center my-4">
          <Spin tip="加载中..." />
        </div>
      ) : (
        user ? (
          <Card className="mb-4">
            <h2 className="font-semibold mb-2">用户信息</h2>
            <p>用户ID: {user.id}</p>
            <p>用户名: {user.username}</p>
            <p>邮箱: {user.email || '未设置'}</p>
            <p>角色: {user.role}</p>
          </Card>
        ) : (
          <Card className="mb-4 text-center">
            <p className="text-red-500">未检测到用户登录</p>
            <Link href="/login">
              <Button type="primary" className="mt-2">前往登录</Button>
            </Link>
          </Card>
        )
      )}
      
      <Card title="调试信息">
        <div className="max-h-80 overflow-y-auto">
          {debugInfo.map((info, index) => (
            <div key={index} className="mb-1 text-sm font-mono border-b border-gray-100 pb-1">
              {info}
            </div>
          ))}
          {debugInfo.length === 0 && <p>无调试信息</p>}
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Button onClick={() => refreshUserInfo().then(u => addDebugInfo(`手动刷新结果: ${u ? '成功' : '失败'}`))}>
            手动刷新用户信息
          </Button>
          <Button onClick={() => window.location.reload()}>
            刷新页面
          </Button>
        </div>
      </Card>
    </div>
  );
} 