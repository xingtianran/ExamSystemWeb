<template>
  <el-container>
    <el-header>
      <top-view></top-view>
    </el-header>
    <el-container class="app-box">
      <el-aside :class="{ 'menu-box': true, 'collapsed': isCollapsed }">
        <left-view :isCollapsed="isCollapsed" @toggleCollapse="toggleCollapse"></left-view>
      </el-aside>
      <el-main class="content-box">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';

const isCollapsed = ref(false);

const toggleCollapse = (newValue) => {
  isCollapsed.value = newValue;
};
</script>

<style scoped>
.app-box {
  display: flex;
}

.menu-box {
  width: 200px; /* 初始宽度 */
  transition: width 0.3s ease; /* 设置过渡效果 */
  overflow-y: auto; /* 展开时显示滚动条 */
}

.menu-box.collapsed {
  width: 90px; /* 收缩后的宽度 */
  overflow: hidden; /* 收缩时隐藏滚动条 */
}

.content-box {
  flex: 1; /* 占据剩余空间 */
  padding: 15px;
}
</style>
