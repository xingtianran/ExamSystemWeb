import {get, post, put, del, postJson} from './http.js';

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
  unLockUser: (params) => put('/Users/UnLockUser/' + params),
  // 获取用户数量
  getCount: () => get('/Users/GetCount'),
  // 退出登录
  logout: () => del('/Users/Logout')
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
  addTopic: (params) => post('/Topics/AddNew', params),
  // 删除题目
  deleteTopic: (params) => del('/Topics/Delete/' + params),
  // 获取题目
  getTopic: (params) => get('/Topics/GetSingle/' + params),
  // 编辑题目
  updateTopic: (params) => put('/Topics/Update', params),
  // 获取部分题目
  getPartTopics: (params) => get('/Topics/GetPart?ids=' + params),
  // 获取题目数量
  getCount: () => get('/Topics/GetCount'),
  // 获取最新的题目
  getNewTopics: (params) => get('/Topics/GetNew/' + params)
}

// 试卷API
const paperApi = {
  // 获取全部试卷
  getPapers: (params) => get('/Papers/GetAll', params),
  // 更新状态
  updateState: (params) => put('/Papers/UpdateState/' + params),
  // 删除试卷
  deletePaper: (params) => del('/Papers/Delete/' + params),
  // 增加试卷
  AddPaper: (data) => postJson('/Papers/AddNew', data),
  // 获取试卷数量
  getCount: () => get('/Papers/GetCount')
}

// 群组API
const teamApi = {
  // 获取全部群组
  getTeams: (params) => get('/Teams/GetAll', params),
  // 增加群组
  addTeam: (data) => post('/Teams/AddNew', data),
  // 更改群组状态
  updateState: (params) => put('/Teams/UpdateState/' + params),
  // 删除群组
  deleteTeam: (params) => del('/Teams/Delete/' + params),
  // 更新群组
  updateTeam: (data) => put('/Teams/Update', data),
  // 获取群组数量
  getCount: () => get('/Teams/GetCount')
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
  paperApi,
  teamApi,
  loginApi
};

