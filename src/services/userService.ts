import { coreApi } from '@/utils/api';

// 用户信息响应接口 - 根据API文档中的UserInfoResponse结构定义
export interface UserInfoResponse {
  uid: number;
  username: string;
  oid: number;
  orgName: string;
  roles: RoleDTO[];
  ugid: number;
  ugName: string;
  email?: string;
  phone?: string;
  active: number;
  createdAt: string;
  updatedAt: string;
}

// 角色信息接口
export interface RoleDTO {
  rid: number;
  oid: number;
  roleName: string;
  displayName?: string;
}

export interface User {
  id: string;
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: string;
  organizationId: string;
  organizationName?: string;
  status: number;
  createdTime: string;
  updatedTime: string;
  lastLoginTime?: string;
}

export interface UserGroup {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  children?: UserGroup[];
}

/**
 * 获取当前登录用户信息
 */
export const getCurrentUser = async () => {
  try {
    console.log('正在请求用户信息...');
    // coreApi.get已经处理了DynamicResponse结构，直接返回data部分
    const userData = await coreApi.get<UserInfoResponse>('/user/current');
    console.log('用户信息获取成功:', userData);
    return userData;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

/**
 * 创建用户
 * @param data 用户数据
 */
export const createUser = (data: any) => {
  return coreApi.post('/user/create', data);
};

/**
 * 更新用户
 * @param data 用户数据
 */
export const updateUser = (data: any) => {
  return coreApi.put('/user/update', data);
};

/**
 * 删除用户
 * @param userId 用户ID
 */
export const deleteUser = (userId: string) => {
  return coreApi.delete(`/user/delete?uid=${userId}`);
};

/**
 * 获取用户列表
 * @param params 查询参数
 */
export const getUserList = (params: any) => {
  return coreApi.post('/user-group/list', params);
};

/**
 * 获取用户详情
 * @param userId 用户ID
 */
export const getUserById = (userId: string) => {
  return coreApi.get<User>(`/user/${userId}`);
};

/**
 * 重置用户密码
 * @param userId 用户ID
 * @param newPassword 新密码
 */
export const resetUserPassword = (userId: string, newPassword: string) => {
  return coreApi.put(`/user/${userId}/reset-password`, { newPassword });
};

/**
 * 修改用户状态
 * @param userId 用户ID
 * @param status 状态 (1:启用, 0:禁用)
 */
export const updateUserStatus = (userId: string, status: number) => {
  return coreApi.put(`/user/${userId}/status`, { status });
};

/**
 * 获取用户组树
 */
export const getUserGroupTree = () => {
  return coreApi.get<UserGroup[]>('/user-group/tree/init');
};

/**
 * 创建用户组
 * @param userGroupData 用户组数据
 */
export const createUserGroup = (userGroupData: {
  name: string;
  description?: string;
  parentId?: string;
}) => {
  return coreApi.post<UserGroup>('/user-group/create', userGroupData);
};

/**
 * 更新用户组
 * @param userGroupId 用户组ID
 * @param userGroupData 用户组数据
 */
export const updateUserGroup = (
  userGroupId: string,
  userGroupData: {
    name?: string;
    description?: string;
    parentId?: string;
  }
) => {
  return coreApi.put<UserGroup>(`/user-group/${userGroupId}`, userGroupData);
};

/**
 * 删除用户组
 * @param userGroupId 用户组ID
 */
export const deleteUserGroup = (userGroupId: string) => {
  return coreApi.delete(`/user-group/${userGroupId}`);
};

/**
 * 获取用户可见的角色列表
 */
export const getVisibleRoles = () => {
  return coreApi.get<{ id: string; name: string; code: string; description?: string }[]>('/role/get/visible');
};

export default {
  getCurrentUser,
  getUsers: getUserList, // Renamed from getUsers to getUserList to match new API
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  updateUserStatus,
  getUserGroupTree,
  createUserGroup,
  updateUserGroup,
  deleteUserGroup,
  getVisibleRoles
}; 