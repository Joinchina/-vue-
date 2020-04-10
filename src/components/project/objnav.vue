<template>
    <div class="z_content">
        <div class="alldata" 
        v-loading="loading"
        :element-loading-text='this.$globalParam.loadText'
        :element-loading-spinner='this.$globalParam.loadSpinner'
        :element-loading-background='this.$globalParam.loadBg'
        >

            <div class="export">
                 <span class="btn-green btn-gray" v-show="!reportBtnFlag">
                        报告生成中......
                 </span>
                 <span class="btn-green" @click = "exportHomePage" v-show="reportBtnFlag">
                      <i class="icon-export-white"></i>导出报告
                 </span>
            </div>
            
            <div class="handle-wechat">

               <!--  <button type="button" class="btn-green-line" @click="receiveWechatFlag = true">
                    <i class="icon-wechat"></i>
                    微信接收数据
                </button> -->


                <!-- <button class="btn-green" type="button" @click="exportList()">
                    <i class="icon-export-white"></i>
                    导出
                </button> -->
            </div>

            <h1>

                汇总数据<span>（注：截止至昨日的数据）</span>
            </h1>
            <div class="datalist">
                <div class="datalist_l">
                    <ul>
                        <li>
                            <h3>学员数</h3><h2>{{summary.studentCount}}</h2><span></span>
                        </li>
                        <li>
                            <h3>班主任数</h3><h2>{{summary.managerCount}}</h2><span></span>
                        </li>
                        <li>
                            <h3>专家数</h3><h2>{{summary.professorCount}}</h2>
                        </li>
                    </ul>
                </div>
                <div class="datalist_r">
                    <ul>
                        <li>
                            <h3>项目数</h3><h2>{{summary.projectCount}}</h2><span></span>
                        </li>
                        <li>
                            <h3>班级数</h3><h2 style="color:#04908A">{{summary.clazzCount}}</h2>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="table">
                <h1>班级明细</h1>
                <router-link :to="{path:'/project/classdetail?orgId='+this.orgId}" v-show="more1">更多<i class="el-icon-d-arrow-right"></i></router-link>
                <template>
                                <el-table
                                :data="tableData"
                                style="text-align:center"
                                :stripe="true"
                                :header-cell-style="{'text-align':'center'}"
                                :empty-text="loading_font"
                                tooltip-effect="dark"
                                @cell-click="cellclick"
                                >                          
                                <el-table-column
                                prop="name"
                                label="班级名称"
                                :show-overflow-tooltip='true'
                                width="150"> 
                                </el-table-column>
                                <el-table-column
                                prop="beginDate"
                                
                                label="开始日期"
                                width="106"
                                >
                                  
                                </el-table-column>
                                <el-table-column
                                prop="endDate"
                                label="结束日期"
                                
                                width="106"> 
                                </el-table-column>
                                <el-table-column
                                prop="studentCount"
                                label="学员数"
                                
                                width="106"> 
                                </el-table-column>
                                <el-table-column
                                prop="clazzSatisfiedRate"
                                label="项目满意度"
                                
                                width="106">
                                </el-table-column>
                                <el-table-column
                                prop="historyAvgSignRate"
                                label="历史平均签到率"
                                
                                width="156">
                                </el-table-column>
                                <el-table-column
                                prop="homeworkCommitRate"
                                label="作业完成率"
                                
                                width="106">
  
                                </el-table-column>
                                <el-table-column
                                prop="taskCompleteRate"
                                label="任务完成率"                                
                                width="106"> 
                                                                     
                                </el-table-column>
                                <el-table-column
                                prop="evaluationCommitRate"
                                label="评价率"
                                
                                width="106">
                                    
                                </el-table-column>
                                <el-table-column
                                prop=""
                                label="操作">
                                <template slot-scope="scope">
                                     <span style="color: #289CF6;cursor: pointer;">进入班级</span>
                                </template>
                                </el-table-column>                          
                        </el-table>
                    </template>
        </div>
        <div class="object" v-loading="loading2"
        :element-loading-text='this.$globalParam.loadText'
        :element-loading-spinner='this.$globalParam.loadSpinner'
        :element-loading-background='this.$globalParam.loadBg'>
           <h1>项目满意度 <span>（近12个月）</span></h1>
           <router-link :to="{path:'/project/objectfull?orgId='+this.orgId}" v-show="more2">更多<i class="el-icon-d-arrow-right"></i></router-link>
           <objectCanvas :summary="summary" v-on:listenImg1="img1Fn"></objectCanvas>
           
        </div>

        <!-- 353 -->
        <div class="move">
            <div class=" active" v-loading="loading31"
                :element-loading-text='this.$globalParam.loadText'
                :element-loading-spinner='this.$globalParam.loadSpinner'
                :element-loading-background='this.$globalParam.loadBg'>
                <h1>课程情况<span>（近12个月）</span></h1>
                <coursecase-canvas :summary='summary' v-on:listenImg2="img2Fn"></coursecase-canvas>
            </div>
            <div class=" interactive" v-loading="loading3"
                :element-loading-text='this.$globalParam.loadText'
                :element-loading-spinner='this.$globalParam.loadSpinner'
                :element-loading-background='this.$globalParam.loadBg'>
               <h1>课程满意度<span>（近12个月）</span></h1>
               <router-link :to="{path:'/project/classfull?orgId='+this.orgId}" v-show="more3">更多<i class="el-icon-d-arrow-right"></i></router-link>
               <coureCanvas :summary="summary" v-on:listenImg3="img3Fn"></coureCanvas> 
                       
            </div>
        </div>
        
        <div class="move">
            <div class="active" v-loading="loading4"
                :element-loading-text='this.$globalParam.loadText'
                :element-loading-spinner='this.$globalParam.loadSpinner'
                :element-loading-background='this.$globalParam.loadBg'>
                <h1>活动参与情况<span>（近12个月）</span></h1>
                <activeCanvas :summary='summary' v-on:listenImg4="img4Fn"></activeCanvas>
            </div>
            <div class="interactive" v-loading="loading5"
                :element-loading-text='this.$globalParam.loadText'
                :element-loading-spinner='this.$globalParam.loadSpinner'
                :element-loading-background='this.$globalParam.loadBg'>
                <h1>互动情况<span>（近12个月）</span></h1>
                <interCanvas :summary='summary' v-on:listenImg5="img5Fn"></interCanvas>
            </div>
        </div>
         <div class="object">
           <h1>学员留言</h1>
           <!-- <List :orgId = "orgId"></List> -->

           <!--load-start-->
            <div class="list_content" v-loading="loading6"
                :element-loading-text='this.$globalParam.loadText'
                :element-loading-spinner='this.$globalParam.loadSpinner'
                :element-loading-background='this.$globalParam.loadBg'>
                <p class="w-nocont" v-show="nodata">暂无数据</p>
                <ul class="wcont2">
                    <li v-for="(item,index) in stuList" :key="index">
                        <p class="date">{{item.createTime}}</p>
                        <div>
                            <img class="head" :src="item.avatar" alt="" v-if="item.avatar">
                            <img class="head" src="../../assets/img/icon/moimg.png" alt="" v-else>
                            <h3 class="name">{{item.name}} 
                            <template v-if="item.workPlace">
                                &middot; <span class="school">{{item.workPlace}}</span>
                            </template>
                            </h3>
                            <p class="tip">{{item.clazzName}}</p>
                        </div>
                        <p class="desc">{{item.answer}}</p>


                        <!-- <div class="list_box_left">
                            <div class="list_box_info">
                               <img :src="item.avatar" alt="" v-if="item.avatar">
                               <img src="../../assets/img/icon/moimg.png" alt="" v-else>
                               <h1 v-if="!item.workPlace">{{item.name}}</h1>
                               <h1 v-else>{{item.name}} ·<span>{{item.workPlace}}</span></h1>
                               <h2>{{item.clazzName}}</h2>
                            </div>
                            <p>
                               {{item.answer}}
                            </p>
                        </div>
                        <div class="list_box_right">
                            <span>{{item.createTime}}</span>
                        </div> -->
                    </li>
                </ul>
                <LoadMore :loadData = "loadData" :loadUrl = "loadurl" @getList = "getList"></LoadMore>
            </div>

            <!--load-end-->

        </div>

        <!--导出报告-->
        <forms-summit 
            :methods = "formObj.method"
            :urls = "formObj.urls"
            :data = "formObj.data">
        </forms-summit>

        <!--微信接受数据-->
        <receive-wechat 
            :dialogReceiveWechat.sync = "receiveWechatFlag">
                
        </receive-wechat>

    </div>
