import axios from 'axios';
import {ElMessage} from "element-plus";

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // 你的 API 基础路径，可以在 .env 文件中配置
  timeout: 5000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，例如添加 token 到请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    ElMessage.error(error.message)
  }
);

// 封装 get 请求
export function get(url, params = {}) {
  return service({
    url,
    method: 'get',
    params
  });
}

// 封装 post 请求
export function post(url, data = {}) {
  return service({
    url,
    method: 'post',
    data
  });
}

// 封装 put 请求
export function put(url, data = {}) {
  return service({
    url,
    method: 'put',
    data
  });
}

// 封装 delete 请求
export function del(url, params = {}) {
  return service({
    url,
    method: 'delete',
    params
  });
}
