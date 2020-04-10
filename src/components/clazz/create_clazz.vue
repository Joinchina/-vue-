<template>
	<div>
		<!-- 创建班级 -->
	    <el-dialog class="dialog-form w-wang" title="创建班级" :visible.sync="dialogCreateClass" :close-on-click-modal=false :before-close="closeCreate" @open="open">
	      	<el-form :model="ruleClassForm" :rules="rulesClass" ref="ruleClassForm"
	            v-loading="loading"
	            element-loading-text="拼命加载中">
	        <el-form-item label="班级名称：" :label-width="labelWidth" prop="name">
	          <el-input v-model.trim="ruleClassForm.name" placeholder="请填写班级名称" auto-complete="off"></el-input>
	        </el-form-item>
					<el-form-item v-if="agencyFlag" label="项目编号：" :label-width="labelWidth" prop="projectCode">
	          <el-input v-model.trim="ruleClassForm.projectCode" placeholder="请填写项目编号" auto-complete="off"></el-input>
	        </el-form-item>
	        <el-form-item label="面授周期：" :label-width="labelWidth" required>
	            <el-form-item prop="beginDate" class="sign-time">
	                      
                    <el-date-picker
                      type="date" 
                      value-format="yyyy-MM-dd"
                      placeholder="开始日期" 
                      v-model="ruleClassForm.beginDate" 
                      style="width: 100%;">
                    </el-date-picker>
	                        
	            </el-form-item>
	            <div class="line">~</div>
	            <el-form-item prop="endDate" class="sign-time sign-time-r">
	                       
                    <el-date-picker
                      type="date" 
                      value-format="yyyy-MM-dd"
                      placeholder="结束日期" 
                      v-model="ruleClassForm.endDate"
                      style="width: 100%;">
                    </el-date-picker>
	                          
	          	</el-form-item>
	                 
	        </el-form-item>

	        <el-form-item label="班级简介：" :label-width="labelWidth" prop="desc">
	          <!-- <el-input type="textarea" v-model="ruleClassForm.desc"></el-input> -->
	          	<div id="edit_menuc1" class="toolbar"></div>
          		<div id="edit_contentc1" class="text"></div> 
	        </el-form-item>
	      </el-form>
	      <div slot="footer" class="dialog-footer">
	        <el-button type="primary" @click="!loading && createClass('ruleClassForm')">创建</el-button>
	        <el-button  @click="closeCreate">关闭</el-button>
	      </div>
	    </el-dialog>
	    <!-- /创建班级 -->
	</div>
