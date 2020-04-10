<template>
	<div id="wcoursePlan" class="form-reset">
		<div class="bread-box">
			<Goback :passtitle="passtitle" path="/clazz/menu" :query="query"></Goback>
			<button type="button" class="btn-green wissue" @click="submitForm('ruleForm')">
				<i class="icon-issue"></i>
				发布
			</button>
		</div>

		<section class="wadd-schedule round-layout">

			<el-form :model="ruleForm" :rules="rules" ref="ruleForm">
				<el-form-item label="文件类型：" prop="type" :label-width="labelWidth" >
					<el-radio-group v-model="ruleForm.type" @change="toggleTabs">
					    <el-radio 
					    	v-for="item,index in tabnav" 
					    	
					    	:key="index" 
					    	:label="index"
					    	>{{item}}</el-radio>
					    <!-- <el-radio label="IMAGE">图片</el-radio> -->
					</el-radio-group>
				</el-form-item>
				
				<template v-if="nowIndex === 'PDF'">
					<el-form-item label="相关文件：" prop="filepdf" :label-width="labelWidth" class="update-file">
						<label for="file" class="sel-btn">选择文件</label>
						<input type="file" class="sel-file" id="file" name="ruleForm.files" accept="application/pdf, application/msword"  @change="selFiles($event)">
						
						<span v-if="ruleForm.file" class="file-name">{{ruleForm.filepdf}}</span>
						<p>注意：文件大小在5M以内</p>
					</el-form-item>
				</template>

				<template v-if="nowIndex === 'IMAGE'">
					<el-form-item label="相关文件：" :label-width="labelWidth"  prop="imageUrl" class="avatar-uploader">
						<label for="fileName" class="sel3">选择图片</label>
						<input class="sel4 select-file" multiple="true" id="fileName" type="file" name="ruleForm.photo"  accept="image/png,image/gif,image/jpeg"  @change="selAvatar($event)">

						<div style="margin-top:40px;" v-model="ruleForm.imageUrl">
							<ul v-if = "ruleForm.imageUrl.length != ''" class="clearfix">
								<li v-for="(item,index) in ruleForm.imageUrl" :key="index">
									<img :src="item" class="avatar" style="width:150px;height: 150px;">
									<span class="icon-dis-error error" @click="deletePic(index,$event)"></span>
								</li>
							</ul>

						</div>
					</el-form-item>

					<el-form-item label="补充内容：" prop="content" :label-width="labelWidth">
						<el-input type="textarea" class="cont" v-model="ruleForm.content" placeholder="100字以内"></el-input>
					</el-form-item>
				</template>
				

			</el-form>

		</section>

		<!-- 存储空间不足弹框 -->
		<overLimitPop 
			:overLimitDialog.sync = "overLimit" 
			:text = "'您所属机构的存储空间已达上限，新增培训数据无法存储'" 
			:footerText = "'增加存储空间'" 
			:param="'storage'"></overLimitPop>
	</div>
