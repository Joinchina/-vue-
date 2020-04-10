<template>
  <div class="wrapper">
    <div id="wuserList">
        <div class="w-content clearfix">
            <div class="z-pro-menu" >
                <ul class="z-menu-list">
                    <!-- <li>
                        <router-link :to="{path:'/admindata/admin_data/overdata'}"><i><img src="../../assets/img/admindata/aoodata.png" alt=""></i>整体数据</router-link>
                    </li>
                    <li>
                        <router-link :to="{path:'/admindata/admin_data/beforedata'}"><i><img src="../../assets/img/admindata/befordata.png" alt=""></i>训前班级</router-link>
                    </li>
                    <li>
                        <router-link :to="{path:'/admindata/admin_data/centerdata'}"><i><img src="../../assets/img/admindata/centerdata.png" alt=""></i>训中班级</router-link>
                    </li>
                    <li>
                        <router-link :to="{path:'/admindata/admin_data/afterdata'}"><i><img src="../../assets/img/admindata/afterdata.png" alt=""></i>训后班级</router-link>
                    </li>
                    <li>
                        <router-link :to="{path:'/admindata/admin_data/otherdata'}"><i><img src="../../assets/img/admindata/other.png" alt=""></i>其他班级</router-link>
                    </li> -->
                    <li v-for="(item,index) in orgItems" :key="index" :class="{'icon-active':index==currentIndex}">
                        <router-link :to="{path:item.paths}"><i><img :src="item.img" alt=""></i>{{item.name}}</router-link>
                    </li>
                </ul>
            </div>
            <router-view  class="w-list"></router-view>
        </div>
    </div>

  </div>
</template>

<script>
    export default{
        data(){
            return {
              orgItems:[
                  {"name":"整体数据","img":require('../../assets/img/admindata/aoodata.png'),"paths":"/admindata/admin_data/overdata"},
                  {"name":"训前班级","img":require('../../assets/img/admindata/befordata.png'),"paths":"/admindata/admin_data/beforedata"},
                  {"name":"训中班级","img":require('../../assets/img/admindata/centerdata.png'),"paths":"/admindata/admin_data/centerdata"},
                  {"name":"训后班级","img":require('../../assets/img/admindata/afterdata.png'),"paths":"/admindata/admin_data/afterdata"},
                  {"name":"其他数据","img":require('../../assets/img/admindata/other.png'),"paths":"/admindata/admin_data/otherdata"},
              ],
            }
        },
        computed:{
          currentIndex(){
              let thisrouter = JSON.stringify(this.$route.path);
              let indexid;
              this.orgItems.forEach(function (item,index) {                
                  if(thisrouter.indexOf(item.paths) > 0){
                    indexid=index
                  }
              });
              return indexid;     
          }
        },
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/icon.less";
  @import "../../assets/less/btn-search.less";
  @import "../../assets/reset-element-ui/form.css";
  @borderColor: #f0f0f0;

  .w-list{
    background-color:transparent !important;
    padding: 0 !important;
  }

  .w-content{
    width: 100%;
  }
  .z-pro-menu {
    float: left;
    width: 168px;
    background-color: #37323e;
    border-radius: 10px;
    color: #fff;
    height: auto;
    min-height: 621px;
    overflow: hidden;
    .z-menu-list {
      width: 100%;
      li {
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        border-bottom:1px solid #312d37;
        height: 60px;
        line-height: 60px;

      }


      li:hover{
        background-color: #35a69d;
      }
      li a{
        color: #fff;
        width: 100%;
        text-decoration: none;
        text-align: left;
        height: 60px;
        display: block;
           font-size: 18px;
        i{
          img{
            height: 17px;
            width: 18px;
            float: left;
            margin: 21px 10px 0 34px;            
          }
        }
      }

      .icon-active{
        background-color: #35a69d;
      }
    }
  }

</style>

