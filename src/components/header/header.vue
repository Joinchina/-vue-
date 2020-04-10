<template>
    <div class="header">
        <section class="wrapper">
            <a class="logo" href="">
                <img src="../../assets/img/common/logo.png" class="" alt="">
            </a>
            <!-- <a target="_blank" href="http://old.shixunbao.cn" class="old">切换至旧版</a> -->
            <div class="user-info">
                <span>{{username}}</span>
                <!-- <slot></slot> -->
                <el-dropdown trigger="click" @command="operaterCommand">
                    <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <!-- <slot></slot> -->
                    <el-dropdown-menu slot="dropdown"  class="passwordEdit orgDropDown">
                        <el-dropdown-item command="myInfo" :class="{vipInfo : accountData.vip&&exp_role!='ADMIN'}">
                            <img src="/static/img/avatar.png" alt="" class="orgImg">
                            <span class="orgText">{{username}}</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="applyVip" v-if="chargeShow">
                            <i class="icon-diamond"></i>VIP会员
                            <span class="toOpen" v-if="!accountData.vip">去申请开通<i class="el-icon-arrow-right rightArrow"></i></span>
                            <span class="vipTime" v-else>{{accountData.endDate}}到期</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="accountCenter" v-if="chargeShow">
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
                <!-- <a href="javascript:;"  @click="handleCommand('loginout')">退出</a> -->
                
            </div>

            <nav class="link" v-if="show">
                <!--暂时屏蔽收费公告功能-->
                <!-- <a href="javascript:;"  @click="chargeBoxShow" v-if="chargeShow">
                    <i class="el-icon-message chargeBox"></i>
                    收费公告
                </a> -->
                <a href="" v-show="other"><i class="icon-library" ></i>资源库</a>
                <a href="" v-show="other"><i class="icon-man" ></i>选专家</a>
                <a href="" v-show="other"><i class="icon-app" ></i>App下载</a>
                <!-- <a href="###" @click="openexpert"><i class="icon-vertical-expert"></i>专家库</a> -->

                <router-link to="/expert/index"><i class="icon-vertical-expert"></i>专家库</router-link>

                <a href="###" @click="helpopen"><i class="icon-vertical-help"></i>帮助</a>
            </nav>
            
        </section>
        <!--暂时屏蔽收费公告功能-->
        <!-- <charge ref="chargeRef"></charge> -->

        <!-- vip申请/续约 -->
        <vipApply :vipApplyDialog.sync="vipApplyVisible" :orgName="accountData.name" :orgId="accountData.id" :vipAccount="accountData.vip"></vipApply>
    </div>
</template>

