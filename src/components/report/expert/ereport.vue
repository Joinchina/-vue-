<template>
	<div class="wexpert">
		<!-- 没有项目时 -->
	    <empty v-if="report.courseCount == 0"
	    tip="还没有创建过课程哦~"></empty>
	    <empty v-else-if="report.professorCount == 0"
	    tip="还没有创建专家哦~"></empty>
		<template v-else>
			<section class="handle clearfix">
				<Goback passtitle="专家报告" ></Goback>
				<p class="right">
					<span class="tip">注：实时数据，集中培训结束30天后数据停止更新</span>
					<button class="btn-green" type="button"  @click="expProfessor">
						<i class="icon-export-white"></i>
						导出
					</button>
				</p>
			</section>
			<h2 class="title">{{clazzName}}</h2>
			
			<section class="mb-25 round-layout">
				<ul class="wdigital clearfix">
					<li>
						<span>{{report.professorCount}}</span>
						<p>专家人数</p>
					</li>
					<li>
						<span>{{report.courseCount}}</span>
						<p>课程数量</p>
					</li>
					<li>
						<span>{{report.leaveMessageCount}}</span>
						<p>学员课程留言数</p>
					</li>
					<li>
						<span>{{report.activityCount}}</span>
						<p>课程活动数</p>
					</li>
					<li>
						<span>{{report.averageActivityAttendRate}}</span>
						<p>课程活动参与率</p>
					</li>
					<li>

						<span>{{report.averageProfessorSatisfied}}%</span>
						
						<p>专家平均满意度</p>
					</li>
				</ul>
			</section>

			<section class="wcont round-layout clearfix">
				<h3 class="sub-tit">专家满意度情况：</h3>
				<ul class="wdetails clearfix">
					<li v-for="item in courseItems" v-if="item.type != 'ELECTIVE'">
						<h4 class="name">{{item.mainTeacherName}}</h4>
						<div class="verygood"><span class="zindex">非常满意 <span class="big">{{item.verySatisfiedRate}}%</span></span></div>
						<div class="good"><span class="zindex">满意 <span class="big">{{item.satisfiedRate}}%</span></span></div>
						<p class="theme">课程主题：{{item.name}}</p>
					</li>

				</ul>
			</section>
		</template>
		
	</div>
</template>
<script>
	import Empty from 'base/empty/empty'
	import Expert from 'model/report/expert'

	import API from '@/global/resource'
	import { getToken } from '@/filters/userVerify'

	import Goback from 'base/goback/goback'
	
	export default {
		data() {
			return {
				report: {},
				courseItems: [],	
				tip: '还没有创建过课程哦~~',
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			},
			clazzName() {
				return this.$store.getters.showCurClazzName;
			}
		},
		mounted() {
			this.getProfessor();
		},
		methods: {
			getProfessor() {
				let data = {
					clazzId: this.clazzId
				}

				Expert.getProfessor(data, (res => {
					console.log("专家数据", res);
					if(res.status == 200) {
						this.report = res.data;
						this.courseItems = res.data.courseList || [];


					} else {
						this.$message.error(res.message);
					}
				}));
			},
			expProfessor() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.reportProfessorExp+"?clazzId="+this.clazzId+"&token="+getToken());
			}
		},
		components: {
			Empty,
			Goback
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	@import "../../../assets/less/btn-search.less";
	@import "../../../assets/less/report.less";

.wexpert {
	.mb-25 {
		margin-bottom: 25px;
	}
	.wdigital {
		width: 100%;
		padding: 45px 0;
		>li {
			box-sizing: border-box;
			width: 198px;
			float: left;
			border-right: 1px solid #dcdcdc;
			text-align: center;
			&:last-child {
				border-right: 0;
			}
			>span {
				font-size: 38px;
				color: #417505;
				letter-spacing: 0;
				line-height: 36px;
			}
			>p {
				font-size: 18px;
				color: #666666;
				letter-spacing: 0;
				line-height: 18px;
				margin-top: 10px;
			}
		}
	}
	.wdetails {
		width: 998px;
		margin: 50px auto;
		li {
			box-sizing: border-box;
			width: 314px;
			float: left;
			margin-right: 28px;
			margin-bottom: 20px;
			background: #F9F9F9;
			border-radius: 6px;
			text-align: center;
			cursor: pointer;
			&:nth-child(3n+0){
				margin-right: 0;
			}
			>span {
				display: block;
			}
			&:hover {
				background: #FFFFFF;
				box-shadow: 0 2px 65px 12px rgba(0,0,0,0.06);
				.zindex {
					background-color: #fff;
				}
			}
		}
		.name {
			font-size: 20px;
			color: #333333;
			letter-spacing: 0;
			line-height: 20px;
			height: 45px;
			overflow: hidden;
			margin-top: 25px;
		}
		.phone {
			font-size: 14px;
			color: #333333;
			letter-spacing: 0;
			line-height: 14px;
			margin-top: 18px;
		}
		.unit {
			font-size: 14px;
			color: #666666;
			letter-spacing: 0;
			line-height: 14px;
			margin-top: 8px;
		}
		.level {
			position: relative;
			margin-top: 12px;
			display: inline-block;
			font-size: 14px;
			color: #FFFFFF;
			letter-spacing: 0;
			line-height: 14px;
			padding: 2px 5px;
			background-color: #FD7E23;
			&:before {
				position: absolute;
				left: -10px;
				top: 0;
				content: "";
				width: 0;
				height: 0;
				border-top:9px dashed transparent;
				border-left: 5px dashed transparent;
				border-right: 5px solid #FD7E23;
				border-bottom: 9px solid #FD7E23;
			}
			&:after {
				position: absolute;
				right: -10px;
				top: 0;
				content: "";
				width: 0;
				height: 0;
				border-left: 5px solid #FD7E23;
				border-top: 9px solid #FD7E23;
				border-bottom:9px dashed transparent;
				border-right: 5px dashed transparent;
				
			}

		}
		.zindex {
			position: relative;
			z-index: 3;
			display: inline-block;
			background-color: #F9F9F9;
			padding: 0 10px;

		}
		.verygood {
			position: relative;
			z-index: 1;
			margin-top: 35px;
			font-size: 18px;
			color: #FD7E23;
			letter-spacing: 0;
			line-height: 18px;
			
			&:after {
				position: absolute;
				top: 10px;
				left: 20px;
				z-index: 1;
				content: "";
				width: 270px;
				border-top: 1px solid #F2F0F0;
			}
		}
		.good {
			position: relative;
			z-index: 1;
			margin-top: 18px;
			font-size: 18px;
			color: #4A90E2;
			letter-spacing: 0;
			line-height: 18px;

			&:after {
				position: absolute;
				top: 10px;
				left: 20px;
				z-index: 1;
				content: "";
				width: 270px;
				border-top: 1px solid #F2F0F0;
			}
		}
		.big {
			font-size: 24px;
		}
		.theme {
			margin-top: 45px;
			margin-bottom: 25px;
			font-size: 14px;
			color: #999999;
			letter-spacing: 0;
			line-height: 1.6em;
			height: 66px;
			overflow: hidden;
			text-align: left;
			padding: 0 34px;
		}
	}
}
</style>