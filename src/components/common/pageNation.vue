<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :page-sizes="pageSizeBox"
    :page-size="pageSize"
    background
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  ></el-pagination>
</template>

<script>
export default {
  props: ['total', 'pageSizeBox', 'pageSize'],
  data () {
    return {}
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('changeSize', val)
    },
    handleCurrentChange (val) {
      this.$emit('changSizeNum', val)
    }
  },
}
</script>

<style>
</style>