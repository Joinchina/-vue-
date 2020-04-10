<template>
    <div class="stepsPage">
        <Goback :passtitle="passtitle"></Goback>
        <div class="inner" v-loading="fetching" v-if="!(activeSteps==3)">
            <el-steps :active="activeSteps" finish-status="success" align-center  class="signUpSteps">
                <el-step v-for="(item,index) in stepsItem" :key="index" :title="item.title"></el-step>
            </el-steps>
            <!-- <router-view></router-view> -->
            <div class="infoBox">
                <transition-group name="el-fade-in-linear">
                    <stepsOne key="1" v-if="activeSteps==0" ref="stepsOne" :setInfo="setInfo" :activeSteps.sync=activeSteps></stepsOne>
                    <stepsTwo key="2" v-if="activeSteps==1" ref="stepsTwo" :setInfo="setInfo" :activeSteps.sync=activeSteps></stepsTwo>
                    <stepsSuccess key="3" v-if="activeSteps==2" ref="stepsSuccess" :activeSteps.sync=activeSteps></stepsSuccess>
                </transition-group>
            </div>
            <div class="btnGroup">
                <el-button type="primary" @click="nextStep" v-if="activeSteps!=1">下一步</el-button>
                <el-button @click.stop="lastStep" :disabled="!(activeSteps>0)" v-if="activeSteps==1">上一步</el-button>
                <el-button v-if="activeSteps==1" @click.stop="preview">预览</el-button>
                <el-button type="primary" v-if="activeSteps==1" @click.stop="openRegistration">开启报名</el-button>
            </div>
        </div>
        <tableList v-if="activeSteps==3"></tableList>
    </div>
</template>

<script>
    import Goback from 'base/goback/goback'
    import stepsOne from "./info"
    import stepsTwo from "./field"
    import stepsSuccess from "./success"
    import tableList from "./table"
    import httpFetch from '@/model/clazz/signUp'
    import {getToken} from '@/filters/userVerify'
    export default {
        data(){
            return {
                passtitle:'学员报名',
                stepsItem:[
                    {title:"设置报名信息"},
                    {title:"设置报名字段"},
                    {title:"下发报名二维码"},
                    {title:"查看、导入报名结果"},
                ],
                activeSteps:null,
                fetching: true,
                setInfo:null,
            }
        },
        created(){
            this.hasSetInfo();
        },
        methods:{
            nextStep(){
                if(this.activeSteps==0){
                    this.$refs.stepsOne.submitForm(()=>{
                        this.activeSteps=1;
                        this.hasSetInfo(false);
                    });
                }else if(this.activeSteps==2){
                    httpFetch.qRCode({clazzId:Number(this.$route.query.clazzId)},(res)=>{
                        if(res.status==200){
                            this.activeSteps++
                            this.setInfo= res.data;
                        }else{
                            this.$message.error(res.message);
                        }
                    })
                }
            },
            lastStep(){
                this.fetching=true;
                this.$refs.stepsTwo.setFields(false,()=>{
                    this.activeSteps=0
                    this.hasSetInfo(false);
                });
            },
            openRegistration(){
                this.$confirm('确认开启报名?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // this.activeSteps++;
                    this.fetching=true;
                    this.$refs.stepsTwo.setFields(true,()=>{
                        this.fetching=false;
                        this.activeSteps=2;
                    });
                }).catch(() => {});
            },
            //获取班级已设置的信息
            hasSetInfo(init=true){
                let data ={
                    clazzId: this.$route.query.clazzId,
                    includeFields:true,
                }
                httpFetch.viewInfo(data,res=>{
                    console.log(res);
                    this.fetching=false;
                    if(res.status==200){
                        //res.data.step-1
                        if(init){
                            this.activeSteps = res.data.step-1;
                        }
                        this.setInfo= res.data;
                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
            //预览
            preview(){
                this.$refs.stepsTwo.dialogPreview=true;
            },
        },
        
        components:{
            Goback,
            stepsOne,
            stepsTwo,
            stepsSuccess,
            tableList
        }
    }
</script>

<style lang="less" scoped>
    .stepsPage{
        .inner{
            margin-top: 15px;
            padding: 30px 120px;
            background: #FFFFFF;
            .infoBox{
                width: 80%;
                margin: 0 auto;
            }
        }
        .btnGroup{
            text-align: center;
        }
    }
</style>
<style lang="less">
    .signUpSteps {
        margin-bottom: 50px;
        .el-step__head.is-process,.el-step__head.is-success{
            .el-step__line-inner{
                border-color:#67B6FF;
            }
            color: #1279D8;
           .el-step__icon.is-text{
               background: #67B6FF;
           } 
        }
        .el-step__head.is-success{
            .el-step__line-inner{
                border-width: 1px !important;
                width: 100% !important;
            }
        }
        .el-step__icon.is-text{
            width: 36px;
            height: 36px;
            font-size:20px;
            background: #E2E1E1;
            border:0 none;
            color: #FFFFFF;
            font-weight:normal;
        }
        .el-step.is-horizontal .el-step__line{
            top: 17px;
        }
        .el-step__title.is-process,.el-step__title.is-success{
            font-weight: normal;
            color: #1279D8;
        }
        .el-step__main{
            margin-top: 20px;
            font-size: 18px;
        }
        .el-step__line{
            background-color: #EFEFEF;
        }
    }
</style>

