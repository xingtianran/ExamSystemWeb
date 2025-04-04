<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card class="left-box" shadow="never">
          <div>
            <el-text tag="b">题目总数：0</el-text>
          </div>
          <div class="left-score-box">
            <el-text tag="b">试卷总分：0</el-text>
          </div>
          <div>
            <el-button style="width: 100%" size="small" type="primary" @click="savePaper">保存试卷</el-button>
          </div>
          <div class="new-left-topic-box clear-fix" v-for="(item, index) in topicListBlocks" :key="index">
            <el-text tag="b" type="primary" size="large">{{'第 ' + item.id + ' 大题'}}</el-text>
            <el-button class="float-right" link type="primary" size="large" :icon="Delete">删除</el-button>
            <el-divider style="margin-top: 10px; margin-bottom: 10px" />
            <el-text>共 {{ item.topics.length }} 题，共 {{computedScore(item.topics)}} 分</el-text>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18" class="right-box">
        <el-card shadow="never">
          <el-row :gutter="20">
            <el-col :span="12">
              <div>
                <el-form :model="paper" label-width="auto" style="max-width: 600px" :rules="rules">
                  <el-form-item prop="title">
                    <template #label>
                      <el-text tag="b">试卷标题：</el-text>
                    </template>
                    <el-input v-model="paper.title" />
                  </el-form-item>
                  <el-form-item prop="categoryId">
                    <template #label>
                      <el-text tag="b">试卷类目：</el-text>
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
          <el-card class="new-topic-list-box" shadow="never" v-for="(item, index) in topicListBlocks" :key="index">
            <div class="clear-fix">
              <div class="float-left">
                <el-input disabled style="width: 200px" :model-value="'第 ' + item.id + ' 大题'"></el-input>
              </div>
              <div class="float-left">
                <el-button :icon="Plus" @click="addTopicIds(item.id)">添加题目</el-button>
              </div>
            </div>
            <div v-for="(childItem, index) in item.topics">
              <el-divider style="margin-top: 10px;margin-bottom: 10px" />
              <div>
                <div style="font-size: small">
                    <span style="color: #606266">{{childItem.title}}</span>
                </div>
                <div style="margin-top: 3px; margin-bottom: 6px;">
                  <span style="color: #409EFF">【{{computedType(childItem.type)}}】</span>
                  <span style="color: #606266">{{childItem.content}}</span>
                </div>
                <div v-if="childItem.type === '0' || childItem.type === '1'">
                    <el-text>
                      <p>
                        <span style="color: #409EFF;font-weight: bold">A</span>
                        &nbsp;
                        <span>{{childItem.column1}}</span>
                      </p>
                      <p>
                        <span style="color: #409EFF;font-weight: bold">B</span>
                        &nbsp;
                        <span>{{childItem.column2}}</span>
                      </p>
                      <p>
                        <span style="color: #409EFF;font-weight: bold">C</span>
                        &nbsp;
                        <span>{{childItem.column3}}</span>
                      </p>
                      <p>
                        <span style="color: #409EFF;font-weight: bold">D</span>
                        &nbsp;
                        <span>{{childItem.column4}}</span>
                      </p>
                    </el-text>
                </div>

                <div v-else-if="childItem.type === '2'">
                      <el-text>
                        <p>
                          <span style="color: #409EFF;font-weight: bold">T</span>
                          &nbsp;
                          <span>{{childItem.column1}}</span>
                        </p>
                        <p>
                          <span style="color: #409EFF;font-weight: bold">F</span>
                          &nbsp;
                          <span>{{childItem.column2}}</span>
                        </p>
                      </el-text>
                </div>

                <div>
                    <el-text>
                      <span style="color: #409EFF;font-weight: bold">【答案】</span>
                      <span v-if="childItem.type === '3'">
                        {{childItem.column1}}&nbsp;
                        {{childItem.column2}}&nbsp;
                        {{childItem.column3}}&nbsp;
                        {{childItem.column4}}&nbsp;
                      </span>
                      <span v-else>{{childItem.answer}}</span>
                    </el-text>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>

  <div>
    <el-dialog destroy-on-close
               v-model="topicDialogVisible"
               class="clear-fix" title="题目列表" width="80%">
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
          <el-button type="primary" :icon="Plus" @click="selectTopics">选择 {{selectedRowKeys.length}} 项</el-button>
        </div>
      </div>
      <div class="topic-info-box">
        <el-table ref="tableRef"
                  @selection-change="handleSelectionChange"
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
import {computed, nextTick, onMounted, ref, toRefs, watch} from "vue";
import {categoryApi, paperApi, topicApi} from "@/api/api.js";
import {ElMessage} from "element-plus";
import {Delete, Plus, Search} from "@element-plus/icons-vue";
import {dateFormat} from "@/utils/date.js";
import router from "@/router/index.js";


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

