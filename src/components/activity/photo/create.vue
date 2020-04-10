<template>
	<div id="waddPhoto">
		<el-dialog class="dialog-form" title="新建照片墙"
			:visible.sync="dialogAddPhoto"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open"
			>
			<el-form 
				:model="ruleAddPhoto" 
				:rules="rules" ref="ruleAddPhoto"
				v-loading="loading"
				element-loading-text="拼命加载中">
				<el-form-item label="主题：" :label-width="labelWidth" prop="title">
					<el-input type="textarea" placeholder="50字以内" v-model.trim="ruleAddPhoto.title"></el-input>
				</el-form-item>

				<el-form-item v-if="courseId" label="所属课程：" :label-width="labelWidth" >
					<p>{{courseName}}</p>
				</el-form-item>
				<el-form-item v-else label="所属课程：" :label-width="labelWidth" prop="courseId">
					
					<el-select  v-model="ruleAddPhoto.courseId" placeholder="请选择">
					    <el-option
					      v-for="item in courseList"
					      v-if="item.type != 'ELECTIVE'"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="!loading && submitForm('ruleAddPhoto')">确定</el-button>
				<el-button @click="close">关闭</el-button>
			</div>
		</el-dialog>

		


	</div>
</template>
<script>
	import model from 'model/activity/photo'
	import course from 'model/course/course'
	import clazzCourse from 'model/clazz/course'
	import bus from '@/global/bus'
	export default {
		data() {
			var checkCourseId = (rule, value, callback) => {
				if(this.courseId || this.ruleAddPhoto.courseId) {
					callback();
				} else {
					callback(new Error('请选择课程！'));
				}
			};

			return {
				ruleAddPhoto: {
					title:"",
					courseId: '',		// 课程列表选择的 课程id
				},
				rules: {
					title: [
						{ required: true, message: '请填写主题', trigger: 'blur'},
						{ max: 50, message: '50字以内'}
					],
					courseId: [
						{ required: true, validator: checkCourseId, trigger: 'blur'}
					]
				},
				labelWidth: "120px",
				courseName: "",
				loading: false,

				courseList: [],		// 课程列表
			}
		},
		props: ['dialogAddPhoto','courseId', 'clazzId'],
		created() {
			if(!!this.courseId) {
				this.getCourseFindOne();
			}
		},
		methods: {
			open() {
				this.loading = false;
				this.getCourseList();
			},
			close() {
				this.$emit('update:dialogAddPhoto', false);
				this.resetForm('ruleAddPhoto');
			},
			getCourseList() {
				let data = {
					clazzId: this.clazzId
				}
				clazzCourse.getCourseList(data, (res => {
					console.log("课程列表", res);
					if(res.status == 200) {
						this.courseList = res.data;
					}
				}));
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
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.createPhoto();
					} else {
						console.log('error submit');
						return false;
					}
				})
			},
			resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },
			createPhoto() {
				let courseId = this.courseId || this.ruleAddPhoto.courseId;
				let data = {
					title: this.ruleAddPhoto.title,
					courseId: courseId
				}
				this.loading = true;
				model.createPhoto (data, (res => {
					// console.log("createPhoto",res)
					if(res.status == 200) {
						this.close();
						bus.$emit("updateList");
						// 更新照片墙列表
		            	this.$emit("updateList");
						this.loading = false;
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
				}));

			}
		},

		watch: {
			courseId: 'getCourseFindOne'
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/reset-element-ui/form.css";
	@import "../../../assets/less/icon.less";
</style>