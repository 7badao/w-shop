<template>
  <div>
    <el-table border stripe :data="goodsList" style="width: 100%">
      <el-table-column label="#" type="index" width="60"></el-table-column>
      <el-table-column prop="order_number" label="订单编号"></el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"
        width="100"
      ></el-table-column>
      <el-table-column prop="pay_status" label="是否付款" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status === '0'" type="danger"
            >未付款</el-tag
          >
          <el-tag v-else type="success">已付款</el-tag>
        </template></el-table-column
      >
      <el-table-column
        prop="is_send"
        label="是否发货"
        width="100"
      ></el-table-column>
      <el-table-column label="下单时间" width="180">
        <template slot-scope="scope">{{
          scope.row.update_time | dateFormat
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" @click="editOrder" size="mini">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button
            type="danger"
            @click="deleteClick(scope.row.goods_id)"
            size="mini"
          >
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: ['goodsList'],
  data() {
    return {}
  },
  methods: {
    deleteClick(val) {
      this.$emit('deleteGoods', val)
    },
    editOrder() {
      this.$emit('editOrder')
    }
  }
}
</script>

<style></style>
