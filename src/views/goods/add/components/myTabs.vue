<template>
  <el-tabs v-model="tabIndexNew" :tab-position="tabPosition" style="height: 200px;">
    <el-tab-pane label="基本信息" name="0">基本信息</el-tab-pane>
    <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
    <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
    <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
    <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  props: ['tabsIndex'],
  data () {
    return {
      tabPosition: 'left',
      tabIndexNew: ''
    }
  },
  methods: {
    tabClick (val) {
      console.log(val.index);
      this.$emit('changeTabIndex', val.index)
    }
  },
  created () {
    this.tabIndexNew = this.tabsIndex
    console.log(this.tabIndexNew);
  },
}
</script>

<style>
</style>