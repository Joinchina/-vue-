<template>
	<div id="wclazzDetail">
		<div class="bread-box">
			<bread-crumb	
				:clazzId="clazzId"
				:crumbDetail = '1'
				></bread-crumb>
		</div>
		
		<div class="wdetail round-layout w-wang">
			<template v-if="role !== 'PROFESSOR'">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm">
					<el-form-item class="input" label="班级名称：" prop="name" :label-width="labelWidth">
						<el-input v-model.trim="ruleForm.name" placeholder="50字以内"></el-input>
					</el-form-item>
					<el-form-item class="input" v-if="agencyFlag" label="项目编号：" :label-width="labelWidth" prop="projectCode">
						<el-input v-model.trim="ruleForm.projectCode" placeholder="请填写项目编号" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="面授周期：" :label-width="labelWidth" required>
			            <el-form-item prop="beginDate" class="sign-time">
                            <el-date-picker
                              type="date" 
                              value-format="yyyy-MM-dd"
                              placeholder="开始日期" 
                              v-model="ruleForm.beginDate" 
                              style="width: 100%;">
                            </el-date-picker> 
			            </el-form-item>
			            <span class="toline"> ~ </span>
			            <el-form-item prop="endDate" class="sign-time">
                            <el-date-picker
                              type="date" 
                              value-format="yyyy-MM-dd"
                              placeholder="结束日期" 
                              v-model="ruleForm.endDate"
                              style="width: 100%;">
                            </el-date-picker>
			         	</el-form-item>
			        </el-form-item>

					<el-form-item label="班级简介：" prop="content" :label-width="labelWidth">
						<!-- <el-input type="textarea" v-model="ruleForm.content" placeholder="20000字以内"></el-input> -->
						<div id="edit_menu" class="toolbar"></div>
                		<div id="edit_content" class="text"></div> 
					</el-form-item>
				</el-form>
				<button type="button" class="btn-green save" @click="submitForm('ruleForm')">保存</button>
			</template>
			
			<template v-else-if="role === 'PROFESSOR'">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm">
					<el-form-item label="班级名称：" prop="name" :label-width="labelWidth">
						<span>{{ruleForm.name}}</span>
					</el-form-item>
					<el-form-item label="面授周期：" prop="" :label-width="labelWidth">
						<span>{{ruleForm.beginDate}}</span> <span class=""> ~ </span> <span>{{ruleForm.endDate}}</span>
					</el-form-item>
					<el-form-item label="班级简介：" prop="" :label-width="labelWidth">
						<span class="deschtml" v-html="ruleForm.content" ></span>
					</el-form-item>
				</el-form>
			</template>
			
			
		</div>

	</div>
</template>
<script>
	import clazz from 'model/clazz/clazz'
	import breadCrumb from 'components/clazz/breadcrumb'
	import { getCurRole } from '@/filters/userVerify'

	import model from 'model/organization/list'
	import E from 'wangeditor'
	import ailiyunUpload from 'model/aliyun/index'

	export default {
		data () {
			return {
				
				ruleForm: {
					name: "",
					content: "",
					beginDate: '',
					endDate: '',
					projectCode:""
				},
				labelWidth: "120px",
				rules: {
					name: [
						{ required: true, message: '请输入班级名称', trigger: 'blur'},
						{ max: 50, message: '50字以内', trigger: 'blur' }
					],
					content: [
						{ max: 20000, message: '20000字以内', trigger: 'blur' }
					],
					beginDate: [
			            { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
			        ],
			        endDate: [
			            { type: 'string', required: true, message: '请选择截止日期', trigger: 'change' }
			        ],
				},

				 // 阿里云上传
	            editor: {},
	            percentage: 0,
	            aliyunName: '',
	            originalUrl: '',
	            loadingText:0,
				posturl:'',
				agencyFlag:false,
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			},
			role() {
				return getCurRole();
			}
		},
		created() {
			
		},
		mounted() {
			this.wangEdit();
			this.getClazz();
		},
		methods: {
			wangEdit() {
				let editor = new E('#edit_menu', '#edit_content')
            
	            editor.customConfig.menus = [
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
	            editor.customConfig.customUploadImg = (files, insert) => {
	                // aliyun 上传图片
	                model.getAliyunImg({}, (res => {
	                    if(res.status == 200) {
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

	            editor.customConfig.onchange = (html) => {
					var str=html.toString();
					var num=str.indexOf('<!--[if gte mso 9]>')
	                var endnum=str.indexOf("<![endif]-->")
					var newstr = str.substring(num + 1,endnum)
					var a=str.split(newstr).join("")
	                this.ruleForm.content =a
	            };
	            editor.customConfig.zIndex = 1;
	            editor.create();
	            this.editor = editor;
			},
			getClazz() {
				let data = {
					id: this.clazzId
				}

				clazz.getClassInfor(data, (res => {
					// console.log("班级信息",res);
					if(res.status == 200) {
						this.ruleForm.name = res.data.name;
						this.ruleForm.content = res.data.description;
						this.editor.txt.html(this.ruleForm.content);
						this.ruleForm.beginDate = res.data.trainingBeginDate;
						this.ruleForm.endDate = res.data.trainingEndDate;
						this.ruleForm.projectCode = res.data.projectCode;
						this.agencyFlag=res.data.orgType=="AGENCY";
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.editClazz();
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			editClazz() {
				let data = {
					id: this.clazzId,
					name: this.ruleForm.name,
					description: this.ruleForm.content,
					trainingBeginDate:this.ruleForm.beginDate,
					trainingEndDate:this.ruleForm.endDate,
					projectCode:this.ruleForm.projectCode
				}
				// console.log("编辑",data);
				clazz.editClass (data, (res => {
					// console.log("编辑班级信息",res);
					if(res.status == 200) {
						this.$message.success("保存成功！");
						this.ruleForm.name = res.data.name;
						this.ruleForm.content = res.data.description;
						this.ruleForm.beginDate = res.data.trainingBeginDate;
						this.ruleForm.endDate = res.data.trainingEndDate;
						this.ruleForm.projectCode = res.data.projectCode;
					} else {
						this.$message.error(res.message);
					}
				}));
			}
		},
		components: {
			breadCrumb
		}
	}
</script>
<style lang="less" scoped>
	.w-wang {
        .text {
            width: 600px;
            height: 250px;
            border: 1px solid #F2F0F0;
        }
        .toolbar {
            width: 600px;
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
    .deschtml {
        line-height: 1.5em;
    }
	#wclazzDetail {
		.wdetail {
			padding: 38px 180px;
			
		}
		.save {
			display: block;
			border: 0;
			padding: 10px 80px;
			margin: 18px auto;
			border-radius: 2px;
			font-size: 20px;
			&::after{
				width: 0;
				height: 0;
			}
		}
		.input {
			width: 720px;
		}
		input,textarea {
			color: #666;
			font-size: 15px;
			width: 600px;
		}
		label.el-form-item__label {
			font-size: 16px;
			color: #333;
		}

		.sign-time{
			width: 280px;
	        float: left;

	        input {
	        	width: 280px;
	        }
	    }
	   
	    .toline {
	    	float: left;
	    	width: 40px;
	    	line-height: 40px;
	    	text-align: center;
	    }
		
	}
	textarea.el-textarea__inner {
		width: 600px;
		height: 300px;
		font-size: 15px;
	}
	.el-form-item__content {
		line-height: auto;
	}
	
</style>
	

