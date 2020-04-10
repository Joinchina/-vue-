<template>
	<div id="weditOrg">
		<el-dialog class="dialog-form" title="编辑机构管理员" 
			:visible.sync="dialogEditOrg" 
			:close-on-click-modal="false"
			:before-close="close"
			@open="open">
			<el-form :model="ruleEditOrg" :rules="rules" ref="ruleEditOrg">
				<el-form-item label="姓名：" :label-width="labelWidth" prop="name">
					<el-input v-model.trim="ruleEditOrg.name" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别：" :label-width="labelWidth" prop="sex">
					<el-radio-group v-model="ruleEditOrg.sex">
				      	<el-radio label="男" ></el-radio>
				      	<el-radio label="女"></el-radio>
				    </el-radio-group>
				</el-form-item>
				<el-form-item label="手机号：" :label-width="labelWidth" prop="phone">
					<el-input v-model.trim="ruleEditOrg.phone" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('ruleEditOrg')">确定</el-button>
				<el-button @click="close">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import model from 'model/user/user_manage'
	import bus from '@/global/bus'

	export default {
		data() {
			return {
				ruleEditOrg: {
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
		props: ['dialogEditOrg', 'orgId', 'role', 'userId'],
		created() {
			
			// this.getUser();
		},
		methods: {
			open(){
				if(this.userId) {
					this.getUser();
				}
				
			},
			getUser () {
				let data = {
					id: this.userId
				}

				model.getUser(data, ( res => {
					// console.log("getuser", res);
					if( res.status == 200) {
						this.ruleEditOrg.name = res.data.name;
						this.ruleEditOrg.sex = res.data.sex;
						this.ruleEditOrg.phone = res.data.phone;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			close() {
				this.$emit('update:dialogEditOrg', false);
				this.resetForm('ruleEditOrg');
			},

			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.editOrg();
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

			editOrg (){
				let data = {
					id: this.userId,
					organizationId: this.orgId,
					role: this.role,
					name: this.ruleEditOrg.name,
					sex: this.ruleEditOrg.sex,
					phone: this.ruleEditOrg.phone
				}
				// console.log("editOrg",data);

				model.orgEditUser(data, ( res => {
					// console.log("editOrg", res);
					if( res.status == 200) {
						this.close();
						this.$emit("updateOrgUserList");
						bus.$emit("updateOrgUserList", "ORGADMIN");
					} else {
						this.$message.error(res.message);
					}
				}));
			}


		},

		watch: {
			// userId: 'getUser'
		}
	}
</script>