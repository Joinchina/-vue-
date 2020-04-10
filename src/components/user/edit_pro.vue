<template>
	<div id="weditPro">
		<el-dialog class="dialog-form" title="编辑项目管理员" 
			:visible.sync="dialogEditPro" 
			:close-on-click-modal="false"
			:before-close="close"
			@open="open">
			<el-form :model="ruleEditPro" :rules="rules" ref="ruleEditPro">
				<el-form-item label="姓名：" :label-width="labelWidth" prop="name">
					<el-input v-model.trim="ruleEditPro.name" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别：" :label-width="labelWidth" prop="sex">
					<el-radio-group v-model="ruleEditPro.sex">
				      	<el-radio label="男" checked="checked"></el-radio>
				      	<el-radio label="女"></el-radio>
				    </el-radio-group>
				</el-form-item>
				<el-form-item label="手机号：" :label-width="labelWidth" prop="phone">
					<el-input v-model.trim="ruleEditPro.phone" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('ruleEditPro')">确定</el-button>
				<el-button @click="close">关闭</el-button>
			</div>
		</el-dialog>

		
	</div>
</template>
<script>
	import model from 'model/user/user_manage'
	import bus from '@/global/bus'

	export default {
		data () {
 			return {
 				ruleEditPro: {
 					name: "",
					sex: "",
					phone: ""
 				},
 				rules: {
					name: [
						{ required: true, message: '请填写姓名', trigger: 'blur'},
						{ max: 12, message: '姓名不能超过12字'}
					],
					// sex: [
					// 	{ required: true, message:'请选择性别', trigger: 'change'}
					// ]
				},
				labelWidth: "120px"
 			}
		},
		props: ['dialogEditPro', 'userId','orgId', 'role'],
		created() {
			// if(!!uid) {
			// 	this.getUser();
			// }
			
		},
		methods: {
			open(){
				this.getUser();
			},
			resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },
			getUser () {

				let data = {
					id: this.userId
				}

				// console.log("121212",this.userId);

				model.getUser(data, ( res => {
					// console.log("getuser", res);
					if( res.status == 200) {
						this.ruleEditPro.name = res.data.name;
						this.ruleEditPro.sex = res.data.sex;
						this.ruleEditPro.phone = res.data.phone;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			close() {
				this.$emit('update:dialogEditPro', false);
				this.resetForm('ruleEditPro');

			},

			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.editPro();
						// alert('submit');
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},

			editPro (){
				let data = {
					id: this.userId,
					role: this.role,
					name: this.ruleEditPro.name,
					sex: this.ruleEditPro.sex,
					phone: this.ruleEditPro.phone
				}
				// console.log("addOrg",data);

				model.orgEditUser(data, ( res => {
					// console.log("editPro", res);
					if( res.status == 200) {
						
						this.close();
						this.$emit("updateProUserList");
						bus.$emit("updateProUserList", "PROJECTADMIN");
					} else {
						this.$message.error(res.message);
					}
				}));
			}
		},

		watch: {
			userId: 'getUser'
		}
	}
</script>
<style>
	
</style>