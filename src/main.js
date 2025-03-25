import { createApp } from 'vue'
import { createPinia } from 'pinia'
// element ui
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

import leftView from '@/layout/left-view.vue'
import topView from '@/layout/top-view.vue'
import {
  House,
  Collection,
  Postcard,
  Camera,
  Tickets,
  Fries,
  Grape,
  User, Operation, Bicycle, Printer
} from "@element-plus/icons-vue";

const app = createApp(App)

// 页面
app.component("left-view", leftView)
app.component("top-view", topView)

// 图标
app.component('house', House)
app.component('collection', Collection)
app.component('tickets', Tickets)
app.component('postcard', Postcard)
app.component('printer', Printer)
app.component('fries', Fries)
app.component('operation', Operation)
app.component('grape', Grape)
app.component('camera', Camera)
app.component('user', User)
app.component('bicycle', Bicycle)

// 图片前缀
app.config.globalProperties.$imagePrefix = '/api/Oss/DownloadFile/';



app.use(createPinia())
app.use(router)
// element ui
app.use(ElementPlus)

app.mount('#app')
