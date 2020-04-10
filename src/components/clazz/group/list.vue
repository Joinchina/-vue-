<template>
  <div class="j-group j-clazz">
    <div v-if="groupArray.length !== 0">
      <div class="bread-box" >
        <Goback :passtitle="passtitle"></Goback>
        <div class="add-clazz" >
            <button type="button" class="btn-exp btn-green-line btn-VipExport" @click="groupExport">
            <i class="icon-export-green"></i>
              导出小组
            </button>
        </div>
        <div class="add-clazz-t3" >
          <button type="button" class="btn-blue btn-blue-small" @click="grouprank">
            <i class="xiaozupaihang"></i>
            小组排行
          </button>
        </div>
        <div class="add-clazz-t" >
          <button type="button" class="btn-blue btn-blue-small" @click="groupUngroupMemebers">
            <i class="icon-circle-add"></i>
            未分组学员
          </button>

        </div>
        <div class="add-clazz-t add-clazz-t2">
          <button type="button" class="btn-export" @click="groupcreat = true">
            <i class="icon-circle-add"></i>
            新建小组
          </button>
        </div>
      </div>
         <div class="j-content round-layout" v-loading="loading"
        :element-loading-text='this.$globalParam.loadText'
        :element-loading-spinner='this.$globalParam.loadSpinner'
        :element-loading-background='this.$globalParam.loadBg'>
           <el-row :gutter="24">
             <el-col :span="6" v-for="(item,index) in groupArray" :key="index">
               <div class="grid-content bg-purple" >
                 <el-dropdown @command="groupDelete">
                  <span class="el-dropdown-link">
                     <a href="javascript:void(0)" class="more"></a>
                  </span>
                   <el-dropdown-menu slot="dropdown">
                     <el-dropdown-item :command="{id:item.groupId,indexs:index}">解散小组</el-dropdown-item>
                   </el-dropdown-menu>
                 </el-dropdown>
                 <div style="cursor: pointer" @click="groupDetail(item.groupId)">
                   <span v-if="!!item.logo">
                       <img :src="item.logo" class="logo" alt="">
                   </span>
                   <span v-else>
                       <img src="../../../assets/img/clazz/example3.png" class="logo" alt="">
                   </span>

                   <span class="text">
                     {{item.name}}
                   </span>
                 </div>
                 <p>
                   <span v-if="!!item.leaderName" class="widthmilit">组长：{{item.leaderName }}</span>
                   <span v-else class="widthmilit">组长：未指定</span>
                   <span class="ml32">学员：{{item.memberCount}}人</span>
                 </p>

               </div>
             </el-col>
           </el-row>
         </div>
    </div>
    <!--分组为空页面-->
    <empty v-if="groupArray.length == 0"
           v-show="emptyFlag">

    </empty>
    <!--新建小组-->
    <group-create
      :dialogCreateGroup.sync="groupcreat"
      @dialogSignSuccessData = "sucessData"
    >
    </group-create>
  </div>
