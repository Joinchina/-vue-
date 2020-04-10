<template>
    <div v-loading="lodingF">
        <el-form :model="formInfos" status-icon :rules="rules" ref="formInfos" class="demo-ruleForm" label-width="120px">
            <el-form-item label="报名标题" prop="signupTitle">
                <el-input type="text" v-model="formInfos.signupTitle" autocomplete="off"  placeholder="50字以内"></el-input>
            </el-form-item>
            <el-form-item label="报名截止时间" prop="endTime">
                <el-date-picker class="timeInput" :clearable="false" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期" v-model="formInfos.endTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="报名说明" prop="intro" class="signUpintro">
                <el-input v-model="formInfos.intro" type="textarea" :autosize="{ minRows:10}"  placeholder="2000字以内"></el-input>
                <span class="smallCount">字数：<b>{{letterCount}}</b>/2000</span>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import httpFetch from '@/model/clazz/signUp'
    export default {

        data(){
            let checkTitle = (rule, value, callback) => {
                if (!value||value.trim()==="") {
                    return callback(new Error('报名标题不能为空'));
                }else if(value.length>50){
                    return callback(new Error('报名标题不能超过50字'));
                }else{
                    callback();
                }
            };
            let checkEndTime = (rule, value, callback) => {
                if (!value||value==="") {
                    callback(new Error('报名结束时间不能为空'));
                } else {
                    if (new Date(value).getTime()< new Date().getTime()) {
                        callback(new Error('报名结束时间不得小于当前时间'));
                    }
                    callback();
                }
            };
            let checkIntro = (rule, value, callback) => {
                if (!value||value.trim()==="") {
                    callback(new Error('报名说明不能为空'));
                } else if (value.length>2000) {
                    callback(new Error('报名说明不能超过2000字!'));
                } else {
                    callback();
                }
            };
            return {
                formInfos: {
                    signupTitle: '',
                    endTime: '',
                    intro: ''
                },
                rules: {
                    signupTitle: [
                        { required: true,validator: checkTitle, trigger: 'blur' }
                    ],
                    endTime: [
                        { type: 'date',required: true,validator: checkEndTime, trigger: 'blur' }
                    ],
                    intro: [
                        {type: 'text', required: true,validator: checkIntro, trigger: 'blur' }
                    ]
                },
                letterCount:0,
                lodingF:false
            }
        },
        props:["activeSteps","setInfo"],
        created(){
            console.log(111);
            
        },
        watch:{
            formInfos:{
                handler(newVal){
                    this.letterCount=typeof newVal.intro=="string"?newVal.intro.length:0;
                    
                },
                deep:true,
            }
        },
        mounted(){
            console.log(22);
            if(this.setInfo){
                this.formInfos.signupTitle = this.setInfo.title;
                this.formInfos.endTime = this.setInfo.endTime;
                this.formInfos.intro = this.setInfo.description
            }
        },
        methods:{
            submitForm(call) {
                this.$refs["formInfos"].validate((valid) => {
                    if (valid) {
                        this.lodingF=true
                        console.log(httpFetch)
                        let data = {
                            title: this.formInfos.signupTitle,
                            endTime: this.formInfos.endTime,
                            description: this.formInfos.intro,
                            clazzId: this.$route.query.clazzId,
                            title: this.formInfos.signupTitle,

                        }
                        httpFetch.setInfo(data,res=>{
                            call();
                            this.lodingF=false;
                            if(res.status==200){
                            }else{
                                this.$message.error(res.message);
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        },
        
        components:{
        }
    }
</script>

<style lang="less" scoped>
    .timeInput{
        width: 50% !important;
    }
    .smallCount{
        color: #A3B1C5;
        position: absolute;
        right: 10px;
        bottom: 0px;
        b{
            font-weight: normal;
            color: #FD7E23;
        }
    }
</style>
<style lang="less">
    .el-picker-panel__footer{
        .el-button--text{
            display:none;
        }
    } 
    .signUpintro{
        .el-textarea__inner{
            padding-bottom: 30px;
            word-break: break-all;
        }
    }
</style>
