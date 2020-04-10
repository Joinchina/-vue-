<template>
    <div>
        <el-dialog :title="'申请'+(vipAccount ? '续约' : '开通')" :visible.sync="vipApplyDialog" :close-on-click-modal="false" class="dialog-form vipApplyDialog" :before-close="closeHandler">
            <el-form :model="form" :rules="rules" ref="vipApplyForm">
                <el-form-item label="机构名称" :label-width="formLabelWidth">
                    <span>{{orgName}}</span>
                </el-form-item>
                <el-form-item label="联系人" :label-width="formLabelWidth" prop="contact">
                    <el-input v-model.trim="form.contact" autocomplete="off" placeholder="最多十二字"></el-input>
                </el-form-item>
                <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
                    <el-input v-model="form.phone" autocomplete="off" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="职位" :label-width="formLabelWidth" prop="job">
                    <el-input v-model.trim="form.job" autocomplete="off" placeholder="最多三十字"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                    如有问题可直接联系：高老师：13301068776，刘老师：18601250775
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeHandler">取 消</el-button>
                <el-button type="primary" @click="saveVipApply">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 提交成功提示 -->
        <success :dialogsuccessVisible.sync="successshow"></success>
    </div>
</template>

<script>
    import httpRequest from '@/model/vipApply/index'
    import success from './successTip'
    export default {
        data() {
            var validatePhone = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入手机号'));
                } else {
                    if (!(/^1\d{10}$/.test(value))) {
                        callback(new Error('请输入正确的手机号'));
                    }
                    callback();
                }
            };
            return {
                form: {                     // form表单数据
                    contact: '',
                    job: '',
                    phone: '',
                },
                formLabelWidth: '120px',     //表单label长度
                rules: {
                    contact: [
                        { required: true, message: '请输入联系人姓名', trigger: 'blur' },
                        { max: 12, message: '姓名不能超过12个字', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true,validator: validatePhone, trigger: 'blur' }
                    ],
                    job: [
                        { required: true, message: '请输入职位', trigger: 'blur' },
                        { max: 30, message: '职位不能超过30个字', trigger: 'blur' }
                    ],
                },
                vipApplyVisible: this.vipApplyDialog,
                successshow: false,
            }
        },
        props:["vipApplyDialog","orgName","orgId","vipAccount"],
        created(){
            
        },

        methods:{
            saveVipApply(){
                this.$refs["vipApplyForm"].validate((valid) => {
                    if (valid) {
                        let data = {
                            // contact,       // 联系人
                            // phone,         // 手机号
                            // job,          // 职位
                            orgName : this.orgName,      // 机构名
                            organizationId : this.orgId ? this.orgId : ( localStorage.orgId ? JSON.parse(localStorage.orgId).identification : '' ),     // 机构id
                            type : this.vipAccount ? "CONTINUE" : "NEW",               //申请类型：CONTINUE（续约）；NEW（开通）
                            content: this.vipAccount ? "续约vip" : "申请vip",
                            ...this.form
                        }
                        httpRequest.saveVipApply(data,(res)=>{
                            if( res.status == 200 ){
                                this.closeHandler()
                                this.successshow = true;
                            }else{
                                this.$message.error(res.message)
                            }
                            
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                
            },
            closeHandler(){
                this.$refs.vipApplyForm.resetFields();
                this.$emit("update:vipApplyDialog",false);
            }
        },

        components:{
            success,
        }

        
    }
</script>

<style lang="less" scoped>
    @import "../../assets/reset-element-ui/form.css";
    // @import "../../assets/less/icon.less";
    // @import "../../assets/less/activity.less";
    
</style>
<style lang="less">
    .vipApplyDialog{
        .el-dialog__header{
            text-align: center;
        }
    }
</style>
