import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { modifyPassword, ModifyPasswordRequest } from '@/services/userService';

interface ChangePasswordFormProps {
  userId: string;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ userId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (values: ModifyPasswordRequest) => {
    try {
      setLoading(true);
      await modifyPassword(values);
      messageApi.success('密码修改成功');
      form.resetFields();
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : '修改密码失败，请稍后重试');
      console.error('修改密码失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          name="oldPassword"
          label="当前密码"
          rules={[
            { required: true, message: '请输入当前密码' },
            { min: 6, message: '密码长度至少为6位' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />}
            placeholder="请输入当前密码" 
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 8, message: '新密码长度至少为8位' },
            { 
              pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/,
              message: '密码必须包含字母和数字'
            }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />}
            placeholder="请输入新密码" 
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />}
            placeholder="请再次输入新密码" 
          />
        </Form.Item>

        <Form.Item className="flex justify-end">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
          >
            修改密码
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangePasswordForm; 