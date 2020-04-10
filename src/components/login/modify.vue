<template>
	<div id="j-table">
		 <el-dialog class="dialog-form j-add-clazz w-wang" title="一健修改密码"
               :visible.sync = "dialogModifyWord"
               :close-on-click-modal="false"
               :before-close="close"
               @open="open">
               <el-form :model="ruleModifyWord" :rules="rules" ref="ruleModifyWord" v-loading="loading"
               element-loading-text="拼命加载中">
               		<h1>
               			<img src="../../assets/img/icon/tanhao.png" alt="">&nbsp;&nbsp;提示：修改时会修改所有账号的密码哦~
               		</h1>
			        <el-form-item label="输入新密码：" :label-width="labelWidth" prop="name">
			          <el-input type="password" v-model.trim="ruleModifyWord.name" placeholder="" auto-complete="off"></el-input>
			        </el-form-item>
			        <el-form-item label="确认新密码：" :label-width="labelWidth" prop="password">
			            <el-input type="password" v-model.trim="ruleModifyWord.password" placeholder="" auto-complete="off"></el-input>
			        </el-form-item>
               </el-form>
               <div slot="footer" class="dialog-footer">
			        <el-button type="primary" @click="!loading &&submitForm('ruleModifyWord')">确定</el-button>
			        <el-button  @click="close">取消</el-button>
      			</div>
         </el-dialog>
	</div>
</template>
<script>
	import model from '@/model/login/login'
	import storage from '@/global/storage';
	export default{
		props:["dialogModifyWord"],
		created(){

		},
		data(){
			let validatePass2 = (rule,value, callback) => {
				if(value === "") {
					callback(new Error("请再次输入密码"));
				} else if(value !== this.ruleModifyWord.name){
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return{
				ruleModifyWord: {
		          name: "",
		          password: ""
		        },
		        rules: {
		          name: [
		            { required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 6, max: 18, message: '密码在6-18位字符之间', trigger: 'blur'}
		          ],
		          password:[
		          	{ required: true, message: '请再次输入密码', trigger: 'blur'},
		          	{ validator: validatePass2, trigger: 'blur' }
		          ]
        		},
        		loading:false,
        		labelWidth: "120px",

			}
		},
		methods:{
			open(){

			},
			close () {
		        this.$emit('update:dialogModifyWord', false);
		    },
		    submitForm(formName){
		    	this.$refs[formName].validate((valid) => {
		          if(valid) {
		            this.updateWord();
		            // alert('submit');
		          } else {
		            console.log('error submit!!');
		            return false;
		          }
        		})
		    },
		    updateWord(){
		    	let userId = Number(storage.get("exp_userId"));
		    	let data = {
		    		userId:userId,
		    		plainPassword:this.ruleModifyWord.password
		    	}
		    	model.updateOwnPassWord(data,(res=>{
		    		console.log("res");
		    		console.log(res);
		    		if(res.status == 200){
		    			this.$message({
	                        type: 'success',
	                        message: '修改密码成功'                       
                    	});  
		    			this.close();
		    			//数据清空
		    			this.$refs["ruleModifyWord"].resetFields();
		    			// this.ruleModifyWord.name = "";
		    			// this.ruleModifyWord.

		    		}else{
		    			this.$message.error(res.message);
		    		}
		    	}))
		    }
		}

	}
</script>
<style type="text/css" lang="less">
	@import "../../assets/reset-element-ui/form.css";
	h1{
		font-size: 16px;
		color: #333;
		padding:0 0 25px 0;
		img{
			vertical-align: text-bottom;
		}
	}
	#j-table .el-form-item__label{
		color: #666!important;
	}
</style>