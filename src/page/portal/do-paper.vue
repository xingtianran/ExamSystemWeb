<template>
  <div class="exam-container">
    <!-- 考试头部 -->
    <el-card class="exam-header" shadow="never">
      <div class="header-content">
        <el-text size="large">
          <h2>{{paper.title}}</h2>
        </el-text>
        <div class="exam-info">
          <el-space>
            <el-tag type="info">剩余时间：{{ formatTime(timeLeft) }}</el-tag>
            <el-tag>当前题号：{{ currentIndex + 1 }}/{{ questions.length }}</el-tag>
            <el-tag type="success">已答：{{ answeredCount }}</el-tag>
          </el-space>
          <el-button
            style="margin-left: 15px"
            type="primary"
            @click="submitConfirm"
            :disabled="isSubmitted">
            提交试卷
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 0单选题 1多选题 2判断题 3填空题 4问答题 -->
    <!-- 主体内容 -->
    <el-row :gutter="20">
      <!-- 题目区 -->
      <el-col :span="18">
        <el-card class="question-area" v-if="currentQuestion" shadow="never">
          <!-- 单选题 -->
          <div v-if="currentQuestion.type === '0'">
            <el-text>
              <h3>{{ currentIndex + 1 }}. {{ currentQuestion.content }}（单选题）</h3>
            </el-text>
            <el-radio-group v-model="answers[currentIndex]">
              <el-radio
                v-for="(option, i) in currentQuestion.options"
                :key="i"
                :label="option.value"
                class="option-item">
                {{ String.fromCharCode(65 + i) }}. {{ option.text }}
              </el-radio>
            </el-radio-group>
          </div>

          <!-- 多选题 -->
          <div v-if="currentQuestion.type === '1'">
            <el-text>
              <h3>{{ currentIndex + 1 }}. {{ currentQuestion.content }}（多选题）</h3>
            </el-text>
            <el-checkbox-group v-model="answers[currentIndex]">
              <el-checkbox
                v-for="(option, i) in currentQuestion.options"
                :key="i"
                :label="option.value"
                class="option-item">
                {{ String.fromCharCode(65 + i) }}. {{ option.text }}
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <!-- 判断题 -->
          <div v-if="currentQuestion.type === '2'">
            <el-text>
              <h3>{{ currentIndex + 1 }}. {{ currentQuestion.content }}（判断题）</h3>
            </el-text>
            <el-radio-group v-model="answers[currentIndex]">
              <el-radio
                v-for="(option, i) in currentQuestion.options"
                :key="i"
                :label="option.value"
                class="option-item">
                {{ String.fromCharCode(65 + i) }}. {{ option.text }}
              </el-radio>
            </el-radio-group>
          </div>

          <!-- 填空题 -->
          <div v-if="currentQuestion.type === '3'">
            <el-text>
              <h3>{{ currentIndex + 1 }}. {{ currentQuestion.content }}（填空题）</h3>
            </el-text>
            <el-input
              v-model="answers[currentIndex]"
              :placeholder="currentQuestion.placeholder || '请输入答案，请用#号分隔'"
              type="textarea"
              rows="3"
              clearable>
            </el-input>
          </div>

          <!-- 简答题 -->
          <div v-if="currentQuestion.type === '4'">
            <el-text>
              <h3>{{ currentIndex + 1 }}. {{ currentQuestion.content }}（简答题）</h3>
            </el-text>
            <el-input
              v-model="answers[currentIndex]"
              :placeholder="currentQuestion.placeholder || '请输入答案'"
              type="textarea"
              rows="3"
              clearable>
            </el-input>
          </div>

          <!-- 导航按钮 -->
          <div class="nav-buttons">
            <el-button-group>
              <el-button
                type="primary"
                @click="prevQuestion"
                :disabled="currentIndex === 0">
                上一题
              </el-button>
              <el-button
                type="primary"
                @click="nextQuestion"
                :disabled="currentIndex === questions.length - 1">
                下一题
              </el-button>
            </el-button-group>
          </div>
        </el-card>
      </el-col>

      <!-- 答题卡 -->
      <el-col :span="6">
        <el-card class="answer-card" shadow="never">
          <el-text>
            <h3>答题卡</h3>
          </el-text>
          <div class="question-list clear-fix">
            <div class="float-left"
                 v-for="(q, index) in questions"
                 :key="index">
              <el-button
                :type="getButtonType(index)"
                circle
                @click="jumpTo(index)">
                {{ index + 1 }}
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 提交确认对话框 -->
    <el-dialog
      v-model="showSubmitDialog"
      title="提交确认"
      width="30%">
      <span>确定要提交试卷吗？</span>
      <template #footer>
        <el-button @click="showSubmitDialog = false">取消</el-button>
        <el-button type="primary" @click="submitExam">确定提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted, onUnmounted, nextTick} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {useRoute} from "vue-router";
import {userApi} from "@/api/api.js";
import router from "@/router/index.js";

// 模拟试卷数据
const paper = reactive({
  id: '',
  title: '',
  duration: 0, // 考试时长（秒）
  questions: []
})

