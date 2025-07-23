'use client';

import React, { useState } from 'react';

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  data?: any; // 用于存储节点其他数据
}

interface TreeViewProps {
  nodes: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  selectedId?: string;
  className?: string;
  defaultExpandAll?: boolean;
  expandedIds?: string[];
  onExpandToggle?: (nodeId: string, expanded: boolean) => void;
  renderIcon?: (node: TreeNode, expanded: boolean) => React.ReactNode;
  renderActions?: (node: TreeNode) => React.ReactNode;
}

const TreeView: React.FC<TreeViewProps> = ({
  nodes,
  onSelect,
  selectedId,
  className = '',
  defaultExpandAll = false,
  expandedIds: externalExpandedIds,
  onExpandToggle,
  renderIcon,
  renderActions
}) => {
  const [internalExpandedIds, setInternalExpandedIds] = useState<Set<string>>(
    new Set(defaultExpandAll ? flattenNodeIds(nodes) : [])
  );

  // 如果提供了外部展开状态，优先使用
  const expandedIds = externalExpandedIds
    ? new Set(externalExpandedIds)
    : internalExpandedIds;

  // 扁平化所有节点ID
  function flattenNodeIds(nodes: TreeNode[]): string[] {
    return nodes.reduce<string[]>((acc, node) => {
      acc.push(node.id);
      if (node.children && node.children.length > 0) {
        acc.push(...flattenNodeIds(node.children));
      }
      return acc;
    }, []);
  }

  // 处理展开/折叠
  const handleToggleExpand = (nodeId: string) => {
    const isExpanded = expandedIds.has(nodeId);
    const newExpandedIds = new Set(expandedIds);

    if (isExpanded) {
      newExpandedIds.delete(nodeId);
    } else {
      newExpandedIds.add(nodeId);
    }

    // 如果有外部控制，调用回调
    if (onExpandToggle) {
      onExpandToggle(nodeId, !isExpanded);
    } else {
      setInternalExpandedIds(newExpandedIds);
    }
  };

  // 递归渲染节点
  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedId === node.id;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center justify-between py-2 px-2 rounded-md transition-colors
            ${isSelected ? 'bg-blue-900/30 text-blue-300' : 'hover:bg-gray-800/50 text-gray-300 hover:text-gray-200'}
          `}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          <div 
            className="flex-1 flex items-center cursor-pointer min-w-0"
            onClick={() => onSelect && onSelect(node)}
          >
            <div className="mr-2 flex-shrink-0">
              {hasChildren ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleExpand(node.id);
                  }}
                  className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-200 focus:outline-none"
                  aria-label={isExpanded ? '收起' : '展开'}
                >
                  {renderIcon ? (
                    renderIcon(node, isExpanded)
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
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
                  )}
                </button>
              ) : renderIcon ? (
                renderIcon(node, false)
              ) : (
                <span className="w-5 h-5" />
              )}
            </div>
            <div className="truncate">{node.name}</div>
          </div>

          {renderActions && (
            <div className="ml-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
              {renderActions(node)}
            </div>
          )}
        </div>

        {/* 子节点 */}
        {hasChildren && isExpanded && (
          <div>
            {node.children?.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`tree-view ${className}`}>
      {nodes.map((node) => renderNode(node))}
    </div>
  );
};

export default TreeView; 