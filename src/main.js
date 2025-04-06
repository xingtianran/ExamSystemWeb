import { createApp } from 'vue'
import { createPinia } from 'pinia'
// element ui
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

import leftView from '@/layout/admin/left-view.vue'
import topView from '@/layout/admin/top-view.vue'

import portalTopView from '@/layout/portal/portal-top-view.vue'

import {
  House,
  Collection,
  Postcard,
  Camera,
  Tickets,
  Fries,
  Grape,
  User, Operation, Bicycle, Printer,Brush,Notebook, OfficeBuilding
} from "@element-plus/icons-vue";

const app = createApp(App)

// 页面
app.component("left-view", leftView)
app.component("top-view", topView)

// 门户
app.component('portal-top-view', portalTopView)

// 图标
app.component('house', House)
app.component('collection', Collection)
app.component('brush', Brush)
app.component('tickets', Tickets)
app.component('postcard', Postcard)
app.component('printer', Printer)
app.component('fries', Fries)
app.component('operation', Operation)
app.component('grape', Grape)
app.component('camera', Camera)
app.component('user', User)
app.component('bicycle', Bicycle)

app.component('notebook', Notebook)
app.component('officeBuilding', OfficeBuilding)


// 图片前缀
app.config.globalProperties.$imagePrefix = '/api/admin/Oss/DownloadFile/';



app.use(createPinia())
app.use(router)
// element ui
app.use(ElementPlus)

app.mount('#app')
