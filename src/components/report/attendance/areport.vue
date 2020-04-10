<template>
	<div class="wattendance">
		<!-- 没有项目时 -->
	    <empty v-if="signAnalysis.signCount == 0"
	    :tip="tip"></empty>
		
		<template v-else>
			<section class="handle clearfix">

				<Goback passtitle="考勤报告" ></Goback>
				<p class="right">
					<span class="tip">注：截止至昨日的数据，集中培训结束30天后数据停止更新</span>
					<span class="btn-gray" v-show = "!reportBtnFlag">
						报告生成中......
					</span>
					<button class="btn-green" type="button" v-show="reportBtnFlag"  @click="exportHomePage">
						<i class="icon-export-white"></i>
						导出
					</button>
				</p>

			</section>
			<h2 class="title">{{clazzName}}</h2>
			<section class="wcont round-layout">
				

				<div class="overall clearfix">
					<div class="doughnut">
						<h3 class="sub-tit">总体考勤情况：</h3>
						<div id="doughnutChart"></div>
					</div>

					<div class="describe">
						<ul class="clearfix">
							<li>
								<span class="green">{{signAnalysis.signCount}}</span>
								<p>签到次数</p>
							</li>
							<li>
								<span class="green">{{signAnalysis.historySignedAvgRate}}</span>
								<p>历史平均签到率</p>
							</li>
							<li>
								<span class="green">{{signAnalysis.signedUserCount}}</span>
								<p>实际签到人次</p>
							</li>
							<li>
								<span class="green">{{signAnalysis.signAttendanceNomalRate}}</span>
								<p>正常考勤率</p>
							</li>	
							<li>应签到人数：<span class="big">{{signAnalysis.signUserCount}}</span></li>
							<li>实到人数：<span class="big">{{signAnalysis.signedUserAvgCount}}</span></li>
						</ul>
					</div>
				</div>			
			</section>

			<section class="wcont round-layout">
				<h3 class="sub-tit">签到情况：</h3>
				<div id="signBar"></div>
			</section>

			<section class="wcont round-layout" id="w-table">
				<h3 class="sub-tit">签到人员明细：</h3>
				<div class="wtable-wrapper clearfix" v-if="signUser.length > 0">
					<table cellspacing="0" cellpadding="0" border="0" class="table-left wtable">
						<thead>
							<tr>
								<th width="50">序号</th>
								<th width="150">姓名</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item,index) in signUser">
								<td width="50">{{(cur_page-1)*20+index+1}}</td>
								<td width="150">{{item.name}}</td>
							</tr>
						</tbody>
					</table>
					<div class="table-right">
						<table cellspacing="0" cellpadding="0" border="0" class="wtable" style="width:100%">
							<thead>
								<tr >
									<th v-for="item in signTime"><div class="cell">{{item.signDate + item.pt }} <br/> {{item.beginTime+ '-'+item.endTime}}</div></th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(items,index) in signUser">
									<td v-for="item in items.signAttendanceUserSignedDetailList">	 
										<div class="cell bgpink" v-if="item.indexOf('请') != -1">{{item}}</div>
										<span class="cell bgred" v-else-if="item.indexOf('缺') != -1">{{item}}</span>
										<div class="cell bgblue" v-else-if="item.indexOf('作') != -1">{{item}}</div>
										
										<span class="cell" v-else-if="item.indexOf('正') != -1">{{item}}</span>
										<div class="cell bgorange" v-else>{{item}}</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					
				</div>
				<p class="page-sum">共{{totalElements}}条 每页20条</p>
				<!-- 分页 -->
				<div class="pagination">
			      	<el-pagination
			        	@current-change ="handleCurrentChange"
			        	layout="prev, pager, next"
			        	:page-size ="20"
			        	:total="totalElements">
			      	</el-pagination>
			    </div>
			</section>

			<!-- 导出报告 -->
			<forms-summit
				:methods = "formObj.method"
				:urls = "formObj.urls"
				:data = "formObj.data">
			</forms-summit>
		</template>
		
	</div>
