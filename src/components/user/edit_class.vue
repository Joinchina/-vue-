<template>
	<div id="weditClass">
		<el-dialog class="dialog-form" title="编辑班主任" 
			:visible.sync="dialogEditClass" 
			:close-on-click-modal="false"
			:before-close="close"
			@open="open">
			<el-form :model="ruleEditClass" :rules="rules" ref="ruleEditClass">
				<el-form-item label="姓名：" :label-width="labelWidth" prop="name">
					<el-input v-model.trim="ruleEditClass.name" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别：" :label-width="labelWidth" prop="sex">
					<el-radio-group v-model="ruleEditClass.sex">
				      	<el-radio label="男" checked="checked"></el-radio>
				      	<el-radio label="女"></el-radio>
				    </el-radio-group>
				</el-form-item>
				<el-form-item label="手机号：" :label-width="labelWidth" prop="phone">
					<el-input v-model.trim="ruleEditClass.phone" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('ruleEditClass')">确定</el-button>
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
				ruleEditClass: {
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
		props: ['dialogEditClass', 'orgId', 'role', 'userId'],
		created() {
			
			// this.getUser();
		},
		methods: {
			open(){
				this.getUser();
			},
			
			getUser () {
				let data = {
					id: this.userId
				}

				model.getUser(data, ( res => {
					// console.log("getuser", res);
					if( res.status == 200) {
						this.ruleEditClass.name = res.data.name;
						this.ruleEditClass.sex = res.data.sex;
						this.ruleEditClass.phone = res.data.phone;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			close() {
				this.$emit('update:dialogEditClass', false);
				this.resetForm('ruleEditClass');
			},

			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.editClass();

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
			editClass (){
				let data = {
					id: this.userId,
					organizationId: this.orgId,
					role: this.role,
					name: this.ruleEditClass.name,
					sex: this.ruleEditClass.sex,
					phone: this.ruleEditClass.phone
				}
				// console.log("editClass",data);

				model.orgEditUser(data, ( res => {
					// console.log("editClass", res);
					if( res.status == 200) {
						this.close();
						this.$emit("updateClassUserList");
						bus.$emit("updateClassUserList", "CLAZZMANAGER");
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