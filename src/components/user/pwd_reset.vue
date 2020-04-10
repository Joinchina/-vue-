<template>
	<div class="" id="pwdReset">
		<el-dialog class="dialog-form" title="重置密码"
			:visible.sync="dialogPwdReset"
			:close-on-click-modal="false"
			:before-close="close">
			<el-form :model="rulePwdReset" :rules="rules" ref="rulePwdReset">
				<el-form-item label="输入新密码：" :label-width="labelWidth" prop="pwd">
					<el-input v-model.trim="rulePwdReset.pwd" placeholder="至少6位字符" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认新密码：" :label-width="labelWidth" prop="pwd2">
					<el-input v-model.trim="rulePwdReset.pwd2" placeholder="至少6位字符" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('rulePwdReset')">确定</el-button>
				<el-button @click="close">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import model from 'model/user/user_manage'
	export default {
		data() {
			let validatePass2 = (rule,value, callback) => {
				if(value === "") {
					callback(new Error("请再次输入密码"));
				} else if(value !== this.rulePwdReset.pwd){
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};

			return {
				rulePwdReset: {
					pwd: "",
					pwd2: ""
				},
				rules: {
					pwd:[
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 6, max: 18, message: '密码在6-18位字符之间', trigger: 'blur'}
					],
					pwd2: [
						{ validator: validatePass2, trigger: 'blur' }
					]
				},
				labelWidth: "120px"
			}
		},
		props: ['dialogPwdReset','userId'],
		created() {

		},

		methods: {
			close() {
				this.$emit('update:dialogPwdReset', false);
				this.resetForm('rulePwdReset');
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.updatePwd();
						// alert('submit');
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			updatePwd() {
				let data = {
					userId : this.userId,
					plainPassword: this.rulePwdReset.pwd
				}

				model.updatePwd(data, ( res => {
					// console.log("updatePwd",res)
					if(res.status == 200) {
						this.close();
					} else {
						this.$message.error(res.message);
					}
				}));
			}
		}
	}
</script>
<style scoped lang="less">
	@import "../../assets/reset-element-ui/form.css";
</style>
