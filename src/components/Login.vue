<template>
  <Modal class="login-modal" v-model="dialogVisible" width="360" :mask-closable="false">
    <Form ref="formUser" :model="formUser" :rules="ruleUser" :label-width="0" class="login-box">
      <FormItem label="" prop="username">
        <Input type="text" ref="inputUserName" v-model="formUser.username" size='large' icon="ivu-icon ivu-icon-person"
               placeholder="账号"></Input>
      </FormItem>
      <FormItem label="" prop="passwd">
        <Input type="password" v-model="formUser.passwd" size='large' icon="ivu-icon ivu-icon-key"
               placeholder="密码" @keydown.enter.stop.native="handleSubmit('formUser')"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="ghost" size="large" @click="handleCancel()" class="main-btn"> 取 消</Button>
      <Button type="primary" size="large" @click="handleSubmit('formUser')" class="main-btn"> 登 录</Button>
    </div>
  </Modal>
</template>
<script>
  import {bus} from '../bus.js'
  import API from '@/api/api_user'
  import Glo from '@/glo'

  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        dialogVisible: this.show,
        formUser: {
          username: '',
          passwd: '',
        },
        ruleUser: {
          username: [{
            required: true, message: '请输入用户名', trigger: 'blur'
          }],
          passwd: [{
            required: true, message: '请输入密码', trigger: 'blur'
          }],
        }
      }
    },
    watch: {
      show: function (val) {
        this.dialogVisible = val
      },
      dialogVisible(val){
        if (!val) {
          this.$refs["formUser"].resetFields();
          this.$emit('update:show', false)
        } else {
          this.$nextTick(function () {
            this.$refs['inputUserName'].focus()
          })
        }
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Spin.show();
            let params = {
              username: this.formUser.username,
              passwd: this.formUser.passwd
            };
            API.login(params).then((result) => {
              this.$Spin.hide();
              if (result && result.id) {
                Glo.loginState = 1;
                result.dt = Date.now();
                localStorage.setItem('lhaccess-user', JSON.stringify(result));
                this.dialogVisible = false
                bus.$emit('setUserName', result)
                this.$Message.success('登录成功!');
                this.$router.go('/'); //用go刷新
              } else {
                this.$Message.error({content: result.errmsg || '登录失败', duration: 2})
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
        })
      },
      handleCancel(){
        this.dialogVisible = false
      }
    }
  }
</script>
<style>
  .login-modal .ivu-input-large {
    font-size: 16px;
    padding: 6px 10px;
    height: 46px;
  }

  .login-modal .ivu-input-wrapper-large .ivu-input-icon {
    font-size: 18px;
    height: 46px;
    line-height: 46px;
  }

  .login-modal .ivu-modal-footer {
    text-align: center;
    border-top: 0px;
    padding: 0px 18px 35px 18px;
  }

  .login-modal .login-box {
    display: block;
    padding: 45px 20px 10px 20px;
  }
</style>
