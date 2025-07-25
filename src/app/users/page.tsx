'use client';

import React, { useEffect, useState } from 'react';
import { Button, Table, Input, Select, Space, Tag, Tooltip, Modal, Form, message } from 'antd';
import { SearchOutlined, PlusOutlined, UserOutlined, UserSwitchOutlined, LockOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getUserList, inactiveUser, activeUser, deleteUser } from '@/services/userService';
import { UserListResponse, PageRequestDTO, QueryUserListRequest, PageVO } from '@/services/userService';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';

// 引入组件
import UserForm from './components/UserForm';
import UserGroupSelector from './components/UserGroupSelector';
import RoleSelector from './components/RoleSelector';

export default function UserManagement() {
  // 状态管理
  const [users, setUsers] = useState<UserListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUserGroup, setSelectedUserGroup] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [includeSubGroups, setIncludeSubGroups] = useState(false);
  
  // 表单和对话框
  const [userFormVisible, setUserFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserListResponse | null>(null);
  const [confirmDialogProps, setConfirmDialogProps] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger' as 'danger' | 'warning' | 'info'
  });

  // 获取用户列表数据
  const fetchUsers = async () => {
    if (!selectedUserGroup) return;
    
    setLoading(true);
    try {
      const params: PageRequestDTO<QueryUserListRequest> = {
        pageNum: currentPage,
        pageSize: pageSize,
        sortField: 'createTime',
        sortOrder: 'desc',
        params: {
          ugid: selectedUserGroup,
          includeSubGroups: includeSubGroups,
          userNameKeyword: searchKeyword || undefined,
          emailKeyword: searchKeyword || undefined,
          status: statusFilter
        }
      };
      
      const response = await getUserList(params);
      setUsers(response.records);
      setTotal(response.total);
    } catch (error) {
      message.error('获取用户列表失败');
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 用户组选择回调
  const handleUserGroupSelect = (ugid: number) => {
    setSelectedUserGroup(ugid);
    setCurrentPage(1);
  };
  
  // 首次加载和依赖变更时获取数据
  useEffect(() => {
    if (selectedUserGroup) {
      fetchUsers();
    }
  }, [selectedUserGroup, currentPage, pageSize, includeSubGroups]);

  // 搜索处理
  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  // 状态筛选处理
  const handleStatusFilterChange = (value: number | undefined) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // 子组包含处理
  const handleIncludeSubGroupsChange = (checked: boolean) => {
    setIncludeSubGroups(checked);
    setCurrentPage(1);
  };

  // 创建用户
  const handleCreateUser = () => {
    setEditingUser(null);
    setUserFormVisible(true);
  };

  // 编辑用户
  const handleEditUser = (user: UserListResponse) => {
    setEditingUser(user);
    setUserFormVisible(true);
  };

  // 保存用户（创建或更新）
  const handleSaveUser = () => {
    setUserFormVisible(false);
    fetchUsers();
  };

  // 封禁用户
  const handleInactiveUser = (user: UserListResponse) => {
    setConfirmDialogProps({
      isOpen: true,
      title: '封禁用户',
      message: `确定要封禁用户 "${user.username}" 吗？封禁后该用户将无法登录系统。`,
      onConfirm: async () => {
        try {
          await inactiveUser(user.uid);
          message.success('用户已封禁');
          fetchUsers();
        } catch (error) {
          message.error('封禁用户失败');
          console.error('封禁用户失败:', error);
        } finally {
          setConfirmDialogProps(prev => ({ ...prev, isOpen: false }));
        }
      },
      variant: 'warning'
    });
  };

  // 解封用户
  const handleActiveUser = (user: UserListResponse) => {
    setConfirmDialogProps({
      isOpen: true,
      title: '解封用户',
      message: `确定要解封用户 "${user.username}" 吗？解封后该用户将可以正常登录系统。`,
      onConfirm: async () => {
        try {
          await activeUser(user.uid);
          message.success('用户已解封');
          fetchUsers();
        } catch (error) {
          message.error('解封用户失败');
          console.error('解封用户失败:', error);
        } finally {
          setConfirmDialogProps(prev => ({ ...prev, isOpen: false }));
        }
      },
      variant: 'info'
    });
  };

  // 删除用户
  const handleDeleteUser = (user: UserListResponse) => {
    setConfirmDialogProps({
      isOpen: true,
      title: '删除用户',
      message: `确定要删除用户 "${user.username}" 吗？此操作不可恢复。`,
      onConfirm: async () => {
        try {
          await deleteUser(user.uid);
          message.success('用户已删除');
          fetchUsers();
        } catch (error) {
          message.error('删除用户失败');
          console.error('删除用户失败:', error);
        } finally {
          setConfirmDialogProps(prev => ({ ...prev, isOpen: false }));
        }
      },
      variant: 'danger'
    });
  };

  // 表格列定义
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: UserListResponse) => (
        <div className="flex items-center">
          <UserOutlined className="mr-2" />
          <span>{text}</span>
          {record.active === 1 && (
            <Tag color="red" className="ml-2">已封禁</Tag>
          )}
        </div>
      )
    },
    {
      title: '所属组',
      dataIndex: 'ugName',
      key: 'ugName'
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '角色',
      key: 'roles',
      render: (_: unknown, record: UserListResponse) => (
        <div>
          {record.roles.map(role => (
            <Tag key={role.rid} color="blue" className="mr-1 mb-1">
              {role.displayName || role.roleName}
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: string) => new Date(text).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: UserListResponse) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditUser(record)} 
              className="text-blue-400 hover:text-blue-500"
            />
          </Tooltip>
          
          {record.active === 0 ? (
            <Tooltip title="封禁">
              <Button 
                type="text" 
                icon={<LockOutlined />} 
                onClick={() => handleInactiveUser(record)} 
                className="text-yellow-400 hover:text-yellow-500"
              />
            </Tooltip>
          ) : (
            <Tooltip title="解封">
              <Button 
                type="text" 
                icon={<UserSwitchOutlined />} 
                onClick={() => handleActiveUser(record)} 
                className="text-green-400 hover:text-green-500"
              />
            </Tooltip>
          )}
          
          <Tooltip title="删除">
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteUser(record)} 
              className="text-red-400 hover:text-red-500"
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">用户管理</h1>
        <p className="text-gray-400">管理系统用户、分配角色和权限</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧用户组树 */}
        <div className="lg:col-span-1">
          <UserGroupSelector 
            onSelect={handleUserGroupSelect}
            selectedId={selectedUserGroup?.toString()}
          />
        </div>
        
        {/* 右侧用户列表 */}
        <div className="lg:col-span-3">
          <div className="bg-[#0f172a] rounded-lg border border-gray-800 p-4">
            {/* 工具栏 */}
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  placeholder="搜索用户名或邮箱"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onPressEnter={handleSearch}
                  prefix={<SearchOutlined />}
                  className="max-w-xs"
                />
                
                <Select
                  placeholder="状态筛选"
                  allowClear
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  options={[
                    { value: 0, label: '正常' },
                    { value: 1, label: '封禁' }
                  ]}
                  className="min-w-[120px]"
                />
                
                <Button 
                  type="primary" 
                  onClick={handleSearch}
                >
                  搜索
                </Button>

                <label className="flex items-center text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSubGroups}
                    onChange={(e) => handleIncludeSubGroupsChange(e.target.checked)}
                    className="mr-2"
                  />
                  包含子组
                </label>
              </div>
              
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateUser}
                disabled={!selectedUserGroup}
              >
                创建用户
              </Button>
            </div>
            
            {/* 用户列表 */}
            <Table
              columns={columns}
              dataSource={users}
              rowKey="uid"
              loading={loading}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: total,
                onChange: (page) => setCurrentPage(page),
                onShowSizeChange: (_, size) => setPageSize(size),
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
              locale={{
                emptyText: selectedUserGroup
                  ? '暂无用户数据'
                  : '请先选择左侧用户组'
              }}
              className="user-table"
            />
          </div>
        </div>
      </div>
      
      {/* 用户表单对话框 */}
      {userFormVisible && (
        <UserForm
          visible={userFormVisible}
          initialValues={editingUser}
          userGroupId={selectedUserGroup}
          onCancel={() => setUserFormVisible(false)}
          onSuccess={handleSaveUser}
        />
      )}
      
      {/* 确认对话框 */}
      <ConfirmDialog
        isOpen={confirmDialogProps.isOpen}
        title={confirmDialogProps.title}
        message={confirmDialogProps.message}
        onConfirm={confirmDialogProps.onConfirm}
        onCancel={() => setConfirmDialogProps(prev => ({ ...prev, isOpen: false }))}
        variant={confirmDialogProps.variant}
      />
    </div>
  );
} 