<template>
	<div id="waddClass">
		<el-dialog class="dialog-form" title="新增班主任"
			:visible.sync = "dialogAddClass"
			:close-on-click-modal="false"
			:before-close="close"
               @open="open">
			<el-form :model="ruleAddClass" :rules="rules" ref="ruleAddClass" v-loading="loading"
               element-loading-text="拼命加载中">
				<el-form-item label="姓名：" :label-width="labelWidth" prop="name">
					<el-input v-model.trim="ruleAddClass.name" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别：" :label-width="labelWidth" prop="sex">
					<el-radio-group v-model="ruleAddClass.sex">
				      	<el-radio label="男" checked="checked"></el-radio>
				      	<el-radio label="女"></el-radio>
				    </el-radio-group>
				</el-form-item>
				<el-form-item label="手机号：" :label-width="labelWidth" prop="phone">
					<el-input v-model.trim="ruleAddClass.phone" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="!loading &&submitForm('ruleAddClass')" >确定</el-button>
				<el-button @click="close">关闭</el-button>
			</div>
		</el-dialog>

		<!-- 添加成功 -->
		<add-succ
			:dialogAddSucc.sync = "dialogAddSucc"
			title="新增班主任"
			:name="name"
			:username="username"
			:userPassword="userPassword"></add-succ>
	</div>
</template>

<script>
	import model from 'model/members/members'
	import addSucc from 'components/user/add_succ'
  import {getCurRole} from '../../filters/userVerify'

	export default {
		data() {
			return {
				username: "",
        getRole:"",
				name: "",
				userPassword: "",
				dialogAddSucc: false,
				ruleAddClass: {
					name: "",
					sex: "女",
					phone: ""
				},
				rules: {
					name: [
						{ required: true, message: '请填写姓名', trigger: 'blur'},
						{ max: 12, message: '姓名不能超过12字'}
					],
				},
        loading:false,
				labelWidth: "120px"
			}
		},
		props: ['dialogAddClass', 'clazzId', 'role'],
		created() {
      console.log("role" + getCurRole());
		},
		methods: {
      open() {
        this.loading = false;
      },
			close() {
				this.$emit('update:dialogAddClass', false);
			},

			submitForm(formName) {

				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.addClass();
						// alert('submit');
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},

			addClass (){
        this.loading = true;
				let data = {
					clazzId: this.clazzId,
				//	role: this.role,
					name: this.ruleAddClass.name,
					sex: this.ruleAddClass.sex,
					phone: this.ruleAddClass.phone
				}
				// console.log("addClass",data);

				model.createSaveClazzManager(data, ( res => {
					if( res.status == 200) {
            this.loading = false;
						this.username = res.data.username;
						this.name = res.data.name;
						this.userPassword = res.data.userPassword;
						this.close();
						this.$emit("updateClassUserList");

						// 初始值清空
						this.ruleAddClass.name="";
						this.ruleAddClass.sex="女";
						this.ruleAddClass.phone="";


						// 显示成功弹出框
						this.dialogAddSucc = true;
					} else {
            this.loading = false;
						this.$message.error(res.message);
					}
				}));
			}


		},

		components: {
			addSucc
		}
	}
</script>
