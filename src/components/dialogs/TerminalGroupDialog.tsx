'use client';

import React, { useState, useEffect } from 'react';
import { 
  createTerminalGroup, 
  updateTerminalGroup, 
  TerminalGroup, 
  getTerminalGroupTree
} from '@/services/terminalService';
import useApi from '@/hooks/useApi';

interface TerminalGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupToEdit?: TerminalGroup | null;
  parentGroupId?: string | null;
  onSuccess: () => void;
}

const TerminalGroupDialog: React.FC<TerminalGroupDialogProps> = ({
  isOpen,
  onClose,
  groupToEdit,
  parentGroupId = null,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { execute: fetchGroups, data: groupsData } = useApi(getTerminalGroupTree);
  const { execute: saveGroup, loading: saving, error: saveError } = useApi(
    groupToEdit 
      ? (data: any) => updateTerminalGroup(groupToEdit.id, data)
      : createTerminalGroup
  );
  
  useEffect(() => {
    if (isOpen) {
      // 加载组树数据，用于选择父组
      fetchGroups();
      
      // 如果是编辑模式，设置表单初始值
      if (groupToEdit) {
        setName(groupToEdit.name);
        setDescription(groupToEdit.description || '');
        setSelectedParentId(groupToEdit.parentId);
      } else {
        // 如果是新增模式，清空表单
        setName('');
        setDescription('');
        setSelectedParentId(parentGroupId);
      }
      
      setError(null);
    }
  }, [isOpen, groupToEdit, parentGroupId, fetchGroups]);
  
  useEffect(() => {
    if (saveError) {
      setError(saveError.message);
    }
  }, [saveError]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('组名不能为空');
      return;
    }
    
    try {
      const data = {
        name: name.trim(),
        description: description.trim(),
        parentId: selectedParentId || null
      };
      
      await saveGroup(data);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('保存终端组失败:', err);
    }
  };
  
  // 递归构建树形选择项
  const buildTreeOptions = (groups: TerminalGroup[] = [], level = 0): React.ReactNode[] => {
    if (!groups) return [];
    
    return groups.flatMap(group => {
      // 编辑模式下，不能选自己作为父节点，也不能选自己的子节点作为父节点
      const isDisabled = groupToEdit && (
        group.id === groupToEdit.id || 
        (group.path && groupToEdit.path && group.path.startsWith(groupToEdit.path))
      );
      
      const options = [
        <option 
          key={group.id} 
          value={group.id} 
          disabled={isDisabled}
          style={{ paddingLeft: `${level * 16}px` }}
        >
          {'\u00A0'.repeat(level * 2)}{level > 0 ? '└─ ' : ''}{group.name}
        </option>
      ];
      
      if (group.children && group.children.length > 0) {
        options.push(...buildTreeOptions(group.children, level + 1));
      }
      
      return options;
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-[#0f172a] rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">
            {groupToEdit ? '编辑终端组' : '添加终端组'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-5">
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                组名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#1a2544] text-gray-200 w-full rounded border border-gray-600 py-2 px-3 focus:outline-none focus:border-blue-500"
                placeholder="请输入组名称"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                组描述
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-[#1a2544] text-gray-200 w-full rounded border border-gray-600 py-2 px-3 focus:outline-none focus:border-blue-500"
                placeholder="请输入组描述（可选）"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                父组
              </label>
              <select
                value={selectedParentId || ''}
                onChange={(e) => setSelectedParentId(e.target.value || null)}
                className="bg-[#1a2544] text-gray-200 w-full rounded border border-gray-600 py-2 px-3 focus:outline-none focus:border-blue-500"
              >
                <option value="">顶级组</option>
                {groupsData && buildTreeOptions(groupsData)}
              </select>
            </div>
          </div>
          
          <div className="p-4 bg-[#0c1424] rounded-b-lg border-t border-gray-700 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
              disabled={saving}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
              disabled={saving}
            >
              {saving && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TerminalGroupDialog; 