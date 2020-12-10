// 封装所以以用户相关的请求
function apiLogin(axios, {
  data
}) {
  return axios({
    url: '/login',
    method: 'post',
    data: data
  })
}

// 请求用户数据列表
function apiGetUserList(axios, {
  params
}) {
  return axios({
    url: "users",
    method: 'GET',
    params: params
  })
}

// 修改用户状态
function apiSetUserState(axios, {
  url,
  data
}) {
  return axios({
    url: url,
    method: 'PUT',
    data: data
  })
}

// 添加用户
function apiAddUsers(axios, {
  data
}) {
  return axios({
    url: `users`,
    method: 'POST',
    data: data
  })
}

// 查询用户
function apiSearchUsers(axios, {
  url
}) {
  return axios({
    url: url,
    method: 'get'
  })
}

// 编辑用户
function apiEditUserState(axios, {
  url,
  data
}) {
  return axios({
    url: url,
    method: 'PUT',
    data: data
  })
}

// 删除用户
function apiDelUser(axios, {
  url
}) {
  return axios({
    url: url,
    method: 'delete'
  })
}


// 按需导出方法
export {
  apiLogin,
  apiGetUserList,
  apiSetUserState,
  apiAddUsers,
  apiEditUserState,
  apiSearchUsers,
  apiDelUser
}