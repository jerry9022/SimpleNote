/**
 * Created by jerry on 2018/3/27.
 */
import axios from 'axios'
import {bus} from '../bus.js'

axios.defaults.withCredentials = true;
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';//配置请求头

//添加一个请求拦截器
// axios.interceptors.request.use(function (config) {
//   console.dir(config);
//   return config;
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// });

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.data && response.data.errcode) {
    if (parseInt(response.data.errcode) === 40001) {
      //未登录
      bus.$emit('goto', '/login')
    } else if (parseInt(response.data.errcode) === 40002) {
      //无权限
      bus.$emit('goto', '/noauth')
    }
  }

  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

// axios.defaults.baseURL = 'http://172.0.0.1:1337';
let base = ''

//通用方法
export const POST = (url, params) => {
  // console.log(url, JSON.stringify(params));
  return axios.post(`${base}${url}`, params).then(res => res.data)
}
export const GET = (url, params) => {
  // console.log(url, JSON.stringify(params));
  return axios.get(`${base}${url}`, {params: params}).then(res => res.data)
}

//返回指定的接口路径
export const RETURNURL = (url) => {
  return `${base}${url}`;
}
