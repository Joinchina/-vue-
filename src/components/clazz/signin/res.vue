<template>
  <div class="j-clazz">
    <!--header_start-面包屑-->
    <div class="bread-box" >
    <Goback :passtitle="passtitle"></Goback>
      <div v-if="!emptyFlag">
        <div class="add-clazz-import">
            <el-dropdown  placement="bottom-start" trigger="click" @command="handleCommand">
            <button type="button" class="btn-exp btn-green-line btn-pad">
              <i class="icon-export-green"></i>
              导出
            </button>
            <el-dropdown-menu class="down" slot="dropdown">
              <el-dropdown-item command="details"><img src="../../../assets/img/expert/vipLogo.png" class="vipExportLogo">导出明细</el-dropdown-item>
              <el-dropdown-item command="report"><img src="../../../assets/img/expert/vipLogo.png" class="vipExportLogo">导出报表</el-dropdown-item>
              <el-dropdown-item command="qrcode">导出签到二维码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="add-clazz">
          <button type="button" class="btn-export"  @click="importSignF = true">
              <i class="icon-import"></i>
              导入
            </button>
        </div>
        <div class="add-clazz-t">
          <button type="button" class="btn-blue btn-blue-small" @click="signCreate = true">
            <i class="icon-circle-add"></i>
            创建签到
          </button>
        </div>
      </div>
      <!--content_start-->
      <div class="round-layout" v-if="!emptyFlag" v-loading="loading"
        :element-loading-text='this.$globalParam.loadText'
        :element-loading-spinner='this.$globalParam.loadSpinner'
        :element-loading-background='this.$globalParam.loadBg'>
        <!--title-->
        <h3  v-if="!!signData.signTotal">已创建签到：{{signTotal}}</h3>
        <h4 v-if="!!signData.inprogress"><span>进行中的签到</span></h4>
        <div class="j-title clearfix" v-if="!!signData.inprogress">

          <div class="j-left">
            <ul class="clearfix">
              <li>
                <div class="clazz-sign-circle">
                  <img src="../../../assets/img/clazz/clazz-sign-circle.png"/>
                  <span class="signCont-already">{{signData.inprogress.finishCount }}</span>
                  <span class="signCont-no">{{signData.inprogress.totalCount }}</span>
                </div>
                <p class="sign">签到人数</p>
              </li>
              <li>
                 <div class="time time-20">{{signData.inprogress.signDate }}</div>
                 <div class="fzb size16">（{{signData.inprogress.signType | filterSignType}}）<span class="ongo ml14">{{signData.inprogress.taskStatus | filterTaskStatus}}</span></div>
              </li>
              <li class="time">
                <span>签到时间：{{signData.inprogress.beginTime}}</span>&nbsp;<span class="gray">---</span>&nbsp;{{signData.inprogress.endTime}}<span></span>
              </li>
            </ul>
          </div>
          <div class="j-rg">
           <!--  <a v-if="signData.inprogress.taskStatus == 'inprogress'" :href="'/static/page/screen.html?signId=' + signData.inprogress.id+'&signKey='+signData.inprogress.id+'_'+getTimeStamp+'&clazzId='+clazzId+'&token='+getTokenData+'&signType='+signData.inprogress.signType"
               class="btn-screen" target="_blank"></a> -->
               <router-link 
                  v-if="signData.inprogress.taskStatus == 'inprogress'"
                  class="btn-screen"
                  target="_blank"
                  :to="{ path:'/clazz/signin/screen',
                         query:{signId:signData.inprogress.id,
                         signKey:signData.inprogress.id+'_'+getTimeStamp} 
                       }">
                  
                </router-link>

              <p>
                <!--<router-link :to="{path:'/clazz/signin/detail',query:{clazzId:clazzId}}" class="blue">-->
                  <a href="javascript:void(0)"  @click="signDtail(signData.inprogress.id)" class="blue"><span class="icon-describe"></span>&nbsp;查看详情</a>
                <!--</router-link>-->
                <span class="icon-qrcode ml18" @click="qrcodeCheck(signData.inprogress.id)" style="cursor:pointer;"></span>

                <!--更多-->
                <el-dropdown class="more ml18" trigger="click" placement="bottom-start">
                    <span class="el-dropdown-link">
                      <span class="blue">更多</span>
                      <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu class="more-menu" slot="dropdown">
                      <el-dropdown-item @click.native = "setTimeM(signData.inprogress.id,signData.inprogress.signDate,signData.inprogress.beginTime,signData.inprogress.endTime)">
                        <i class="icon-edit3"></i>     
                        时间设置
                      </el-dropdown-item>
                      <el-dropdown-item v-if="signData.inprogress.operationStatus" @click.stop.native="deleteConfirm(signData.inprogress.id,'progress',signData.inprogress)" style="cursor: pointer">
                        <i class="el-icon-delete2" ></i>
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
              </p>
          </div>
        </div>

        <!--content-->
         <h4 v-if="!!signData.noInprogress"><span>其他签到</span></h4>
        <div class="j-other-sign" v-if="!!signData.noInprogress">
          <!--box-->
          <div class="round-layout j-mb24 green-shadow" v-for="(item,index) in signData.noInprogress" :key="index">
            <div class="j-box clearfix">
               <span class="j-box-icon"></span>
               <div class="left j-left">
                  <h2>{{item.signDate}}<span class="nostart ml14">{{item.taskStatus | filterTaskStatus}}</span></h2>
                 <p>签到时间：{{item.beginTime}} - {{item.endTime}} <span class="ml32">签到人数：<span class="orange">{{item.finishCount }}/</span>{{item.totalCount }}<span class="ml14">({{item.signType | filterSignType}})</span></span></p>
               </div>
               <div class="j-rg">
                 <a href="javascript:void(0)" class="btn-screen"></a>
                 <p>
                   <!--<router-link :to="{path:'/clazz/signin/detail',query:{clazzId:clazzId}}" class="blue">-->
                     <a href="javascript:void(0)" @click="signDtail(item.id)" class="blue">
                       <span class="icon-describe"></span>
                       &nbsp;查看详情
                     </a>
                   <!--</router-link>-->
                   <span class="icon-qrcode ml18" @click="qrcodeCheck(item.id)" style="cursor:pointer;"></span>
                    
                  <!--更多-->
                  <el-dropdown class="more ml18" trigger="click" placement="bottom-start" v-if="item.operationStatus">
                    <span class="el-dropdown-link">
                      <span class="blue">更多</span>
                      <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu class="more-menu" slot="dropdown">
                      <el-dropdown-item @click.native = "setTimeM(item.id,item.signDate,item.beginTime,item.endTime,item.taskStatus)">
                        <i class="icon-edit3"></i>     
                        {{item.taskStatus =="waiting" ? "修改" : "时间设置"}}
                      </el-dropdown-item>
                      <el-dropdown-item @click.stop.native="deleteConfirm(item.id,index,item)" style="cursor: pointer">
                        <i class="el-icon-delete2"></i>
                          删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                 </p>
               </div>
            </div>
          </div>
          <!--box-->
        </div>

      </div>



    </div>
    <!--创建签到-->
    <sign-create
      :dialogSignCreate.sync="signCreate" @dialogSignSuccessData = "sucessData">
    </sign-create>
    <!--查看二维码-->
    <qr-code
      :dialogQrcodeSign.sync="qrCodeSign"
      :signId="signId"
    ></qr-code>
    <!-- 没有签到 -->
    <empty v-show="emptyFlag"
           :tip="tip"
           :clazzId = "clazzId"
           :btntext="btntext"
           @add="signCreate = true"
    ></empty>

    <!--导入签到-->
    <import-sign
      :clazzId = "clazzId"
      :dialogImportSign.sync= "importSignF"
      @updateImportSign = "getSignList"
    >
      
    </import-sign>

    <!--时间设置-->
    <time-set

        :dialogSetTime.sync= "setTime"
        :signDate = "setSignDate"
        :beginTime = "setBeginTime"
        :endTime = "setEndTime"
        :sSignId = "signId"
        :taskStatus = "taskStatus"
        @updateEndSign = "getSignList"
    > 
    </time-set>
  </div>
