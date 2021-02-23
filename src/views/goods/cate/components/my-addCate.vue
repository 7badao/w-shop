<template>
  <el-dialog
    title="添加分类"
    :visible.sync="addCateDialog"
    width="60%"
    @close="addCateDialogClose"
    :before-close="handleClose"
  >
    <el-form :model="addFrom" :rules="rules" ref="ruleFormRef" label-width="100px">
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="addFrom.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类">
        <!-- 级联选择器 -->
        <el-cascader
          v-model="cascaderValue"
          :options="addCateList"
          :props="{checkStrictly:'true', value:'cat_id',label:'cat_name',children:'children', expandTrigger: 'hover' }"
          @change="handleChange"
          clearable
        ></el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="addGoodsCate">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { ApiAddGoodsCate, ApiGetClassification } from '@/api/cate'
export default {
  props: ['addCateDialog', 'getCategories'],
  data () {
    return {
      // 级联选中的值
      cascaderValue: [],
      addFrom: {
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 分类层级
        cat_level: 0
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 级联选择器数据
      addCateList: []
    }
  },
  methods: {
    // 添加商品分类数据
    async getAddGoodsCate () {
      const { data: res } = await ApiAddGoodsCate(this.$http, {
        data: this.addFrom
      })
      console.log(res)
      if (res.meta.status !== 201) {
        return this.$message.error('添加分类失败')
      }
      this.$message({
        type: 'success',
        message: res.meta.msg
      })
      // 关闭对话框
      this.handleClose()
      // 请求分类数据
      this.$emit('getCategories')
    },
    // 获取商品分类数据
    async getCateGoodsList () {
      const { data: res } = await ApiGetClassification(this.$http, {
        params: {
          type: 2
        }
      })
      if (res.meta.status === 200) {
        this.addCateList = res.data
      }
    },
    // 对话框关闭事件
    handleClose () {
      this.$emit('addCateClose')
    },
    // 关闭对话框
    addCateDialogClose () {
      // 清空表单操作
      this.$refs.ruleFormRef.resetFields()
      // 清空级联选中的数组
      this.cascaderValue = []
      this.addFrom.cat_pid = 0
      this.addFrom.cat_level = 0
    },
    // 级联选择器选中项
    handleChange () {
      // 判断父级分类是否被选中
      if (this.cascaderValue.length > 0) {
        // 选中 cat_pid选数组最后一项
        this.addFrom.cat_pid = this.cascaderValue[this.cascaderValue.length - 1]
        // 层级
        this.addFrom.cat_level = this.cascaderValue.length
        return
      } else {
        // 如果没选中 id 等级都重置为0
        this.addFrom.cat_pid = 0
        this.addFrom.cat_level = 0
      }
    },
    // 确定按钮
    addGoodsCate () {
      // 表单验证
      this.$refs.ruleFormRef.validate(valid => {
        if (!valid) {
          return false
        }
        this.getAddGoodsCate()
      })
      console.log(this.addFrom);
    }
  },
  created () {
    this.getCateGoodsList()
  },
}
</script>

<style lang="less" scoped>
/deep/.el-form-item__content {
  display: flex;
}
.el-cascader {
  flex: 1;
}
</style>
