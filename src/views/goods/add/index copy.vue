<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :myinfo="rolesBread"></breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="添加商品信息" center show-icon type="info" :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <div class="stepsBox">
        <stepsStatus :tabsIndex="tabsIndex-0"></stepsStatus>
      </div>
      <!-- tabs区域 -->
      <myTabs @changeTabIndex="changeTabIndex" :tabsIndex="tabsIndex"></myTabs>
    </el-card>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import stepsStatus from './components/stepsStatus'
import myTabs from './components/myTabs'
export default {
  components: {
    breadcrumb,
    stepsStatus,
    myTabs
  },
  data () {
    return {
      rolesBread: {
        a: "商品管理",
        b: "添加商品"
      },
      // 步骤条默认下标
      artiveIndex: 0,
      tabsIndex: '0'
    }
  },
  methods: {
    // 改变tab
    changeTabIndex (val) {
      this.tabsIndex = val
      this.artiveIndex = this.tabsIndex - 0
    }
  },
}
</script>

<style lang="less" scoped>
.stepsBox {
  margin: 15px 0;
  /deep/.el-step__title {
    font-size: 13px;
  }
}
</style>
