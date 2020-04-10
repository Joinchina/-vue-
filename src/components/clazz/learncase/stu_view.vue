<template>
	<div class="stu-view">
		<el-dialog
			class="dialog-form"
			width="766px"
			title="查看个人详情"
			:visible.sync="dialogStu"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open"
			>

			<div class="clearfix stun-msg-wap">
				<section class="stu-msg">
					<img v-if="avatar" :src="avatar" alt="">
					<img v-else src="../../../assets/img/activity/example2.png" alt="">
					<span class="name">{{name}}</span>
				</section>

				<section class="bar-wrapper">
					<div class="circle-wrapper">
						<progress-circle :radius="160" :percent="finishRate"></progress-circle>
						<div class="note">

							<!--面授平均任务完成率-->
							<p class="rate" v-if="!onlineCouse.avgFinishRate">
								{{(finishRate*100).toFixed(2)}}%
							</p>

							<!--网课、面授平均任务完成率-->
							<p class="rate" v-else>
								{{(onlineCouse.avgFinishRate*100).toFixed(2)}}%
							</p>

							<!-- <p class="rank">第{{rank}}名</p> -->
						</div>
					</div>
					<p class="tip">任务完成率</p>
				</section>
				<section class="left stu-rg">
					第<span>{{rank}}</span>名
				</section>
			</div>

			<section class="stu-details clearfix">
				<header class="header" v-if="onlineCouse.onlineCourseItem">
					面授任务完成率 
					<span class="blue">{{(finishRate*100).toFixed(2)}}%</span>
				</header>

				<div class="round-layout task" v-if="taskItem.length > 0">
					<h3>活动：<span>{{taskRate}}</span></h3>
					<ul class="inline clearfix">
						<li v-for="item in taskItem">
							{{item.itemName}}：<span class="com">{{item.finishCount}}/</span>
							<span>{{item.totalCount}}</span>
						</li>
						<!-- <li>评价：6/<span>10</span></li>
						<li>反思：6/<span>10</span></li>
						<li>投票：6/<span>10</span></li>
						<li>问卷：6/<span>10</span></li> -->
					</ul>
				</div>

				<div class="clearfix">
					<div class="left round-layout" v-if="resItem.length > 0">
						<h3>资源：<span>{{resRate}}</span></h3>
						<ul>
							<template v-for="item in resItem">
								<li v-if="item.itemType == 'RESOURCE_VIEW'">查看数量：
									<span class="com">{{item.finishCount}}/</span>
									<span>{{item.totalCount}}</span>
								</li>
								<li v-if="item.itemType == 'RESOURCE_LEARN'">学习时长：
									<span class="com">{{item.finishCountDate}}/</span>
									<span>{{item.totalCount/3600}}时</span>
								</li>
							</template>

						</ul>
					</div>
					<div class="left round-layout" v-if="otherItem.length > 0">
						<h3>其他：<span>{{otherRate}}</span></h3>
						<ul>
							<template v-for="item in otherItem">
								<li v-if="item.itemType== 'SIGN'">{{item.itemName}}：
									<span class="com">{{item.finishCount}}/</span>
									<span>{{item.totalCount}}</span>
								</li>
							</template>
							
						</ul>
					</div>
				</div>

				
				<div  v-if="onlineCouse.onlineCourseItem">

					<header class="header">
						网课学习完成率<span class="j-red ml8">{{(onlineCouse.onlineCourseItem.finishRate*100).toFixed(2) + "%"}}</span>
					</header>

					<div style="margin:30px;" class="round-layout round-nopade">
						<table width="100%" border="0" class="j-table" cellspacing="0">
							<tr>
								<td width="15%">必修课程：</td>
								<td  width="17%">{{onlineCouse.onlineCourseItem.requiredCourseCount}}门</td>
								<td  width="25%">必修最低学时要求：</td>
								<td  width="17%">{{onlineCouse.onlineCourseItem.minRequiredCourseLearnTime}}学时</td>
								<td  width="15%">必修已学：</td>
								<td><span class="j-red">{{onlineCouse.onlineCourseItem.learnedRequiredCourseTime}}</span>学时</td>
							</tr>
							<tr v-if="onlineCouse.onlineCourseItem.minOptionalCourseLearnTime > 0">
								<td>选修课程：</td>
								<td>{{onlineCouse.onlineCourseItem.optionalCourseCount}}门</td>
								<td>选修最低学时要求：</td>
								<td>{{onlineCouse.onlineCourseItem.minOptionalCourseLearnTime}}学时</td>
								<td>选修已学：</td>
								<td><span class="j-red">{{onlineCouse.onlineCourseItem.learnedOptionalCourseTime}}</span>学时</td>
							</tr>
						</table>

					</div>
				</div>

			</section>

			
		</el-dialog>
	</div>
