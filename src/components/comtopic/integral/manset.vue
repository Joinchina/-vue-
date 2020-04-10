<template>
	<div class="w-manset">
		<el-dialog class="dialog-form"
			title="手动加分设置"
			:visible.sync="dialogSet"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open">
			
			<!-- 编辑状态 -->
			<template v-if="editFlag">
				<el-form :model="ruleForm2"
					:rules="rules"
					ref="ruleForm2"
					v-loading="loading"
					:element-loading-text="$globalParam.loadText"
				    :element-loading-spinner="$globalParam.loadSpinner"
				    :element-loading-background="$globalParam.loadText" >

					<el-form-item label="加分原因：" :label-width="labelWidth" prop="reasons">
						<div class="set-content">
							<el-input class="tag-input" v-model.trim="tag[0]" maxlength="15"></el-input>
							<el-input class="tag-input" v-model.trim="tag[1]" maxlength="15"></el-input>
							<el-input class="tag-input" v-model.trim="tag[2]" maxlength="15"></el-input>
							<el-input class="tag-input" v-model.trim="tag[3]" maxlength="15"></el-input>
							<el-input class="tag-input" v-model.trim="tag[4]" maxlength="15"></el-input>
							<el-input class="tag-input" v-model.trim="tag[5]" maxlength="15"></el-input>
							<el-input class="tag-input" v-model.trim="tag[6]" maxlength="15"></el-input>
							<el-input class="tag-input" v-model.trim="tag[7]" maxlength="15"></el-input>
						</div>
					</el-form-item>
					
					<el-form-item label="同一账号手动分数上限：" label-width="216px" prop="upperlimit">
						<p class="text">
							<el-input class="upperlimit" v-model="ruleForm2.upperlimit"></el-input> 分
						</p>
						
					</el-form-item>
					<p class="tip">注：账号指ID ，同一手机号有多个ID的情况下，多ID间彼此独立，互不影响  </p>

					<el-form-item label="备注说明：" :label-width="labelWidth" prop="description">
						<el-input type="textarea" v-model.trim="ruleForm2.description" placeholder="产内部备注说明，200字以内（选填）"></el-input>
					</el-form-item>
				</el-form>

				<div slot="footer" class="dialog-footer">
			        <el-button type="primary" @click="!loading && submitForm('ruleForm2')">确定</el-button>
			        <el-button @click="close">关闭</el-button>
			    </div>
			</template>
			
			<!-- 查看状态 -->
			<template v-else>
				<el-form :model="ruleForm2"
					:rules="rules"
					ref="ruleForm2"
					v-loading="loading"
					:element-loading-text="$globalParam.loadText"
				    :element-loading-spinner="$globalParam.loadSpinner"
				    :element-loading-background="$globalParam.loadText" >

					<el-form-item label="加分原因：" :label-width="labelWidth" >
						<div class="set-content">
							<span v-for="item in reasons" class="tag">{{item}}</span> 
						</div>
					</el-form-item>
					
					<el-form-item label="同一账号手动分数上限：" label-width="216px" >
						<span class="text">{{det.upperlimit}} 分</span>
					</el-form-item>
					<p class="tip">注：账号指ID ，同一手机号有多个ID的情况下，多ID间彼此独立，互不影响  </p>

					<el-form-item label="备注说明：" :label-width="labelWidth" >
						<span class="text">{{det.description ? det.description : '无' }}</span>
					</el-form-item>
				</el-form>

				<div slot="footer" class="dialog-footer">
			        <el-button type="primary" @click="editFlag = true">编辑</el-button>
			        <el-button @click="close">关闭</el-button>
			    </div>
			</template>
			
		</el-dialog>
	</div>
</template>
<script>
	import Integral from "model/comtpoc/integral" 
	export default {
		data(){
			let checkReasons = (rule, value, callback) => {
				value = tag.join(",");
				if(!value) {
					return callback(new Error('加分原因至少输入一个'));
				} else {
					callback();
				} 
			};
			return {
				tag: [],	// 输入的标签
				ruleForm2: {
					reasons: "",
					upperlimit: "",
					description: ""
				},
				rules: {
					reasons: [
						{required: true, validator: checkReasons}
					],
					upperlimit: [
						{ required: true, message: '请输入上限分值', trigger: 'change' }
					],
					description: [
						{  max: 15, message: '200字以内', trigger: 'blur'}
					]
				},
				det: {},	// 加分原因
				reasons: [],
				labelWidth: "120px",
				loading: false,

				editFlag: false,	// 是否编辑状态
			}
		},
		props: ["dialogSet"],
		methods: {
			open() {
				this.loading = false;
				this.getDetails();
			},
			close () {
				this.$emit('update:dialogSet', false);
			},
			getDetails() {
				Integral.getTaskReason({},  (res => {
					console.log("获取加分原因", res);
					if(res.status == 200) {
						this.det = res.data;
						this.reasons = res.data.reasons.split(",");
						console.log("原因数组 ",this.reasons);

						// 编辑赋值
						this.ruleForm2 = res.data;
						this.tag = this.reasons;

					} else {
						this.$message.error(res.message);
					}
					
				}));
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(!!valid) {
						console.log("valid", valid);
						this.reasonSave();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			reasonSave() {
				let rea = this.tag.join(",");
				let data = {
					description: this.ruleForm2.description,
					upperlimit: this.ruleForm2.upperlimit,
					reasons: rea
				}

				console.log("data === ", data)
				Integral.postTaskReasonSave(data, (res => {
					console.log("设置成功==", res)
					if(res.status == 200) {
						this.getDetails();
						this.editFlag = false;
						this.loading = false;
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
				}));
			}
			
		}

	}
</script>
<style scoped lang="less">
@import "../../../assets/reset-element-ui/form.css";
.set-content {
	font-size: 15px;
	color: #333333;
	margin-bottom: -30px;
	.tag {
		display: inline-block;
		background: #F7FAFD;
		border: 1px solid #BFCBD9;
		border-radius: 4px;
		font-size: 14px;
		color: #666666;
		letter-spacing: 0;
		line-height: 14px;
		padding: 10px 20px;
		margin-right: 20px;
		margin-bottom: 15px;
	}
}
.text {
	font-size: 15px;
	color: #333333;
	line-height: 1em;
}
.tip {
	font-size: 13px;
	color: #999999;
	letter-spacing: 0;
	line-height: 13px;

	margin-left: 28px;
    margin-top: -20px;
    margin-bottom: 20px;
}
.upperlimit {
	width: 126px;
	display: inline-block;
}
.tag-input {
	width: 160px;
	margin-right: 20px;
	margin-bottom: 15px;
}
</style>