<template>
  <div class="topic-box">
    <div>
      <el-row :gutter="10">
        <el-col :span="10">
          <div class="content-left-box">
            <div>
              <el-form ref="formRef" :rules="rules" :model="topic" label-width="auto">
                <el-form-item label="题目标题" prop="title">
                  <el-input v-model="topic.title" />
                </el-form-item>
                <el-form-item label="题目题型" prop="type">
                  <el-select @change="ChangeTypeSelect" v-model="topic.type" placeholder="题型">
                    <el-option
                      v-for="item in types"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="题目类目" prop="categoryId">
                  <el-tree-select
                    v-model="topic.categoryId"
                    :data="categories"
                    :render-after-expand="false"
                    :default-value="null"
                    placeholder="类目"
                    check-strictly=true
                    :props="{ label: 'name', value: 'id' }"
                  />
                </el-form-item>
                <el-form-item label="题目分值">
                  <el-input-number
                    v-model="topic.score"
                    :min="1"
                    :max="100"
                    :precision="1"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="addItem">添加</el-button>
                  <el-button type="info" @click="router.push('/content/manage-topic')">返回</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <el-table v-if="isSelectReveal" :data="selectOptions" border style="width: 100%">
                <el-table-column prop="value" label="Answer" width="80">
                  <template #default="scope">
                    <el-radio v-if="topic.type === '0'" v-model="topic.answer" :value="scope.row.id">{{scope.row.id}}</el-radio>
                    <el-checkbox v-else-if="topic.type === '1'" v-model="selectedOptions" :value="scope.row.id">{{scope.row.id}}</el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column prop="value" label="Content">
                  <template #default="scope">
                    <el-input
                      v-model="scope.row.content"
                      :rows="2"
                      type="textarea"
                      placeholder="选项内容"
                    />
                  </template>
                </el-table-column>
              </el-table>

              <el-table v-else-if="isJudgeReveal" :data="judgeOptions" border style="width: 100%">
                <el-table-column prop="value" label="Answer" width="80">
                  <template #default="scope">
                    <el-radio  v-model="topic.answer" :value="scope.row.id">{{scope.row.id}}</el-radio>
                  </template>
                </el-table-column>
                <el-table-column prop="value" label="Content">
                  <template #default="scope">
                    <el-input
                      v-model="scope.row.content"
                      :rows="2"
                      type="textarea"
                      placeholder="选项内容"
                    />
                  </template>
                </el-table-column>
              </el-table>

              <el-table v-else-if="isBlankReveal" :data="blankOptions" border style="width: 100%">
                <el-table-column prop="value" label="Answer" width="80">
                  <template #default="scope">
                    <span>{{scope.row.id}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="value" label="Content">
                  <template #default="scope">
                    <el-input
                      v-model="scope.row.content"
                      :rows="2"
                      type="textarea"
                      placeholder="填空内容"
                    />
                  </template>
                </el-table-column>
              </el-table>

              <div v-else-if="isShortAnswerReveal">
                <MdEditor style="height: 300px" v-model="topic.answer" :preview="false" />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="14">
          <MdEditor v-model="topic.content" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import {categoryApi, topicApi} from "@/api/api.js";
import {ElMessage} from "element-plus";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import router from "@/router/index.js";
import {useRoute} from "vue-router";

const categories = ref([])
const isSelectReveal = ref(false)
const isJudgeReveal = ref(false)
const isBlankReveal = ref(false)
const isShortAnswerReveal = ref(false)

const topic = ref({
  id: '',
  title: '',
  type: '',
  content: '# 题目内容',
  categoryId: null,
  score: 0,
  answer: '',
  column1: '',
  column2: '',
  column3: '',
  column4: '',
})

// 多选答案
const selectedOptions = ref([])

const rules = {
  title: [
    { required: true, message: '请输入题目标题', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请输入题目题型', trigger: 'change' }
  ],
  categoryId: [
    { required: true, message: '请输入题目类目', trigger: 'change' }
  ]
};

const formRef = ref(null);

// 选择表格
const selectOptions = ref([
  {
    id: 'A',
    content: ''
  },
  {
    id: 'B',
    content: ''
  },
  {
    id: 'C',
    content: ''
  },
  {
    id: 'D',
    content: ''
  }
])

// 判断表格
const judgeOptions = ref([
  {
    id: 'T',
    content: '正确'
  },
  {
    id: 'F',
    content: '错误'
  }
])

// 填空表格
const blankOptions = ref([
  {
    id: '一',
    content: ''
  },
  {
    id: '二',
    content: ''
  },
  {
    id: '三',
    content: ''
  },
  {
    id: '四',
    content: ''
  }
])

const types = ref([
  {
    name:'单选题',
    value: '0'
  },
  {
    name:'多选题',
    value: '1'
  },
  {
    name:'判断题',
    value: '2'
  },
  {
    name:'填空题',
    value: '3'
  },
  {
    name:'简答题',
    value: '4'
  }
])

// 获取全部类目
const getCategoryList = () => {
  categoryApi.getCategoryList().then(res => {
    if (res.code === 200){
      categories.value = res.data
    }else {
      ElMessage.error(res.message)
    }
  })
}
// 当题型选择器改变时
const ChangeTypeSelect = () => {
  if(topic.value.type === "0" || topic.value.type === "1") {
    isSelectReveal.value = true
    isJudgeReveal.value = false
    isBlankReveal.value = false
    isShortAnswerReveal.value = false
  }else if(topic.value.type === "2"){
    isJudgeReveal.value = true
    isSelectReveal.value = false
    isBlankReveal.value = false
    isShortAnswerReveal.value = false
  }else if(topic.value.type === "3") {
    isBlankReveal.value = true
    isSelectReveal.value = false
    isJudgeReveal.value = false
    isShortAnswerReveal.value = false
  }else if(topic.value.type === "4"){
    isShortAnswerReveal.value = true
    isSelectReveal.value = false
    isJudgeReveal.value = false
    isBlankReveal.value = false
  }else {
    isShortAnswerReveal.value = false
    isSelectReveal.value = false
    isJudgeReveal.value = false
    isBlankReveal.value = false
  }
}
// 增加题目
const addItem = async () => {
  formRef.value.validate( async (valid) => {
    if (valid) {
      // 选择题和填空题都需要判断column
      if(topic.value.type === "0" || topic.value.type === "1" || topic.value.type === "2" || topic.value.type === "3"){
        // 填充数据
        if(topic.value.type === "0" || topic.value.type === "1"){
          topic.value.column1 = selectOptions.value[0].content
          topic.value.column2 = selectOptions.value[1].content
          topic.value.column3 = selectOptions.value[2].content
          topic.value.column4 = selectOptions.value[3].content
        }else if(topic.value.type === "2"){
          topic.value.column1 = judgeOptions.value[0].content
          topic.value.column2 = judgeOptions.value[1].content
        }else if(topic.value.type === "3"){
          // 填空题答案为第一个值，用不着先填上
          topic.value.answer = blankOptions.value[0].content

          topic.value.column1 = blankOptions.value[0].content
          topic.value.column2 = blankOptions.value[1].content
          topic.value.column3 = blankOptions.value[2].content
          topic.value.column4 = blankOptions.value[3].content
        }
        // 选项的话就判断一个
        if(topic.value.column1 === ""){
          ElMessage.error("选项不能为空")
          return
        }
      }
      // 如果是多选题的话，处理答案
      if (topic.value.type === "1") {
        // 先置空
        topic.value.answer = ""
        selectedOptions.value.forEach((item) => {
          topic.value.answer += item + "#";
        })
        topic.value.answer = topic.value.answer.slice(0, -1)
      }
      if(topic.value.answer === ""){
        ElMessage.error("答案不能为空")
        return
      }
      let res = null
      // id存在是编辑，不存在是增加
      if(topic.value.id){
        res = await topicApi.updateTopic(topic.value)
      }else {
        res = await topicApi.addTopic(topic.value)
      }
      if (res.code === 200) {
        ElMessage.success(res.message)
        await router.push('/content/manage-topic')
      } else {
        ElMessage.error(res.message)
      }
    } else {
      ElMessage.error('请填写完整信息');
    }
  });
}

const route = useRoute();
watch(() => route, (newRoute, oldRoute) => {
  // 在这里可以执行一些初始化操作，例如重置表单
  formRef.value.resetFields();
  // 重置其他组件状态
  topic.value = {
    title: '',
    type: '',
    content: '# 题目内容',
    categoryId: null,
    score: 0,
    answer: '',
    column1: '',
    column2: '',
    column3: '',
    column4: '',
  }
  selectOptions.value = []
  judgeOptions.value = []
  blankOptions.value = []
  isSelectReveal.value = false
  isJudgeReveal.value = false
  isBlankReveal.value = false
  isShortAnswerReveal.value = false
}, { deep: true });

onMounted(() => {
  const id = route.query.id;
  // 如果是编辑，就渲染数据
  if (id) {
    topicApi.getTopic(id).then(res => {
      if(res.code === 200){
        const data = res.data
        topic.value.id = data.id
        topic.value.title = data.title
        topic.value.content = data.content
        topic.value.categoryId = data.categoryId
        topic.value.score = data.score
        topic.value.answer = data.answer
        // 根据题目类型，选择性显示答案内容
        topic.value.type = data.type
        if(topic.value.type === "0" || topic.value.type === "1"){
          selectOptions.value[0].content = data.column1
          selectOptions.value[1].content = data.column2
          selectOptions.value[2].content = data.column3
          selectOptions.value[3].content = data.column4
          isSelectReveal.value = true
          // 如果是多选的话，处理selectedOptions数据
          if(topic.value.type === "1"){
            selectedOptions.value = topic.value.answer.split('#')
          }
        }
      }else {
        ElMessage.error(res.message)
      }
    })
  }
  getCategoryList()
  formRef.value.resetFields();
})
</script>

<style scoped>
.clear-fx{
  overflow: hidden;
}
.float-left{
  float: left;
}
.float-right{
  float: right;
}
</style>
