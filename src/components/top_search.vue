<template>
  <el-row :gutter="20">
    <el-col :span="spanNum">
      <el-input
        clearable
        :placeholder="placeholderText"
        v-model="searchValue"
        @clear="clearInputQ"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="toSearchQ"
        ></el-button>
      </el-input>
    </el-col>
    <el-col :span="2" v-if="isBtnShow">
      <el-button type="primary" @click="toRouterAdd">{{ btnText }}</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['btnText', 'placeholderText', 'spanNum', 'isBtnShow'],
  data() {
    return {
      searchValue: ''
    }
  },
  methods: {
    toSearchQ() {
      this.$emit('searchQ', this.searchValue)
    },
    clearInputQ() {
      this.$emit('clearInput')
    },
    toRouterAdd() {
      this.$emit('toRouterAddGoods')
    }
  }
}
</script>

<style></style>
