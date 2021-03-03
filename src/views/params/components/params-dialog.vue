<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="50%"
    @close="closeDialogVisible"
    :before-close="handleClose"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <el-form-item
        v-show="
          dialogTitle === '添加动态参数' || dialogTitle === '添加静态属性'
        "
        :label="dialogLable"
        prop="attr_name"
      >
        <el-input v-model="ruleForm.attr_name"></el-input>
      </el-form-item>
      <el-form-item
        v-show="
          dialogTitle === '修改动态参数' || dialogTitle === '修改静态属性'
        "
        :label="dialogLable"
        prop="attr_name"
      >
        <el-input v-model="ruleForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span
      v-show="dialogTitle === '添加动态参数' || dialogTitle === '添加静态属性'"
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="addCategoriesShow">确 定</el-button>
    </span>
    <!-- 编辑确定按钮 -->
    <span
      v-show="dialogTitle === '修改动态参数' || dialogTitle === '修改静态属性'"
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="editCategoriesShow">确 定2</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: [
    'dialogVisible',
    'dialogTitle',
    'dialogLable',
    'activeName',
    'cateId',
    'editName'
  ],
  data() {
    return {
      ruleForm: {
        attr_name: ''
      },
      rules: {
        attr_name: [
          { required: true, message: '此选项不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('closeDialog')
    },
    // 关闭弹框
    closeDialogVisible() {
      // 清空表单
      this.$refs.ruleForm.resetFields()
    },
    addCategoriesShow() {
      // 表单验证
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) {
          return
        }
        this.$emit('addCategoriesShowTo', this.ruleForm.attr_name)
      })
    },
    editCategoriesShow() {
      // 表单验证
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) {
          return
        }
        this.$emit('editCategoriesShowTo', this.ruleForm.attr_name)
      })
    }
  },
  watch: {
    editName(val) {
      this.ruleForm.attr_name = val
    }
  }
}
</script>

<style></style>
