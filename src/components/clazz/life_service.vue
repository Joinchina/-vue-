<template>
	<div id="wlifeService">
		<div class="bread-box">
			<bread-crumb	
				:clazzId="clazzId"
				:crumbLifeSev = '1'
				></bread-crumb>
		</div>
		<div class="wdetail round-layout w-wang">
			
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm">
				<el-form-item class="input" label="标题：" prop="title" :label-width="labelWidth">
					<el-input v-model.trim="ruleForm.title" placeholder="30字以内"></el-input>
				</el-form-item>
				<el-form-item class="textarea" label="内容：" prop="content" :label-width="labelWidth">
					<!-- <el-input type="textarea" v-model.trim="ruleForm.content" placeholder="20000字以内"></el-input> -->
					<div id="edit_menu" class="toolbar"></div>
                	<div id="edit_content" class="text"></div> 
				</el-form-item>
			</el-form>
			<button type="button" class="btn-green save" @click="submitForm('ruleForm')">保存</button>
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
		beforeRouteEnter (to, from, next) {
		    next(vm => {
		        if(vm.role == 'PROFESSOR') {
		          	vm.$router.push({path: '/clazz/menu', query: {clazzId: vm.clazzId}});
		        }
		    })
	    },
		data() {
			return {
				ruleForm: {
					title: "",
					content: ""
				},
				labelWidth: "120px",
				rules: {
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur'},
						{ max: 30, message: '30字以内', trigger: 'blur' }
					]					
				},
				id: '',		// 生活服务id

				// 阿里云上传
	            editor: {},
	            percentage: 0,
	            aliyunName: '',
	            originalUrl: '',
	            loadingText:0,
	            posturl:'',
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
			this.getLife();
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

	            editor.customConfig.onchange = (html) => {
					var str=html.toString();
					var num=str.indexOf('<!--[if gte mso 9]>')
	                var endnum=str.indexOf("<![endif]-->")
					var newstr = str.substring(num + 1,endnum)
					var a=str.split(newstr).join("")
	                this.ruleForm.content = a
	            };
	            editor.customConfig.zIndex = 1;
	            editor.create();
	            this.editor = editor;
			},
			getLife() {
				let data = {
					clazzId: this.clazzId
				}

				clazz.lifeDetails(data, (res => {
					// console.log("生活服务",res);
					if(res.status == 200) {
						this.ruleForm.title = res.data.title;
						this.ruleForm.content = res.data.content;
						this.editor.txt.html(this.ruleForm.content);
						this.id = res.data.id;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.editLife();
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			editLife() {
				let data = {
					id: this.id,
					clazzId: this.clazzId,
					title: this.ruleForm.title,
					content: this.ruleForm.content
				}
				// console.log("编辑",data);
				clazz.lifeSave (data, (res => {
					// console.log("编辑生活服务",res);
					if(res.status == 200) {
						this.$message.success("保存成功！");
						this.ruleForm.title = res.data.title;
						this.ruleForm.content = res.data.content;
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
	#wlifeService {
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
		.input,.textarea {
			color: #666;
			font-size: 15px;
			width: 720px;
		}
		label.el-form-item__label {
			font-size: 16px;
			color: #333;
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
