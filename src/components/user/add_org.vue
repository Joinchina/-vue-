<template>
	<div id="waddOrg">
		<el-dialog class="dialog-form" title="新增机构管理员"
			:visible.sync="dialogAddOrg"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open">
			<el-form :model="ruleAddOrg" :rules="rules" ref="ruleAddOrg"
					v-loading="loading"
					element-loading-text="拼命加载中">
				<el-form-item label="姓名：" :label-width="labelWidth" prop="name">
					<el-input v-model.trim="ruleAddOrg.name" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别：" :label-width="labelWidth" prop="sex">
					<el-radio-group v-model="ruleAddOrg.sex">
				      	<el-radio label="男" checked="checked"></el-radio>
				      	<el-radio label="女"></el-radio>
				    </el-radio-group>
				</el-form-item>
				<el-form-item label="手机号：" :label-width="labelWidth" prop="phone">
					<el-input v-model.trim="ruleAddOrg.phone" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="!loading && submitForm('ruleAddOrg')">确定</el-button>
				<el-button @click="close">关闭</el-button>
			</div>
		</el-dialog>

		<!-- 添加成功 -->
		<add-succ
			:dialogAddSucc.sync = "dialogAddSucc"
			title="新增机构管理员"
			:name="name"
			:username="username"
			:userPassword = "userPassword"></add-succ>
	</div>
</template>
<script>
	import model from 'model/user/user_manage'
	import addSucc from 'components/user/add_succ'

	export default {
		data() {
			return {
				username: "",
				name: "",
				userPassword: "",
				dialogAddSucc: false,
				ruleAddOrg: {
					name: "",
					sex: "女",
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
				labelWidth: "120px",
				loading: false
			}
		},
		props: ['dialogAddOrg', 'orgId', 'role'],
		created() {

		},
		methods: {
			open() {
				this.loading = false;
			},
			close() {
				this.$emit('update:dialogAddOrg', false);
				this.resetForm('ruleAddOrg');
			},

			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.addOrg();
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

			addOrg (){
				let data = {
					organizationId: this.orgId,
					role: this.role,
					name: this.ruleAddOrg.name,
					sex: this.ruleAddOrg.sex,
					phone: this.ruleAddOrg.phone
				}
				// console.log("addOrg",data);
				this.loading = true;
				model.orgAddUser(data, ( res => {
					// console.log("addOrg", res);
					if( res.status == 200) {
						this.username = res.data.username;
						this.name = res.data.name;
						this.userPassword = res.data.userPassword;
						this.close();
						this.$emit("updateOrgUserList");

						// 初始值清空
						this.ruleAddOrg.name="";
						this.ruleAddOrg.sex="";
						this.ruleAddOrg.phone="";

						this.loading = false;
						// 显示成功弹出框
						this.dialogAddSucc = true;
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
				}));
			}


		},

		components: {
			addSucc
		}
	}
</script>
