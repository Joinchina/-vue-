<template>
  <div id="app">
    <router-view/>
    <vipFuncPrompt :vipFuncPrompt.sync = "this.$store.getters.vipFuncPop"></vipFuncPrompt>
  </div>
</template>
<style lang="less" scoped>
@import "../static/css/main.css";
// @import "./assets/fonts/style.css";
</style>
