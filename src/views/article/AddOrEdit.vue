<template>
  <div class="article-addoredit-wrapper">
    <div v-if="loading" class="ivu-spin-fullscreen ivu-spin-fullscreen-wrapper">
      <Spin size="large" fix></Spin>
    </div>
    <Row>
      <Col :xs="24" :sm="{ span: 16, offset: 4 }" :md="{ span: 18, offset: 3 }">
      <div class="main-container">
        <Breadcrumb separator="/">
          <BreadcrumbItem to="/">
            <Icon type="ios-home-outline"></Icon> 首页
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Icon type="ios-paper-outline"></Icon> {{id ? '编辑文章' : '添加文章'}}
          </BreadcrumbItem>
        </Breadcrumb>

        <Form ref="formArticle" :model="formArticle" :rules="ruleArticle" :label-width="65">
          <FormItem label="标题" prop="title">
            <Input v-model="formArticle.title" placeholder=""></Input>
          </FormItem>
          <FormItem label="摘要" prop="summary">
            <Input v-model="formArticle.summary" type="textarea" :rows="4" placeholder=""></Input>
          </FormItem>
          <FormItem label="内容" prop="content">
            <quill-editor v-model="formArticle.content"
                          ref="myQuillEditor"
                          :options="editorOption">
            </quill-editor>
          </FormItem>
          <FormItem label="私密">
            <i-switch v-model="formArticle.privacy">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="标签" class="ivu-form-item-required">
            <Input style="max-width: 300px" v-model="tagstr" placeholder="请输入关键词名称，按回车确认"
                   @keydown.enter.stop.native="handleResolveTags($event)">
            <Button slot="append" @click="handleResolveTags">确认</Button>
            </Input>
            <div class="tag-container">
              <template v-for="(item,index) in tagList">
                <Tag color="green" closable @on-close="handleTagClose(index)">{{item}}</Tag>
              </template>
            </div>
          </FormItem>
          <FormItem style="text-align: center;padding-top: 30px;">
            <Button type="primary" size="large" :disabled="btnSubmitDisabled" class="main-btn"
                    @click="handleSubmit('formArticle')"> 提  交


            </Button>
            <Button type="ghost" size="large" class="main-btn" @click="handleBack">返回列表</Button>
          </FormItem>
        </Form>
      </div>
      </Col>
    </Row>
  </div>
</template>
<script>
  import API from '@/api/api_article'
  // require styles
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import {quillEditor} from 'vue-quill-editor'

  export default {
    components: {
      quillEditor
    },
    data(){
      return {
        loading: false,
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['blockquote', 'code-block'],

              [{ 'header': 1 }, { 'header': 2 }],               // custom button values
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
              [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
              [{ 'direction': 'rtl' }],                         // text direction

              [{ 'size': ['small',false,'mm', 'large', 'huge'] }],  // custom dropdown
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'font': [] }],
              [{ 'align': [] }],

              ['clean'],

              ['link', 'image', 'video']
            ]
          },
          placeholder: '这是内容区...',
          theme: 'snow'
        },
        ruleArticle: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '内容不能为空', trigger: 'blur'}
          ],
          summary: [
            {required: true, message: '摘要不能为空', trigger: 'blur'}
          ],
        },
        btnSubmitDisabled: false,
        id: '',
        formArticle: {
          title: '',
          summary: '',
          content: '',
          privacy: false
        },
        tagstr: '',
        tagList: []
      }
    },
    created(){
      let id = this.$route.params.id;
      if (id) {
        this.id = id;
        this.loading = true;
        API.findById(id).then((result) => {
          this.loading = false;
          if (result && result.id) {
            this.formArticle.title = result.title;
            this.formArticle.content = result.content;
            this.formArticle.summary = result.summary;
            this.formArticle.privacy = result.privacy === 1 ? true : false;
            this.tagList = result.tags.split(',');
          } else {
            this.btnSubmitDisabled = true;
            this.$Message.error({content: '获取数据失败', duration: 2})
          }
        }, (err) => {
          this.loading = false;
          this.btnSubmitDisabled = true;
          console.log(err);
          this.$Message.error({content: err.toString(), duration: 2})
        }).catch((error) => {
          this.loading = false;
          this.btnSubmitDisabled = true;
          console.log(error);
          this.$Message.error({content: '请求出现异常', duration: 2})
        });
      }
    },
    methods: {
      handleResolveTags(ev){
        this.tagList.push(this.tagstr);
        this.tagstr = '';
        if (ev) {
          ev.preventDefault();
          ev.stopPropagation();
        }
      },
      handleTagClose(index){
        this.tagList.splice(index, 1);
      },
      handleSubmit(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.tagList.length === 0) {
              return this.$Message.warning({content: '标签不能为空', duration: 2})
            }
            let params = {
              title: this.formArticle.title,
              content: this.formArticle.content,
              summary: this.formArticle.summary,
              privacy: this.formArticle.privacy ? 1 : 0,
              tags: this.tagList.join(',')
            }
            let promiseObj = null;
            if (this.id) {
              promiseObj = API.edit(this.id, params)
            } else {
              promiseObj = API.add(params)
            }
            this.loading = true;
            promiseObj.then((result) => {
              this.loading = false;
              if (result && result.errcode === 0) {
                if (this.id) {
                  this.$Modal.success({
                    title: "系统提示",
                    content: "操作成功！",
                    onOk: () => {
                      this.$router.push({path: '/'});
                    },
                  });
                } else {
                  this.$Modal.confirm({
                    title: '系统提示',
                    content: '操作成功！是否继续?',
                    okText: '继续添加文章',
                    cancelText: '返回列表',
                    onOk: () => {
                      this.resetInitData();
                    },
                    onCancel: () => {
                      this.$router.push({path: '/'});
                    }
                  });
                }
              } else {
                this.$Message.error({content: result.errmsg || '提交失败', duration: 2})
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
        })
      },
      handleBack(){
        this.$router.push({path: '/'});
      },
      resetInitData(){
        this.tagstr = '';
        this.tagList = [];
        this.$refs["formArticle"].resetFields();
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
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
    margin-bottom: 20px;
    padding-left: 20px;
  }
</style>
