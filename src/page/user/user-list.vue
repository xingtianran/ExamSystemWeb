<template>
<div class="clear-fx">
  <div class="user-search-box clear-fx">
    <div class="username-input-box float-left">
      <el-input
        v-model="searchInfo.userName"
        placeholder="用户名"
        :prefix-icon="Search"
      />
    </div>
    <div class="role-select-box float-left">
      <el-select v-model="searchInfo.role" placeholder="角色">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
    </div>
    <div class="float-left">
      <el-button type="primary" @click="doSearch">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>
  </div>
  <div class="user-list-box">
    <el-table v-loading="loading" :data="users"  style="width: 100%">
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="userName" label="UserName" width="180" />
      <el-table-column label="Avatar">
        <template #default="scope">
          <el-avatar class="avatar-box" shape="square" :src="imagePrefix + scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="roles" label="Role" />
      <el-table-column label="Handle">
        <template #default="scope">
          <el-button size="small" @click="openResetPwdDialog(scope.row)">
            重置密码
          </el-button>
          <el-button v-if="scope.row.isLock === '1'" @click="lockUser(scope.row)" size="small" type="danger">锁定</el-button>
          <el-button v-else size="small" type="success" @click="unLockUser(scope.row)">解锁</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="user-pagination-box float-right">
    <el-pagination
      size="small"
      background
      @current-change="turnPage"
      layout="prev, pager, next"
      :current-page="pageInfo.page"
      :page-size="pageInfo.size"
      :page-count="pageInfo.totalPage"
      class="mt-4"
    />
  </div>
  <div>

  </div>
</div>

<div>
  <el-dialog
    v-model="resetPwdDialog"
    title="重置密码"
    width="380"
    :before-close="handleClose"
  >
    <div>
      <span>新密码：</span>
      <el-input
        v-model="resetPwdInfo.newPwd"
        style="width: 285px"
        placeholder="Pick a date"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" @click="handleClose()">取消</el-button>
        <el-button size="small" type="primary" @click="resetPwd">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</div>
</template>

<script setup>
import {getCurrentInstance, onMounted, ref} from 'vue'
import { Search } from '@element-plus/icons-vue'
import {userApi} from "@/api/api.js";
import {ElMessage, ElMessageBox} from "element-plus";

const instance = getCurrentInstance();
const imagePrefix = instance.appContext.config.globalProperties.$imagePrefix;

const searchInfo = ref({
  userName : '',
  role : ''
})

const roles = ref([])
const users = ref([])

const loading = ref(false)
const resetPwdDialog = ref(false)

const pageInfo = ref({
  page : 1,
  size : 6,
  totalPage : 0
})

const resetPwdInfo = ref({
  userId : 0,
  newPwd : '123456'
})

const handleClose = () => {
  ElMessageBox.confirm('确认要关闭弹出窗口吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    buttonSize: "small"
  })
    .then(() => {
      resetPwdInfo.value.userId = 0
      resetPwdInfo.value.newPwd = '123456'
      resetPwdDialog.value = false
    })
}

// 重置搜索内容
const resetSearch = () => {
  searchInfo.value.userName = ''
  searchInfo.value.role = ''
  pageInfo.value.page = 1
  getUsers(pageInfo.value, searchInfo.value)
}

// 翻页
const turnPage = (newPage) => {
  pageInfo.value.page = newPage
  getUsers(pageInfo.value, searchInfo.value);
}

// 获取角色内容
const getRoles = () => {
    userApi.getRoles().then(res => {
      if(res.code === 200){
        roles.value = res.data
      }else {
        ElMessage.error(res.message);
      }
    })
}
// 搜索
const doSearch = () => {
  getUsers(pageInfo.value, searchInfo.value)
}

// 获取全部用户
const getUsers = (pageInfo, searchInfo) => {
  loading.value = true
  const params = {
    ...pageInfo,
    ...searchInfo
  }
  userApi.getUsers(params).then(res => {
    if(res.code === 200){
      users.value = res.data
      pageInfo.totalPage = res.totalPage
      loading.value = false
    }else {
      ElMessage.error(res.message);
    }
  })
}
// 打开重置密码框
const openResetPwdDialog = (data) => {
  resetPwdInfo.value.userId = data.id
  resetPwdDialog.value = true
}
// 重置密码
const resetPwd = () => {
  userApi.resetPwd(resetPwdInfo.value).then(res => {
    if(res.code === 200){
      ElMessage.success(res.message);
    }else {
      ElMessage.error(res.message)
    }
  })
  resetPwdDialog.value = false
  resetPwdInfo.value.userId = 0
  resetPwdInfo.value.newPwd = '123456'
}

// 锁定用户
const lockUser = (data) => {
  ElMessageBox.confirm('确认要锁定用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    buttonSize: "small"
  })
    .then(() => {
      userApi.lockUser(data.id).then(res => {
        if(res.code === 200){
          ElMessage.success(res.message)
        }else {
          ElMessage.error(res.message)
        }
        getUsers(pageInfo.value, searchInfo.value)
      })
    })
}

// 解锁用户
const unLockUser = (data) => {
  ElMessageBox.confirm('确认要解锁用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    buttonSize: "small"
  })
    .then(() => {
      userApi.unLockUser(data.id).then(res => {
        if(res.code === 200){
          ElMessage.success(res.message)
        }else {
          ElMessage.error(res.message)
        }
        getUsers(pageInfo.value, searchInfo.value)
      })
    })
}

onMounted(() => {
  getRoles()
  getUsers(pageInfo.value)
})
</script>

<style scoped>
.clear-fx{
  overflow: hidden;
}
.float-left{
  float: left;
}
.float-right{
  float: right;
}

.user-search-box > div{
  margin-left: 10px;
}
.user-search-box > div:first-child{
  margin-left: 0;
}
.username-input-box{
  width: 240px;
}
.role-select-box{
  width: 240px;
}
.avatar-box{
  width: 45px;
  height: 45px;
}
.user-pagination-box{
  margin-top: 10px;
}
</style>
