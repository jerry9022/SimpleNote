<template>
  <div class="article-detail-wrapper">
    <div v-if="loading" class="ivu-spin-fullscreen ivu-spin-fullscreen-wrapper">
      <Spin size="large" fix></Spin>
    </div>
    <Row>
      <Col :xs="24" :sm="{ span: 16, offset: 4 }" :md="{ span: 18, offset: 3 }">
      <div class="main-container">
        <Breadcrumb separator="/">
          <BreadcrumbItem to="/">
            <Icon type="ios-home-outline"></Icon>
            首页

          </BreadcrumbItem>
          <BreadcrumbItem>
            <Icon type="ios-paper-outline"></Icon>
            文章详情

          </BreadcrumbItem>

          <BreadcrumbItem>
            <Button type="ghost" size="small" style="float: right;margin-right: 10px" @click="handleBack">返回</Button>
            <a v-if="showEdit" :href="'/article/edit/'+id" style="color: lightblue;">
              <Button type="info" size="small" style="float: right;margin-right: 10px">编辑</Button>
            </a>
          </BreadcrumbItem>
        </Breadcrumb>

        <div class="article-content">
          <div class="article-content-row">
            <h2>
              <Icon v-if="privacy" style="margin-left: 5px;" type="ios-unlocked-outline"></Icon>
              {{title}}

            </h2>
          </div>
          <div class="article-content-row tags">
            <template v-for="(item,index) in tagList">
              <Tag>{{item}}</Tag>
            </template>
          </div>
          <div class="article-content-row summary">
            <fieldset>
              <legend>摘要</legend>
              <p>{{summary}}</p>
            </fieldset>
          </div>
          <div class="article-content-row content">
            <div class="ql-container ql-snow content">
              <div class="ql-editor" data-gramm="false" contenteditable="false" data-placeholder=""
                   v-html="content"></div>
            </div>
          </div>
          <div class="article-content-row" style="text-align: right;">
            <span>创建时间：{{created_at}}</span>
          </div>
        </div>
      </div>
      </Col>
    </Row>
  </div>
</template>
<script>
  import API from '@/api/api_article'
  import Glo from '@/glo'
  // require styles
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'


  export default {
    data(){
      return {
        loading: false,
        id: '',
        title: '',
        summary: '',
        content: '',
        privacy: 0,
        created_at: '',
        tags: '',
        tagList: []
      }
    },
    created(){
      let id = this.$route.params.id;
      if (id) {
        this.id = id;
        this.loading = true;
        API.findById(id, {hot: 1}).then((result) => {
          this.loading = false;
          if (result && result.id) {
            this.title = result.title;
            this.content = result.content;
            this.summary = result.summary;
            this.privacy = result.privacy;
            this.tagList = result.tags.split(',');
            this.created_at = result.created_at;
          } else {
            this.$Message.error({content: '没有获取到文章', duration: 2})
          }
        }, (err) => {
          this.loading = false;
          console.log(err);
          this.$Message.error({content: err.toString(), duration: 2})
        }).catch((error) => {
          this.loading = false;
          console.log(error);
          this.$Message.error({content: '请求出现异常', duration: 2})
        });
      }
    },
    computed: {
      showEdit(){
        if (Glo.loginState === 1) {
          return true;
        } else if (Glo.loginState === 2) {
          return false;
        }
        try {
          let user = JSON.parse(window.localStorage.getItem('lhaccess-user'))
          if (user) {
            Glo.loginState = 1;
            return true;
          } else {
            Glo.loginState = 2;
            return false;
          }
        } catch (ex) {
          return false;
        }
      }
    },
    methods: {
      handleBack(){
        this.$router.push({path: '/'});
      }
    }
  }
</script>
<style scoped>
  .main-container {
    background: #ffffff;
    min-height: 420px;
    padding: 10px 20px 20px 0px;
  }

  .ivu-breadcrumb {
    padding-bottom: 10px;
    margin-bottom: 5px;
    padding-left: 20px;
    border-bottom: 1px solid #ddd;
  }

  .article-content-row {
    display: block;
    padding: 10px 15px 0px 15px;
  }

  .article-content-row .content {
    border: 1px solid #eee;
    border-radius: 5px;
  }

  .article-content-row.summary fieldset {
    border: 1px solid #eee;
    border-radius: 5px;
    color: #777;
    font-weight: bold;
  }

  .article-content-row.summary p {
    padding: 5px 10px 10px 10px;
  }
</style>
