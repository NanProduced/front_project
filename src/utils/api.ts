import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { redirect } from 'next/navigation';

// API响应接口
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  timestamp?: string;
  success: boolean;
}

// 后端统一响应结构
export interface DynamicResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

// API前缀
export const API_PREFIXES = {
  AUTH: '/auth/api',
  CORE: '/core/api',
  MESSAGE: '/message/api/v1',
};

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 确保包含凭证(cookies)
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 确保所有请求都带上凭证
    config.withCredentials = true;
    
    // 添加调试信息
    console.log(`API请求: ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // 详细记录API错误
    console.error('API响应错误:', error.message);
    if (error.response) {
      console.error('错误状态码:', error.response.status);
      console.error('错误数据:', error.response.data);
    }

    // 处理401未授权错误，重定向到登录页
    if (error.response && error.response.status === 401) {
      console.error('用户未授权，准备重定向到登录页');
      // 在客户端环境下执行重定向
      if (typeof window !== 'undefined') {
        console.log('执行重定向到登录页');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 处理API错误
const handleApiError = (error: any): never => {
  console.error('API请求错误处理:', error);
  
  if (error.response) {
    // 服务器响应了，但状态码不在2xx范围
    const status = error.response.status;
    const data = error.response.data;
    
    if (status === 401) {
      console.error('未授权错误(401): 需要重新登录');
      throw new Error('未授权，请重新登录');
    } else if (status === 403) {
      console.error('禁止访问错误(403): 权限不足');
      throw new Error('权限不足，无法访问');
    } else if (status === 500) {
      console.error('服务器错误(500):', data);
      throw new Error(`服务器错误: ${data?.message || data?.msg || '未知错误'}`);
    } else {
      console.error(`请求失败 (${status}):`, data);
      throw new Error(`请求失败 (${status}): ${data?.message || data?.msg || '未知错误'}`);
    }
  } else if (error.request) {
    // 请求已发送但没有收到响应
    console.error('网络错误: 服务器无响应', error.request);
    throw new Error('服务器无响应，请检查网络连接');
  } else {
    // 请求配置出错
    console.error('请求配置错误:', error.message);
    throw new Error(`请求配置错误: ${error.message}`);
  }
};

// API工具类
class Api {
  /**
   * 发送GET请求
   * @param url 请求地址
   * @param params URL参数
   * @param config 请求配置
   */
  async get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      console.log(`发送GET请求: ${url}`, { params });
      const response = await apiClient.get<DynamicResponse<T>>(url, { 
        params, 
        ...config 
      });
      console.log(`GET请求响应: ${url}`, response);
      
      // 处理DynamicResponse结构
      if (response.data && typeof response.data === 'object') {
        if ('code' in response.data && 'msg' in response.data) {
          const dynamicResponse = response.data as DynamicResponse<T>;
          
          // 检查响应状态
          if (dynamicResponse.code === 200 || dynamicResponse.code === 0) {
            return dynamicResponse.data;
          } else {
            console.error('API错误:', dynamicResponse.msg);
            throw new Error(dynamicResponse.msg || '请求失败');
          }
        } else {
          // 如果不是标准响应结构，直接返回数据
          return response.data as T;
        }
      } else {
        throw new Error('无效的响应数据');
      }
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * 发送POST请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.post<DynamicResponse<T>>(url, data, config);
      
      // 处理DynamicResponse结构
      if (response.data && typeof response.data === 'object') {
        if ('code' in response.data && 'msg' in response.data) {
          const dynamicResponse = response.data as DynamicResponse<T>;
          
          // 检查响应状态
          if (dynamicResponse.code === 200 || dynamicResponse.code === 0) {
            return dynamicResponse.data;
          } else {
            console.error('API错误:', dynamicResponse.msg);
            throw new Error(dynamicResponse.msg || '请求失败');
          }
        } else {
          // 如果不是标准响应结构，直接返回数据
          return response.data as T;
        }
      } else {
        throw new Error('无效的响应数据');
      }
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * 发送PUT请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.put<DynamicResponse<T>>(url, data, config);
      
      // 处理DynamicResponse结构
      if (response.data && typeof response.data === 'object') {
        if ('code' in response.data && 'msg' in response.data) {
          const dynamicResponse = response.data as DynamicResponse<T>;
          
          // 检查响应状态
          if (dynamicResponse.code === 200 || dynamicResponse.code === 0) {
            return dynamicResponse.data;
          } else {
            console.error('API错误:', dynamicResponse.msg);
            throw new Error(dynamicResponse.msg || '请求失败');
          }
        } else {
          // 如果不是标准响应结构，直接返回数据
          return response.data as T;
        }
      } else {
        throw new Error('无效的响应数据');
      }
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * 发送DELETE请求
   * @param url 请求地址
   * @param config 请求配置
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.delete<DynamicResponse<T>>(url, config);
      
      // 处理DynamicResponse结构
      if (response.data && typeof response.data === 'object') {
        if ('code' in response.data && 'msg' in response.data) {
          const dynamicResponse = response.data as DynamicResponse<T>;
          
          // 检查响应状态
          if (dynamicResponse.code === 200 || dynamicResponse.code === 0) {
            return dynamicResponse.data;
          } else {
            console.error('API错误:', dynamicResponse.msg);
            throw new Error(dynamicResponse.msg || '请求失败');
          }
        } else {
          // 如果不是标准响应结构，直接返回数据
          return response.data as T;
        }
      } else {
        throw new Error('无效的响应数据');
      }
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// 创建API实例
export const api = new Api();

// 创建特定服务的API客户端
class ServiceApi {
  private basePrefix: string;

  constructor(basePrefix: string) {
    this.basePrefix = basePrefix;
  }

  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return api.get<T>(`${this.basePrefix}${url}`, params, config);
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return api.post<T>(`${this.basePrefix}${url}`, data, config);
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return api.put<T>(`${this.basePrefix}${url}`, data, config);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return api.delete<T>(`${this.basePrefix}${url}`, config);
  }
}

// 导出特定服务的API客户端
export const authApi = new ServiceApi(API_PREFIXES.AUTH);
export const coreApi = new ServiceApi(API_PREFIXES.CORE);
export const messageApi = new ServiceApi(API_PREFIXES.MESSAGE); 