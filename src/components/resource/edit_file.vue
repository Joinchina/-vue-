<style scoped lang="less">
	@import "../../assets/reset-element-ui/form.css";
	#wresEditFile {
		.link {
			color: #999;
			font-size: 14px;
			padding-left: 126px;
    			margin-top: -26px;
		    margin-bottom: 40px;
			a {
				color: #3182d9;
				text-decoration: underline;
				word-break: break-all;
			}
		}
	}
</style>
<template>
	<div id="wresEditFile">
		<el-dialog class="dialog-form" title="编辑"
			:visible.sync="dialogEditFile"
			:close-on-click-modal="false"
			:before-close="close"
			@open="getResource">
			
			<el-form :model="ruleForm"  ref="ruleForm">
				<el-form-item label="资源类型："  :label-width="labelWidth" >
					<el-radio :label="resType" v-model="resType" >{{resName[resType]}}</el-radio>
				</el-form-item>
				<p class="link">
					资源链接：
					<a target="_blank" :href="details.linkUrl">{{details.linkUrl}}</a>
				</p>

				<el-form-item label="资源名称：" prop="name" 
					:label-width="labelWidth"
					:rules="[
							{ required: true, message: '请填写资源名称', trigger: 'blur'},
							{ max: 50, message: '50字以内', trigger: 'blur'}
						]">
					<el-input v-model="ruleForm.name"></el-input>
				</el-form-item>

				<el-form-item 
						label="是否允许下载：" 
						prop="download" 
						:label-width="labelWidth"
						>
						<el-switch
							v-model="ruleForm.download"
							:disabled="resType == 'ZIP'"
							active-text=""
							inactive-text="">
						</el-switch>

					</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
				<el-button @click="close">关闭</el-button>
			</div>

		</el-dialog>
	</div>
</template>
<script>
	import resource from 'model/resource/resource'
	export default {
		data() {
			return {
				resName: {
					'VIDEO' : '视频',
					'WORD' : 'word',
					'PPT' : 'ppt',
					'PDF' : 'pdf',
					'ZIP' : '压缩包'
				},
				ruleForm: {
					name:"",
					download: false
				},
				labelWidth: '125px',
				details: {}
			}
		},
		props: ['dialogEditFile', 'resId', 'clazzId','resType'],
		created() {
			if(this.resId) {
				this.getResource();
			}
		},
		methods: {
			close() {
				this.$emit('update:dialogEditFile', false);
				this.resetForm('ruleForm');
			},
			resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },
		    submitForm(formName) {
		    	this.$refs[formName].validate((valid) => {
		    		if (valid) {
		    			this.resourceEdit();
		    		} else {
		    			console.log('error submit!!');
		    			return false;
		    		}
		    	});
		    },
		    resourceEdit() {
		    	let data = {
		    		id: this.resId,
		    		name : this.ruleForm.name,
		    		type: this.resType,
		    		downloadFlag: this.ruleForm.download
		    	}

		    	resource.resUpdate(data, (res => {
		    		// console.log("编辑资源",res);
		    		if(res.status == 200) {
		    			this.close();
		    			this.$emit("updateRes");
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));	
		    },
		    getResource() {
		    	let data = {
		    		id: this.resId
		    	}
		    	resource.resDetails(data, (res => {
		    		// console.log("资源详情",res);
		    		if(res.status == 200) {
		    			this.details = res.data;
		    			this.ruleForm.name = res.data.name;
		    			this.ruleForm.download = res.data.downloadFlag;
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));

		    }
		},
		
	}
</script>