// 响应式状态
const currentIndex = ref(0)
const answers = ref([])

const isSubmitted = ref(false)
const showSubmitDialog = ref(false)

// 计算属性
const questions = computed(() => paper.questions)
const currentQuestion = computed(() => questions.value[currentIndex.value])
const answeredCount = computed(() => answers.value.filter(a => a !== undefined).length)

// 倒计时处理
let timer = null
// 响应式状态
const timeLeft = ref(0) // 初始化为0

const startTimer = () => {
  // 确保有有效时长再启动
  if (paper.duration <= 0) {
    ElMessage.error('考试时间配置错误')
    return
  }

  timeLeft.value = paper.duration // 确保使用最新值
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      submitExam()
    }
  }, 1000)
}


// 格式化时间显示
const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// 题目导航
const prevQuestion = () => currentIndex.value--
const nextQuestion = () => currentIndex.value++
const jumpTo = (index) => currentIndex.value = index

// 答题卡按钮样式
const getButtonType = (index) => {
  if (answers.value[index]) return 'success'
  if (index === currentIndex.value) return 'primary'
  return 'info'
}

// 提交处理
const submitConfirm = () => {
  if (answeredCount.value < questions.value.length) {
    ElMessageBox.confirm('还有未答题目，确定要提交吗？', '提示', {
      confirmButtonText: '强制提交',
      cancelButtonText: '继续答题',
      type: 'warning'
    }).then(submitExam)
  } else {
    showSubmitDialog.value = true
  }
}

const submitExam = async () => {
  isSubmitted.value = true
  clearInterval(timer)
  console.log(answers.value)
  // 将题目编号、答案和试卷编号上传至服务器
  let data = {
    id : paper.id,
    topics: []
  }
  for(let i = 0; i < questions.value.length; i++){
    // 如果是数组的话，就是多选，处理多选格式
    if(Array.isArray(answers.value[i])){
      let tempAnswer = ''
      answers.value[i].forEach(item => {
        tempAnswer += item + '#'
      })
      answers.value[i] = tempAnswer.slice(0, -1)
    }
    let topic = {
      id : questions.value[i].id,
      answer: answers.value[i]
    }
    data.topics.push(topic)
  }
  // 获取数据data，上传到服务器
  const res = await userApi.markPaper(data)
  if(res.code === 200){
    ElMessage.success(res.message)
    await router.push('/')
  }else {
    ElMessage.error(res.message)
  }
  showSubmitDialog.value = false
}

// 获取单个考试详情
const getExamInfo = async (paperId, teamId) => {
  const res = await userApi.getExamDetail(paperId, teamId)
  if(res.code === 200){
    const data = res.data
    paper.title = data.title
    // 计算考试时长
    const deadline = data.tempTime
    // 转换为Date对象
    const deadlineDate = new Date(deadline);
    // 获取当前时间戳（UTC时间）
    const now = new Date();
    // 计算时间差（毫秒）
    const timeDifferenceMs = deadlineDate.getTime() - now.getTime();
    // 转换为秒并确保非负
    const remainingSeconds = Math.max(Math.floor(timeDifferenceMs / 1000), 0);
    paper.duration = remainingSeconds

    // 获取题目数据
    const topics = data.topics

    topics.forEach(item => {
      // 处理答案数据
      let tempAnswer = null
      if(item.answer.indexOf("#") !== -1){
         tempAnswer = item.answer.split('#')
      }else {
        tempAnswer = item.answer
      }
      // 处理选项格式
      let options = []
      if(item.type === '0' || item.type === '1'){
        options = [
          {value: 'A', text: item.column1},
          {value: 'B', text: item.column2},
          {value: 'C', text: item.column3},
          {value: 'D', text: item.column4}
        ]
      }else if(item.type === '2'){
        options = [
          {value: 'T', text: item.column1},
          {value: 'F', text: item.column2}
        ]
      }
      let topic = {
        id: item.id,
        type: item.type,
        title: item.title,
        content: item.content,
        options: options,
        score: item.score,
        answer: tempAnswer
      }
      paper.questions.push(topic)
    })
  }else {
    ElMessage.error(res.message)
  }
}

const route = useRoute();

onMounted(async () => {
  // 获取考试详情
  const paperId = route.query.paperId
  const teamId = route.query.teamId
  paper.id = paperId
  if (paperId && teamId) {
    await getExamInfo(paperId, teamId)
  }

  answers.value = Array(questions.value.length).fill(undefined)
  // 添加延迟确保数据更新
  await nextTick()
  startTimer()
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.clear-fix{
  overflow: hidden;
}
.float-right{
  float: right;
}
.float-left{
  float: left;
}
.exam-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.exam-header {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-area {
  min-height: 400px;
}

.option-item {
  display: block;
  margin: 10px 0;
  padding: 8px;
  transition: background 0.3s;
}

.option-item:hover {
  background: #f5f7fa;
}

.nav-buttons {
  margin-top: 30px;
  text-align: center;
}

.question-list > div{
  margin-top: 5px;
  margin-right: 5px;
}

</style>
