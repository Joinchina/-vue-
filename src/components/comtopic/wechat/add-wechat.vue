<template>
	<div>
		<el-dialog class="dialog-form chat-form"
			title="添加微信绑定机构"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open"
			:visible.sync="dialogAddWechat">
			<el-form :model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				v-loading="loading"
				:element-loading-text="$globalParam.loadText"
			    :element-loading-spinner="$globalParam.loadSpinner"
			    :element-loading-background="$globalParam.loadText" >

				<el-form-item :label-width="labelWidth" prop="wechatNumber">
					<el-input v-model.trim="ruleForm.wechatNumber" placeholder="微信号:openid" style="width:90%"></el-input>
				</el-form-item>

				<el-form-item :label-width="labelWidth" prop="organizationId">
					<el-input v-model.trim="ruleForm.organizationId" placeholder="机构id:" style="width:90%"></el-input>
				</el-form-item>

			</el-form>

			<div slot="footer" class="dialog-footer">
		        <el-button type="primary" @click="!loading && submitForm('ruleForm')">确定</el-button>
		        <el-button @click="close">取消</el-button>
		    </div>
		</el-dialog>
	</div>
</template>
<script>
	import Model from '@/model/wechat/wechat';
	import { delTip } from '@/global/open';
	
	export default{
		props:["dialogAddWechat"],

		data(){
			return{
				ruleForm: {
					wechatNumber: "",
					organizationId:""
				},

				rules: {
					wechatNumber: [
						{ required: true, message: '请输入微信号' , trigger: 'blur'}
					],
					organizationId: [
						{ required: true, message: '请输入机构id' , trigger: 'blur'}
					],
				},
				labelWidth:"",

				loading:false
			}
		},

		methods:{

			close () {
				this.$emit('update:dialogAddWechat', false);
			},

			open() {
				this.loading = false;
			},

			submitForm(formName){
				this.$refs[formName].validate((valid) => {
					console.log(!!valid);
					if(!!valid) {
						console.log("valid", valid);
						this.checkWechatBind();
						//this.addWechat();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},

			checkWechatBind(){
				let data = {
		    		openid: this.ruleForm.wechatNumber,
		    		organizationId: this.ruleForm.organizationId
		    	}
		    	this.loading = true;

		    	Model.checkWechatBind(data, (res => {

		    		this.loading = false;

		    		//表示可以正常提交
		    		if(res.data.status == "ok"){

		    			this.addWechat();

		    		//表示信息错误不能提交
		    		}else if(res.data.status == "error"){

		    			this.$message.error("信息错误，不能提交");

		    		//表示要确认提交
		    		}else if(res.data.status == "confirm"){
		    			console.log("confirm");
		    			let str = "是否确认重新绑定该机构";
      					delTip(this, str, this.addWechat);
      					
		    		}
		    	}))
			},

			addWechat(){
				console.log("点击确定");
				//先确定需不需要进行确定按钮


				let data = {
		    		openid: this.ruleForm.wechatNumber,
		    		organizationId: this.ruleForm.organizationId
		    	}
		    	this.loading = true;

		    	Model.bindWechat(data, (res => {
		    		if(res.status == 200){

		    			this.close();
						this.$emit('updateList');
						this.$message.success("微信绑定机构成功！");


						//列表数据更新
						this.$emit("updataWechatList")

						//清空数据
						this.ruleForm.wechatNumber = "";
						this.ruleForm.organizationId = "";

		    			this.loading = false;

		    		}else{
		    			this.$message.error(res.message);

		    			//清空数据
						this.ruleForm.wechatNumber = "";
						this.ruleForm.organizationId = "";
						
		    			this.loading = false;
		    		}
		    	}))
			}
		},
	}
</script>
<style scopped lang="less">
	.chat-form .el-dialog{
		width: 35%!important;
	}
</style>