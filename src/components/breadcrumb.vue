<template>
  <!-- 面包屑导航 -->
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{myinfo.a}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{myinfo.b}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: ['myinfo'],
  data () {
    return {
    }
  },
}
</script>

<style>
</style>