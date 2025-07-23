import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getCurrentGatewayUrl } from '@/config/auth';

// 微服务前缀常量
export const API_PREFIXES = {
  CORE: '/core/api',
  AUTH: '/auth/api',
  MESSAGE: '/message/api/v1'
};

// 响应状态码
export enum ApiResponseCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

// 响应结构接口
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  timestamp?: string;
  success: boolean;
}

// 创建axios实例
const apiClient = axios.create({
  timeout: 30000, // 请求超时时间：30秒
  withCredentials: true, // 允许携带cookie
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 获取网关地址
    const gatewayUrl = getCurrentGatewayUrl();
    
    // 设置基础URL
    if (!config.baseURL) {
      config.baseURL = gatewayUrl;
    }
    
    // 设置通用headers
    config.headers = {
      ...config.headers,
      'Content-Type': 'application/json',
    };
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回响应数据
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      
      // 401未授权，重定向到登录页面
      if (status === ApiResponseCode.UNAUTHORIZED) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(new Error('登录已过期，请重新登录'));
      }
      
      // 403禁止访问
      if (status === ApiResponseCode.FORBIDDEN) {
        return Promise.reject(new Error('您没有权限执行此操作'));
      }
      
      // 500服务器错误
      if (status === ApiResponseCode.INTERNAL_SERVER_ERROR) {
        return Promise.reject(new Error('服务器错误，请稍后重试'));
      }
    }
    
    return Promise.reject(error);
  }
);

// API调用函数
export const api = {
  /**
   * 发送GET请求
   * @param url 请求地址
   * @param params URL参数
   * @param config 请求配置
   */
  async get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.get<ApiResponse<T>>(url, { 
        params, 
        ...config 
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * 发送POST请求
   * @param url 请求地址
   * @param data 请求体数据
   * @param config 请求配置
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * 发送PUT请求
   * @param url 请求地址
   * @param data 请求体数据
   * @param config 请求配置
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * 发送DELETE请求
   * @param url 请求地址
   * @param config 请求配置
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * 发送PATCH请求
   * @param url 请求地址
   * @param data 请求体数据
   * @param config 请求配置
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// 针对核心服务的API
export const coreApi = {
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return api.get<T>(`${API_PREFIXES.CORE}${url}`, params, config);
  },
  
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return api.post<T>(`${API_PREFIXES.CORE}${url}`, data, config);
  },
  
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return api.put<T>(`${API_PREFIXES.CORE}${url}`, data, config);
  },
  
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return api.delete<T>(`${API_PREFIXES.CORE}${url}`, config);
  },
  
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return api.patch<T>(`${API_PREFIXES.CORE}${url}`, data, config);
  }
};

// 针对认证服务的API
export const authApi = {
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return api.get<T>(`${API_PREFIXES.AUTH}${url}`, params, config);
  },
  
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return api.post<T>(`${API_PREFIXES.AUTH}${url}`, data, config);
  }
};

// 针对消息服务的API
export const messageApi = {
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return api.get<T>(`${API_PREFIXES.MESSAGE}${url}`, params, config);
  },
  
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return api.post<T>(`${API_PREFIXES.MESSAGE}${url}`, data, config);
  }
};

/**
 * 统一处理API错误
 * @param error 错误对象
 */
function handleApiError(error: any): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;
    
    // 如果有响应数据
    if (axiosError.response?.data) {
      const { message } = axiosError.response.data;
      return new Error(message || '请求失败');
    }
    
    // 网络错误
    if (error.message === 'Network Error') {
      return new Error('网络连接失败，请检查您的网络');
    }
    
    // 请求超时
    if (error.message.includes('timeout')) {
      return new Error('请求超时，请稍后重试');
    }
  }
  
  // 默认错误信息
  return new Error(error?.message || '未知错误');
}

export default api; 