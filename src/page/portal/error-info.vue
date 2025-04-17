<template>
  <div>
    <div>
      <el-card shadow="never">
        <div>
          <div>
              <el-text size="large">错题集</el-text>
          </div>
          <el-divider style="margin-top: 10px; margin-bottom: 10px;" />
          <div>
            <el-table v-loading="loading" :data="errorSets"  style="width: 100%">
              <el-table-column prop="id" label="编号" />
              <el-table-column prop="topic.title" label="题目标题" width="120" />
              <el-table-column  prop="answer" label="答案" width="180" show-overflow-tooltip />
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

  </div>
</template>

<script setup>
import {dateFormat} from "@/utils/date.js";
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {userApi} from "@/api/api.js";

const errorSets = ref([])

const loading = ref(false)




// 获取我的群组
const  getErrorSets = () => {
  loading.value = true
  userApi.getErrorSets().then(res => {
    if(res.code === 200){
      errorSets.value = res.data
      loading.value = false
    }else {
      ElMessage.error(res.message)
    }
  })
}

onMounted(() => {
  getErrorSets()
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
