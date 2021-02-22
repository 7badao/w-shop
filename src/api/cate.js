// 添加商品模块

// 商品分类数据
function ApiGetClassification(axios) {
  return axios({
    url: 'categories',
    method: 'get'
  })
}
// 分类参数列表
function ApiGetCateClassList(axios, cateID, {
  params
}) {
  return axios({
    url: `categories/${cateID}/attributes`,
    method: 'get',
    params
  })
}

export {
  ApiGetClassification,
  ApiGetCateClassList
}