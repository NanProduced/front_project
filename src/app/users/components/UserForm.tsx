'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Switch, Spin, message } from 'antd';
import { createUser, UserListResponse } from '@/services/userService';
import RoleSelector from './RoleSelector';

interface UserFormProps {
  visible: boolean;
  initialValues: UserListResponse | null;
  userGroupId: number | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  visible,
  initialValues,
  userGroupId,
  onCancel,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialValues;

  // 表单初始化
  useEffect(() => {
    if (visible) {
      form.resetFields();
      
      if (initialValues) {
        // 编辑模式，设置初始值
        form.setFieldsValue({
          username: initialValues.username,
          email: initialValues.email,
          roles: initialValues.roles.map(role => role.rid)
        });
      } else {
        // 创建模式，设置用户组ID
        form.setFieldsValue({
          ugid: userGroupId
        });
      }
    }
  }, [visible, initialValues, userGroupId, form]);

  // 表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEditMode) {
        // TODO: 实现编辑用户逻辑，目前API尚未提供
        message.warning('编辑用户功能尚未实现');
      } else {
        // 创建用户
        await createUser({
          ugid: userGroupId as number,
          username: values.username,
          password: values.password,
          email: values.email,
          phone: values.phone || '',
          roles: values.roles
        });
        message.success('用户创建成功');
      }

      onSuccess();
    } catch (error) {
      console.error('表单提交失败:', error);
      if (error instanceof Error) {
        message.error(`提交失败: ${error.message}`);
      } else {
        message.error('提交失败');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={isEditMode ? '编辑用户' : '创建用户'}
      okText={isEditMode ? '保存' : '创建'}
      cancelText="取消"
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      maskClosable={false}
      width={600}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
        >
          {/* 用户名 */}
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
              { max: 50, message: '用户名最多50个字符' }
            ]}
          >
            <Input 
              placeholder="请输入用户名" 
              disabled={isEditMode} 
            />
          </Form.Item>

          {/* 密码 - 仅创建时显示 */}
          {!isEditMode && (
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}

          {/* 邮箱 */}
          <Form.Item
            name="email"
            label="电子邮箱"
            rules={[
              { required: true, message: '请输入电子邮箱' },
              { type: 'email', message: '请输入有效的电子邮箱' }
            ]}
          >
            <Input placeholder="请输入电子邮箱" />
          </Form.Item>

          {/* 手机号 */}
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          {/* 角色 */}
          <Form.Item
            name="roles"
            label="角色"
            rules={[
              { required: true, message: '请选择至少一个角色' }
            ]}
          >
            <RoleSelector placeholder="请选择角色" />
          </Form.Item>

          {/* 用户组 - 隐藏字段，仅用于创建时传递用户组ID */}
          <Form.Item name="ugid" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default UserForm; 