</template>
<script>
import objectCanvas from './object_canvas'  //项目满意度组件
import coureCanvas from './coure_canvas' //课程满意度组件
import activeCanvas from './active_canvas' //活动参与情况组件
import interCanvas from './inter_canvas' //互动情况
import coursecaseCanvas from './coursecase_canvas'  // 课程情况
import model from 'model/clazz/clazz' //引入接口
import { getCurRole } from '@/filters/userVerify'
import { mapGetters} from 'vuex';
import storage from '@/global/storage'

import List from '@/base/modal/list' //留言列表

import LoadMore from '@/base/loadmore/loadmore'

import API from '@/global/resource';

import { getToken } from '@/filters/userVerify'
import formsSummit from 'components/formsumit/form'

import ReceiveWechat from '../comtopic/wechat/receive-wechat';


export default {
    data(){
        return {
            tableData:[],
            summary:'',
            loading:true,
            loading1:true,
            loading2:true,
            loading31:true,
            loading3:true,
            loading4:true,
            loading5:true,
            loading6:true,
            more1:true,
            more2:false,
            more3:false,
            loading_font:this.$globalParam.loadText,
            totalElements:0,

            orgId:"",
            role: getCurRole(),


            stuList:[],  //遍历的数组
            loadData:{}, //传入请求数据
            loadurl:"",  //传入请求接口地址
            loading:true,
            nodata:false,
            tip:'暂无数据',


            reportBtnFlag:false,
            reportBtnSeconds:5,
            chartArray:{},
            formObj:{
                method:"post",
                data:{},
                urls: API.urls.orgExpStat,
             },

            receiveWechatFlag:false

        }
    },
    filters: {
        //空字符过滤
        conversion: function (value) {
            if (!value) return '暂无数据';
            return value
        },
        
    },
    computed:{
  //       orgId() {
		// 		return this.$route.query.orgId;
		// },
        ...mapGetters(['showOrgObj'])
    },
    watch:{

          showOrgObj(cur,old){
            console.log("机构列表　－　当前机构id");
            console.log(cur.identification);
             this.orgId = cur.identification;
             this.menuRole(cur.role); 

             if(this.role == 'ORGADMIN' || this.role == 'ADMIN') {
                this.getorgId();

                //切换清空loadmore变量
                this.stuList = [];
                this.nodata = false;
                
                this.passdata();
             }
          },

    },
    created(){

        this.orgId = this.$route.query.orgId;

        this.reportBtnShow();

        //执行app启动屏
        if(this.role == 'ADMIN' || this.role == 'ORGADMIN') {
            this.getorgId();

            if(this.orgId){
                 this.passdata();
            }
               
        }
    },
    methods:{
        img1Fn(childValue) {
            this.chartArray["imageData_1"] = childValue;
        },
        img2Fn(childValue) {
            this.chartArray["imageData_2"] = childValue;
        },
        img3Fn(childValue) {
            this.chartArray["imageData_3"] = childValue;
        },
        img4Fn(childValue) {
            this.chartArray["imageData_4"] = childValue;
        },
        img5Fn(childValue) {
            this.chartArray["imageData_5"] = childValue;
        },
        reportBtnShow(){
            var _this = this;
            if(_this.reportBtnSeconds <= 0){
                _this.reportBtnFlag = true;
            }else{
             _this.reportBtnSeconds--;
                setTimeout(function () {
                 _this.reportBtnShow();
                }, 1000);
            }

        },
        //导出报告
        exportHomePage(){
            if(!this.$store.getters.getOrgVipInfo.vip){
                this.$store.state.vipFuncPopFalg = true;
                return;
            }
            //form提交组件
            let data = {
                orgId:this.orgId,
                token:getToken(),   
            }
            for(var i in this.chartArray){
                data[i] = this.chartArray[i].getDataURL({pixelRatio:1, backgroundColor:'#fff'});
            }

            this.formObj.data = data;
            console.log("导出图片数据", this.formObj.data);

            setTimeout(function(){
                $("#exportClazzExport").submit();
            },50)
            
        },
        menuRole (role){

            //目前不需进行机构权限的的反查，项目管理员和专家班主任只有两个菜单;
            var role = role || storage.get("exp_role");
            // console.log("项目列表获取角色" + role );
            this.role = role;
        },
       //汇总数据
       getorgId(){

           let data={
                id:this.orgId,
           };
           model.getorgId(data,(res=>{
               if(res.status==200){
                   //console.log(res.data)
                   this.summary=res.data;
                    this.loading_font=this.$globalParam.dataEmpty;
                   if(!!res.data.clazzStatisticsList&&res.data.clazzStatisticsList.length!=0){
                        this.tableData=res.data.clazzStatisticsList;
                   }
                   this.loading=false;
                   this.loading2=false;
                   this.loading31=false;
                   this.loading3=false;
                    this.loading4=false;
                    this.loading5=false;
                    this.loading6=false;

                    if(!!res.data.clazzSatisfieds &&res.data.clazzSatisfieds.length!=0){
                        this.more2=true;
                    };
                    if(!!res.data.courseSatisfieds &&res.data.courseSatisfieds.length!=0){
                        this.more3=true;
                    }
               }
           }))
       },
       //跳转班级
       cellclick(row, column, cell, event){
            if(column.label=='操作'){
                window.open("/clazz/index?clazzId="+row.id)
            }
        },

         getList(val,bool){

            //this.nodata = false;
           // this.stuList = [];
            
            val.forEach((item,index)=>{

                this.stuList.push(item);

                this.loading6=false;
                return;                    
            });

            console.log("学员列表");
            console.log(this.stuList);
            if (this.stuList.length == 0) {
                this.nodata = true;
                this.loading6=false;
            }
        },
        passdata(){
           this.loadData={
                number:0,
                organizationId:this.orgId,
                size:10
           };


           this.loadurl=API.urls.getorgmessage;
        }  
    },
    components:{
        objectCanvas,
        coureCanvas,
        activeCanvas,
        interCanvas,
        coursecaseCanvas,
        List,
        LoadMore,
        formsSummit,
        ReceiveWechat 
    }
}
</script>
<style lang="less" scoped>
@import url("../../assets/less/icon.less");
@import "../../assets/reset-element-ui/user-table.css";
@import "../../assets/less/icon.less";

