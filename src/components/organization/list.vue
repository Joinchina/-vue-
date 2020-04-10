<template>
<div>
  <div class="heardbox">
      <v-head>
          <el-dropdown trigger="click" @command="operaterCommand">
              <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <!-- <slot></slot> -->
              <el-dropdown-menu slot="dropdown"  class="passwordEdit orgDropDown">
                <el-dropdown-item command="myInfo" class="vipInfo">
                  <img src="/static/img/avatar.png" alt="" class="orgImg">
                  <span class="orgText">朱雀鲨鱼</span>
                </el-dropdown-item>
                <el-dropdown-item command="edit">
                  <i class="icon-diamond"></i>VIP会员
                  <span class="toOpen">去申请开通<i class="el-icon-arrow-right rightArrow"></i></span>
                </el-dropdown-item>
                <el-dropdown-item command="accountCenter">
                  <i class="icon-org"></i>机构账户中心
                  <i class="el-icon-arrow-right rightArrow"></i>
                </el-dropdown-item>
                <el-dropdown-item command="edit">
                  <i class="icon-edit-word"></i>修改密码
                  <i class="el-icon-arrow-right rightArrow"></i>
                </el-dropdown-item>
                <el-dropdown-item command="exit">
                  <i class="icon-exit"></i>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
      </v-head>
      <img src="../../assets/img/common/orgfont.png" alt="">
  </div>
  <div id = "">
    <!--org 列表-->

    <!-- <div class="pro_top_bg">
      <span class="pro_words"></span>
    </div> -->
    <el-tabs v-model="activeName"  @tab-click="handleClick" class="item">
      <el-tab-pane label="机构列表" name="orgList">

      </el-tab-pane>
      <el-tab-pane label="项目列表" name="proList" >

      </el-tab-pane>
      <el-tab-pane label="用户管理" name="adminUser" >
      </el-tab-pane>
      <!-- <el-tab-pane label="评价反思" name="reflection" >

      </el-tab-pane>
      <el-tab-pane label="积分系统" name="integrate" >

      </el-tab-pane> -->
      <el-tab-pane label="通用资源" name="resource" >

      </el-tab-pane>

      <el-tab-pane label="通用管理" name="manage" >

      </el-tab-pane>
      <el-tab-pane label="数据统计" name="admindata" v-show="datashow">

      </el-tab-pane>
    </el-tabs>
    <router-view class="wrapper"></router-view>
    <!--list_start-->
    <!--list_end-->


  </div>
</div>  
</template>
<script>
//  import model from 'model/organization/list'
//  import storage from '@/global/storage'
//  import { setIds,limits } from  '@/filters/userVerify'
//  import bus from '@/global/bus'
//  import {cutstr} from '@/global/util'
  import routerActive from "@/global/router-active"
  import storage from '@/global/storage'
