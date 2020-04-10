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
				
				<el-form-item label="课程日期：" :label-width="labelWidth" prop="courseDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="ruleUpdateCourse.courseDate" ></el-date-picker>
				</el-form-item>
				<el-form-item label="开始时间：" :label-width="labelWidth" prop="beginTime">
					
					<el-time-picker
			            v-model="ruleUpdateCourse.beginTime"
			            :picker-options="pickerStart"
			            format="HH:mm"
			            placeholder="开始时间">
			        </el-time-picker>
				</el-form-item>
				<el-form-item label="结束时间：" :label-width="labelWidth" prop="endTime">
					<el-time-picker
			            v-model="ruleUpdateCourse.endTime"
			            format="HH:mm"
			            :picker-options="pickerEnd"
			            placeholder="结束时间">
			        </el-time-picker>

				</el-form-item>

				<!--评价反思-->
				<el-form-item label="评价反思：" :label-width="labelWidth" prop="valueSingle">
					<p class="wtips">
						评价反思已经{{ruleUpdateCourse.createEvaAndIntro?'开启':'关闭'}},
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
	import { dateFormatStr,strFormatDate,dateFormatTime2,dateFormatStr2 } from '@/global/open'

	export default {
		data() {
			return {
				pickerStart:{
		            selectableRange: '00:00:00 - 23:59:00'
		        },
		        pickerEnd:{
		            selectableRange: '00:00:00 - 23:59:00'
		        },
				ruleUpdateCourse: {
					name: '',
					mainTeacherId: '',
					courseDate: '',
					beginTime: '',
					endTime: '',
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
					courseDate: [
						{ type: 'date', required: true, message: '请选择日期', trigger: 'change'}
					],
					beginTime: [
						{ type: 'date', required: true, message: '请选择开始时间', trigger: 'change'}
					],
					endTime: [
						{ type: 'date', required: true, message: '请选择结束时间', trigger: 'change'}
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
			starttime(){

				let starttime=dateFormatTime2(this.ruleUpdateCourse.beginTime)
				let endtime=starttime.split(':')[0];
				if(endtime>20){
					endtime="23:59"
				}else{
					endtime=(parseInt(endtime)+3)+":"+starttime.split(':')[1]
				};
				let nowdate=dateFormatStr2(this.ruleUpdateCourse.courseDate);
				endtime=nowdate+" "+endtime;
				endtime = new Date(endtime).getTime();
				this.ruleUpdateCourse.endTime=endtime

			},
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
					 //console.log("getCourseFindOne",res);
					if(res.status == 200) {
						//console.log(res.data.createEvaAndIntro);
						this.ruleUpdateCourse.name = res.data.name;
						this.ruleUpdateCourse.mainTeacherId = res.data.mainTeacherId ? res.data.mainTeacherId.toString() : '';
						this.ruleUpdateCourse.courseDate = new Date(res.data.courseDate);
						this.ruleUpdateCourse.beginTime = new Date(res.data.courseDate + ' ' + res.data.beginTime);
						this.ruleUpdateCourse.endTime = new Date(res.data.courseDate + ' ' + res.data.endTime);
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
				let d = new Date(this.ruleUpdateCourse.courseDate);
				let courseDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
					let data = {
						courseId: this.courseId,
						name: this.ruleUpdateCourse.name,
						mainTeacherId: this.ruleUpdateCourse.mainTeacherId,
						courseDate: courseDate,
						beginTime: dateFormatTime2(this.ruleUpdateCourse.beginTime),
						endTime: dateFormatTime2(this.ruleUpdateCourse.endTime),
						location: this.ruleUpdateCourse.location,
						description: this.ruleUpdateCourse.description,

						courseSubjectType:this.ruleUpdateCourse.specialLecture,
					}

					console.log("最终");
					console.log(this.ruleUpdateCourse.specialLecture);
					model.updateCourse(data, (res => {
						if( res.status == 200) {
							this.close();
							this.$emit("updateCourseList")
						} else {
							this.$message.error(res.message);
						}
					}));
			}
		},
		// watch: {
		// 	courseId: 'getCourse'
		// }
	}
</script>
<style lang="less" scoped="">
	.wtips {
	    color: #999;
	}
</style>