<style scoped lang="less">
	#wselPro {
		.pro-box {
			padding: 0 20px;
			max-height: 500px;
			overflow: auto;
		}
		.check-item {
			display: block;
			margin-left: 0;
			margin-bottom: 20px;
		}
	}
	
</style>
<template>
	<div id="wselPro">
		<el-dialog class="dialog-form" 
			title="选项目"
			:visible.sync = "dialogSelPro"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open">

			<div class="pro-box">
				<el-form :model="ruleSelPro" :rules="rules" ref="ruleSelPro">
					<el-form-item prop="pro">
						<el-checkbox-group v-model="ruleSelPro.pro">
							<div v-for="item in proList">
								<el-checkbox class="check-item" :label="item.projectName" name="pro"></el-checkbox>
							</div>
							
						</el-checkbox-group>
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('ruleSelPro')">确定</el-button>
				<el-button @click="close">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import model from 'model/user/user_manage'

	export default {
		data() {
			return {
				proList: [],	// 项目列表
				ruleSelPro: {
					pro: []			// 选中的数组
				},
				rules: {
					pro: [
						{ type: 'array', required: true, message: '请至少选择一个项目', trigger: 'change' }
					]
				}
			}
		},
		props: ['dialogSelPro', 'orgId', 'role', 'userId'],
		created() {
			
		},
		
		computed: {
			proIds () {
				let proIds = [];
				this.proList.filter((item) => {
					let sel = this.ruleSelPro.pro.indexOf(item.projectName);
					if(sel != -1) {
						proIds.push(item.projectId);
					}
				});

				return proIds;
			}
		},

		methods: {
			open(){
				this.getProject();
			},
			getProject () {
				
				// 清空上次选中的项目
				this.ruleSelPro.pro = [];

				let data = {
					organizationId: this.orgId,
					userId: this.userId
				}

				model.proSelect (data, ( res => {
					// console.log("getProject", res);
					if ( res.status == 200) {
						this.proList = res.data;
						// 设置选中的项为选中状态
						this.proList.forEach((val,ind,arr) => {
							if(val.isSelect == true) {
								this.ruleSelPro.pro.push(val.projectName);
							}
						})


					} else {
						this.$message.error(res.message);
					}
				}));


			},
			close() {
				this.$emit('update:dialogSelPro', false);
				this.resetForm('ruleSelPro');
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						// console.log("checkbox", this.ruleSelPro.pro, this.proIds);
						this.selPro();
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
			selPro() {
				let data = {
					userId: this.userId,
					ids: this.proIds
				}

				model.joinProject(data, (res => {
					// console.log('joinProject', res)
					if (res.status == 200) {
						this.close();
						this.$emit("updateProList");

						
					} else {
						this.$message.error(res.message);
					}
				}));
			}
		},

		// watch: {
		// 	userId: 'getProject',
		// 	// orgId: 'getProject'
		// }
	}
</script>