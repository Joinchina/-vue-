<template>
    <div class="fieldBox">
        <h2>
            基本信息<span>（系统必要填写，用户必须填写）</span>
        </h2>
        <el-form :model="formInfos"  :inline="true" :status-icon="false" :rules="rules" :show-message="false" ref="formInfos" class="demo-ruleForm" label-width="100px">
            <el-form-item label="姓名：" prop="name">
                <el-input type="text" v-model="formInfos.name" :readonly='true' autocomplete="off" style="width:200px;pointer-events: none;"></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="gender">
                <el-radio-group v-model="formInfos.gender">
                    <el-radio label="男" style="pointer-events: none;"></el-radio>
                    <el-radio label="女" style="pointer-events: none;"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="手机号：" prop="phoneNum" class="prompt">
                <el-input type="text" v-model="formInfos.phoneNum" :readonly='true' autocomplete="off" style="width:200px;pointer-events: none;"></el-input>
            </el-form-item>
        </el-form>
        <h2>
            详细信息<span class="color">（请从下方左侧窗口进行勾选）</span>
        </h2>
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="checkWrap">
                    <header>可选信息</header>
                    <el-checkbox-group v-model="checkList" @change="checkedChange">
                        <el-checkbox v-for="(item,index) in fieldStr.split('、')" :key="index" :label="item" class="checkboxitem"></el-checkbox>
                    </el-checkbox-group>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="emptyBox" v-if="checkList.length==0">
                    请从左侧窗口进行勾选~
                </div>
                <el-form label-width="130px">
                    <el-form-item v-for="(item,index) in fieldArr" :key="index" :label="item.title+'：'">
                        <el-input class="fieldInput" style="pointer-events: none;"></el-input>
                        <el-checkbox v-model="item.require" class="requireChecked">必填</el-checkbox>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <preview :dialogPreview.sync="dialogPreview" :setInfo="setInfo" :fieldArr="fieldArr"></preview>
    </div>
</template>

<script>
    import httpFetch from '@/model/clazz/signUp'
    import preview from './preview'
    export default {
        data(){
            return {
                formInfos: {
                    name: '',
                    phoneNum: '',
                    gender: ''
                },
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
                fieldArr:[],
                fieldStr:"单位、学科、学段、身份证号、职称、职务、民族、省、市、区县、QQ、工作电话、电子邮箱、微信号、学校类别、学校所在区域、证书编号、最高学历、毕业学校、所学专业",
                checkList:[],
                codeDictionary:{
                    "证书编号": "certificateCode",
                    "市": "city",
                    "最高学历": "degree",
                    "职务": "duty",
                    "电子邮箱": "email",
                    "身份证号":"idnumber",
                    "毕业学校": "graduateSchool",
                    "学段": "learningStage",
                    "所学专业": "major",
                    "民族": "nation",
                    "省": "province",
                    "QQ": "qq",
                    "学校所在区域": "schoolArea",
                    "学校类别": "schoolType",
                    "性别": "sex",
                    "职称": "title",
                    "区县": "township",
                    "微信号": "wechat",
                    "单位": "workPlace",
                    "工作电话": "workTel",
                    "学科": "subject"
                },
                dialogPreview:false,
            }
        },
        props:["activeSteps","setInfo"],
        created(){
            
        },
        mounted(){
            this.setInfo.optionalFields.forEach(item=>{
                if(item.selected){
                    this.checkList.push(item.name);
                    this.fieldArr.push({title:item.name,code:this.codeDictionary[item.name],require:item.required});
                }
            })
        },
        methods:{
            setFields(startSignUp=true,call=()=>{}){
                console.log(this.fieldArr);
                // if(this.fieldArr.length<1){
                //     call();
                //     return
                // }
                let data ={
                    clazzId:this.$route.query.clazzId,
                    startSignUp: startSignUp,
                };
                let dealFields=[];
                this.fieldArr.forEach(item=>{
                    dealFields.push({code:item.code,required:item.require});
                });
                data.fields = dealFields;
                httpFetch.setFields(data,res=>{
                    if(res.status==200){
                        call();
                    }else{
                        this.$message.error(res.message);
                    }
                })
                console.log(data);
            },
            checkedChange(){
                console.log(this.checkList);
                if(this.fieldArr.length>this.checkList.length){
                    this.fieldArr.forEach((item,index)=>{
                        if(!(this.checkList.includes(item.title))){
                            this.fieldArr.splice(index,1);
                        }
                    })
                }else{
                    this.checkList.forEach(item=>{
                        if(!this.fieldArr.some(obj=>{return obj.title==item})){
                            this.fieldArr.push({title:item,code:this.codeDictionary[item],require:true})
                        }
                    })
                }
            },
        },
        components:{
            preview,
        },
    }
</script>

<style lang="less" scoped>
    .fieldBox{
        // width: 120%;
        margin-bottom: 40px;
        h2{
            font-size: 24px;
            line-height: 24px;
            font-family: PingFangSC-Regular;
            margin-bottom: 40px;
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
        .checkWrap{
            border: 1px solid #D1DBE5;
            border-radius: 4px;
            header{
                background: rgb(226,231,238);
                height: 50px;
                line-height: 50px;
                font-size: 18px;
                color: #333333;
                text-align: center;
            }
            .checkboxitem{
                display: block;
                height: 40px;
                line-height: 40px;
                border-top: 1px solid #EFEFEF;
                margin-left: 0;
                text-align: center;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .fieldInput{
            width: 60%;
            margin-right: 20px;
        }
        .emptyBox{
            height: 600px;
            background: url(../../../assets/img/clazz/emptyState.png) center center no-repeat;
            line-height: 800px;
            color: #999999;
            text-align: center;
        }
    }
    .prompt::after{
        content: "（需要用户使用填写的手机号验证）";
        display: inline-block;
        font-size: 16px;
        color: #333333;
        line-height: 16px;
        text-indent: 30px;
    }
</style>

<style lang="less">
    .checkboxitem{
        .el-checkbox__label{
            width: 80px;
            font-size: 16px;
            color: #333333;
        }
    }
    .requireChecked{
        .el-checkbox__inner{
            border-radius: 50%;
        }
    }
</style>

