<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card class="left-box" shadow="never">
          <div>
            <el-text tag="b">题目总数：</el-text>
          </div>
          <div class="left-score-box">
            <el-text tag="b">试卷总分：</el-text>
          </div>
          <div>
            <el-button style="width: 100%" size="small" type="primary">保存试卷</el-button>
          </div>
          <div class="new-left-topic-box clear-fix" v-for="(item, index) in topicListBlocks" :key="index">
            <el-text tag="b" type="primary" size="large">{{item.id}}</el-text>
            <el-button class="float-right" link type="primary" size="large" :icon="Delete">删除</el-button>
            <el-divider style="margin-top: 10px; margin-bottom: 10px" />
            <el-text>共 20 题，共 50 分</el-text>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18" class="right-box">
        <el-card shadow="never">
          <el-row :gutter="20">
            <el-col :span="12">
              <div>
                <el-form :model="paper" label-width="auto" style="max-width: 600px">
                  <el-form-item>
                    <template #label>
                      <el-text tag="b">试卷标题：</el-text>
                    </template>
                    <el-input v-model="paper.title" />
                  </el-form-item>
                  <el-form-item>
                    <template #label>
                      <el-text tag="b">试卷标题：</el-text>
                    </template>
                    <el-tree-select
                      v-model="paper.categoryId"
                      :data="categories"
                      :render-after-expand="false"
                      :default-value="null"
                      placeholder="类目"
                      check-strictly=true
                      :props="{ label: 'name', value: 'id' }"
                    />
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
            <el-col :span="6" :offset="6">
              <div class="add-button-box">
                <el-button type="primary" @click="addTopicBlock" :icon="Plus">增加大题</el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
        <div class="topic-list-box">
          <el-text tag="b" size="large">题目列表</el-text>
          <el-card v-if="topicListBlocks.length === 0" shadow="never">
            <el-text>请点击右侧【增加大题】开始增加数据</el-text>
          </el-card>
          <el-card class="new-topic-list-box clear-fix" shadow="never" v-for="(item, index) in topicListBlocks" :key="index">
            <div class="float-left">
              <el-input disabled style="width: 200px" :model-value="item.id"></el-input>
            </div>
            <div class="float-left">
              <el-button :icon="Plus" @click="topicDialogVisible = true">添加题目</el-button>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>

  <div>
    <el-dialog v-model="topicDialogVisible" class="clear-fix" title="题目列表" width="80%">
      <div class="clear-fix">
        <div class="float-left" style="width: 180px">
          <el-input
            v-model="searchInfo.title"
            placeholder="标题"
            :prefix-icon="Search"
          />
        </div>
        <div class="float-left" style="width: 180px;margin-left: 10px;margin-right: 10px">
          <el-select v-model="searchInfo.type" placeholder="题型">
            <el-option
              v-for="item in types"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="float-left" style="width: 180px">
          <el-tree-select
            v-model="searchInfo.categoryId"
            :data="categories"
            :render-after-expand="false"
            :default-value="null"
            placeholder="类目"
            check-strictly=true
            :props="{ label: 'name', value: 'id' }"
          />
        </div>
        <div class="float-left" style="margin-left: 15px">
          <el-button type="primary" @click="doSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>

        <div class="float-right">
          <el-button type="primary" :icon="Plus">选择 {{selectedRows.length}} 项</el-button>
        </div>
      </div>
      <div class="topic-info-box">
        <el-table @selection-change="handleSelectionChange"
                  :row-key="getRowKey"
                  v-loading="loading"
                  :data="topics"  style="width: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="100" />
          <el-table-column prop="title" label="Title" />
          <el-table-column prop="category.name" label="Category" width="100" />
          <el-table-column prop="user.userName" label="User" width="100" />
          <el-table-column prop="score" label="Score" width="100" />
          <el-table-column label="Type" width="100">
            <template #default="scope">
              <span v-if="scope.row.type === '0'">单选题</span>
              <span v-else-if="scope.row.type === '1'">多选题</span>
              <span v-else-if="scope.row.type === '2'">判断题</span>
              <span v-else-if="scope.row.type === '3'">填空题</span>
              <span v-else-if="scope.row.type === '4'">问答题</span>
            </template>
          </el-table-column>
          <el-table-column label="CreateTime" width="180">
            <template #default="scope">
              {{dateFormat(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column label="UpdateTime" width="180">
            <template #default="scope">
              {{dateFormat(scope.row.updateTime)}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="topic-pagination-box">
        <el-pagination
          size="small"
          background
          @current-change="turnPage"
          layout="prev, pager, next"
          :current-page="pageInfo.page"
          :page-size="pageInfo.size"
          :page-count="pageInfo.totalPage"
          class="mt-4"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {categoryApi, topicApi} from "@/api/api.js";
import {ElMessage} from "element-plus";
import {Delete, Plus, Search} from "@element-plus/icons-vue";
import {dateFormat} from "@/utils/date.js";


const paper = ref({
  title: '',
  categoryId: null
})

const pageInfo = ref({
  page : 1,
  size : 8,
  totalPage : 0
})

const searchInfo = ref({
  title: '',
  type: '',
  categoryId: null
})

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

const categories = ref([])
const topics = ref([])
const loading = ref(false)

// 题目列表处的块数组
const topicListBlocks = ref([]);

const topicDialogVisible = ref(false)

// 选择的记录
const selectedRows = ref([])
// 存储所有选中行的 key
const selectedRowKeys = ref([]);

// 设置行标识
const getRowKey = (row) => row.id;

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
// 获取全部题目
const getTopics = (pageInfo, searchInfo) => {
  loading.value = true
  const params = {
    ...pageInfo,
    ...searchInfo
  }
  topicApi.getTopics(params).then(res => {
    if(res.code === 200){
      topics.value = res.data
      topics.value.forEach((row) => {
        if (selectedRowKeys.value.includes(getRowKey(row.id))) {
          selectedRows.value.push(row.id);
        }
      });
      pageInfo.totalPage = res.totalPage
      loading.value = false
    }else {
      ElMessage.error(res.message);
    }
  })
}

// 增加答题
const addTopicBlock = () => {
  let index = topicListBlocks.value.length
  topicListBlocks.value.push({
    id: '第 ' + (index + 1) + ' 大题',
    topics: []
  });
};
// 翻页
const turnPage = (newPage) => {
  pageInfo.value.page = newPage
  getTopics(pageInfo.value, searchInfo.value);
}
// 搜索
const doSearch = () => {
  getTopics(pageInfo.value, searchInfo.value)
}

// 重置搜索内容
const resetSearch = () => {
  searchInfo.value.title = ''
  searchInfo.value.categoryId = null
  searchInfo.value.type = ''
  pageInfo.value.page = 1
  getTopics(pageInfo.value, searchInfo.value)
}
// 选择的内容
const handleSelectionChange = (val) => {
  selectedRows.value = val
  selectedRowKeys.value = val.map((row) => getRowKey(row));
}

onMounted(() => {
  getCategoryList()
  getTopics(pageInfo.value)
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

.left-box span{
  font-weight: 30;
}
.left-score-box{
  margin-top: 15px;
  margin-bottom: 15px;
}
.add-button-box{
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80px;
}
.topic-list-box{
  margin-top: 15px;
}
.topic-list-box .el-card{
  margin-top: 10px;
}
.new-topic-list-box{
  display: flex;
  align-items: center;
  min-height: 80px;
}
.new-topic-list-box div:last-child{
  margin-left: 20px;
}
.new-left-topic-box{
  margin-top: 25px;
}
.topic-pagination-box{
  margin-top: 15px;
}
.topic-info-box{
  margin-top: 10px;
}
</style>
