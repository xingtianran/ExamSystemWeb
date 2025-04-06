<template>
  <div class="clear-fx">
    <div class="image-search-box clear-fx">
      <div class="origin-select-box float-left">
        <el-select v-model="searchInfo.origin" placeholder="来源">
          <el-option
            v-for="item in origins"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="float-left">
        <el-button type="primary" @click="doSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </div>
    <div class="image-list-box">
      <el-table v-loading="loading" :data="images"  style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="originalName" label="OriginalName" width="240" />
        <el-table-column prop="user.userName" label="User" width="100" />
        <el-table-column label="Image" width="100">
          <template #default="scope">
            <el-image class="image-box" :src="imagePrefix + scope.row.name" alt="image" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column label="State" width="100">
          <template #default="scope">
            <el-switch :before-change="() => handleSwitchChange(scope.row)" v-model="scope.row.state" active-value="1" inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column label="Origin" width="100">
          <template #default="scope">
            <span v-if="scope.row.origin === '1'">avatar</span>
            <span v-else>topic</span>
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
            <el-button size="small" type="danger" @click="deleteItem(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="image-pagination-box float-right">
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
import {getCurrentInstance, onMounted, ref} from 'vue'
import {imageApi,} from "@/api/api.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {dateFormat} from "@/utils/date.js";

const instance = getCurrentInstance();
const imagePrefix = instance.appContext.config.globalProperties.$imagePrefix;

const searchInfo = ref({
  origin: ''
})

const images = ref([])

const loading = ref(false)

const origins = ref([
  {
    name: 'avatar',
    value: '1'
  },
  {
    name: 'topic',
    value: '2'
  }
])

const pageInfo = ref({
  page : 1,
  size : 6,
  totalPage : 0
})


// 重置搜索内容
const resetSearch = () => {
  searchInfo.value.origin = ''
  pageInfo.value.page = 1
  getImages(pageInfo.value, searchInfo.value)
}

// 翻页
const turnPage = (newPage) => {
  pageInfo.value.page = newPage
  getImages(pageInfo.value, searchInfo.value);
}

// 搜索
const doSearch = () => {
  getImages(pageInfo.value, searchInfo.value)
}

// 获取全部图片
const getImages = (pageInfo, searchInfo) => {
  loading.value = true
  const params = {
    ...pageInfo,
    ...searchInfo
  }
  imageApi.getImages(params).then(res => {
    if(res.code === 200){
      images.value = res.data
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
    updateState(data.id)
    return true
  } catch (e) {
    return false
  }
}

// 更新状态
const updateState = (id) => {
  imageApi.updateState(id).then(res => {
    if(res.code === 200){
      ElMessage.success(res.message)
      getImages(pageInfo.value, searchInfo.value)
    }else {
      ElMessage.error(res.message)
    }
  })
}

// 删除图片
const deleteItem = (data) => {
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
}

onMounted(() => {
  getImages(pageInfo.value)
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

.image-search-box > div{
  margin-left: 10px;
}
.image-search-box > div:first-child{
  margin-left: 0;
}
.origin-select-box{
  width: 240px;
}
.image-box{
  width: 45px;
  height: 45px;
}
.image-pagination-box{
  margin-top: 10px;
}
</style>
