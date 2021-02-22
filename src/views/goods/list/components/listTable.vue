<template>
  <div>
    <el-table border stripe :data="goodsList" style="width: 100%">
      <el-table-column label="#" type="index" width="60"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="180"></el-table-column>
      <el-table-column prop="goods_number" label="商品重量" width="180"></el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button type="danger" @click="deleteClick(scope.row.goods_id)" size="mini">
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { ApiDeleteGoodsInfo } from '@/api/goods'
export default {
  props: ['goodsList'],
  data () {
    return {}
  },
  methods: {
    deleteClick (val) {
      this.$emit('deleteGoods', val)
    }
  }
}
</script>

<style>
</style>
