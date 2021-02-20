<template>
  <div>
    <el-steps :space="200" :active="tabsIndex-0" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  props: ['tabsIndex'],
  data () {
    return {
      tabPosition: 'left'
    }
  },
}
</script>

<style>
</style>