<script setup>


</script>

<template>
  <el-container>
    <el-header>
      <top-view></top-view>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <left-view></left-view>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>
