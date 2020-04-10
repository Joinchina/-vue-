<template>
    <div class="extertdetailbox">
        <header>
            <heard>
                <el-dropdown trigger="click" @command="operaterCommand">
                <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <slot></slot>
                <el-dropdown-menu slot="dropdown"  class="passwordEdit">
                    <el-dropdown-item command="edit">
                        <i class="icon-edit-word"></i>修改密码
                    </el-dropdown-item>
                    <el-dropdown-item command="exit">
                    <i class="icon-exit"></i>退出
                    </el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>
            </heard>
            <div class="nowpeople">
                <img :src="expertinfo.avatar" alt="" v-if="expertinfo.avatar">
                <img src="../../assets/img/expert/nopeople.png" alt="" v-else>
            </div>
            <div class="peoplename">
                <h1>{{expertinfo.name}}</h1>
                <span class="chat" @click="showqqexpert"><img src="../../assets/img/expert/qq.png" alt=""></span>
                <span class="chatqq"><img src="../../assets/img/expert/chatqq.png" alt=""></span>
            </div>
            <div class="label">
                <button class="leftmargin" v-if="expertinfo.areaName">
                    <img src="../../assets/img/expert/address.png" alt="">
                    {{expertinfo.areaName}}
                </button>
                <button v-for="(item,index) in expertinfo.curriculumFieldVos" :key="index">
                    <img src="../../assets/img/expert/book.png" alt="">
                    {{item.name}}
                </button>
                <!-- <button>
                    <img src="../../assets/img/expert/book.png" alt="">
                    北京北京
                </button> -->
                <!-- <button>
                    <img src="../../assets/img/expert/biaozhi.png" alt="">
                     {{expertinfo}}
                </button> -->
            </div>
            <div class="score">
                <div class="allscore">
                    <h1>综合：</h1>
                    <el-rate
                        v-model="expertinfo.total"
                        disabled
                        show-score
                        text-color="#ff9900"
                        :colors="['#FD7E23','#FD7E23','#FD7E23']"
                        score-template="{value}">
                    </el-rate>
                </div>
                <div class="onescore">
                    <div class="star starleft">
                        <h1>内容创新性：</h1>
                        <el-rate
                            v-model="expertinfo.novelty"
                            disabled
                            show-score
                            text-color="#ff9900"
                            :colors="['#FD7E23','#FD7E23','#FD7E23']"
                            score-template="{value}">
                        </el-rate>
                    </div>
                    <div class="star">
                        <h1>内容实用性：</h1>
                        <el-rate
                            v-model="expertinfo.practicability"
                            disabled
                            show-score
                            text-color="#ff9900"
                            :colors="['#FD7E23','#FD7E23','#FD7E23']"
                            score-template="{value}">
                        </el-rate>
                    </div>
                    <div class="star">
                        <h1>课堂互动：</h1>
                        <el-rate
                            v-model="expertinfo.interaction"
                            disabled
                            show-score
                            text-color="#ff9900"
                            :colors="['#FD7E23','#FD7E23','#FD7E23']"
                            score-template="{value}">
                        </el-rate>
                    </div>
                    <div class="star">
                        <h1>授课技巧：</h1>
                        <el-rate
                            v-model="expertinfo.skill"
                            disabled
                            show-score
                            text-color="#ff9900"
                            :colors="['#FD7E23','#FD7E23','#FD7E23']"
                            score-template="{value}">
                        </el-rate>
                    </div>
                </div>
            </div>
            <div class="tabcontent">
                <template>
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="授课记录" name="first">授课记录</el-tab-pane>
                        <el-tab-pane label="专家介绍" name="second">专家介绍</el-tab-pane>
                                                
                    </el-tabs>
                </template>
            </div>            
        </header>
        <div class="content_box">
            <div class="abstract" v-if="abstract" v-html="expertinfo.description">
               {{expertinfo.description}}
            </div>
            <div class="record" v-else>
                <record :expertinfo="expertinfo"></record>
            </div>
        </div>
         <!-- 联系专家申请 -->
        <callexpert :chatexpertshow.sync="chatexpertshow" :expertid="expertId" @expertlistsuccess="expertlistsuccess"></callexpert>
        <!-- 提交成功提示 -->
        <success :dialogsuccessVisible.sync="successshow"></success>
    </div>
