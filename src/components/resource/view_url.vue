<style scoped lang="less">
	@import "../../assets/reset-element-ui/form.css";
	
</style>
<template>
	<div id="wViewResUrl">
		<el-dialog class="dialog-form" title="查看"
			:visible.sync="dialogViewUrl"
			:close-on-click-modal="false"
			:before-close="close"

			@open="getResource()"
			>
			
			<el-form :model="ruleForm"  ref="ruleForm">
				<el-form-item label="资源类型："  :label-width="labelWidth">
					<el-radio label="URL" v-model="type" >网页链接</el-radio>
				</el-form-item>
				
				<el-form-item label="链接地址：" prop="url" 
					:label-width="labelWidth"
					>
					<el-input :disabled="true" v-model="ruleForm.url"></el-input>
				</el-form-item>
				
				<el-form-item label="链接名称：" prop="name" 
					:label-width="labelWidth"
					>
					<el-input :disabled="true" v-model="ruleForm.name"></el-input>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				
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
					url: ''
				},
				labelWidth: '125px',
				details: {}

			}
		},
		props: ['dialogViewUrl', 'resId'],
		
		methods: {
			open() {
				this.getResource();
			},
			close() {
				this.$emit('update:dialogViewUrl', false);
				
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
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));

		    }

		},
		
	}
</script>