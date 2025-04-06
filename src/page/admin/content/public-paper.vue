<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card shadow="never">
          <el-text size="large">试卷信息</el-text>
          <el-divider style="margin-top: 10px; margin-bottom: 10px" />
          <div>
            <el-text>
              <p>试卷标题：{{paper.title}}</p>
              <p>试卷总分：{{paper.score}}</p>
              <p>试卷类目：{{paper.category}}</p>
              <p>出卷人员：{{paper.user}}</p>
              <p>创建时间：{{dateFormat(paper.createTime)}}</p>
            </el-text>
          </div>
        </el-card>
      </el-col>

      <el-col :span="14">
        <el-card shadow="never">
          <el-text size="large">考试配置</el-text>
          <el-divider style="margin-top: 10px; margin-bottom: 10px;" />
          <div>
            <el-form class="clear-fix" ref="formRef" :rules="rules" :model="publishPaper" label-width="auto">
              <el-form-item label="发布试卷：" prop="paperId">
                <el-input style="width: 300px" v-model="publishPaper.paperId" disabled />
              </el-form-item>
              <el-form-item label="发布群组：" prop="teamId">
                <el-select
                  v-model="publishPaper.teamId"
                  placeholder="群组"
                  style="width: 300px"
                >
                  <el-option
                    v-for="item in teams"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="结束时间：" prop="deadline">
                <el-date-picker
                  v-model="dateTime"
                  type="datetime"
                  placeholder="Select date and time"
                />
              </el-form-item>
              <el-form-item class="float-right">
                <el-button type="primary" @click="startExam">
                  启动考试
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {paperApi, teamApi} from "@/api/api.js";
import {ElMessage} from "element-plus";
import {dateFormat} from "@/utils/date.js";
import router from "@/router/index.js";

const route = useRoute();

const paper = ref({
  title: '',
  score: 0,
  category: '',
  user: '',
  createTime: new Date()
})

const publishPaper = ref({
  paperId: 0,
  teamId: null,
  deadLine: 0
})

const dateTime = ref(new Date())

const rules = {
  paperId: [
    { required: true, message: '请输入考试试卷', trigger: 'blur' }
  ],
  teamId: [
    { required: true, message: '请输入考试群组', trigger: 'change' }
  ]
};

const teams = ref([])

const formRef = ref(null)

// 获取试卷信息
const getPaper =  (id) => {
  paperApi.getPaper(id).then(res => {
    if(res.code === 200){
      const data = res.data
      paper.value.title = data.title
      paper.value.score = data.score
      paper.value.category = data.category.name
      paper.value.user = data.user.userName
      paper.value.createTime = data.createTime
      // 试卷发布
      publishPaper.value.paperId = data.id
    }else {
      ElMessage.error(res.message)
    }
  })
}

// 获取群组信息
const getTeams = () => {
  teamApi.getTeamList().then(res => {
    if(res.code === 200){
      teams.value = res.data
    }else {
      ElMessage.error(res.message)
    }
  })
}

// 启动考试
const startExam = async () => {
  formRef.value.validate( async (valid) => {
    if (valid) {
      // 转化为时间戳
      publishPaper.value.deadLine = dateTime.value.getTime()
      const res = await paperApi.publishExam(publishPaper.value)
      if (res.code === 200) {
        ElMessage.success(res.message)
        await router.push('/content/manage-paper')
      } else {
        ElMessage.error(res.message)
      }
    } else {
      ElMessage.error('请填写完整信息');
    }
  });
}

onMounted(() => {
  const id = route.query.id;
  // 如果有id就去获取试卷信息
  if(id){
    getPaper(id)
  }
  getTeams()
})
</script>

<style scoped>
.clear-fix{
  overflow: hidden;
}
.float-right{
  float: right;
}
</style>