.export{
    float: right;
    padding-right: 10px;
    margin-top: 13px;
}
.btn-gray{
    background: #999!important;
    cursor:default!important;
}

.btn-green{
    display: inline-block;
    font-size: 16px;
    color: #fff;
    padding: 10px 15px;
    i{
        margin-right: 10px;
    }
}
.btn-green-line{
    padding: 9px 15px;
    margin-right: 10px;
    font-size: 16px;
}

.icon-wechat{
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url("../../assets/img/wechat/qrcode.png") center center no-repeat;
    background-size: 100% 100%;
    vertical-align: text-bottom;
}
.alldata{
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0 0 7px 0 rgba(0,0,0,0.03);
    border-radius:4px;
     overflow: hidden;
    h1{
        padding: 27px 10px 0 36px;
        font-size: 24px;
        color: #333333;
        letter-spacing: 0;
        line-height: 24px;
        span{
            font-size: 16px;
            color: #333333;
            letter-spacing: 0;
            line-height: 16px;
        }
    }
    .datalist{
        width: 100%;
        overflow: hidden;
        .datalist_l{
            width: 60%;
            overflow: hidden;
            float: left;
            margin-top: 60px;
            ul{
                overflow: hidden;
                li{
                    width: 33.33%;
                    float: left;
                    overflow: hidden;
                    h3{
                        text-align: center;
                        font-size: 18px;
                        color: #666666;
                    }
                    h2{
                        text-align: center;
                        font-size: 38px;
                        color: #000000;
                        margin-top: 25px;
                    }
                    span{
                        opacity: 0.14;
                        background: #333333;
                        width: 1px;
                        height: 80px;
                        float: right;
                        margin-top: -88px;
                    }
                }
            }
        }
        .datalist_r{
            width: 40%;
            overflow: hidden;
            float: right;
             margin-top: 45px;
             margin-bottom: 40px;
            ul{
                overflow: hidden;
                li{
                    width: 50%;
                    float: left;
                    overflow: hidden;
                    h3{
                        text-align: center;
                        font-size: 24px;
                        color: #333333;
                    }
                    h2{
                        text-align: center;
                        font-size: 50px;
                        color: #EE7B4E;
                        margin-top: 25px;
                    }
                    span{
                        opacity: 0.11;
                        background: #333333;
                        width: 1px;
                        height: 92px;
                        float: right;
                        margin-top: -104px;
                    }
                }
            }
        }
    }
}
.table{
    width: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
    box-shadow: 0 0 7px 0 rgba(0,0,0,0.03);
    border-radius:4px;
    margin-top: 20px;
    padding: 27px 20px 20px 20px ;
    h1{
        font-size: 24px;
        color: #333333;
        padding-left: 16px;
        padding-bottom: 20px;
        float: left;
    }
    a{
        float: right;
        padding-right: 16px;
        font-size: 16px;
        color: #289CF6;
    }
    .datanum{
        width: 100%;
        text-align: right;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
        text-align: right;
        line-height: 14px;
        margin: 20px 0 0 0;
        span{
            margin-left: 10px;
        }
    }
    .tabpage{

        width: 100%;
        margin: 20px 0;
        text-align: right;

        .el-pagination{
            padding: 0
        }

    }
    
}
.object{
   width: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
    box-shadow: 0 0 7px 0 rgba(0,0,0,0.03);
    border-radius:4px;
    margin-top: 20px;
    padding: 27px 20px 20px 20px ;
    h1{
       font-size: 24px;
        color: #333333;
        padding-left: 16px;
        padding-bottom: 20px;
        float: left;  
        span{
            font-size: 16px;
            color: #333333;
        }
    }
    a{
        float: right;
        padding-right: 16px;
        font-size: 20px;
        color: #289CF6;
    }
}
.move{
    width: 100%;
    overflow: hidden;
    margin-top: 20px;
    h1{
        font-size: 24px;
        color: #333333;
        padding-left: 16px;
        padding-bottom: 20px;
        float: left;  
        span{
            font-size: 16px;
            color: #333333;
        }
    }
    a{
        float: right;
        padding-right: 16px;
        font-size: 20px;
        color: #289CF6;
    }
    .active{
        background-color: #FFFFFF;
        box-shadow: 0 0 7px 0 rgba(0,0,0,0.03);
        border-radius:4px;
        padding: 27px 20px 20px 20px ;
        width: 585px;
        float: left; 
    }
    .interactive{
        background-color: #FFFFFF;
        box-shadow: 0 0 7px 0 rgba(0,0,0,0.03);
        border-radius:4px;
        padding: 27px 20px 20px 20px ;
        width: 585px;
        float: left; 
        margin-left: 20px;
    }
}


