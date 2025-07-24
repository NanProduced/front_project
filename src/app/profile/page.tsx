"use client";

import { useState, useEffect } from 'react';
import { Card, Avatar, Tabs, Button, message, Tag } from 'antd';
import { UserOutlined, EditOutlined, LockOutlined, MailOutlined, PhoneOutlined, BankOutlined } from '@ant-design/icons';
import PageTitle from '@/components/PageTitle';
import ProfileInfoForm from '@/components/profile/ProfileInfoForm';
import { updateUser, getCurrentUser, User, RoleDTO } from '@/services/userService';

// 添加全局样式覆盖，确保Card和表单元素的背景色符合深色主题
import './profile.css';

// 简单的临时组件代替 ChangePasswordForm
const TemporaryPasswordForm = ({ userId }: { userId: string }) => {
  return (
    <div className="p-4 text-center">
      <p className="text-gray-300">密码修改功能正在开发中，敬请期待...</p>
    </div>
  );
};

// 扩展User接口以包含完整的角色数组
interface ExtendedUser extends User {
  allRoles?: RoleDTO[];
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // 直接从API获取用户数据
  const fetchUserData = async () => {
    try {
      console.log('正在获取用户数据...');
      setIsLoading(true);
      
      const apiUserData = await getCurrentUser();
      
      if (!apiUserData) {
        console.error('获取到的用户数据为空');
        setError('无法获取用户信息');
        setUserData(null);
        return;
      }
      
      // 保存原始角色数组
      const allRoles = apiUserData.roles || [];
      
      // 直接映射API返回的数据，并添加完整角色列表
      const user: ExtendedUser = {
        id: apiUserData.uid.toString(),
        username: apiUserData.username,
        nickname: apiUserData.username, // 使用用户名作为昵称
        email: apiUserData.email,
        phone: apiUserData.phone,
        avatar: undefined,
        role: allRoles.length > 0 
          ? (allRoles[0].displayName || allRoles[0].roleName) 
          : '普通用户',
        organizationId: apiUserData.oid.toString(),
        organizationName: apiUserData.orgName,
        status: apiUserData.active || 0,
        createdTime: apiUserData.createdAt || '',
        updatedTime: apiUserData.updatedAt || '',
        ugid: apiUserData.ugid,
        ugName: apiUserData.ugName,
        allRoles: allRoles // 添加所有角色信息
      };
      
      console.log('用户数据获取成功:', user);
      setUserData(user);
      setError(null);
    } catch (err) {
      console.error('获取用户数据失败:', err);
      setError(err instanceof Error ? err.message : '未知错误');
      setUserData(null);
      
      // 如果是401未授权，重定向到登录页
      if (err instanceof Error && err.message.includes('401')) {
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // 组件挂载时获取数据
  useEffect(() => {
    fetchUserData();
  }, []);
  
  // 编辑按钮点击事件
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // 保存个人资料
  const handleSaveProfile = async (values: Record<string, unknown>) => {
    if (!userData) return;
    
    try {
      setIsLoading(true);
      await updateUser({
        uid: userData.id,
        ...values
      });
      messageApi.success('个人资料更新成功');
      setIsEditing(false);
      await fetchUserData(); // 重新获取用户数据
    } catch (error) {
      messageApi.error('更新失败，请稍后再试');
      console.error('更新个人资料失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 如果正在加载，显示加载中
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-[#0a1022]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-300 text-lg">加载中...</p>
      </div>
    );
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-[#0a1022]">
        <div className="text-red-500 mb-4">错误: {error}</div>
        <Button onClick={fetchUserData} type="primary">
          重试
        </Button>
        <Button href="/login" className="mt-2">
          返回登录页
        </Button>
      </div>
    );
  }

  // 如果没有用户数据，显示未登录信息
  if (!userData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-[#0a1022]">
        <p className="text-gray-300 mb-4">未登录或会话已过期</p>
        <Button type="primary" href="/login">
          返回登录
        </Button>
      </div>
    );
  }
  
  // 准备tabs内容
  const tabItems = [
    {
      key: 'info',
      label: (
        <span className="flex items-center">
          <UserOutlined className="mr-1" />
          基本信息
        </span>
      ),
      children: (
        <ProfileInfoForm 
          user={userData}
          isEditing={isEditing} 
          onSave={handleSaveProfile}
          onCancel={() => setIsEditing(false)}
          allRoles={userData.allRoles}
        />
      ),
    },
    {
      key: 'security',
      label: (
        <span className="flex items-center">
          <LockOutlined className="mr-1" />
          安全设置
        </span>
      ),
      children: <TemporaryPasswordForm userId={userData.id} />,
    },
  ];

  // 渲染完整页面
  return (
    <div className="p-6 bg-[#050b1f] text-gray-200 min-h-screen">
      {contextHolder}
      
      <div className="flex justify-between items-center mb-6">
        <PageTitle title="个人资料" />
        {activeTab === 'info' && (
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={handleEditToggle}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isEditing ? '取消编辑' : '编辑资料'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 用户信息卡片 - 占3列 */}
        <div className="lg:col-span-3">
          <Card 
            className="bg-[#0c1424] border-0 shadow-xl text-center" 
            styles={{
              header: { backgroundColor: '#0c1424', borderColor: 'transparent' },
              body: { backgroundColor: '#0c1424', padding: '24px' }
            }}
          >
            <div className="flex flex-col items-center">
              <Avatar 
                size={96} 
                icon={<UserOutlined />} 
                src={userData.avatar} 
                className="mb-4 border-2 border-blue-400 shadow-lg"
                style={{ backgroundColor: '#1890ff' }}
              />
              <h2 className="text-xl font-semibold text-white mb-1">{userData.username}</h2>
              
              {/* 角色信息 */}
              {userData.role && (
                <div className="mb-3">
                  <Tag color="blue" className="text-sm px-2">{userData.role}</Tag>
                </div>
              )}
              
              {/* 组织信息 */}
              <div className="w-full px-3 py-2 rounded-lg bg-[#0a1022] mb-3 flex items-center justify-center border border-gray-800">
                <BankOutlined className="mr-2 text-blue-400" />
                <span className="text-gray-300 text-sm">{userData.organizationName || '未分配组织'}</span>
              </div>
              
              {/* 联系信息 */}
              <div className="w-full bg-[#0a1022] rounded-lg p-3 border border-gray-800">
                {userData.email && (
                  <div className="flex items-center mb-2 text-gray-300 justify-center">
                    <MailOutlined className="mr-2 text-gray-500" />
                    <span className="truncate">{userData.email}</span>
                  </div>
                )}
                
                {userData.phone && (
                  <div className="flex items-center text-gray-300 justify-center">
                    <PhoneOutlined className="mr-2 text-gray-500" />
                    <span>{userData.phone}</span>
                  </div>
                )}
                
                {!userData.email && !userData.phone && (
                  <div className="text-gray-500 text-center py-1">未设置联系方式</div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* 内容区域 - 占9列 */}
        <div className="lg:col-span-9">
          <Card 
            className="bg-[#0c1424] border-0 shadow-xl"
            styles={{
              header: { backgroundColor: '#0c1424', borderColor: 'transparent' },
              body: { backgroundColor: '#0c1424', padding: '24px' }
            }}
          >
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab} 
              items={tabItems}
              type="card"
              className="text-gray-300"
              tabBarStyle={{ marginBottom: '16px', borderBottom: '1px solid #1f2937' }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
} 