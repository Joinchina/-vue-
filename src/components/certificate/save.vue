<template>
	<div class="">
	<!-- 保存证书 -->
	<div class="handle2">
		<button type="button" class="btn-green-line" @click="showCertView">
			<i class="icon-cert-view"></i>
			预览
		</button>
		<button class="btn-green" type="button" @click="submitForm('form')">
			<i class="icon-cert-save"></i>
			保存
		</button>
	</div>
	
	<section class="round-layout clearfix" >
		<h2 class="cert-title">设置证书样式</h2>
		<el-form class="form-box" 
			ref="form" 
			:model="form"
			:rules="rules"  
			label-width="120px">
			<el-form-item label="证书背景：" prop="bgUrl">
				<i class="num-order">1. </i>
				<label for="fileBg" class="sel2">点击上传</label>
				<input class="sel1" multiple="true" id="fileBg" type="file"  name="form.bg" accept="image/png,image/jpeg"  @change="selBg($event)">
				<a :href="downloadUrl" class="download">下载背景模版</a>
				<span class="tip">（图片要求JPG和PNG格式，尺寸：1079*791，大小：10M以内）</span>
				<div class="cert-img-box" v-if="form.bgUrl">
					<img :src="form.bgUrl" alt="">
				</div>
			</el-form-item>
			<el-form-item label="证书右章：" prop="rightSignetUrl">
				<i class="num-order">2. </i>
				<label for="rightSignet" class="sel2">点击上传</label>
				<input class="sel1 select-file" multiple="true" id="rightSignet" type="file" name="form.rightSignet" accept="image/png"  @change="selRightImg($event)">
				<span class="tip">（图片要求PNG格式，尺寸：155*155，章的背景是透明的）</span>
				<div class="cert-img-box" v-if="form.rightSignetUrl">
					<img class="circle" :src="form.rightSignetUrl" alt="">
				</div>
			</el-form-item>
			<el-form-item label="右章署名：" prop="rightName">
				<el-input v-model.trim="form.rightName" placeholder="请输入右章署名（请保持章名和署名一致）"></el-input>
			</el-form-item>

			<el-form-item label="证书左章：" prop="leftSignetUrl">
				<i class="num-order">3. </i>
				<label for="leftSignet" class="sel2">点击上传</label>
				<input class="sel1 select-file" multiple="true" id="leftSignet" type="file" name="form.leftSignet" accept="image/png"  @change="selLeftImg($event)">
				<span class="tip">（图片要求PNG格式，尺寸：155*155，章的背景是透明的）</span>
				<div class="cert-img-box" v-if="form.leftSignetUrl">
					<img class="circle" :src="form.leftSignetUrl" alt="">
				</div>
			</el-form-item>

			<el-form-item label="左章署名：" prop="leftName">
				<el-input v-model.trim="form.leftName" placeholder="请输入左章署名（请保持章名和署名一致）"></el-input>
			</el-form-item>
		</el-form>

		<div class="cert-sample">
			<h3 class="sub-title">证书样例</h3>
			<img src="../../assets/img/certificate/certificate-eg.png" alt="">
		</div>
	</section>
	
	<!-- 预览 -->
	<modal :show.sync = "certView" contWidth = '860px' bgColor="transparent">
		<div slot="body" class="w-transparent cert-view" style="height:100%">
			<div class="cert-pop-box ">
				<img class="bg" :src="form.bgUrl" alt="">
				<div class="cert-bottom clearfix">
					<div class="leftbox">
						<p class="left-name">{{form.leftName}}</p>
						<img class="left-signet" :src="form.leftSignetUrl" alt="">
					</div>

					<div class="rightbox">
						<p class="right-name">{{form.rightName}}</p>
						<img class="right-signet" :src="form.rightSignetUrl" alt="">
					</div>
				</div>
			</div>	
		</div>
	</modal>
		
	</div>
