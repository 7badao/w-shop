<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :myinfo="rolesBread"></breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <topSearch
        :spanNum="spanNum"
        :placeholderText="placeholderText"
        :isBtnShow="isBtnShow"
        @searchQ="searchQ"
        @clearInput="clearInput"
      ></topSearch>
      <!-- 表格区域 -->
      <myTable :goodsList="goodsList" @editOrder="editOrder"></myTable>
      <!-- 分页 -->
      <pageNation
        :total="total"
        :pageSize="quereInfo.pagesize"
        :pageSizeBox="pageSizeBox"
        @changeSize="changeSize"
        @changSizeNum="changSizeNum"
      ></pageNation>
    </el-card>
    <!-- 弹框区域 -->
    <myDialog
      :dialogVisible="dialogVisible"
      :dialogTitle="dialogTitle"
      @closeDialog="closeDialog"
      :citydata="citydata"
    ></myDialog>
  </div>
</template>

<script>
// 导入面包屑
import breadcrumb from '@/components/breadcrumb'
import topSearch from '../../components/top_search'
import pageNation from '../../components/common/pageNation'
import myDialog from '../../components/common/C-dialog'
import myTable from './components/orderTable'
// 导入城市数据
import citydata from '../../assets/js/citydata'
import { ApiGetOrdersList } from '@/api/oreder'
import '@/utils/fliter'
export default {
  data() {
    return {
      spanNum: 8,
      isBtnShow: false,
      placeholderText: '请输入内容',
      rolesBread: {
        a: '订单管理',
        b: '订单列表'
      },
      citydata: citydata,
      // 订单参数管理
      quereInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 订单数据列表
      goodsList: [],
      total: 0,
      pageSizeBox: [5, 10, 15, 20],
      // 弹框状态
      dialogVisible: false,
      dialogTitle: '修改地址'
    }
  },
  methods: {
    // 获取订单数据列表
    async getOrderList() {
      const { data: res } = await ApiGetOrdersList(this.$http, {
        params: this.quereInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 点击编辑
    editOrder() {
      // console.log('111')
      this.dialogVisible = true
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false
    },
    // 分页改变条数
    changeSize(val) {
      this.quereInfo.pagesize = val
      this.getOrderList()
    },
    // 改变页码
    changSizeNum(val) {
      this.quereInfo.pagenum = val
      this.getOrderList()
    },
    // 搜索关键字
    searchQ(val) {
      this.quereInfo.query = val
      this.getOrderList()
    },
    // 清空搜索框
    clearInput() {
      this.quereInfo.query = ''
      this.getOrderList()
    }
  },
  created() {
    this.getOrderList()
  },
  components: {
    breadcrumb,
    topSearch,
    myTable,
    pageNation,
    myDialog
  }
}
</script>

<style></style>