</template>
<script>
	import model from 'model/clazz/course'
	import Goback from 'base/goback/goback';
	import overLimitPop from "@/base/overLimitPop/index"

	export default {
		data() {
			return {
				tabnav: {
					'PDF': 'PDF/word',
					'IMAGE': '图片'
				},
				
				nowIndex: 'PDF',	// 默认tab切换是PDF
				num:0,	// 图片数量
				ruleForm: {
					type:"PDF",
					photo: [],
					imageUrl: [],  // 本地图像集合
					files: "",		// PDF/WORD
					filepdf: '',		// PDF/WORD本地文件名
					file: '',			// pdf/word 文件集合
					content: ""
				},
				labelWidth: "120px",
				rules: {
					type: [
					{ required: true, message: '请选择文件类型', trigger: 'blur'}
					],
					filepdf: [
					{ required: true, message: '请选择文件', trigger: 'blur'}
					],
					imageUrl: [
					{ type: 'array', required: true, message: '请选择图片', trigger: 'blur' }
					],
					content: [
					{ max: 100, message: '100字以内', trigger: 'blur'}
					]
				},
				passtitle:'发布课程安排',
				overLimit : false,   // 空间不足
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			},
			query() {
				return { clazzId: this.$route.query.clazzId };
			}
		},
		created() {

		},
		methods: {
			toggleTabs(index) {
				this.nowIndex = index;
				this.clearForm("ruleForm");
			},
			selFiles(event) {
				let name = event.target.value;
				this.ruleForm.filepdf = name.split("\\").pop();
				this.ruleForm.file = event.target.files[0];

				this.filterFormat(name,(() => {
					this.ruleForm.filepdf = "";
					this.ruleForm.file = "";
				}));
			},
			selAvatar (event) {
				if(this.num == 9){
					this.$message.error("最多只能添加9张图片");
					return;
				}
				let _this = this;
				let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
				if (extend == "jpg" || extend == "png" || extend == "gif" || extend == "jpeg") {

					let objUrl = event.target.files[0];
					_this.ruleForm.photo.push(objUrl);
					let windowURL = window.URL || window.webkitURL;
					let imageUrl = windowURL.createObjectURL(objUrl);
					_this.ruleForm.imageUrl.push(imageUrl);

				}

				this.num++;
		       
		    },
		    deletePic(index,event){
		    	this.num--;
		    	if(this.num == 0){
		    		this.num = 0;
		    	}
		    	this.ruleForm.imageUrl.splice(index,1);
		    	this.ruleForm.photo.splice(index,1);
		    	document.getElementById("fileName").value = "";
		    },

		    submitForm(formName) {
		    	this.$refs[formName].validate((valid) => {
		    		if (valid) {
		    			this.addCoursePlan();
		    		} else {
		    			console.log('error submit!!');
		    			return false;
		    		}
		    	});
		    },
		    clearForm(formName) {
		    	this.$refs[formName].clearValidate();
		    },
		    addCoursePlan() {
		    	// 图片
		    	if(this.nowIndex === 'IMAGE') {
		    		let data = {
			    		'clazzId': this.clazzId,
			    		'type': this.nowIndex,
			    		'content': this.ruleForm.content,
						'errCallBack' : this.storeNotEnough,
			    	}
			    	model.scheduleAddImg(data, (res => {
			    		// console.log("发布课程安排",res);
			    		if(res.status == 200) {
			    			this.$message.success("课程安排发布成功！");
			    			this.$router.push({ path: '/clazz/course/result', query: {clazzId: this.clazzId}});
			    		} else {
							if(res.status == 423){
								this.overLimit = true;
							}else{
								this.$message.error(res.message);
							}
			    		}
			    	}), this.ruleForm.photo);
		    	}
		    	// 文件
		    	if(this.nowIndex === 'PDF') {
		    		let data = {
			    		'clazzId': this.clazzId,
			    		'type': this.nowIndex,
			    		'pdf': this.ruleForm.file,
						'errCallBack' : this.storeNotEnough,
			    	}
			    	model.scheduleAddPdf(data, (res => {
			    		// console.log("发布课程安排",res);
			    		if(res.status == 200) {
			    			this.$message.success("课程安排发布成功！");
			    			this.$router.push({ path: '/clazz/course/result', query: {clazzId: this.clazzId}});
			    		} else {
							if((res.status == 205 && res.message=="机构存储空间已满") || res.status == 423) {
								this.overLimit = true;
							}else{
								this.$message.error(res.message);
							}
			    			
			    		}
			    	}));
		    	}
		    	
			},
			// 存储空间不足
			storeNotEnough(error){
				if(error.response.status == 423){
					this.overLimit = true;
				};
			},
		    filterFormat(path, errorCb, succCb) {
		    	let fileArr = path.split("\\");
		    	let fileTarr = fileArr[fileArr.length-1].toLowerCase().split(".");
		    	let filetype = fileTarr[fileTarr.length-1];
		    	// console.log("filetype",filetype);
		    	if(filetype!="pdf" && filetype != "doc" && filetype != "docx") {
		    		this.$message.error("上传文件格式不正确！");
		    		if(errorCb) {
		    			errorCb();
		    		}
		    		return false;
		    	} else {
		    		if(succCb) {
		    			succCb();
		    		}
		    		return true;
		    	}
		    }

		},
		components: {
			Goback,
			overLimitPop
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	@import "../../../assets/reset-element-ui/form-reset.css";
	.bread-box {
		position: relative;
		margin-bottom: 15px;
		.btn-green,
		.btn-blue {
			display: inline-block;
			position: absolute;
			top:0;
			padding: 10px 15px;
			font-size: 16px;
			&::after{
				width: 0;
				height: 0;
			}
		}
		.wissue {
			right: 0;
		}
		
	}
	.wadd-schedule {
		min-height: 400px;
		padding: 38px 20px;

		.cont {
			width: 466px;
		}
		.update-file {
			
			.sel-btn {
				
				display: inline-block;
				width: 108px;
				height: 30px;
				background-color: #f2fbfa;
				border:1px solid #82cac3;
				color: #333;
				font-size: 16px;
				line-height: 30px;
				text-align: center;
				border-radius: 3px;
				cursor: pointer;
			}
			.sel-file {
				position: absolute;
				left: 0;
				opacity: 0;
			}
			.file-name {
				display: inline-block;
				margin-left: 15px;
				font-size: 16px;
				line-height: 1em;
				color: #333;
				padding: 7px 20px;
				background-color: #ededed;
			}
		}

	}

	.avatar-uploader {
		.avatar {
			display: inline-block;
			background-color: #fbfdff;
			border: 1px dashed #d9d9d9;
			border-radius: 6px;

			position: relative;
			overflow: hidden;
			text-align: center;

		}
		.el-icon-plus {
			margin-top: 40px;
			margin-top: 34px;
			font-size: 18px;
			color: #999;
		}
		.avatar {
			width: 88px;
			height: 88px;
		}
		.sel3,
		.sel4 {
			position: absolute;
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
		}
		.sel3 {
			top: 5px;
		}
		.sel4 {
			opacity: 0;
		}
		
	}
	.avatar-uploader img{
		margin-right: 10px;
		margin-bottom: 10px;
	}
	.avatar-uploader li{
		float:left;
		position: relative;
	}
	.avatar-uploader .error{
		position: absolute;
		right: 0px;
		top: -5px;
	}
</style>