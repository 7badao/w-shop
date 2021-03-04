<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :myinfo="rolesBread"></breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert
        title="注意：只允许第三级分类设置相关属性"
        show-icon
        :closable="false"
        type="warning"
      >
      </el-alert>
      <!-- 级联选择区域 -->
      <el-row>
        <el-col>
          <span class="colSpan">选择商品分类:</span>
          <el-cascader
            v-model="cateValue"
            :options="options"
            :props="{
              label: 'cat_name',
              value: 'cat_id',
              children: 'children',
              expandTrigger: 'hover'
            }"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 按钮区域 -->
          <params-btn
            @toShowDialog="ShowDialog"
            :btnText="btnText"
            :btnDisable="btnDisable"
          ></params-btn>
          <!-- 表格区域 -->
          <paramsTable
            :labelText="labelText"
            :tableData="tableData"
            @editFrom="editFrom"
            @deleteFrom="deleteFrom"
          ></paramsTable>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 按钮区域 -->
          <params-btn
            @toShowDialog="ShowDialog"
            :btnText="btnText"
            :btnDisable="btnDisable"
          ></params-btn>
          <!-- 表格区域 -->
          <paramsTable
            :labelText="labelText"
            :tableData="tableData"
            @editFrom="editFrom"
            @deleteFrom="deleteFrom"
          ></paramsTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 弹框 -->
    <params-dialog
      :dialogTitle="dialogTitle"
      :dialogVisible="dialogVisible"
      @closeDialog="closeDialog"
      :activeName="activeName"
      :dialogLable="dialogLable"
      :cateId="this.cateId"
      @addCategoriesShowTo="addCategoriesShowTo"
      @editCategoriesShowTo="editCategoriesShowTo"
      :editName="editName"
    ></params-dialog>
  </div>
</template>

<script>
// 导入面包屑
import breadcrumb from '@/components/breadcrumb'
import paramsBtn from './components/params-button'
import paramsTable from './components/params-table'
import paramsDialog from './components/params-dialog'
import {
  ApiGetClassification,
  ApiGetCateClassList,
  ApiAddCateName,
  ApiPutCategories,
  ApiDeleteCategories
} from '@/api/cate'
export default {
  data() {
    return {
      rolesBread: {
        a: '商品管理',
        b: '参数列表'
      },
      // 级联选择数据
      cateValue: [],
      // 可选项数据源 通过props配置
      options: [],
      activeName: 'many',
      // 按钮名称
      btnText: '添加参数',
      labelText: '参数名称',
      // 表格数据
      tableData: [],
      // 弹框状态
      dialogVisible: false,
      // 弹框标题
      dialogTitle: '添加动态参数',
      // 弹框label
      dialogLable: '动态参数',
      // 弹框数据
      dialogValue: '',
      editId: '',
      editName: ''
    }
  },
  methods: {
    // 级联触发的方法
    handleChange() {
      // 只允许选择第三级分类 如果不是第三级 清空数组
      if (this.cateValue.length !== 3) {
        // 清空级联选择器选中的数据
        this.cateValue = []
        return
      }
      this.getApiGetCateClassList()
    },
    // 获取所有商品数据
    async getCategories() {
      const { data: res } = await ApiGetClassification(this.$http, {
        params: ''
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
      this.options = res.data
    },
    // 请求分类参数列表数据
    async getApiGetCateClassList() {
      const { data: res } = await ApiGetCateClassList(this.$http, this.cateId, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.tableData = res.data
      console.log(res, '555')
    },
    // 切换tabs事件
    handleClick(tab) {
      if (tab.label === '动态参数') {
        this.btnText = '添加参数'
        this.labelText = '参数名称'
        if (this.cateValue.length === 3) {
          this.getApiGetCateClassList()
        }
      } else {
        this.btnText = '添加属性'
        this.labelText = '属性名称'
        if (this.cateValue.length === 3) {
          this.getApiGetCateClassList()
        }
      }
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false
    },
    // 点击按钮跳出弹框
    ShowDialog() {
      if (this.activeName === 'many') {
        this.dialogTitle = '添加动态参数'
        this.dialogLable = '动态参数'
      } else {
        this.dialogTitle = '添加静态属性'
        this.dialogLable = '静态属性'
      }
      this.dialogVisible = true
    },
    // 编辑弹框
    editDialog() {
      if (this.activeName === 'many') {
        this.dialogTitle = '修改动态参数'
        this.dialogLable = '动态参数'
      } else {
        this.dialogTitle = '修改静态属性'
        this.dialogLable = '静态属性'
      }
      this.dialogVisible = true
    },
    // 弹框确定按钮
    async addCategoriesShowTo(val) {
      const { data: res } = await ApiAddCateName(this.$http, this.cateId, {
        data: {
          attr_name: val,
          attr_sel: this.activeName
        }
      })
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      // 关闭弹框
      this.closeDialog()
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
      this.getApiGetCateClassList()
      console.log(res)
    },
    // 编辑确定按钮
    async editCategoriesShowTo(val) {
      console.log(val)
      // 编辑提交数据
      const { data: res } = await ApiPutCategories(
        this.$http,
        this.cateId,
        this.editId,
        {
          data: {
            attr_sel: this.activeName,
            attr_name: val
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
      this.getApiGetCateClassList()
      this.closeDialog()
      console.log(res)
    },
    // 编辑操作
    async editFrom(val) {
      this.editId = val.attr_id
      this.editName = val.attr_name
      // 显示弹框
      this.editDialog()
    },
    // 删除按钮操作
    async deleteFrom(val) {
      console.log(val)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await ApiDeleteCategories(
            this.$http,
            this.cateId,
            val.attr_id
          )
          this.$message({
            type: 'success',
            message: res.meta.msg
          })

          this.getApiGetCateClassList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  computed: {
    // 计算按钮状态
    btnDisable() {
      // 如果没选中三级分类 按钮处于禁用状态
      if (this.cateValue.length !== 3) {
        return true
      }
      return false
    },
    // 计算分类id
    cateId() {
      if (this.cateValue.length === 3) {
        return this.cateValue[2]
      }
      return null
    }
  },
  created() {
    this.getCategories()
  },
  components: {
    breadcrumb,
    paramsBtn,
    paramsTable,
    paramsDialog
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 10px;
}
.colSpan {
  margin-right: 10px;
}
</style>