</template>
<script>
	import model from 'model/clazz/learncase'
	import progressCircle from 'base/progress/progress_circle'
	export default {
		data() {
			return {
				finishRate: 0,	//任务完成率
				rank: 0,   //排名
				name: '',	// 姓名
				avatar: '',		//头像
				items: [],	//个人学情总数组
				taskItem: [],	//学习任务数组
				taskRate: 0,	//学习任务率
				resItem: [],	// 学习资源数组
				resRate: 0,		// 资源学习率
				otherItem: [],		//其他任务数组
				otherRate: 0,		// 其他任务率

				//网课任务
				onlineCouse:{}
			}
		},

		props: ['dialogStu', 'stuId', 'clazzId'],
		methods: {
			open() {
				this.finishRate = 0;
				this.taskItem = [];
				this.resItem = [];
				this.otherItem = [];
				this.getData();
			},
			close(done) {
				 // done();
				 this.$emit('update:dialogStu', false);
				 

			},
			getData() {
				let data = {
					clazzId: this.clazzId,
					userId: this.stuId
				}
				model.clazzLearnOne(data, (res => {
					console.log("获取个人学情", res);
					if(res.status == 200) {
						this.finishRate = res.data.finishRate;
						this.rank = res.data.rank;
						this.name = res.data.name;
						this.avatar = res.data.avatar || '';
						this.items = res.data.items;

						this.formatItems(this.items);

						//网课学习完成率
						this.onlineCouse = res.data;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 重组数据
			formatItems(items) {
				items.map(item => {
					if(item.itemType == 'HOMEWORK' || item.itemType == 'EVALUATION' || item.itemType == 'INTROSPECTION' || item.itemType == 'VOTE' || item.itemType == 'QUESTIONNAIRE' || item.itemType == 'LEARNING_LOG'|| item.itemType == 'REVIEWHOMEWORK') {
						this.taskItem.push(item);
					}

					if(item.itemType == 'RESOURCE_VIEW' || item.itemType == "RESOURCE_LEARN") {
						this.resItem.push(item);
					}

					if(item.itemType == 'SIGN') {
						this.otherItem.push(item);
					}
				});
				// 计算平均率
				if(this.taskItem.length > 0) {
					this.taskRate = (this.itemRate(this.taskItem)*100).toFixed(2)+'%';
				}
				if(this.resItem.length > 0) {
					this.resRate = (this.itemRate(this.resItem)*100).toFixed(2)+'%';
				}
				if(this.otherItem.length > 0) {
					this.otherRate = (this.itemRate(this.otherItem)*100).toFixed(2)+'%';
				}
				
				console.log("taskItem", this.taskRate);
				console.log("resItem", this.resRate);
				console.log("otherItem", this.otherRate);

			},

			// 平均率
			itemRate(items) {
				let sum = 0;
				let len = items.length;

				items.map(item => {
					let rate = item.finishCount / item.totalCount;
					if(rate > 1) {
						rate = 1;
					} 
					console.log("rate ====", rate);
					sum += rate;
				});
				let result = sum/len;
				return result;
				
			},

		},
		components: {
			progressCircle
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/reset-element-ui/form.css";
	
	.stun-msg-wap{
		width: 80%;
		margin:30px auto 0 auto;
	}
	.stu-msg {
		float: left;
		padding-left: 10px; 
		line-height: 155px;
		width: 35%;
		img {
			display: inline-block;
			width: 65px;
			height: 65px;
			border-radius: 45px;
			border: 2px solid #FFFFFF;
			box-shadow: 0 2px 20px 2px rgba(0,0,0,0.11);
			margin-right: 10px;
		}
		.name {
			font-size: 20px;
			color: #333333;
			letter-spacing: 0;
			line-height: 20px;
		}
	}
	.stu-rg{
		float: left;
		line-height: 155px;
		margin-left: 50px;
		font-size: 22px;
		span{
			color: #04908A;
		}
	}
	.bar-wrapper {
		float: left;
		text-align: center;
		margin-bottom: 30px;
		.circle-wrapper {

			background: #F6F6F6;
		    width: 200px;
		    height: 200px;
		    margin: 0 auto;
		    margin-top: -30px;
		    padding: 20px;
		    border-radius: 100px;
		}
		.note {
			position: relative;
			margin-top: -110px;

		}
		.rate {
			font-size: 30px;
			color: #04908A;
			letter-spacing: 0;
			line-height: 65px;
			margin-bottom: 14px;
		}
		.rank {
			font-size: 16px;
			color: #333333;
			letter-spacing: 0;
			line-height: 16px;
		}
		.tip {
			font-size: 20px;
			color: #333333;
			letter-spacing: 0;
			line-height: 20px;
			margin-top: 7px;
		}
	}
	.stu-details {
		padding-left: 40px;
		.header{
			padding:30px 0;
			font-size: 22px;
			text-align: center;
			.blue{
				font-size: 24px;
				color:#1077D7;
				padding-left: 10px;
			}
		}

		.left {
			width: 50%;
			margin-right: 17px;
			&:last-child {
				width : calc(~"50% - 17px");
				margin-right: 0;
			}
		}
		// .right {
		// 	width: 50%;
		// }
		.round-nopade{
			margin: 0!important;
			padding:0 35px;
			height: auto!important;
		}
		.round-layout {
			height: 189px;
			margin-bottom: 15px;
			.com{
				color: #1077D7
			}
			.j-table{
				height: 40px;
				line-height: 40px;
				margin: 30px auto;
				font-size: 16px;

			}
			&.task {
				height: auto;
			}
			h3 {
				font-size: 20px;
				color: #333333;
				letter-spacing: 0;
				line-height: 20px;
				text-align: center;
				margin-top: 30px;

				span {
					font-size: 24px;
					color: #009791;
				}

			}

			>ul {
				box-sizing: border-box;
				padding: 30px 35px;
				li {
					font-size: 16px;
					color: #333333;
					letter-spacing: 0;
					line-height: 38px;

					span {
						color: #999;
					}
				}
			}

			.inline {
				
				>li {
					float: left;
					margin-right: 59px;
				}
			}

		}
		.j-red{
			color: #FD7E23!important;
		}
	}
</style>