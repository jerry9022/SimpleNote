import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'

import ArticleList from '@/views/article/List'
import ArticleAddOrEdit from '@/views/article/AddOrEdit'
import ArticleDetail from '@/views/article/Detail'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/', name: 'home', component: Home, redirect: '/article/list',
    children: [
      {path: '/article/list', component: ArticleList, name: 'ArticleList'},
      {path: '/article/add', component: ArticleAddOrEdit, name: 'ArticleAdd'},
      {path: '/article/edit/:id', component: ArticleAddOrEdit, name: 'ArticleEdit'},
      {path: '/article/detail/:id', component: ArticleDetail, name: 'ArticleDetail'}
    ]
  }
]

let router = new Router({
  mode: 'history',
  // base: __dirname,
  // scrollBehavior (to, from, savedPosition) {
  //   // 如果你的連結是帶 # 這種
  //   // to.hash 就會有值(值就是連結)
  //   // 例如 #3
  //   console.log('----to.hash----');
  //   console.log(to.hash);
  //   if (to.hash) {
  //     return {
  //       // 這個是透過 to.hash 的值來找到對應的元素
  //       // 照你的 html 來看是不用多加處理這樣就可以了
  //       // 例如你按下 #3 的連結，就會變成 querySelector('#3')，自然會找到 id = 3 的元素
  //       selector: to.hash
  //     }
  //   }
  // },
  routes: constantRouterMap
})

router.beforeEach((to, from, next) => {
  //在此处进行路由拦截处理
  let user = null;
  try {
    user = JSON.parse(window.localStorage.getItem('lhaccess-user'));
  } catch (ex) {
    localStorage.removeItem('lhaccess-user');
  }
  //服务器端session时间是7天，即604800000毫秒，判断是否过期提前点时间
  if (user && user.dt && (Date.now() - user.dt) > 604000000) {
    //过期了
    localStorage.setItem('lhaccess-user', '');
    user = null;
  }

  if (!user) {
    //没有登录的情况只能访问主页
    if (to.path.startsWith('/article/add') || to.path.startsWith('/article/edit')) {
      next({path: '/'})
    } else {
      next()
    }
  }
  else {
    next()
  }
})

export default router
