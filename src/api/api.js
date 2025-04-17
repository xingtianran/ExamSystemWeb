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
  logout: () => del('/Users/Logout'),
  // 获取我的试卷
  getMyExam: () => get('/Users/GetMyExam'),
  // 获取单个考试信息详情
  getExamDetail: (paperId, teamId) => get('/Users/GetExamDetail/' + paperId + '/' + teamId),
  // 批改试卷
  markPaper: (data) => post('/Users/MarkPaper', data),
  // 获取我的错题集
  getErrorSets: () => get('/Users/GetErrorSets')
};

// 图片API
const imageApi = {
  // 获取全部图片
  getImages: (params) => get('/admin/Images/GetAll', params),
  // 更改图片状态
  updateState: (params) => put('/admin/Images/UpdateState/' + params),
  // 删除图片
  deleteImage: (params) => del('/admin/Images/Delete/' + params)
}

// 类目API
const categoryApi = {
  // 获取全部类目
  getCategories: (params) => get('/admin/Categories/GetAll', params),
  // 更新状态
  updateState: (params) => put('/admin/Categories/UpdateState/' + params),
  // 删除类目
  deleteCategory: (params) => del('/admin/Categories/Delete/' + params),
  // 增加类目
  addCategory: (params) => post('/admin/Categories/AddNew', params),
  // 更新类目
  updateCategory: (params) => put('/admin/Categories/Update', params),
  // 获取全部类目不分页
  getCategoryList: () => get('/admin/Categories/GetList')
}

// 题目API
const topicApi = {
  // 获取全部题目
  getTopics: (params) => get('/admin/Topics/GetAll', params),
  // 更改状态
  updateState: (params) => put('/admin/Topics/UpdateState/' + params),
  // 增加题目
  addTopic: (params) => post('/admin/Topics/AddNew', params),
  // 删除题目
  deleteTopic: (params) => del('/admin/Topics/Delete/' + params),
  // 获取题目
  getTopic: (params) => get('/admin/Topics/GetSingle/' + params),
  // 编辑题目
  updateTopic: (params) => put('/admin/Topics/Update', params),
  // 获取部分题目
  getPartTopics: (params) => get('/admin/Topics/GetPart?ids=' + params),
  // 获取题目数量
  getCount: () => get('/admin/Topics/GetCount'),
  // 获取最新的题目
  getNewTopics: (params) => get('/admin/Topics/GetNew/' + params)
}

// 试卷API
const paperApi = {
  // 获取全部试卷
  getPapers: (params) => get('/admin/Papers/GetAll', params),
  // 更新状态
  updateState: (params) => put('/admin/Papers/UpdateState/' + params),
  // 删除试卷
  deletePaper: (params) => del('/admin/Papers/Delete/' + params),
  // 增加试卷
  AddPaper: (data) => postJson('/admin/Papers/AddNew', data),
  // 获取试卷数量
  getCount: () => get('/admin/Papers/GetCount'),
  // 获取单张试卷详细信息
  getPaper: (params) => get('/admin/Papers/GetSingle/' + params),
  // 发布考试
  publishExam: (data) => post('/admin/Papers/Publish', data)
}

// 群组API
const teamApi = {
  // 获取全部群组
  getTeams: (params) => get('/admin/Teams/GetAll', params),
  // 增加群组
  addTeam: (data) => post('/admin/Teams/AddNew', data),
  // 更改群组状态
  updateState: (params) => put('/admin/Teams/UpdateState/' + params),
  // 删除群组
  deleteTeam: (params) => del('/admin/Teams/Delete/' + params),
  // 更新群组
  updateTeam: (data) => put('/admin/Teams/Update', data),
  // 获取群组数量
  getCount: () => get('/admin/Teams/GetCount'),
  // 获取全部群组（不分页）
  getTeamList: () => get('/admin/Teams/GetList')
}

// 门户群组API
const teamPortalApi = {
  // 获取全部群组
  getTeams: (params) => get('/portal/TeamsPortal/GetAll', params),
  // 加入群组
  joinTeam: (params) => get('/Users/JoinTeam', params),
  // 获取我的群组
  getMyTeams: () => get('/portal/TeamsPortal/GetMy')
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
  teamPortalApi,
  loginApi
};

