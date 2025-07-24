'use client';

import React, { useState, useEffect, useRef } from 'react';
import PageTitle from '@/components/PageTitle';
import TerminalGroupTree, { refreshTerminalGroupTree } from '@/components/tree/TerminalGroupTree';
import useApi from '@/hooks/useApi';
import { 
  getTerminals, 
  getTerminalGroupTree, 
  TerminalGroup, 
  Terminal,
  deleteTerminalGroup,
  batchOperateTerminals
} from '@/services/terminalService';
import TerminalGroupDialog from '@/components/dialogs/TerminalGroupDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';

export default function TerminalsPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTerminals, setSelectedTerminals] = useState<string[]>([]);
  
  // 对话框状态
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TerminalGroup | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<TerminalGroup | null>(null);
  const [parentGroupId, setParentGroupId] = useState<string | null>(null);
  const [confirmBulkAction, setConfirmBulkAction] = useState<{
    action: 'enable' | 'disable' | 'delete' | null;
    open: boolean;
  }>({ action: null, open: false });
  
  // 刷新触发器
  const [treeRefreshTrigger, setTreeRefreshTrigger] = useState(0);
  
  // 获取终端列表
  const { 
    execute: fetchTerminals,
    data: terminalsData,
    loading: terminalsLoading,
    error: terminalsError 
  } = useApi((page = 1, size = 10, keyword = '', status = null, groupId = null) => {
    const params: {
      page: number;
      size: number;
      keyword?: string;
      status?: number;
      terminalGroupId?: string;
    } = {
      page: page - 1, // API从0开始计数
      size,
    };
    
    if (keyword) params.keyword = keyword;
    if (status !== null) params.status = status;
    if (groupId) params.terminalGroupId = groupId;
    
    return getTerminals(params);
  });
  
  // 删除终端组API
  const {
    execute: executeDeleteGroup,
    loading: deletingGroup,
    error: deleteGroupError
  } = useApi(deleteTerminalGroup);
  
  // 批量操作终端API
  const {
    execute: executeBulkAction,
    loading: bulkActionLoading,
    error: bulkActionError
  } = useApi(batchOperateTerminals);

  // 初始加载和筛选条件变更时加载数据
  useEffect(() => {
    fetchTerminals(currentPage, pageSize, searchTerm, filterStatus, selectedGroupId);
  }, [currentPage, pageSize, searchTerm, filterStatus, selectedGroupId, fetchTerminals]);
  
  // 处理组选择
  const handleGroupSelect = (group: TerminalGroup) => {
    setSelectedGroupId(group.id);
    setCurrentPage(1); // 重置到第一页
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
      }
      
      // 触发树组件刷新
      setTreeRefreshTrigger(prev => prev + 1);
      
      // 重新获取终端列表
      fetchTerminals(currentPage, pageSize, searchTerm, filterStatus, selectedGroupId);
    } catch (err) {
      console.error('删除终端组失败:', err);
    }
  };
  
  // 处理选择/取消选择终端
  const handleSelectTerminal = (terminalId: string) => {
    setSelectedTerminals(prev => {
      if (prev.includes(terminalId)) {
        return prev.filter(id => id !== terminalId);
      } else {
        return [...prev, terminalId];
      }
    });
  };
  
  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (terminalsData?.content) {
      if (selectedTerminals.length === terminalsData.content.length) {
        setSelectedTerminals([]);
      } else {
        setSelectedTerminals(terminalsData.content.map(terminal => terminal.id));
      }
    }
  };
  
  // 处理批量操作
  const handleBulkAction = (action: 'enable' | 'disable' | 'delete') => {
    setConfirmBulkAction({ action, open: true });
  };
  
  // 确认批量操作
  const handleConfirmBulkAction = async () => {
    if (!confirmBulkAction.action || selectedTerminals.length === 0) return;
    
    try {
      await executeBulkAction(selectedTerminals, confirmBulkAction.action);
      setConfirmBulkAction({ action: null, open: false });
      setSelectedTerminals([]);
      
      // 重新获取终端列表
      fetchTerminals(currentPage, pageSize, searchTerm, filterStatus, selectedGroupId);
    } catch (err) {
      console.error('批量操作终端失败:', err);
    }
  };
  
  // 获取终端状态标签样式
  const getStatusBadge = (status: number) => {
    switch(status) {
      case 1: // 在线
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-900/20 text-green-400 flex items-center">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
            在线
          </span>
        );
      case 0: // 离线
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-700/50 text-gray-300 flex items-center">
            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span>
            离线
          </span>
        );
      case 2: // 告警
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-700/20 text-yellow-400 flex items-center">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>
            告警
          </span>
        );
      case -1: // 禁用
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-900/20 text-red-400 flex items-center">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
            禁用
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-700/50 text-gray-300">
            未知
          </span>
        );
    }
  };
  
  // 获取批量操作确认信息
  const getBulkActionConfirmMessage = () => {
    const count = selectedTerminals.length;
    
    switch (confirmBulkAction.action) {
      case 'enable':
        return `确定要启用选中的 ${count} 个终端吗？`;
      case 'disable':
        return `确定要禁用选中的 ${count} 个终端吗？这将中断这些终端的连接。`;
      case 'delete':
        return `确定要删除选中的 ${count} 个终端吗？此操作不可恢复。`;
      default:
        return '';
    }
  };

  return (
    <div>
      <PageTitle 
        title="终端管理" 
        description="管理和监控所有LED终端设备"
        actions={[
          {
            label: '添加终端',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            ),
            onClick: () => console.log('添加终端'),
            primary: true
          }
        ]}
      />
      
      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* 终端组树 */}
        <div className="col-span-12 lg:col-span-3">
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
        
        {/* 终端列表 */}
        <div className="col-span-12 lg:col-span-9">
          {/* 过滤和搜索 */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="搜索终端名称、ID或位置..." 
                  className="bg-[#0f172a] text-gray-300 border border-gray-700 w-full pl-10 pr-4 py-2 rounded focus:outline-none focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // 重置到第一页
                  }}
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  setFilterStatus(null);
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  filterStatus === null 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                全部
              </button>
              <button 
                onClick={() => {
                  setFilterStatus(1);
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  filterStatus === 1 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                在线
              </button>
              <button 
                onClick={() => {
                  setFilterStatus(0);
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  filterStatus === 0
                    ? "bg-gray-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                离线
              </button>
              <button 
                onClick={() => {
                  setFilterStatus(2);
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  filterStatus === 2
                    ? "bg-yellow-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                告警
              </button>
            </div>
          </div>
          
          {/* 批量操作工具栏 */}
          {selectedTerminals.length > 0 && (
            <div className="mb-4 p-3 bg-blue-900/20 border border-blue-800 rounded-md flex justify-between items-center">
              <div className="text-sm text-blue-300">
                已选择 <span className="font-bold">{selectedTerminals.length}</span> 个终端
              </div>
              <div className="flex space-x-2">
                <button 
                  className="px-3 py-1 text-xs bg-blue-700 hover:bg-blue-600 text-white rounded"
                  onClick={() => handleBulkAction('enable')}
                >
                  启用
                </button>
                <button 
                  className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"
                  onClick={() => handleBulkAction('disable')}
                >
                  禁用
                </button>
                <button 
                  className="px-3 py-1 text-xs bg-red-700 hover:bg-red-600 text-white rounded"
                  onClick={() => handleBulkAction('delete')}
                >
                  删除
                </button>
              </div>
            </div>
          )}
          
          {/* 终端表格 */}
          <div className="bg-[#0f172a] border border-gray-800 rounded-lg overflow-hidden">
            {terminalsLoading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-400">加载终端数据中...</p>
              </div>
            ) : terminalsError ? (
              <div className="py-10 text-center">
                <p className="text-red-400">加载失败: {terminalsError.message}</p>
                <button 
                  onClick={() => fetchTerminals(currentPage, pageSize, searchTerm, filterStatus, selectedGroupId)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  重试
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-[#0c1424]">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left">
                        <div className="flex items-center">
                          <input 
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                            checked={selectedTerminals.length === (terminalsData?.content?.length || 0) && (terminalsData?.content?.length || 0) > 0}
                            onChange={handleSelectAll}
                          />
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">终端ID</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">终端名称</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">状态</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">位置</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">所属组</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">最后在线时间</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {terminalsData?.content && terminalsData.content.length > 0 ? (
                      terminalsData.content.map((terminal) => (
                        <tr key={terminal.id} className="hover:bg-[#1a2544]">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <input 
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                checked={selectedTerminals.includes(terminal.id)}
                                onChange={() => handleSelectTerminal(terminal.id)}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{terminal.terminalNo}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{terminal.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(terminal.status)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{terminal.location || '未设置'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{terminal.terminalGroupName}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            {terminal.lastOnlineTime ? new Date(terminal.lastOnlineTime).toLocaleString('zh-CN') : '未知'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            <div className="flex space-x-2">
                              <button 
                                className="text-blue-400 hover:text-blue-300" 
                                title="查看详情"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button 
                                className="text-green-400 hover:text-green-300"
                                title="编辑终端"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                className="text-red-400 hover:text-red-300"
                                title="删除终端"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                          {selectedGroupId ? '该组下暂无终端' : '暂无终端数据'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* 分页 */}
            {!terminalsLoading && terminalsData && (
              <div className="px-4 py-3 bg-[#0c1424] border-t border-gray-800 sm:px-6 flex items-center justify-between">
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-400">
                    显示 
                    <span className="font-medium mx-1">
                      {terminalsData.content.length > 0 ? (terminalsData.number * terminalsData.size) + 1 : 0}
                    </span> 
                    到 
                    <span className="font-medium mx-1">
                      {Math.min((terminalsData.number + 1) * terminalsData.size, terminalsData.totalElements)}
                    </span>
                    条，共
                    <span className="font-medium mx-1">{terminalsData.totalElements}</span>
                    条记录
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={terminalsData.number === 0}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    上一页
                  </button>
                  {Array.from({ length: Math.min(5, terminalsData.totalPages) }, (_, i) => {
                    // 计算页码，使当前页尽量居中
                    let startPage = Math.max(1, currentPage - 2);
                    let endPage = Math.min(startPage + 4, terminalsData.totalPages);
                    
                    if (endPage - startPage < 4) {
                      startPage = Math.max(1, endPage - 4);
                    }
                    
                    const pageNumber = startPage + i;
                    if (pageNumber <= terminalsData.totalPages) {
                      return (
                        <button
                          key={pageNumber}
                          className={`px-3 py-1 rounded ${
                            pageNumber === currentPage
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    return null;
                  })}
                  <button 
                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={terminalsData.number >= terminalsData.totalPages - 1}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    下一页
                  </button>
                </div>
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
      
      {/* 批量操作确认对话框 */}
      <ConfirmDialog
        isOpen={confirmBulkAction.open}
        title={
          confirmBulkAction.action === 'enable' ? '批量启用终端' :
          confirmBulkAction.action === 'disable' ? '批量禁用终端' :
          confirmBulkAction.action === 'delete' ? '批量删除终端' : 
          '批量操作终端'
        }
        message={getBulkActionConfirmMessage()}
        confirmText={
          confirmBulkAction.action === 'enable' ? '启用' :
          confirmBulkAction.action === 'disable' ? '禁用' :
          confirmBulkAction.action === 'delete' ? '删除' : 
          '确认'
        }
        cancelText="取消"
        onConfirm={handleConfirmBulkAction}
        onCancel={() => setConfirmBulkAction({ action: null, open: false })}
        isLoading={bulkActionLoading}
        variant={confirmBulkAction.action === 'delete' ? 'danger' : 'warning'}
      />
    </div>
  );
} 