</template>
<script>
	import Empty from 'base/empty/empty'
	// 引入 ECharts 主模块
	let echarts = require('echarts/lib/echarts')
	 // 引入饼图组件
  	require('echarts/lib/chart/pie')
	// 引入柱状图
	require('echarts/lib/chart/bar')
	// 引入提示框和标题组件
	require('echarts/lib/component/tooltip')
	require('echarts/lib/component/title')
	require('echarts/lib/component/legend')

	import attendance from 'model/report/attendance'
	import formsSummit from 'components/formsumit/form'
	import API from '@/global/resource'
	import { getToken } from '@/filters/userVerify'

	import Goback from 'base/goback/goback'

	export default {
		data() {
			return {
				tip: '还没有已完成的签到哦~',	// 空页面提示信息

		        signTotal: {},		//总体考勤图表情况
		        signAnalysis: {},	//总体考勤 数字数据
		        signList: [],		// 签到详情
		        signNumber: 0,		// 班级人数
		        cur_page: 1,
		        totalElements: 0,
		        signTime: [],		// table 表头时间
		        signUser: [],		// table 用户

		        chartArray:{},     // 导出echarts 数组
		        reportBtnFlag:false,	// 导出报告生成中
        		reportBtnSeconds:5,
        		formObj:{
        		 	method:"post",
        		 	data:{},
        		 	urls:"",
        		},
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
		created() {
			this.formObj.urls = API.urls.reportAttendanceExp;
		},
		mounted() {
			this.reportShow();		//导出功能倒计时
			this.getSignData();
			this.getSignTable();
		},
		methods: {
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
			//导出报告
			exportHomePage(){
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
    			//form提交组件
    			let data = {
    				clazzId:this.clazzId,
    				token:getToken(),	
    			}
    			for(var i in this.chartArray){
    				data[i] = this.chartArray[i].getDataURL({pixelRatio:1, backgroundColor:'#fff'});
    			}

    			this.formObj.data = data;
    			console.log("导出图片数据", this.formObj.data);

    			setTimeout(function(){
    				$("#exportClazzExport").submit();
    			},50)
    			
			},
			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getSignTable();
        		console.log("number", this.cur_page);
			},
			getSignData() {
				let data = {
					clazzId: this.clazzId
				};
				attendance.getSignData(data, (res => {
					if(res.status == 200) {
						this.signTotal = res.data.signAttendanceTotalConditionMap;
						this.signAnalysis = res.data.signAttendanceDetailMap;
						this.signNumber = res.data.signAttendanceDetailMap.signUserCount;
						this.signList = res.data.signAttendanceConditionMap.signAttendanceSingleConditionList;

						this.setDoughnut();
						this.setSignBar(this.signList);
						console.log("数据",res.data);
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			getSignTable() {
				let data = {
					clazzId: this.clazzId,
					number: this.cur_page,
					size: '20'
				}
				attendance.getSignDetail(data, (res => {
					if(res.status == 200) {
						
						let signTime = res.data.signList;
						this.signUser = res.data.userList.content;
						this.totalElements = res.data.userList.totalElements;

						signTime.map((item,index, items) => {
							let pt = item.beginTime.split(":")[0] < 12 ? '上午' : '下午';
							item.pt = pt;
							return items;
						});
						this.signTime = signTime;

						console.log("table", this.signTime);
					} else {
						this.$message.error(res.message);
					}
				}));

			},
			setDoughnut() {
				let doughnutChart = echarts.init(document.getElementById("doughnutChart"));
				this.chartArray["imageData_1"] = doughnutChart;

				let myOption = {
					color: ['#40B4BF','#FE716F', '#8898FB',  '#3DB6FB', '#F5A623'],
					tooltip: {
				        trigger: 'item',
				        formatter: "{a} <br/>{b}: {c} ({d}%)"
				    },
				    legend: {
				        orient: 'vertical',
				        x: 'right',
				        y: 'center',
				        selectedMode: false,
				        data:['正常','缺勤','请假','作弊','迟到早退']
				    },
				    series: [
				        {
				            name:'总体考勤情况',
				            type:'pie',
				            radius: ['50%', '70%'],
				            avoidLabelOverlap: false,
				            label: {
				                normal: {
				                    show: false,
				                    position: 'center'
				                },
				                emphasis: {
				                    show: true,
				                    textStyle: {
				                        fontSize: '30',
				                        fontWeight: 'bold'
				                    }
				                }
				            },
				            labelLine: {
				                normal: {
				                    show: false
				                }
				            },
				            data:[
				                {value:this.signTotal.normalCount, name:'正常'},
				                {value:this.signTotal.absenceCount, name:'缺勤'},
				                {value:this.signTotal.vacationCount, name:'请假'},
				                {value:this.signTotal.cheatCount, name:'作弊'},
				                {value:this.signTotal.comeLateLeaveEarlyCount, name:'迟到早退'}
				            ]
				        }
				    ]
				}

				doughnutChart.setOption(myOption, true);
			},

			setSignBar(listData) {
				let signBar = echarts.init(document.getElementById("signBar"));
				this.chartArray["imageData_2"] = signBar;

				let da = {},
					yData = [], 
					normalData= [],  //正常
					absenceData = [],   //缺勤
					vacationData = [],  //请假
					cheatData = [], 	//作弊
					comeLateLeaveEarly = [];  //迟到早退
				listData.map((item, index) => {
					let pt  = item.beginTime.split(':')[0] < 12 ? '上午' : '下午';
					let time = item.signDate + pt + '\n' + item.beginTime + '-' + item.endTime;
					yData.push(time);

					let normal = item.signAttendanceSingleConditionMap.normalSingleCount;
					normalData.push(normal);

					let absence = item.signAttendanceSingleConditionMap.absenceSingleCount;
					absenceData.push(absence);

					let vacation = item.signAttendanceSingleConditionMap.vacationSingleCount;
					vacationData.push(vacation);

					let cheat = item.signAttendanceSingleConditionMap.cheatSingleCount;
					cheatData.push(cheat);

					let clle = item.signAttendanceSingleConditionMap.comeLateLeaveEarlySingleCount;
					comeLateLeaveEarly.push(clle);

					return da = {
							'yData': yData,
							'normalData' : normalData,
							'absenceData' : absenceData,
							'vacationData' : vacationData,
							'cheatData' : cheatData,
							'comeLateLeaveEarly' : comeLateLeaveEarly
						};
				})
				console.log("da", da);

				let barOption = {
					color: ['#68D1DB', '#F0868C',  '#CD95CD', '#73AEF4', '#FFC79C'],
					tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    legend: {
				        data: ['正常', '缺勤','请假','作弊','迟到早退']
				    },
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis:  {
				        type: 'value'
				    },
				    yAxis: {
				        type: 'category',
				        data: da.yData,
				        axisLabel: {
				        	// align: 'center',
				        },
				    },
				    series: [
				        {
				            name: '正常',
				            type: 'bar',
				            stack: '总量',
				            label: {
				                normal: {
				                    show: false,
				                    position: 'insideRight'
				                }
				            },
				            data: da.normalData,
				            barMaxWidth: 70
				        },
				        {
				            name: '缺勤',
				            type: 'bar',
				            stack: '总量',
				            label: {
				                normal: {
				                    show: false,
				                    position: 'insideRight'
				                }
				            },
				            data: da.absenceData
				        },
				        {
				            name: '请假',
				            type: 'bar',
				            stack: '总量',
				            label: {
				                normal: {
				                    show: false,
				                    position: 'insideRight'
				                }
				            },
				            data: da.vacationData
				        },
				        {
				            name: '作弊',
				            type: 'bar',
				            stack: '总量',
				            label: {
				                normal: {
				                    show: false,
				                    position: 'insideRight'
				                }
				            },
				            data: da.cheatData
				        },
				        {
				            name: '迟到早退',
				            type: 'bar',
				            stack: '总量',
				            label: {
				                normal: {
				                    show: false,
				                    position: 'insideRight'
				                }
				            },
				            data: da.comeLateLeaveEarly
				        }
				    ]
				}
				signBar.setOption(barOption, true);
			},
		},

		components: {
			formsSummit,
			Empty,
			Goback
		}
	}

</script>
<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	@import "../../../assets/less/btn-search.less";
	@import "../../../assets/reset-element-ui/user-table.css";
	@import "../../../assets/less/report.less";
	
	
	#doughnutChart {
		float: left;
		width: 530px;
		height: 390px;
	}
	.overall {
		.describe {
			float: right;
			width: 530px;
			background: rgba(0,0,0,0.01);
			border: 1px solid rgba(0,37,35,0.15);
			border-radius: 6px;
			ul {
				padding: 38px 0;
				width: 100%;
			}
			li {
				float: left;
				width: 50%;
				font-size: 18px;
				color: #333;
				text-align: center;
				margin-bottom: 25px;

				>p {
					font-size: 20px;
					color: #000000;
					padding-bottom: 10px;
				}
			}
			.green {
				font-size: 34px;
				color: #009791;
				margin-bottom: 13px;
			}
			.big {
				font-size: 24px;
			}
		}
	}
	#signBar {
		width: 1040px;
		height: 800px;
		margin: 0 auto;
	}
	#w-table {
		.page-sum {
	    	font-size: 14px;
		    color: #666;
		    text-align: right;
		    padding-top: 15px;
		}
	}
	.wtable-wrapper {
		width: 100%;
		margin-top: 40px;


		.table-left {
			width: 198px;
			float: left;
		}
		.table-right {
			float: left;
			width: 900px;
			overflow: auto;
			> table {
				width: auto;
			}
		}
		.wtable {
			box-sizing: border-box;
			border: 1px solid #dfe6ec;
   			color:#1f2d3d;
   			th {
   				box-sizing: border-box;
   				height: 46px;
				background: #eef1f6;
				color:#1f2d3d;
				border-bottom:1px solid #dfe6ec;
				padding:0 10px;
				font-size: 14px;
				text-align: left;
   			}
   			td {
   				box-sizing: border-box;
   				height: 52px;
  				border-bottom:1px solid #dfe6ec;
  				padding:0 10px;
  				font-size: 14px;
   			}
   			.cell {
   				display: block;
   				width: 105px;
   				text-align: center;
   			}
   			.bgpink {
				background-color: #e4b5e4; 
			}
			.bgblue {
				background-color: #a4cdff;
			}
			.bgred {
				background-color: #f59ea3;
			}
			.bgorange {
				background-color: #ffcba4;
			}
		}
		
	}
</style>