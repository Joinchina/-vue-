<style scoped lang="less">
	@import "../../assets/reset-element-ui/form.css";
	.el-radio {
		margin-left: 15px;
		margin-bottom: 4px;
	}
	#wupdate {
		.update-file {
			
			.sel-btn {
				
				display: inline-block;
				width: 108px;
				height: 30px;
				background-color: #f2fbfa;
				border:1px solid #82cac3;
				color: #333;
				font-size: 14px;
				line-height: 30px;
				text-align: center;
				border-radius: 3px;
				cursor: pointer;
			}
			.sel-file {
				position: absolute;
				left: 0;
				opacity: 0;
				height: 35px;
    			cursor: pointer;
			}
			.file-name {
				display: inline-block;
				margin-left: 15px;
				font-size: 16px;
				line-height: 1em;
				color: #333;
				padding: 7px 20px;
				background-color: #ededed;
				word-break: break-all;
			}
		}
		.tip {
			font-size: 14px;
			line-height: 1.6em;
			color: #999;
			span {
				float: left;
			}
			a {
				display: block;
				text-decoration: underline;
				color: #3182d9;
			}
		}
	}
</style>
<template>
	<div id="wupdate">
		<el-dialog class="dialog-form" title="上传资源"
			:visible.sync="dialogUpdate"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open"
			>
			<div v-loading="loading" :element-loading-text="loadingText">

			<el-form :model="ruleForm0"  ref="ruleForm0">
				<el-form-item label="资源类型：" prop="type" 
					:label-width="labelWidth"
					:rules="[
								{ required: true, message: '请选择文件类型', trigger: 'change'}
							]"
					>					
					<el-radio-group v-model="type" @change="toggleTabs">
					    <el-radio 
					    	v-for="(item,index) in tabnav" 					    	
					    	:key="index" 
					    	:label="index"
					    	>{{item}}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			
			<el-form :model="ruleForm"  ref="ruleForm" :rules="rules">
								
				<template v-if="nowIndex === 'VIDEO'">
					<el-form-item label="选择文件：" prop="filename" class="update-file"
						:label-width="labelWidth"
						>
						<!-- 视频 -->
						<label for="file" class="sel-btn">选择文件</label>
						<input type="file" class="sel-file" id="file" name="ruleForm.file" accept=".avi,.mpg,.wmv,.3gp,.mov,.mp4,.asf,.asx,.flv"  @change="addvideo($event)">
						<span v-if="ruleForm.filename" class="file-name">{{ruleForm.filename}}</span>
						
						<!-- 视频 -->
						<div class="tip">
							<p>注意：视频大小在300M 以内</p>
						</div>
					</el-form-item>
					
					<el-form-item label="资源地址：" prop="videoLinkUrl" 
						:label-width="labelWidth"				
						>
						<el-input class="cont" v-model.trim="ruleForm.videoLinkUrl" placeholder="请输入视频资源地址，上传文件或地址二选一"></el-input>
					</el-form-item>

				</template>
					
					<!-- word -->
				<template v-if="nowIndex === 'WORD'">
					<el-form-item label="选择文件：" prop="filename" class="update-file"
						:label-width="labelWidth"
						:rules="[
								{ required: true, message: '请选择文件', trigger: 'blur'}
							]"
						>
						<label for="file" class="sel-btn">选择文件</label>
						<input type="file" class="sel-file" id="file" name="ruleForm.file" accept=" application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"  @change="selFiles($event, 'WORD')">
						<span v-if="ruleForm.filename" class="file-name">{{ruleForm.filename}}</span>
						
						<div class="tip">
							<p>注意：Word / PPT / PDF / 大小在30M以内</p>
						</div>
					</el-form-item>


				</template>
					
					<!-- ppt -->
				<template v-if="nowIndex === 'PPT'">
					<el-form-item label="选择文件：" prop="filename" class="update-file"
						:label-width="labelWidth"
						:rules="[
								{ required: true, message: '请选择文件', trigger: 'blur'}
							]"
						>	
						<label for="file" class="sel-btn">选择文件</label>
						<input type="file" class="sel-file" id="file" name="ruleForm.file" accept=".ppt,.pptx"  @change="selFiles($event, 'PPT')">
						<span v-if="ruleForm.filename" class="file-name">{{ruleForm.filename}}</span>
						
						<div class="tip">
							<p>注意：Word / PPT / PDF / 大小在30M以内</p>
							
						</div>
					</el-form-item>
				</template>

					<!-- pdf -->
				<template v-if="nowIndex === 'PDF'">
					<el-form-item label="选择文件：" prop="filename" class="update-file"
						:label-width="labelWidth"
						:rules="[
								{ required: true, message: '请选择文件', trigger: 'change'}
							]"
						>
						<label for="file" class="sel-btn">选择文件</label>
						<input type="file" class="sel-file" id="file" name="ruleForm.file" accept=" application/*"  @change="selFiles($event, 'PDF')">
						<span v-if="ruleForm.filename" class="file-name">{{ruleForm.filename}}</span>
						
						<div class="tip">
							<p>注意：Word / PPT / PDF / 大小在30M以内</p>
							
						</div>
					</el-form-item>
				</template>
				
				<!-- // 压缩包 -->
				<template v-if="nowIndex === 'ZIP'">
					<el-form-item label="选择文件：" prop="filename" class="update-file"
						:label-width="labelWidth"
						:rules="[
								{ required: true, message: '请选择文件', trigger: 'blur'}
							]"
						>	
						<label for="file" class="sel-btn">选择文件</label>
						<input type="file" class="sel-file" id="file" name="ruleForm.file" accept=".zip,.rar"  @change="addZip($event)">
						<span v-if="ruleForm.filename" class="file-name">{{ruleForm.filename}}</span>
						
						<div class="tip">
							<p>注意：压缩包大小在300M以内</p>
							
						</div>
					</el-form-item>
				</template>
				
				<template v-if="nowIndex === 'VIDEO' || nowIndex === 'WORD' || nowIndex === 'PPT' || nowIndex === 'PDF' || nowIndex === 'ZIP'">
					<el-form-item label="资源名称：" prop="content" 
						:label-width="labelWidth"
						:rules="[
							{ required: true, message: '请填写资源名称', trigger: 'blur'},
							{ max: 50, message: '50字以内', trigger: 'blur'}
						]"
						>
						<el-input class="cont" v-model.trim="ruleForm.content" placeholder="50字以内"></el-input>
					</el-form-item>
					
					<el-form-item 
						label="是否允许下载：" 
						prop="download" 
						:label-width="labelWidth"
						>
						<el-switch
							v-model="ruleForm.download"
							:disabled="nowIndex === 'ZIP'"
							active-text=""
							inactive-text="">
						</el-switch>

					</el-form-item>
					<div class="tip">
						<p class="clearfix">
							<span>帮助：</span>
							<span>
								<a target="_blank" href="http://www.jianshu.com/p/23dc5ad925b5">查看Word、PPT转PDF方法</a>
								<a target="_blank" href="http://www.jianshu.com/p/65b779451777">查看PPT压缩教程</a>
							</span>
						</p>
					</div>
				</template>
				
				<!-- 链接地址 -->
				<template v-if="nowIndex === 'URL'">
					<el-form-item label="链接地址：" prop="url" 
						:label-width="labelWidth"
						:rules="[
							{ required: true, message: '请输入链接地址', trigger: 'blur'},
						]"
						>
						<el-input v-model.trim="ruleForm.url" placeholder="请输入网页链接地址，如：www.baidu.com"></el-input>
					</el-form-item>
					<el-form-item label="资源名称：" prop="urlcont" 	
						:label-width="labelWidth"
						:rules="[
							{ required: true, message: '请输入资源名称', trigger: 'blur'},
							{ max: 50, message: '内容已超过50字', trigger: 'blur'}
						]"
						>
						<el-input v-model.trim="ruleForm.urlcont" placeholder="请输入网页链接地址，如：百度"></el-input>
					</el-form-item>
				</template>

				<!-- 文本 -->
				<template v-if="nowIndex === 'TEXT'">
					<el-form-item label="资源名称：" prop="text" 	
						:label-width="labelWidth"
						:rules="[
							{ required: true, message: '请输入资源名称', trigger: 'blur'},
							{ max: 50, message: '内容已超过50字', trigger: 'blur'}
						]"
						>
						<el-input v-model.trim="ruleForm.text" placeholder="50字以内"></el-input>
					</el-form-item>
					<el-form-item label="内容：" prop="textcont" 	
						:label-width="labelWidth"
						:rules="[
							{ required: true, message: '请输入内容', trigger: 'blur'},
							{ max: 20000, message: '内容已超过2万字', trigger: 'blur'}
						]"
						>
						<el-input type="textarea" v-model.trim="ruleForm.textcont" placeholder="20000字以内"></el-input>
					</el-form-item>
				</template>

			</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="!loading && submitForm('ruleForm')">确定</el-button>
				<el-button @click="close">关闭</el-button>
			</div>
		</el-dialog>

		<!-- 存储空间不足弹框 -->
		<overLimitPop 
			:overLimitDialog.sync = "overLimit" 
			:text = "'您所属机构的存储空间已达上限，新增培训数据无法存储'" 
			:footerText = "'增加存储空间'" 
			:param="'storage'"></overLimitPop>
	</div>
