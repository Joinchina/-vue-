<template>
    <div class="content">
        <Adminnav></Adminnav>
    </div>
</template>
<script>
 import Adminnav from '@/components/admindata/admin_nav.vue'
 export default{
 
 components:{
     Adminnav,
 }
 }   
</script>
<style lang="less" scoped>
.rightbox{
    float: right;
    width: calc(100% - 188px);
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 0 3px #eee;
    padding: 16px 30px 40px;
}
</style>
