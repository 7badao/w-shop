<template>
  <el-button type="primary" @click="toShowDialog" :disabled="btnDisable">{{
    btnText
  }}</el-button>
</template>

<script>
export default {
  props: ['btnText', 'btnDisable'],
  methods: {
    toShowDialog() {
      this.$emit('toShowDialog')
    }
  }
}
</script>

<style></style>
