<template>
	<div class="wNetClazz"
		v-loading="loading"
	    :element-loading-text="$globalParam.loadText"
	    :element-loading-spinner="$globalParam.loadSpinner"
	    :element-loading-background="$globalParam.loadText">
		<div class="tab-link clearfix">
			<router-link :to="{ path: '/resource/list', query: {clazzId: clazzId}}">
				<i class="icon-course-res2"></i>
				课件资源
			</router-link>
			<router-link :to="{ path: '/resource/net/online', query: {clazzId: clazzId}}">
				<i class="icon-course-net"></i>
				网络课程
			</router-link>
		</div>

		<template v-if="emptyFlag">
			<section class="wempty round-layout">
				<el-steps :active="stepActive" :class="{stepHide:anmistepComplete}" align-center finish-status="success">
					<el-step title="设置学习要求"></el-step>
					<el-step title="选择必修课"></el-step>
					<el-step title="发布课程"></el-step>
					<a :href="videoTutorial" class="videoTutorial" target="_blank">视频教程</a>
				</el-steps>
				<div :class="{rules:rules,rulesSeted:rulesSeted}" >
					<template v-if="role !== 'PROFESSOR' && rulesData.learnTimeUnit">
						<template v-if="setRulesFlag">
							<!-- <span>网络课程的学习任务还没有配置规则哦～</span>
							<p class="rules-set" @click="rulesFlag = true">
								<i class="icon-learn-set-ora"></i>
								规则配置
							</p> -->
							<img src="../../../assets/img/clazz/emptyState.png" class="emptyStateImg">
							<p class="emptyStateText">请先设置学习要求</p>
							<el-button class="toSetRule" type="primary" icon="el-icon-edit" @click="rulesFlag = true">去设置</el-button>

						</template>
						<template v-else>
							学习要求：
							<span>学习起止日期：{{rulesData.beginDate}}-{{rulesData.endDate}} </span>
							<span>必修学时：{{rulesData.minRequiredCourseLearnTime}}</span>
							<template>
								<span>选修学时：{{rulesData.minOptionalCourseLearnTime ? rulesData.minOptionalCourseLearnTime : '未设置'}}</span>
								<span v-if="rulesData.schoolStageSubjectVolist && rulesData.schoolStageSubjectVolist.length>0" @click="rulesFlag = true">选修课程范围：<i class="view">查看</i></span>
								<span v-else>选修课程范围：未设置</span>
							</template>
							
							<p class="rules-edit" @click="rulesFlag = true">
								<i class="icon-edit-ora"></i>
								修改要求
							</p>
						</template>
					</template>
				</div>
				
				<h2 class="title" v-if="obligatoryFlag">
					必修课程
					<span>
						（已选{{onlineInfo.courseCount}}门   已选课程总学时  {{onlineInfo.totalLearnTime}}学时)
					</span>
					<span class="attention" @click="toAccountCenter">该班剩余课程数量：{{leaveCourse}}</span>
				</h2>

				<!-- 没有资源时 -->
			    <empty
				   v-if="obligatoryFlag"
			      :tip="tip"
			      :btntext="btntext"
			      @add="addNet"></empty>
			    <!-- /没有资源时 -->
			</section>
		</template>
	
		<!-- 不是空页面 -->
		<section class="wres round-layout noEmpty" v-if="!emptyFlag">
			<el-steps :class="{stepHide:anmistepComplete}" :active="stepActive" align-center finish-status="success" v-if="!stepComplete">
				<el-step title="设置学习要求"></el-step>
				<el-step title="选择必修课"></el-step>
				<el-step title="发布课程"></el-step>
				<a :href="videoTutorial" class="videoTutorial" target="_blank">视频教程</a>
			</el-steps>
			<div :class="{rules:rules,rulesSeted:rulesSeted}">
				<template  v-if="role !== 'PROFESSOR' && rulesData.learnTimeUnit">
					学习要求：

					<template v-if="setRulesFlag">
						<span>网络课程的学习任务还没有配置规则哦～</span>
						<p class="rules-set" @click="rulesFlag = true">
							<i class="icon-learn-set-ora"></i>
							规则配置
						</p>
					</template>
					<template v-if="!setRulesFlag">
						<span>学习起止日期：{{rulesData.beginDate}}-{{rulesData.endDate}} </span>
						<span>必修学时：{{rulesData.minRequiredCourseLearnTime}}</span>

						<template>
							<span>选修学时：{{typeof rulesData.minOptionalCourseLearnTime == 'number' ? rulesData.minOptionalCourseLearnTime : '未设置'}}</span>
							<span v-if="hasChooseData" @click="rulesFlag = true">选修课程范围：<i class="view">查看</i></span>
							<span v-else>选修课程范围：未设置</span>
						</template>
						<p class="rules-edit" @click="rulesFlag = true">
							<i class="icon-edit-ora"></i>
							修改要求
						</p>
					</template>
				</template>
				
			</div>
			
			<div class="handle clearfix">
				<h2 class="title">
					必修课程
					<span>
						（已选{{onlineInfo.courseCount}}门   已选课程总学时  {{onlineInfo.totalLearnTime}}学时)
					</span>
					<span class="attention" @click="toAccountCenter">该班剩余课程数量：{{leaveCourse}}</span>
				</h2>
				<template v-if="onlineInfo.isUpdate">
					<button type="button" class="btn-green-line" @click="exportList">
						<i class="icon-export-green"></i>
						导出
					</button>
					<button type="button" class="btn-blue-line" @click="issueBox('update')">
						<i class="icon-update-blue"></i>
						更新
					</button>
				</template>
				<template v-else>
					<button type="button" class="btn-blue-line" @click="issueBox('publish')">
						<i class="icon-release-blue"></i>
						发布
					</button>
				</template>
				
				<button type="button" class="btn-green btnAddrES" @click="addNet">
					<i class="icon-add-white"></i>
					添加必修课
				</button>
			</div>
			
			<!-- table -->
			<el-table class=""
				:data = "items"
				stripe
				v-if="obligatoryFlag"
				>
				<el-table-column
					prop=""
					label="序号"
					width="80">
					<template slot-scope = "scope">
			      		{{(cur_page-1)*20+scope.$index+1}}
			      	</template>
				</el-table-column>
				<el-table-column
					prop="code"
					label="课程编码"
					width="140">
					
				</el-table-column>
				<el-table-column
					prop="name"
					label="课程名称"
					width="">
					<template slot-scope="scope">
						<a href="javascript:;" class="cursorName" target="_blank" @click="viewCourse(scope)">{{scope.row.name}}</a>
						<!-- <router-link :to="{path:'/resourse/previewCourse',query:{clazzId:clazzId,courseId:scope.row.id}}" class="cursorName" target="_blank">{{scope.row.name}}</router-link> -->
					</template>
				</el-table-column>
				<el-table-column
					prop="recommendLearnTime"
					label="建议学时"
					width="80">
					
				</el-table-column>
				<el-table-column
					prop="sectionCount"
					label="微课数量"
					width="80">
					
				</el-table-column>
				<el-table-column
					prop="teacher"
					label="课程讲师"
					width="120">
					
				</el-table-column>
				<el-table-column
					prop=""
					label="状态"
					width="80">
					<template slot-scope = "scope">
						{{scope.row.published ? '已发布' : '未发布'}}
					</template>
				</el-table-column>
				<el-table-column
					label="查看人数"
					width="80">
					<template slot-scope="scope">
						<router-link v-if="scope.row.published" class="link" :to="{ path: '/resource/net/user', query: {clazzId: clazzId, id:scope.row.id} }">{{scope.row.userCount}}</router-link>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column
				    label="操作"
				    width="80">
				    <template slot-scope="scope" >
						<el-button v-if="!scope.row.published" type="text" @click.native="handleDel(scope.$index, scope.row)">移除</el-button> 
						<span v-else>--</span>
				    </template>
			    </el-table-column>
			</el-table>
			<p class="page-sum">共{{totalElements}}条 每页20条</p>

			<!-- 分页 -->
			<div class="pagination">
		      	<el-pagination
		        	@current-change ="handleCurrentChange"
		        	:current-page="cur_page"
		        	layout="prev, pager, next"
		        	:page-size ="20"
		        	:total="totalElements">
		      	</el-pagination>
		    </div>
		</section>

		<!-- 规则设置 -->
	    <rules
	    	:dialogRules.sync="rulesFlag"
	    	:clazzId="clazzId"
	    	:curIndexn = '1'
	    	@updateNetRules="getRules()"></rules>
		
		<!-- 必修课剩余不足 -->
		<overLimitPop 
			:overLimitDialog.sync = "overLimit" 
			:text = "'您所属机构的网络课程添加数量已达上限，无法继续添加'" 
			:footerText = "'添加更多课程'" 
			:param="'onlineCompulsory'"></overLimitPop>
	</div>
