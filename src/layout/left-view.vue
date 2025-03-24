<template>
  <div>
    <el-menu
      unique-opened
      :default-active="active"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
    >
      <template v-for="item in menuList" :key="item.path">
        <router-link :to="item.path" v-if="!item.children">
          <el-menu-item :index="item.path">
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.name }}</span>
            </template>
          </el-menu-item>
        </router-link>
      </template>
      <template v-for="item in menuList" :key="item.path">
        <el-sub-menu :index="item.path" v-if="item.children">
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <template v-for="childItem in item.children" :key="childItem.path">
            <router-link :to="item.path + '/' + childItem.path">
              <el-menu-item :index="item.path + '/' + childItem.path">
                <template #title>
                  <el-icon>
                    <component :is="childItem.icon"></component>
                  </el-icon>
                  <span>{{ childItem.name }}</span>
                </template>
              </el-menu-item>
            </router-link>
          </template>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, provide } from 'vue';
import { useRoute } from 'vue-router';
import { routes } from '@/router';

const menuList = ref([]);
const active = ref('');

// 获取当前路由
const route = useRoute();

onMounted(() => {
  const menuRoute = routes[0];
  menuList.value = menuRoute.children;
  active.value = route.path;
});

const handleOpen = (key, keyPath) => {
};

const handleClose = (key, keyPath) => {
};

// 监听路由变化更新激活状态
watch(() => route.path, () => {
  active.value = route.path;
});

// 提供 active 和 menuList 供面包屑组件注入
provide('active', active);
provide('menuList', menuList);
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
