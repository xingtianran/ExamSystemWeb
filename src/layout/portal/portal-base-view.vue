<template>
  <el-container>
    <el-header>
      <portal-top-view></portal-top-view>
    </el-header>
    <el-container>
      <el-main>
        <router-view class="main-box"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>

</script>

<style scoped>
.main-box{
  width: 860px;
  margin: 0 auto;
}
</style>
