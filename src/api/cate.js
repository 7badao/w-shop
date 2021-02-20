// 所有分类数据相关的请求

// 请求商品分类数据列表
function apiGetCategoriesList(axios, {
  params
}) {
  return axios({
    url: 'categories',
    method: 'get',
    params: params
  })
}
// 添加分类
function addCategories(axios, {
  data
}) {
  return axios({
    url: 'categories',
    method: 'post',
    data: data
  })
}

export {
  apiGetCategoriesList,
  addCategories
}