</template>
<script>
 import Goback from 'base/goback/goback'
  import signCreate from 'components/clazz/signin/create';
  import model from 'model/clazz/signin'
  import API from '@/global/resource'
  import {getToken} from "@/filters/userVerify"
  import { delTip,delTipCustom } from '@/global/open'
  import qrCode from 'components/clazz/signin/qrcode'
  import bus from  "@/global/bus"
  import Empty from 'base/empty/sign'
  import { getCurRole } from "@/filters/userVerify"

  import importSign from 'components/clazz/signin/import'

  import timeSet from 'components/clazz/signin/timeset'

  export default {
    data(){
      return{
        getRole:getCurRole(),
        getTokenData:getToken(),
        getTimeStamp:"",
        emptyFlag:false,
        qrCodeSign:false,
        signCreate:false,
        importSignF:false,

        setTime:false,
        setSignDate:"",
        setBeginTime:"",
        setEndTime:"",
        taskStatus:"",
        signTotal:0,
        clazzId:"",
        signId:"",
        signData:[],
        tip: '',
        btntext: '',
        passtitle:'签到管理',
        loading:true,
      }
    },
    created(){
      var _this = this;
      _this.clazzId = this.$route.query.clazzId;
      _this.getSignList();

      bus.$on("dialogSignSuccess",function () {
        _this.getSignList();
      })

      bus.$on("dialogSignSuccessimport",function () {
        _this.getSignList();
      })

      _this.permissionEmpty();
      
      //获取时间戳
      _this.getTimeStamp = new Date().getTime();
    },
    beforeDestroy(){
        bus.$off("dialogSignSuccess");
    },
    methods:{
      //signScreen(signId){
        // const {href} = this.$router.resolve({
        //     path: '/clazz/signin/screen',
        //     query: {
        //       clazzId: this.clazzId,
        //       signId:signId
        //     }
        // });
        // window.open(href, '_blank');

        // this.$router.push({
        //   path:"/clazz/signin/screen",
        //   query:{
        //     clazzId:this.clazzId
        //   }
        // })
      //},
      sucessData(){
        this.getSignList();
      },
      permissionEmpty(){
        if(getCurRole() == "ADMIN" || getCurRole() == "ORGADMIN" || getCurRole() == "PROJECTADMIN" || getCurRole() == "CLAZZMANAGER") {
          this.tip = "还没有签到，创建签到吧";
          this.btntext = "创建签到";
        }
      },
      // 导出明细
      handleCommand(command) {

        if(command === 'details') {
          if(!this.$store.getters.getOrgVipInfo.vip){
            this.$store.state.vipFuncPopFalg = true;
            return;
          }
          window.open(API.urls.exportSigndetail+"?clazzId="+this.clazzId+"&token="+getToken());
        }

        //导出报表
        if(command === 'report') {
          if(!this.$store.getters.getOrgVipInfo.vip){
            this.$store.state.vipFuncPopFalg = true;
            return;
          }
          window.open(API.urls.exportSignExcel+"?clazzId="+this.clazzId+"&token="+getToken());
        }

        //导出二维码
        if(command == "qrcode"){

          let str;
          const h = this.$createElement;
          str = h('p', null, [
              h('span', null, '总共' + this.signTotal +'个签到,会导出'+this.signTotal+'个签到二维码照片，确定导出吗？')
          ])
          delTipCustom(this, str, this.qrcodeExport, 'qrCode');
        }

      },

      qrcodeExport(){

        window.open(API.urls.signQrcodeExport + "?clazzId="+this.clazzId + "&token=" + getToken());

      },

      getSignList(){

        var data = {
          clazzId:this.clazzId
        }
        model.signList(data, (res => {
          if(res.status == 200) {

              this.signData = res.data;
              this.loading=false;
              if(!!res.data.signTotal){
                this.signTotal = res.data.signTotal;
                this.emptyFlag = false;
              }else{
                this.emptyFlag = true;
              }


          } else {
             this.$message.error(res.message);
          }
        }));
      },
       deleteConfirm(id,index,timeObj) {

          this.signId = id;
          let str;
          const h = this.$createElement;
          if(index == "progress"){
            str = h('p', null, [
              h('span', null, '此签到正在进行中,'+'  '+'确认删除该签到吗?'),
              h('p', { style: 'color: red;padding-top:4px;font-size:16px;padding-left:5px;' }, '( 提醒：删除后数据无法找回 )')
            ])
           }else{
               let date = timeObj.signDate;
               let beginTime = timeObj.beginTime;
               let endTime = timeObj.endTime;
               str = date+"   "+beginTime+"—"+endTime+"   "+"确认删除该签到吗?";
           }
           delTipCustom(this, str, this.delUser, index);
          
      },
      delUser(){
        var _this = this;
        var data = {
          id:this.signId
        }
        model.signDelete(data, (res => {
        if(res.status == 200) {
          this.$message({
            type: 'success',
            message: '删除成功',
            duration: 1000,
            onClose() {
              _this.getSignList();
            }
          });
        } else {
          this.$message.error(res.message);
        }
      }));
      },
      signDtail(id){
        this.$router.push("/clazz/signin/detail?clazzId="+this.clazzId+"&signId="+id)
      },
      qrcodeCheck(id){
        this.signId = id;
        this.qrCodeSign = true;
      },

      setTimeM(signId,signDate,beginTime,endTime,taskStatus){

          //console.log("删除2");
          this.setSignDate = signDate;
          this.setBeginTime = beginTime;
          this.setEndTime = endTime;
          this.signId = signId;

          this.setTime = true;
          this.taskStatus = taskStatus

      }
    },


    filters:{
      filterSignType(value){
          switch(value){
            case "common":
              value = "普通模式";
              break;
            case "avoid":
              value = "防作弊模式";
              break;
          }
          return value;

      },
      filterTaskStatus(value){
        switch(value){
          case "waiting":
            value = "未开始";
            break;
          case "inprogress":
            value = "进行中";
            break;
          default:
            value = "已结束";
        }
        return value;
      }
    },
    components:{
      Goback,
      signCreate,
      qrCode,
      Empty,
      importSign,
      timeSet
    }
  }
