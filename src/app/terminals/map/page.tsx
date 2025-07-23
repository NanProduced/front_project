'use client';

import React, { useState, useEffect } from 'react';
import PageTitle from '@/components/PageTitle';
import { getTerminals, Terminal } from '@/services/terminalService';
import { useApi } from '@/hooks/useApi';

export default function TerminalMapPage() {
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 22.5431, lng: 114.0579 }); // 深圳中心坐标
  const [mapZoom, setMapZoom] = useState(12);

  // 获取终端列表
  const { 
    execute: fetchTerminals,
    data: terminalsData,
    loading: terminalsLoading,
    error: terminalsError 
  } = useApi((page = 1, size = 1000) => {
    return getTerminals({
      page: page - 1,
      size,
    });
  });

  useEffect(() => {
    fetchTerminals(1, 1000);
  }, [fetchTerminals]);

  return (
    <div>
      <PageTitle 
        title="终端地图" 
        description="查看所有终端的地理位置分布"
      />
      
      <div className="mt-6 bg-[#0f172a] border border-gray-800 rounded-lg p-4 h-[calc(100vh-240px)] relative">
        {/* 加载状态 */}
        {terminalsLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* 错误状态 */}
        {terminalsError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="bg-red-900/20 border border-red-800 p-4 rounded-lg max-w-md">
              <p className="text-red-400 text-center">加载失败: {terminalsError.message}</p>
              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => fetchTerminals(1, 1000)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  重试
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* 地图占位 - 实际项目中会集成地图SDK */}
        <div className="flex items-center justify-center h-full bg-[#1a2544] rounded-lg">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-gray-400">地图组件将在此处显示</p>
            <p className="text-gray-500 text-sm mt-2">集成第三方地图SDK后可查看终端位置分布</p>
            
            {!terminalsLoading && terminalsData && (
              <p className="text-blue-400 mt-4">
                已加载 {terminalsData.totalElements} 个终端位置数据
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* 终端信息面板 */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">终端状态统计</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a2544] p-3 rounded-lg">
              <div className="text-sm text-gray-400">在线终端</div>
              <div className="text-xl font-medium text-green-400 mt-1">
                {terminalsData ? terminalsData.content.filter(t => t.status === 1).length : 0}
              </div>
            </div>
            <div className="bg-[#1a2544] p-3 rounded-lg">
              <div className="text-sm text-gray-400">离线终端</div>
              <div className="text-xl font-medium text-gray-400 mt-1">
                {terminalsData ? terminalsData.content.filter(t => t.status === 0).length : 0}
              </div>
            </div>
            <div className="bg-[#1a2544] p-3 rounded-lg">
              <div className="text-sm text-gray-400">告警终端</div>
              <div className="text-xl font-medium text-yellow-400 mt-1">
                {terminalsData ? terminalsData.content.filter(t => t.status === 2).length : 0}
              </div>
            </div>
            <div className="bg-[#1a2544] p-3 rounded-lg">
              <div className="text-sm text-gray-400">禁用终端</div>
              <div className="text-xl font-medium text-red-400 mt-1">
                {terminalsData ? terminalsData.content.filter(t => t.status === -1).length : 0}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-4 lg:col-span-2">
          <h3 className="text-lg font-medium text-white mb-3">终端位置分布</h3>
          <div className="h-48 overflow-auto">
            {terminalsLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : terminalsData && terminalsData.content.length > 0 ? (
              <div className="space-y-2">
                {terminalsData.content.slice(0, 5).map(terminal => (
                  <div 
                    key={terminal.id} 
                    className="flex items-center justify-between p-2 hover:bg-[#1a2544] rounded-lg cursor-pointer"
                    onClick={() => setSelectedTerminal(terminal)}
                  >
                    <div>
                      <div className="font-medium text-white">{terminal.name}</div>
                      <div className="text-sm text-gray-400">{terminal.location || '未设置位置'}</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      terminal.status === 1 ? 'bg-green-500' : 
                      terminal.status === 0 ? 'bg-gray-500' : 
                      terminal.status === 2 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}></div>
                  </div>
                ))}
                {terminalsData.content.length > 5 && (
                  <div className="text-center text-sm text-blue-400 mt-2">
                    还有 {terminalsData.content.length - 5} 个终端未显示
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">暂无终端位置数据</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 