import vHead from 'components/header/header';
  import { exitSys } from "../../filters/userVerify"
  export default {
    data() {
      return {
        activeName: 'orgList',
        datashow:false,
      };
    },

    created:function () {

      this.refreshActive();
      this.gitadmin();

      //监听浏览器返回和前进事件
      window.addEventListener("popstate", this.refreshActive.bind(this));
    },
    methods: {

      refreshActive () {
        let reg = /([^\s]+)\?.*/;
        let thisrouter = window.location.hash.replace(reg, "$1");
        if(thisrouter.indexOf("organization") > -1){
          this.activeName =  'orgList';
        }else if(thisrouter.indexOf("adminpro") > -1){
          this.activeName =  'proList';
        }else if(thisrouter.indexOf("adminuser") > -1){
          this.activeName =  'adminUser';
        }else if(thisrouter.indexOf("adminres") > -1){
          this.activeName =  'resource';
        }else if(thisrouter.indexOf("manage") > -1 || thisrouter.indexOf("comtopic") > -1){
          this.activeName =  'manage';
        }else if(thisrouter.indexOf("admindata") > -1){
          this.activeName =  'admindata';
        }else {
          this.activeName =  'app';
        }
      },
      handleClick (tab, event) {
        
        if(tab.name == "proList"){
          // bus.$emit('adminprolist',"1");
          this.$router.push('/adminpro/list');
        }else if(tab.name == "orgList"){
          this.$router.push('/organization/list');
        } else if (tab.name == "adminUser") {
          this.$router.push('/admin/user');

        } else if (tab.name == 'resource') {
          this.$router.push('/adminres/resource');
        }else if (tab.name == 'admindata') {
          this.$router.push('/admindata/admin_data');
        } else{
          this.$router.push('/adminger/manage');
          //this.$router.push('/adminres/resource');
        };        
      },
      // 获取登录权限
      gitadmin(){
        let role = storage.get("exp_role");
        console.log(role)
        if(role=="ADMIN"){
          this.datashow=true;
      
        }
      },

       operaterCommand(command){
          if(command == "edit"){
              this.$router.push({
                      path:"/project/password?type=org"
              })
          }else if(command =="accountCenter"){
            this.$router.push({
              path:"/orgAccount/index"
            })
          }
          if(command == "exit"){
               exitSys();
          }
        }



    },
    components: {
      vHead
   },

  };
</script>
<style scoped lang="less">
  @import "../../assets/reset-element-ui/item.css";
  @import "../../assets/reset-element-ui/form.css";
  @import "../../assets/less/btn-search.less";
  @import "../../assets/reset-element-ui/password.css";
  @import "../../assets/less/icon.less";
  @borderColor: #f0f0f0;
  .heardbox{
    width:100%;
        height: 118px;
        background-image: url('../../assets/img/common/banner_1.png');
        background-repeat: no-repeat;
        background-position: center top;
        background-size:cover;
        img{
          width: 130px;
          display: block;
          margin: 0 auto;
          margin-top: 25px;
        }
  }
  .pro_top_bg{
    background: url("../../assets/img/common/bg-top.png") no-repeat center top;
    width:100%;
    height:149px;
    background-size:100% 100%;
    text-align: center;
    line-height: 149px;
  }
  .pro_words{
    text-align: center;
    background: url("../../assets/img/common/user-mag-text.png") no-repeat center;
    display: inline-block;
    width: 218px;
    height:61px;
    vertical-align: middle;
  }
  .org_list{
    background-color: #fff;
    border: 1px solid @borderColor;
    border-radius: 6px;
    box-shadow: -2px 0 3px #f0f0f0,
    2px 0 3px #f0f0f0,
    0 -2px 3px #f0f0f0,
    0 2px 3px #f0f0f0;
    margin: 0 auto;
    max-width: 1190px;
  }
  .passwordEdit.orgDropDown{
    width: 250px;
    padding-right:10px; 
    .el-dropdown-menu__item{
      color: #333 !important;
      &.vipInfo{
        background: url("../../assets/img/expert/vipLogo.png") center right no-repeat;
        background-size: 36px 18px;
      }
      .rightArrow{
        float: right;
        font-size: 16px;
        margin-right: -20px;
        margin-top: 10px;
        font-weight: bold;
        color:#333;
      }
      .toOpen{
        font-size: 14px;
        color: #4A90E2;
        float: right;
      }
    }
    
    .orgImg{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 6px;
    }
    .orgText{
      font-size: 16px;
      color: #333333;
      vertical-align: middle;
    }
  }
  // .passwordEdit .el-icon-arrow-down:before{
  //     content:"\E60B"!important;
  //     color: #fff;
  //     width: 9px;
  //     height: 7px;
  // }
  // .el-dropdown-menu{
  //   background: rgba(0,0,0,0.5)!important;
  //   border: none;
  // } 
  // .el-popper[x-placement^=bottom] .popper__arrow::after{
  //   border-bottom-color:rgba(0,0,0,0.7)!important;
  //   top: 0px!important;
  // }
</style>
