<template>
  <div>
    <div>
      <el-card shadow="never">
        <div>
          <div class="clear-fix">
            <div class="float-left">
              <el-text size="large">我的群组</el-text>
            </div>
            <div class="float-right">
              <el-button type="primary" @click="openDrawer">加入群组</el-button>
            </div>
          </div>
          <el-divider style="margin-top: 10px; margin-bottom: 10px;" />
          <div>
            <el-table v-loading="myLoading" :data="myTeams"  style="width: 100%">
              <el-table-column prop="name" label="群组名称" />
              <el-table-column prop="count" label="群组人数" width="100" />
              <el-table-column prop="createUser.userName" label="创建人" width="120" />
              <el-table-column label="创建时间" width="180">
                <template #default="scope">
                  {{dateFormat(scope.row.createTime)}}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  {{dateFormat(scope.row.createTime)}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>
    </div>

    <div>
      <el-drawer
        v-model="drawer"
        title="群组列表"
        :direction="direction"
        :before-close="handleClose"
      >
        <div>
          <div>
            <el-table v-loading="loading" :data="teams"  style="width: 100%">
              <el-table-column prop="name" label="群组名称" />
              <el-table-column prop="count" label="群组人数" width="80" />
              <el-table-column prop="createUser.userName" label="创建人" width="100" />
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-button type="text" @click="joinTeam(scope.row)" plain>加入群组</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="team-pagination-box float-right">
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
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script setup>
import {dateFormat} from "@/utils/date.js";
import {onMounted, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {teamPortalApi} from "@/api/api.js";

const teams = ref([])
const myTeams = ref([])

const myLoading = ref(false)
const loading = ref(false)
const drawer = ref(false)
const direction = ref('rtl')

const pageInfo = ref({
  page : 1,
  size : 8,
  totalPage : 0
})

const handleClose = () => {
  ElMessageBox.confirm('你确定要关闭该界面吗？')
    .then(() => {
      drawer.value = false
    })
    .catch(() => {
      // catch error
    })
}

const getTeams = (pageInfo) => {
  loading.value = true
  const params = {
    ...pageInfo
  }
  teamPortalApi.getTeams(params).then(res => {
    if(res.code === 200){
      teams.value = res.data
      pageInfo.totalPage = res.totalPage
      loading.value = false
    }else {
      ElMessage.error(res.message)
    }
  })
}

const turnPage = (newPage) => {
  pageInfo.value.page = newPage
  getTeams(pageInfo.value);
}

// 打开抽屉
const openDrawer = () => {
  drawer.value = true
  getTeams(pageInfo.value)
}

// 加入群组
const joinTeam = (data) => {
  const params = {
    TeamId: data.id,
    Password: '123456'
  }
  teamPortalApi.joinTeam(params).then(res => {
    if(res.code === 200){
      ElMessage.success(res.message)
      drawer.value = false
    }else {
      ElMessage.error(res.message)
    }
  })
}

// 获取我的群组
const getMyTeams = () => {
  loading.value = true
  teamPortalApi.getMyTeams().then(res => {
    if(res.code === 200){
      myTeams.value = res.data
      loading.value = false
    }else {
      ElMessage.error(res.message)
    }
  })
}

onMounted(() => {
  getMyTeams()
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
.team-pagination-box{
  margin-top: 8px;
}
</style>
