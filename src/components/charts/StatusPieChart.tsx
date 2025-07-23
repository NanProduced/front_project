"use client";

import React, { useState, useEffect } from 'react';

export const StatusPieChart = () => {
  const [loaded, setLoaded] = useState(false);
  
  // 模拟图表数据
  const chartData = [
    { status: "在线", count: 96, color: "#10b981" },
    { status: "离线", count: 20, color: "#6b7280" },
    { status: "告警", count: 12, color: "#fbbf24" }
  ];

  const total = chartData.reduce((sum, item) => sum + item.count, 0);
  
  // 计算每个扇形的开始角度和结束角度
  const calculateAngles = (data: typeof chartData) => {
    let startAngle = 0;
    return data.map(item => {
      const percentage = item.count / total;
      const angle = percentage * 360;
      const segment = {
        ...item,
        percentage,
        startAngle,
        endAngle: startAngle + angle
      };
      startAngle += angle;
      return segment;
    });
  };

  const segments = calculateAngles(chartData);
  
  // 极坐标转直角坐标
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // 创建SVG路径
  const createArc = (segment: any, radius: number, centerX: number, centerY: number) => {
    const start = polarToCartesian(centerX, centerY, radius, segment.endAngle);
    const end = polarToCartesian(centerX, centerY, radius, segment.startAngle);
    const largeArcFlag = segment.endAngle - segment.startAngle <= 180 ? "0" : "1";

    const d = [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");

    return d;
  };

  // 加载动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-48 h-48">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          {segments.map((segment, index) => (
            <path 
              key={index}
              d={createArc(segment, loaded ? 40 : 0, 50, 50)} 
              fill={segment.color}
              stroke="#0f172a" 
              strokeWidth="1"
              className="transition-all duration-1000 ease-out"
            />
          ))}
          <circle cx="50" cy="50" r="25" fill="#0f172a" />
          <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="10">
            总计: {total}
          </text>
        </svg>
      </div>
      
      <div className="flex justify-center items-center mt-4 space-x-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center">
            <span 
              className="inline-block w-3 h-3 mr-1 rounded-full" 
              style={{ backgroundColor: item.color }} 
            />
            <span className="text-sm text-gray-300">{item.status} ({item.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 