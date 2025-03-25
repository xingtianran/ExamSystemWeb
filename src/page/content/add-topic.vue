<template>
  <div class="topic-box">
    <div>
      <el-row :gutter="10">
        <el-col :span="8">
          <div class="content-left-box">
            <el-form :model="top" label-width="auto" style="max-width: 600px">
              <el-form-item label="题目标题">
                <el-input v-model="topic.title" />
              </el-form-item>
              <el-form-item label="题目题型">
                <el-select v-model="topic.type" placeholder="题型">
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
                <el-button type="primary">添加</el-button>
              </el-form-item>
            </el-form>
            <div>

            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <MdEditor v-model="text" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {categoryApi} from "@/api/api.js";
import {ElMessage} from "element-plus";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const categories = ref([])

const topic = ref({
  title: '',
  type: '',
  categoryId: null,
  score: 0
})

const text = ref('# Hello Editor');

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
