<template>
  <div class="article-list-wrapper">
    <div v-if="loading" class="ivu-spin-fullscreen ivu-spin-fullscreen-wrapper">
      <Spin size="large" fix></Spin>
    </div>
    <Row>
      <Col :xs="24" :md="{ span: 12, offset: 6 }">
      <div class="search-container">
        <Input v-model="key"
               size="large"
               placeholder="输入关键字查询"
               @keydown.enter.stop.native="handleSearch($event)"
               @on-click="handleSearch($event)"
               icon="ios-search"
               style="width: 100%;min-width: 220px;max-width: 520px;text-align: left;">
        </Input>
      </div>
      </Col>
    </Row>
    <Row>
      <Col :xs="24" :sm="{ span: 16, offset: 4 }" :md="{ span: 18, offset: 3 }">
      <div class="main-container">
        <Page :total="total" :current="page" size="small" @on-change="handleCurrentChange" show-total
              class="top-pager"></Page>
        <ul>
          <li v-for="(item,index) in dataList">
            <div class="data-card">
              <div class="item left" v-if="showEdit" @click="handleEdit(item.id)">
                <Icon type="document-text" :size="26"></Icon>
              </div>
              <div class="item left-plus" v-else></div>
              <div class="item center" @click="handleDetail(item.id)">
                <h2><Icon v-if="item.privacy" style="margin-right: 5px;" type="ios-unlocked-outline"></Icon>{{item.title}}</h2>
                <p slot="content" class="summary">{{item.summary}}</p>
              </div>
              <div class="item right" @click="handleDetail(item.id)">
                <Icon type="chevron-right"></Icon>
              </div>
            </div>
          </li>
          <li class="empty-data" v-if="dataList.length===0">
            <p style="padding: 50px 0px;">暂无数据</p>
          </li>
        </ul>
        <Page :total="total" :current="page" size="small" @on-change="handleCurrentChange" show-total
              class="foot-pager"></Page>
      </div>
      </Col>
    </Row>
  </div>
</template>
<script>
  import API from '@/api/api_article'
  import Glo from '@/glo'

  export default {
    data(){
      return {
        loading: false,
        key: '',
        total: 0,
        page: 1,
        dataList: []
      }
    },
    methods: {
      handleSearch(ev){
        if (this.loading) return;
        this.total = 0;
        this.page = 1;
        this.search();
        if (ev) {
          ev.preventDefault();
          ev.stopPropagation();
        }
      },
      //分页点击事件
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      search(){
        let params = {
          key: this.key,
          page: this.page
        }
        this.loading = true;
        API.findList(params).then((result) => {
          this.loading = false;
          if (result && result.items) {
            this.total = result.total;
            this.dataList = result.items

            //有数据的话，保存查询条件
            Glo.searchCond = {
              key: this.key,
              total: this.total,
              page: this.page,
              dataList: this.dataList
            }
          } else {
            this.$Message.error({content: result.errmsg || '获取数据失败', duration: 2})
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
      },
      handleEdit(id){
        this.$router.push({path: '/article/edit/' + id});
      },
      handleDetail(id){
        this.$router.push({path: '/article/detail/' + id});
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
    mounted(){
      if (Glo.searchCond && Glo.searchCond.dataList) {
        this.key = Glo.searchCond.key;
        this.total = Glo.searchCond.total;
        this.page = Glo.searchCond.page;
        this.dataList = Glo.searchCond.dataList;
      }
      else {
        this.handleSearch();
      }
    }
  }
</script>
<style scoped>
  .article-list-wrapper {
    margin-bottom: 50px;
  }

  .search-container {
    padding-top: 20px;
    text-align: center;
  }

  .main-container {
    margin-top: 20px;
    width: 100%;
  }

  .main-container {
    border: 1px solid #f3f3f3;
  }

  .main-container ul {
    list-style: none;
    margin: 0px;
    text-align: left;
  }

  .main-container ul.top-pager {
    text-align: right;
    padding-top: 5px;
    padding-bottom: 5px;
    background: #ffffff;
    border-bottom: 1px solid #f3f3f3;
  }

  .main-container ul.foot-pager {
    padding-top: 5px;
    padding-bottom: 5px;
    text-align: right;
    background: #ffffff;
    border-top: 1px solid #f3f3f3;
  }

  .main-container ul li {
    background: #fff;
  }

  .main-container ul li + li {
    border-top: 1px solid #f3f3f3;
  }

  .data-card {
    padding: 10px 0px 10px 0px;
    width: 100%;
    display: flex;
    color: #777;
  }

  .data-card .center {
    flex: 1;
  }

  .data-card .item:hover {
    cursor: pointer;
  }

  .data-card .center .summary {
    padding-top: 3px;
    font-size: 14px;
  }

  .data-card .left, .data-card .right {
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .data-card .left-plus {
    width: 20px;
  }

  .data-card .left i {
    color: lightblue;
  }

  .data-card .right i {
    color: #bbb;
  }

  .empty-data {
    text-align: center;
    font-size: 16px;
    color: #777;
    padding: 20px auto;
  }
</style>