<script>

    import storage from '@/global/storage'
    import charge from '@/components/charge/index'
    import vipApply from "components/orgAccount/vipApply"
    import { exitSys } from "../../filters/userVerify"
    import httpRequest from '@/model/orgAccount/index'
    export default {
        data() {
            return {
                name: '',
                show: true,
                other:false,
                active:false,
                active1:false,
                active2:false,
                active3:false,
                chargeShow:false,
                accountData : {vip:false},
                vipApplyVisible : false,
                lastGetInfo: 0,
            }
        },
        computed:{
            username(){
                let day30 = 60*60*24*30;
                let name = storage.get('exp_name');
                // console.log("name" + name);
                this.name = name;
                return name;
            },
            type(){
                return this.$route.path;
            }
        },
        created() {
            
            let name = storage.get('exp_name');
            if(!name) {
                this.$router.push('/login');
            }
            if(localStorage.exp_role){
                let prosess=["ORGADMIN","PROJECTADMIN","CLAZZMANAGER"];
                this.chargeShow=prosess.includes(JSON.parse(localStorage.exp_role).data);
                this.exp_role = JSON.parse(localStorage.exp_role).data;
            }
            this.getAccountInfo();
        },
        mounted(){
        },
        methods:{
            handleCommand(command) {
               //退出点击
                if(command == 'loginout'){
                   
                    //账号登录清除二次登录机构登录功能
                    if(!!storage.get("loginType") && storage.get("loginType")["type"] == "username"){
                         storage.remove('orgId');
                    }

                    storage.remove('exp_name')
                    storage.remove('exp_role')
                    storage.remove('exp_token_json')
                    storage.remove('exp_authorization')
                    this.$router.push('/login');

                }
            },
            operaterCommand(command){
                if(command == "edit"){
                    this.$router.push({
                            path:"/project/password?type=org"
                    })
                }else if(command =="accountCenter"){
                    this.$router.push({
                        path:"/orgAccount/index",
                        query:{orgId: localStorage.orgId?JSON.parse(localStorage.orgId).identification:""}
                        // 
                    })
                }else if(command =="applyVip"){
                    if(!this.accountData.vip){
                        this.vipApplyVisible = true;
                    }
                    
                }else if(command == "exit"){
                    exitSys();
                }
            },
           helpopen(){
               let lost=window.location.host;
               if(lost.indexOf('mgr.shixunbao.cn')>-1){
                   window.open("https://www.shixunbao.cn/help/index.html#/help/details?type=MANAGER")                   
               }else{
                   window.open("https://10.98.24.67:8003/help/index.html#/help/details?type=MANAGER")
               }
           },
           //专家库路由跳转
           openexpert(){
               this.$router.push({
				path: "/expert/index",                    
               })
           },
        //    chargeBoxShow(){
        //        this.$refs.chargeRef.dialogPreview=true;
        //    },

           // 获取机构账户信息
            getAccountInfo(){
                if((new Date().getTime() - this.lastGetInfo) < 3000){
                    return
                }
                let data = {
                    orgId: !!this.$route.query.orgId ? this.$route.query.orgId : localStorage.orgId ? JSON.parse(localStorage.orgId).identification : '',
                }
                if(!data.orgId) return
                httpRequest.getAccountInfo(data,(res)=>{
                    this.lastGetInfo = new Date().getTime();
                    if(res.status==200){
                        this.accountData = res.data;
                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
        },
        components:{
            charge,
            vipApply,
        }
    }
</script>
<style lang="less" scoped>
    @import "../../assets/less/icon.less";    
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 40px;
        font-size: 14px;
        line-height: 40px;
        color: #fff;
        overflow: hidden;
        clear: both;
        background-color: rgba(55,50,62,0.3);
        .wrapper{
            position: relative;
        }
        .logo{
            margin-left: 10px;
            float: left;
            width:70px;
            text-align: center;
            cursor: pointer;

            >img {
                margin-top: 9px;
                display: block;
                max-width: 100%;
            }
        }
        .old{
            color: #35a69d;
            font-size: 16px;
            margin-left: 20px;
        }
    }
    .link {
        float: right;
        width: auto;
        font-size: 14px;
        text-align: center;
        >a {
            color: #ffffff;
            display: inline-block;
            margin-right: 40px;
        }
        i {
            vertical-align: text-bottom;
            margin-right: 6px;
        }
    }
    .user-info {
        position: relative;
        float: right;
        padding-right: 10px;
        font-size: 14px;
        color: #ffffff;
        height: 40px;
        line-height: 40px;
        >span,a {
            display: inline-block;
            vertical-align: top;
        }
        >i {
            margin: 0 12px;
            width: 1px;
            height: 40px;

        }
        >a {
            color: #fff;

        }
    }
    .link .chargeBox{
        font-size: 16px;
        vertical-align: middle;
        cursor: pointer;
        margin-right: 0px;
    }
    .el-dropdown{
        color: #fff;
    }
    .passwordEdit.orgDropDown{
        width: 250px;
        padding-right:10px; 
        background: #fff !important;
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
            .vipTime{
                font-size: 14px;
                color: #612D00;
                float: right;
                margin-right: -20px;
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
            width: 120px;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
</style>
