<template>
  <el-table :data="manyData" border stripe style="width: 100%">
    <el-table-column type="expand"></el-table-column>
    <el-table-column type="index" label="#"></el-table-column>
    <el-table-column prop="attr_name" :label="tableName"></el-table-column>
    <el-table-column :label="handleName">
      <template slot-scope="scope">
        <el-button type="primary" size="mini">
          <i class="el-icon-edit">编辑</i>
        </el-button>
        <el-button type="danger" @click="deleteClick(scope.row.attr_id)" size="mini">
          <i class="el-icon-delete">删除</i>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

  <script>
export default {
  props: ['handleName', 'tableName', 'manyData'],
  data () {
    return {

    }
  },
  methods: {
    // 删除操作
    deleteClick (id) {
      this.$emit('deleteCateManyOrOnly', id)
    }
  },
}
  </script>

<style>
</style>