</template>
<script>
	import model from 'model/library/library'
	import overLimitPop from "@/base/overLimitPop/index"
	import ailiyunUpload from 'model/aliyun/index'

	export default {
		data () {
			var checkVideoLink = (rule, value, callback) => {
				
				if(value && value.toLowerCase().split(".").pop() != 'mp4') {
					callback(new Error('必须是以.MP4为后缀的链接形式'));
				} else {
					callback();
				}
			};

			return {
				tabnav: {
					'VIDEO': '视频',
					'WORD': 'word',
					'PPT': 'PPT',
					'PDF': 'PDF',
					'URL': '网页链接',
					'TEXT': '文本',
					'ZIP': '压缩包'
				},
				ruleForm0: {
					type: 'VIDEO',
				},
				type: 'VIDEO',
				nowIndex: 'VIDEO',
				filename: '',			// 上传文件名称
				ruleForm: {					
					file: '',
					content: '',
					filename: '',
					download: false,
					url: '',
					urlcont: "",
					text: '',
					textcont: '',
					videoLinkUrl: '',//手输资源地址
					originalUrl:'',//阿里云返回的url
				},
				
				labelWidth: '125px',
				loading: false,
				loadingText: '',
				rules: {
					videoLinkUrl: [
						{ validator: checkVideoLink, trigger: 'blur' }
					]
				},

				overLimit : false,   // 空间不足
									
			};
		},
		props: ['dialogUpdate','parentId','clazzId','orgId'],
		computed: {
           
		},
		created(){
			
		},
		methods: {
			
			open() {
				this.loading = false;
				if(this.nowIndex == "ZIP"){
					this.ruleForm.download = true;
				}
			},
			close() {
				if(typeof ailiyunUpload.client.cancel == "function"){
					ailiyunUpload.client.cancel();
				}
				this.$emit('update:dialogUpdate', false);
				this.ruleForm.file = '';
				this.resetForm('ruleForm');	
				if(document.getElementById("file")) {
					document.getElementById("file").value = "";
				}
				
				
			},
			clearfile(){
				this.resetForm('ruleForm');
				this.ruleForm.file='';
				this.ruleForm.content='';
				this.ruleForm.filename='';
				this.ruleForm.url='';
				this.ruleForm.urlcont='';
				this.ruleForm.text='';
				this.ruleForm.textcont='';
				this.ruleForm.videoLinkUrl='';
				this.ruleForm.originalUrl='';
				this.ruleForm.download=false;
				this.ruleForm.addToLib=false;
			},
			toggleTabs(index) {
				
				this.nowIndex = index;
				this.clearfile();
				if(document.getElementById("file")) {
					document.getElementById("file").value = "";
				}
				if(this.nowIndex == "ZIP"){
					this.ruleForm.download = true;
				}
			},
			selFiles(event, type) {
				let name = event.target.value;
				this.ruleForm.filename = name.split("\\").pop();
				this.ruleForm.file = event.target.files[0];

				const filetype = name.split(".").pop();
				if(type == 'WORD' && '.doc, .docx'.indexOf(filetype) == -1) {
					this.$message.error("请上传WORD格式文件~");
					this.ruleForm.file = "";
					this.ruleForm.filename = "";
					event.target.value = "";
					return false;
				}

				if (type == 'PPT' && '.ppt, .pptx'.indexOf(filetype) == -1) {
					this.$message.error("请上传PPT格式文件~");
					this.ruleForm.file = "";
					this.ruleForm.filename = "";
					event.target.value = "";
					return false;
				}

				if (type == 'PDF' && '.pdf'.indexOf(filetype) == -1) {
					this.$message.error("请上传PDF格式文件~");
					this.ruleForm.file = "";
					this.ruleForm.filename = "";
					event.target.value = "";
					return false;
				}

				if(this.ruleForm.content == ""){
					let filename = this.ruleForm.filename;
					this.ruleForm.content = filename.substring(0,filename.lastIndexOf("."));
				}
				console.log(this.ruleForm.file)

			},
			//移除效验
			resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },
			submitForm(formName) {
		    	this.$refs[formName].validate((valid) => {
		    		if (valid) {
		    			// 限制文件大小
		    			if(this.nowIndex == 'WORD' || this.nowIndex == 'PPT' || this.nowIndex == 'PDF') {
		    				let size = this.ruleForm.file.size;
		    				if(size < 31457280) {
		    					this.resourceAdd();
		    				} else {
		    					this.$message.error("您上传文件不能超过30M！");
		    				}
							}
							if(this.nowIndex == 'ZIP') {
		    				let size = this.ruleForm.file.size;
		    				if(size < 314572800) {
		    					this.resourceAdd();
		    				} else {
		    					this.$message.error("您上传文件不能超过300M！");
		    				}
		    			}

		    			// 视频资源地址二选一
		    			if(this.nowIndex == 'VIDEO') {

		    				if(this.ruleForm.file.length!=0 && this.ruleForm.videoLinkUrl.length!=0) {
								this.$message.error("文件或视频链接，只能选择一个填写哦~");
								this.ruleForm.file='';
								this.ruleForm.originalUrl='';
								this.ruleForm.filename='';
							};
							if(this.ruleForm.file.length!=0 && this.ruleForm.videoLinkUrl.length==0) {
								if(this.ruleForm.originalUrl.length!=0){
									this.resourceAdd();
									this.ruleForm.file='';	
								}else{
									this.$message.error("视频还没有上传成功，请耐心等待片刻~");	 
								};
							};
							if(this.ruleForm.videoLinkUrl.length!=0 && this.ruleForm.file.length==0) {
								if(this.ruleForm.videoLinkUrl.length!=0){
									this.resourceAdd();
								}else{
									this.$message.error("请输入视频链接地址~");
								}
		    				}; 
		    				
		    			}


		    			if(this.nowIndex == 'URL' || this.nowIndex == 'TEXT') {
		    				this.resourceAdd();
		    			}

		    			
		    		} else {
		    			console.log('error submit!!');
		    			return false;
		    		}
		    	});
		    },
		    resourceAdd() {
				// console.log(this.orgId)
				// console.log(this.clazzId)
				// console.log(parseInt)		    	
				let data = {};
		    	switch(this.nowIndex) {
		    		case 'VIDEO':
		    			data = {
		    				name: this.ruleForm.content,
		    				type: 'VIDEO',
								clazzId: this.clazzId,
								organizationId:this.orgId,
		    				parentId: this.parentId,
								videoLinkUrl: this.ruleForm.videoLinkUrl,
								originalUrl:this.ruleForm.originalUrl,
		    				downloadFlag: this.ruleForm.download 
		    			}
		    			break;
		    		case 'WORD':
		    			data = {
		    				name: this.ruleForm.content,
		    				type: 'WORD',
								clazzId: this.clazzId,
								organizationId:this.orgId,
		    				parentId: this.parentId,
		    				file:this.ruleForm.file,
								downloadFlag: this.ruleForm.download,
								'errCallBack' : this.storeNotEnough,  
		    			}
		    			break;
		    		case 'PPT':
		    			data = {
		    				name: this.ruleForm.content,
		    				type: 'PPT',
								clazzId: this.clazzId,							
								parentId: this.parentId,
								organizationId:this.orgId,
		    				file:this.ruleForm.file,
								downloadFlag: this.ruleForm.download,
								'errCallBack' : this.storeNotEnough,
		    			}
							break;
						case 'ZIP':
							data = {
									name: this.ruleForm.content,
									type: 'ZIP',
									clazzId: this.clazzId,
									parentId: this.parentId,
									linkUrl:this.ruleForm.originalUrl,
									downloadFlag: this.ruleForm.download,
									addToLib:this.ruleForm.addToLib, 
							}
		    			break;
		    		case 'PDF': 
		    			data = {
		    				name: this.ruleForm.content,
		    				type: 'PDF',
		    				clazzId: this.clazzId,
								parentId: this.parentId,
								organizationId:this.orgId,
		    				file:this.ruleForm.file,
								downloadFlag: this.ruleForm.download,
								'errCallBack' : this.storeNotEnough,
		    			}
		    			break;
		    		case 'URL':
		    			data = {
		    				name: this.ruleForm.urlcont,
		    				type: 'URL',
								clazzId: this.clazzId,
								organizationId:this.orgId,
		    				parentId: this.parentId,
								linkUrl: this.ruleForm.url,
								'errCallBack' : this.storeNotEnough,
		    			}
		    			break;
		    		case 'TEXT': 
		    			data = {
		    				name: this.ruleForm.text,
		    				type: 'TEXT',
								clazzId: this.clazzId,
								organizationId:this.orgId,
		    				parentId: this.parentId,
								content: this.ruleForm.textcont,
								'errCallBack' : this.storeNotEnough,
		    			}
		    			break;
		    	}
		    	// console.log("上传参数",data);
		    	this.loading = true;
		    	model.librarysave (data, (res => {
		    		//console.log("上传资源回调",res)
		    		if(res.status == 200) {
		    			this.close();
		    			this.$emit("updateRes");
		    			this.loading = false;
						this.resetForm('ruleForm');		    			
		    		} else {
		    			if(res.status == 423){
								this.overLimit = true;
							}else{
								this.$message.error(res.message);
							}
		    			this.loading = false;
		    			this.resetForm('ruleForm');
		    		}
		    	}),(res => {
		    		// 加进度条
		    		let progress = Math.round(parseFloat(res.loaded/res.total)*100);
		    		this.loadingText = "文件上传中" + progress + '%';

		    	}));
		    	
			},
			//视频上传阿里云
			addvideo(e){
				const _this = this;
				_this.loading=true;
				_this.ruleForm.file=e.target.files[0];

				let type = e.target.files[0].name.split(".").pop();
				if(".avi,.mpg,.wmv,.3gp,.mov,.mp4,.asf,.asx,.flv".indexOf(type) == -1) {
					this.$message.error("请上传视频文件~");
					_this.loading=false;
					_this.ruleForm.file='';
					e.target.value = '';
					return;
				};

				if(e.target.files[0].size>314572800){
					this.$message.error("请上传小于300M的视频资源~");
					_this.loading=false;
					_this.ruleForm.file='';
					e.target.value = '';
					return;
				};
				let data={

				};
				model.getlibraryvideo(data,(result=>{
					if(result.status==200){
						_this.loading=true;   
						_this.percentage = 0;
						const files = document.getElementById("file").files;
						ailiyunUpload.aliyunUpload(result.data,files,(percentage, cpt)=>{
							this.loadingText = "文件上传中"+Math.round(percentage*100)+'%'
						}).then((results)=>{
							// 上传完成
							console.log(results)
							let filenamestr = results.name.split("/").pop();
							_this.ruleForm.filename=files[0].name
							if(_this.ruleForm.content == ""){
								let filename = _this.ruleForm.filename;
								this.ruleForm.content = filename.substring(0,filename.lastIndexOf("."));
							}	
							_this.ruleForm.originalUrl = decodeURI(results.res.requestUrls[0].split("?").shift());
							_this.loading=false;   
							this.$message({
								message: '恭喜你，视频上传成功',
								type: 'success'
							});
						}).catch((err)=>{
							if(typeof err == "object" && err.status == 423){
								this.storeNotEnough();
							}else{
								if(typeof err == "object" && err.name == "cancel"){
									this.$message.error('上传已取消');
								}else{
									this.$message.error('上传错误');
								}
							}
							

						});
					}else{
						this.$message.error(result.message);
					}
				}))
			},

			//压缩包上传阿里云
			addZip(e){
				const _this = this;
				_this.ruleForm.file=e.target.files[0];

				let type = e.target.files[0].name.split(".").pop();
				if(".zip,.rar".indexOf(type) == -1) {
					this.$message.error("请上传压缩包文件~");
					_this.loading=false;
					_this.ruleForm.file='';
					e.target.value = '';
					return;
				};

				if(e.target.files[0].size>314572800){
					this.$message.error("请上传小于300M的压缩包资源~");
					_this.loading=false;
					_this.ruleForm.file='';
					e.target.value = '';
					return;
				};
				model.getLibraryAliyunZip({},(result=>{
					if(result.status==200){
						_this.loading=true;   
						_this.percentage = 0;
						const files = document.getElementById("file").files;
						ailiyunUpload.aliyunUpload(result.data,files,(percentage, cpt)=>{
							this.loadingText = "文件上传中"+Math.round(percentage*100)+'%'
						}).then((results)=>{
							// 上传完成
							console.log(results)
							let filenamestr = results.name.split("/").pop();
							_this.ruleForm.filename=files[0].name
							if(_this.ruleForm.content == ""){
								let filename = _this.ruleForm.filename;
								this.ruleForm.content = filename.substring(0,filename.lastIndexOf("."));
							}	
							_this.ruleForm.originalUrl = decodeURI(results.res.requestUrls[0].split("?").shift());
							_this.loading=false;   
							this.$message({
								message: '恭喜你，压缩包上传成功',
								type: 'success'
							});
						}).catch((err)=>{
							_this.loading=false;
							console.log(	_this.loading)
							if(typeof err == "object" && err.status == 423){
								this.storeNotEnough();
							}else{
								if(typeof err == "object" && err.name == "cancel"){
									this.$message.error('上传已取消');
								}else{
									this.$message.error('上传错误');
								}
							}

						});													
					}else{
						_this.loading=false; 
						this.$message.error(result.message);
					}
				}))
			},

			// 存储空间不足
			storeNotEnough(error){
				this.loading=false;
				this.overLimit = true;
				if(document.getElementById("file")) {
					document.getElementById("file").value = "";
				}
			},
		    
		},

		components:{
			overLimitPop
	    }
	}
</script>