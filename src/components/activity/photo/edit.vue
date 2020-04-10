<style scoped lang="less">
	
</style>
<template>
	<div id="weditPhoto">
		<el-dialog class="dialog-form" title="编辑照片墙"
			:visible.sync="dialogEditPhoto"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open">
			<el-form :model="ruleEditPhoto" :rules="rules" ref="ruleEditPhoto">
				<el-form-item label="主题：" :label-width="labelWidth" prop="title">
					<el-input type="textarea" placeholder="50字以内" v-model.trim="ruleEditPhoto.title"></el-input>
				</el-form-item>
				<el-form-item label="所属课程：" :label-width="labelWidth">
					<p>{{courseName}}</p>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('ruleEditPhoto')">确定</el-button>
				<el-button @click="close">关闭</el-button>
			</div>
		</el-dialog>

		


	</div>
</template>
<script>
	import model from 'model/activity/photo'
	import course from 'model/course/course'
	export default {
		data() {
			return {
				ruleEditPhoto: {
					title:""
				},
				rules: {
					title: [
						{ required: true, message: '请填写主题', trigger: 'blur'},
						{ max: 50, message: '50字以内'}
					]
				},
				labelWidth: "120px",
				courseName: ""
			}
		},
		props: ['dialogEditPhoto','activityId','courseId'],
		
		methods: {
			open() {
				if(!!this.courseId) {
					this.getCourseFindOne();
				}
				if(!!this.activityId) {
					this.getPhotoOne();
				}
			},
			close() {
				this.$emit('update:dialogEditPhoto', false);
				this.resetForm('ruleEditPhoto');
			},
			getCourseFindOne() {
				let data = {
					courseId: this.courseId
				}

				course.getCourseFindOne(data, (res => {
					// console.log("getCourseFindOne",res.data.name);
					if(res.status == 200) {
						this.courseName = res.data.name;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 获取活动详情
			getPhotoOne() {

				let data = {
					id: this.activityId
				}
				model.getPhotoOne(data, (res => {
					// console.log("getPhotoOne",res);
					if( res.status == 200) {
						this.ruleEditPhoto.title = res.data.title;
					} else {
						this.$message.error(res.message);
					}
				}));

			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.updatePhoto();
					} else {
						console.log('error submit');
						return false;
					}
				})
			},
			resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },
			updatePhoto() {
				let data = {
					title: this.ruleEditPhoto.title,
					id: this.activityId
				}
				// console.log("updatePhotodata",data);
				model.updatePhoto(data, (res => {
					// console.log("updatePhoto",res)
					if( res.status == 200) {
						this.close();
						this.$emit("updateList");
					} else {
						this.$message.error(res.message);
					}
				}));
			}
		},
		
	}
</script>