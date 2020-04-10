<template>
	<div id="takecourse" class="">
		<el-dialog 
			class="dialog-form dialog-take" 
			title="创建选修课"
			:visible.sync="dialogTakeCourse"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open"
			>

			<el-form	:model="ruleForm"
				ref = "ruleForm"
				:rules="rules"
				label-width = "140px"
				v-loading = "loading"
				element-loading-text="拼命加载中"
				>
				
				<!-- 选课设置 -->
				<div class="panel">
					<el-form-item label = "课程日期："  prop="courseDate">
					    <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.courseDate"></el-date-picker>
					</el-form-item>

					<el-form-item label="上课时间：" required>
	                    <el-col :span="12">
	                        <el-form-item prop="beginTime">
	                            <el-time-picker type="fixed-time" :editable="false" format="HH:mm"  placeholder="开始时间" @blur="starttime" v-model="ruleForm.beginTime"></el-time-picker>
	                        </el-form-item>
	                    </el-col>
	                    <el-col :span="12">
	                        <el-form-item prop="endTime"
	                        	>
	                            <el-time-picker type="fixed-time" :editable="false" format="HH:mm"  placeholder="结束时间" v-model="ruleForm.endTime"></el-time-picker>
	                        </el-form-item>
	                    </el-col>
	                    
	                </el-form-item>

					<el-form-item label="选课开放时间：" required>
	                    <el-col :span="12">
	                        <el-form-item prop="openBgTime"
	                        	>
	                            <el-date-picker
	                                v-model="ruleForm.openBgTime"
	                                type="datetime"
	                                format="yyyy-MM-dd HH:mm"
	                                placeholder="选择开始日期时间">
	                            </el-date-picker>
	                        </el-form-item>
	                    </el-col>
	                    <el-col :span="12">
	                        <el-form-item prop="openEdTime"
	                        	>
	                            <el-date-picker
	                                v-model="ruleForm.openEdTime"
	                                type="datetime"
	                                format="yyyy-MM-dd HH:mm"
	                                placeholder="选择结束日期时间">
	                            </el-date-picker>
	                        </el-form-item>
	                    </el-col>
	                    
	                </el-form-item>
					
					<el-form-item label = "选课说明：" prop="desc"
						>
						<el-input type="textarea" v-model.trim="ruleForm.desc" placeholder="200字以内（选填）"></el-input>
					</el-form-item>
				</div>

				<div class="panel" v-for="(course, index) in ruleForm.courseList">
					<h3 class="sub-title clearfix">
						选修课 {{index+1}}
						<i class="icon-del" @click.prevent="removeCourse(course)"></i>
					</h3>
					

					<el-form-item class="inlineForm" label="课程类型：" 
						:prop="'courseList.' + index + '.subjectType'"
						:rules="[
							{ required: true, message: '请选择课程类型', trigger: 'change' }
						]">
					    <el-select class="select" v-model="course.subjectType" placeholder="请选择">
					      	<el-option 
								v-for = "(item) in subjectList"
								:key="item.code"
					      		:label="item.name" 
					      		:value="item.code"></el-option>
					    </el-select>
					</el-form-item>

					<el-form-item class="inlineForm num" label="选课上限人数：" 
						:prop="'courseList.' + index + '.upperLimit'"
						:rules="[
							{ required: true, message: '请输入上限人数', trigger: 'blur' },
							{ type: 'number', min: 1, max: 10000, message: '请输入合适的数', trigger: 'blur'}
						]">
					    <el-input class="inlineForm" v-model.number="course.upperLimit"></el-input> 人
					</el-form-item>


					<el-form-item label="课程名称：" 
						:prop="'courseList.' + index + '.name'"
						:rules="[
							{ required: true, message: '请输入课程名称', trigger: 'blur' },
							{ min: 1, max: 30, message: '30字以内', trigger: 'blur'}
						]">
					    <el-input class="auto" v-model.trim="course.name" placeholder="30字以内"></el-input> 
					</el-form-item>
					
					<el-form-item label="主讲人：" 
						:prop="'courseList.' + index + '.mainTeacherId'"
						:rules="[
							{ required: true, message: '请选择主讲人', trigger: 'change' }
						]">
					    <el-select class="select" v-model="course.mainTeacherId" placeholder="主讲人">
					      	<el-option 
					      		v-for="item in teacherList"
					      		:key="item.id" 
						      	:label="item.name" 
						      	:value="item.id | string"></el-option>
					    </el-select>
					</el-form-item>
					
					<el-form-item label="上课地点：" 
						:prop="'courseList.' + index + '.location'"
						:rules="[
                    		{ min: 0, max: 50, message: '最多输入50字', trigger: 'blur' }
						]">
					    <el-input class="auto" v-model.trim="course.location" placeholder="50字以内"></el-input> 
					</el-form-item>

					<el-form-item label = "课程简介："
						:prop="'courseList.' + index + '.description'"
						:rules="[
                    		{ min: 0, max: 2000, message: '最多输入2000字', trigger: 'blur' }
						]">
						<el-input type="textarea" v-model.trim="course.description" placeholder="2000字以内（选填）"></el-input>
					</el-form-item>
				</div>
				<button type="button" class="addtakecourse"  @click="addCourse">
					<i class="icon-add-blue"></i>
					选修课
				</button>
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
	import { dateFormatStr2,strFormatDate,dateFormatTime2 } from '@/global/open'

	export default {
		data() {

			let checkOpenEndTime = (rule, value, callback)=>{
                if(!value){
                    return callback(new Error('选课开放结束时间不能为空'));
                }else{
                    if(Boolean(this.ruleForm.openEdTime)&&Boolean(this.ruleForm.openBgTime)){
                        if((new Date(this.ruleForm.openEdTime).getTime())-(new Date(this.ruleForm.openBgTime).getTime())<3600000){
                            return callback(new Error('结束时间必须大于开始时间1小时'));
                        }
                    }
                    
                }
                callback();
            };
            let checkOpenStartTime = (rule, value, callback)=>{
                if(!value){
                    return callback(new Error('选课开放开始时间不能为空'));
                }else{
                    // if(Boolean(this.ruleForm.openEdTime)&&Boolean(this.ruleForm.openBgTime)){
                    //     if((new Date(this.ruleForm.openEdTime).getTime())-(new Date(this.ruleForm.openBgTime).getTime())<3600000){
                    //         return callback(new Error('选课开放时间间距必须大于等于1小时'));
                    //     }
                    // }
                }
                callback();
                
            };
            let checkCourseDate=(rule, value, callback)=>{
                if(!value){
                    return callback(new Error('课程日期不能为空'));
                }
                // this.$refs["basicInfoForm"].validateField("date5");
                callback();
            };
            // 上课时间对比大小
            let checkCourseEndTime=(rule, value, callback) => {
            	if(!value) {
            		return callback(new Error('请选择结束时间'));
            	} else {
            		if(Boolean(this.ruleForm.beginTime)&&Boolean(this.ruleForm.endTime)) {
            			console.log("开始时间==", this.ruleForm.beginTime, new Date(this.ruleForm.beginTime).getTime())
            			console.log("结束时间==", this.ruleForm.endTime, new Date(this.ruleForm.endTime).getTime())
            			if((new Date(this.ruleForm.endTime).getTime())-(new Date(this.ruleForm.beginTime).getTime()) <= 0) {
            				return callback(new Error('上课结束时间必须大于上课开始时间'));
            			}
            		} 
            	}
            	callback();
            };
            

			return {
				ruleForm: {
					courseDate: "",			// 上课日期
					beginTime: "",		// 上课开始时间
					endTime: "",		// 上课结束时间
					openBgTime: "",		// 选课开始时间
					openEdTime: "",		// 选课结束时间

					desc: "",		// 选课说明

					courseList: [{
						key: 1,
						createEvaAndIntro: false,
					    description: "",
					    location: "",
					    mainTeacherId: "",
					    name: "",
					    subjectType: "",
					    upperLimit: "",
					},{
						key: 2,
						createEvaAndIntro: false,
					    description: "",
					    location: "",
					    mainTeacherId: "",
					    name: "",
					    subjectType: "",
					    upperLimit: "",
					}]

				},
				rules: {
                    desc: [
                        { required: false, message: '最多输入200字', trigger: 'blur' },
                        { min: 0, max: 200, message: '最多输入200字', trigger: 'blur' }
                    ],
                    courseDate: [
                        {validator:checkCourseDate, required: true, trigger: ['change','blur'] }
                    ],
                    beginTime: [
                        { type: 'date', required: true, message: '请选择开始时间', trigger: ['change','blur'] }
                    ],
                    endTime: [
                        { validator:checkCourseEndTime, type: 'date', required: true, trigger: ['change','blur'] }
                    ],
                    openBgTime: [
                        { validator:checkOpenStartTime, required: true, trigger: ['change','blur'] }
                    ],
                    openEdTime: [
                        { validator:checkOpenEndTime, required: true, trigger: ['change','blur'] }
                    ],
                },
				subjectList: [],	// 课程类型
				teacherList: [],	// 专家列表
				loading: false,	
			}
		},

		props: ['dialogTakeCourse', 'clazzId'],
		filters: {
			string(num) {
				return num.toString();
			}
		},
		mounted() {
			// 获取专家列表
			this.getMainTeacher();
			//获取课程类型
			this.getCourseSubjectList();
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
				let begintime=nowdate+" "+starttime;
				this.ruleForm.beginTime=new Date(begintime).getTime()
				this.ruleForm.endTime=new Date(endtime).getTime();
				console.log(new Date(begintime).getTime())
				console.log(new Date(endtime).getTime())
			},
			open() {
				this.loading = false;
				let courseDate = "",
					date = sessionStorage.getItem("当前班级"+this.clazzId);
				if(date != undefined) {
					date = JSON.parse(date);
					courseDate = new Date(date);
				}
				this.ruleForm = {
					courseDate: courseDate,			
					beginTime: "",		
					endTime: "",		
					openBgTime: "",		
					openEdTime: "",		
					desc: "",		
					courseList: [{
						key: 1,
						createEvaAndIntro: false,
					    description: "",
					    location: "",
					    mainTeacherId: "",
					    name: "",
					    subjectType: "",
					    upperLimit: "",
					},{
						key: 2,
						createEvaAndIntro: false,
					    description: "",
					    location: "",
					    mainTeacherId: "",
					    name: "",
					    subjectType: "",
					    upperLimit: "",
					}]
				}
			},
			addCourse() {
				//console.log("add-length", this.ruleForm.courseList.length);
				if(this.ruleForm.courseList.length > 18) {
					this.ruleForm.courseList.push({
						key: Date.now(),
						createEvaAndIntro: false,
					    description: "",
					    location: "",
					    mainTeacherId: "",
					    name: "",
					    subjectType: "",
					    upperLimit: "",
					})
					$(".addtakecourse").css('display', 'none')
				} else {
					this.ruleForm.courseList.push({
						key: Date.now(),
						createEvaAndIntro: false,
					    description: "",
					    location: "",
					    mainTeacherId: "",
					    name: "",
					    subjectType: "",
					    upperLimit: "",
					})
					$(".addtakecourse").css('display', 'block')
				}
				
			},
			removeCourse(item) {
				//console.log("re-length", this.ruleForm.courseList.length);
				let index = this.ruleForm.courseList.indexOf(item)
				if(index !== -1) {
					this.ruleForm.courseList.splice(index, 1)
				}

				if(this.ruleForm.courseList.length < 1) {
					this.addCourse();
					return false;	
				} 

				if(this.ruleForm.courseList.length < 20) {
					$(".addtakecourse").css('display', 'block')
				}
					
			},
			// 获取课程类型
			getCourseSubjectList(){
				
				model.courseSubjectList({}, (res => {
					// console.log("课程类型", res)
					if(res.status == 200){
						this.subjectList = res.data;
					}else{
						this.$message.error(res.message);
					}

				}))
			},

			close() {
				this.$emit('update:dialogTakeCourse', false);
				this.$refs['ruleForm'].resetFields();
			},
			
		    submitForm(formName) {
		    	if(this.ruleForm.courseList.length > 20) {
					this.$message.error("选修课不能超过20门！");
					return false;
				} else if(this.ruleForm.courseList.length < 2) {
					this.$message.error("选修课最少2门！");
					return false;
				} 
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
					// console.log("主讲人",res);
					if(res.status == 200) {
						this.teacherList = res.data;
						// console.log("teacherList",this.teacherList)
					} else {
						this.$message.error(res.message);
					}
				}));
			},

			createCourse() {
				let courseDate = dateFormatStr2(this.ruleForm.courseDate);
				let openBeginDate = dateFormatStr2(this.ruleForm.openBgTime);
				let openEndDate = dateFormatStr2(this.ruleForm.openEdTime);

				let beginTime = dateFormatTime2(this.ruleForm.beginTime);
				let endTime = dateFormatTime2(this.ruleForm.endTime);
				let openBeginTime = openBeginDate + ' ' + dateFormatTime2(this.ruleForm.openBgTime);
				let openEndTime = openEndDate + ' ' + dateFormatTime2(this.ruleForm.openEdTime);


				let data = {
					clazzId: this.clazzId,
					courseDate: courseDate,
					beginTime: beginTime,
					endTime: endTime,
					openBeginTime: openBeginTime,
					openEndTime: openEndTime,
					description: this.ruleForm.desc,
					courseList: this.ruleForm.courseList
				}
				data = JSON.stringify(data);
				// console.log("输出data ", data)
				this.loading = true;
				model.courseElectiveSave(data, (res => {
					console.log("创建选修课返回 ",res);
					if(res.status == 200) {
						this.$message.success("选修课创建成功！")
						this.close();
						console.log(courseDate)
						this.$emit("updateList",courseDate);
						this.loading = false;
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
				}));
			},

		}
	}
</script>
<style scoped lang="less">
	@import "../../assets/reset-element-ui/form.css";
	@import "../../assets/css/elective_pop.css";
	.icon-del {
		float: right;
	    display: inline-block;
	    width: 20px;
	    height: 20px;
	    background: url("../../assets/img/icon/icon-del.png") center center no-repeat;
	    background-size: 100% 100%;
	    cursor: pointer;
	}
	.icon-add-blue {
		display: inline-block;
	    width: 15px;
	    height: 15px;
	    background: url("../../assets/img/icon/icon-add-blue.png") center center no-repeat;
	    background-size: 100% 100%;
	    margin-right: 5px;
	    vertical-align: text-bottom;
	}
	
</style>