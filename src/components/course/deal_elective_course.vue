

<template>
    <div class="electiveChildWrapper">
        <el-dialog
            class="dialog-form"
            v-loading="loading"
            :title="headerTitle"
            :visible.sync="visibleFlag"
            :close-on-click-modal="false"
            :before-close="handleClose"
            @open="handleOpen">
            <el-form :model="ruleForm" :rules="rules" ref="basicInfoForm" :label-width="labelWidth" class="demo-ruleForm">
                <h2 class="courseNumber">{{courseCount}}</h2>
                <el-form-item class="inlineForm" label="课程类型：" prop="subjectType" required>
                    <el-select v-model="ruleForm.subjectType">
                        <el-option v-for="(item, index) in subjectType" :key="index" :label="item.name" :value="item.code|string"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :class="{inlineForm:true, limitForm:Boolean(ruleForm.upperLimit)&&(!!Number(ruleForm.upperLimit)||Number(ruleForm.upperLimit)==0)}" label="选课上限人数：" prop="upperLimit" required>
                    <el-input v-model="ruleForm.upperLimit" class="littleInput"></el-input>
                    <em class="unit">人</em>
                </el-form-item>

                <el-form-item label="课程名称：" prop="name" required>
                    <el-input v-model="ruleForm.name" placeholder="30字已内"></el-input>
                </el-form-item>
                <el-form-item label="主讲人：" required>
                    <el-form-item prop="mainTeacherId">
                        <el-select v-model="ruleForm.mainTeacherId" placeholder="请选择专家">
                            <el-option v-for="(item,index) in speakerList" :key="index" :label="item.name" :value="item.id|string"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="上课地点：" prop="location">
                    <el-input v-model="ruleForm.location" placeholder="50字以内"></el-input>
                </el-form-item>
                <el-form-item label="课程简介：" prop="description">
                    <el-input type="textarea" v-model="ruleForm.description" placeholder="200字以内（选填）"></el-input>
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
	import { dateFormatStr,strFormatDate } from '@/global/open'
    export default{
        data(){
            let checkLimitPeople= (rule, value, callback)=>{
                if(!value){
                    return callback(new Error('选课上限人数不能为空'));
                }else{
                    if(!Number(value)&&Number(value)!=0){
                        return callback(new Error('请输入数字'));
                    }else{
                        if(Number(value)<1||Number(value)>10000){
                            return callback(new Error('请输入1至10000范围内的数字'));
                        }else if(Number(value)<Number(this.currentPeople)){
                            return callback(new Error(this.courseCount+'的上限人数不能小于已选课人数'));
                        }
                    }
                }
                callback();
            };
            let checkCourseName = (rule, value, callback)=>{
                if(!value.trim()){
                    return callback(new Error('课程名称不能为空'));
                }else{
                    if(String(value).length>30){
                        return callback(new Error('最多输入30字'));
                    }
                }
                callback();
            }
            return {
                courseCount:"",
                labelWidth:'140px',
                currentPeople:-1,
                loading:true,
                ruleForm: {
                    upperLimit:"",
                    name:'',
                    subjectType:'',
                    description: '',
                    mainTeacherId:'',
                    location:'',
                    courseId:''
                },
                rules: {
                    description: [
                        { required: false, message: '最多输入200字', trigger: 'blur' },
                        { min: 0, max: 200, message: '最多输入200字', trigger: 'blur' }
                    ],
                    upperLimit:[
                        {validator:checkLimitPeople, required: true, trigger: ['change','blur'] },
                    ],
                    subjectType: [
                        { type:'string', required: true, message: '请选择课程类型', trigger: ['blur','change'] },
                    ],
                    name:[
                        {validator:checkCourseName, required: true,trigger: ['blur','change'] },
                    ],
                    mainTeacherId: [
                        { type:'string', required: true, message: '请选择主讲人', trigger: ['blur','change'] },
                    ],
                    location:[
                        { required: false, message: '最多输入50字', trigger: 'blur' },
                        { min: 0, max: 50, message: '最多输入50字', trigger: 'blur' }
                    ],
                },
                speakerList:[],
                subjectType:[],
                headerTitle: '',
            }
        },
        props:["visibleFlag",'clazzId','courseId',"selectCount",'childcourseCount','addFlag','electiveId'],
        created(){
            this.getCourseSubjectList();
            this.getSpeaker();
        },
        filters:{
            string(num) {
                // if(num)
				return num.toString();
			}
        },
        methods:{
            handleClose(){
                this.$emit('update:visibleFlag', false);
				this.$refs['basicInfoForm'].resetFields();
            },
            handleSubmit(formName){
                this.$refs[formName].validate((info)=>{
                    if(info){
                        this.addFlag?this.addCourse():this.updateCourse();
                    }else{
                        //校验不通过
                    }
                })
            },
            handleOpen(){
                if(this.addFlag){
                        this.headerTitle = '新增选修课';
                        this.loading = false;
                }else{
                    if(this.courseId) {
                        this.currentPeople = this.selectCount;
                        this.getCourseDetail();
                        this.courseCount = "选修课"+this.childcourseCount;
                        this.headerTitle = '编辑选修课'
                    } else {
                        this.$message.error('业务出现异常，请重新操作');
                    }
                        
                }
				
            },
            getCourseSubjectList(){
				let data = {

				}
				model.courseSubjectList(data, (res => {

					if(res.status == 200){
                        this.subjectType = res.data;
					}else{
						this.$message.error(res.message);
					}

				}))
            },
            getSpeaker() {

				let data = {
					clazzId: this.$route.query.clazzId
				}

				model.getCourseProfessor(data, (res => {
					if(res.status == 200) {
                        this.speakerList = res.data;
					} else {
						this.$message.error(res.message);
					}
				}));
            },
            getCourseDetail(){
                let data={
                    courseId: this.courseId
                }
                model.getCourseFindOne(data,(res)=>{
                    if(res.status == 200){
                        this.loading = false;
                        let resText = res.data;
                        this.ruleForm.subjectType = resText.subjectType;
                        this.ruleForm.courseId = resText.id;
                        for(let key in resText){
                            if(this.ruleForm.hasOwnProperty(key)){
                                this.ruleForm[key]=resText[key];
                            }
                        }
                    }else{
                        this.$message.error(res.message);
                    }
                    
                })
            },
            updateCourse(){
                let data = JSON.parse(JSON.stringify(this.ruleForm));
                delete data.subjectType;
                data.courseSubjectType = this.ruleForm.subjectType;
                model.courseElectiveItemUpdate(data,res=>{
                    if( res.status == 200) {
						this.handleClose();
						this.$emit("updateElectiveList")
					} else {
						this.$message.error(res.message);
					}
                })
            },
            addCourse(){
                let data = JSON.parse(JSON.stringify(this.ruleForm));
                delete data.subjectType;
                delete data.courseId;
                data.courseSubjectType = this.ruleForm.subjectType;
                data.createEvaAndIntro = false;
                data.electiveId = this.electiveId  //this.electiveId
                console.log(data);
                model.courseElectiveItemSave(data,res=>{
                    if( res.status == 200) {
						this.handleClose();
						this.$emit("updateElectiveList")
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