"use client";

import React, { useState, useEffect } from "react";

const DevicesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  
  // 示例设备数据
  const mockDevices = [
    { id: "LED-SZ-001", name: "深圳南山LED屏", status: "online", location: "深圳市南山区科技园", type: "室外P3.91", lastOnline: "2023-07-21 14:30:22", resolution: "1920x1080", size: "500x300cm" },
    { id: "LED-SZ-002", name: "深圳福田LED屏", status: "offline", location: "深圳市福田区CBD", type: "室外P4.81", lastOnline: "2023-07-20 09:15:43", resolution: "1280x720", size: "400x250cm" },
    { id: "LED-SZ-003", name: "深圳宝安LED屏", status: "warning", location: "深圳市宝安区机场", type: "室内P2.5", lastOnline: "2023-07-21 16:45:12", resolution: "1920x1080", size: "300x200cm" },
    { id: "LED-HK-001", name: "香港中环LED屏", status: "online", location: "香港特别行政区中环", type: "室外P5.95", lastOnline: "2023-07-21 15:22:36", resolution: "2560x1440", size: "600x400cm" },
    { id: "LED-HK-002", name: "香港尖沙咀LED屏", status: "online", location: "香港特别行政区尖沙咀", type: "室内P3.91", lastOnline: "2023-07-21 14:55:08", resolution: "1920x1080", size: "450x300cm" },
    { id: "LED-SZ-004", name: "深圳龙岗LED屏", status: "offline", location: "深圳市龙岗区中心城", type: "室外P4.81", lastOnline: "2023-07-19 18:30:22", resolution: "1280x720", size: "500x300cm" },
    { id: "LED-SZ-005", name: "深圳盐田LED屏", status: "online", location: "深圳市盐田区海滨路", type: "室外P5.95", lastOnline: "2023-07-21 10:12:45", resolution: "1920x1080", size: "400x250cm" },
    { id: "LED-SZ-006", name: "深圳罗湖LED屏", status: "warning", location: "深圳市罗湖区东门步行街", type: "室内P2.5", lastOnline: "2023-07-21 13:24:51", resolution: "1280x720", size: "300x200cm" },
  ];

  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      setDevices(mockDevices);
      setIsLoading(false);
    }, 1000);
  }, []);

  // 根据搜索词和状态过滤设备
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || device.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // 处理选择/取消选择设备
  const handleSelectDevice = (deviceId: string) => {
    setSelectedDevices(prev => {
      if (prev.includes(deviceId)) {
        return prev.filter(id => id !== deviceId);
      } else {
        return [...prev, deviceId];
      }
    });
  };

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(filteredDevices.map(device => device.id));
    }
  };

  // 处理批量操作
  const handleBulkAction = (action: string) => {
    console.log(`执行批量操作: ${action}`, selectedDevices);
    // 实际项目中这里会调用API
  };

  // 获取设备状态标签样式
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "online":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-900/20 text-green-400 flex items-center">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
            在线
          </span>
        );
      case "offline":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-700/50 text-gray-300 flex items-center">
            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span>
            离线
          </span>
        );
      case "warning":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-700/20 text-yellow-400 flex items-center">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>
            告警
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-700/50 text-gray-300">
            未知
          </span>
        );
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">设备管理</h1>
        
        <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          添加设备
        </button>
      </div>
      
      {/* 过滤和搜索 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="搜索设备名称、ID或位置..." 
              className="bg-[#0f172a] text-gray-300 border border-gray-700 w-full pl-10 pr-4 py-2 rounded focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-2 rounded text-sm font-medium ${
              filterStatus === "all" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            全部
          </button>
          <button 
            onClick={() => setFilterStatus("online")}
            className={`px-3 py-2 rounded text-sm font-medium ${
              filterStatus === "online" 
                ? "bg-green-600 text-white" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            在线
          </button>
          <button 
            onClick={() => setFilterStatus("offline")}
            className={`px-3 py-2 rounded text-sm font-medium ${
              filterStatus === "offline" 
                ? "bg-gray-600 text-white" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            离线
          </button>
          <button 
            onClick={() => setFilterStatus("warning")}
            className={`px-3 py-2 rounded text-sm font-medium ${
              filterStatus === "warning" 
                ? "bg-yellow-600 text-white" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            告警
          </button>
        </div>
      </div>
      
      {/* 批量操作工具栏 */}
      {selectedDevices.length > 0 && (
        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-800 rounded-md flex justify-between items-center">
          <div className="text-sm text-blue-300">
            已选择 <span className="font-bold">{selectedDevices.length}</span> 个设备
          </div>
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 text-xs bg-blue-700 hover:bg-blue-600 text-white rounded"
              onClick={() => handleBulkAction("上线")}
            >
              上线
            </button>
            <button 
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"
              onClick={() => handleBulkAction("下线")}
            >
              下线
            </button>
            <button 
              className="px-3 py-1 text-xs bg-purple-700 hover:bg-purple-600 text-white rounded"
              onClick={() => handleBulkAction("推送内容")}
            >
              推送内容
            </button>
            <button 
              className="px-3 py-1 text-xs bg-red-700 hover:bg-red-600 text-white rounded"
              onClick={() => handleBulkAction("删除")}
            >
              删除
            </button>
          </div>
        </div>
      )}
      
      {/* 设备表格 */}
      <div className="bg-[#0f172a] border border-gray-800 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-[#0c1424]">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">
                    <div className="flex items-center">
                      <input 
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                        checked={selectedDevices.length === filteredDevices.length && filteredDevices.length > 0}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">设备ID</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">设备名称</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">状态</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">位置</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">类型</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">最后在线时间</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-[#1a2544]">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <input 
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                          checked={selectedDevices.includes(device.id)}
                          onChange={() => handleSelectDevice(device.id)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{device.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{device.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(device.status)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{device.location}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{device.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{device.lastOnline}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="text-green-400 hover:text-green-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* 分页 */}
        {!isLoading && (
          <div className="px-4 py-3 bg-[#0c1424] border-t border-gray-800 sm:px-6 flex items-center justify-between">
            <div className="hidden sm:block">
              <p className="text-sm text-gray-400">
                显示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredDevices.length}</span> 条，共 <span className="font-medium">{filteredDevices.length}</span> 条记录
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                上一页
              </button>
              <button 
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                1
              </button>
              <button 
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={true} // 示例中只有一页
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DevicesPage;