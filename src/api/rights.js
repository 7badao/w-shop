// 封装所有与权限相关的请求
function apiGetRights(axios, {
  url
}) {
  return axios({
    url: url
  })
}

export {
  apiGetRights
}