<style scoped lang="less">
	@import "../../assets/reset-element-ui/form.css";
</style>
<template>
	<div class="wupdateCourse">
		<el-dialog class="dialog-form" title="编辑课程"
			:visible.sync="dialogEditCourse"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open">
			<el-form :model="ruleUpdateCourse" :rules="rules" ref="ruleUpdateCourse">
				<el-form-item label="课程名称：" :label-width="labelWidth" prop="name">
					<el-input v-model.trim="ruleUpdateCourse.name" placeholder="30字以内" auto-complete="off"></el-input>
				</el-form-item>

				 <!--课程类型-->
				<el-form-item label="课程类型" :label-width="labelWidth" prop="specialLecture" required>
					<el-select v-model="ruleUpdateCourse.specialLecture" placeholder="专题讲座" >
					    <el-option 
					        v-for="(item,index) in subjectList"
					        :key="index"
					      	:label="item.name" :value="item.code"></el-option>
					      
					   </el-select>
				</el-form-item>


				<el-form-item label="主讲人：" :label-width="labelWidth" prop="mainTeacherId">
					<el-select v-model="ruleUpdateCourse.mainTeacherId" placeholder="请选择专家">
				      <el-option 
				      	v-for="item in teacherList"
				      	:key="item.id" 
				      	:label="item.name" 
				      	:value="item.id | string"></el-option>
				      
				    </el-select>
				</el-form-item>
				<el-form-item label="开始日期：" :label-width="labelWidth" prop="beginDate">
					<el-date-picker
						v-model="ruleUpdateCourse.beginDate"
						type="date"
						placeholder="选择日期"
						>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束日期：" :label-width="labelWidth" prop="endDate">
						<el-date-picker
						v-model="ruleUpdateCourse.endDate"
						type="date"
						placeholder="选择日期"
						>
					</el-date-picker>
				</el-form-item>

				<!--评价反思-->
				<el-form-item label="评价反思：" :label-width="labelWidth" prop="valueSingle" class="j-mg-bt">
					<p class="wtips">评价反思已{{ruleUpdateCourse.createEvaAndIntro ? '开启':'关闭'}},
						无法修改
					</p>
				</el-form-item>
				

				<el-form-item label="上课地点：" :label-width="labelWidth" prop="location">
					<el-input v-model="ruleUpdateCourse.location" placeholder="50字以内" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="课程简介：" :label-width="labelWidth" prop="description">
					<el-input type="textarea" v-model="ruleUpdateCourse.description" placeholder="2000字以内" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('ruleUpdateCourse')">确定</el-button>
				<el-button @click="close">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import model from 'model/course/course'
	import { dateFormatStr,strFormatDate } from '@/global/open'

	export default {
		data() {
			return {
				ruleUpdateCourse: {
					name: '',
					mainTeacherId: '',
					beginDate: '',
					endDate: '',
					location: '',
					description: '',
					createEvaAndIntro:'',
					specialLecture:''
				},
				rules: {
					name: [ 
						{ required: true, message: '请输入课程名称', trigger: 'blur'},
						{ min: 1, max: 30, message: '30字以内', trigger: 'blur'}
					],
					
					mainTeacherId: [
						{ required: true, message: '请选择专家', trigger: 'change'}
					],
					beginDate: [
						{ type: 'date', required: true, message: '请选择开始日期', trigger: 'change'}
					],
					endDate: [
						{ type: 'date',  required: true, message: '请选择结束日期', trigger: 'change'}
					],
					location: [
						{ max: 50, message: '50字以内', trigger: 'blur'}
					],
					description: [
						{ max: 2000, message: '2000字以内', trigger: 'blur'}
					]
				},
				labelWidth: "120px",
				teacherList: [],

				subjectList:[]
			}
		},
		props: ['dialogEditCourse','courseId','clazzId'],
		filters: {
			string(num) {
				return num.toString();
			}
		},
		created() {
			//获取课程名称
			this.getCourseSubjectList();

			this.getMainTeacher();

		},
		methods: {
			getCourseSubjectList(){
				let data = {

				}
				model.courseSubjectList(data, (res => {

					if(res.status == 200){
						this.subjectList = res.data;
					}else{
						this.$message.error(res.message);
					}

				}))
			},
			
			open() {
				if(this.courseId) {
					this.getCourse();
				} else {
					this.$message.error('业务出现异常，请重新操作');
				}
				
			},
			close () {
				this.$emit('update:dialogEditCourse', false);
				this.resetForm('ruleUpdateCourse');
			},
			resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.updateCourse();
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			getMainTeacher() {

				let data = {
					clazzId: this.clazzId
				}

				model.getCourseProfessor(data, (res => {
					// console.log("getMainTeacher",res);
					if(res.status == 200) {
						this.teacherList = res.data;

						// console.log("teacherList",this.teacherList)
					} else {
						this.$message.error(res.message);
					}
				}));
			},

			getCourse() {
				let data = {
					courseId: this.courseId
				}

				model.getCourseFindOne(data, (res => {
					// console.log("getCourseFindOne",res);
					if(res.status == 200) {
						this.ruleUpdateCourse.name = res.data.name;
						this.ruleUpdateCourse.mainTeacherId = res.data.mainTeacherId ? res.data.mainTeacherId.toString() : '';
						this.ruleUpdateCourse.beginDate =  new Date(res.data.courseDate);
						this.ruleUpdateCourse.endDate = res.data.endDate ? new Date(res.data.endDate) : '';
						this.ruleUpdateCourse.location = res.data.location;
						this.ruleUpdateCourse.description = res.data.description;
						this.ruleUpdateCourse.createEvaAndIntro = res.data.createEvaAndIntro;

						var val = this.subjectList.find((value, index, arr) => {
  							return value.code == res.data.subjectType;
						})
						
						this.ruleUpdateCourse.specialLecture = val.code;

					} else {
						this.$message.error(res.message);
					}
				}));
			},

			updateCourse() {
				
				let beginDate = dateFormatStr(this.ruleUpdateCourse.beginDate);
				let endDate = this.ruleUpdateCourse.endDate ? dateFormatStr(this.ruleUpdateCourse.endDate) : '';
				
					let data = {
						courseId: this.courseId,
						name: this.ruleUpdateCourse.name,
						mainTeacherId: this.ruleUpdateCourse.mainTeacherId,
						courseDate: beginDate,
						endDate: endDate,
						location: this.ruleUpdateCourse.location,
						description: this.ruleUpdateCourse.description,

						courseSubjectType:this.ruleUpdateCourse.specialLecture,
					}

					model.updateCourse(data, (res => {
						if( res.status == 200) {
							this.close();
							this.$emit("updateCourseList")
						} else {
							this.$message.error(res.message);
						}
					}));
			}
			

		}
	}
</script>
<style lang="less" scoped="">
	.wtips {
	    color: #999;
	}
</style>