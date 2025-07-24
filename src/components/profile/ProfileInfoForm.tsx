import React, { useEffect } from 'react';
import { Form, Input, Button, Row, Col, Tag, Divider } from 'antd';
import { User, RoleDTO } from '@/services/userService';
import { BankOutlined, TeamOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

interface ProfileInfoFormProps {
  user: User;
  isEditing: boolean;
  onSave: (values: Record<string, unknown>) => void;
  onCancel: () => void;
  allRoles?: RoleDTO[];
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  user,
  isEditing,
  onSave,
  onCancel,
  allRoles = []
}) => {
  const [form] = Form.useForm();

  // 当用户数据变化时，重置表单
  useEffect(() => {
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      phone: user.phone,
      organizationName: user.organizationName,
    });
  }, [user, form]);

  const handleFinish = (values: Record<string, unknown>) => {
    onSave(values);
  };

  // 渲染角色标签列表
  const renderRoleTags = () => {
    if (!allRoles || allRoles.length === 0) {
      return <span className="text-gray-500">无角色信息</span>;
    }
    
    return (
      <div className="flex flex-wrap gap-2">
        {allRoles.map((role, index) => (
          <Tag key={index} color="blue" className="px-2 py-1 text-sm">
            {role.displayName || role.roleName}
          </Tag>
        ))}
      </div>
    );
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        username: user.username,
        email: user.email,
        phone: user.phone,
        organizationName: user.organizationName,
      }}
      onFinish={handleFinish}
      className="text-gray-300"
    >
      <Divider orientation="left" className="border-gray-700 mb-6 mt-0">
        <span className="text-gray-300 text-sm px-2">账号信息</span>
      </Divider>
      
      <Row gutter={24}>
        <Col span={24} md={12}>
          <Form.Item
            name="username"
            label={
              <div className="flex items-center text-gray-300">
                <UserOutlined className="mr-2 text-blue-400" />
                <span>用户名</span>
              </div>
            }
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              disabled 
              placeholder="用户名" 
              className="bg-[#0a1022] border-gray-600 text-gray-300" 
            />
          </Form.Item>
        </Col>
        
        <Col span={24} md={12}>
          <Form.Item
            name="organizationName"
            label={
              <div className="flex items-center text-gray-300">
                <BankOutlined className="mr-2 text-blue-400" />
                <span>所属组织</span>
              </div>
            }
          >
            <Input 
              disabled 
              placeholder="所属组织" 
              className="bg-[#0a1022] border-gray-600 text-gray-300" 
            />
          </Form.Item>
        </Col>
      </Row>
      
      <Divider orientation="left" className="border-gray-700 my-4">
        <span className="text-gray-300 text-sm px-2">联系方式</span>
      </Divider>
      
      <Row gutter={24}>
        <Col span={24} md={12}>
          <Form.Item
            name="email"
            label={
              <div className="flex items-center text-gray-300">
                <MailOutlined className="mr-2 text-blue-400" />
                <span>邮箱</span>
              </div>
            }
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input 
              disabled={!isEditing} 
              placeholder="请输入邮箱" 
              className={`${!isEditing ? 'bg-[#0a1022] border-gray-600' : 'bg-[#0f1629] border-blue-500'} text-gray-300`}
            />
          </Form.Item>
        </Col>
        
        <Col span={24} md={12}>
          <Form.Item
            name="phone"
            label={
              <div className="flex items-center text-gray-300">
                <PhoneOutlined className="mr-2 text-blue-400" />
                <span>手机号</span>
              </div>
            }
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' },
            ]}
          >
            <Input 
              disabled={!isEditing} 
              placeholder="请输入手机号" 
              className={`${!isEditing ? 'bg-[#0a1022] border-gray-600' : 'bg-[#0f1629] border-blue-500'} text-gray-300`}
            />
          </Form.Item>
        </Col>
      </Row>
      
      <Divider orientation="left" className="border-gray-700 my-4">
        <span className="text-gray-300 text-sm px-2">角色信息</span>
      </Divider>
      
      <Form.Item
        label={
          <div className="flex items-center text-gray-300">
            <TeamOutlined className="mr-2 text-blue-400" />
            <span>用户角色</span>
          </div>
        }
      >
        <div className="p-3 bg-[#0a1022] border border-gray-600 rounded-lg min-h-[40px]">
          {renderRoleTags()}
        </div>
      </Form.Item>

      {isEditing && (
        <Form.Item className="flex justify-end mt-8 mb-0">
          <Button 
            type="default" 
            onClick={onCancel} 
            className="mr-4 bg-[#374151] border-gray-600 text-gray-300 hover:bg-[#4b5563] hover:text-white hover:border-gray-500"
          >
            取消
          </Button>
          <Button 
            type="primary" 
            htmlType="submit"
            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 px-6"
          >
            保存
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default ProfileInfoForm; 