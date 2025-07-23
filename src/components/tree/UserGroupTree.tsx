'use client';

import React, { useCallback, useEffect, useState } from 'react';
import TreeView, { TreeNode } from './TreeView';
import { getUserGroupTree } from '@/services/userService';
import useApi from '@/hooks/useApi';
import { UserGroup } from '@/services/userService';

interface UserGroupTreeProps {
  onSelect?: (group: UserGroup) => void;
  selectedId?: string;
  className?: string;
  defaultExpandAll?: boolean;
  showActions?: boolean;
  onAddGroup?: (parentId: string | null) => void;
  onEditGroup?: (group: UserGroup) => void;
  onDeleteGroup?: (group: UserGroup) => void;
}

const UserGroupTree: React.FC<UserGroupTreeProps> = ({
  onSelect,
  selectedId,
  className = '',
  defaultExpandAll = false,
  showActions = false,
  onAddGroup,
  onEditGroup,
  onDeleteGroup
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const { execute, data, loading, error } = useApi(getUserGroupTree);

  // 转换API返回的数据结构为TreeView所需的格式
  const convertToTreeNodes = useCallback((groups: UserGroup[]): TreeNode[] => {
    return groups.map(group => ({
      id: group.id,
      name: group.name,
      children: group.children ? convertToTreeNodes(group.children) : undefined,
      data: group
    }));
  }, []);

  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);

  useEffect(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    if (data) {
      setTreeNodes(convertToTreeNodes(data));
    }
  }, [data, convertToTreeNodes]);

  // 处理展开/折叠状态
  const handleExpandToggle = (nodeId: string, expanded: boolean) => {
    setExpandedIds(prevIds => {
      if (expanded) {
        return [...prevIds, nodeId];
      } else {
        return prevIds.filter(id => id !== nodeId);
      }
    });
  };

  // 自定义节点图标
  const renderIcon = (node: TreeNode, expanded: boolean) => {
    if (node.children && node.children.length > 0) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      );
    }
    // 叶节点图标
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    );
  };

  // 节点操作按钮
  const renderActions = (node: TreeNode) => {
    if (!showActions) return null;
    
    return (
      <div className="flex items-center space-x-1">
        {/* 添加子组按钮 */}
        <button
          onClick={() => onAddGroup && onAddGroup(node.id)}
          className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
          title="添加子组"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        
        {/* 编辑按钮 */}
        <button
          onClick={() => onEditGroup && onEditGroup(node.data)}
          className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
          title="编辑组"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        
        {/* 删除按钮 */}
        <button
          onClick={() => onDeleteGroup && onDeleteGroup(node.data)}
          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
          title="删除组"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    );
  };

  // 处理节点选择
  const handleSelect = (node: TreeNode) => {
    onSelect && onSelect(node.data);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 px-2 text-center text-red-400">
        加载失败: {error.message}
      </div>
    );
  }

  return (
    <div className={`bg-[#0f172a] border border-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">用户组</h3>
        {showActions && (
          <button
            onClick={() => onAddGroup && onAddGroup(null)}
            className="p-1 text-sm bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 rounded flex items-center transition-colors"
            title="添加根组"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            添加组
          </button>
        )}
      </div>
      
      <div className="user-group-tree">
        {treeNodes.length > 0 ? (
          <TreeView
            nodes={treeNodes}
            onSelect={handleSelect}
            selectedId={selectedId}
            defaultExpandAll={defaultExpandAll}
            expandedIds={expandedIds}
            onExpandToggle={handleExpandToggle}
            renderIcon={renderIcon}
            renderActions={showActions ? renderActions : undefined}
          />
        ) : (
          <div className="py-4 text-center text-gray-400">
            暂无用户组，请添加
          </div>
        )}
      </div>
    </div>
  );
};

export default UserGroupTree; 