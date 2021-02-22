<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :myinfo="rolesBread"></breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 头部搜索区域 -->
      <topSearch
        :btnText="btnText"
        :placeholderText="placeholderText"
        @searchQ="searchQ"
        @clearInput="clearInput"
        :spanNum="spanNum"
        @toRouterAddGoods="toRouterAddGoods"
      ></topSearch>
      <!-- 表格区域 -->
      <listTable :goodsList="goodsList" @deleteGoods="deleteGoods"></listTable>
      <!-- 分页 -->
      <pageNation
        @changeSize="changeSize"
        @changSizeNum="changSizeNum"
        :total="total"
        :pageSize="quereInfo.pagesize"
        :pageSizeBox="pageSizeBox"
      ></pageNation>
    </el-card>
  </div>
</template>

<script>
// 导入面包屑
import breadcrumb from '@/components/breadcrumb'
import pageNation from '@/components/common/pageNation'
import topSearch from '@/components/top_search'
import listTable from './components/listTable'
import { ApiGetGoodsList, ApiDeleteGoodsInfo } from '@/api/goods'
import '@/utils/fliter'
export default {
  data () {
    return {
      rolesBread: {
        a: "商品管理",
        b: "商品列表"
      },
      // 商品管理参数
      quereInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 按钮文字
      btnText: '添加商品',
      placeholderText: '请输入要搜索的商品',
      spanNum: 6,
      // 总数据
      total: 0,
      pageSizeBox: [5, 10, 15, 20],
      // 商品列表数据
      goodsList: []
    }
  },
  methods: {
    // 请求商品列表
    async getGoodsList () {
      const { data: res } = await ApiGetGoodsList(this.$http, {
        params: this.quereInfo
      })
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error('获取失败')
        return false
      }
      this.$message({
        message: res.meta.msg,
        type: "success"
      })
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 搜索关键字
    searchQ (val) {
      this.quereInfo.query = val
      this.getGoodsList()
    },
    // 清空搜索框
    clearInput () {
      this.quereInfo.query = ''
      this.getGoodsList()
    },
    // 分页改变条数
    changeSize (val) {
      console.log(val, '55');
      this.quereInfo.pagesize = val
      this.getGoodsList()
    },
    // 改变页码
    changSizeNum (val) {
      this.quereInfo.pagenum = val
      this.getGoodsList()
    },
    deleteGoods (val) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 删除商品
        const { data: res } = await ApiDeleteGoodsInfo(this.$http, val)
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getGoodsList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加商品点击事件
    toRouterAddGoods () {
      this.$router.push('/goods/add')
    }
  },
  created () {
    this.getGoodsList()
  },
  components: {
    breadcrumb,
    topSearch,
    listTable,
    pageNation
  }
}
</script>

<style>
</style>
