<template>
	<div class="liveCoursePop">
		<el-dialog class="dialog-form" :title="titlename + '直播课'"
			:visible.sync="dialogLiveCourse"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open">
			<el-form :model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				v-loading="loading"
				element-loading-text="拼命加载中">

				<el-form-item label="课程名称：" :label-width="labelWidth" prop="name">
					<el-input v-model.trim="ruleForm.name" placeholder="30字以内" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="主讲人：" :label-width="labelWidth" prop="mainTeacherId">
					<el-select v-model="ruleForm.mainTeacherId" placeholder="请选择主讲人">
				      <el-option 
				      	v-for="item in teacherList"
				      	:key="item.id" 
				      	:label="item.name" 
				      	:value="item.id | string"></el-option>
				      
				    </el-select>
				</el-form-item>

				<el-form-item label="课程日期：" :label-width="labelWidth" prop="courseDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.courseDate" ></el-date-picker>
				</el-form-item>
				<el-form-item label="开始时间：" :label-width="labelWidth" prop="beginTime">
					
					<el-time-picker
			            v-model="ruleForm.beginTime"
			            :picker-options="pickerStart"
			            format="HH:mm"
						@blur="starttime"
			            placeholder="开始时间">
			        </el-time-picker>
					

				</el-form-item>
				<el-form-item label="结束时间：" :label-width="labelWidth" prop="endTime">
					
					<el-time-picker
			            v-model="ruleForm.endTime"
			            format="HH:mm"
			            :picker-options="pickerEnd"
			            placeholder="结束时间">
			        </el-time-picker>

				</el-form-item>

				<!--评价反思-->
				<el-form-item label="评价反思：" :label-width="labelWidth" prop="valueSingle">
					<el-switch
						:disabled = 'quesFlag'
						v-model="ruleForm.ques">
					</el-switch>
					<p class="wtips">开关关闭后，当前课程将没有评价反思，且编辑课程时不能修改此按钮。</p>
				</el-form-item>
				<el-form-item label="课程简介：" :label-width="labelWidth" prop="description">
					<el-input type="textarea" v-model="ruleForm.description" placeholder="2000字以内" auto-complete="off"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="!loading && submitForm('ruleForm')">确定</el-button>
				<el-button @click="close">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import model from 'model/course/course'
	import { dateFormatStr,strFormatDate,dateFormatTime2 ,dateFormatStr2} from '@/global/open'

	export default {
		data() {
			return {
				pickerStart:{
		            selectableRange: '00:00:00 - 23:59:00'
		        },
		        pickerEnd:{
		            selectableRange: '00:00:00 - 23:59:00'
		        },

		        ruleForm: {
					name: '',
					mainTeacherId: '',
					courseDate: '',
					beginTime: '',
					endTime: '',
					description: '',
					ques: true,			// 是否开启评价反思

				},
				rules: {

					name: [ 
						{ required: true, message: '请输入课程名称', trigger: 'blur'},
						{ min: 1, max: 30, message: '30字以内', trigger: 'blur'}
					],

					mainTeacherId: [
						{ required: true, message: '请选择主讲人', trigger: 'change'}
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

					description: [
						{ max: 2000, message: '2000字以内', trigger: 'blur'}
					]
				},
				labelWidth: "120px",
				teacherList: [],
				loading: false,

				quesFlag: false,	// 评价反思是否禁用，edit 时禁用 为true
			}
		},
		props: ['dialogLiveCourse','clazzId', 'courseId', 'type', 'genre'],  // genre  create edit
		computed: {
			titlename() {
				if(this.genre == 'create') {
					return '创建'
				} else if(this.genre == 'edit') {
					return '编辑'
				}
			}
		},
		filters: {
			string(num) {
				return num.toString();
			}
		},
		mounted() {
			this.getMainTeacher();
		},
		methods: {
			//根据开始时间选择结束时间
			starttime(){

				let starttime=dateFormatTime2(this.ruleForm.beginTime)
				let endtime=starttime.split(':')[0];
				if(endtime>20){
					endtime="23:59"
				}else{
					endtime=(parseInt(endtime)+3)+":"+starttime.split(':')[1]
				};
				let nowdate=dateFormatStr2(this.ruleForm.courseDate);
				endtime=nowdate+" "+endtime;
				endtime = new Date(endtime).getTime();
				this.ruleForm.endTime=endtime

			},
			open() {
				
				// 编辑
				if(this.genre == 'edit') {
					this.quesFlag = true;	// 不可操作
					this.getCourse();
				// 创建
				} else {
					this.quesFlag = false;
					this.loading = false;
					this.ruleForm.type = this.type;

					// 定位日历当前日期
					let courseDate = "",
						date = sessionStorage.getItem("当前班级"+this.clazzId);
					if(date != undefined) {
						date = JSON.parse(date);
						courseDate = new Date(date);
					}

					this.ruleForm.courseDate = courseDate;

				}
				

			},
			close () {
				this.$emit('update:dialogLiveCourse', false);
				this.resetForm('ruleForm');
			},
			resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },
		    submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(this.genre == 'create') {
							this.createCourse();
						} else {
							this.updateCourse();
						}
						
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			getMainTeacher() {

				let data = {
					clazzId: this.clazzId,
					isLive: true
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

			createCourse () {
				let data = {};


				let courseDate = dateFormatStr(this.ruleForm.courseDate);
				let beginTime = dateFormatTime2(this.ruleForm.beginTime);
				let endTime = dateFormatTime2(this.ruleForm.endTime);
				// console.log("time", beginTime, endTime);

				//console.log("评价反思single" +this.ruleForm.valueSingle);
				data = {
					clazzId: this.clazzId,
					name: this.ruleForm.name,
					mainTeacherId: this.ruleForm.mainTeacherId,
					courseType: this.ruleForm.type,

					courseDate: courseDate,

					createEvaAndIntro:this.ruleForm.ques,

					beginTime: beginTime,
					endTime: endTime,
					description: this.ruleForm.description,
				}
				
				
				this.loading = true;
				model.createCourse(data, (res => {
					// console.log("createCourse",res)
					if( res.status == 200) {
						this.$message.success("创建成功！");
						this.close();
						this.$emit("updateCourseList")
						if(this.ruleForm.type == 'MULTI'){
							console.log(data.beginDate)
							this.$emit("updateCourseList",data.courseDate)							
						};
						if(this.ruleForm.type == 'SINGLE'){
							this.$emit("updateCourseList",data.courseDate)
						};
						if(this.ruleForm.type == 'LIVE'){
							this.$emit("updateCourseList",data.courseDate)
						}
						// 添加直播课类型
						
						this.loading = false;
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
				}));
			},

			// 编辑
			getCourse() {
				let data = {
					courseId: this.courseId
				}

				model.getCourseFindOne(data, (res => {
					 //console.log("getCourseFindOne",res);
					if(res.status == 200) {
						//console.log(res.data.createEvaAndIntro);
						this.ruleForm.name = res.data.name;
						this.ruleForm.mainTeacherId = res.data.mainTeacherId ? res.data.mainTeacherId.toString() : '';
						this.ruleForm.courseDate = new Date(res.data.courseDate);
						this.ruleForm.beginTime = new Date(res.data.courseDate + ' ' + res.data.beginTime);
						this.ruleForm.endTime = new Date(res.data.courseDate + ' ' + res.data.endTime);
						this.ruleForm.description = res.data.description;
						this.ruleForm.createEvaAndIntro = res.data.createEvaAndIntro;


					} else {
						this.$message.error(res.message);
					}
				}));
			},

			updateCourse() {
				let d = new Date(this.ruleForm.courseDate);
				let courseDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
					let data = {
						courseId: this.courseId,
						name: this.ruleForm.name,
						mainTeacherId: this.ruleForm.mainTeacherId,
						courseDate: courseDate,
						beginTime: dateFormatTime2(this.ruleForm.beginTime),
						endTime: dateFormatTime2(this.ruleForm.endTime),
						description: this.ruleForm.description,

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
<style scoped lang="less">
	@import "../../assets/reset-element-ui/form.css";
	.wtips {
		line-height: 1.5em;
	    font-size: 13px;
	    color: #999;
	}
</style>