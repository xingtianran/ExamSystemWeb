<template>
  <div class="exam-container">
    <!-- 考试头部 -->
    <el-card class="exam-header">
      <div class="header-content">
        <h2>{{ paper.title }}</h2>
        <div class="exam-info">
          <el-space>
            <el-tag type="info">剩余时间：{{ formatTime(timeLeft) }}</el-tag>
            <el-tag>当前题号：{{ currentIndex + 1 }}/{{ questions.length }}</el-tag>
            <el-tag type="success">已答：{{ answeredCount }}</el-tag>
          </el-space>
          <el-button
            type="danger"
            @click="submitConfirm"
            :disabled="isSubmitted"
            size="large">
            提交试卷
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 主体内容 -->
    <el-row :gutter="20">
      <!-- 题目区 -->
      <el-col :span="18">
        <el-card class="question-area">
          <!-- 单选题 -->
          <div v-if="currentQuestion.type === 'single'">
            <h3>{{ currentIndex + 1 }}. {{ currentQuestion.title }}（单选题）</h3>
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
          <div v-if="currentQuestion.type === 'multiple'">
            <h3>{{ currentIndex + 1 }}. {{ currentQuestion.title }}（多选题）</h3>
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

          <!-- 填空题 -->
          <div v-if="currentQuestion.type === 'fill'">
            <h3>{{ currentIndex + 1 }}. {{ currentQuestion.title }}（填空题）</h3>
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
        <el-card class="answer-card">
          <h3>答题卡</h3>
          <div class="question-list">
            <el-button
              v-for="(q, index) in questions"
              :key="index"
              :type="getButtonType(index)"
              circle
              @click="jumpTo(index)">
              {{ index + 1 }}
            </el-button>
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

// 模拟试卷数据
const paper = reactive({
  title: 'Vue3 基础知识考试',
  duration: 0, // 考试时长（秒）
  questions: [
    {
      type: 'single',
      title: 'Vue3 的 Composition API 是什么？',
      options: [
        { value: 'A', text: '新的组件通信方式' },
        { value: 'B', text: '基于函数的 API 组织方式' },
        { value: 'C', text: '状态管理方案' }
      ],
      answer: 'B',
      score: 5
    },
    {
      type: 'multiple',
      title: '哪些是 Vue3 的新特性？',
      options: [
        { value: 'A', text: 'Teleport' },
        { value: 'B', text: 'Suspense' },
        { value: 'C', text: 'Options API' }
      ],
      answer: ['A', 'B'],
      score: 10
    },
    {
      type: 'fill',
      title: 'Vue3 使用什么工具进行打包？',
      answer: 'Vite',
      score: 5
    }
  ]
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

  // 计算得分
  const score = questions.value.reduce((total, q, index) => {
    const answer = answers.value[index]
    if (!answer) return total

    if (q.type === 'multiple') {
      return answer.sort().join('') === q.answer.sort().join('')
        ? total + q.score
        : total
    }
    return answer === q.answer ? total + q.score : total
  }, 0)

  ElMessage.success(`考试结束！得分：${score}/${questions.value.reduce((t, q) => t + q.score, 0)}`)
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
  }else {
    ElMessage.error(res.message)
  }
}

const route = useRoute();

onMounted(async () => {
  // 获取考试详情
  const paperId = route.query.paperId
  const teamId = route.query.teamId
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

.answer-card .question-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-top: 15px;
}
</style>
