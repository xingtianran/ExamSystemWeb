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
            <div v-if="isReveal">
              <el-table :data="options" border style="width: 100%">
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
import {categoryApi, loginApi, topicApi} from "@/api/api.js";
import {ElMessage} from "element-plus";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import router from "@/router/index.js";
import {useRoute} from "vue-router";

const categories = ref([])
const isReveal = ref(false)

const topic = ref({
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
const options = ref([
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
    name:'问答题',
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
    isReveal.value = true
  }else {
    isReveal.value = false
  }
}
// 增加题目
const addItem = async () => {
  formRef.value.validate( async (valid) => {
    if (valid) {
      topic.value.column1 = options.value[0].content
      topic.value.column2 = options.value[1].content
      topic.value.column3 = options.value[2].content
      topic.value.column4 = options.value[3].content
      // 如果是选择题的话，要检查选项
      if(topic.value.type === "0" || topic.value.type === "1"){
        // 选项的话就判断一个
        if(topic.value.column1 === ""){
          ElMessage.error("选项不能为空")
          return
        }
      }
      // 如果是多选题的话，处理答案
      if (topic.value.type === "1") {
        selectedOptions.value.forEach((item) => {
          topic.value.answer += item + "#";
        })
        topic.value.answer = topic.value.answer.slice(0, -1)
      }
      if(topic.value.answer === ""){
        ElMessage.error("答案不能为空")
        return
      }
      const res = await topicApi.addTopic(topic.value)
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
  selectedOptions.value = [];
  isReveal.value = false;
}, { deep: true });

onMounted(() => {
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
