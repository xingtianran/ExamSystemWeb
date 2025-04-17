import { createRouter, createWebHistory } from 'vue-router';
import {userApi} from "@/api/api.js";
import {ElMessage} from "element-plus";

const adminBaseView = import('@/layout/admin/base-view.vue');
const rightView = import('@/layout/admin/right-view.vue');

const portalBaseView = import('@/layout/portal/portal-base-view.vue');

// 首页
const adminIndex = import('@/page/admin/dashboard/index.vue');

// 门户首页
const portalIndex = import('@/page/portal/index.vue');

// 内容管理
const managePaper = import('@/page/admin/content/manage-paper.vue');
const addPaper = import('@/page/admin/content/add-paper.vue');
const manageTopic = import('@/page/admin/content/manage-topic.vue');
const addTopic = import('@/page/admin/content/add-topic.vue');
const manageTeam = import('@/page/admin/content/manage-team.vue');
const publicPaper = import('@/page/admin/content/public-paper.vue')

// 运营管理
const manageCategory = import('@/page/admin/operation/manage-category.vue');
const manageImage = import('@/page/admin/operation/manage-image.vue');

// 用户管理
const userList = import('@/page/admin/user/user-list.vue');

// 门户群组信息
const teamInfo = import('@/page/portal/team-info.vue')

// 我的信息
const userInfo = import('@/page/portal/user-info.vue')

// 登录
const login = import('@/page/login/login-content.vue');

// 做题
const doPaper = import('@/page/portal/do-paper.vue')

// 错题集
const errorInfo = import('@/page/portal/error-info.vue');



export const routes= [
  {
    path: '/admin',
    component: adminBaseView,
    redirect: '/admin/index',
    children: [
      {
        path: '/admin/index',
        name: '首页',
        icon: 'house',
        component: adminIndex
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
            path: 'add-paper',
            name: '试卷增加',
            icon: 'brush',
            component: addPaper
          },
          {
            path: 'manage-topic',
            name: '题目管理',
            icon:'postcard',
            component: manageTopic
          },
          {
            path: 'add-topic',
            name: '题目增加',
            icon:'printer',
            component: addTopic
          },
          {
            path: 'manage-team',
            name: '组管理',
            icon:'fries',
            component: manageTeam
          },
          {
            path: 'public-paper',
            name: '试卷发布',
            icon: 'notebook',
            component: publicPaper
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
    path: '',
    component: portalBaseView,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: '在线考试',
        icon: 'notebook',
        component: portalIndex
      },
      {
        path: '/error-info',
        name: '错题集',
        icon: 'files',
        component: errorInfo
      },
      {
        path: '/team-info',
        name: '群组信息',
        icon: 'officeBuilding',
        component: teamInfo
      },
      {
        path: '/user-info',
        name: '我的信息',
        icon: 'user',
        component: userInfo
      }
    ]
  },
  {
    path: '/do-paper',
    component: doPaper
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

