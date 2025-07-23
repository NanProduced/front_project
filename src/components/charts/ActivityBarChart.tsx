"use client";

import React, { useState, useEffect } from 'react';

export const ActivityBarChart = () => {
  const [loaded, setLoaded] = useState(false);
  
  // 模拟图表数据
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const data = [
    { type: '在线活动', values: [35, 42, 28, 45, 39, 28, 32], color: '#3b82f6' },
    { type: '告警事件', values: [8, 6, 12, 4, 9, 5, 7], color: '#f97316' }
  ];
  
  // 计算最大值以便于设置图表比例
  const maxValue = Math.max(...data.flatMap(d => d.values)) * 1.2;
  
  // 动画效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* 图例 */}
      <div className="flex justify-end mb-4 space-x-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <span 
              className="inline-block w-3 h-3 mr-1 rounded-sm" 
              style={{ backgroundColor: item.color }} 
            />
            <span className="text-sm text-gray-300">{item.type}</span>
          </div>
        ))}
      </div>
      
      {/* 图表 */}
      <div className="flex-1 flex items-end">
        <div className="mr-2 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>{Math.round(maxValue)}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
        
        <div className="flex-1 h-full flex relative">
          {/* 水平网格线 */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0.25, 0.5, 0.75, 1].map((level, i) => (
              <div key={i} className="w-full border-t border-gray-800"></div>
            ))}
          </div>
          
          {/* 柱状图 */}
          <div className="relative z-10 flex-1 flex justify-around items-end">
            {days.map((day, dayIndex) => (
              <div key={dayIndex} className="flex flex-col items-center w-full group">
                <div className="w-full flex justify-center mb-1">
                  {data.map((item, itemIndex) => {
                    const value = item.values[dayIndex];
                    const height = loaded ? `${(value / maxValue) * 100}%` : '0%';
                    
                    return (
                      <div 
                        key={itemIndex}
                        className="mx-0.5 w-3 transition-all duration-1000 ease-out" 
                        style={{ 
                          height, 
                          backgroundColor: item.color 
                        }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-6 bg-gray-900 text-xs text-white px-1.5 py-0.5 rounded transform -translate-x-1/2 transition-opacity">
                          {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <span className="text-xs text-gray-500">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 