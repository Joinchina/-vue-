<template>
	<div id="wIssueRes">
		<el-dialog class="dialog-form" title="发布资源"
			:visible.sync="dialogIssue"
			:close-on-click-modal="false"
			:before-close="close"
			:lock-scroll="true"
			@open="open">
			
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm"
				v-loading="loading"
				element-loading-text="拼命加载中">

				<el-form-item label="所属课程：" prop="course" :label-width="labelWidth">
					<p>{{courseName}}</p>
				</el-form-item>
				<el-form-item label="选择资源：" prop=""  :label-width="labelWidth">
					<a href="javascript:void(0)" class="icon-dis-choose" @click="openTransfer">请从资源中选择</a>
					<div class="selectRes" v-if="selectData.length != 0">
						<ul class="clearfix" >
							<li v-for="(item,index) in selectData" :key="index">
								<i :class="item.type | resType"></i>
								{{item.name}}
							</li>
						</ul>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
		        <el-button type="primary" @click="!loading && submitForm('ruleForm')">发布</el-button>
		        <el-button @click="close">关闭 </el-button>
		    </div>
		</el-dialog>

		<!-- 选择资源 -->
		<res-sel
			:dialogRes.sync = "selResource"
			@resSelectData="selectDataMthod"
			:sel = "selectData"
			:empty = "empty">
		</res-sel>
	</div>
</template>
<script>
	import resSel from 'components/activity/resource/resource_sel'
	import course from 'model/course/course'
	import bus from '@/global/bus'

	export default {
		data() {
			return {
				ruleForm: {
					resourceId: []
				},
				labelWidth: "120px",
				rules: {
					// resourceId: [
					// 	{ required: true, message: '请选择资源',trigger: 'click'}
					// ]
				},
				selectData: [],
				selResource: false,     //选择资源弹出框
				empty: false,			// 关闭创建，穿梭框清空
				loading: false
			}
		},
		props: ["dialogIssue","courseName","courseId"],
		mounted() {

		},
		filters: {  
		    resType (value) {  
		      	switch(value) {
		      		case 'PDF':
		      			return 'icon-pdf2';
		      		case 'WORD':
		      			return 'icon-word2';
		      		case 'URL':
		      			return 'icon-link';
		      		case 'PPT':
		      			return 'icon-ppt';
		      		case 'TEXT':
		      			return 'icon-text';
		      		case 'VIDEO':
		      			return 'icon-video';
		      	}  
		    }  
		},  
		methods: {
			open() {
				this.loading = false;
				this.selectData = [];
				
			},
			close() {
				this.$emit('update:dialogIssue', false);
				this.empty = true;
				this.ruleForm.resourceId = [];
			},
			openTransfer() {
				this.selResource = true;
				if(this.selectData.length == 0) {
					this.empty = true;
				} else {
					this.empty = false;
				}
			},
			selectDataMthod(data){
		        this.selectData = data;
		        
		        console.log("参与人列表",this.selectData);
		    },
			submitForm(formName) {
				this.selectData.forEach((item,index) => {
		          	this.ruleForm.resourceId.push(item["id"]);
		        });
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.issueRes();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			issueRes() {
				let data = {
					courseId: this.courseId,
					ids: this.ruleForm.resourceId
				}
				course.resRelateCourse(data, (res => {
					console.log("res 资源 ",res)
					if(res.status == 200) {
						this.close();
						this.loading = false;
						bus.$emit("updateList");
					} else {
						this.$message.error(res.message);
					}
				}));

				console.log("data 资源 ",data);
			},

		},
		components: {
			resSel
		}

	}
</script>
<style scoped lang="less">
	@import "../../../assets/reset-element-ui/form.css";
	@import "../../../assets/less/icon.less";
	@import "../../../assets/less/activity.less";
	.dialog-form .selectRes{
		border: 1px solid #bfcbd9;
		padding:10px 5px 10px 20px;
		margin-top: 10px;
		border-radius: 3px;
		max-height:150px ;
		overflow-y:auto;
	}
	.dialog-form .selectRes li{
		line-height: 25px;
		color: #5d6a7c;
		padding-right: 15px;
	}
	.dialog-form .selectRes li i {
		width: 16px;
		height: 16px;
		vertical-align: text-bottom;
	}
	.el-transfer-panel .el-transfer-panel__header{
		color: #35a69d!important;
	}
</style>