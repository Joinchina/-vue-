<template>
	<div>
		<el-dialog class="dialog-form" title="新建通用文件夹" 
			:visible.sync="dialogFolderCreate" 
			:close-on-click-modal="false"
			:before-close="close"
			@open="open">

			<el-form :model="ruleEditFolder" :rules="rules" ref="ruleEditFolder">
				<el-form-item label="展示范围：" :label-width="labelWidth" prop="range">
					<el-select v-model="ruleEditFolder.range" placeholder="学员端">
				       <!--  <el-option label="管理端" value="ttManager"></el-option>
				        <el-option label="全部" value="all"></el-option> -->
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
		props:["dialogFolderCreate"],
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
			// editFolder(id){
			// 	this.resId = id;

			// 	console.log("id");
			// 	console.log(this.resId);
		 //    	//this.resType = row.type;
		    		
		 //    	this.getResource(id);
		 //    	//this.getResource(row.id);
		 //    	// console.log("index",this.items[index]);
		 //    	//
			// },

			// getResource(resId) {
		 //    	let data = {
		 //    		id: resId
		 //    	}
		 //    	resource.resDetails(data, (res => {
		 //    		// console.log("资源详情",res);
		 //    		if(res.status == 200) {
		 //    			// this.details = res.data;
		 //    			// if(this.resType === 'FOLDER') {
		 //    			// 	this.name = res.data.name;
		 //    			// }

		 //    			this.ruleEditFolder.name = res.data.name;

		 //    			this.ruleEditFolder.range = res.data.display;

		 //    			//this.options.


		    			
		 //    		} else {
		 //    			this.$message.error(res.message);
		 //    		}
		 //    	}));

		 //    },

			open(){

					
			},

			close(){
				this.$emit('update:dialogFolderCreate', false);
			},

			submitForm(formName){
				this.$refs[formName].validate((valid) => {
					if(valid) {
								
				    	let data = {
				    		name: this.ruleEditFolder.name,
				    		type: 'FOLDER',
				    		display:this.ruleEditFolder.range
				    	}

				    	resource.resSave(data,(res => {
				    		// console.log("文件夹创建成功",res);
				    		if(res.status == 200) {

				    			
				    			//this.getCommonRes();

				    			this.$message.success('创建成功！');

				    			this.$emit("foldCreate");
				    			
				    		} else {
				    			this.$message.error(res.message);
				    		}
				    	}));
						
						//this.$emit("foldCreate",data)


						//清空文本框
						this.ruleEditFolder.value = "";
						this.ruleEditFolder.name = "";
						this.close();

					}
					
				})
			}

		}
	}
</script>