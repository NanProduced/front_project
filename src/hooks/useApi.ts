import { useState, useCallback } from 'react';
import { ApiResponse } from '@/utils/api';

/**
 * API请求hook，用于管理API请求的状态
 * @param apiFunction API请求函数
 * @returns 包含数据、加载状态、错误信息和执行函数的对象
 */
export function useApi<T, P extends any[]>(
  apiFunction: (...args: P) => Promise<ApiResponse<T>>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // 执行API请求
  const execute = useCallback(
    async (...args: P) => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiFunction(...args);
        
        if (response.success) {
          setData(response.data || null);
          return response.data;
        } else {
          const errorMessage = response.message || '请求失败';
          const error = new Error(errorMessage);
          setError(error);
          return null;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('未知错误');
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  return {
    data,
    loading,
    error,
    execute
  };
}

/**
 * 带缓存的API请求hook，适用于不常变化的数据
 * @param apiFunction API请求函数
 * @param cacheKey 缓存键
 * @param cacheTime 缓存时间（毫秒）
 * @returns 包含数据、加载状态、错误信息和执行函数的对象
 */
export function useCachedApi<T, P extends any[]>(
  apiFunction: (...args: P) => Promise<ApiResponse<T>>,
  cacheKey: string,
  cacheTime: number = 5 * 60 * 1000 // 默认5分钟
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // 从缓存中获取数据
  const getFromCache = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    const cachedData = localStorage.getItem(`api_cache_${cacheKey}`);
    if (!cachedData) return null;
    
    try {
      const { data, timestamp } = JSON.parse(cachedData);
      
      // 检查缓存是否过期
      if (Date.now() - timestamp > cacheTime) {
        localStorage.removeItem(`api_cache_${cacheKey}`);
        return null;
      }
      
      return data;
    } catch (err) {
      localStorage.removeItem(`api_cache_${cacheKey}`);
      return null;
    }
  }, [cacheKey, cacheTime]);

  // 将数据保存到缓存
  const saveToCache = useCallback(
    (data: T) => {
      if (typeof window === 'undefined') return;
      
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      
      localStorage.setItem(`api_cache_${cacheKey}`, JSON.stringify(cacheData));
    },
    [cacheKey]
  );

  // 执行API请求
  const execute = useCallback(
    async (...args: P) => {
      try {
        // 尝试从缓存获取
        const cachedData = getFromCache();
        if (cachedData) {
          setData(cachedData);
          return cachedData;
        }
        
        setLoading(true);
        setError(null);
        
        const response = await apiFunction(...args);
        
        if (response.success) {
          const responseData = response.data || null;
          setData(responseData);
          
          // 保存到缓存
          if (responseData) {
            saveToCache(responseData);
          }
          
          return responseData;
        } else {
          const errorMessage = response.message || '请求失败';
          const error = new Error(errorMessage);
          setError(error);
          return null;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('未知错误');
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, getFromCache, saveToCache]
  );

  // 强制刷新，忽略缓存
  const refresh = useCallback(
    async (...args: P) => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiFunction(...args);
        
        if (response.success) {
          const responseData = response.data || null;
          setData(responseData);
          
          // 更新缓存
          if (responseData) {
            saveToCache(responseData);
          }
          
          return responseData;
        } else {
          const errorMessage = response.message || '请求失败';
          const error = new Error(errorMessage);
          setError(error);
          return null;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('未知错误');
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, saveToCache]
  );

  return {
    data,
    loading,
    error,
    execute,
    refresh
  };
}

export default useApi; 