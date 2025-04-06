<template>
  <div class="breadcrumb-box">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="'/admin'" @click="goToHome">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ parentRouteName }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ route.name }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <div class="content-box">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, watch, provide, inject } from 'vue';

const route = useRoute();
const router = useRouter();

// 上一级路由名称
const parentRouteName = ref('');

// 注入导航栏组件的 active 状态和 menuList
const active = inject('active', ref(''));
const menuList = inject('menuList', ref([]));

// 提供更新导航栏的函数
const updateNav = () => {
  const homeMenuRoute = routes[0];
  menuList.value = homeMenuRoute.children || [];
  active.value = '/';
};
provide('updateNav', updateNav);

// 监听路由变化
watch(
  () => route,
  (newRoute) => {
    const matchedRoutes = newRoute.matched;
    if (matchedRoutes.length > 1) {
      const parentRoute = matchedRoutes[matchedRoutes.length - 2];
      parentRouteName.value = parentRoute.name || '未命名路由';
    } else {
      parentRouteName.value = '无上级路由';
    }
  },
  { deep: true }
);

// 初始化上一级路由名称
const initParentRouteName = () => {
  const matchedRoutes = route.matched;
  if (matchedRoutes.length > 1) {
    const parentRoute = matchedRoutes[matchedRoutes.length - 2];
    parentRouteName.value = parentRoute.name || '未命名路由';
  } else {
    parentRouteName.value = '无上级路由';
  }
};

initParentRouteName();

const goToHome = () => {
  router.push('/admin');
  // 触发更新导航栏
  updateNav();
};
</script>

<style scoped>
.breadcrumb-box{
  padding-bottom: 10px;
  border-bottom: 1px solid #E6E8EB;
}
.content-box{
  margin-top: 10px;
}
</style>
