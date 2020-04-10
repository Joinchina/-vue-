<style scoped lang="less">
	@import "../../assets/reset-element-ui/form.css";
	#wEditResText {

	}
</style>
<template>
	<div id="wEditResText">
		<el-dialog class="dialog-form" title="编辑"
			:visible.sync="dialogEditText"
			:close-on-click-modal="false"
			:before-close="close"
			@open="getResource">
			
			<el-form :model="ruleForm"  ref="ruleForm">
				<el-form-item label="资源类型："  :label-width="labelWidth" >
					<el-radio label="TEXT" v-model="type" >文本</el-radio>
				</el-form-item>
				
				<el-form-item label="资源名称：" prop="name" 
					:label-width="labelWidth"
					:rules="[
							{ required: true, message: '请填写链接名称', trigger: 'blur'},
							{ max: 50, message: '50字以内', trigger: 'blur'}
						]">
					<el-input v-model="ruleForm.name"></el-input>
				</el-form-item>

				<el-form-item label="内容：" prop="content" 
					:label-width="labelWidth"
					:rules="[
							{ required: true, message: '请填写链接名称', trigger: 'blur'},
							{ max: 20000, message: '内容最多20000字', trigger: 'blur'}
						]">
					<el-input type="textarea" class="cont" v-model="ruleForm.content"></el-input>
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
	import model from 'model/library/library'

	export default {
		data () {
			return {
				type: "TEXT",
				ruleForm: {
					name: '',
					content: ''
				},
				labelWidth: '125px',
				details: {}

			}
		},
		props: ['dialogEditText', 'passresIdent', 'clazzId','orgId'],
		created() {
			if(this.passresIdent) {
				this.getResource();
			}
		},
		methods: {
			close() {
				this.$emit('update:dialogEditText', false);
				this.resetForm('ruleForm');
			},
			resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },
		    submitForm(formName) {
		    	this.$refs[formName].validate((valid) => {
		    		if (valid) {
		    			this.editText();
		    		} else {
		    			console.log('error submit!!');
		    			return false;
		    		}
		    	});
		    },
		    editText() {
		    	let data = {
		    		id: this.passresIdent,
		    		name: this.ruleForm.name,
		    		type: this.type,
		    		content: this.ruleForm.content
		    	}
		    	model.libraryupdate(data, (res => {
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
		    		libResourceId: this.passresIdent
		    	}
		    	model.librarydetail(data, (res => {
		    		// console.log("资源详情",res);
		    		if(res.status == 200) {
		    			this.details = res.data;
		    			this.ruleForm.name = res.data.name;
		    			this.ruleForm.content = res.data.content;
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));

		    }

		},
		
	}
</script>