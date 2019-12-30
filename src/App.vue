<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="less">
@import "./style/reset.less";
@import "./style/variable.less";
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
</style>
