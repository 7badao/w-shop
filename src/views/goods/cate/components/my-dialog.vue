<template>
  <el-dialog
    :title="titleDialog"
    :visible.sync="dialogVisible"
    width="60%"
    :before-close="handleClose"
  >
    <el-form>
      <el-form-item label-width="80px" label="分类名称">
        <el-input v-model="sonName"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSure">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['dialogVisible', 'titleDialog', 'cateName'],
  data () {
    return {
      sonName: ''
    }
  },
  methods: {
    handleClose () {
      this.$emit('dialogClose')
    },
    handleSure () {
      this.$emit('sureBtn', this.sonName)
    }
  },
  watch: {
    // 侦听父组件传过来的值 cateName
    cateName (val) {
      this.sonName = val
    }
  }
}
</script>

<style>
</style>