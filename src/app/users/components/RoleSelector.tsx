'use client';

import React, { useEffect, useState } from 'react';
import { Select, Spin, Alert } from 'antd';
import { getVisibleRoles, RoleDTO } from '@/services/userService';

interface RoleSelectorProps {
  value?: number[];
  onChange?: (value: number[]) => void;
  disabled?: boolean;
  placeholder?: string;
  mode?: 'multiple' | 'tags';
  className?: string;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = '请选择角色',
  mode = 'multiple',
  className = ''
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<RoleDTO[]>([]);

  // 获取可见角色列表
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getVisibleRoles();
        setRoles(response.visibleRoles || []);
      } catch (err) {
        console.error('获取角色列表失败:', err);
        setError('获取角色列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (selectedRoles: number[]) => {
    if (onChange) {
      onChange(selectedRoles);
    }
  };

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  return (
    <Select
      mode={mode}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      placeholder={loading ? '加载中...' : placeholder}
      className={className}
      style={{ width: '100%' }}
      loading={loading}
      notFoundContent={loading ? <Spin size="small" /> : '暂无角色可选'}
      options={roles.map(role => ({
        label: role.displayName || role.roleName,
        value: role.rid
      }))}
      optionFilterProp="label"
    />
  );
};

export default RoleSelector; 