import { coreApi } from '@/utils/api';

export interface TerminalGroup {
  id: string;
  name: string;
  description?: string;
  parentId: string | null;
  organizationId: string;
  level: number;
  path: string;
  children?: TerminalGroup[];
}

export interface Terminal {
  id: string;
  terminalNo: string;
  name: string;
  description?: string;
  terminalGroupId: string;
  terminalGroupName?: string;
  ipAddress?: string;
  macAddress?: string;
  model?: string;
  firmwareVersion?: string;
  screenResolution?: string;
  status: number;
  lastOnlineTime?: string;
  location?: string;
  installDate?: string;
  organizationId: string;
  createdTime: string;
  updatedTime: string;
}

/**
 * 获取终端组树结构
 */
export const getTerminalGroupTree = () => {
  return coreApi.get<TerminalGroup[]>('/terminal-group/tree/init');
};

/**
 * 创建终端组
 * @param terminalGroupData 终端组数据
 */
export const createTerminalGroup = (terminalGroupData: {
  name: string;
  description?: string;
  parentId?: string;
}) => {
  return coreApi.post<TerminalGroup>('/terminal-group/create', terminalGroupData);
};

/**
 * 更新终端组
 * @param terminalGroupId 终端组ID
 * @param terminalGroupData 终端组数据
 */
export const updateTerminalGroup = (
  terminalGroupId: string,
  terminalGroupData: {
    name?: string;
    description?: string;
    parentId?: string;
  }
) => {
  return coreApi.put<TerminalGroup>(`/terminal-group/${terminalGroupId}`, terminalGroupData);
};

/**
 * 删除终端组
 * @param terminalGroupId 终端组ID
 */
export const deleteTerminalGroup = (terminalGroupId: string) => {
  return coreApi.delete(`/terminal-group/${terminalGroupId}`);
};

/**
 * 获取终端列表
 * @param params 查询参数
 */
export const getTerminals = (params: {
  page?: number;
  size?: number;
  keyword?: string;
  status?: number;
  terminalGroupId?: string;
}) => {
  return coreApi.get<{
    content: Terminal[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    numberOfElements: number;
  }>('/terminal/list', params);
};

/**
 * 获取终端详情
 * @param terminalId 终端ID
 */
export const getTerminalById = (terminalId: string) => {
  return coreApi.get<Terminal>(`/terminal/${terminalId}`);
};

/**
 * 创建终端
 * @param terminalData 终端数据
 */
export const createTerminal = (terminalData: {
  terminalNo: string;
  name: string;
  description?: string;
  terminalGroupId: string;
  ipAddress?: string;
  macAddress?: string;
  model?: string;
  firmwareVersion?: string;
  screenResolution?: string;
  location?: string;
  installDate?: string;
}) => {
  return coreApi.post<Terminal>('/terminal/create', terminalData);
};

/**
 * 更新终端信息
 * @param terminalId 终端ID
 * @param terminalData 终端数据
 */
export const updateTerminal = (
  terminalId: string,
  terminalData: {
    name?: string;
    description?: string;
    terminalGroupId?: string;
    ipAddress?: string;
    macAddress?: string;
    model?: string;
    firmwareVersion?: string;
    screenResolution?: string;
    location?: string;
    installDate?: string;
    status?: number;
  }
) => {
  return coreApi.put<Terminal>(`/terminal/${terminalId}`, terminalData);
};

/**
 * 删除终端
 * @param terminalId 终端ID
 */
export const deleteTerminal = (terminalId: string) => {
  return coreApi.delete(`/terminal/${terminalId}`);
};

/**
 * 修改终端状态
 * @param terminalId 终端ID
 * @param status 状态 (1:启用, 0:禁用)
 */
export const updateTerminalStatus = (terminalId: string, status: number) => {
  return coreApi.put(`/terminal/${terminalId}/status`, { status });
};

/**
 * 批量操作终端
 * @param terminalIds 终端ID列表
 * @param action 操作类型 (enable:启用, disable:禁用, delete:删除)
 */
export const batchOperateTerminals = (
  terminalIds: string[],
  action: 'enable' | 'disable' | 'delete'
) => {
  return coreApi.post('/terminal/batch', { terminalIds, action });
};

/**
 * 重启终端
 * @param terminalId 终端ID
 */
export const restartTerminal = (terminalId: string) => {
  return coreApi.post(`/terminal/${terminalId}/restart`);
};

/**
 * 获取终端状态统计
 */
export const getTerminalStatusStatistics = () => {
  return coreApi.get<{
    total: number;
    online: number;
    offline: number;
    disabled: number;
    warning: number;
  }>('/terminal/statistics/status');
};

export default {
  getTerminalGroupTree,
  createTerminalGroup,
  updateTerminalGroup,
  deleteTerminalGroup,
  getTerminals,
  getTerminalById,
  createTerminal,
  updateTerminal,
  deleteTerminal,
  updateTerminalStatus,
  batchOperateTerminals,
  restartTerminal,
  getTerminalStatusStatistics
}; 