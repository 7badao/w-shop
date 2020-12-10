// 请求菜单
function getMenus(axios) {
  return axios({
    url: '/menus',
    method: 'GET'
  })
}
export {
  getMenus
}