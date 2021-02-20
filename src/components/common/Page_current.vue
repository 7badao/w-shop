<template>
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="pageSizeList"
      :page-size="pageSizeNum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: ['total', 'pageSizeList', 'pageSizeNum', 'currentPageNum'],
  data () {
    return {

    }
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('changeSize', val)
    },
    handleCurrentChange (val) {
      this.$emit('changNum', val)
    }
  },
}
</script>

<style>
</style>