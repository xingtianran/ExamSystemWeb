<template>
  <div class="clear-fx">
    <div class="topic-search-box clear-fx">
      <div class="title-input-box float-left">
        <el-input
          v-model="searchInfo.title"
          placeholder="标题"
          :prefix-icon="Search"
        />
      </div>
      <div class="type-select-box float-left">
        <el-select v-model="searchInfo.type" placeholder="题型">
          <el-option
            v-for="item in types"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="category-select-box float-left">
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
      <div class="float-left">
        <el-button type="primary" @click="doSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
      <div class="float-right">
        <el-button type="primary" :icon="EditPen" @click="router.push('add-topic')">添加题目</el-button>
      </div>
    </div>
    <div class="topic-list-box">
      <el-table v-loading="loading" :data="topics"  style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="title" label="Title" width="180" />
        <el-table-column prop="category.name" label="Category" width="100" />
        <el-table-column prop="user.userName" label="User" width="100" />
        <el-table-column label="State" width="100">
          <template #default="scope">
            <el-switch :before-change="() => handleSwitchChange(scope.row)" v-model="scope.row.state" active-value="1" inactive-value="0" />
          </template>
        </el-table-column>
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
        <el-table-column label="Handle">
          <template #default="scope">
            <el-button size="small"  @click="deleteItem(scope.row)">
              详情
            </el-button>
            <el-button size="small" type="primary" @click="deleteItem(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="deleteItem(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="topic-pagination-box float-right">
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
    <div>

    </div>
  </div>

</template>

<script setup>
import { onMounted, ref} from 'vue'
import {categoryApi, topicApi} from "@/api/api.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {dateFormat} from "@/utils/date.js";
import {EditPen, Search} from "@element-plus/icons-vue";
import router from "@/router/index.js";


const topics = ref([])

const loading = ref(false)

const pageInfo = ref({
  page : 1,
  size : 6,
  totalPage : 0
})

const searchInfo = ref({
  title: '',
  type: '',
  categoryId: null
})

const categories = ref([])

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


// 重置搜索内容
const resetSearch = () => {
  searchInfo.value.title = ''
  searchInfo.value.categoryId = null
  searchInfo.value.type = ''
  pageInfo.value.page = 1
  getTopics(pageInfo.value, searchInfo.value)
}

// 翻页
const turnPage = (newPage) => {
  pageInfo.value.page = newPage
  getTopics(pageInfo.value, searchInfo.value);
}

// 搜索
const doSearch = () => {
  getTopics(pageInfo.value, searchInfo.value)
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
      pageInfo.totalPage = res.totalPage
      loading.value = false
    }else {
      ElMessage.error(res.message);
    }
  })
}

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

// 改变开关
const handleSwitchChange =  async (data) => {
  const text = data.state === '1' ? '禁用' : '恢复'
  try {
    await ElMessageBox.confirm(`确认要${text}ID为 <strong style="color: #409EFF">${data.id}</strong> 的题目吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      dangerouslyUseHTMLString: true,
      buttonSize: "small"
    })
    // 更新状态
    const res = await updateState(data.id)
    if(res.code === 200){
      ElMessage.success(res.message)
      return true
    }else {
      ElMessage.error(res.message)
      return false
    }
  } catch (e) {
    return false
  }
}

// 更新状态
const updateState = async (id) => {
  return await topicApi.updateState(id)
}

// 删除题目
/*const deleteItem = (data) => {
  ElMessageBox.confirm(`确认要删除ID为 <strong style="color: #409EFF">${data.id}</strong> 的图片吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    dangerouslyUseHTMLString: true,
    buttonSize: "small"
  }).then(() => {
    imageApi.deleteImage(data.id).then(res => {
      if(res.code === 200){
        ElMessage.success(res.message)
        getImages(pageInfo.value, searchInfo.value)
      }else {
        ElMessage.error(res.message)
      }
    })
  })
}*/

onMounted(() => {
  getTopics(pageInfo.value)
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

.topic-search-box > div{
  margin-left: 10px;
}
.topic-search-box > div:first-child{
  margin-left: 0;
}
.type-select-box{
  width: 200px;
}
.category-select-box{
  width: 200px;
}
.topic-pagination-box{
  margin-top: 10px;
}
</style>
