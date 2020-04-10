

<template>
    <div class="electiveBasciWrapper">
        <el-dialog
            class="dialog-form"
            title="编辑选修课基本信息"
            :visible.sync="visibleFlag"
            :close-on-click-modal="false"
            :before-close="handleClose"
            @open="handleOpen">
            <el-form :model="ruleForm" :rules="rules" ref="basicInfoForm" :label-width="labelWidth" class="demo-ruleForm">
                <el-form-item label="课程日期：" required>
                    <el-form-item prop="date1">
                        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1"></el-date-picker>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="上课时间：" required>
                    <el-col :span="12">
                        <el-form-item prop="date2">
                            <el-time-picker type="fixed-time" format="HH:mm" :editable="false" placeholder="开始时间" v-model="ruleForm.date2"></el-time-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="date3">
                            <el-time-picker type="fixed-time" format="HH:mm" :editable="false" placeholder="结束时间" v-model="ruleForm.date3"></el-time-picker>
                        </el-form-item>
                    </el-col>
                    
                </el-form-item>
                <el-form-item label="选课开放时间：" prop="date4">
                    <el-col :span="12">
                        <el-form-item prop="date4">
                            <el-date-picker
                                v-model="ruleForm.date4"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm"
                                :disabled ="openBeginReadOnly"
                                placeholder="选择开始日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="date5">
                            <el-date-picker
                                v-model="ruleForm.date5"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm"
                                placeholder="选择结束日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    
                </el-form-item>
                <el-form-item label="选课说明：" prop="courseIntro">
                    <el-input type="textarea" v-model="ruleForm.courseIntro" placeholder="200字以内（选填）"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleSubmit('basicInfoForm')">确定</el-button>
				<el-button @click="handleClose">关闭</el-button>
			</div>
        </el-dialog>
    </div>
</template>

