/**
 * Created by jerry on 2018/3/27.
 * 用户api
 */
import * as API from './api_base'

export default {
  //登录
  login: params => {
    return API.POST('/api/user/login', params)
  },
  //登出
  logout: params => {
    return API.GET('/api/user/logout', params)
  },
  profile: () => {
    return API.GET('/api/user/profile')
  },
  changepwd: params => {
    return API.POST('/api/user/changepwd', params)
  }
}