</template>
<script>
import heard from '@/components/header/header'
import rate from './rate'
import record from './record'
import model from'@/model/expert/expert'
import callexpert from './callexpert'
import success from './success'
import { getCurRole,exitSys } from "../../filters/userVerify"
import Goback from 'base/goback/goback'
export default {
    data () {
        return {
            allrate:5.0,
            crate:4.7,
            srate:2.3,
            hrate:4.9,
            jrate:1.2,
            activeName: 'first',
            abstract:false,//默认显示授课记录
            expertinfo:{},//当前专家的所有信息
            chatexpertshow:false,
            successshow:false,
            passtitle:'专家',
        }
    },
    computed:{
        expertId(){
            return this.$route.query.id
        },
    },
    created(){
        this.getexpertdetail()
    },
    methods:{
        handleClick(tab, event) {
            console.log(tab.label, event);
            if(tab.label=="授课记录"){
               this.abstract=false; 
            }else{
                this.abstract=true;
            }
        },
        //获取当前专家详情
        getexpertdetail(){
            let data={
                id:this.expertId
            };
            model.getexpertinfo(data,(res)=>{
                if(res.status==200){
                    console.log(res)
                    this.expertinfo=res.data
                }
            })
        },
        //控制联系组件的显示隐藏
        expertlistsuccess(){
            this.successshow=true;
            this.chatexpertshow=false;
        },
        showqqexpert(){
            this.chatexpertshow=true;
        },
         operaterCommand(command){
          if(command == "edit"){
                this.$router.push({
                    path:"/project/password?type=clazz"
                })
            }
            if(command == "exit"){
                exitSys();
            }
        }
    },
    components:{
        heard,
        rate,
        record,
        callexpert,
        success,
        Goback
    }
}
</script>
<style lang="less" >
.extertdetailbox{
    width: 100%;
    overflow: hidden;
    background-color: #ffffff;
    header{
        background: url('../../assets/img/expert/detail.png');
        background-size: cover;
        background-position: top center;
        height: 463px;
        position: relative;

        .nowpeople{
            width: 137px;
            height: 137px;
            margin: 0 auto;
            margin-top: 17px;
            overflow: hidden;
            img{
                max-width: 100%;
                display: block;
                margin: 0 auto;
            }
        }
        .peoplename{
            width: 1190px;
            margin: 0 auto;
            overflow: hidden;
            h1{
                float: left;
                font-size: 18px;
                color: #333333;
                letter-spacing: 0;
                line-height: 18px;
                margin-left: 550px;
                margin-top: 17px;
            }
            .chat{
                width: 50px;
                height: 50px;
                float: left;
                margin-top: 6px;
                margin-left: 6px;
                img{
                    max-width:100%;
                }
            }
            .chatqq{
                width: 55px;
                height: 20px;
                float: left;
                margin-top: 16px;
                margin-left: 6px;
                img{
                    max-width:100%;
                }
            }
        }
        .label{
            clear: both;
            // width: 1190px;
            width: auto;
            display: block;
            margin: 0 auto;
            position: absolute;
            top:254px;
            left:50%;
            transform:translate(-50%,0);
            height: 26px;
            overflow: hidden;
            // .leftmargin{
                // margin-left: 408px;
            // }
            button{
                background: #F9B749;
                border-radius: 4px;
                font-size: 14px;
                color: #333333;
                letter-spacing: 0;
                line-height: 16px;
                float: left;
                padding: 5px 10px;
                margin-right: 10px;
                img{
                    width: 12px;
                    height: 14px;
                }
            }
        }
        .score{
            width: 1190px;
            margin: 0 auto;
            overflow: hidden;
            background-color: #ffffff;
            margin-top: 46px;            
            .allscore{
                width: 240px;
                margin: 0 auto;
                margin-top: 26px;
                h1{
                    font-size: 20px;
                    color: #FD7E23;
                    float: left;
                }
                .el-rate__icon {
                    font-size:24px;
                }
                .el-rate__text{
                    font-size:20px;
                }
                .el-rate{
                    margin-top: 2px;
                }
            }
            .onescore{                
                overflow: hidden;
                width: 100%;
                margin-top: 26px;
                margin-bottom: 20px;
                .starleft{
                    margin-left: 94px;
                }
                .star{
                    float: left;
                    width: 226px;
                    margin-right: 46px;
                    h1{
                        font-size: 16px;
                        color: #333333;
                        float: left;
                    }
                    .ratestar{
                        float: left;
                        margin-top: 2px;
                    }
                    .el-rate__icon{
                        font-size: 14px;
                    }
                    .el-rate{
                        margin-top: 2px;
                    }
                }
            }
        }
        .tabcontent{
            width: 1190px;
            background-color: #ffffff;
            height: 44px;           
            margin: 0 auto;
            margin-top: 10px;
            padding-left:46px; 
            .el-tabs__nav-wrap::after {
                content: "";
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 2px;
                background-color: #ffffff;
                z-index: 1;
            }
            .el-tabs__active-bar{
                background-color: #009791;
            }
            .el-tabs__item{
                font-size: 16px;
            }
            .el-tabs__item.is-active {
                color: #009791;
            }
            .el-tabs__item:hover {
                color: #009791;
            }
            .el-tabs__content{
                display: none;
            }
        }        
    }
    .content_box{
        width: 1190px;
        overflow: hidden;
        margin: 0 auto;
        min-height: 480px;
        .abstract{
            width: 100%;
            overflow: hidden;
            padding: 20px 20px;
        }
        .record{
            width: 100%;
            overflow: hidden;
        }
    }
}
.el-dropdown-menu{
    background: rgba(0,0,0,0.5)!important;
    border: none;
} 
</style>

