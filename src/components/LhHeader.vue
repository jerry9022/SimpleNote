<template>
  <Header>
    <Menu mode="horizontal" theme="dark">
      <div class="layout-logo"><a href="/"><img src="../assets/logo.png" style="height: 50px"></a></div>
      <div class="layout-slogen"><a href="/"><span>简单笔记</span></a></div>
      <div class="layout-nav">
        <MenuItem name="1" v-if="currentUser">
          <Icon type="person"></Icon>
          <Dropdown>
            <a href="javascript:void(0)">
              <span>{{currentUser.username}}</span>
              <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem class="dditem">
                <a href="/article/add">
                  <Icon type="ios-navigate"></Icon> 添加文章</a>
              </DropdownItem>
              <DropdownItem class="dditem" divided>
                <a @click="logout"> 退出登录</a>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </MenuItem>
        <MenuItem name="2" v-else>
          <div @click="login">
            <Icon type="log-in"></Icon> 登录
          </div>
        </MenuItem>
      </div>
    </Menu>
    <login :show.sync="show"></login>
  </Header>
</template>
<script>
  import Login from '@/components/Login'
  import {bus} from '../bus.js'
  import API from '@/api/api_user'
  import Glo from '@/glo'

  export default {
    components: {
      'login': Login
    },
    created(){
      bus.$on('goto', (url) => {
        if (url === "/login") {
          localStorage.removeItem('lhaccess-user');
          this.$router.push('/');
        } else {
          this.$router.push(url);
        }
      })
      bus.$on('setUserName', (text) => {
        this.currentUser = text;
      })
    },
    data(){
      return {
        show: false,
        currentUser: null,
      }
    },
    methods: {
      login(){
        this.show = true;
      },
      logout(){
        this.$Spin.show();
        API.logout().then((result) => {
          this.$Spin.hide();
          if (result && result.errcode === 0) {
            Glo.loginState = 2;
            localStorage.setItem('lhaccess-user', '');
            this.currentUser = null
            this.$router.go({path: '/'});
          } else {
            this.$Message.error({content: result.errmsg || '退出登录失败', duration: 2})
          }
        }, (err) => {
          this.$Spin.hide();
          console.log(err);
          this.$Message.error({content: err.toString(), duration: 2})
        }).catch((error) => {
          this.$Spin.hide();
          console.log(error);
          this.$Message.error({content: '请求出现异常', duration: 2})
        });
      }
    },
    mounted(){
      this.$nextTick(function () {
        let user = localStorage.getItem('lhaccess-user');
        if (user) {
          user = JSON.parse(user);
          if (user && user.username) {
            this.currentUser = user
          }
        }
      })
    },
    destroyed: function () {
      //解决多次触发的问题
      bus.$off('setUserName')
    }
  }
</script>
