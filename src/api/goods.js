// 商品管理模块

// 商品管理列表
function ApiGetGoodsList(axios, {
  params
}) {
  return axios({
    url: 'goods',
    method: 'get',
    params: params
  })
}
// 删除商品
function ApiDeleteGoodsInfo(axios, goodsId) {
  return axios({
    url: `goods/${goodsId}`,
    method: 'delete'
  })
}
// 添加商品
function ApiAddGoods(axios, {
  data
}) {
  return axios({
    url: 'goods',
    method: 'post',
    data
  })
}
export {
  ApiGetGoodsList,
  ApiDeleteGoodsInfo,
  ApiAddGoods
}