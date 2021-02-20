<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :myinfo="rolesBread"></breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 头部搜索框 -->
      <top-input
        @toRouter="toRouter"
        :spanNum="8"
        @searchGoods="searchGoods"
        right="添加商品"
        isShow="true"
      ></top-input>
      <!-- 表格 -->
      <list-table @deleGoods="deleGoods" :goodsList="goodsList" dateFormat></list-table>
      <!-- 分页 -->
      <PageCurrent
        @changeSize="changeSize"
        :pageSizeList="pageSizeList"
        :pageSizeNum="pageSizeNum"
        :total="total"
        @changNum="changNum"
      ></PageCurrent>
    </el-card>
  </div>
</template>

<script>
// 导入面包屑
import breadcrumb from '@/components/breadcrumb'
import TopInput from '../../../components/common/Top_input'
import PageCurrent from '../../../components/common/Page_current'
import ListTable from './components/List_Table'
import '@/utils/dateFormat'
import { ApiGetGoodsList, ApiDeleteGoods } from '@/api/goods'
export default {
  components: {
    breadcrumb,
    TopInput,
    ListTable,
    PageCurrent
  },
  data () {
    return {
      // 商品列表请求参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      pageSizeList: [5, 10, 15, 20],
      pageSizeNum: 5,
      rolesBread: {
        a: "商品管理",
        b: "商品列表"
      },
      total: null,
      goodsList: []
    }
  },
  methods: {
    // 请求商品列表
    async getGoodsList () {
      const { data: res } = await ApiGetGoodsList(this.$http, {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status === 200) {
        this.goodsList = res.data.goods
        this.total = res.data.total
        this.queryInfo.pagenum = res.data.pagenum
      }
    },
    // 改变条数的方法
    changeSize (val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 改变页码的方法
    changNum (val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 搜索的方法
    searchGoods (val) {
      console.log(val);
      this.queryInfo.query = val
      this.getGoodsList()
    },
    // 删除商品
    deleGoods (val) {
      console.log(val)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await ApiDeleteGoods(this.$http, val)
        console.log(res);
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getGoodsList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 添加商品按钮
    toRouter () {
      this.$router.push('/goods/add')
    }
  },
  created () {
    this.getGoodsList()
  },
}
</script>

<style>
</style>