</template>
<script>
import certificate from 'model/certificate/certificate'
import Modal from 'base/modal/modal'
import API from '@/global/resource'
export default {
	data () {
		return {
			downloadUrl: API.urls.orgCertDownload,
			certView: false,
			bgUrl: "",
			rightSignetUrl: "",
			leftSignetUrl: "",
			form: {
				bg: {},
				rightSignet: {},
				rightName: '',
				leftSignet: {},
				leftName: '',

				bgUrl: "",
				rightSignetUrl: "",
				leftSignetUrl: "",
			},
			rules: {
				bgUrl: [
					{required: true, message: '请上传证书背景', trigger: 'change'}
				],
				rightSignetUrl: [
					{required: true, message: '请上传右章', trigger: 'change'}
				],
				rightName: [
					{required: true, message: '请输入右章署名', trigger: 'blur'},
					{ max: 16, message: '16字以内', trigger: 'blur'}
				],
				leftName: [
					{ max: 16, message: '16字以内', trigger: 'blur'}
				]
			}
		}
	},
	props: ["orgId"],
	// computed: {
	// 	orgId() {
	// 		return this.$route.query.orgId;
	// 	}
	// },
	created () {

	},
	mounted () {

	},
	methods: {
		selBg (event) {
			let _this = this;
			let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
			if(extend == "jpg" || extend == "png" || extend == "jpeg") {
				let objUrl = event.target.files[0];
				// console.log("背景", objUrl);
				_this.form.bg = objUrl;
				let windowURL = window.URL || window.webkitURL;
			    let imageUrl = windowURL.createObjectURL(objUrl);
			    _this.form.bgUrl = imageUrl;
			}
		},
		selRightImg(event) {
			let _this = this;
			let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
			if( extend == "png" ) {
				let objUrl = event.target.files[0];
				_this.form.rightSignet = objUrl;

				// console.log("右章：", objUrl);
				let windowURL = window.URL || window.webkitURL;
			    let imageUrl = windowURL.createObjectURL(objUrl);
			    _this.form.rightSignetUrl = imageUrl;
			}
		},
		selLeftImg(event) {
			let _this = this;
			let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
			if( extend == "png" ) {
				let objUrl = event.target.files[0];
				_this.form.leftSignet = objUrl;

				// console.log("左章：", objUrl);
				let windowURL = window.URL || window.webkitURL;
			    let imageUrl = windowURL.createObjectURL(objUrl);
			    _this.form.leftSignetUrl = imageUrl;
			}
		},
		showCertView() {
			if(this.form.bg && this.form.rightSignet && this.form.rightName) {
				this.certView = true;
			} else {
				this.$message.error("请先上传证书背景和证书右章、右章署名");
			}
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let sizebg = this.form.bg.size;
					let sizer = this.form.rightSignet.size;
					let sizel = this.form.leftSignet.size;

					if(sizebg > 10485760) {
						this.$message.error("您上传证书背景不能超过10M！");
						return false;
					} 
					if (sizer > 10485760){
						this.$message.error("您上传证书右章不能超过10M！");
						return false;
					} 
					if (sizel > 10485760){
						this.$message.error("您上传证书左章不能超过10M！");
						return false;
					} 

					this.certificateSave();
					
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		certificateSave() {
			let data = {
				organizationId: this.orgId,
				backgroundFile: this.form.bg,
				rightStampFile: this.form.rightSignet,
				rightStampName: this.form.rightName,
				leftStampFile: this.form.leftSignet,
				leftStampName: this.form.leftName
			}
			certificate.orgCertSave(data, (res => {
				console.log("保存证书", res);
				if(res.status == 200) {
					let data = res.data;
					this.$message.success("保存成功！");
					this.$emit('saveSucc', data);

				} else {
					this.$message.error(res.message);
				}
			}))
		}

	},

	components: {
		Modal
	}
}
</script>
<style scoped lang="less">
	@import "../../assets/less/icon.less";
	@import "../../assets/less/btn-search.less";
	@import "../../assets/reset-element-ui/form.css";

	.handle2 {
		text-align: right;
		margin-top: -40px;
		button {
			display: inline-block;
			margin-left: 12px;
			font-size: 16px;
			padding: 0;
		    height: 38px;
		    width: 105px;
		    margin-bottom: 13px;
		}
		.btn-green-line {
			background-color: #ecf6f5;
		}
		.btn-green {
			border-radius: 3px;
			&::after{
				width: 0;
				height: 0;
			}
		}
	}
	.form-box {
		width: 786px;
		padding-right: 65px;
		float: left;
		a {
			text-decoration: underline;
		}
		.num-order {
			font-size: 16px;
			position: absolute;
			margin-left: -120px;
		}
		.el-input {
			width: 360px;
		}
		.sel1, .sel2 {
			position: relative;
		}
		.sel1 {
			display: none;
		}
		.sel2 {
		    font-size: 16px;
		    border-radius: 5px;
		    background-color: #ecf6f5;
		    border: 1px solid #319c95;
		    color: #319c95;
		    margin-left: 0;
		}
		.tip {
			font-size: 14px;
			color: #999;
		}
		.download {
			color:#1077d7;
		}
		.cert-img-box {
			margin-top: 14px;
			>img {
				width: 140px;
				height: auto;
			}
		}
		.circle {
			width: 115px;
			height: auto;
		}
	}
	.cert-sample {
		float: left;
		.sub-title {
			font-size: 18px;
			color: #333;
			text-align: center;
			margin-bottom: 20px;
		}
	}
	.round-layout {
		padding: 20px;
	}
	.cert-title {
		font-size:20px;
		color:#333333;
		letter-spacing:0;
		line-height: 1em;
		border-left: 5px solid #35a69d; 
		padding-left: 10px;
		margin-bottom: 20px;
	}
	.cert-pop-box {
		position: relative;
		width: 818px;
		height: 600px;
		.cert-bottom {
			width: 100%;
			position: absolute;
			z-index: 2;
			height: 113px;
			line-height: 113px;
			font-size: 20px;
			bottom: 36px;
    		text-align: center;
		}
		.bg {
			position: absolute;
			z-index: 1;
			width: 818px;
			height: 600px;
		}
		.leftbox,
		.rightbox {
			width: 50%;
			float: left;
			text-align: center;

		}
		.rightbox {
			float: right;
		}
		.right-signet,
		.left-signet {
			position: absolute;
			width: 113px;
			height: 113px;
			margin-top: -113px;
		    margin-left: -60px;
		    z-index: 3;
		}
	}
</style>