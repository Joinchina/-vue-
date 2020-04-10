<template>
	<div class="w-addversion">
		<el-dialog class="dialog-form"
			title="添加客户端版本"
			:visible.sync="dialogVersion"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open">
			<el-form 
				class="inline-form"
				:model="ruleVersion"
				:rules="rules" 
				ref="ruleVersion"
				v-loading="loading"
				:element-loading-text="loadingText"
				:element-loading-spinner="$globalParam.loadSpinner"
			    :element-loading-background="$globalParam.loadText"
				>
				<el-row>
					<el-col :span="7">
						<el-form-item class="" label="设备" label-width="90px" prop="device">
							<el-select v-model="ruleVersion.device" placeholder="选择设备" @change="deviceSwitch(ruleVersion.device)">
								<el-option value="IOS" label="iOS"></el-option>
								<el-option value="ANDROID" label="android"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="APP" label-width="70px" :inline="true" prop="platform">
							<el-select v-model="ruleVersion.platform" placeholder="选择端" @change="platformSwitch">
								<el-option label="管理端" value="ttManager" ></el-option>
								<el-option label="学员端" value="ttStudent" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="更新类型" label-width="100px" prop="type">
							<el-select v-model="ruleVersion.type" placeholder="选择更新类型" @change="typeSwitch">
								<el-option label="非强制更新" value="free" ></el-option>
								<el-option label="强制更新" value="force" ></el-option>
								
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				
				<el-row>
					<el-col :span="12">
						<el-form-item label="版本号" :label-width="labelWidth" prop="iVersion">
							<el-input v-model.trim="ruleVersion.iVersion" placeholder="用于客户端判断版本的序号"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="版本代码" label-width="100px" prop="version">
							<input class="version-input" type="tel"  maxlength="2" size="2" v-model.trim="aVersion[0]"  onkeyup="value=value.replace(/[^\d]/g, '')">
							.
							<input class="version-input" type="tel"  maxlength="2" size="2" v-model.trim="aVersion[1]" onkeyup="value=value.replace(/[^\d]/g, '')">
							.
							<input class="version-input" type="tel" maxlength="2" size="2" v-model.trim="aVersion[2]" onkeyup="value=value.replace(/[^\d]/g, '')">
								
						</el-form-item>
					</el-col>
				</el-row>
				
				<el-form-item label="更新描述" :label-width="labelWidth" prop="description">
					<el-input type="textarea" v-model.trim="ruleVersion.description" placeholder="更新描述"></el-input>
				</el-form-item>

				<el-form-item v-if="ruleVersion.device == 'IOS'" label="下载地址" :label-width="labelWidth" prop="downloadUrl">
					<el-input v-model.trim="ruleVersion.downloadUrl" placeholder="安装包下载地址"></el-input>
				</el-form-item>

				<el-form-item v-if="ruleVersion.device == 'ANDROID'" label="安装文件" :label-width="labelWidth" prop="pkg">
					<div class="update-pkg">
						<input type="file" @change="getFile($event)" id="fileupload" class="sel1">
						<label for="fileupload" class="sel2">
							<i class="icon-dis-add"></i>
							选择APK
						</label>
						<span class="tip">APK安装包</span>
						<p class="filebox clearfix" v-if="pkgName">
							<span class="filename">{{pkgName}}</span>
						</p>
					</div>
						
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
		        <el-button type="primary" @click="!loading && submitForm('ruleVersion')">确定</el-button>
		        <el-button @click="close">取消</el-button>
		    </div>
		</el-dialog>
	</div>
