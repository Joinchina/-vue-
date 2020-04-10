<template>
	<div class="rules">
		<el-dialog
			class="dialog-form"
			width="763px"
			title="学习要求规则配置"
			:visible.sync="dialogRules"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open"
			>

			<!--tab切换-->
			<div class="j-train">
				<div class="active-bar"></div>
				<ul>
					<li :class="{'active':0 == curIndex}" @click="tab(0)">课件资源</li>
					<li @click="tab(1)" :class="{'active':1 == curIndex}">网络课程</li>
				</ul>
			</div>

			<!--课件资源-->
			<div :class="0 == curIndex ? {'j-status':true}:{'j-status-none':true}">
				<section class="round-layout">
					<h3 class="rules-tit">
						<i class="icon-learn-res"></i>
						<span>资源</span>
						<p class="operate" v-if="editFlag" @click="submitRules">
							<i class="icon-learn-ok"></i>
							完成
						</p>
						<p class="edit" v-else @click="editFlag = true">
							<i class="icon-edit-ora"></i>
							修改
						</p>
					</h3>
					<ul class="rules-det">
						<li>
							查看数量：
							<span v-if="editFlag">
								<el-input 
									
									v-model.trim="num"
									></el-input>
							</span>
							<span v-else>{{num}}</span>
						</li>
						<li>
							学习时长：
							<span v-if="editFlag">
								<el-input 
									size="mini"
									v-model.trim="hours"
									>
									<template slot="append">小时</template>
								</el-input>
							</span>
							<span v-else>{{hours}}小时</span>
						</li>
						<li>
							截止时间：
							<span v-if="editFlag">
								<el-date-picker
									size="mini"
							        v-model="endtime"
							        type="date"
							        placeholder="请选择"
							        format="yyyy-MM-dd"
							        value-format="yyyy-MM-dd"
							        :picker-options="pickerEndtime">
							    </el-date-picker>
							</span>
							<span v-else>{{endtime}}</span>
						</li>
					</ul>
				</section>

				<section class="round-layout">
					<h3 class="rules-tit">
						<i class="icon-learn-task"></i>
						<span>活动</span>
						<p>创建相关任务时自动添加</p>
					</h3>
					<ul class="rules-det">
						<li class="clearfix">
							作业：<span>{{rules.homeworkCount}}</span>
						</li>
						<li class="clearfix">
							学员互评作业：<span>{{rules.reviewHomeworkCount}}</span>
						</li>
						<li class="clearfix">
							评价：<span>{{rules.evaluationCount}}</span>
						</li>
						<li class="clearfix">
							反思：<span>{{rules.introspectionCount}}</span>
						</li>
						<li class="clearfix">
							投票：<span>{{rules.voteCount}}</span>
						</li>
						<li class="clearfix">
							问卷：<span>{{rules.questionnaireCount}}</span>
						</li>
						<li class="clearfix">
							日志：<span>{{rules.userLogCount}}</span>
						</li>
					</ul>
				</section>

				<section class="round-layout">
					<h3 class="rules-tit">
						<i class="icon-more-blue"></i>
						<span>其他</span>
						<p>创建相关任务时自动添加</p>
					</h3>
					<ul class="rules-det">
						<li class="clearfix">
							签到：<span>{{rules.signCount}}</span>
						</li>
					</ul>
				</section>

			</div>

			<!--网络课程-->
			<section :class="1 == curIndex ? {'j-status':true}:{'j-status-none':true}">
				<el-form :model="ruleForm" :rules="ruleNet" ref="ruleForm" label-width="100px" class="net-ruleForm">
					<!--基础设置-->
					<div class="round-layout round-pad">
						<ul class="rules-det rules-top-none">
							<h3>
								<i class="left-line">基础设置</i>
							</h3>
							<li style="position:relative">
								<el-form-item label="最低必修学时："  required>
									<div class="right">
											 <el-form-item prop="minRequiredCourseLearnTime">
												<span>
											    	<el-input 
											    		size="mini"
											    		type="search"
											    		v-model.number="ruleForm.minRequiredCourseLearnTime"
														>
														<template slot="append">学时</template>		
													</el-input>

												</span>
											</el-form-item>
									</div>
								 </el-form-item>
								 <div class="li-mg">
								 	注：1学时={{learnTimeUnit}}分钟
								 </div>
							</li>

							<!-- <li class="clearfix li-mg">
								
							</li> -->

							<li>
								<el-form-item label="学习起止日期：" required>
									<div class="right">
									     <el-form-item prop="endDate">
									     	<span>
										        <el-date-picker
										        	type="date" 
										        	size="mini"
										        	value-format="yyyy-MM-dd"
										        	placeholder="选择日期" 
										        	v-model="ruleForm.endDate"
										        	:picker-options="pickerNetEndOptions" 
										        	style="width: 100%;">
										        </el-date-picker>
									        </span>
									    </el-form-item>
									</div>
									<div class="line">~</div>
									<div class="right">
										<el-form-item prop="beginDate">
											<span>
										        <el-date-picker
										        	size="mini" 
										        	type="date" 
										        	value-format="yyyy-MM-dd"
											        placeholder="选择日期" 
											        v-model="ruleForm.beginDate" 
											        :picker-options="pickerNetStartOptions"
											        style="width: 100%;">
										        </el-date-picker>
									    	</span>
									      </el-form-item>
								  
									</div>

							    </el-form-item>
							</li>

						</ul>
					</div>

					<!--选修设置-->
					<div class="round-layout" v-if="vipInfo.onlineSelectCourse">
						<ul class="rules-det rules-top-none">
							<h3>
								<i class="left-line">选修设置</i>
								<em class="right" :class="{'red':errorFlag}">选修学时大于0且勾选课程范围时，系统才会记录学生学习选修课的学时</em>
							</h3>
							<li>
								<!-- 最低选修学时：
								<span>
									<el-input 
										v-model="ruleForm.selectMinHour"
										size="mini">
										<template slot="append">学时</template>		
									</el-input>
								</span> -->

								<el-form-item label="最低选修学时：">
									<span>
								    	<el-input
								    		type="search"
								    		v-model.number="ruleForm.minOptionalCourseLearnTime"
											size="mini">
											<template slot="append">学时</template>		
										</el-input>
									</span>
							    </el-form-item>

							</li>


							<li class="clearfix">
								选修课程范围：
								<div class="right">
									<cas-cade :dataArray = "dataArray" @range = "getCodeObj"></cas-cade>
								</div>
							</li>


						</ul>
					</div>

				    </el-form>

				     <!--footer-->
				    <div slot="footer" class="dialog-footer">
				      	<el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
				        <el-button @click="closeNet">关闭</el-button>
				    </div>

			</section>

		</el-dialog>

		<!-- 必修课剩余不足 -->
		<overLimitPop 
			:overLimitDialog.sync = "overLimit" 
			:text = "'您所属机构的网络课程添加数量已达上限，无法继续添加'" 
			:footerText = "'添加更多课程'" 
			:param="'onlineCompulsory'"></overLimitPop>
	</div>
