<template>
  <div>
    <!-- 面包屑区域 -->
    <breadcrumb :myinfo="myinfo"></breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button type="primary" @click="showAddCate">添加分类</el-button>
      <!-- 表格区域 -->
      <tree-table
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
        :data="CateList"
        :columns="columns"
        class="treeTable"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" tyle="color:red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot-scope="scope" slot="order">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类弹窗 -->
    <el-dialog title="添加分类" :visible.sync="addCateVisible" width="40%" @close="closeVisible">
      <!-- 表格区域 -->
      <el-form
        :model="addCateruleForm"
        :rules="addCaterules"
        ref="addCateruleFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateruleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="name">
          <!-- options指定数据源 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            expand-trigger="hover"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入面包屑
import breadcrumb from '@/components/breadcrumb'
// 导入商品分类相关的数据请求
import { apiGetCategoriesList, addCategories } from '@/api/cate'
export default {
  data () {
    return {
      myinfo: {
        a: "商品管理",
        b: "商品分类"
      },
      // 表格分类数据
      CateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 指定为模板列
          type: 'template',
          // 表示当前这列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 指定为模板列
          type: 'template',
          // 表示当前这列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 指定为模板列
          type: 'template',
          // 表示当前这列使用的模板名称
          template: 'opt'
        }
      ],
      // 添加分类弹框
      addCateVisible: false,
      // 添加分类数据
      addCateruleForm: {
        cat_name: '',
        cat_pid: 0,
        // 分类等级默认一级分类
        cat_level: 0
      },
      // 添加分类验证规则
      addCaterules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },
      // 父级分类列表
      parentCateList: [],
      // 级联配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 选中的父级分类id数组
      selectedKeys: []
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await apiGetCategoriesList(this.$http, {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message({
        message: res.meta.msg,
        type: "success"
      })
      this.CateList = res.data.result
      this.total = res.data.total
    },
    // 点击下拉条数
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getCateList()
    },
    // 点击页码
    handleCurrentChange (newnum) {
      this.queryInfo.pagenum = newnum
      this.getCateList()
    },
    // 添加分类按钮
    async showAddCate () {
      // 请求商品分类数据
      const { data: res } = await apiGetCategoriesList(this.$http, {
        params: {
          type: 2
        }
      })
      this.parentCateList = res.data
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message({
        message: res.meta.msg,
        type: "success"
      })
      this.addCateVisible = true
    },
    // 监听添加分类取消按钮
    closeVisible () {
      this.$refs.addCateruleFormRef.resetFields()
      // 清空级联选择器
      this.selectedKeys = []
      this.addCateruleForm.cat_level = 0
      this.addCateruleForm.cat_pid = 0
    },
    // 级联选择项发生变化触发
    parentCateChange () {
      // 判断是否选中父级分类 selectedKeys中的length大于. 证明选中父级分类 反之则没有
      if (this.selectedKeys.length > 0) {
        // 只取最后一项 
        this.addCateruleForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类等级赋值
        this.addCateruleForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 如果为0 什么都没选
        this.addCateruleForm.cat_pid = 0
        // 为当前分类等级赋值
        this.addCateruleForm.cat_level = 0
      }
    },
    // 添加新分类
    addCate () {
      console.log(this.addCateruleForm);
      this.$refs.addCateruleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await addCategories(this.$http, {
          data: this.addCateruleForm
        })
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message({
          message: res.meta.msg,
          type: "success"
        })
        this.getCateList()
        this.addCateVisible = false
      })
    }
  },
  created () {
    this.getCateList()
  },
  components: {
    breadcrumb
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>