</script>
<style scoped="" lang="less">
  @import "../../../assets/less/clazz";
  @import "../../../assets/less/btn-search.less";
  @import "../../../assets/less/icon.less";
  @import "../../../assets/reset-element-ui/form.css";
  .back {
    margin-bottom: 15px;
  }
  .j-clazz{
    .el-dropdown{
      font-size: 16px;
    }
    .btn-pad{
      padding:0 15px;
      height: 40px;
      font-size: 16px;
    }
    .add-clazz-import{
      right: 0;
      position: absolute;
      top: 0;
      i{
        vertical-align: middle;
      }
      
    }
    
    .add-clazz{
      right: 100px!important;
    }
    .add-clazz-t{
      right: 200px!important;
    }
    .j-title{
      padding-top:16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e6e6e6!important;
      box-shadow: none!important;
      .clazz-sign-circle{
         position: relative;
        font-size: 22px;
        .signCont-already{
          position: absolute;
          color: #ff7e00;
          left: 0;
          top: 22px;
          width: 40px;
          text-align: center;
        }
        .signCont-no{
          color: #666;
          top: 34px;
          font-size: 16px;
          width: 107px;
          text-align:center;
          left: 38px;
          width: 34px;
          text-align: center;
          position: absolute;
        }
      }
      .j-left{
        float: left;
        width: 60%;
        border-right: 1px solid #dfe6ec;
        padding-left: 80px;
        padding-bottom: 23px;
        color: #333;
        li{
          float: left;
          padding-right: 38px;
        }
        .time{
          padding-top: 28px;
          font-size: 18px;
        }
        .time-20{
          font-size: 20px;
        }
        .sign{
          padding-top: 6px;
          color: #666;
          font-size: 16px;
        }
        .fzb{
          color: #666;
          line-height: 20px;
          font-size: 16px;
          padding-top: 17px;
        }

        .size{
          font-size: 18px;
        }
      }

      .j-rg{
        float: left;
        padding-left: 32px;
        padding-top: 11px;
        .btn-screen{
          background: url("../../../assets/img/icon/icon-sign-screen.png") no-repeat;
          width: 119px;
          height: 29px;
          display: inline-block;
        }
        p{
          padding-top:18px;
          color: #1077d7;
        }
      }
    }
    .j-other-sign{
      border-left:1px solid #ddd;
      padding-left: 35px;
      margin-left: 80px;
      padding-bottom:2px;
      margin-top: 24px;
      .j-box{
        padding:20px 0 0 18px;
        position: relative;
        padding-bottom: 26px;
        .j-left{
            width: 65%;
            border-right: 1px solid #dfe6ec;
            h2{
              color: #000;
              font-size:20px;
              padding-bottom: 19px;
            }
            p{
              font-size: 18px;
              color: #333;
            }
        }
        .j-rg{
          float:left;
          margin-top: 25px;
          margin-left: 32px;

        }

      }
      .j-box-icon{
        position: absolute;
        top: -5px;
        left: -56px;
        background: url("../../../assets/img/icon/icon-calendar-grey.png");
        display: inline-block;
        width: 42px;
        height: 42px;
      }
    }
    .ongo{
      border: 1px solid #ff7e00;
      padding:5px 7px;
      color: #ff8926;
      border-radius: 4px;
      font-size: 14px;
    }
    .nostart{
      border:1px solid #999;
      padding:4px 8px;
      color: #999;
      font-size: 14px;
      border-radius: 4px;
    }
    .j-mb24{
      margin-bottom: 27px;
    }
    h3{
      height: 54px;
      line-height: 54px;
      border-bottom: 1px solid #e6e6e6;
      box-shadow:0 2px 3px #fafafa;
      padding-left: 16px;
      color: #101010;
      font-size: 16px;
    }
    h4{
      padding:23px 0 0 31px;
    }
    h4 span{
      border-left:3px solid #35a69d;
      padding-left: 8px;
    }
    .green-shadow{
      box-shadow:-2px 0 3px #f1f9f8, 2px 0 3px #f1f9f8, 0 -2px 3px #f1f9f8, 0 2px 3px #f1f9f8;
      width:85%;
    }
  }
  .el-dropdown-menu__item{
    .vipExportLogo{
      width: 26px;
      height: 14px;
      vertical-align: middle;
      margin-right: 6px;
    }
  }
</style>
