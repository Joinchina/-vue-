<style scoped lang="less">
	@import "../../../assets/reset-element-ui/form.css";
	@import "../../../assets/less/icon.less";
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
		.sel2,
		.sel1 {
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
		.sel1 {
			opacity: 0;
			margin: 17px 0 0 12px;
		}
		.sel2 {
			margin-left: 10px;
			margin-top: 16px;
			>i{
				font-size: 12px;
			}
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
<template>
	<div id="waddNotice">
		<el-dialog class="dialog-form" title="发布通知"
		:visible.sync="dialogAddNotice"
		:close-on-click-modal="false"
		:before-close="close"
		@open="open">

		<el-form :model="ruleForm" :rules="rules" 
				ref="ruleForm"
				v-loading="loading"
				element-loading-text="拼命加载中">
			<el-form-item label="通知标题：" prop="title" :label-width="labelWidth">
				<el-input v-model.trim="ruleForm.title" placeholder="30字以内"></el-input>
			</el-form-item>
			<el-form-item label="通知内容：" prop="content" :label-width="labelWidth">
				<el-input type="textarea" v-model.trim="ruleForm.content" placeholder="5000字以内"></el-input>
			</el-form-item>

			<el-form-item :label-width="labelWidth"  prop="photo" class="avatar-uploader">
				<label for="file" class="sel2"><span class="icon-dis-add"></span>添加图片</label>
				<input class="sel1 select-file" multiple="true" id="fileName" type="file" name="ruleForm.photo" accept="image/png,image/gif,image/jpeg"  @change="selAvatar($event)">

				<div style="margin-top:60px;margin-left:10px;">
					<ul v-if = "imageUrl.length != ''">
						<li v-for="(item,index) in imageUrl" :key="index">
							<img :src="item" class="avatar" style="width:150px;height: 150px;">
							<span class="icon-dis-error error" @click="deletePic(index,$event)"></span>
						</li>
					</ul>

				</div>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="submitForm('ruleForm')">发布</el-button>
			<el-button @click="close">关闭</el-button>
		</div>
	</el-dialog>
</div>
</template>
<script>
	import notice from 'model/clazz/notice'


	export default {
		data () {
			return {
				num:0,	// 图片数量
				imageUrl: [],	// 本地图像集合
				
				ruleForm: {
					title: '',
					content: '',
					photo: []
				},
				labelWidth: "120px",
				rules: {
					title: [
					{ required: true, message: '请输入通知标题', trigger: 'blur'},
					{ max: 30, message: '通知标题30字以内', trigger: 'blur'}
					],
					content: [
					{ required: true, message: '请输入通知内容', trigger: 'blur'},
					{ min: 1, max: 5000, message: '通知内容5000字以内', trigger: 'blur'}
					]
				},
				loading: false
			}
		},
		props:["dialogAddNotice"],
		computed: {
			clazzId () {
				return this.$route.query.clazzId;
			}
		},
		created(){

		},
		methods: {
			open() {
				this.loading = false;
			},
			close() {
				this.$emit('update:dialogAddNotice', false);
				this.imageUrl = [];
				document.getElementById("fileName").value = "";
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
					_this.imageUrl.push(imageUrl);

				}

				this.num++;
		        // console.log("imageurl ", document.getElementById("fileName").value);
		    },
		    submitForm(formName) {
		    	this.$refs[formName].validate((valid) => {
		    		if (valid) {
		    			this.addNotice();
		    		} else {
		    			console.log('error submit!!');
		    			return false;
		    		}
		    	});
		    },
		    addNotice () {
		    	let data = {
		    		clazzId: this.clazzId,
		    		title: this.ruleForm.title,
		    		content: this.ruleForm.content,
		    	}
		    	this.loading = true;
		    	notice.noticeAdd(data, (res => {
		    		// console.log("发布通知",res);
		    		if(res.status == 200) {
		    			this.close();
		    			this.$emit("updateNotice");

		    			// 初始化数据
		    			this.ruleForm.title = "";
		    			this.ruleForm.content = "";
		    			this.ruleForm.photo = [];
		    			this.imageUrl = [];
		    			this.num = 0;
		    			document.getElementById("fileName").value = "";

		    			this.loading = false;
		    		} else {
		    			this.$message.error(res.message);
		    			this.loading = false;
		    		}
		    	}), this.ruleForm.photo);
		    },
		    deletePic(index,event){
		    	this.num--;
		    	if(this.num == 0){
		    		this.num = 0;
		    	}
		    	this.imageUrl.splice(index,1);
		    	this.ruleForm.photo.splice(index,1);
		    	document.getElementById("fileName").value = "";



		    },
		}
	}
</script>