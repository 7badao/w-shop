<template>
  <el-table :data="tableData" border stripe style="width: 100%">
    <el-table-column type="expand"></el-table-column>
    <el-table-column label="#" type="index" width="60"></el-table-column>
    <el-table-column prop="attr_name" :label="labelText"> </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button @click="editFrom(scope.row)" type="primary" size="mini"
          ><i class="el-icon-edit"></i>编辑</el-button
        >
        <el-button type="danger" @click="deleteFrom(scope.row)" size="mini"
          ><i class="el-icon-delete"></i>删除</el-button
        ></template
      >
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ['tableData', 'labelText'],
  methods: {
    editFrom(i) {
      this.$emit('editFrom', i)
    },
    deleteFrom(i) {
      this.$emit('deleteFrom', i)
    }
  }
}
</script>

<style></style>
