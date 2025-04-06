<template>
  <div class="clear-fx">
    <div class="paper-search-box clear-fx">
      <div class="title-input-box float-left">
        <el-input
          v-model="searchInfo.title"
          placeholder="标题"
          :prefix-icon="Search"
        />
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
        <el-button type="primary" :icon="EditPen" @click="router.push('/content/add-paper')">添加试卷</el-button>
      </div>
    </div>
    <div class="topic-list-box">
      <el-table v-loading="loading" :data="papers"  style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="title" label="Title" width="180" />
        <el-table-column prop="category.name" label="Category" width="100" />
        <el-table-column prop="user.userName" label="User" width="100" />
        <el-table-column label="State" width="100">
          <template #default="scope">
            <el-switch :before-change="() => handleSwitchChange(scope.row)" v-model="scope.row.state" active-value="1" inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column prop="score" label="Score" width="100" />
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
            <el-button size="small" type="primary" @click="selectItem(scope.row.id)">
              选择试卷
            </el-button>
            <el-button size="small" type="danger" @click="deleteItem(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paper-pagination-box float-right">
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
import {categoryApi, paperApi} from "@/api/api.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {dateFormat} from "@/utils/date.js";
import {EditPen, Search} from "@element-plus/icons-vue";
import router from "@/router/index.js";


const papers = ref([])

const loading = ref(false)

const pageInfo = ref({
  page : 1,
  size : 8,
  totalPage : 0
})

const searchInfo = ref({
  title: '',
  categoryId: null
})

const categories = ref([])



// 重置搜索内容
const resetSearch = () => {
  searchInfo.value.title = ''
  searchInfo.value.categoryId = null
  pageInfo.value.page = 1
  getPapers(pageInfo.value, searchInfo.value)
}

// 翻页
const turnPage = (newPage) => {
  pageInfo.value.page = newPage
  getPapers(pageInfo.value, searchInfo.value);
}

// 搜索
const doSearch = () => {
  getPapers(pageInfo.value, searchInfo.value)
}

// 获取全部试卷
const getPapers = (pageInfo, searchInfo) => {
  loading.value = true
  const params = {
    ...pageInfo,
    ...searchInfo
  }
  paperApi.getPapers(params).then(res => {
    if(res.code === 200){
      papers.value = res.data
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
    await ElMessageBox.confirm(`确认要${text}ID为 <strong style="color: #409EFF">${data.id}</strong> 的试卷吗？`, '提示', {
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
  return await paperApi.updateState(id)
}

// 删除题目
const deleteItem = (data) => {
  ElMessageBox.confirm(`确认要删除ID为 <strong style="color: #409EFF">${data.id}</strong> 的试卷吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    dangerouslyUseHTMLString: true,
    buttonSize: "small"
  }).then(() => {
    paperApi.deletePaper(data.id).then(res => {
      if(res.code === 200){
        ElMessage.success(res.message)
        getPapers(pageInfo.value, searchInfo.value)
      }else {
        ElMessage.error(res.message)
      }
    })
  })
}
// 编辑题目
const editItem = (id) => {
  router.push({
    path: '/content/add-topic',
    query: {
      id: id
    }
  });
}


// 选择试卷
const selectItem = (id) =>{
  router.push({
    path: '/content/public-paper',
    query: {
      id: id
    }
  });
}

onMounted(() => {
  getPapers(pageInfo.value)
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

.paper-search-box > div{
  margin-left: 10px;
}
.paper-search-box > div:first-child{
  margin-left: 0;
}
.category-select-box{
  width: 200px;
}
.paper-pagination-box{
  margin-top: 10px;
}
</style>
