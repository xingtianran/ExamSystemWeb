import { createRouter, createWebHistory } from 'vue-router';
import {userApi} from "@/api/api.js";
import {ElMessage} from "element-plus";

const baseView = import('@/layout/base-view.vue');
const rightView = import('@/layout/right-view.vue');

// 首页
const index = import('@/page/dashboard/index.vue');

// 内容管理
const managePaper = import('@/page/content/manage-paper.vue');
const manageTopic = import('@/page/content/manage-topic.vue');
const  manageTeam = import('@/page/content/manage-team.vue');

// 运营管理
const manageCategory = import('@/page/operation/manage-category.vue');
const manageImage = import('@/page/operation/manage-image.vue');

// 用户管理
const userList = import('@/page/user/user-list.vue');

// 登录
const login = import('@/page/login/login-content.vue');


export const routes= [
  {
    path: '',
    component: baseView,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: '首页',
        icon: 'house',
        component: index
      },
      {
        path: '/content',
        name: '内容',
        icon: 'collection',
        component: rightView,
        children: [
          {
            path: 'manage-paper',
            name: '试卷管理',
            icon: 'tickets',
            component: managePaper
          },
          {
            path: 'manage-topic',
            name: '题目管理',
            icon:'postcard',
            component: manageTopic
          },
          {
            path: 'manage-team',
            name: '组管理',
            icon:'fries',
            component: manageTeam
          }
        ]
      },
      {
        path: '/operation',
        name: '运营',
        icon: 'operation',
        component: rightView,
        children: [
          {
            path: 'manage-category',
            name: '类目管理',
            icon: 'grape',
            component: manageCategory
          },
          {
            path: 'manage-image',
            name: '图片管理',
            icon:'camera',
            component: manageImage
          }
        ]
      },
      {
        path: '/user',
        name: '用户',
        icon: 'user',
        component: rightView,
        children: [
          {
            path: 'user-list',
            name: '用户列表',
            icon: 'bicycle',
            component: userList
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    component: login
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 添加全局前置导航守卫
router.beforeEach( async (to, from, next) => {
  if (to.path !== '/login') {
    try {
      const res = await userApi.checkStatus()
      if(res.data.roles.some(role => role === 'teacher' || role === 'admin')){
        next();
      }
      else {
        ElMessage.error("无权访问");
        await router.push('/login')
      }
    } catch (error) {
      ElMessage.error("无权访问");
      await router.push('/login')
    }
  } else {
    next();
  }
});

export default router

