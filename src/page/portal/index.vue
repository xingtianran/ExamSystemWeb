<template>
  <div>
    <el-card shadow="never">
      <div>
        <div>
          <el-text size="large">在线考试</el-text>
        </div>
        <el-divider style="margin-top: 10px; margin-bottom: 10px;" />
        <div class="clear-fix">
          <template v-for="(paper, index) in papers" :key="index">
            <el-card @click="startExam(paper)" shadow="hover" class="paper-item-box float-left">
              <div>
                <el-text size="large" type="primary">{{paper.title}}</el-text>
              </div>
              <div>
                <el-text>结束时间：{{dateFormat(paper.tempTime)}}</el-text>
              </div>
              <div>
                <el-text>考试类目：{{paper.category.name}}</el-text>
              </div>
              <div>
                <el-text>发布人：{{paper.user.userName}}</el-text>
              </div>
              <div>
                <el-text>总分：{{paper.score}}</el-text>
              </div>
            </el-card>
          </template>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {userApi} from "@/api/api.js";
import {ElMessage} from "element-plus";
import {dateFormat} from "@/utils/date.js";
import router from "@/router/index.js";

const papers = ref([])


// 获取我的考试
const getMyExam = () => {
  userApi.getMyExam().then(res => {
    if(res.code === 200){
      papers.value = res.data
    }else {
      ElMessage.error(res.message);
    }
  })
}

// 进入考试界面
const startExam = (data) => {
  router.push({
    path: '/do-paper',
    query: {
      paperId: data.id,
      teamId: data.tempId
    }
  });
}

onMounted(() => {
  getMyExam()
})
</script>

<style scoped>
.clear-fix{
  overflow: hidden;
}
.float-right{
  float: right;
}
.float-left{
  float: left;
}
.paper-item-box{
  margin-top: 10px;
  margin-right: 10px;
  width: 260px;
  cursor: pointer;
}
</style>
