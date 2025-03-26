<template>
  <div class="topic-box">
    <div>
      <el-row :gutter="10">
        <el-col :span="10">
          <div class="content-left-box">
            <div>
              <el-form :model="top" label-width="auto">
                <el-form-item label="题目标题">
                  <el-input v-model="topic.title" />
                </el-form-item>
                <el-form-item label="题目题型">
                  <el-select @change="ChangeTypeSelect" v-model="topic.type" placeholder="题型">
                    <el-option
                      v-for="item in types"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="题目类目">
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
                    <el-radio v-model="topic.answer" :value="scope.row.id">{{scope.row.id}}</el-radio>
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
import {onMounted, ref} from 'vue'
import {categoryApi, topicApi} from "@/api/api.js";
import {ElMessage} from "element-plus";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import router from "@/router/index.js";

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
  if(topic.value.type === "0") {
    isReveal.value = true
  }else {
    isReveal.value = false
  }
}
// 增加题目
const addItem = async () => {
  topic.value.column1 = options.value[0].content
  topic.value.column2 = options.value[1].content
  topic.value.column3 = options.value[2].content
  topic.value.column4 = options.value[3].content
  const res = await topicApi.addTopic(topic.value)
  if(res.code === 200){
    ElMessage.success(res.message)
    await router.push('/content/manage-topic')
  }else {
    ElMessage.error(res.message)
  }

}

onMounted(() => {
  getCategoryList()
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
