<template>
	<div class="creport" v-if="items.clazzId">
		<section class="handle clearfix">
		
			<Goback passtitle="课程报告" path="/report/menu" :query="query"></Goback>
			<p class="right">
				<span class="tip">注：实时数据，集中培训结束30天后数据停止更新</span>
				<span class="btn-gray" v-show = "!reportBtnFlag">
					报告生成中......
				</span>
				<button class="btn-green" type="button" v-show="reportBtnFlag"  @click="exportCourse">
					<i class="icon-export-white"></i>
					导出
				</button>
			</p>
		</section>
		<h2 class="title">{{items.courseName}}</h2>
		
		<section class="wcont round-layout">
			<ul class="desc">
				<li>
					<span>&bull; 主讲人：{{items.mainTeacherName}}</span> 
					<span>职务职称：{{items.mainTeacherTitle}}</span> 
					<span>单位：{{items.mainTeacherWorkPlace}}</span>
				</li>
				<li>
					<span v-if="items.type=='SINGLE'">&bull; 上课时间：{{items.courseDate}} {{items.beginTime}} - {{items.endTime}}</span> 
					<span v-else-if="items.type=='LIVE'">&bull; 上课时间：{{items.courseDate}} {{items.beginTime}} - {{items.endTime}}</span> 
					<span v-else-if="items.type == 'MULTI'">&bull; 上课时间：{{items.courseDate}} - {{items.endDate}}</span> 
					<span v-if="!!items.location">&bull; 上课地点：{{items.location}}</span>
				</li>
			</ul>
		</section>
		<section class="wcont round-layout satisfied">
			<h3 class="sub-tit">课程满意度：</h3>
			<p class="total-num">参评人数：{{satisfied.submitCount?satisfied.submitCount:0}}人</p>
			<ul class="satisfied-list clearfix">
				<li>
					<p>非常满意</p>
					<progress-circle class="circle" barColor="#F77064" bgColor="#F6F9FF" :radius="120" :percent="rateVerySatisfied"></progress-circle>
					<p class="num"><span class="orange">{{satisfied.verySatisfied?satisfied.verySatisfied:0}}</span>人</p>
				</li>
				<li>
					<p>满意</p>
					<progress-circle class="circle" barColor="#4AC9AA" bgColor="#F6F9FF" :radius="120" :percent="rateSatisfied"></progress-circle>
					<p class="num"><span class="green">{{satisfied.satisfied?satisfied.satisfied:0}}</span>人</p>
				</li>
				<li>
					<p>一般</p>
					<progress-circle class="circle" barColor="#7A73CC" bgColor="#F6F9FF" :radius="120" :percent="rateOrdinary"></progress-circle>
					<p class="num"><span class="purple">{{satisfied.ordinary?satisfied.ordinary:0}}</span>人</p>
				</li>
				<li>
					<p>不满意</p>
					<progress-circle class="circle" barColor="#FAD961" bgColor="#F6F9FF" :radius="120" :percent="ratenotSatisfied"></progress-circle>
					<p class="num"><span class="yellow">{{satisfied.notSatisfied?satisfied.notSatisfied:0}}</span>人</p>
				</li>
			</ul>
		</section>

		<section class="wcont round-layout training">
			<h3 class="sub-tit">参训情况：</h3>
			<ul class="train-num clearfix">
				<li>
					<p>应到人数</p>
					<span>{{items.studentCount || 0}}</span>
				</li>
				<li>
					<p>实到人数</p>
					<span>{{items.signUserCount || 0}}</span>
				</li>
				<li>
					<p>到课率</p>
					<span>{{items.studentCount ? ((items.signUserCount/items.studentCount)*100).toFixed(2) : 0}}%</span>
				</li>
			</ul>
			<dl class="train-case clearfix" v-if="absenteeismUsers.length > 0 && attendance > 60">
				<dt>缺勤：</dt>
				<dd>
					<span v-for="item1 in absenteeismUsers">
						<template v-if="!!item1.workPlace">
							{{item1.workPlace}} -
						</template>
					{{item1.name}}</span>
					<!-- <span>北京理工大学-王丽</span><span>北京理工大学-王丽</span><span>北京理工大学-王丽</span><span>北京理工大学-王丽</span><span>北京理工大学-王丽</span><span>北京理工大学-王丽</span> -->
				</dd>
			</dl>
			<dl class="train-case clearfix" v-if="absenceUsers.length > 0">
				<dt>请假：</dt>
				<dd>
					<span v-for="item2 in absenceUsers">
						<template v-if="!!item2.workPlace">
							{{item2.workPlace}} -
						</template>
					{{item2.name}}</span>
					<!-- <span>北京理工大学-王丽</span><span>北京理工大学-王丽</span><span>北京理工大学-王丽</span><span>北京理工大学-王丽</span><span>北京理工大学-王丽</span><span>北京理工大学-王丽</span> -->
				</dd>
			</dl>
			<dl class="train-case clearfix" v-if="cheatUsers.length > 0">
				<dt>作弊：</dt>
				<dd>
					<span v-for="item3 in cheatUsers">
						<template v-if="!!item3.workPlace">
							{{item3.workPlace}} -
						</template>
					{{item3.name}}</span>
					<!-- <span>北京理工大学-王丽</span><span>北京理工大学-王丽</span><span>北京理工大学-王丽</span><span>北京理工大学-王丽</span><span>北京理工大学-王丽</span><span>北京理工大学-王丽</span> -->
				</dd>
			</dl>
		</section>

		<section class="wcont round-layout train-summary">
			<h3 class="sub-tit">培训情况：</h3>
			<p class="remark">{{items.mainTeacherName}}的{{items.courseName}}教学研讨课程，培训现场课堂气氛活跃，讲师认真负责，学员表现良好。</p>
			<div class="impression">
				<ul class="tabnav clearfix">
					<li v-for="(item,index) in tabs"
						:class="{active:index == nowIndex}"
						@click="toggleTabs(index)">
						{{item}}
					</li>
				</ul>
				<div class="tabCont">
					<div v-show="nowIndex == 0">
						<template v-if="leaveMessages.length > 0">
							<dl class="note clearfix" v-for="item4 in leaveMessages">
								<dt>{{item4.split("：")[0]}}：</dt>
								<dd>{{item4.split("：")[1]}}</dd>
							</dl>
							<!-- <dl class="note clearfix">
								<dt>王思聪：</dt>
								<dd>我觉得课堂的氛围很好，不错！</dd>
							</dl>
							<dl class="note clearfix">
								<dt>王思聪：</dt>
								<dd>我觉得课堂的氛围很好，不错！</dd>
							</dl> -->
						</template>
						<p class="notext" v-else>
							<i class="icon-tanhao"></i>
							暂时没有学员留言哦～
						</p>
					</div>
					<div v-show="nowIndex == 1">
						<template v-if="introspection.length > 0">
							<dl class="note clearfix" v-for="item5 in introspection">
								<dt>{{item5.split("：")[0]}}：</dt>
								<dd>{{item5.split("：")[1]}}</dd>
							</dl>
							<!-- <dl class="note clearfix">
								<dt>王思聪：</dt>
								<dd>我觉得课堂的氛围很好，不错！</dd>
							</dl>
							<dl class="note clearfix">
								<dt>王思聪：</dt>
								<dd>我觉得课堂的氛围很好，不错！</dd>
							</dl> -->
						</template>
						<p class="notext" v-else>
							<i class="icon-tanhao"></i>
							暂时没有学员反思哦～
						</p>
						
					</div>
				</div>
			</div>
		</section>
	</div>
