<template>
  <div class="layout">
    <el-container>
      <el-header class="myHeader">
        <el-col class="leftHeader">
          <img src="../../assets/logo.png" alt />
          <span>万物互联后台管理系统</span>
        </el-col>
        <el-col :span="1">
          <el-button type="info">退出</el-button>
        </el-col>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse?'64px':'200px'">
          <div class="toggle-button" @click="togleCollapse">|||</div>
          <layoutaside></layoutaside>
        </el-aside>
        <!-- 内容 -->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// 导入侧边栏
import layoutaside from './components/layout_aside'
export default {
  components: {
    layoutaside
  },
  data () {
    return {
      // 默认不折叠
      isCollapse: false
    }
  },
  methods: {
    // 菜单的折叠与展开
    togleCollapse () {
      this.isCollapse = !this.isCollapse
    },
  },
}
</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  & > .el-container {
    height: 100%;
  }
}
.myHeader {
  height: 60;
  background-color: #373f41;
  display: flex;
  align-items: center;
  .leftHeader {
    display: flex;
    align-items: center;
    img {
      height: 40px;
      width: 40px;
    }
    span {
      color: #fff;
      font-size: 20px;
    }
  }
}
.el-aside {
  background-color: #323745;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #eee;
  color: #333;
  // text-align: center;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放上去变成小手
  cursor: pointer;
}
</style>