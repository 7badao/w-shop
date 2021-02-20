// 商品管理内容的请求

// 商品列表数据
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
function ApiDeleteGoods(axios, goodsId) {
  return axios({
    url: `goods/${goodsId}`,
    method: 'delete'
  })
}

// 分类参数列表
function ApiGtAttributes(axios, goodsId, {
  params
}) {
  return axios({
    url: `categories/${goodsId}/attributes`,
    method: 'get',
    params: params
  })
}
// 添加商品
function ApiAddGoods(axios, {
  data
}) {
  return axios({
    url: 'goods',
    method: 'post',
    data: data
  })
}
export {
  ApiGetGoodsList,
  ApiDeleteGoods,
  ApiGtAttributes,
  ApiAddGoods
}