</template>
<script>
	import progressCircle from 'base/progress/progress_circle'
	import course from 'model/report/course'
	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'

	import Goback from 'base/goback/goback'

	export default {
		data() {
			return {
				chartArray:{},     // 导出echarts 数组
		        reportBtnFlag:false,	// 导出报告生成中
        		reportBtnSeconds:5,
        		formObj:{
        		 	method:"post",
        		 	data:{},
        		 	urls:"",
        		},
        		tabs: ['学员留言', '学员反思'],
        		nowIndex: 0,

        		items: {},		//课程报告
        		satisfied: {},	// 课程满意度
        		absenteeismUsers: [],	// 缺勤列表
        		absenceUsers: [],	// 请假列表
        		cheatUsers: [],		// 作弊列表
        		leaveMessages: [],		// 学员留言列表
        		introspection: [],		// 学员反思

        		query: {}

			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			},
			courseId() {
				return this.$route.query.courseId;
			},
			rateVerySatisfied() {
				return this.satisfied.submitCount ? this.satisfied.verySatisfied/this.satisfied.submitCount : 0;
			},
			rateSatisfied () {
				return this.satisfied.submitCount ? this.satisfied.satisfied/this.satisfied.submitCount : 0
			},
			rateOrdinary () {
				return this.satisfied.submitCount ? this.satisfied.ordinary/this.satisfied.submitCount : 0
			},
			ratenotSatisfied () {
				return this.satisfied.submitCount ? this.satisfied.notSatisfied/this.satisfied.submitCount : 0
			},
			attendance () {
				return this.items.studentCount ? ((this.items.signUserCount/this.items.studentCount)*100).toFixed(2) : 0;
			}
		},
		mounted() {
			if(this.courseId) {
				this.getCourseReport();
				this.reportShow();
			}
			this.query = {
				clazzId: this.clazzId
			}
		},
		methods: {
			exportCourse () {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.reportCourseExp+"?clazzId="+this.clazzId+"&token="+getToken());
			},
			toggleTabs(index) {
				this.nowIndex=index;
			},
			reportShow() {
				if(this.reportBtnSeconds <= 0) {
					this.reportBtnFlag = true;
				} else {
					this.reportBtnSeconds--;
					setTimeout(()=> {
						this.reportShow();
					}, 1000);
				}
			},
			getCourseReport() {
				document.body.scrollTop = 0;
        		document.documentElement.scrollTop = 0;

				let data = {
					courseId: this.courseId
				}
				course.getCourseData(data, (res => {
					//console.log("课程报告", res);
					if(res.status == 200) {
						this.items = res.data;

						if(res.data.satisfied){

							this.satisfied = res.data.satisfied;
						}
						
						this.absenteeismUsers = res.data.absenteeismUsers || [];  // 缺勤
						this.absenceUsers = res.data.absenceUsers || [];			// 请假
						this.cheatUsers = res.data.cheatUsers || [];				// 作弊
						this.leaveMessages = res.data.leaveMessages || [];		// 留言
						this.introspection = res.data.introspection || [];		// 反思

						//console.log("作弊列表", this.cheatUsers);
					} else {
						this.$message.error(res.message);
					}
				}))
			},
		},
		components: {
			progressCircle,
			Goback
		},
		watch: {
			'$route': 'getCourseReport'
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	@import "../../../assets/less/btn-search.less";
	@import "../../../assets/less/report.less";
	.desc {
		li {
			font-size: 14px;
			color: #666666;
			line-height: 2em;
			>span {
				display: inline-block;
				margin-right: 45px;
			}
		}
	}
	.satisfied {
		.total-num {
			text-align: right;
			font-size: 20px;
			color: #009791;
			margin-top: -30px;
		}
		.satisfied-list {
			margin-top: 50px;
			width: 100%;
			li {
				position: relative;
				box-sizing: border-box;
				width: 25%;
				float: left;
				border-right: 1px solid #DFE8F2;
				text-align: center;
				font-size: 18px;
				color: #333333;
				&:last-child {
					border-right: 0;
				}
			}
			.circle {

				margin-top: 10px;
				margin-bottom: 20px;
			}
			.num {
				
				position: absolute;
				left: 50%;
			    top: 50%;
			    transform: translate(-50%, -50%);
			}
			.orange,
			.green,
			.purple,
			.yellow {
				font-size: 24px;
				line-height: 1em;
			}
			.orange {
				color: #F77064;
			} 
			.green {
				color: #4AC9AA;
			}
			.purple {
				color: #7A73CC;
			}
			.yellow {
				color: #FAD961;
			}
		}
	}
	.training {
		
		.train-num {
			margin-top: 40px;
			margin-bottom: 40px;
			li {
				float: left;
				width: 33%;
				text-align: center;
				border-right: 1px solid #dcdcdc;
				&:last-child {
					border-right: 0;
				}
				>p {
					font-size: 18px;
					line-height: 18px;
					color: #666666;
					margin-bottom: 22px;
				}
				>span {
					font-size: 38px;
					color: #333333;
					line-height: 38px;
				}
			}
		}
		.train-case {
			position: relative;
			height: auto;
			padding: 0 50px;
			dt,dd {
				font-size: 16px;
				color: #333333;
				line-height: 2em;
				margin: 0;
				padding: 0;
			}
			dt {
				float: left;
				width: 50px;
			}
			dd {
				width: 693px;
				float: left;
				>span {
					display: inline-block;
					margin-right: 30px;
				}
			}
		}
	}
	.train-summary {
		.remark {
			box-sizing: border-box;
			margin-top: 40px;
			margin-bottom: 18px;
			padding: 10px 35px;
			width: 100%;
			background: #F4F5F9;
			border: 1px solid rgba(234,234,234,0.71);
			border-radius: 1px;

			font-size: 16px;
			color: #333333;
			line-height: 1.5em;
		}

		.tabnav {
			li {
				position: relative;
				z-index: 1;
				width: 110px;
				height: 32px;
				line-height: 30px;
				float: left;
				font-size: 14px;
				color: #666666;
				text-align: center;

				background: #F5F5F5;
				border: 1px solid #E1E7E2;
				border-radius: 32px;
				&:last-child {
					margin-left: -25px;
				}
				&.active {
					z-index: 2;
					color: #FFFFFF;
					background: #35A69D;
					border: 1px solid #35A69D;
				}
			}
		}
		.tabCont {
			font-size: 14px;
			color: #151515;
			margin-top: 22px;
			padding-left: 15px;
			.notext {
				font-size: 14px;
				margin-bottom: 10px;
				color: #999;
			}
			.icon-tanhao {
				margin-right: 3px;
			    width: 15px;
			    height: 15px;
			    vertical-align: text-bottom;
			}
			.note {
				margin-bottom: 10px;
				dt,dd {
					line-height: 1.5em;
					display: inline;
				}
				dt {
					color: #009791;
				}
			}
		}
	}
</style>