<template>
  <el-row :gutter="20">
    <el-col :span="spanNum">
      <el-input v-model="query" clearable placeholder="请输入内容">
        <el-button slot="append" icon="el-icon-search" @click="toSearch"></el-button>
      </el-input>
    </el-col>
    <el-col :span="2" v-if="isShow">
      <el-button type="primary" @click="toRouter">{{right}}</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['spanNum', 'right', 'isShow'],
  data () {
    return {
      query: ''
    }
  },
  methods: {
    toSearch () {
      this.$emit('searchGoods', this.query)
    },
    toRouter () {
      this.$emit('toRouter')
    }
  },
}
</script>

<style>
</style>