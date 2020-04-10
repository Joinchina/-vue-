<template>
	<div class="wcreateCourse">
		<el-dialog class="dialog-form" title="创建课程"
			:visible.sync="dialogAddCourse"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open"
			>
				<el-form :model="ruleCreateCourse" 
					:rules="rules" 
					ref="ruleCreateCourse"
					v-loading="loading"
					element-loading-text="拼命加载中"
					>
					<!-- 新加课程分类 -->
					<el-form-item label="课程周期：" :label-width="labelWidth" prop="type">
						<el-radio-group v-model="ruleCreateCourse.type" disabled>
							<el-radio label='SINGLE'>单日课程</el-radio>
							<el-radio label='MULTI'>跨天课程</el-radio>
						</el-radio-group>
						<p class="wtips">提示：单日课程指当天开始结束的课程；跨天课程指持续多天的课程，一般用于训前预热、调研以及训后跟踪</p>
					</el-form-item>

					<!--课程类型-->
					<el-form-item label="课程类型" :label-width="labelWidth" prop="specialLecture" required>
						<el-select v-model="ruleCreateCourse.specialLecture" placeholder="专题讲座" >
					      <el-option 
					        v-for="(item,index) in subjectList"
					        :key="index"
					      	:label="item.name" :value="item.code"></el-option>
					      
					    </el-select>
					</el-form-item>



					<el-form-item label="课程名称：" :label-width="labelWidth" prop="name">
						<el-input v-model.trim="ruleCreateCourse.name" placeholder="30字以内" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="主讲人：" :label-width="labelWidth" prop="mainTeacherId">
						<el-select v-model="ruleCreateCourse.mainTeacherId" placeholder="请选择专家">
					      <el-option 
					      	v-for="item in teacherList"
					      	:key="item.id" 
					      	:label="item.name" 
					      	:value="item.id | string"></el-option>
					      
					    </el-select>
					</el-form-item>

				<template v-if="ruleCreateCourse.type == 'SINGLE'">
					<el-form-item label="课程日期：" :label-width="labelWidth" prop="courseDate">
						<el-date-picker type="date" placeholder="选择日期" v-model="ruleCreateCourse.courseDate" ></el-date-picker>
					</el-form-item>
					<el-form-item label="开始时间：" :label-width="labelWidth" prop="beginTime">
						
						<el-time-picker
				            v-model="ruleCreateCourse.beginTime"
				            :picker-options="pickerStart"
				            format="HH:mm"
							@blur="starttime"
				            placeholder="开始时间">
				        </el-time-picker>
						

					</el-form-item>
					<el-form-item label="结束时间：" :label-width="labelWidth" prop="endTime">
						
						<el-time-picker
				            v-model="ruleCreateCourse.endTime"
				            format="HH:mm"
				            :picker-options="pickerEnd"
				            placeholder="结束时间">
				        </el-time-picker>

					</el-form-item>

					<!--评价反思-->
					<el-form-item label="评价反思：" :label-width="labelWidth" prop="valueSingle">
						<el-switch
							  v-model="ruleCreateCourse.valueSingle">
						</el-switch>
						<p class="wtips">开关关闭后，当前课程将没有评价反思，且编辑课程时不能修改此按钮。</p>
					</el-form-item>

				</template>


				<template v-if="ruleCreateCourse.type == 'MULTI'">
					<el-form-item label="开始日期：" :label-width="labelWidth" prop="beginDate">
						<el-date-picker
							v-model="ruleCreateCourse.beginDate"
							type="date"
							placeholder="选择日期"
							>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="结束日期：" :label-width="labelWidth" prop="endDate">
							<el-date-picker
							v-model="ruleCreateCourse.endDate"
							type="date"
							placeholder="选择日期"
							>
						</el-date-picker>
					</el-form-item>

					<!--评价反思-->
					<el-form-item label="评价反思：" :label-width="labelWidth" prop="valueMulti">
						<el-switch
							  v-model="ruleCreateCourse.valueMulti">
						</el-switch>
						<div class="wtips">开关关闭后，当前课程将没有评价反思，且编辑课程时不能修改此按钮。</div>
					</el-form-item>
					

				</template>
					

					<el-form-item label="上课地点：" :label-width="labelWidth" prop="location">
						<el-input v-model="ruleCreateCourse.location" placeholder="50字以内" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="课程简介：" :label-width="labelWidth" prop="description">
						<el-input type="textarea" v-model="ruleCreateCourse.description" placeholder="2000字以内" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="!loading && submitForm('ruleCreateCourse')">确定</el-button>
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
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				pickerOptions1: {
					disabledDate(time) {
						return time.getTime() < Date.now();
					}
				},

				ruleCreateCourse: {
					type: 'SINGLE',
					name: '',
					mainTeacherId: '',
					courseDate: '',
					beginTime: '',
					endTime: '',
					beginDate: '',
					endDate: '',
					location: '',
					description: '',

					specialLecture:'ztjz',

					valueSingle:true,
					valueMulti:true,
				},
				rules: {
					type: [
			            { required: true, message: '请选择课程周期', trigger: 'change' }
			        ],
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
				subjectList:[],
				loading: false
			}
		},
		props: ['dialogAddCourse','clazzId', 'type'],
		filters: {
			string(num) {
				return num.toString();
			}
		},
		created() {

			this.getMainTeacher();

			//获取课程名称
			this.getCourseSubjectList();
		},
		methods: {
			//根据开始时间选择结束时间
			starttime(){

				let starttime=dateFormatTime2(this.ruleCreateCourse.beginTime)
				let endtime=starttime.split(':')[0];
				if(endtime>20){
					endtime="23:59"
				}else{
					endtime=(parseInt(endtime)+3)+":"+starttime.split(':')[1]
				};
				let nowdate=dateFormatStr2(this.ruleCreateCourse.courseDate);
				endtime=nowdate+" "+endtime;
				endtime = new Date(endtime).getTime();
				this.ruleCreateCourse.endTime=endtime

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
				this.loading = false;
				this.ruleCreateCourse.type = this.type;

				// 定位日历当前日期
				let courseDate = "",
					date = sessionStorage.getItem("当前班级"+this.clazzId);
				if(date != undefined) {
					date = JSON.parse(date);
					courseDate = new Date(date);
				}

				this.ruleCreateCourse.courseDate = courseDate;

			},
			close () {
				this.$emit('update:dialogAddCourse', false);
				this.resetForm('ruleCreateCourse');
			},
			resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.createCourse();
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
			createCourse () {
				let data = {};
				if(this.ruleCreateCourse.type == 'SINGLE') {

					let courseDate = dateFormatStr(this.ruleCreateCourse.courseDate);
					let beginTime = dateFormatTime2(this.ruleCreateCourse.beginTime);
					let endTime = dateFormatTime2(this.ruleCreateCourse.endTime);
					// console.log("time", beginTime, endTime);

					//console.log("评价反思single" +this.ruleCreateCourse.valueSingle);
					data = {
						clazzId: this.clazzId,
						name: this.ruleCreateCourse.name,
						mainTeacherId: this.ruleCreateCourse.mainTeacherId,
						courseType: this.ruleCreateCourse.type,

						courseSubjectType:this.ruleCreateCourse.specialLecture,

						courseDate: courseDate,
						createEvaAndIntro:this.ruleCreateCourse.valueSingle,
						beginTime: beginTime,
						endTime: endTime,
						location: this.ruleCreateCourse.location,
						description: this.ruleCreateCourse.description,
					}
				} else if(this.ruleCreateCourse.type == 'MULTI') {
					
					let beginDate = dateFormatStr(this.ruleCreateCourse.beginDate);
					
					let endDate =  dateFormatStr(this.ruleCreateCourse.endDate);

					//console.log("评价反思multi" +this.ruleCreateCourse.valueMulti);
					data = {
						clazzId: this.clazzId,
						name: this.ruleCreateCourse.name,
						mainTeacherId: this.ruleCreateCourse.mainTeacherId,
						courseType: this.ruleCreateCourse.type,

						courseSubjectType:this.ruleCreateCourse.specialLecture,

						courseDate: beginDate,
						createEvaAndIntro:this.ruleCreateCourse.valueMulti,
						endDate: endDate,
						location: this.ruleCreateCourse.location,
						description: this.ruleCreateCourse.description,
					}
				}
				
				this.loading = true;
				model.createCourse(data, (res => {
					// console.log("createCourse",res)
					if( res.status == 200) {
						this.$message.success("创建成功！");
						this.close();
						this.$emit("updateCourseList")
						if(this.ruleCreateCourse.type == 'MULTI'){
							console.log(data.beginDate)
							this.$emit("updateCourseList",data.courseDate)							
						};
						if(this.ruleCreateCourse.type == 'SINGLE'){
							this.$emit("updateCourseList",data.courseDate)
						}																																					
						this.loading = false;
					} else {
						this.$message.error(res.message);
						this.loading = false;
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