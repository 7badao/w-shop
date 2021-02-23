<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :myinfo="rolesBread"></breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意:只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>
      <!-- 级联选择区域 -->
      <el-form ref="cateFromRef" :model="cateFrom" label-width="100px">
        <el-form-item label="选择商品分类:">
          <el-cascader
            v-model="selectedValue"
            :options="categoriesList"
            :props="{value:'cat_id',label:'cat_name',children:'children', expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- tab区域 -->
      <el-tabs v-model="activIndex" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <paramsBtn :btnDisable="btnDisable" :cateBtn="cateBtn" @showDialog="showDialog"></paramsBtn>
          <!-- 表格区域 -->
          <paramsTale
            @deleteCateManyOrOnly="deleteCateManyOrOnly"
            :tableName="tableName"
            :handleName="handleName"
            :manyData="manyData"
          ></paramsTale>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <paramsBtn :btnDisable="btnDisable" :cateBtn="cateBtn" @showDialog="showDialog"></paramsBtn>
          <!-- 表格区域 -->
          <paramsTale
            @deleteCateManyOrOnly="deleteCateManyOrOnly"
            :tableName="tableName"
            :handleName="handleName"
            :manyData="manyData"
          ></paramsTale>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 弹框 -->
    <paramsDialog
      :labelText="labelText"
      :dialogVisible="dialogVisible"
      @closeDialog="closeDialog"
      @addManyOrOnlyBtn="addManyOrOnlyBtn"
    ></paramsDialog>
  </div>
</template>

<script>
// 导入面包屑
import breadcrumb from '@/components/breadcrumb'
import { ApiGetClassification, ApiGetCateClassList, ApiCateIsManyOrOnly, deleteCateManyOrOnly } from '@/api/cate'
import paramsBtn from './components/paramsBtn'
import paramsTale from './components/paramsTale'
import paramsDialog from './components/paramsDialog'
export default {
  components: {
    breadcrumb,
    paramsBtn,
    paramsTale,
    paramsDialog
  },
  data () {
    return {
      rolesBread: {
        a: "商品管理",
        b: "参数列表"
      },
      // tab选中项
      activIndex: 'many',
      cateFrom: {},
      // 级联选择器数据
      selectedValue: [],
      // 所有商品分类数据
      categoriesList: [],
      cateBtn: '添加参数',
      tableName: '参数名称',
      handleName: '操作',
      // 按钮是否处于禁用 默认禁用
      btnDisable: true,
      sel: 'many',
      // 动态数据
      manyData: [],
      // 弹框
      dialogVisible: false,
      // 弹框label内容
      labelText: '动态参数',
      // // 弹框数据
      // ruleForm: {
      //   attr_name: '',
      //   attr_sel: 'many'
      // }
    }
  },
  methods: {
    // 级联选择器触发
    async  handleChange () {
      // 判断是不是选中三级分类 根据级联选择器选中的数据长度是不是为3
      if (this.selectedValue.length !== 3) {
        return this.selectedValue = []
      }
      // 选中了三级分类的数据 按钮关闭禁用状态
      this.btnDisable = false
      // 选中项 发生变换化 发起分类参数列表请求
      this.getCateClassList()
      // 选中三级分类
      console.log(this.selectedValue);
    },
    // 商品分类数据
    async getCateClassList () {
      const { data: res } = await ApiGetCateClassList(this.$http, this.cateId, {
        params: {
          sel: this.sel
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      console.log(res, '分类数据');
      // 判断activIndex 添加数据
      if (this.activIndex === 'many') {
        // 动态数据
        this.manyData = res.data
      } else {
        // 静态数据
        this.manyData = res.data
      }
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
    },
    // 获取商品分类数据
    async getCategories () {
      const { data: res } = await ApiGetClassification(this.$http, {
        params: ''
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      console.log(res)
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
      this.categoriesList = res.data
    },
    // tab切换
    handleClick (tab) {
      if (tab.label === '静态属性') {
        // 静态属性控制子组件
        this.cateBtn = '添加属性'
        this.tableName = '属性名称'
        this.sel = 'only'
        this.labelText = '静态属性'
        this.handleChange()
      } else {
        this.cateBtn = '添加参数'
        this.tableName = '参数名称'
        this.sel = 'many'
        this.labelText = '动态参数'
        this.handleChange()
      }
    },
    // 开启弹框操作
    showDialog () {
      this.dialogVisible = true
    },
    // 关闭弹框
    closeDialog () {
      this.dialogVisible = false
    },
    // //添加确定按钮
    async addManyOrOnlyBtn (val, text) {
      const { data: res } = await ApiCateIsManyOrOnly(this.$http, this.cateId, {
        data: {
          attr_name: text,
          attr_sel: val
        }
      })
      if (res.meta.status !== 201) {
        return this.$message.error('创建失败')
      }
      // 关闭弹框
      this.dialogVisible = false
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
      // 重新请求数据
      this.handleChange()
    },
    // 删除操作
    deleteCateManyOrOnly (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await deleteCateManyOrOnly(this.$http, this.cateId, id)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message({
          message: res.meta.msg,
          type: 'success'
        })
        // 请求数据
        this.handleChange()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  computed: {
    // 计算分类id
    cateId () {
      // 根据级联选择器选中的数据 是否长度为3
      if (this.selectedValue.length === 3) {
        // 选中了 取数组的最后一项
        return this.selectedValue[2]
      }
      // 没选中 直接返回null
      return null
    }
  },
  created () {
    this.getCategories()
  }
}
</script>

<style lang="less" scoped>
/deep/.el-form-item__label {
  text-align: start;
}
.el-form {
  margin-top: 15px;
}
</style>
