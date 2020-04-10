<template>
  <div class="wrapper">
    <div id="wuserList">
    <div class="w-content clearfix">
    <div class="pro-menu"  v-if="getCurRole == 'ORGADMIN' || getCurRole == 'ADMIN' || getCurRole == 'PROJECTADMIN'">
      <ul class="menu-list">
        <li v-for="(item,index) in items"   @click="menu(index)" :class="index==0?{'icon-active-f':item.active}:{'icon-active':item.active}">
            <router-link :to ="{ path:item.paths,query:{clazzId:clazzId}}" :class="item.class">{{item.name}}</router-link>
        </li>
      </ul>
    </div>
      <div class="pro-menu"  v-else-if="getCurRole == 'CLAZZMANAGER'">
        <ul class="menu-list" ref="menus">
          <li v-for="(item,index) in itemClazz"  @click="menu(index)" :class="index==0?{'icon-active-f':item.active}:{'icon-active':item.active}">
            <router-link :to ="{ path:item.paths,query:{clazzId:clazzId}}" :class="item.class">{{item.name}}</router-link>
          </li>
        </ul>
      </div>
      <!--专家只能添加学员-->
      <div class="pro-menu"  v-else>
        <ul class="menu-list">
          <li v-for="(item,index) in itemStudent"  @click="menu(index)" :class="index==0?{'icon-active-f':item.active}:{'icon-active':item.active}">
            <router-link :to ="{ path:item.paths,query:{clazzId:clazzId}}" :class="item.class">{{item.name}}</router-link>
          </li>
        </ul>
      </div>

    <router-view  class="w-list"></router-view>
    </div>
  </div>
  </div>
</template>
<script>
  import { getCurRole } from "../../filters/userVerify"
  export default {
      data(){
        return {
           getCurRole:getCurRole(),
           clazzId:"",
           items:[
             {"name":"班主任","class":"icon-man","paths":"/members/master","active":true},
             {"name":"专家","class":"icon-professor","paths":"/members/pfessor","active":false},
             {"name":"学员","class":"wicon-student","paths": '/members/student',"active":false}
           ],
           itemClazz:[
            {"name":"专家","class":"icon-professor","paths":"/members/pfessor","active":true},
            {"name":"学员","class":"wicon-student","paths": '/members/student',"active":false}
          ],
          itemStudent:[
            {"name":"学员","class":"wicon-student","paths":"/members/student","active":true}
          ]
        }
      },
      created(){
         this.clazzId = this.$route.query.clazzId;
        //刷新当前tab状态
        this.refreshActive();
        window.addEventListener("popstate", this.handlePop.bind(this))
      },
     methods:{
       menu(index){
            var _this = this;
            if(_this.getCurRole == 'ORGADMIN' || _this.getCurRole == 'ADMIN' || _this.getCurRole == 'PROJECTADMIN'){
              _this.itemsArraM(_this.items,index);

            }else if(this.getCurRole == "CLAZZMANAGER"){
              _this.itemsArraM(_this.itemClazz,index);

            }else if(this.getCurRole == "STUDENT"){
              _this.itemsArraM(_this.itemStudent,index);

            }else{
              //不执行
            }

       },
        handlePop(){
          let currentPath = window.location.href;
          let menuArr = this.items;
          if(this.getCurRole == 'ORGADMIN' || this.getCurRole == 'ADMIN' || this.getCurRole == 'PROJECTADMIN'){
            menuArr=this.items;

          }else if(this.getCurRole == "CLAZZMANAGER"){
            menuArr=this.itemClazz;

          }else if(this.getCurRole == "STUDENT"){
            menuArr=this.itemStudent;
          }
          
          menuArr.forEach((item,index)=>{
            item.active=this.creatReg(item.paths).test(currentPath)?true:false;
          })
        },

        //返回检测当前path的正则
        creatReg(url){
          return new RegExp(url);
        },
       itemsArraM(itemsArray,indexs){
         itemsArray.forEach(function (item,index) {
           item.active = false;
         })
         itemsArray[indexs]["active"] = true;
       },
       refreshActive(){
          var thisrouter = JSON.stringify(this.$route.path);
          var _this = this;
          this.items.forEach(function (item,index) {
            //alert($(".menu-list")length);
            item.active = false;
            if(thisrouter.indexOf(item.paths) > 0){
                item.active = true;
            }
          })
       }
     }
  }
</script>
<style scoped="" lang="less">
  @img:"../../assets/img/icon";
  @import "../../assets/less/icon.less";
  @import "../../assets/less/btn-search.less";
  @import "../../assets/reset-element-ui/form.css";
  @borderColor: #f0f0f0;
  .w-content{
    width: 100%;
  }
  .pro-menu {
    float: left;
    width: 168px;
    background-color: #37323e;
    border-radius: 10px;
    color: #fff;
    height: auto;
    min-height: 621px;
    height: 621px;
    .menu-list {
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


      li a:hover{
        background-color: #35a69d;
      }
      li a{
        color: #fff;
        text-decoration: none;
      }
      a.icon-org {
        background:url("@{img}/icon-user-2.png") no-repeat 20px center;
        display: inline-block;
        padding-left: 46px;
        height: 60px;
        line-height: 60px;
        width: 100%;
        height: 100%;
      }
      a.icon-pro {
        background:url("@{img}/icon-user-3.png") no-repeat 20px center;
        height: 20px;
        padding-left: 46px;
        display: inline-block;
        height: 60px;
        line-height: 60px;
        width: 100%;
        height: 100%;
      }
      a.icon-man {
        background:url("@{img}/icon-user-1.png") no-repeat 20px center;
        height: 20px;
        padding-left: 46px;
        display: inline-block;
        height: 60px;
        line-height: 60px;
        width: 100%;
        height: 100%;
      }
      a.icon-professor {
        background:url("@{img}/icon-user-5.png") no-repeat 20px center;
        width: 19px;
        padding-left: 46px;
        display: inline-block;
        height: 60px;
        line-height: 60px;
        width: 100%;
        height: 100%;
      }
      a.wicon-student {
        background:url("@{img}/icon-user-4.png") no-repeat 20px center;
        height: 20px;
        width: 15px;
        padding-left: 46px;
        display: inline-block;
        width: 100%;
        height: 100%;
      }
      .icon-active{
        background-color: #35a69d;
      }
      .icon-active-f{
        background: #35a69d;
        border-top-left-radius:10px;
        border-top-right-radius:10px;
      }
    }
  }
  .clazz-list-comp {
     float: left;
     margin-left: 20px;
  }
</style>
