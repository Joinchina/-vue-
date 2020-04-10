<template>
	<div class="w-addIntegral">
		<el-dialog class="dialog-form"
			title="新增积分项目"
			:visible.sync="dialogIntegral"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open">
			<el-form :model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				v-loading="loading"
				:element-loading-text="$globalParam.loadText"
			    :element-loading-spinner="$globalParam.loadSpinner"
			    :element-loading-background="$globalParam.loadText" >

				<el-form-item label="顺序" :label-width="labelWidth" prop="orderNumber">
					<el-input v-model.number="ruleForm.orderNumber" placeholder="用于客户端判断版本的序号"></el-input>
				</el-form-item>
				<el-form-item label="类型" :label-width="labelWidth" prop="type">
				    <el-radio-group v-model="ruleForm.type">
				      <el-radio label="SYSTEM_TASK">系统积分</el-radio>
				      <el-radio label="CLAZZ_TASK">学习积分</el-radio>
				    </el-radio-group>
				</el-form-item>
				<el-form-item label="名称" :label-width="labelWidth" prop="name">
					<el-input v-model.trim="ruleForm.name" placeholder="15字以内"></el-input>
				</el-form-item>
				<el-form-item label="分值" :label-width="labelWidth" prop="rewards">
					<el-input v-model.number="ruleForm.rewards" placeholder="请输入1-30之间的整数数字"></el-input>
				</el-form-item>
				
				<el-form-item label="加分上限设置" :label-width="labelWidth" required>
					<div class="select-box">
						<el-select class="sel-inline" v-model="ruleForm.limitType" placeholder="" @change="limitypeSwitch">
							<el-option label="同一账号" value="ACCOUNT" ></el-option>
							<el-option label="同一账号每天" value="DAILY" ></el-option>
							<el-option label="同一账号任意课程下" value="COURSE" ></el-option>
						</el-select>
					
						<el-select class="sel-inline" v-model="ruleForm.limitWay" placeholder="" @change="limitwaySwitch">
							<el-option label="次数上限" value="TIMES" ></el-option>
							<el-option label="无上限" value="NO_LIMIT" ></el-option>
						</el-select>
						<template v-if="ruleForm.limitWay == 'TIMES'">
							<el-input class="count" v-model.number="ruleForm.limits"></el-input> 次
						</template>
						
					</div>
					<p class="tip">注：账号值ID，同一手机号有多个ID的情况下，多ID间彼此独立，互不影响。</p>
				</el-form-item>
				

				<el-form-item label="说明" :label-width="labelWidth" prop="">
					<el-input v-model.trim="ruleForm.description" placeholder=" 此说明为App中展示给用户的解释"></el-input>
				</el-form-item>
				<el-form-item label="备注" :label-width="labelWidth" prop="">
					<el-input type="textarea" v-model.trim="ruleForm.remark" placeholder="产品内部备注信息，100字以为（选填）"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
		        <el-button type="primary" @click="!loading && submitForm('ruleForm')">确定</el-button>
		        <el-button @click="close">取消</el-button>
		    </div>
		</el-dialog>
	</div>
</template>
<script>
	import Integral from "model/comtpoc/integral" 
	export default {
		data() {
			let checkRewards = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('分值不能为空'));
				}
				if(!Number.isInteger(value)) {
					callback(new Error('请输入数字值'));
				} else {
					if (value > 30 || value < 1) {
		              callback(new Error('请输入1-30之间的整数数字'));
		            } else {
		              callback();
		            }
				}

			};
			let checkOrder = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('顺序不能为空'));
				}
				if(!Number.isInteger(value)) {
					callback(new Error('请输入大于0的正整数'));
				} else {
					if (value < 1) {
		              callback(new Error('请输入大于0的正整数'));
		            } else {
		              callback();
		            }
				}
			};
			return {
				ruleForm: {
					orderNumber: "",	//顺序
					type: "SYSTEM_TASK",	// 类型
					name: "",		// 名称
					rewards: "",	// 分值
					limitType: "ACCOUNT",	// 加分上线设置 类型
					limitWay: "TIMES",
					limits: "",		// 次数
					description: "",	// 说明
					remark: "",			// 备注
				},
				rules: {
					orderNumber: [
						{ required: true, validator: checkOrder  },
					],
					type: [
						{ required: true, message: '请选择类型', trigger: 'change' },
					],
					name: [
						{ required: true, message: '请输入名称' , trigger: 'blur'},
						{ min: 1, max: 15, message: '名称15字以内', trigger: 'blur' }
					],
					rewards: [
						{ required: true, validator: checkRewards }
					],
					limitType: [
						{ required: true, message: '请选择加分上限设置', trigger: 'change' },
					],
					limitWay: [
						{ required: true, message: '请选择加分上限设置', trigger: 'change' },
					],
					limits: [
						{ required: true, message: '次数不能为空' },
						{ type: 'number', message: '次数必须为数字值'}
					]

				},
				labelWidth: "120px",
				loading: false,
			}
		},
		props: ["dialogIntegral"],
		mounted() {

		},
		methods: {
			open() {
				this.loading = false;
			},
			close () {
				this.$emit('update:dialogIntegral', false);
				this.resetForm('ruleForm');
				this.ruleForm.limitType = "ACCOUNT";
				this.ruleForm.limitWay = "TIMES";
				this.ruleForm.limits = "";
				this.ruleForm.description = "";
				this.ruleForm.remark = "";
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(!!valid) {
						console.log("valid", valid);
						this.addIntegral();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },
		    addIntegral() {
		    	let data = {
		    		orderNumber: this.ruleForm.orderNumber,
		    		type: this.ruleForm.type,
		    		name: this.ruleForm.name,
		    		rewards: this.ruleForm.rewards,
		    		limitType: this.ruleForm.limitType,
		    		limitWay: this.ruleForm.limitWay,
		    		limits: this.ruleForm.limits,
		    		description: this.ruleForm.description,
		    		remark: this.ruleForm.remark
		    	}

		    	if(this.ruleForm.limitWay == 'TIMES' && !this.ruleForm.limits) {
		    		this.$message.error("请输入次数上限");
		    		return false;
		    	}

		    	this.loading = true;
		    	Integral.postTaskSave(data, (res => {
		    		console.log("添加积分成功", res)
		    		if(res.status == 200) {
						this.close();
						this.$emit('updateList');
						this.$message.success("新建积分成功！");
						this.loading = false;
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
		    	}));
		    },
		    limitypeSwitch(val) {
		    	this.ruleForm.limitType = val
		    },
		    limitwaySwitch(val) {
		    	this.ruleForm.limitWay = val

		    	if(val == "NO_LIMIT") {
		    		this.ruleForm.limits = "";
		    	}
		    }

		}

	}
</script>
<style scoped lang="less">
@import "../../../assets/reset-element-ui/form.css";
.tip {
	position: absolute;
	display: block;
	font-size: 13px;
	line-height: 1.4em;
}
.sel-inline {
	box-sizing: border-box;
	display: inline-block;
	width: 40%;
}
.count {
	box-sizing: border-box;
	width: 10%;
}
</style>