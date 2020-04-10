<template>
    <div id="zz-waddActivity">
		<el-dialog class="dialog-form" :title="editnav_title"
		:visible.sync="dialogAddAct"
        :close-on-click-modal="false"
        :before-close="close"
		>
            <div class="box clearfix">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
                    <el-form-item label="栏目名称："  prop="name">
                        <el-input v-model="ruleForm.name" auto-complete="off" placeholder="12个字以内" style="width: 100%;"></el-input>
                    </el-form-item>
                    <el-form-item label="展示在："  prop="region" >
                        <el-select v-model="ruleForm.region" placeholder="选择展示在学员端（管理端）" style="width: 100%;">
                            <el-option label="全部" value="ALL"></el-option>
                            <el-option label="学员端" value="STUDENT"></el-option>
                            <el-option label="管理端" value="MANAGER"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('ruleForm')">创 建</el-button>
                    <el-button @click="resetForm('ruleForm')">取 消</el-button>
                </div>
            </div>
		</el-dialog>		
	</div>
</template>
<script>
import model from 'model/help/help'
export default {
    data(){
        return {     
        ruleForm: {
                name: '',
                region: '',
            },
        rules: {
          name: [
            { required: true, message: '请输入标题名字', trigger: 'blur' },
            { min: 0, max: 12, message: '长度在 12个字之内', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择展示学员端（管理端）', trigger: 'blur' }
          ],
        },
        id:0,           
        }
    },
    
    props: ['dialogAddAct','editnav_title'],
    methods:{
        close() {
            this.$emit('update:dialogAddAct', false);
            this.ruleForm.name="";
            this.ruleForm.region="";
        },
        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //console.log(this.ruleForm)
            this.savelist(this.ruleForm)
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
        // 通过父组件传递过来的值处理编辑
        editnav(msg){
            //console.log(msg);
            this.ruleForm.name=msg.name;
            this.ruleForm.region=msg.deposition;
            this.id=msg.id;
        },
        //创建栏目
        savelist(n){
        let data={
            id:this.id,
            deposition:n.region,
            name:n.name,
        }
        model.helpColumnsave(data,(res=>{
            if(res.status==200){
             //console.log(res.data);
              this.$emit('passnavdata',res.data);
              this.close();
              this.$message({
                message: this.editnav_title+'成功',
                type: 'success'
              });
            }
        }))
        }
    }
}
</script>

<style  lang="less">
	@import "../../../assets/reset-element-ui/form.css";
	@import "../../../assets/less/icon.less";

	#zz-waddActivity {

		padding: 25px 15px;

		.box {
			width: 560px;
			margin: 0 auto;
			background-color: #fff;
			position: relative;
            z-index: 2;
            .dialog-footer{
                float: right
            }
		}
         .el-dialog{
             width: 50%;
         }
		
	}
</style>
