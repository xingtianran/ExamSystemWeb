<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">
      <img
        style="height: 38px"
        src="../../assets/favicon.svg"
        alt="Element logo"
      />
    </el-menu-item>
    <el-sub-menu index="1">
      <template #title>
        <el-avatar class="avatar-box" :src="imagePrefix + user.avatar" />
        &nbsp;
        <el-text>{{user.userName}}</el-text>
      </template>
      <el-menu-item index="1">
        <el-text>
          <el-icon><Reading /></el-icon>
          <span>考试首页</span>
        </el-text>
      </el-menu-item>
      <el-menu-item index="2">
        <el-text>
          <el-icon><Van /></el-icon>
          <span>退出登录</span>
        </el-text>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import {getCurrentInstance, onMounted, ref} from 'vue'
import {userApi} from "@/api/api.js";
import {ElMessage} from "element-plus";
import {Reading, Van} from "@element-plus/icons-vue";
import router from "@/router/index.js";

const instance = getCurrentInstance();
const imagePrefix = instance.appContext.config.globalProperties.$imagePrefix;

const activeIndex = ref('1')
const handleSelect = (key) => {
  if(key === "1"){
    router.push("/")
  } else if(key === "2"){
    // 退出登录
    logout()
  }
}

const user = ref({})

// 获取当前用户信息
const getUserInfo = () => {
  userApi.checkStatus().then(res => {
    if(res.code === 200){
      user.value = res.data
    }else {
      ElMessage.error(res.message)
    }
  })
}

// 退出登录
const logout = () => {
  userApi.logout().then(res => {
    if(res.code === 200){
      ElMessage.success(res.message)
      router.push('/login')
    }else {
      ElMessage.error(res.message)
    }
  })
}

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
.avatar-box{
  width: 35px;
  height: 35px;
}
</style>