</template>
<script>
	import Version from "model/comtpoc/version" 
	export default {
		data () {
			var valVersion = (rule, value, callback) => {
				if(!this.aVersion[0] || !this.aVersion[1] || !this.aVersion[2]) {
					callback(new Error('请输入版本代码'));
					
				} else if(!Number.isInteger(Number(this.aVersion[0])) || !Number.isInteger(Number(this.aVersion[1])) || !Number.isInteger(Number(this.aVersion[2]))) {
					callback(new Error('请输入数字'))

				} else {
					value = this.aVersion[0]+"."+this.aVersion[1]+"."+this.aVersion[2];
					this.ruleVersion.version = value;
					callback();
				}
			}
			var checkNum = (rule, value, callback) => {
				if(!value) {
					 return new Error('请输入版本号')
					} else {
						if(!Number.isInteger(Number(value))) {
	                        callback(new Error('请输入数字值'))
	                    }else{
	                        callback()
	                    }
					}
			}
			return {
				aVersion: [],		// 版本代码数组
				pkgName: "",		//  安装包名称
				ruleVersion: {
					device: "IOS",
					platform: "ttManager",
					type: "free",		// 更新类型
					iVersion: "",	// 版本号
					version: "",	// 版本代码
					description: "",	// 更新描述
					downloadUrl: "",  // 下载地址 ios
					pkg: "",			// 选择安装包 Android
				},
				rules: {
					device: [
						{ required: true, message: '请选择设备', trigger: 'change' }
					],
					platform: [
						{ required: true, message: '请选择平台', trigger: 'change' }
					],
					type: [
						{ required: true, message: '请选择更新类型', trigger: 'change' }
					],
					iVersion: [
						{ required: true, message: '请输入版本号'},
						{ validator: checkNum, trigger: 'blur'}
					],
					version: [
						{ required: true, validator: valVersion}
					],
					description: [
						{ required: true, message: '请输入更新描述', trigger: 'blur'},
						{ max: 150, message: '内容不能超过150字', trigger: 'blur'}
					],
					downloadUrl: [
						{ required: true, message: '请输入下载地址', trigger: 'blur'}
					],
					pkg: [
						{ required: true, message: '请上传安装包', trigger: 'blur'}
					]
				},

				labelWidth: "90px",
				loading: false,
				loadingText: "加载中",
			}
		},
		props: ["dialogVersion"],
		mounted() {

		},
		methods: {
			open() {
				this.loading = false;
				this.aVersion=[];
				this.ruleVersion.pkg = "";
				this.pkgName = "";
			},
			close() {
				this.$emit('update:dialogVersion', false);
				this.resetForm('ruleVersion');
			},
			deviceSwitch(val) {
				this.ruleVersion.device = val;
				console.log("val=device==",this.ruleVersion.device);
			},
			platformSwitch(val) {
				this.ruleVersion.platform = val;
			},
			typeSwitch(val) {
				this.ruleVersion.type = val;
			},
			getFile(e) {
				let event = e||Windwo.event;
				let name = event.target.value;
				this.ruleVersion.pkg = event.target.files[0];
				this.pkgName = name.split("\\").pop();
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(!!valid) {
						console.log("valid", valid);
						this.addVersion();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },
			addVersion() {
				console.log("device", "this.ruleVersion.device");
				let data = {};
				if(this.ruleVersion.device == "IOS") {
					data = {
						device: this.ruleVersion.device,
						platform: this.ruleVersion.platform,
						type: this.ruleVersion.type,
						iVersion: this.ruleVersion.iVersion,
						version: this.ruleVersion.version,
						description: this.ruleVersion.description,
						downloadUrl: this.ruleVersion.downloadUrl
					}
				}
				if(this.ruleVersion.device == "ANDROID") {
					data = {
						device: this.ruleVersion.device,
						platform: this.ruleVersion.platform,
						type: this.ruleVersion.type,
						iVersion: this.ruleVersion.iVersion,
						version: this.ruleVersion.version,
						description: this.ruleVersion.description,
						apkFile: this.ruleVersion.pkg
					}
				}
				console.log("data ", data);
				this.loading = true;
				Version.addVersion(data, (res => {
					console.log("创建内容返回 ", res);
					if(res.status == 200) {
						this.close();
						this.$emit('updateList');
						this.loading = false;
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
				}),(res => {
					console.log("progress", res);
					// 加进度条
		    		let progress = Math.round(parseFloat(res.loaded/res.total)*100);
		    		this.loadingText = "文件上传中" + progress + '%';
				}));
			}
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/reset-element-ui/form.css";
	.dialog-form {
		padding: 0;
	}
	.version-input {
		display: inline-block;
		height: 40px;
		line-height: 40px;
		padding: 0 15px;
		font-size: 14px;
		border-radius: 4px;
		border: 1px solid #dcdfe6;
	    -webkit-box-sizing: border-box;
	    box-sizing: border-box;
	    color: #606266;
	    
	}
	.sel2,
	.sel1 {
	  	position: absolute;
	  	margin-top: 3px;
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
	}
	.sel2 {
	  	margin-left: 0;

	  	>i{
	  		font-size: 12px;
	  	}
  	}
  	.update-pkg {
  		
  		.tip {
  			position: absolute;
  			left: 130px;
  		}
  	}
  	.filebox {
  		padding-top: 45px;
  	}
  	.filename{
		// position: absolute;
		// top: 45px;
		font-size: 14px;
		line-height: 1em;
		color: #333;
		padding: 7px 10px;
		background-color: #ededed;
		
	}

	.inline-form {
		
	}
</style>