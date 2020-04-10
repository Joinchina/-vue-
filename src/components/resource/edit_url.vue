<style scoped lang="less">
	@import "../../assets/reset-element-ui/form.css";
	#wEditResUrl {

	}
</style>
<template>
	<div id="wEditResUrl">
		<el-dialog class="dialog-form" title="编辑"
			:visible.sync="dialogEditUrl"
			:close-on-click-modal="false"
			:before-close="close"
			@open="getResource">
			
			<el-form :model="ruleForm"  ref="ruleForm">
				<el-form-item label="资源类型："  :label-width="labelWidth" >
					<el-radio label="URL" v-model="type" >网页链接</el-radio>
				</el-form-item>
				
				<el-form-item label="链接地址：" prop="url" 
					:label-width="labelWidth"
					:rules="[
							{ required: true, message: '请填写链接地址', trigger: 'blur'}
						]">
					<el-input v-model="ruleForm.url"></el-input>
				</el-form-item>
				
				<el-form-item label="链接名称：" prop="name" 
					:label-width="labelWidth"
					:rules="[
							{ required: true, message: '请填写链接名称', trigger: 'blur'},
							{ max: 50, message: '50字以内', trigger: 'blur'}
						]">
					<el-input v-model="ruleForm.name"></el-input>
				</el-form-item>
				<el-form-item 
						label="是否添加至资源库：" 
						prop="addToLib" 
						:label-width="labelWidth"
						>
						<el-switch
							v-model="ruleForm.addtolib"
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
		data () {
			return {
				type: "URL",
				ruleForm: {
					name: '',
					url: '',
					addtolib:false,
				},
				labelWidth: '125px',
				details: {}

			}
		},
		props: ['dialogEditUrl', 'resId', 'clazzId'],
		created() {
			if(this.resId) {
				this.getResource();
			}
		},
		methods: {
			close() {
				this.$emit('update:dialogEditUrl', false);
				this.resetForm('ruleForm');
			},
			resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },
		    submitForm(formName) {
		    	this.$refs[formName].validate((valid) => {
		    		if (valid) {
		    			this.editUrl();
		    		} else {
		    			console.log('error submit!!');
		    			return false;
		    		}
		    	});
		    },
		    editUrl() {
		    	let data = {
		    		id: this.resId,
		    		name: this.ruleForm.name,
		    		type: this.type,
					linkUrl: this.ruleForm.url,
					addToLib:this.ruleForm.addtolib,
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
						this.ruleForm.url = res.data.linkUrl;
						this.ruleForm.addtolib=res.data.addToLib;
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));

		    }

		},
		
	}
</script>