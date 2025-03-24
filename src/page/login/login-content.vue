<template>
  <div class="exam-login-container">
    <div class="logo-container">
      <img src="@/assets/favicon.svg" alt="Logo" />
    </div>
    <div class="login-box animated">
      <div class="login-header">
        <h1 class="login-title">天然在线考试平台</h1>
      </div>
      <el-form :model="loginForm" ref="formRef" status-icon :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="animated-button">登录</el-button>
          <el-button @click="resetForm" class="animated-button">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import {loginApi} from "@/api/api.js";
import {useRouter} from "vue-router";

const formRef = ref(null);
const loginForm = reactive({
  username: '',
  password: ''
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
};

const router = useRouter();

const handleLogin = () => {
  formRef.value.validate( (valid) => {
    if (valid) {
        loginApi.login(loginForm).then(res => {
          if(res.code === 200){
            const token = res.message;
            // 把token放在本地
            localStorage.setItem('token', token);
            ElMessage.success('登录成功');
            router.push('/');
          }else {
            ElMessage.error("登录失败")
          }
        })
    } else {
      ElMessage.error('请填写完整信息');
    }
  });
};

const resetForm = () => {
  formRef.value.resetFields();
};
</script>

<style scoped>

.exam-login-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.logo-container {
  display: flex;
  justify-content: flex-end;
  padding: 10px; /* 减少内边距 */
}

.logo-container img {
  height: 100px; /* 设置 logo 高度 */
}

.login-box {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08), 0 6px 12px rgba(0, 0, 0, 0.05);
  width: 380px;
  /* 修改 margin 属性，减少顶部外边距，让登录框上移 */
  margin: 50px auto auto;
  opacity: 0;
  transform: scale(0.8);
  animation: fadeInScale 0.5s ease-out forwards;
  transition: box-shadow 0.3s ease;
}

.login-box:hover {
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08);
}

@keyframes fadeInScale {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  color: #303133;
  font-size: 28px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-form-item__label {
  color: #606266;
  font-weight: 500;
}

.el-input__inner {
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  padding: 8px 12px;
}

.el-input__inner:hover {
  border-color: #c0c4cc;
}

.el-input__inner:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
  outline: none;
}

.animated-button {
  border-radius: 8px;
  transition: all 0.3s ease;
  padding: 8px 16px;
  font-weight: 500;
}

.animated-button.primary {
  background-color: #409eff;
  border-color: #409eff;
}

.animated-button.primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.animated-button.primary:active {
  transform: translateY(0);
  box-shadow: none;
}

.animated-button:not(.primary) {
  background-color: #f0f2f5;
  border-color: #dcdfe6;
  color: #606266;
}

.animated-button:not(.primary):hover {
  background-color: #e4e7ed;
  border-color: #c0c4cc;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.animated-button:not(.primary):active {
  transform: translateY(0);
  box-shadow: none;
}
</style>
