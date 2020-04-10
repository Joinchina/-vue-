<template>
  <div id="evaluation">
      <ul>
        <li>
            <router-link to = "/evaluation/evalist">评价管理</router-link>
        </li>
        <li>
            <router-link to = "/evaluation/reflist">反思管理</router-link>
        </li>
        <div style="clear:both"></div>
      </ul>
      <router-view></router-view>
  </div>
</template>
<script>
  export default {

  }
</script>
<style scoped="">
#evaluation li{
  float:left;
  width: 100px;
  background: #ccc;
}
</style>
