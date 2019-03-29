<template>
  <div class="layout">
    <Layout>
      <lh-header></lh-header>
      <Content :style="{padding: '0 10px'}" class="conten-warp">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </Content>
    </Layout>
  </div>
</template>
<script>
  import LhHeader from '@/components/LhHeader'
  export default {
    components: {
      'lh-header': LhHeader
    }
  }
</script>
<style scoped>
  .conten-warp {
    min-height: 420px;
  }
</style>
