"use client";

import React from "react";
import { StatusPieChart } from "@/components/charts/StatusPieChart";
import { ActivityBarChart } from "@/components/charts/ActivityBarChart";
import Link from "next/link";

// 仪表盘页面组件
export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">仪表盘概览</h1>
      
      {/* 仪表盘内容 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-5 bg-[#0f172a] rounded-lg border border-gray-800 hover:border-blue-800 transition-colors">
          <h3 className="font-medium text-gray-400 text-sm">终端总数</h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-2xl font-bold text-white">128</p>
            <span className="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="p-5 bg-[#0f172a] rounded-lg border border-gray-800 hover:border-green-800 transition-colors">
          <h3 className="font-medium text-gray-400 text-sm">在线终端</h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-2xl font-bold text-green-400">96</p>
            <span className="text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
              </svg>
            </span>
          </div>
        </div>

        <div className="p-5 bg-[#0f172a] rounded-lg border border-gray-800 hover:border-yellow-800 transition-colors">
          <h3 className="font-medium text-gray-400 text-sm">告警数量</h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-2xl font-bold text-yellow-400">12</p>
            <span className="text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="p-5 bg-[#0f172a] rounded-lg border border-gray-800 hover:border-blue-800 transition-colors">
          <h3 className="font-medium text-gray-400 text-sm">内容数量</h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-2xl font-bold text-blue-400">256</p>
            <span className="text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </span>
          </div>
        </div>
      </div>
      
      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-5 bg-[#0f172a] rounded-lg border border-gray-800">
          <h2 className="text-lg font-medium mb-4 text-white">终端状态分布</h2>
          <div className="h-64">
            <StatusPieChart />
          </div>
        </div>
        
        <div className="p-5 bg-[#0f172a] rounded-lg border border-gray-800">
          <h2 className="text-lg font-medium mb-4 text-white">本周终端活动</h2>
          <div className="h-64">
            <ActivityBarChart />
          </div>
        </div>
      </div>
      
      {/* 列表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-[#0f172a] rounded-lg border border-gray-800">
          <h2 className="text-lg font-medium mb-4 text-white">最新活动</h2>
          <div className="border-t border-gray-800">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="py-3 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-gray-300">终端 LED-{i+101} 已上线</span>
                </div>
                <span className="text-sm text-gray-500">10分钟前</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-right">
            <Link href="/terminals" className="text-sm text-blue-400 hover:text-blue-300">查看全部</Link>
          </div>
        </div>
        
        <div className="p-5 bg-[#0f172a] rounded-lg border border-gray-800">
          <h2 className="text-lg font-medium mb-4 text-white">告警列表</h2>
          <div className="border-t border-gray-800">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="py-3 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-red-400">终端 LED-{i+205} 离线通知</span>
                </div>
                <span className="text-sm text-gray-500">30分钟前</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-right">
            <Link href="/terminals" className="text-sm text-blue-400 hover:text-blue-300">查看全部</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 