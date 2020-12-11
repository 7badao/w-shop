// 所有与角色相关的请求


// 角色列表
function apiGetRoles(axios) {
  return axios({
    url: 'roles',
    method: 'get'
  })
}

// 删除角色指定权限
function apiDelRoles(axios, {
  url,
}) {
  return axios({
    url: url,
    method: 'delete'
  })
}

// 角色授权
function apiSetRoles(axios, {
  url,
  data
}) {
  return axios({
    url: url,
    method: 'post',
    data: data
  })
}
export {
  apiGetRoles,
  apiDelRoles,
  apiSetRoles
}