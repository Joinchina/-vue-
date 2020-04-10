<template>
    <div>
        
        <el-dialog v-loading="loading" class="dialog-form w-wang previewPop" :title="setInfo.title" :visible.sync="dialogPreview" :close-on-click-modal=false :before-close="closeCreate" @open="open">
            <div style="position: relative">
                <p class="hintText endTimeText"><i class="el-icon-time"></i>报名截止时间：{{setInfo.endTime}}</p>
                <p :class="{hintText:true, introText:true,notClip:showMore}"  style="-webkit-box-orient: vertical;"><i class="el-icon-document"></i>{{setInfo.description}}</p>
                <span round :class="{'showMore':showMore,'packUp':!showMore}" @click="showToogle" v-if="textPShow">{{showMore?"展示更多":"收起"}}<span class="answer-more"></span></span>
            </div>
            <!-- //字段 -->
            <div class="previewFieldBox">
                <h2>
                    基本信息<span>（系统必要填写，用户必须填写）</span>
                </h2>
                <el-form  :inline="true" :rules="rules" ref="formInfos" class="demo-ruleForm">
                    <el-form-item label="姓名：" prop="name" label-width="110px" class="firstItem">
                        <el-input type="text" :readonly='true' autocomplete="off" style="width:300px;pointer-events: none;"></el-input>
                    </el-form-item>
                    <el-form-item label="性别：" prop="gender" label-width="110px">
                        <el-radio-group>
                            <el-radio label="男"></el-radio>
                            <el-radio label="女"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="手机号：" prop="phoneNum" class="prompt" label-width="110px">
                        <el-input type="text" :readonly='true' autocomplete="off" style="width:300px;pointer-events: none;"></el-input>
                        <el-button type="primary">获取验证码</el-button>
                    </el-form-item>
                </el-form>
                <h2 v-if="fieldArr.length>0">
                    详细信息
                </h2>
                <el-form label-width="110px">
                    <el-form-item v-for="(item,index) in fieldArr" :key="index" :class="{'is-required':item.require}" :label="item.title+'：'">
                        <el-input class="fieldInput" style="pointer-events: none;"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                loading: false,
                rules: {
                    name: [
                        {required: true,}
                    ],
                    phoneNum: [
                        {required: true}
                    ],
                    gender: [
                        {required: true,trigger: 'change'}
                    ]
                },
                showMore: true,
                textPShow: false
            }
        },
        props: ['dialogPreview','setInfo',"fieldArr"],
        mounted() {
               
        },
        methods: {
            open() {
                setTimeout(()=>{
                    let textP = document.querySelector('.introText');
                    this.textPShow=textP.scrollHeight-textP.clientHeight>10;
                },700)
            },
            showToogle(){
                this.showMore=!this.showMore;
            },
            saceEdit(){
                this.loading=true;
                this.$refs.basicInfo.submitForm(()=>{
                    this.loading=false;
                    this.$emit('update:dialogPreview', false);
                    this.$emit('updateInfo');
                })
            },
            closeCreate () {
                this.$emit('update:dialogPreview', false);
                this.showMore=true;
            },
         
        },
        components:{
        },
    }
</script>
<style scoped lang="less">
    @import "../../../assets/reset-element-ui/form.css";
    .w-wang {
        .text {
            width: 100%;
            height: 200px;
            border: 1px solid #F2F0F0;
        }
        .toolbar {
            width: 100%;
            background: #FCFDFF;
            border: 1px solid #F2F0F0;
            height: 50px;
        }
        .w-e-toolbar{
            .w-e-menu{
                padding: 17px 10px;
            }
        } 
    }
    .line{
        float:left;
        margin: 0 10px;
        color: #a3b1c5;
    }
    .sign-time{
        float: left;
    }
    .sign-time-r{
        padding-left: 8px;
    }
    .hintText{
        font-size: 14px;
        color: #666666;
        line-height: 20px;
        margin-bottom: 10px;
        font-family: PingFangSC-Regular;
        i{
            font-size: 16px;
            margin-right: 6px;
            vertical-align: baseline;
        }
    }
    .introText{
        padding-left: 40px;
        text-indent: -20px;
        padding-right: 20px;
        overflow: hidden;
        width: 90%;
        i{
            margin-left: 22px;
            margin-right: 0px;
        }
    }
    .notClip{
        position: relative; line-height: 20px; max-height: 40px;overflow: hidden;
    }
    .notClip:after{
        content: "..."; position: absolute; bottom: 0; right: 15px; padding-left: 70px;
        background: -webkit-linear-gradient(left, transparent, #fff 80%);
        background: -o-linear-gradient(right, transparent, #fff 70%);
        background: -moz-linear-gradient(right, transparent, #fff 65%);
        background: linear-gradient(to right, transparent, #fff 70%);
    }
    .endTimeText{
        text-align: center;
    }
    .previewFieldBox{
        padding: 20px;
        background: rgb(247,247,247);
        h2{
            font-size: 24px;
            line-height: 24px;
            font-family: PingFangSC-Regular;
            margin-bottom: 20px;
            color: #333333;
            span{
                font-size: 16px;
                color: #333333;
                letter-spacing: 0;
                display: inline-block;
                vertical-align: top;
                text-indent: 10px;
            }
            span.color{
                color: #009791;
            }
        }
    }
    .answer-more{
        background: url("../../../assets/img/icon/icon-more-t.png") no-repeat;
        width: 13px;
        height: 13px;
        display: inline-block;
        vertical-align: middle;
        transition: all .1s linear;
    }
    .showMore,.packUp{
        cursor: pointer;
        position: absolute;
        right: 10px;
        bottom: 0px;
        color: #399EFE;
    }
    .packUp{
        // background: url(../../../assets/img/clazz/packUp.png) center center no-repeat;
        // background-size: 100% 100%;
        .answer-more{
            transform: rotate(180deg);
        }
            
    }
</style>
<style lang="less">
    .previewPop.dialog-form{
        .el-dialog{
            width: 780px;
        }
        .el-dialog__header{
            height: auto;
        }
        .el-dialog__body{
            max-height: 700px;
        }
        .el-dialog__header,.el-dialog__title{
            text-align: center;
            background: #ffffff;
            font-size: 20px;
            color: #333333;
            font-weight: 600;
        }
        .el-dialog__body{
            padding: 0px;
            .el-button--primary{
                background: #289CF6;
                padding: 10px 20px;
                margin-left: 10px;
            }
        }
        .fieldInput{
            width: 300px;
        }
        .firstItem{
            margin-right: -30px;
        }
    }
</style>
