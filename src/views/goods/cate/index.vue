<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :myinfo="rolesBread"></breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addNewCategories">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        class="treeTable"
        :data="categories"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted===false"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editName(scope.row)">编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteNmae(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <pageNation
        @changeSize="changeSize"
        @changSizeNum="changSizeNum"
        :total="total"
        :pageSize="queryInfo.pagesize"
        :pageSizeBox="pageSizeBox"
      ></pageNation>
    </el-card>
    <!-- 编辑弹框 -->
    <myDialog
      :titleDialog="titleDialog"
      :dialogVisible="dialogVisible"
      :cateName="cateName"
      @dialogClose="dialogClose"
      @sureBtn="sureBtn"
    ></myDialog>
    <!-- 添加分类弹框 -->
    <myAddCate
      @getCategories="getCategories"
      @addCateClose="addCateClose"
      :addCateDialog="addCateDialog"
      ref="addFromRef"
    ></myAddCate>
  </div>
</template>

<script>
// 导入面包屑
import breadcrumb from '@/components/breadcrumb'
import pageNation from '@/components/common/pageNation'
import myDialog from './components/my-dialog'
import myAddCate from './components/my-addCate'
import { ApiGetClassification, putCategories, deleteCategories } from '@/api/cate'
export default {
  data () {
    return {
      rolesBread: {
        a: "商品管理",
        b: "商品分类"
      },
      titleDialog: '编辑分类',
      // 商品分类数据列表
      categories: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据
      total: 0,
      pageSizeBox: [5, 10, 15, 20],
      // 表格列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          // 表示将当前列定义为模板列
          type: 'template',
          // 模板列名称
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          // 表示将当前列定义为模板列
          type: 'template',
          // 模板列名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示将当前列定义为模板列
          type: 'template',
          // 模板列名称
          template: 'opt'
        },
      ],
      dialogVisible: false,
      // 分类id
      cat_id: '',
      // 编辑分类名称
      cateName: '',
      // 添加分类弹框
      addCateDialog: false
    }
  },
  methods: {
    // 获取商品分类数据
    async getCategories () {
      const { data: res } = await ApiGetClassification(this.$http, {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.categories = res.data.result
      this.total = res.data.total
    },
    // 分页改变条数
    changeSize (val) {
      this.queryInfo.pagesize = val
      this.getCategories()
    },
    // 改变页码
    changSizeNum (val) {
      this.queryInfo.pagenum = val
      this.getCategories()
    },
    // 编辑操作
    editName (val) {
      console.log(val);
      this.cat_id = val.cat_id
      this.cateName = val.cat_name
      this.dialogVisible = true
    },
    dialogClose () {
      this.dialogVisible = false
    },
    // 确定操作
    async sureBtn (val) {
      const { data: res } = await putCategories(this.$http, this.cat_id, {
        data: {
          cat_name: val
        }
      })
      if (res.meta.status === 200) {
        this.cateName = res.data.cat_name
        this.$message({
          type: 'success',
          message: res.meta.msg
        })
        // 弹框关闭
        this.dialogVisible = false
        this.getCategories()
      }
    },
    // 添加分类按钮
    addNewCategories () {
      this.addCateDialog = true
    },
    // 关闭添加分类弹框
    addCateClose () {
      this.addCateDialog = false
      this.$refs.addFromRef.addCateDialogClose()
    },
    // 删除分类
    deleteNmae (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await deleteCategories(this.$http, id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message({
          message: res.meta.msg,
          type: 'success'
        })
        this.getCategories()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    }
  },
  created () {
    this.getCategories()
  },
  components: {
    breadcrumb,
    pageNation,
    myDialog,
    myAddCate
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>
