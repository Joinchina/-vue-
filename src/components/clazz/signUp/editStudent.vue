<template>
	<div>

	    <div class="editStudentBox">
            <el-dialog v-loading="loading" class="dialog-form w-wang" title="编辑学员信息" :visible.sync="dialogStudentInfo" :close-on-click-modal=false :before-close="closeCreate" @open="open">
                <h2>
                    基本信息<span>（系统必要填写，用户必须填写）</span>
                </h2>
                <el-form :model="formInfos" :rules="rules" ref="formInfos" class="demo-ruleForm" :label-width="labelWidth">
                    <el-form-item label="姓名：" prop="name" class="inlineFormItem">
                        <el-input type="text" v-model.trim="formInfos.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别：" prop="sex" class="inlineFormItem">
                        <el-radio-group v-model="formInfos.sex">
                            <el-radio label="男"></el-radio>
                            <el-radio label="女"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="手机号：" prop="phone" class="blockFormItem">
                        <el-input type="text" v-model.trim="formInfos.phone" autocomplete="off"></el-input>
                    </el-form-item>
                    <h2 v-if="Boolean(this.setInfo.optionalFields)&&Boolean(this.setInfo.optionalFields.length)">详细信息</h2>
                    <el-form-item v-for="(item,index) in setInfo.optionalFields" :key="index" v-if="item.selected" :label="item.name+'：'"  :prop="item.code" class="blockFormItem">
                        <el-input v-model.trim="formInfos[item.code]"></el-input>
                    </el-form-item>
                </el-form>
                    
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="saceEdit(true)">保存</el-button>
                    <el-button type="primary" @click="saceEdit(false)">保存并导入</el-button>
                    <el-button  @click="closeCreate">取消</el-button>
                </div>
            </el-dialog>
        </div>

	</div>
</template>
<script>
	import basicInfo from './info'
    import signUpHttp from '@/model/clazz/signUp'
	export default {
	    data() {
            let checkPhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入手机号'));
                }
                setTimeout(() => {
                    if(!(/^1[0345789]\d{9}$/.test(value))) {
                        callback(new Error('请输入正确的手机号'));
                    } else {
                        callback();
                    }
                }, 500)
            };
            let checkIdNumber=(rule, value, callback) => {
                if (!value||value.trim()==="") {
                    return callback(new Error('请填写身份证号码'));
                }else if((value.trim().length!=15&&value.trim().length!=18)||/[\u4E00-\u9FA5]/g.test(value)){
                    return callback(new Error('身份证信息有误'));
                }else{
                    callback();
                }
            };
            let checkEmail=(rule, value, callback) => {
                if (!value||value.trim()==="") {
                    return callback(new Error('请填写邮箱'));
                }else if(!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value)){
                    return callback(new Error('邮箱信息有误'));
                }else{
                    callback();
                }
            };
		    return {
                loading: false,
		        formInfos: {
                    name: '',
                    phone: '',
                    sex: ''
                },
                labelWidth:"110px",
                rules: {
                    name: [
                        {required: true,message:"请填写名字"},
                        {max: 12,message:"姓名不得超过十二个字"}
                    ],
                    phone: [
                        {required: true,validator: checkPhone, trigger: 'blur'}
                    ],
                    sex: [
                        {required: true,trigger: 'change',message:"请选择性别"}
                    ],
                    // idnumber:[
                    //     {required: true,validator: checkIdNumber,trigger: 'blur'}
                    // ],
                    // email:[
                    //     {required: true,validator: checkEmail,trigger: 'blur'}
                    // ]
                },
		    }
	    },

	    props: ['dialogStudentInfo','needEditStuInfo',"setInfo"],
	   	mounted() {
			   
        },
        created(){
            
        },
	    methods: {
            checkEmail(rule, value, callback){
                if (!value||value.trim()==="") {
                    if(rule.required){
                        return callback(new Error('请填写邮箱'));
                    }else{
                        return callback();
                    }
                }else if(!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value)){
                    return callback(new Error('邮箱信息有误'));
                }else{
                    return callback();
                }
            },
            checkIdNumber(rule, value, callback) {
                if (!value||value.trim()==="") {
                    if(rule.required){
                        return callback(new Error('请填写身份证号码'));
                    }else{
                        return callback();
                    }
                }else if((value.length!=15&&value.length!=18)||/[\u4E00-\u9FA5]/g.test(value)){
                    return callback(new Error('身份证信息有误'));
                }else{
                    return callback();
                }
            },
		    open() {
                console.log(Boolean(this.setInfo.optionalFields.length))
                if(this.setInfo){
                    this.setInfo.optionalFields.forEach(item=>{
                        if(item.selected){
                            if(item.code!="idnumber"&&item.code!="email"){
                                this.rules[item.code]=[{required:item.required,message:"请填写"+item.name}];
                            }else if(item.code=="email"){
                                this.rules[item.code]=[
                                    {required: item.required,validator: this.checkEmail,trigger: 'blur'},
                                ]
                            }else if(item.code=="idnumber"){
                                this.rules[item.code]=[
                                    {required: item.required,validator: this.checkIdNumber,trigger: 'blur'},
                                ]
                            }
                            
                            if(item.code=="schoolArea"){
                                this.labelWidth="140px";
                            }
                        }
                    })
                }
                for(let key in this.rules){
                    this.formInfos[key] = this.needEditStuInfo[key];
                }
                this.formInfos=JSON.parse(JSON.stringify(this.formInfos));
            },
            //保存
		    saceEdit(param){
                console.log(this.formInfos);
                console.log(this.rules)
                this.$refs["formInfos"].validate(validate=>{
                    if(validate){
                        this.modifyInfo(param);
                    }
                })

            },
            modifyInfo(flag){
                this.formInfos.identification = this.needEditStuInfo.identification;
                this.loading=true;
                signUpHttp.signUpEditUser(this.formInfos,(res)=>{
                    this.loading=false;
                    if(res.status==200){
                        this.$emit('update:dialogStudentInfo', false);
                        this.$emit('updateInfo');
                    }else{
                        this.$message.error(res.message);
                    }
                },flag)
            },
            //保存并导入
            saceEditImport(){
                this.formInfos.identification = this.needEditStuInfo.identification;
                this.loading=true;
                signUpHttp.signUpEditUser(this.formInfos,(res)=>{
                    this.loading=false;
                    if(res.status==200){
                        this.$emit('update:dialogStudentInfo', false);
                        this.$emit('updateInfo');
                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
		    closeCreate () {
		    	this.$emit('update:dialogStudentInfo', false);
		    },
	     

        },
        components:{
            basicInfo,
        },

	}
</script>
<style lang="less" scoped>
    .editStudentBox{
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
            background: url(/src/assets/img/clazz/emptyState.png) center center no-repeat;
            line-height: 800px;
            color: #999999;
            text-align: center;
        }
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
    .editStudentBox{
        .prompt{
            width: auto;
            .el-button--primary{
                padding: 10px 10px;
            }
        }
    }
    .prompt .yzmInput{
        width: 40%;
    }
    .inlineFormItem{
        display: inline-block;
        // width: 45%;
        // min-width: 230px;
    }
    .inlineFormItem:first-child{
        width: 60%;
    }
    .blockFormItem{
        width: 60%;
    }
</style>