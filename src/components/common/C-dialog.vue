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
      <el-form-item label="省市区/县" prop="attr_name">
        <el-cascader
          v-model="selevtedValue"
          :options="citydata"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="attr_name">
        <el-input v-model="ruleForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="addCategoriesShow">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: [
    'dialogVisible',
    'citydata',
    'dialogTitle',
    'activeName',
    'cateId',
    'editName'
  ],
  data() {
    return {
      ruleForm: {
        attr_name: ''
      },
      selevtedValue: [],
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
    handleChange() {},
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
