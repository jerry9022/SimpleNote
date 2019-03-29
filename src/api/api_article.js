/**
 * Created by jerry on 2018/3/27.
 * 文章
 */
import * as API from './api_base'

export default {
  //登录
  findList: params => {
    return API.GET('/api/article/findlist', params);
  },
  //根据id或
  findById: (id, params) => {
    return API.GET(`/api/article/find/${id}`, params);
  },
  //添加
  add: params => {
    return API.POST('/api/article/add', params);
  },
  //修改
  edit: (id, params) => {
    return API.POST(`/api/article/edit/${id}`, params);
  }
}
