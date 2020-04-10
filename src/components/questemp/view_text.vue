<style scoped lang="less">
	@import "../../assets/reset-element-ui/form.css";
	
</style>
<template>
	<div id="wViewResText">
		<el-dialog class="dialog-form" title="查看"
			:visible.sync="dialogViewText"
			:close-on-click-modal="false"
			:before-close="close"
			@open="getResource()">
			
			<el-form :model="ruleForm"  ref="ruleForm">
				<el-form-item label="资源类型："  :label-width="labelWidth">
					<el-radio label="TEXT" v-model="type" >文本</el-radio>
				</el-form-item>
				
				<el-form-item label="资源名称：" prop="name" 
					:label-width="labelWidth"
					
					>
					<el-input :disabled="true" v-model="ruleForm.name"></el-input>
				</el-form-item>

				<el-form-item label="内容：" prop="content" 
					:label-width="labelWidth"
					
					>
					<el-input type="textarea" :disabled="true" class="cont" v-model="ruleForm.content"></el-input>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				
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
		props: ['dialogViewText', 'resId'],
		
		methods: {
			close() {
				this.$emit('update:dialogViewText', false);
				
			},
			
		    getResource() {
		    	let data = {
		    		libResourceId: this.resId
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