<template>
    <div>
        <ul class="clearfix">
            <li><router-link :to="{path: '/course/all', query: {clazzId: clazzId}}">全部课程</router-link></li>
            <li><router-link :to="{path: '/course/task', query: {clazzId: clazzId}}">项目任务</router-link></li>
        </ul>
        <select name="" id="">
            <option value="1">课程</option>
            <option value="2">专家</option>
        </select>
        
        <div class="top clearfix">
            <button class="add-clazz" type="button" >
              <i class="icon-circle-add"></i>
              创建课程
            </button>
            <div class="search">
              <input type="text" v-model="keyword" placeholder="班级名" @keyup.13="" /><i class="el-icon-search" @click.stop=""></i>
            </div>
            
          </div>
        <router-view></router-view>
    </div>
</template>
<script>


    export default {
        data () {
            return {
                keyword:"",
                clazzId:""
            }
        },
        created() {
            this.clazzId = this.$route.query.clazzId;
        },
        methods: {

        }
    }
</script>
<style scoped lang="less">
    @import "../../assets/less/btn-search.less";

    ul li{
        float: left;
    }
</style>
