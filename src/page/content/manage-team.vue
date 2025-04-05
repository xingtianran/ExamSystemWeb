<template>
  <div class="clear-fx">
    <div class="team-search-box clear-fx">
      <div class="name-input-box float-left">
        <el-input
          v-model="searchInfo.name"
          placeholder="组名"
          :prefix-icon="Search"
        />
      </div>

      <div class="float-left">
        <el-button type="primary" @click="doSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
      <div class="float-right">
        <el-button type="primary" :icon="EditPen" @click="openAddDialog">添加群组</el-button>
      </div>
    </div>
    <div class="topic-list-box">
      <el-table v-loading="loading" :data="teams"  style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="password" label="Password" width="100" />
        <el-table-column prop="count" label="Count" width="90" />
        <el-table-column prop="createUser.userName" label="CreateUser" width="120" />
        <el-table-column label="State" width="100">
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
            <el-button size="small" type="primary" @click="openUpdateDialog(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="deleteItem(scope.row)">
              删除
            </el-button>
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
        <el-form ref="formRef" :model="team" :rules="rules" label-width="auto" style="max-width: 600px">
          <el-form-item label="群组名称：" prop="name">
            <el-input v-model="team.name" />
          </el-form-item>
          <el-form-item label="群组密码：" prop="password">
            <el-input show-password v-model="team.password" />
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
import { onMounted, ref } from 'vue'
import {teamApi} from "@/api/api.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {dateFormat} from "@/utils/date.js";
import {EditPen, Search} from "@element-plus/icons-vue";


const teams = ref([])

const loading = ref(false)

const pageInfo = ref({
  page : 1,
  size : 8,
  totalPage : 0
})

const searchInfo = ref({
  name: ''
})

// 控制对话框
const myDialog = ref(false)

// 对话框标题
const title = ref('')

// 群组
const team = ref({
  name: '',
  password: ''
})

const rules = {
  name: [
    { required: true, message: '请输入群组名称', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入群组密码', trigger: 'blur' }
  ]
};

const formRef = ref(null)

// 重置搜索内容
const resetSearch = () => {
  searchInfo.value.name = ''
  pageInfo.value.page = 1
  getTeams(pageInfo.value, searchInfo.value)
}

// 翻页
const turnPage = (newPage) => {
  pageInfo.value.page = newPage
  getTeams(pageInfo.value, searchInfo.value);
}

// 搜索
const doSearch = () => {
  getTeams(pageInfo.value, searchInfo.value)
}

// 获取全部群组
const getTeams = (pageInfo, searchInfo) => {
  loading.value = true
  const params = {
    ...pageInfo,
    ...searchInfo
  }
  teamApi.getTeams(params).then(res => {
    if(res.code === 200){
      teams.value = res.data
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
    await ElMessageBox.confirm(`确认要${text}ID为 <strong style="color: #409EFF">${data.id}</strong> 的群组吗？`, '提示', {
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
  return await teamApi.updateState(id)
}

// 打开编辑窗口
const openUpdateDialog = (data) => {
  myDialog.value = true
  team.value.id = data.id
  team.value.name = data.name
  team.value.password = data.password
  title.value = '编辑'
}

// 添加群组
const openAddDialog = () => {
  myDialog.value = true
  title.value = '新增'
}

// 关闭对话框提示
const handleClose = () => {
  ElMessageBox.confirm('确认要关闭弹出窗口吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    buttonSize: "small"
  })
    .then(() => {
      team.value.name = ''
      team.value.password = ''
      myDialog.value = false
    })
}

// 操作群组
const handleItem = () => {
  formRef.value.validate( (valid) => {
    if (valid) {
      if(title.value === "增加"){
        teamApi.addTeam(team.value).then(res => {
          if(res.code === 200){
            ElMessage.success(res.message)
            getTeams(pageInfo.value, searchInfo.value)
          }else {
            ElMessage.error(res.message)
          }
        })
      }else {
        teamApi.updateTeam(team.value).then(res => {
          if(res.code === 200){
            ElMessage.success(res.message)
            getTeams(pageInfo.value, searchInfo.value)
          }else {
            ElMessage.error(res.message)
          }
        })
      }
      myDialog.value = false
      team.value.name = ''
      team.value.password = ''
    } else {
      ElMessage.error('请填写完整信息');
    }
  });
}

// 删除群组
const deleteItem = (data) => {
  ElMessageBox.confirm(`确认要删除ID为 <strong style="color: #409EFF">${data.id}</strong> 的群组吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    dangerouslyUseHTMLString: true,
    buttonSize: "small"
  }).then(() => {
    teamApi.deleteTeam(data.id).then(res => {
      if(res.code === 200){
        ElMessage.success(res.message)
        getTeams(pageInfo.value, searchInfo.value)
      }else {
        ElMessage.error(res.message)
      }
    })
  })
}

onMounted(() => {
  getTeams(pageInfo.value)
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

.team-search-box > div{
  margin-left: 10px;
}
.team-search-box > div:first-child{
  margin-left: 0;
}
.team-pagination-box{
  margin-top: 10px;
}
</style>