</template>
<script>
	import model from 'model/clazz/list'
	import orgModel from 'model/organization/list'
	import aliyunDir from 'model/organization/list'
	import E from 'wangeditor'
	import ailiyunUpload from 'model/aliyun/index'

	export default {
	    data() {
		    return {

		        ruleClassForm:{
			        name:"",
			        desc:"",
			        beginDate: '',
					endDate: '',
					projectCode:'',
		        },
		        
		        rulesClass:{
			        name:[
			            { required: true, message: '请填写班级名称', trigger: 'blur'},
			            { max: 50, message: '班级名称不能超过50字', trigger: 'blur' }
			        ],
			        desc: [
			            { max: 20000, message: '班级简介不能超过20000字', trigger: 'blur'}
			        ],
			        beginDate: [
			                { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
			        ],
			        endDate: [
			                { type: 'string', required: true, message: '请选择截止日期', trigger: 'change' }
			        ],
		        },
		        
		        labelWidth: "120px",

		       
		        loading: false,

		        // 阿里云上传
		        editorClazz1: {},
		        percentage: 0,
		        aliyunName: '',
		        originalUrl: '',
						loadingText:0,
						agencyFlag:false,
		    }
	    },

	    props: ['dialogCreateClass','proId'],
	   	mounted() {
			   
	   	},
	    methods: {
		    open() {

		        this.$nextTick(() => {
		          	console.log("this.editorClazz1", this.editorClazz1.id);
		          	if(this.editorClazz1.id) {

			            this.editorClazz1.txt.html("");

			            console.log("txthtml==", this.ruleClassForm.desc,this.editorClazz1.txt.html());
			        } else {
			        	this.wangEditc1();
			        }
					})
					console.log(this.$route);
					let orgData = {id:this.$route.query.orgId?this.$route.query.orgId:JSON.parse(localStorage.orgId).identification}
					orgModel.getDetail(orgData,(res)=>{
						this.loading = false;
						if(res.status==200&&res.data.orgType=="AGENCY"){
							this.agencyFlag=true;
						}
					})
		    },
		    wangEditc1() {
	        let editorClazz1 = new E('#edit_menuc1', '#edit_contentc1')
	            
	            editorClazz1.customConfig.menus = [
	                'head',  // 标题
	                'bold',  // 粗体
	                'fontSize',  // 字号
	                'foreColor',  // 文字颜色
	                'link',  // 插入链接
	                'justify',  // 对齐方式
	                'quote',  // 引用
	                'emoticon',  // 表情
	                'image',  // 插入图片
	                'video',  // 插入视频
	                'undo',  // 撤销
	                'redo'  // 重复
	            ]

	            // 配置服务器端地址
	            editorClazz1.customConfig.customUploadImg = (files, insert) => {
	                // aliyun 上传图片
	                aliyunDir.getAliyunImg({}, (res => {
	                    if(res.status == 200) {
												this.percentage = 0;
												ailiyunUpload.aliyunUpload(res.data,files,(percentage, cpt)=>{
													this.loadingText = Math.round(percentage*100);
												}).then((results)=>{
													// 上传完成
													this.aliyunName = results.name.split("/").pop();
													this.originalUrl = decodeURI(results.res.requestUrls[0]).split('?')[0];                                   
													insert(this.originalUrl);                                                              

												}).catch((err)=>{
													this.$message.error('上传错误'+err);

												});
	                    } else {
	                        this.$message.error(res.message);
	                    }
	                }))
	            };

	            editorClazz1.customConfig.onchange = (html) => {
	                this.ruleClassForm.desc = html
	            };
	            editorClazz1.customConfig.zIndex = 1;
	            editorClazz1.create();
	            this.editorClazz1 = editorClazz1;

		    },
		    // 创建班级
		    createClass (formName) {
		        let _this = this;
		        this.$refs[formName].validate((valid) => {
		          if(valid) {
		            let data = {
		              name:this.ruleClassForm.name,
		              description: this.ruleClassForm.desc,
		              organizationId: this.orgId,
		              projectId: this.proId,
		              trainingBeginDate:this.ruleClassForm.beginDate,
									trainingEndDate:this.ruleClassForm.endDate,
									projectCode:this.ruleClassForm.projectCode
		            }
		            this.loading = true;
		            model.createClass(data,( res => {
		              if(res.status == 200) {
		                // this.$router.go(0);
		                this.closeCreate();
		                this.$emit("updateProList");
		                // this.getListFromPro();
		                this.ruleClassForm.name = "";
		                this.ruleClassForm.desc = "";
		                this.loading = false;
		              } else {
		                _this.$message.error(res.message);
		                this.loading = false;
		              }
		            }));
		          } else {
		            console.log('create class error submit!!');
		            return false;
		          }
		        });
		    },
		    resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },
		    closeCreate () {
		    	this.$emit('update:dialogCreateClass', false);
		        this.resetForm('ruleClassForm');
		    },
	     

		},

	}
</script>
<style scoped lang="less">
  	@import "../../assets/reset-element-ui/form.css";
  	.w-wang {
      	.text {
         	width: 100%;
          	height: 200px;
          	border: 1px solid #F2F0F0;
      	}
      	.toolbar {
          	width: 100%;
          	background: #FCFDFF;
          	border: 1px solid #F2F0F0;
          	height: 50px;
      	}
      	.w-e-toolbar{
          	.w-e-menu{
              	padding: 17px 10px;
          	}
      	} 
  	}
  	.line{
        float:left;
        margin: 0 10px;
        color: #a3b1c5;
    }
    .sign-time{
        float: left;
    }
    .sign-time-r{
        padding-left: 8px;
    }
</style>