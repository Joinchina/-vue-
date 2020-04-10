<template>
	<div>
		<h1>{{ msg }}</h1>
	    <h2>Essential Links</h2>
	    <h2>{{ obj.a }}</h2>
    	<input type="text" name="code" placeholder="输入遍历的次数，小于5个" style="width: 230px"><br /><br />
			<!--************************************上传***********************************-->
    	<el-form :model="formName" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
	      	<el-form-item label="活动名称" prop="name">
	        	<el-input :rules="rules" v-model="formName.name" ref="rulePhone" style="width:320px"></el-input>
	      	</el-form-item>
	      	<el-form-item :label-width="labelWidth"  prop="photo" class="avatar-uploader">
				<label for="fileName" class="sel2">
					<span class="icon-dis-add"></span>添加照片</label>
					<input class="sel1 select-file" multiple="true" id="fileName" type="file" name="ruleForm.photo" accept="image/png,image/gif,image/jpeg"  @change="selAvatar($event)">
					<div class="imagesUpload">
						<ul v-if="imageUrl.length != ''">
							<li v-for="(item,index) in imageUrl" :key="index">
								<img :src="item" class="avatar">
								<span class="icon-dis-error error"></span>
							</li>
						</ul>
					</div>
			</el-form-item>
			<!--新增作业附件-->
			<open-upload
				:fileNum = "fileNum" 
				ref="openUploads" 
				:fileLists = "formName.fileLists" 
				@fileList = "fileListAll">
			</open-upload>
			<section class="loadText">
				{{ loadingText }}
			</section>
    	</el-form>
    	<footer class="footer">
	    	<el-button type="primary" @click="submitRule('ruleForm')" round>test ElemeRules</el-button>
			<el-button @click="sendGet()">
				get请求
			</el-button>
			<el-button @click="sendPost()">
				post请求
			</el-button>
			<el-button @click="postFile()">
				post-file请求
			</el-button>
			<el-button @click="postJson()">
				post-json请求
			</el-button>
		</footer>
		

	</div>
</template>
<script>
	import business from "@/model/requestdemo/request"
	import openUpload from '@/base/upload/upload'
	export default {
		data() {
			return business.vdata;
			
		},

		created() {

		},

		methods: {

			submitRule(name) {
			    this.$refs[name].validate((valid) => {
			       alert(valid);
			    });
				},
				
    		sendGet() {
		        business.getClazzDetail({
			        "id" : 1235
		        },this).catch((err)=>{
		        	this.formName.name = err.status;
		        	alert(err.message);
		        }).finally(()=>{
		        	console.log("请求结束了");
		        });
				},
				
    		sendPost() {
		        business.userNameLogin({
		          'username': "sxb187903",
		          'password': "123456"
		        },this).catch(err=>{
		        	console.log("xxxx====",err);
		        }).finally(()=>{
		        	console.log("成功失败执行");
		        });
				},
				
		    selAvatar(event) {
		        if(this.num == 9) {
		          this.$message.error("最多只能添加9张图片");
		          return;
		        }
		        let _this = this;
		        let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
		        if (extend == "jpg" || extend == "png" || extend == "gif" || extend == "jpeg") {
			        let objUrl = event.target.files[0];
			        _this.formName.photos.push(objUrl);
			        let windowURL = window.URL || window.webkitURL;
			        let imageUrl = windowURL.createObjectURL(objUrl);
			        console.log("imageUrl===",imageUrl);
					_this.imageUrl.push(imageUrl);
					this.num++;
		        }
				},
				
		    fileListAll(val) {
		    	this.formName.fileLists = val;
				},
				
		    postFile() {
		    	this.loadingText = "";
		    	let data = {
		    		title : "贾君彦上传文件",
		    		content : "上传作业perfect",
		    		courseId : "5565",
		    		beginTime : "2019-5-20",
		    		endTime : "2019-5-30",
		    		specifyStudent : false,
		    		ids : [],
		    		openMode : "TIMING",
		    		file:{
		    			"files" : this.formName.photos,
		    			"attachmentFiles" : this.formName.fileLists
		    		}
		    	}
		    	business.uploadHomeWork(data,this).catch(err=>{
		        	console.log("view--报错",err);
		        }).finally((res)=>{
		        	console.log("view--成功失败都执行",res);
		        });
				},
				
		    postJson() {
		    	let data = {
		    		title : "报名",
		    		clazzId : "1250",
		    		description : "第一次使用报名",
		    		endTime : "2019-05-30 00:00",
		    	}
		    	business.signUpName(data,this).catch(err=>{
		    		console.log("view--报错",err);
		    	}).finally(res=>{
		    		console.log("view--成功失败都执行",res);
		    	})
				}
		},
		components: {
			openUpload
		}

	}
</script>
<style lang="less" scoped="">
.demo-ruleForm{
	.imagesUpload{
		margin-top: 40px;
		li{
			float: left;
		}
	}
	.avatar{
		width: 150px;
		height: 150px;
	}
	.loadText{
		font-size: 16px;
		color: red;
		height: 30px;
		line-height: 30px;
	}
}
.footer{
	margin-top: 40px;
}
	
</style>