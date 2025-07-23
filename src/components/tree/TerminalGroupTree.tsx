'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import TreeView, { TreeNode } from './TreeView';
import { getTerminalGroupTree } from '@/services/terminalService';
import { useApi } from '@/hooks/useApi';
import { TerminalGroup } from '@/services/terminalService';

interface TerminalGroupTreeProps {
  onSelect?: (group: TerminalGroup) => void;
  selectedId?: string;
  className?: string;
  defaultExpandAll?: boolean;
  showActions?: boolean;
  onAddGroup?: (parentId: string | null) => void;
  onEditGroup?: (group: TerminalGroup) => void;
  onDeleteGroup?: (group: TerminalGroup) => void;
  refreshTrigger?: number; // 添加刷新触发器
}

const TerminalGroupTree: React.FC<TerminalGroupTreeProps> = ({
  onSelect,
  selectedId,
  className = '',
  defaultExpandAll = false,
  showActions = false,
  onAddGroup,
  onEditGroup,
  onDeleteGroup,
  refreshTrigger = 0
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const { execute, data, loading, error } = useApi(getTerminalGroupTree);
  const refreshCountRef = useRef(0);

  // 转换API返回的数据结构为TreeView所需的格式
  const convertToTreeNodes = useCallback((groups: TerminalGroup[]): TreeNode[] => {
    return groups.map(group => ({
      id: group.id,
      name: group.name,
      children: group.children ? convertToTreeNodes(group.children) : undefined,
      data: group
    }));
  }, []);

  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);

  // 初始加载和刷新触发
  useEffect(() => {
    execute();
  }, [execute, refreshTrigger]);

  // 外部暴露的刷新方法
  const refresh = useCallback(() => {
    execute();
    refreshCountRef.current += 1;
  }, [execute]);

  // 更新树节点数据
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
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
      <div className={`bg-[#0f172a] border border-gray-800 rounded-lg p-4 flex justify-center items-center py-10 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-[#0f172a] border border-gray-800 rounded-lg p-4 ${className}`}>
        <div className="py-4 px-2 text-center text-red-400">
          加载失败: {error.message}
          <button 
            onClick={refresh}
            className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#0f172a] border border-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">终端组</h3>
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
      
      <div className="terminal-group-tree" data-refresh-count={refreshCountRef.current}>
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
            暂无终端组，请添加
          </div>
        )}
      </div>
    </div>
  );
};

// 暴露刷新方法
export const refreshTerminalGroupTree = () => {
  const treeElement = document.querySelector('.terminal-group-tree') as HTMLElement;
  if (treeElement) {
    const currentCount = parseInt(treeElement.dataset.refreshCount || '0', 10);
    treeElement.dataset.refreshCount = (currentCount + 1).toString();
    // 触发一个自定义事件，组件可以监听这个事件来刷新数据
    const refreshEvent = new CustomEvent('terminal-group-tree-refresh');
    treeElement.dispatchEvent(refreshEvent);
  }
};

export default TerminalGroupTree; 