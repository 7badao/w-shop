  <template>
  <el-table border stripe :data="goodsList" style="width: 100%">
    <el-table-column type="index" label="#" width="60"></el-table-column>
    <el-table-column prop="goods_name" label="商品名称"></el-table-column>
    <el-table-column prop="goods_price" label="商品价格(元)" width="120"></el-table-column>
    <el-table-column prop="goods_weight" label="商品重量" width="90"></el-table-column>
    <el-table-column label="创建时间" width="180">
      <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
    </el-table-column>
    <el-table-column prop="address" label="操作" width="180">
      <template slot-scope="scope">
        <el-button type="primary" size="mini">
          <i class="el-icon-edit"></i>
        </el-button>
        <el-button type="danger" size="mini" @click="deleteGoods(scope.row.goods_id)">
          <i class="el-icon-delete"></i>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ['goodsList', 'dateFormat'],
  data () {
    return {}
  },
  methods: {
    deleteGoods (goods_id) {
      this.$emit('deleGoods', goods_id)
    }
  },
}
</script>

<style>
</style>