<template>
	<div>
		<el-dialog class="dialog-form" title="编辑通用文件夹" 
			:visible.sync="dialogFolderCreate" 
			:close-on-click-modal="false"
			:before-close="close"
			@open="open">

			<el-form :model="ruleEditFolder" :rules="rules" ref="ruleEditFolder">
				<el-form-item label="展示范围：" :label-width="labelWidth" prop="range">
					<el-select v-model="ruleEditFolder.range" placeholder="学员端">
						
				        <el-option v-for="(item,index) in options" :label="item.label" :key="index" :value="item.value"></el-option>
    				</el-select>
				</el-form-item>
				<el-form-item label="文件夹名称：" :label-width="labelWidth" prop="name">
					<el-input v-model.trim="ruleEditFolder.name" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('ruleEditFolder')">确定</el-button>
				<el-button @click="close">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import resource from 'model/resource/resource'
	export default{
		props:["dialogFolderCreate","editFolderId"],

		data(){
			return{

				options: [{
                    value: 'ttStudent',
                    label: '学员端'
                }, {
                    value: 'ttManager',
                    label: '管理端'
                }, {
                    value: 'all',
                    label: '全部'
                }],
                value: 'ttStudent',


				ruleEditFolder: {
					range:"",
					name: ""
				},
				rules: {
					name: [
						{ required: true, message: '请填写文件夹名称', trigger: 'blur'}
					],
				},
				labelWidth: "120px",

				resId:"",
				resType:""
			}
		},
		methods:{
			editFolder(id){
				this.resId = id;

		    		
		    	this.getResource(id);

			},

			getResource(resId) {
		    	let data = {
		    		id: resId
		    	}
		    	resource.resDetails(data, (res => {
		    		// console.log("资源详情",res);
		    		if(res.status == 200) {

		    			this.ruleEditFolder.name = res.data.name;

		    			this.ruleEditFolder.range = res.data.display;


		    			
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));

		    },

			open(){

				this.editFolder(this.editFolderId);
					
			},

			close(){
				this.$emit('update:dialogFolderCreate', false);
			},

			submitForm(formName){
				this.$refs[formName].validate((valid) => {
					if(valid) {

						let data = {
							id: this.resId,
				    		name: this.ruleEditFolder.name,
				    		type: 'FOLDER',
				    		display:this.ruleEditFolder.range
				    	}

				    	resource.resUpdate(data,(res => {
				    		// console.log("文件夹创建成功",res);
				    		if(res.status == 200) {

				    			this.$message.success('编辑成功');

				    			this.$emit("foldCreate");

				    			//清空文本框
								this.ruleEditFolder.range = "";
								this.ruleEditFolder.name = "";
								this.close();
				    			
				    		} else {
				    			this.$message.error(res.message);
				    		}
				    	}));
						

						

					}

					
				})
			}

		}
	}
</script>