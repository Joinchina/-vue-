<template>
    <div class="callbox">
        <!-- Form -->       
        <el-dialog 
        title="联系专家申请" 
        :visible.sync="chatexpertshow"
        :before-close="close"
        :close-on-click-modal="false"
        width="40%"
        class="dialog-form"
        >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">                
                <h1>温馨提示：请填写信息，我们将尽快反馈给专家并跟您进行联系</h1>                                
                <el-form-item label="机构名称：" :label-width="formLabelWidth" prop="organizationName">
                    <el-input v-model="ruleForm.organizationName "  auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系人：" :label-width="formLabelWidth" prop="contact">
                    <el-input v-model="ruleForm.contact " auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话：" :label-width="formLabelWidth" prop="telephone">
                    <el-input v-model="ruleForm.telephone " auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目名称：" :label-width="formLabelWidth" prop="projectName">
                    <el-input v-model="ruleForm.projectName " auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目类型：" :label-width="formLabelWidth" prop="projectType">
                    <el-input v-model="ruleForm.projectType " auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目周期：" :label-width="formLabelWidth" prop="endDate">
                    <template>
                         <div class="block">
                            <el-date-picker
                            v-model="time"
                            type="daterange"
                            @change="gettime"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </template>
                </el-form-item>               
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary"   @click="submitForm('ruleForm')">提 交</el-button>
                <el-button  @click="resetForm('ruleForm')">关 闭</el-button>            
            </div>
        </el-dialog>
    </div>
</template>
<script>
import model from'@/model/expert/expert'
export default {
   data () {
       var fenvalphone=(rule,value,callback)=>{
            if(!(/^1(3|4|5|7|8|6|9)\d{9}$/.test(value))){               
                return callback(new Error('手机号码有误，请重新输入'));                                      
            }else{
                callback();
            }
        }

       return {
            dialogFormVisible: false,
            ruleForm: {
                contact:'', 
                endDate:'', 
                expertId:'',
                organizationName:'', 
                projectName:'', 
                projectType:'', 
                startDate:'', 
                telephone:'', 
            },
            time:[],
            formLabelWidth: '120px',
            rules: {
                organizationName:[
                    {required: true, message: '请输入机构名称', trigger: 'blur' },
                ],
                contact: [
                    { required: true, message: '请选择输入联系人', trigger: 'blur' }
                ],          
                telephone: [
                    {required: true, message: '请输入电话号码', trigger: 'blur' },
                    {validator: fenvalphone,trigger: 'blur'}
                ],
                projectName:[
                    {required: true, message: '请输入项目名称', trigger: 'blur' },
                ],
                projectType:[
                    {required: true, message: '请输入项目类型', trigger: 'blur' },
                ],
                endDate:[
                    {required: true, message: '请选择时间', trigger: 'blur' },
                ],                                
            }
       }
   },
   props: ['chatexpertshow','expertid'],
   methods:{
       //关闭模态框
       close () { 
        this.$emit('update:chatexpertshow', false);
      },
      //获取时间
      gettime(){
          this.ruleForm.startDate=this.dateFormatStr(this.time[0]);
          this.ruleForm.endDate=this.dateFormatStr(this.time[1]);
      },
      //时间转化
      dateFormatStr(date){
        let d = new Date(date);
        return d.getFullYear() + '-' + ((d.getMonth() + 1)<10?'0'+(d.getMonth() + 1):(d.getMonth() + 1)) + '-' + (d.getDate()<10?'0'+d.getDate():d.getDate());
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addapply();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.close();
      },
        //提交申请
      addapply(val){
          this.ruleForm.expertId=this.expertid;
          let data=this.ruleForm;
          model.applyadd(data,(res)=>{
              if(res.status==200){
                this.$emit("expertlistsuccess");
                //   清空表单
                this.time=[];
                this.resetForm('ruleForm')
              }
          })
      },
   }, 
}
</script>
<style lang="less">
@import "../../assets/reset-element-ui/form.css";
.callbox{
    .el-dialog__body{
        padding: 14px 42px 20px 15px;
        h1{
            font-size: 14px;
            color: #666666;
            margin-left: 44px;
            margin-bottom: 13px;
        }
    }
}
</style>


