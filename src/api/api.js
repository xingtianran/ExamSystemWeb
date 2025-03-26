import { get, post, put, del } from './http.js';

// 用户API
const userApi = {
  // 检查登录状态，返回当前用户
  checkStatus: () => get('/Users/CheckStatus'),
  // 获取全部角色
  getRoles: () => get('/Users/GetRoles'),
  // 获取全部用户
  getUsers: (params) => get('/Users/GetAll', params),
  // 重置密码
  resetPwd: (params) => get('/Users/ResetPwd', params),
  // 锁定用户
  lockUser: (params) => del('/Users/LockUser/' + params),
  // 解锁用户
  unLockUser: (params) => put('/Users/UnLockUser/' + params)
};

// 图片API
const imageApi = {
  // 获取全部图片
  getImages: (params) => get('/Images/GetAll', params),
  // 更改图片状态
  updateState: (params) => put('/Images/UpdateState/' + params),
  // 删除图片
  deleteImage: (params) => del('/Images/Delete/' + params)
}

// 类目API
const categoryApi = {
  // 获取全部类目
  getCategories: (params) => get('/Categories/GetAll', params),
  // 更新状态
  updateState: (params) => put('/Categories/UpdateState/' + params),
  // 删除类目
  deleteCategory: (params) => del('/Categories/Delete/' + params),
  // 增加类目
  addCategory: (params) => post('/Categories/AddNew', params),
  // 更新类目
  updateCategory: (params) => put('/Categories/Update', params),
  // 获取全部类目不分页
  getCategoryList: () => get('/Categories/GetList')
}

// 题目API
const topicApi = {
  // 获取全部题目
  getTopics: (params) => get('Topics/GetAll', params),
  // 更改状态
  updateState: (params) => put('/Topics/UpdateState/' + params),
  // 增加题目
  addTopic: (params) => post('/Topics/AddNew', params)
}

// 登录API
const loginApi = {
  // 用户登录
  login: (params) => get('/Users/Login', params)
};

export {
  userApi,
  imageApi,
  categoryApi,
  topicApi,
  loginApi
};

