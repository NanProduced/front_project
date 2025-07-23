import { useState, useCallback } from 'react';

/**
 * API请求hook，用于管理API请求的状态
 * @param apiFunction API请求函数
 * @returns 包含数据、加载状态、错误信息和执行函数的对象
 */
export function useApi<T, P extends any[]>(
  apiFunction: (...args: P) => Promise<T>
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
        setData(response);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '请求失败';
        console.error('API请求错误:', errorMessage);
        setError(error instanceof Error ? error : new Error(errorMessage));
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  return { data, loading, error, execute };
}

/**
 * 带缓存的API请求hook，用于减少重复请求
 * @param apiFunction API请求函数
 * @param cacheKey 缓存键
 * @param ttl 缓存有效期（毫秒）
 * @returns 包含数据、加载状态、错误信息和执行函数的对象
 */
export function useCachedApi<T, P extends any[]>(
  apiFunction: (...args: P) => Promise<T>,
  cacheKey: string,
  ttl: number = 60000 // 默认缓存1分钟
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // 从缓存获取数据
  const getCachedData = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    const cachedItem = localStorage.getItem(`api_cache_${cacheKey}`);
    if (!cachedItem) return null;
    
    try {
      const { data, timestamp } = JSON.parse(cachedItem);
      const now = Date.now();
      
      // 检查缓存是否过期
      if (now - timestamp <= ttl) {
        return data;
      }
      
      // 缓存已过期，删除
      localStorage.removeItem(`api_cache_${cacheKey}`);
    } catch (e) {
      console.error('缓存解析错误:', e);
      localStorage.removeItem(`api_cache_${cacheKey}`);
    }
    
    return null;
  }, [cacheKey, ttl]);

  // 设置缓存
  const setCachedData = useCallback(
    (data: T) => {
      if (typeof window === 'undefined') return;
      
      try {
        localStorage.setItem(
          `api_cache_${cacheKey}`,
          JSON.stringify({
            data,
            timestamp: Date.now()
          })
        );
      } catch (e) {
        console.error('缓存设置错误:', e);
      }
    },
    [cacheKey]
  );

  // 执行API请求
  const execute = useCallback(
    async (...args: P) => {
      try {
        setLoading(true);
        setError(null);
        
        // 尝试从缓存获取
        const cachedData = getCachedData();
        if (cachedData) {
          setData(cachedData);
          return cachedData;
        }
        
        // 缓存未命中，发起请求
        const response = await apiFunction(...args);
        setData(response);
        setCachedData(response);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '请求失败';
        console.error('API请求错误:', errorMessage);
        setError(error instanceof Error ? error : new Error(errorMessage));
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, getCachedData, setCachedData]
  );

  return { data, loading, error, execute };
} 

// 添加默认导出，指向useApi函数
export default useApi; 