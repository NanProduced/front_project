'use client';

import React, { useState, useEffect } from 'react';
import PageTitle from '@/components/PageTitle';
import TerminalGroupTree, { refreshTerminalGroupTree } from '@/components/tree/TerminalGroupTree';
import { useApi } from '@/hooks/useApi';
import { 
  getTerminalGroupTree, 
  TerminalGroup,
  deleteTerminalGroup
} from '@/services/terminalService';
import TerminalGroupDialog from '@/components/dialogs/TerminalGroupDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';

export default function TerminalGroupsPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<TerminalGroup | null>(null);
  
  // 对话框状态
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TerminalGroup | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<TerminalGroup | null>(null);
  const [parentGroupId, setParentGroupId] = useState<string | null>(null);
  
  // 刷新触发器
  const [treeRefreshTrigger, setTreeRefreshTrigger] = useState(0);
  
  // 删除终端组API
  const {
    execute: executeDeleteGroup,
    loading: deletingGroup,
    error: deleteGroupError
  } = useApi(deleteTerminalGroup);

  // 处理组选择
  const handleGroupSelect = (group: TerminalGroup) => {
    setSelectedGroupId(group.id);
    setSelectedGroup(group);
  };
  
  // 处理添加终端组
  const handleAddGroup = (parentId: string | null) => {
    setEditingGroup(null);
    setParentGroupId(parentId);
    setGroupDialogOpen(true);
  };
  
  // 处理编辑终端组
  const handleEditGroup = (group: TerminalGroup) => {
    setEditingGroup(group);
    setParentGroupId(null);
    setGroupDialogOpen(true);
  };
  
  // 处理删除终端组
  const handleDeleteGroup = (group: TerminalGroup) => {
    setGroupToDelete(group);
    setConfirmDeleteOpen(true);
  };
  
  // 确认删除终端组
  const confirmDeleteGroup = async () => {
    if (!groupToDelete) return;
    
    try {
      await executeDeleteGroup(groupToDelete.id);
      setConfirmDeleteOpen(false);
      setGroupToDelete(null);
      
      // 如果当前正在查看被删除的组，重置选中状态
      if (selectedGroupId === groupToDelete.id) {
        setSelectedGroupId(null);
        setSelectedGroup(null);
      }
      
      // 触发树组件刷新
      setTreeRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('删除终端组失败:', err);
    }
  };

  return (
    <div>
      <PageTitle 
        title="终端组管理" 
        description="管理终端分组结构"
        actions={[
          {
            label: '添加根组',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            ),
            onClick: () => handleAddGroup(null),
            primary: true
          }
        ]}
      />
      
      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* 终端组树 */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-4 h-[calc(100vh-240px)] overflow-auto">
            <TerminalGroupTree 
              onSelect={handleGroupSelect}
              selectedId={selectedGroupId || undefined}
              showActions={true}
              onAddGroup={handleAddGroup}
              onEditGroup={handleEditGroup}
              onDeleteGroup={handleDeleteGroup}
              refreshTrigger={treeRefreshTrigger}
            />
          </div>
        </div>
        
        {/* 终端组详情 */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6 h-[calc(100vh-240px)] overflow-auto">
            {selectedGroup ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">{selectedGroup.name}</h2>
                  <div className="flex space-x-2">
                    <button 
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center"
                      onClick={() => handleEditGroup(selectedGroup)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      编辑
                    </button>
                    <button 
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm flex items-center"
                      onClick={() => handleDeleteGroup(selectedGroup)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      删除
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* 基本信息 */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">基本信息</h3>
                    <div className="bg-[#1a2544] rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-400">组ID</div>
                          <div className="text-white mt-1">{selectedGroup.id}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">组名称</div>
                          <div className="text-white mt-1">{selectedGroup.name}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400">描述</div>
                        <div className="text-white mt-1">{selectedGroup.description || '无描述'}</div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-400">层级</div>
                          <div className="text-white mt-1">{selectedGroup.level}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">父组ID</div>
                          <div className="text-white mt-1">{selectedGroup.parentId || '无 (根组)'}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400">路径</div>
                        <div className="text-white mt-1 break-all">{selectedGroup.path}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 子组信息 */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-medium text-white">子组</h3>
                      <button 
                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                        onClick={() => handleAddGroup(selectedGroup.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        添加子组
                      </button>
                    </div>
                    
                    {selectedGroup.children && selectedGroup.children.length > 0 ? (
                      <div className="bg-[#1a2544] rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-800">
                          <thead className="bg-[#0c1424]">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">组名称</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">描述</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800">
                            {selectedGroup.children.map(child => (
                              <tr key={child.id} className="hover:bg-[#253455]">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{child.name}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{child.description || '无描述'}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                  <div className="flex space-x-2">
                                    <button 
                                      className="text-blue-400 hover:text-blue-300"
                                      onClick={() => handleGroupSelect(child)}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    </button>
                                    <button 
                                      className="text-green-400 hover:text-green-300"
                                      onClick={() => handleEditGroup(child)}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                    <button 
                                      className="text-red-400 hover:text-red-300"
                                      onClick={() => handleDeleteGroup(child)}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="bg-[#1a2544] rounded-lg p-8 text-center">
                        <p className="text-gray-400">该组下暂无子组</p>
                        <button 
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          onClick={() => handleAddGroup(selectedGroup.id)}
                        >
                          添加子组
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-gray-400 text-lg">请从左侧选择一个终端组</p>
                <p className="text-gray-500 mt-2">或者创建一个新的终端组</p>
                <button 
                  className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => handleAddGroup(null)}
                >
                  创建根组
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 终端组对话框 */}
      <TerminalGroupDialog
        isOpen={groupDialogOpen}
        onClose={() => setGroupDialogOpen(false)}
        groupToEdit={editingGroup}
        parentGroupId={parentGroupId}
        onSuccess={() => {
          // 触发树组件刷新
          setTreeRefreshTrigger(prev => prev + 1);
          // 或者使用暴露的刷新方法
          refreshTerminalGroupTree();
        }}
      />
      
      {/* 删除终端组确认对话框 */}
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        title="删除终端组"
        message={`确定要删除终端组"${groupToDelete?.name}"吗？此操作不可恢复，该组下的终端将不会被删除。`}
        confirmText="删除"
        cancelText="取消"
        onConfirm={confirmDeleteGroup}
        onCancel={() => setConfirmDeleteOpen(false)}
        isLoading={deletingGroup}
        variant="danger"
      />
    </div>
  );
} 