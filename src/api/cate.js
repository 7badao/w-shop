// 添加商品模块

// 商品分类数据
function ApiGetClassification(axios, {
  params
}) {
  return axios({
    url: 'categories',
    method: 'get',
    params
  })
}
// 添加商品分类
function ApiAddGoodsCate(axios, {
  data
}) {
  return axios({
    url: 'categories',
    method: 'post',
    data
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

// 编辑提交分类
function putCategories(axios, cateId, {
  data
}) {
  return axios({
    url: `categories/${cateId}`,
    method: 'put',
    data
  })
}

// 删除分类
function deleteCategories(axios, cateId) {
  return axios({
    url: `categories/${cateId}`,
    method: 'delete'
  })
}

export {
  ApiGetClassification,
  ApiGetCateClassList,
  putCategories,
  ApiAddGoodsCate,
  deleteCategories
}