<template>
  <div>
    <el-card shadow="never">
      <div>
        <div>
          <el-text size="large">个人信息</el-text>
        </div>
        <el-divider style="margin-top: 10px; margin-bottom: 10px;" />
        <div>
          <div>
            <el-text>用户名：{{user.userName}}</el-text>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>

import {userApi} from "@/api/api.js";
import {ElMessage} from "element-plus";
import {onMounted, ref} from "vue";

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

onMounted(() => {
  getUserInfo()
})

</script>

<style scoped>

</style>
