<template>
  <div>
    <div class="index-header-box">
      <span>欢迎使用天然在线考试平台</span>
    </div>

    <div class="index-statistic-box">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-card shadow="never">
            <el-statistic title="试卷总数" :value="paperValue" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never">
            <el-statistic title="题目总数" :value="topicValue" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never">
            <el-statistic title="群组总数" :value="teamValue" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never">
            <el-statistic title="用户总数" :value="userValue" />
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="index-footer-content-box">
      <el-row :gutter="10">
        <el-col :span="10">
          <el-card shadow="never">
            <el-text size="large">快捷操作</el-text>
            <el-divider style="margin-top: 10px; margin-bottom: 10px" />
            <div class="operation-box">
              <div>
                <el-text type="primary">
                  <el-icon><FolderOpened /></el-icon>&nbsp;
                  <span @click="router.push('/content/add-paper')">增加试卷</span>
                </el-text>
              </div>
              <div style="margin-top: 10px;margin-bottom: 10px">
                <el-text type="primary">
                  <el-icon><EditPen /></el-icon>&nbsp;
                  <span @click="router.push('/content/add-topic')">增加题目</span>
                </el-text>
              </div>
              <div>
                <el-text type="primary">
                  <el-icon><School /></el-icon>&nbsp;
                  <span @click="router.push('/content/manage-team')">管理群组</span>
                </el-text>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="14">
          <el-card shadow="never">
            <div class="clear-fix">
              <div class="float-left">
                <el-text size="large">最新题目</el-text>
              </div>
              <div class="new-topic-button-box float-right">
                <el-text type="primary">
                  <span @click="router.push('/content/manage-topic')">更多</span>&nbsp;
                  <el-icon><DArrowRight /></el-icon>
                </el-text>
              </div>
            </div>
            <el-divider style="margin-top: 10px; margin-bottom: 10px" />
            <el-table v-loading="loading" :data="topics" style="width: 100%">
              <el-table-column prop="title" label="Title" />
              <el-table-column label="Type" width="150">
                <template #default="scope">
                  <span v-if="scope.row.type === '0'">单选题</span>
                  <span v-else-if="scope.row.type === '1'">多选题</span>
                  <span v-else-if="scope.row.type === '2'">判断题</span>
                  <span v-else-if="scope.row.type === '3'">填空题</span>
                  <span v-else-if="scope.row.type === '4'">问答题</span>
                </template>
              </el-table-column>
              <el-table-column prop="category.name" label="Category" width="150" />
              <el-table-column prop="user.userName" label="User" width="150" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import { useTransition } from '@vueuse/core'
import {paperApi, teamApi, topicApi, userApi} from "@/api/api.js";
import {DArrowRight, EditPen, FolderOpened, School} from "@element-plus/icons-vue";
import router from "@/router/index.js";
import {ElMessage} from "element-plus";

const topicSource = ref(0)
const paperSource = ref(0)
const teamSource = ref(0)
const userSource = ref(0)
const topicValue = useTransition(topicSource, {
  duration: 1500,
})
const paperValue = useTransition(paperSource, {
  duration: 1500,
})
const teamValue = useTransition(teamSource, {
  duration: 1500,
})
const userValue = useTransition(userSource, {
  duration: 1500,
})

const topics = ref([])

const loading = ref(false)

const getCount = () => {
  topicApi.getCount().then(res => {
    topicSource.value = res.data
  })
  paperApi.getCount().then(res => {
    paperSource.value = res.data
  })
  teamApi.getCount().then(res => {
    teamSource.value = res.data
  })
  userApi.getCount().then(res => {
    userSource.value = res.data
  })
}

const getNewTopics = () => {
  loading.value = true
  topicApi.getNewTopics(7).then(res => {
    if(res.code === 200){
      topics.value = res.data
      loading.value = false
    }else {
      ElMessage.error(res.message)
    }
  })
}

onMounted(() => {
  getCount()
  getNewTopics()
})
</script>

<style scoped>
.clear-fix{
  overflow: hidden;
}
.float-left{
  float: left;
}
.float-right{
  float: right;
}

.index-statistic-box .el-col {
  text-align: center;
}
.index-header-box{
  margin-top: 10px;
  color: #606266;
  font: 18px large;
}
.index-statistic-box{
  margin-top: 20px;
}
.index-footer-content-box{
  margin-top: 15px;
}
.operation-box span {
  cursor: pointer;
}
.operation-box span:hover{
  color: rgb(197.7, 225.9, 255);
}
.new-topic-button-box span{
  cursor: pointer;
}
.new-topic-button-box span:hover{
  color: rgb(197.7, 225.9, 255);
}
</style>
