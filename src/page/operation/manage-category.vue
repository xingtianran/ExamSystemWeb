<template>
  <div class="clear-fx">
    <div class="category-header-box clear-fx">
      <el-button class="float-right" type="primary" @click="openAddDialog" size="small">新增类目</el-button>
    </div>
    <div class="category-list-box">
      <el-table row-key="id" default-expand-all v-loading="loading" :data="categories"  style="width: 100%">
        <el-table-column prop="id" label="ID" width="180" />
        <el-table-column prop="name" label="Name" width="200" />
        <el-table-column prop="user.userName" label="User" width="120" />
        <el-table-column label="State" width="120">
          <template #default="scope">
            <el-switch :before-change="() => handleSwitchChange(scope.row)" v-model="scope.row.state" active-value="1" inactive-value="0" />
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
            <el-button size="small" type="primary" @click="openAddDialog(scope.row)">
              新增
            </el-button>
            <el-button size="small" @click="openUpdateDialog(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="deleteItem(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="category-pagination-box float-right">
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

  <div>
    <el-dialog
      v-model="myDialog"
      :title="title"
      width="500"
      :before-close="handleClose"
    >
      <div>
        <el-form :model="category" label-width="auto" style="max-width: 600px">
          <el-form-item label="父类目编号：">
            <el-input disabled v-model="category.parentId" />
          </el-form-item>
          <el-form-item label="类目名称：">
            <el-input v-model="category.name" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="handleClose()">取消</el-button>
          <el-button size="small" type="primary" @click="handleItem()">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {categoryApi} from "@/api/api.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {dateFormat} from "@/utils/date.js";


const title = ref('')
const myDialog = ref(false)

const categories = ref([])

const loading = ref(false)


const pageInfo = ref({
  page : 1,
  size : 6,
  totalPage : 0
})

const category = ref({
  id: 0,
  parentId : 0,
  name : ''
})


// 翻页
const turnPage = (newPage) => {
  pageInfo.value.page = newPage
  getCategories(pageInfo.value);
}


// 获取全部类目
const getCategories = (pageInfo) => {
  loading.value = true
  const params = {
    ...pageInfo
  }
  categoryApi.getCategories(params).then(res => {
    if(res.code === 200){
      categories.value = res.data
      pageInfo.totalPage = res.totalPage
      loading.value = false
    }else {
      ElMessage.error(res.message);
    }
  })
}

// 改变开关
const handleSwitchChange =  async (data) => {
  const text = data.state === '1' ? '禁用' : '恢复'
  try {
    await ElMessageBox.confirm(`确认要${text}ID为 <strong style="color: #409EFF">${data.id}</strong> 的图片吗？`, '提示', {
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
  return await categoryApi.updateState(id)
}

// 删除类目
const deleteItem = (data) => {
  ElMessageBox.confirm(`确认要删除ID为 <strong style="color: #409EFF">${data.id}</strong> 的类目吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    dangerouslyUseHTMLString: true,
    buttonSize: "small"
  }).then(() => {
    categoryApi.deleteCategory(data.id).then(res => {
      if(res.code === 200){
        ElMessage.success(res.message)
        getCategories(pageInfo.value)
      }else {
        ElMessage.error(res.message)
      }
    })
  })
}

// 新增类目
const openAddDialog = (data) => {
  myDialog.value = true
  category.value.parentId = data.id
  title.value = '新增'
}
// 编辑类目
const openUpdateDialog = (data) =>{
  myDialog.value = true
  category.value.parentId = data.parentId
  category.value.id = data.id
  category.value.name = data.name
  title.value = '编辑'
}


// 发送handle请求
const handleItem = () => {
  if(title === '新增'){
    // 发送新增请求
    categoryApi.addCategory(category.value).then(res => {
      if(res.code === 200){
        ElMessage.success(res.message)
        myDialog.value = false
        getCategories(pageInfo.value)
      }else {
        ElMessage.error(res.message)
      }
    })
  }else {
    // 发送编辑请求
    categoryApi.updateCategory(category.value).then(res => {
      if (res.code === 200) {
        ElMessage.success(res.message)
        myDialog.value = false
        getCategories(pageInfo.value)
      } else {
        ElMessage.error(res.message)
      }
    })
  }
  category.value.parentId = 0
  category.value.name = ''
}

const handleClose = () => {
  ElMessageBox.confirm('确认要关闭弹出窗口吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    buttonSize: "small"
  })
    .then(() => {
      category.value.parentId = 0
      category.value.name = ''
      myDialog.value = false
    })
}
onMounted(() => {
  getCategories(pageInfo.value)
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
.category-pagination-box{
  margin-top: 10px;
}
</style>