.list_content{
    width: 100%;
    display:block;
    overflow: hidden;
    .w-nocont{
        height: 467px;
        margin-bottom: 20px;
        text-align: center;
        color: #999;
        font-size: 24px;
        padding-top: 150px;
    }

    ul{
        width: 100%;
        overflow: hidden;
        li{
            width: 100%;
            overflow: hidden;
            border-bottom:1px solid #E6E6E6;

            .list_box_left{
                width: 80%;
                float: left;
                overflow: hidden;

                .list_box_info{
                    width: 100%;
                    overflow: hidden;
                    img{
                         float: left;
                         margin: 22px 16px 0 20px;
                         width: 46px;
                         height: 46px;
                         border-radius: 46px;
                    }

                    h1{
                        float: left;
                        font-size: 18px;
                        color: #333333;
                        width:60%;
                        margin-top: 22px;
                        span{
                            font-size: 18px;
                            color: #666666;
                        }
                    }

                    h2{
                        float: left;
                        width:60%;
                        font-size: 16px;
                        color: #333333;
                        margin-top: 2px;
                    }
                }

                p{
                    width: 100%;
                    overflow: hidden;
                    font-size: 18px;
                    color: #666666;
                    line-height: 29px;
                    margin: 10px 0 30px 0;
                    padding: 0 20px;
                    
                }
            } 

            .list_box_right{
                width: 20%;
                float: right;
                margin-top: 24px;
                span{
                    float: right;
                    font-size: 14px;
                    color: #666666;
                    line-height: 14px;
                    margin-right: 10px;
                }
            }
           
        }
    }
}

.wcont2 {
    width: 100%;
    min-height: 200px;
    box-sizing: border-box;
    background: #fff;
    padding: 0 18px;

    li {
        position: relative;
        border-bottom: 1px solid  #E6E6E6;
        padding: 22px 20px 30px;

        &:last-child {
            border-bottom: 0;
        }
    }
    .date {
        position: absolute;
        right: 20px;
        font-size: 14px;
        color: #666666;
    }
    .head {
        float: left;
        width: 46px;
        height: 46px;
        border-radius: 46px;
        margin-right: 16px;
    }
    .name {
        font-size: 18px;
        color: #333333;
        width: 86%;
        line-height: 1.2em;
    }
    .school {
        color: #666;
        line-height: 1em;
    }
    .tip {
        font-size: 16px;
        color: #333333;
        line-height: 1.5em;
        margin-top: 8px;
    }
    .desc {
        font-size: 18px;
        color: #666666;
        line-height: 1.5em;
        margin-top: 10px;
    }
}
.handle-wechat{
    float:right;
    display: inline-block;
    margin-top: 13px;
}
</style>