const rules = {
  title: [
    { required: true, message: '请输入题目标题', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请输入题目类目', trigger: 'change' }
  ]
};

const topicAllId = ref([])

const categories = ref([])
const topics = ref([])
const loading = ref(false)

// 题目列表处的块数组
const topicListBlocks = ref([]);

const topicDialogVisible = ref(false)

// 本页选中的
const selectedRows = ref([])
// 选中的所有
const selectedRowKeys = ref([]);

const tableRef = ref(null);

// 当前大题
const currentTopicSet = ref(0)

// 题目总数
const topicNumber = ref(0)

// 试卷总分
const paperScore = ref(0)

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
      topics.value = res.data.filter(item => !topicAllId.value.includes(item.id))
      pageInfo.totalPage = res.totalPage
      // 恢复选中状态
      nextTick(() => {
        topics.value.forEach((row) => {
          if (selectedRowKeys.value.includes(row.id)) {
            tableRef.value.toggleRowSelection(row, true);
          }
        });
      });
      loading.value = false
    }else {
      ElMessage.error(res.message);
    }
  })
}

// 增加答题
// 只能有三道大题
const addTopicBlock = () => {
  let index = topicListBlocks.value.length
  if(index > 2){
    ElMessage.warning("仅能有三道大题")
    return
  }
  topicListBlocks.value.push({
    id: index + 1,
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
  selectedRows.value = val.map((item) => item.id)
  selectedRowKeys.value = [...new Set([...selectedRowKeys.value, ...selectedRows.value])];
}

// 添加题目按钮
const addTopicIds = (id) => {
  // 赋值给当前题目id
  currentTopicSet.value = id
  topicDialogVisible.value = true
  getTopics(pageInfo.value)
  // 计算题目数量和总分
  // if(topicListBlocks.value.length > 0)
  //   computeNumberAndScore()
}

// 计算题目数量和总分
// const computeNumberAndScore = () => {
//   let tempScore = 0;
//   let tempNumber = 0;
//   for(let item in topicListBlocks.value){
//     tempNumber += item.topics.length
//     for (let childItem in item.topics){
//       tempScore += childItem.score
//     }
//   }
//   topicNumber.value = tempNumber
//   paperScore.value = tempScore
// }

// 确认选择题目
const selectTopics = () => {
  if(selectedRowKeys.value.length === 0){
    ElMessage.warning("请选择题目")
    return
  }
  let ids = ''
  selectedRowKeys.value.forEach(item => {
    ids += item + "/"
  })
  ids = ids.slice(0, -1)
  // 获取题目详情
  topicApi.getPartTopics(ids).then(res => {
    if(res.code === 200){
      if(currentTopicSet.value === 1){
        topicListBlocks.value[0].topics = [...topicListBlocks.value[0].topics, ...res.data]
      }else if(currentTopicSet.value === 2){
        topicListBlocks.value[1].topics = [...topicListBlocks.value[1].topics, ...res.data];
      }else if(currentTopicSet.value === 3){
        topicListBlocks.value[2].topics = [...topicListBlocks.value[2].topics, ...res.data];
      }
      const idArray = res.data.map(item => item.id);
      topicAllId.value = [...new Set([...topicAllId.value, ...idArray])];
      topicDialogVisible.value = false
    }else {
      ElMessage.error(res.message)
    }
  })
}

// 监听对话框的显示状态变化
watch(topicDialogVisible, (newValue) => {
  if (!newValue) {
    // 对话框关闭后的操作
    selectedRows.value = [];
    selectedRowKeys.value = [];
    searchInfo.value.title = "";
    searchInfo.value.type = "";
    searchInfo.value.categoryId = null;
    pageInfo.value.page = 1
    // 可以根据需要添加更多的清理操作，比如重置表格的选中状态等
    tableRef.value.clearSelection();
  }
});

// 计算题目分数
const computedScore = (topics) => {
  return computed(() => {
    let score = 0
    topics.forEach(item => {
      score += item.score
    })
    return score
  });
};

// 处理题型格式
const computedType = (type) => {
  return computed(() => {
    switch (type) {
      case '0':
        return '单选题'
      case '1':
        return '多选题'
      case '2':
        return '判断题'
      case '3':
        return '填空题'
      case '4':
        return '问答题'
    }
  })
}

// 保存试卷
const savePaper = async () => {
  const data = {
    title: paper.value.title,
    categoryId: paper.value.categoryId,
    topicsSets: topicListBlocks.value
  }
  const res = await paperApi.AddPaper(JSON.stringify(data, removeCircularReferences()))
  if(res.code === 200){
    ElMessage.success(res.message)
    await router.push('/content/manage-paper')
  }else {
    ElMessage.error(res.message)
  }
}

const removeCircularReferences = () => {
  const seen = new WeakSet();
  return function (key, value) {
    if (typeof value === 'object' && value!== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

onMounted(() => {
  getCategoryList()
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
