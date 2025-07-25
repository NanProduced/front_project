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

// 创建用户请求接口
export interface CreateUserRequest {
  ugid: number;
  roles: number[];
  username: string;
  password: string;
  email: string;
  phone: string;
}

// 分配角色请求接口
export interface AssignRolesRequest {
  targetUid: number;
  rids: number[];
}

// 移动用户请求接口
export interface MoveUserRequest {
  uid: number;
  sourceUgid: number;
  targetUgid: number;
}

// 修改密码请求接口
export interface ModifyPasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// 查询用户列表请求接口
export interface QueryUserListRequest {
  ugid: number;
  includeSubGroups?: boolean;
  userNameKeyword?: string;
  emailKeyword?: string;
  status?: number;
}

// 分页请求接口
export interface PageRequestDTO<T> {
  pageNum: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: string;
  params: T;
}

// 分页响应接口
export interface PageVO<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  totalPages: number;
  records: T[];
  hasNext: boolean;
  hasPrevious: boolean;
}

// 用户列表响应接口
export interface UserListResponse {
  uid: number;
  username: string;
  ugid: number;
  ugName: string;
  email?: string;
  active: number;
  roles: RoleDTO[];
  updateTime: string;
  createTime: string;
}

// 创建用户组请求接口
export interface CreateUserGroupRequest {
  parentUgid: number;
  userGroupName: string;
  description?: string;
}

// 用户组树节点接口
export interface UserGroupTreeNode {
  ugid: number;
  ugName: string;
  parent: number;
  path: string;
  pathMap: Record<string, string>;
  children: UserGroupTreeNode[];
}

// 用户组树响应接口
export interface UserGroupTreeResponse {
  organization: OrganizationDTO;
  root: UserGroupTreeNode;
}

// 组织信息接口
export interface OrganizationDTO {
  oid: number;
  orgName: string;
  suffix: number;
}

// 可见角色响应接口
export interface VisibleRolesResponse {
  uid: number;
  visibleRoles: RoleDTO[];
}

// User接口 - 用于兼容现有代码
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
  ugid?: number;
  ugName?: string;
}

/**
 * 获取当前登录用户信息
 */
export const getCurrentUser = async (): Promise<UserInfoResponse> => {
  try {
    console.log('userService: 正在请求用户信息...');
    
    // 添加超时处理
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('请求用户信息超时')), 10000);
    });
    
    // 使用 Promise.race 来处理超时
    const userData = await Promise.race([
      coreApi.get<UserInfoResponse>('/user/current'),
      timeoutPromise
    ]) as UserInfoResponse;
    
    // 验证返回的数据结构
    if (!userData || typeof userData !== 'object' || !('uid' in userData)) {
      console.error('userService: 用户信息格式不正确:', userData);
      throw new Error('获取的用户信息格式不正确');
    }
    
    console.log('userService: 用户信息获取成功:', userData);
    return userData;
  } catch (error) {
    console.error('userService: 获取用户信息失败:', error);
    // 处理特定错误类型
    if (error instanceof Error) {
      // 如果是网络错误，给出更详细的错误信息
      if (error.message.includes('Network Error')) {
        throw new Error('网络连接失败，请检查您的网络连接');
      }
      
      // 如果是超时错误
      if (error.message.includes('timeout')) {
        throw new Error('服务器响应超时，请稍后再试');
      }
    }
    throw error;
  }
};

/**
 * 创建用户
 * @param data 创建用户请求数据
 */
export const createUser = (data: CreateUserRequest) => {
  return coreApi.post('/user/create', data);
};

/**
 * 移动用户
 * @param data 移动用户请求数据
 */
export const moveUser = (data: MoveUserRequest) => {
  return coreApi.post('/user/move', data);
};

/**
 * 封禁用户
 * @param uid 用户ID
 */
export const inactiveUser = (uid: number) => {
  return coreApi.post(`/user/inactive?uid=${uid}`);
};

/**
 * 解封用户
 * @param uid 用户ID
 */
export const activeUser = (uid: number) => {
  return coreApi.post(`/user/active?uid=${uid}`);
};

/**
 * 删除用户
 * @param uid 用户ID
 */
export const deleteUser = (uid: number) => {
  return coreApi.post(`/user/delete?uid=${uid}`);
};

/**
 * 给用户分配角色
 * @param data 分配角色请求数据
 */
export const assignRolesToUser = (data: AssignRolesRequest) => {
  return coreApi.post('/user/assign-roles', data);
};

/**
 * 修改当前用户密码
 * @param data 修改密码请求数据
 */
export const modifyPassword = (data: ModifyPasswordRequest) => {
  return coreApi.post('/user/modify/pwd', data);
};

/**
 * 获取用户列表
 * @param params 分页查询参数
 */
export const getUserList = (params: PageRequestDTO<QueryUserListRequest>) => {
  return coreApi.post<PageVO<UserListResponse>>('/user-group/list', params);
};

/**
 * 获取用户组树
 */
export const getUserGroupTree = () => {
  return coreApi.get<UserGroupTreeResponse>('/user-group/tree/init');
};

/**
 * 创建用户组
 * @param data 创建用户组请求数据
 */
export const createUserGroup = (data: CreateUserGroupRequest) => {
  return coreApi.post('/user-group/create', data);
};

/**
 * 删除用户组
 * @param ugid 用户组ID
 */
export const deleteUserGroup = (ugid: number) => {
  return coreApi.post(`/user-group/delete?ugid=${ugid}`);
};

/**
 * 获取用户可见的角色列表
 */
export const getVisibleRoles = () => {
  return coreApi.get<VisibleRolesResponse>('/role/get/visible');
};

/**
 * 更新用户信息 
 * 注意：此API目前不在core-service文档中，为了兼容现有代码临时模拟实现
 * @param data 用户数据
 */
export const updateUser = (data: {uid: string | number, [key: string]: unknown}) => {
  console.log('调用更新用户API（模拟实现）:', data);
  // 由于API文档中未明确提供更新用户的接口，这里临时使用一个Promise模拟成功响应
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: '用户更新成功（模拟）' });
    }, 500);
  });
};

export default {
  getCurrentUser,
  getUserList,
  createUser,
  moveUser,
  inactiveUser,
  activeUser,
  deleteUser,
  assignRolesToUser,
  modifyPassword,
  getUserGroupTree,
  createUserGroup,
  deleteUserGroup,
  getVisibleRoles,
  updateUser // 添加updateUser到导出对象
}; 