</template>
<script>
	import Net from 'model/resource/net'
	import Empty from 'base/empty/empty'
	import Rules from 'components/clazz/learncase/rules'  //配置规则

	import { delTip } from '@/global/open'
	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'
	import { getCurRole } from '@/filters/userVerify'

	import overLimitPop from "@/base/overLimitPop/index"

	export default {
		data() {
			return {
				items: [],		// 列表数据
				onlineInfo: {},		// 网络课程相关
				cur_page: 1,
				totalElements: 0,
				pagesize: 20,
				
				tip: '点击添加必修课',
				btntext: '添加必修课',
				setRulesFlag: false,		// 配置规则
				emptyFlag: false,		// 内容是否为空
				loading: true,

				rulesFlag: false,	// 规则配置弹出框
				rulesData: {},	//规则配置
				setRulesFlag: false,	// 是否第一次设置
				stepActive: 0,    //进度条控制

				obligatoryFlag:false,  //必须课显隐flag

				rulesSeted:false, //已设置规则显示改类名
				rules:true, //一直显示该类名

				stepComplete: true,   //步骤完成
				anmistepComplete:false, //动画收起step
				videoTutorial:"http://www.shixunbao.cn/help/index.html#/help/details?type=MANAGER&columnId=18&id=69",  //视频教程地址

				vipInfo: {},
				overLimit : false,
				leaveCourse: "",
				hasChooseData : false,
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			},
			role() {
 				return getCurRole();
 			}
		},
		beforeMount() {
			this.getRules();
		},
		mounted() {
			
			this.getList();		// 全部已选必修课
			this.getOnlineInfo();	// 已选课程相关信息
		},
		methods: {
			
			handleCurrentChange (val) {
				// console.log("cur_page", val);
				this.cur_page = val;
				this.getList(val);
			},
			getRules() {
				let data = {
					clazzId: this.clazzId
				}
				Net.getOnlineSet(data, (res=> {
					// console.log("rules" ,res);
					if(res.status == 200) {
						this.rulesData = res.data;

						//步骤控制
						if(this.rulesData.step<99){
							this.stepComplete = false;
							this.stepActive = Number(this.rulesData.step)-1;
							// if()
						}else{
							this.stepComplete=true;
						}

						if(this.rulesData.endDate) {
							this.setRulesFlag = false;
							this.obligatoryFlag = true;
							this.rulesSeted = this.obligatoryFlag;
						} else {
							this.setRulesFlag = true;
							this.obligatoryFlag = false;
							this.stepActive = 0;
						}
						this.hasChooseData = res.data.schoolStageSubjectVolist.some((item)=>{return item.isSelect === true});
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			getOnlineInfo() {
				let data = {
					clazzId: this.clazzId
				}

				Net.getOnlineRequireInfo(data, (res => {
					// console.log("已选课程相关信息", res);
					if(res.status == 200) {
						console.log(res.data)
						this.onlineInfo = res.data;
						this.vipInfo = this.$store.getters.getOrgVipInfo;
						if(this.vipInfo.onlineCourseCount > this.onlineInfo.courseCount){
							this.leaveCourse = this.vipInfo.onlineCourseCount - this.onlineInfo.courseCount;
						}else{
							this.leaveCourse = 0; 
						}
						
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			getList(val) {
				let data = {
					clazzId: this.clazzId,
					number: val || this.cur_page,
					size: this.pagesize
				}

				// console.log("data====", data);

				Net.getOnlineRequire(data, (res => {
					// console.log("已选全部必修课", res)
					if(res.status == 200) {
						this.items = res.data.content;
						this.totalElements = res.data.totalElements;
						if(res.data.content.length > 0) {
							this.emptyFlag = false;
						} else {
							this.emptyFlag = true;
						}
						this.loading = false;
						this.getOnlineInfo();
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
				}));
			},
			exportList() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.onlineAllRequireExp+"?clazzId="+this.clazzId+"&token="+getToken());
			},
			handleDel(index, row) {
				let data = {
					clazzId: this.clazzId,
					onlineCourseId: row.id
				} 
				Net.postOnlineRemove(data, (res => {
					// console.log("移除课程=== ",res);
					if(res.status == 200) {
						this.items.splice(index, 1);
						if(this.items.length == 0) {
							let val = this.cur_page -1;
							this.cur_page = val;
							this.getList(val);
						} else {
							this.getList();
						}
						
						this.getOnlineInfo();
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 添加必修课
			addNet() {
				if(!(this.vipInfo.onlineCourseCount>this.onlineInfo.courseCount)||this.vipInfo.onlineCourseCount == 0){
					this.overLimit = true;
					return
				}
				this.$router.push({
					path: '/resource/net/require',
					query: {
						clazzId: this.clazzId
					}
				})
			},
			handleIssue() {
				let data = {
					clazzId: this.clazzId
				}

				Net.postOnlinePublic(data, (res => {
					// console.log("发布必修课", res)
					if(res.status == 200) {
						this.$message({
			              	type: 'success',
			              	message: '发布成功',
			              	duration: 1000
			            });
						this.getList();
						this.hideStep(); //隐藏滚动条
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			hideStep(){
				Net.getOnlineSet({clazzId: this.clazzId}, (res=> {
					if(res.status == 200) {
						this.rulesData = res.data;

						//步骤控制
						if(this.rulesData.step<99){
							this.stepActive = Number(this.rulesData.step)-1
						}else{
							this.stepActive = 3;
							this.anmistepComplete=true;
						}
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			issueBox(stri) {
				let str = '';
				if(stri == 'publish') {
					str = '发布后学员将看到网络课程，且已添加的必修课程不能删除，请确认无误后再发布！';
				} else {
					str = '点击更新后，新添加的未发布课程将会发布，发布后将无法移除！';
				}
				 

				this.$confirm(str, '提示', {
					confirmButtonText: '确定',
          			cancelButtonText: '我在想想',
          			type: 'warning'
				}).then(()=> {
					// 执行确定发布
					this.handleIssue();
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消发布'
					});
				});
			},

			viewCourse(scope) {
				window.open("#/resourse/previewCourse?clazzId="+this.clazzId+"&courseId="+scope.row.id);
			},
			toAccountCenter(){
				this.$router.push({path: "/orgAccount/index",query:{clazzId: this.clazzId}})
			},
		},
		components: {
			Empty,
			Rules,
			overLimitPop,
		}
	}
</script>
<style scoped lang="less">
@import "../../../assets/less/icon.less";
@import "../../../assets/less/btn-search.less";
@import "../../../assets/reset-element-ui/user-table.css";
.wNetClazz {
	margin-top: 15px;
}
.round-layout {
	border-radius: 0 6px 6px 6px;
}
.tab-link {
	position: relative;
	z-index: 10;
	top: 1px;
	left: 1px;
	width: 244px;
	height: 41px;
	background-color: #EEF1F6;
	border-radius: 6px 6px 0 0;
	font-size: 16px;
	box-shadow: -2px 0 3px #f0f0f0, 2px 0 3px #f0f0f0, 0 -2px 3px #f0f0f0, 0 2px 3px #fff;
	
	
	a {
		float: left;
		display: inline-block;
		height: 41px;
		line-height: 40px;
		text-align: center;
		width: 122px;
		color: #8E9BAE;
		background-color: #EEF1F6;
		&:first-child {
			border-radius: 6px 0 0 0;
		}
		&:last-child {
			border-radius: 0 6px 0 0;
		}
		i {
			display: inline-block;
			vertical-align: middle;

		}
		.icon-course-res2 {
			width: 16px;
			height: 15px;
			background: url("../../../assets/img/icon/icon-course-res2.png") 0 0 no-repeat;
		}
		.icon-course-net {
			width: 19px;
			height: 13px;
			background: url("../../../assets/img/icon/icon-course-net.png") 0 0 no-repeat;
		}

		&.active {
			color: #1077D7;
			background-color: #fff;
		}
	}
		
}

.wempty {
	padding-left: 20px;
	padding-right: 20px;
	margin-bottom: 20px;
}
.wres {
	padding: 0 20px;
}
.rules {
	display: block;
	position: relative;
	margin-bottom: 25px;
	// height: 77px;
	text-align: center;
	font-size: 16px;
	color: #333333;
	letter-spacing: 0;
	// padding-top: 25px;
	padding-bottom: 25px;
	// border-bottom: 1px solid #ebebeb;
	.view {
		color: #1077D7;
		cursor: pointer;
	}
	span {
		font-size: 16px;
		color: #333333;
		margin-left: 15px;
	}
	.rules-set,
	.rules-edit {
		display: inline-block;
		// margin-top: -25px;
     	margin-left: 20px;
		font-size: 16px;
		color: #FD7E23;
		line-height: normal;
		cursor: pointer;
		> i {
			margin-right: 0;
			vertical-align: text-bottom;
		}
	}
}
.rulesSeted{
	background: #F3FBFF;
	height: 80px;
	line-height: 80px;
	width: 109%;
    margin-left: -20px;
    max-width: 1188px;
}
.title {
	float: left;
	width: 560px;
	position: relative;
    font-size: 20px;
    line-height: 22px;
    color: #000000;
    letter-spacing: 0;
    padding-left: 10px;
	.attention{
		cursor: pointer;
		color: #FD7E23;
		margin-left: 20px;
	}
    &:before {
    	content: "";
	    width: 3px;
	    height: 22px;
	    background-color: #35A69D;
	    position: absolute;
	    left: 0;
    }

    > span {
    	font-size: 16px;
		color: #999999;
    }
}
.handle {
	margin-bottom: 25px;
	
	>button {
		float: right;
		display: inline-block;
		font-size: 16px;
		color: #FFFFFF;
		padding: 10px 15px;
		margin-left: 10px;
		border-radius: 4px;

		>i {
			vertical-align: middle;
		}
	}
	.btn-blue-line {
		color: #1077D7;
		padding: 9px 15px;
	}
	.btn-green-line {
		color: #319C95;
		padding: 9px 15px;
		position: relative;
		&::after{
			position: absolute;
			right: -10px;
			top: -10px;
			width: 27px;
			height: 15px;
			content: "";
			background: url("../../../assets/img/expert/vipLogo.png") center center no-repeat;
			background-size: 27px 14px;
		}
	}
}
.page-sum {
	font-size: 14px;
	color: #666;
	text-align: right;
	padding-top: 15px;
}
.el-steps{
	margin: 30px auto;
}
.emptyStateImg{
	width: 120px;
	height: 140px;
	margin: 0 auto;
	margin-top: 80px;
}
.emptyStateText{
	margin-top: 20px;
	margin-bottom: 16px;
	text-align: center;
	font-size: 16px;
	color: #999999;
}
.toSetRule{
	border-color: #99C0E4;
	color: #3F99F6;
	background: #FFFFFF;
}
.stepHide{
	animation: stephide .5s ease-in .5s forwards;
	-webkit-animation:stephide .5s ease-in .5s forwards;
	// animation-fill-mode:forwards;
	// -webkit-animation-fill-mode:forwards;
	overflow: hidden;
}
@keyframes stephide {
	0% {opacity: .8;height:70px;}
	25% {opacity: .4;height:50px;}
	50% {opacity: .2;height:30px;margin: 20px auto;}
	75% {opacity: 0;height:10px;margin: 10px auto;}
	100%{opacity: 0;height:0;display: none;margin: 0px auto;}
}
.btnAddrES{
	&::after{
		width: 0;
		height: 0;
	}
}
</style>

<style lang="less">
	.wNetClazz{
		.el-steps{
			font-weight:normal !important;
		}
		.el-step__head.is-success{
			color: #ffffff !important;
			border-color: #EFEFEF;
			.el-step__icon.is-text{
				background:#EFEFEF;
				color: #63A3EE !important;
			}
		}
		.el-step__head.is-process{
			.el-step__icon.is-text{
				background: #67B6FF;
				color: #ffffff;
			}
		}
		.el-step__title.is-wait{
			color: #999999;
		}
		.el-step__head.is-success{
			.el-step__line{
				background-color: #EFEFEF;
			}
		}
		.el-step__title.is-success,.el-step__title.is-process{
			font-weight:normal;
			color: #1279D8;
		}
		.el-step__icon.is-text{
			background: #E8E8E8;
			border: 0 none;
			font-size: 20px;
			color: #999999;
			width: 40px;
			height: 40px;
			line-height:40px;
		}
		.el-step.is-horizontal .el-step__line{
			top: 20px;
		}
	}
	.videoTutorial{
		font-size: 16px;
		color: #3F99F6;
		float: right;
		margin-right: 30px;
		margin-top: 10px;
	}
	.el-table{
		.cursorName{
			cursor: pointer;
			color: #1077D7;
		}
	}
</style>
