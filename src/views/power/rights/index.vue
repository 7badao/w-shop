<template>
  <div>
    <!-- 面包屑区域 -->
    <breadcrumb :myinfo="power"></breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 表格区域 -->
      <el-table v-loading="isLoading" :data="tableData" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级权限</el-tag>
            <el-tag v-else-if="scope.row.level==='1'" type="success">二级权限</el-tag>
            <el-tag v-else type="danger">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
// 导入面包屑组件
import breadcrumb from '@/components/breadcrumb';
// 导入权限请求
import { apiGetRights } from '@/api/rights'
export default {
  data () {
    return {
      power: {
        a: "用户管理",
        b: "用户列表"
      },
      // 表格数据
      tableData: [],
      // 加载效果
      isLoading: false
    }
  },
  methods: {
    // 请求权限数据
    async getRights () {
      this.isLoading = true
      const { data: res } = await apiGetRights(this.$http, {
        url: 'rights/list'
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
      this.tableData = res.data
      setTimeout(() => {
        this.isLoading = false
      }, 500);
    }
  },
  created () {
    this.getRights()
  },
  components: {
    breadcrumb
  }
}
</script>

<style>
</style>