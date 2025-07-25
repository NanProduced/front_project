'use client';

import React, { useEffect, useState } from 'react';
import { UserGroupTreeNode, getUserGroupTree } from '@/services/userService';
import { Spin, Alert } from 'antd';

interface UserGroupSelectorProps {
  onSelect: (ugid: number) => void;
  selectedId?: string;
}

const UserGroupSelector: React.FC<UserGroupSelectorProps> = ({ onSelect, selectedId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userGroupTree, setUserGroupTree] = useState<UserGroupTreeNode | null>(null);

  // 获取用户组树数据
  useEffect(() => {
    const fetchUserGroupTree = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getUserGroupTree();
        setUserGroupTree(response.root);
      } catch (err) {
        console.error('获取用户组树失败:', err);
        setError('获取用户组树失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroupTree();
  }, []);

  // 递归渲染用户组树节点
  const renderTreeNode = (node: UserGroupTreeNode) => {
    const isSelected = selectedId === String(node.ugid);

    return (
      <div key={node.ugid} className="select-none">
        <div
          className={`flex items-center py-2 px-2 rounded-md cursor-pointer transition-colors
            ${isSelected ? 'bg-blue-900/30 text-blue-300' : 'hover:bg-gray-800/50 text-gray-300 hover:text-gray-200'}
          `}
          style={{ paddingLeft: `${getNodeLevel(node) * 16 + 8}px` }}
          onClick={() => onSelect(node.ugid)}
        >
          <div className="mr-2 flex-shrink-0">
            {node.children && node.children.length > 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
          </div>
          <div className="truncate">{node.ugName}</div>
        </div>

        {node.children && node.children.map(child => renderTreeNode(child))}
      </div>
    );
  };

  // 获取节点的层级深度
  const getNodeLevel = (node: UserGroupTreeNode): number => {
    if (!node.path) return 0;
    // 路径格式类似于 "/root/group1/group2"
    return node.path.split('/').filter(Boolean).length - 1;
  };

  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-medium mb-4 text-white">用户组</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Spin tip="加载中..." />
        </div>
      ) : error ? (
        <Alert
          message="加载失败"
          description={error}
          type="error"
          showIcon
        />
      ) : userGroupTree ? (
        <div className="user-group-selector max-h-[500px] overflow-y-auto">
          {renderTreeNode(userGroupTree)}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-400">
          暂无用户组数据
        </div>
      )}
    </div>
  );
};

export default UserGroupSelector; 