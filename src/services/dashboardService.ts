import { coreApi, messageApi } from '@/utils/api';

// 获取设备状态统计
export const getTerminalStatusStatistics = () => {
  return coreApi.get<{
    total: number;
    online: number;
    offline: number;
    disabled: number;
    warning: number;
  }>('/terminal/statistics/status');
};

// 获取最近活动数据
export const getRecentActivityData = (days = 7) => {
  return coreApi.get<{
    dates: string[];
    activeDevices: number[];
    messageCount: number[];
  }>('/terminal/statistics/activity', { days });
};

// 获取告警统计数据
export const getAlertStatistics = () => {
  return coreApi.get<{
    total: number;
    critical: number;
    warning: number;
    info: number;
    todayNew: number;
    resolvedRate: number;
  }>('/alert/statistics');
};

// 获取最近告警列表
export const getRecentAlerts = (limit = 5) => {
  return coreApi.get<{
    id: string;
    type: string;
    title: string;
    message: string;
    severity: 'critical' | 'warning' | 'info';
    terminalId: string;
    terminalName: string;
    createdTime: string;
    status: 'pending' | 'processing' | 'resolved' | 'ignored';
  }[]>('/alert/recent', { limit });
};

// 获取内容统计数据
export const getContentStatistics = () => {
  return coreApi.get<{
    total: number;
    published: number;
    draft: number;
    expired: number;
    files: {
      images: number;
      videos: number;
      documents: number;
      other: number;
    };
    totalSize: number;
  }>('/content/statistics');
};

// 获取用户在线状态统计
export const getOnlineUserStatistics = () => {
  return messageApi.get<{
    total: number;
    online: number;
    away: number;
    offline: number;
  }>('/user-online-status/platform/stats');
};

// 获取系统运行状态
export const getSystemStatus = () => {
  return coreApi.get<{
    version: string;
    apiStatus: 'normal' | 'warning' | 'error';
    wsStatus: 'connected' | 'disconnected';
    lastUpdate: string;
  }>('/system/status');
};

export default {
  getTerminalStatusStatistics,
  getRecentActivityData,
  getAlertStatistics,
  getRecentAlerts,
  getContentStatistics,
  getOnlineUserStatistics,
  getSystemStatus
}; 