</template>
<script>
	import model from 'model/clazz/learncase'
	import modelNet from 'model/resource/net'
	import casCade from '@/base/cascade/cascade'
	import overLimitPop from "@/base/overLimitPop/index"
	export default {
		data() {

			var numberLog = (rule, value, callback) => {
				    
					
			        if (value === '') {
			          return callback(new Error('请填写必修学时'));
			        }else{
			        	

			        	if(!Number.isInteger(value)){
			        		callback(new Error('请输入数字'));
			        	}else{

			        		if(value === 0){
			        			return callback(new Error('学时为正整数'));
			        		}

			        		if(value > 999){
			        			return callback(new Error('学时数值过大'));
			        		}
			        		callback();
			        	}
			       }
      		};
			return {
				pickerEndtime: {
					disabledDate(time) {
			            return time.getTime() < Date.now();
			        }
				},
				rules: {},	// 规则返回值
				num: 0,
				hours: 0,
				endtime: "",
				editFlag: false,	//是否是编辑状态

				subjectCods:[],
				overLimit : false,
				ruleForm: {
						minRequiredCourseLearnTime: '',
						beginDate: '',
						endDate: '',

						minOptionalCourseLearnTime: '',
				},
				ruleNet: {
					minRequiredCourseLearnTime: [
						{ validator: numberLog, trigger: 'blur'},
					],
					beginDate: [
						{ type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
						],
						endDate: [
							{ type: 'string', required: true, message: '请选择截止日期', trigger: 'change' }
						],

				},

				dataArray:[],
				dataArraySelect:[],

				errorFlag:false,

				learnTimeUnit:"",

				pickerNetStartOptions: {
					disabledDate (time) {
						return time.getTime() < Date.now() - 8.64e7;
					},
				},
				pickerNetEndOptions: {
					disabledDate (time) {
						return time.getTime() < Date.now();
					},
				},

				curIndex:this.curIndexn,
				vipInfo:{}

			}
		},
		created(){
			setTimeout(()=>{this.vipInfo = this.$store.getters.getOrgVipInfo;},1000)
		},
		props: ['dialogRules', 'clazzId',"curIndexn"],


		methods: {
			getCodeObj(obj){
				this.dataArraySelect = obj;
			},
			submitForm(formName) {

				console.log("确定");
				//判断选修课时和学段必须选择一个
				let array = this.transformData();
				
				// if(this.ruleForm.minOptionalCourseLearnTime !== ''&&array.length == 0){
				// 	this.errorFlag = true;
				// 	return;
				// }

				// if(this.ruleForm.minOptionalCourseLearnTime === '' && array.length != 0){
				// 	this.errorFlag = true;
				// 	return;
				// }
		        this.$refs[formName].validate((valid) => {
		            if (valid) {
		            	this.submitNetRules(formName);
		            } else {
		              console.log('error submit!!');
		              return false;
		            }
		        });
	    	},

	    	submitNetRules(formName){
	    		
	    		this.errorFlag = false;

	    		let options = this.transformData();

	    		let data = {
	    			clazzId:this.clazzId,
	    			minOptionalCourseLearnTime:this.ruleForm.minOptionalCourseLearnTime,
	    			minRequiredCourseLearnTime:this.ruleForm.minRequiredCourseLearnTime,
	    			beginDate:this.ruleForm.beginDate,
	    			endDate:this.ruleForm.endDate,
						optionalRange:JSON.stringify(options),
	    		}

	    		if(options.length == 0){
	    			data["optionalRange"] = ""
	    		}else{
	    			data["optionalRange"] = JSON.stringify(options)
	    		}

	    		modelNet.publishTaskRule(data,(res)=>{
	    			if(res.status == 200){

	    				this.$emit("updateNetRules");
	    				this.close();
	    				//清除数据
	    				this.$refs[formName].resetFields();

	    				this.ruleForm.minOptionalCourseLearnTime = "";



	    			}else{
							if(res.status == 423){
								this.overLimit = true;
							}else{
								this.$message.error(res.message);
							}
	    				
	    			}
	    		})

	    	},

	    	transformData(){
	    		let array = [];

	    		//后台传输数据
	    		this.dataArraySelect.forEach((item,index)=>{
	    			let subObj = {}
	    			let evas = [];
	    			item.subjectList.forEach((sub,eq)=>{
	    				if(sub.isSelect){
	    					let obj = sub;
	    					evas.push(obj);

	    					//组织对象
	    					subObj["schoolStageCode"] = item.schoolStageCode;
	    					subObj["schoolStageName"] = item.schoolStageName;
	    					subObj["subjects"] = evas;
	    				}
	    			})

	    			if(!!subObj.schoolStageCode){
	    				array.push(subObj);
	    			}
	    			
	    		})

	    		return array;

	    	},

			closeNet(){

				this.$emit('update:dialogRules', false);
				this.$refs.ruleForm.resetFields();
			},


			open() {

				this.getRules();

				//查看网络课程
				this.getNetRules();


				
			},

			close(done) {
				// done();
				this.$emit('update:dialogRules', false);
				this.$refs.ruleForm.resetFields();
			},
			getNetRules(){
				let data = {
					clazzId:this.clazzId
				}
				modelNet.getOnlineSet(data,(res =>{
					if(res.status == 200){

						let data = res.data;

						this.learnTimeUnit = data.learnTimeUnit;

						if(data.minRequiredCourseLearnTime){
							this.ruleForm.minRequiredCourseLearnTime = data.minRequiredCourseLearnTime;
						}
						if(data.hasOwnProperty("minOptionalCourseLearnTime")){
							this.ruleForm.minOptionalCourseLearnTime = data.minOptionalCourseLearnTime;
						}
						if(data.beginDate){
							this.ruleForm.beginDate = data.beginDate;
						}
						if(data.endDate){
							this.ruleForm.endDate = data.endDate;
						}

						this.dataArray = data.schoolStageSubjectVolist;





					}else{
						this.$message.error(res.message);
					}
				}))
			},

			getRules() {


				let data = {
					clazzId: this.clazzId
				}
				model.clazzLearnRuleGet(data, (res => {
					console.log("rules" ,res)
					if(res.status == 200) {
						this.rules = res.data;
						this.num = res.data.resourceViewCount || 0;
						this.hours = res.data.resourceLearnTime || 0;
						this.endtime = res.data.resourceEndTime || '';

						if(this.curIndexn == "1"){
							$(".active-bar").attr("style","transform:translate(140px)");
						}

						
					}
				}));
			},
			updateRules() {
				let data = {
					clazzId: this.clazzId,
					resourceViewCount: this.num,
					resourceLearnTime: this.hours,
					resourceLearnEndDate: this.endtime
				}
				model.clazzLearnRulePost(data, (res => {
					console.log("update rules" ,res)
					if(res.status == 200) {
						this.$emit('updateDate');
						this.editFlag = false;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			tab(index){

				if(index == 0){
					this.curIndex = 0;
					$(".active-bar").attr("style","transform:translate(0px)")

				}else{
					this.curIndex = 1;
					$(".active-bar").attr("style","transform:translate(140px)")
				}
			},
			submitRules() {
				let num = this.num,
					hours = this.hours,
					reg = /^[0-9]*$/;

				if(num.toString().length == 0 || !reg.test(num)) {
					this.$message.error('查看数量，请输入正确的数字格式');
					return false;
				} else if(num > 10000) {
					this.$message.error('查看数量不能大于10000');
					return false;
				}
				if(hours.toString().length == 0 || !reg.test(hours)) {
					this.$message.error('学习时长，请输入正确的数字格式');
					return false;
				} else if(hours > 10000) {
					this.$message.error('学习时长不能大于10000');
					return false;
				}
				if(!this.endtime) {
					this.$message.error('请选择截止日期');
					return false;
				}
				this.updateRules();


			}

		},
		components:{
			casCade,
			overLimitPop
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/reset-element-ui/form.css";
	@import "../../../assets/less/icon.less";
	@import "../../../assets/reset-element-ui/form-reset.css";
	
	.el-date-editor.el-input, .el-date-editor.el-input__inner {
		width: auto;
	}
	.round-pad{
		padding-bottom: 0!important;
	}
	.round-layout {
		margin-left: 30px;
		margin-bottom: 20px;
		padding: 10px 30px;
		text-align: left;
		.rules-tit {
			position: relative;
			font-size: 20px;
			color: #000000;
			letter-spacing: 0;
			line-height: 20px;

			>i {
				margin-right: 5px;
				margin-left: -12px;
				vertical-align: middle;
			}
			p {
				position: absolute;
				right: 0;
				margin-top: -25px;
				font-size: 14px;
				color: #999999;
				line-height: 16px;
				text-align: right;
			}
			.operate {
				color: #35A69D;
				cursor: pointer;
			}
			.edit {
				cursor: pointer;
				color: #FD7E23;
			}
		}

		.rules-det {
			margin-top: 30px;
			
			li {
				line-height: 28px;
				margin-bottom: 20px;
				font-size: 16px;
				color: #333333;
			}
			.line{
				float:right;
				margin:0 5px;
				line-height: 40px;
				color:#A3B1C5
			}
			.li-mg{	
				font-size: 14px;
				color: #999;
				position: absolute;
				top: 28px;
				left: 10px;
			}
			h3{
				margin-bottom: 40px;
				font-size: 22px;
				color: #000;
			}
			em{
				font-size: 14px;
				color: #999;
				font-size: 14px;
			}
			span {
				width: 160px;
				text-align: right;
				float: right;
				font-size: 16px;
				color: #999;
				letter-spacing: 0;
			}
			.width-none{
				width: auto;
				color: #A3B1C5;
				padding:0 5px;
				margin-top: 7px;
			}
		}
		.rules-top-none{
			margin: 0px;
			padding-bottom: 0;
			h3{
				margin-bottom: 13px;
			}
			li{
				margin-bottom: 0;
			}
		}
		.el-form-item__content{
			line-height: 20px!important;
			padding-top: 3px;
		}

	}
	.j-train{
		width: 275px;
		height: 42px;
		line-height: 42px;
		color:#666;
		background: #F5F5F5;;
		border-radius: 100px;
		border:2px solid #E1E7E2;
		font-size: 16px;
		margin:-6px auto 20px auto;
		position: relative;
		
		.active-bar{
			position: absolute;
			left: 0;
			top: -1px;
			background:#35A69D;
			border-radius: 100px;
			text-align: center;
			width: 50%;
			height: 42px;
			color: #fff;
			transition:transform .3s;
			transform: translate(0px);
		}
		li{
			position: relative;
			float: left;
			text-align: center;
			width: 50%;
			cursor: pointer;

		}
		.active{
			color:#fff;
		}
	}
	.j-status{
		display:block;
	}
	.j-status-none{
		display: none;

	}
	.dialog-footer{
		text-align: right;
	}

</style>