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
  parentId: string | null;
  organizationId: string;
  level: number;
  path: string;
  children?: UserGroup[];
}

/**
 * 获取当前登录用户信息
 */
export const getCurrentUser = () => {
  return coreApi.get<UserInfoResponse>('/user/current');
};

/**
 * 获取用户列表
 * @param params 查询参数
 */
export const getUsers = (params: {
  page?: number;
  size?: number;
  keyword?: string;
  status?: number;
  userGroupId?: string;
}) => {
  return coreApi.get<{
    content: User[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    numberOfElements: number;
  }>('/user/list', params);
};

/**
 * 获取用户详情
 * @param userId 用户ID
 */
export const getUserById = (userId: string) => {
  return coreApi.get<User>(`/user/${userId}`);
};

/**
 * 创建用户
 * @param userData 用户数据
 */
export const createUser = (userData: {
  username: string;
  nickname: string;
  password: string;
  email?: string;
  phone?: string;
  role: string;
  userGroupIds: string[];
  status?: number;
}) => {
  return coreApi.post<User>('/user/create', userData);
};

/**
 * 更新用户信息
 * @param userId 用户ID
 * @param userData 用户数据
 */
export const updateUser = (
  userId: string,
  userData: {
    nickname?: string;
    email?: string;
    phone?: string;
    role?: string;
    userGroupIds?: string[];
    status?: number;
  }
) => {
  return coreApi.put<User>(`/user/${userId}`, userData);
};

/**
 * 删除用户
 * @param userId 用户ID
 */
export const deleteUser = (userId: string) => {
  return coreApi.delete(`/user/${userId}`);
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
  getUsers,
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