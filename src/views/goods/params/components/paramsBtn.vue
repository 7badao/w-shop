<template>
  <el-button type="primary" @click="showDialog" :disabled="btnDisable">{{cateBtn}}</el-button>
</template>

<script>
export default {
  props: ['cateBtn', 'btnDisable'],
  methods: {
    showDialog () {
      this.$emit('showDialog')
    }
  },
}
</script>

<style>
</style>