<script>
    import model from 'model/course/course'
	import { dateFormatStr,strFormatDate ,dateFormatTime2} from '@/global/open'
    export default{
        data(){
            let checkOpenEndTime = (rule, value, callback)=>{
                if(!value){
                    return callback(new Error('选课开放结束时间不能为空'));
                }else{
                    if(Boolean(this.ruleForm.date5)&&Boolean(this.ruleForm.date4)){
                        if((new Date(this.ruleForm.date5).getTime())-(new Date(this.ruleForm.date4).getTime())<3600000){
                            return callback(new Error('结束时间必须大于等于开始时间1小时'));
                        }
                    }
                    // if(Boolean(this.ruleForm.date1)&&Boolean(this.ruleForm.date2)&&Boolean(this.ruleForm.date5)){
                    //     let courseOnBegin = this.myDateFormatStr(this.ruleForm.date1)+' '+dateFormatTime2(this.ruleForm.date2);
                    //     if(new Date(courseOnBegin).getTime()<new Date(this.ruleForm.date5).getTime()){
                    //         return callback(new Error('选课开放时间的截止日期必须小于课程日期'));
                    //     }
                    // }
                }
                callback();
            };
            let checkOpenStartTime = (rule, value, callback)=>{
                if(!value){
                    return callback(new Error('选课开放开始时间不能为空'));
                }else{
                    // if(Boolean(this.ruleForm.date5)&&Boolean(this.ruleForm.date4)){
                    //     if((new Date(this.ruleForm.date5).getTime())-(new Date(this.ruleForm.date4).getTime())<3600000){
                    //         return callback(new Error('选课开放时间必须大于等于1小时'));
                    //     }
                    // }
                }
                callback();
                
            };
            let checkCourseDate=(rule, value, callback)=>{
                if(!value){
                    return callback(new Error('课程日期不能为空'));
                }else{
                    // if(Boolean(this.ruleForm.date1)&&Boolean(this.ruleForm.date2)&&Boolean(this.ruleForm.date5)){
                    //     let courseOnBegin = this.myDateFormatStr(this.ruleForm.date1)+' '+dateFormatTime2(this.ruleForm.date2);
                    //     if(new Date(courseOnBegin).getTime()<new Date(this.ruleForm.date5).getTime()){
                    //         return callback(new Error('课程日期必须大于选课开放时间的截止日期'));
                    //     }
                    // }
                }
                // this.$refs["basicInfoForm"].validateField("date5");
                callback();
            };
            let checkBeginTime=(rule, value, callback)=>{
                if(!value){
                    return callback(new Error('上课开始时间不能为空'));
                }else{
                    // if(Boolean(this.ruleForm.date2)&&Boolean(this.ruleForm.date3)){
                    //     if((new Date(this.ruleForm.date2).getTime())>(new Date(this.ruleForm.date3).getTime())){
                    //         return callback(new Error('上课开始时间必须小于上课结束时间'));
                    //     }
                    // }
                    // if(Boolean(this.ruleForm.date1)&&Boolean(this.ruleForm.date2)&&Boolean(this.ruleForm.date5)){
                    //     let courseOnBegin = this.myDateFormatStr(this.ruleForm.date1)+' '+dateFormatTime2(this.ruleForm.date2);
                    //     if(new Date(courseOnBegin).getTime()<new Date(this.ruleForm.date5).getTime()){
                    //         return callback(new Error('上课时间必须大于选课开放时间的结束日期'));
                    //     }
                    // }
                }
                // this.$refs["basicInfoForm"].validateField("date5");
                callback();
            };
            let checkEndTime=(rule, value, callback)=>{
                if(!value){
                    return callback(new Error('上课结束时间不能为空'));
                }else{
                    if(Boolean(this.ruleForm.date2)&&Boolean(this.ruleForm.date3)){
                        if((new Date(this.ruleForm.date2).getTime())>(new Date(this.ruleForm.date3).getTime())){
                            return callback(new Error('上课结束时间必须大于上课开始时间'));
                        }
                    }
                }
                // this.$refs["basicInfoForm"].validateField("date5");
                callback();
            };
            return {
                labelWidth:'140px',
                openBeginReadOnly: false,
                ruleForm: {
                    courseIntro: '',
                    date1: '',
                    date2: '',
                    date3: '',
                    date4: '',
                    date5: '',
                },
                rules: {
                    courseIntro: [
                        { required: false, message: '最多输入200字', trigger: 'blur' },
                        { min: 0, max: 200, message: '最多输入200字', trigger: 'blur' }
                    ],
                    date1: [
                        {validator:checkCourseDate, required: true, trigger: ['change','blur'] }
                    ],
                    date2: [
                        { validator:checkBeginTime, required: true, trigger: ['change','blur'] }
                    ],
                    date3: [
                        { validator:checkEndTime, required: true, trigger: ['change','blur'] }
                    ],
                    date4: [
                        { validator:checkOpenStartTime, required: true, trigger: ['change','blur'] }
                    ],
                    date5: [
                        { validator:checkOpenEndTime, required: true, trigger: ['change','blur'] }
                    ],
                },
            }
        },
        props:["visibleFlag","electiveCourseId"],
        methods:{
            myDateFormatStr(date){
                let d = new Date(date);
                let month = d.getMonth() + 1;
                let day = d.getDate();
                return d.getFullYear() + '-' + (month>9?month:"0"+String(month)) + '-' + (day>9?day:'0'+String(day));
            },
            handleClose(){
                this.$emit('update:visibleFlag', false);
				this.$refs['basicInfoForm'].resetFields();
            },
            handleSubmit(formName){
                this.$refs[formName].validate((info)=>{
                    if(info){
                        this.updateCourseMain();
                    }else{
                        //校验不通过
                    }
                })
            },
            handleOpen(){
                if(this.electiveCourseId) {
					this.getCourseDetail();
				} else {
					this.$message.error('业务出现异常，请重新操作');
				}
            },
            getCourseDetail(){
                let data = {
                    // 1
                    id : this.electiveCourseId
                }
                model.findCourseElective(data,res=>{
                    var resData = res.data;
                    this.ruleForm.date1 = new Date(resData.courseDate);
                    this.ruleForm.date2 = new Date(resData.courseDate+' '+resData.beginTime);
                    this.ruleForm.date3 = new Date(resData.courseDate+' '+resData.endTime);
                    this.ruleForm.date4 = new Date(resData.openBeginTime);
                    this.ruleForm.date5 = new Date(resData.openEndTime);
                    this.ruleForm.courseIntro = resData.description;

                    this.openBeginReadOnly = (new Date(resData.openBeginTime).getTime())<(new Date().getTime())?true:false;
                    
                })
            },
            updateCourseMain(){
                let data = {
                    // 1
                    id: this.electiveCourseId,
                    courseDate: this.myDateFormatStr(this.ruleForm.date1),
                    beginTime:dateFormatTime2(this.ruleForm.date2),
                    endTime: dateFormatTime2(this.ruleForm.date3),
                    openBeginTime: this.myDateFormatStr(this.ruleForm.date4)+' '+dateFormatTime2(this.ruleForm.date4),
                    openEndTime: this.myDateFormatStr(this.ruleForm.date5)+' '+dateFormatTime2(this.ruleForm.date5),
                    description: this.ruleForm.courseIntro
                };
                model.courseElectiveUpdate(JSON.stringify(data),res=>{
                    if( res.status == 200) {
						this.handleClose();
						this.$emit("updateElectiveList");
					} else {
						this.$message.error(res.message);
					}
                })
            }
            
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/reset-element-ui/form.css";  
    @import "../../assets/css/elective_pop.css"; 
</style>