<template>
  <el-dialog
    @close="closeDialogVisible"
    title="提示"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item prop="attr_name" :label="labelText">
        <el-input v-model="ruleForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="addManyOrOnlyBtn">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['dialogVisible', 'labelText'],
  data () {
    return {
      ruleForm: {
        attr_name: '',
        attr_sel: 'many'
      },
      rules: {
        attr_name: [
          { required: true, message: '此选项不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClose () {
      // this.dialogVisible = false
      this.$emit('closeDialog')
    },
    // 关闭对话框 清空表单验证
    closeDialogVisible () {
      // 清空表单操作
      this.$refs.ruleForm.resetFields()
    },
    // 确定按钮操作
    addManyOrOnlyBtn () {
      this.$emit('addManyOrOnlyBtn', this.ruleForm.attr_sel, this.ruleForm.attr_name)
    }
  },
  watch: {
    // 侦听label值
    labelText (val) {
      console.log(val, 'label');
      if (val === '静态属性') {
        this.ruleForm.attr_sel = 'only'
        console.log(this.attr_sel);
      } else {
        this.ruleForm.attr_sel = 'many'
      }
    }
  }
}
</script>

<style>
</style>