<template>
	<div class="edit-stu-cert">
		<el-dialog class="dialog-form" title="编辑-学员证书"
			:visible.sync = "dialogEditStu"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open">
			<el-form :model="rule" :rules="rules" ref="rule"
					v-loading="loading"
					element-loading-text="拼命加载中">
				<el-form-item label="培训名称：" :label-width="labelWidth" prop="trainName">
					<el-input v-model.trim="rule.trainName" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="证书名称：" :label-width="labelWidth" prop="certificateName">
					<el-input v-model.trim="rule.certificateName" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="培训时间：" :label-width="labelWidth" prop="trainingPeriod">
					<el-input v-model.trim="rule.trainingPeriod" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="学时：" :label-width="labelWidth" prop="period">
					<el-input v-model.number="rule.period" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="学分：" :label-width="labelWidth" prop="credit">
					<el-input v-model.number="rule.credit" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="成绩：" :label-width="labelWidth" prop="score">
					<el-input v-model.trim="rule.score" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="发证日期：" :label-width="labelWidth" prop="certificateDate">
					<el-input v-model.trim="rule.certificateDate" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="证书编号：" :label-width="labelWidth" prop="certificateNo">
					<el-input v-model.trim="rule.certificateNo" placeholder="" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<p class="tip">提示：若不理解这些名称的意思，下载证书样例查看吧
					<a target="_blank" :href="templateEg" class="download-temp" >下载样例</a></p>
					
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="!loading && submitForm('rule')">确定</el-button>
				<el-button @click="close">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import cert from 'model/clazz/certificate'
	import API from '@/global/resource'
	import { getToken } from '@/filters/userVerify'
	export default {
		data() {
			return {
				loading: false,
				labelWidth: "120px",
				templateEg: API.urls.certTempSample,
				rule : {
					trainName: "",
		    		certificateName: "",
		    		trainingPeriod: "",
		    		period: "",
		    		credit: "",
		    		score: "",
		    		certificateDate: "",
		    		certificateNo: ""
				},
				rules: {
					trainName: [
						{ required: true, message: '请输入培训名称', trigger: 'blur'},
						{ max: 50, message: '培训名称不能超过50字' }
					],
					certificateName: [
						{ required: true, message: '请输入证书名称', trigger: 'blur'},
						{ max: 4, message: '证书名称不能超过4字' }
					],
					trainingPeriod: [
						{ required: true, message: '请输入培训时间', trigger: 'blur'}
					],
					// period: [
					// 	{ type: 'number', message: '请输入数字', trigger: 'blur'}
					// ],
					score: [
						{ required: true, message: '请输入培训成绩', trigger: 'blur'},
						{ max: 4, message: '成绩不能超过4字' }
					],
					certificateDate: [
						{ required: true, message: '请输入发证日期', trigger: 'blur'}
					],
					// certificateNo: [
					// 	{ required: true, message: '请输入证书编号', trigger: 'blur'}
					// ],
				}

			}
		},

		props: ['dialogEditStu','certificate', 'clazzId'],
		computed: {
			// rule() {
			// 	let rule = {
			// 		trainName: this.certificate.trainName,
		 //    		certificateName: this.certificate.certificateName,
		 //    		trainingPeriod: this.certificate.trainingPeriod,
		 //    		period: this.certificate.period,
		 //    		credit: this.certificate.credit,
		 //    		score: this.certificate.score,
		 //    		certificateDate: this.certificate.certificateDate,
		 //    		certificateNo: this.certificate.certificateNo

			// 	}
			// 	return rule;
			// }
		},
		methods: {
			open() {
				this.loading = false;
				this.rule = {
					trainName: this.certificate.trainName,
		    		certificateName: this.certificate.certificateName,
		    		trainingPeriod: this.certificate.trainingPeriod,
		    		period: this.certificate.period,
		    		credit: this.certificate.credit,
		    		score: this.certificate.score,
		    		certificateDate: this.certificate.certificateDate,
		    		certificateNo: this.certificate.certificateNo
				}
				console.log("certificate", this.certificate);
			},
			close() {
				this.$emit('update:dialogEditStu', false);
				this.rule = {
					trainName: "",
		    		certificateName: "",
		    		trainingPeriod: "",
		    		period: "",
		    		credit: "",
		    		score: "",
		    		certificateDate: "",
		    		certificateNo: ""
				};
				// this.resetForm('rule');
			},
			// 下载导入模板
			downloadTemp() {
				window.open(API.urls.clazzCertDownTemp+"?clazzId="+this.clazzId+"&token="+getToken());
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.editStu();
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},

			resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },

		    editStu() {
		    	this.loading = true;
		    	let data = {
		    		userId: this.certificate.userId,
		    		clazzId: this.clazzId,
		    		id: this.certificate.id,
		    		trainName: this.rule.trainName,
		    		certificateName: this.rule.certificateName,
		    		trainingPeriod: this.rule.trainingPeriod,
		    		period: this.rule.period,
		    		credit: this.rule.credit,
		    		score: this.rule.score,
		    		certificateDate: this.rule.certificateDate,
		    		certificateNo: this.rule.certificateNo
		    	}
		    	cert.clazzCertUpdate(data, (res => {
		    		console.log("编辑信息", res);
		    		if(res.status == 200) {
		    			this.loading = false;
		    			this.close();
		    			// 更新证书列表
						this.$emit("updateList")
		    		} else {
		    			this.$message.error(res.message);
		    			this.loading = false;
		    		}
		    	}));
		    }
		}
	}
</script>
<style  scoped lang="less">
	@import "../../../assets/reset-element-ui/form.css";
	.download-temp {
		font-size:14px;
		color:#1077d7;
		text-decoration: underline;
	}
	.tip {
		padding-left: 30px;
	}
</style>