</template>
<script>
  import model from 'model/clazz/group'
  import Empty from 'base/empty/group'
  import Goback from 'base/goback/goback'
  import groupCreate from "components/clazz/group/create";
  import { delTip } from '@/global/open'
  import bus from  "@/global/bus"
  import API from '@/global/resource'
  import {getToken} from "@/filters/userVerify"
  export default {
      data(){
        return{
           clazzId:"",
           groupId:"",
           groupArray:[],
           groupcreat:false,
           emptyFlag:false,
           passtitle:'分组管理',
           loading:true,
        }
      },
      created(){
         var _this = this;
        _this.clazzId = _this.$route.query.clazzId;
         bus.$on("GroupCreate",function () {
           _this.getGroupList();
         })
        _this.getGroupList();

      },
      methods:{
        groupExport(){
          if(!this.$store.getters.getOrgVipInfo.vip){
            this.$store.state.vipFuncPopFalg = true;
            return;
          }
          window.open(API.urls.groupexportGroupList+"?clazzId="+this.clazzId+"&token="+getToken());
        },
        getGroupList(){
          var data = {
            clazzId:this.clazzId
          }
          model.groupList(data, ( res => {

             if(res.status == 200){
                 //data 存在
                  if(!!res.data){
                      this.groupArray = res.data;
                       this.loading=false;
                      //展示空页面
                      if(this.groupArray.length == 0){
                        this.emptyFlag = true;
                      }

                      //data undefined
                  }else{
                    this.groupArray = [];
                    this.emptyFlag = true;
                  }



             }else{
               this.$message.error(res.message)
             }


          }))
        },
        groupUngroupMemebers() {
           this.$router.push({ path:"/clazz/group/unmenbers?clazzId="+this.clazzId })
        },
        grouprank(){
           this.$router.push({ path:"/clazz/group/rank?clazzId="+this.clazzId ,query:{clazzaa:this.clazzId}})
        },
        groupDelete(obj) {
          this.groupId = obj.id;
          let str = "解散小组后，小组成员会进入未分组成员，确定要解散吗？";
          delTip(this, str, this.groupDeleteMember, obj.indexs);

        },
        groupDetail(groupId){
          this.$router.push({path:'/clazz/group/detail',query:{clazzId:this.clazzId,groupId:groupId}})
        },
        groupDeleteMember(){
          var _this = this;
          var data = {
            id:this.groupId
          }
          model.groupDelete(data, ( res => {
            if(res.status == 200){
              this.$message({
                type: 'success',
                message: '解散成功',
                duration: 1000,
                onClose() {
                  _this.getGroupList();
                }
              });
            }else{
              this.$message.error(res.message);
            }

          }))
        },
        sucessData(){
          this.getGroupList();
        }
      },
      beforeDestroy(){
        bus.$off("GroupCreate");
       // bus.$off("GroupRandom");
      },
      components:{
        Empty,
        Goback,
        groupCreate
      }
  }
</script>
<style scoped="" lang="less">
  @import "../../../assets/reset-element-ui/form.css";
  @import "../../../assets/less/clazz";
  @import "../../../assets/less/icon.less";
  @import "../../../assets/less/btn-search.less";
  .j-group li{
    border: 1px solid red;
    margin-right: 20px;
    width: 100px;
    height: 100px;
  }
  .j-group{
      .bread-box {
        margin-bottom: 15px;
      }
     .j-content{
       padding:36px 32px 40px 32px;
     }
     .add-clazz{
        i{
          display: inline-block;
          padding-right: 3px;
        }
        button{
          padding:9px 21px 10px 13px;
        }
     }
    .add-clazz-t{
      right: 271px!important;
    }
    .add-clazz-t2{
      right: 418px!important;
    }
    .add-clazz-t3{
      display: inline-block;
    position: absolute;
    top: 0;
    padding: 0;
      right: 140px!important;
    }
    .bg-purple {
      background: #fff;
      box-shadow:-2px 0 2px #e7f5f3, 2px 0 2px #e7f5f3, 0 -2px 2px #e7f5f3, 0 2px 2px #e7f5f3;
      padding-top: 30px;
      padding-left: 15px;
      margin-bottom: 24px;
      color: #333;
      height: 139px;
      position: relative;
       img{
         width: 59px;
         height: 60px;
         border-radius: 3px;
       }
      .text{
        display: inline-block;
        vertical-align: middle;
        width: 68%;
        line-height:26px;
        padding-left:6px;
        font-size: 16px;
        overflow: hidden;
        color: #555;
        font-weight: bold;
        // position: relative;
        /*overflow: hidden;*/
        /*text-overflow:ellipsis;*/
        /*display:-webkit-box;*/
        /*-webkit-box-orient:vertical;*/
        /*-webkit-line-clamp:2;*/
      }
      .more{
        position: absolute;
        right: 0px;
        top: 3px;
        background: url("../../../assets/img/clazz/group-more.png");
        display: inline-block;
        width: 39px;
        height: 21px;
      }
      p{
        padding:15px 0 0 0;
        font-size: 14px;
        color: #666;
        line-height: 20px!important;
      }
      .el-dropdown{
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    .widthmilit{
      width: 140px;
      float: left;
      overflow: hidden;
      white-space:nowrap; 
      text-overflow:ellipsis; 
    }
    .xiaozupaihang{
          display: inline-block;
          width: 18px;
          height: 18px;
          background: url("../../../assets/img/icon/mopai.png") center center no-repeat;
          background-size: 100% 100%;
    }
  }
  .btn-VipExport{
    position: relative;
    &::after{
      position: absolute;
      right: -6px;
      top: -10px;
      width: 27px;
      height: 15px;
      content: "";
      background: url("../../../assets/img/expert/vipLogo.png") center center no-repeat;
      background-size: 27px 14px;
    }
  }
</style>
