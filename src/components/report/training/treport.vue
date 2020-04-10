<template>
	<div class="treport">
		<section class="handle clearfix">
			<Goback passtitle="培训效果报告" ></Goback>
			<p class="right">
				<span class="tip">注：实时数据，集中培训结束30天后数据停止更新</span>
				<span class="btn-gray" v-show = "!reportBtnFlag">
					报告生成中......
				</span>
				<button class="btn-green" type="button" v-show="reportBtnFlag"  @click="exportHomePage">
					<i class="icon-export-white"></i>
					导出
				</button>
			</p>
		</section>
	
		<section class="wcont round-layout clearfix">
			<h3 class="sub-tit">项目满意度：</h3>
			<div class="pie-wrapper">
				<div id="satisfaction"></div>	
			</div>
			<div class="instructions">
				<ul class="clearfix">
					<li>
						<span class="green">{{items.evaluationAttendStuCount}}</span>
						<p>评价参与人数</p>
					</li>
					<li>
						<span class="green">{{items.evaluationSatisfiedRate}}</span>
						<p>项目满意度</p>
					</li>
					<li>
						<span class="green">{{items.introspectionAttendStuCount}}</span>
						<p>反思参与人数</p>
					</li>
					<li>
						<span class="green">{{items.introspectionAttendRate}}</span>
						<p>反思参与率</p>
					</li>
				</ul>
			</div>

		</section>

		<section class="wcont round-layout" v-if="stuVoice.length > 0">
			<h3 class="sub-tit">优秀心得体会：</h3>
			<ul class="tips">
				<li v-for="item in stuVoice">
					<div class="userinfor">
						<img class="headpic" :src="item.miniAvatar" v-if="item.miniAvatar" alt="">
						<img v-else src="../../../assets/img/activity/example2.png"/>
						<span class="name">{{item.name}}</span>  
						<template v-if="item.workPlace">
							&bull; 
							<span class="school">{{item.workPlace}}</span>
						</template>
						
					</div>
					<p class="speak">{{item.answer}}</p>
				</li>
				
			</ul>
		</section>

		<section class="wcont round-layout">
			<h3 class="sub-tit">项目评价具体情况：</h3>
			<div class="wtable-wrapper clearfix">
				<table cellspacing="0" cellpadding="0" border="0" class="wtable" style="width:100%; table-layout:fixed;" >
					<thead>

						<tr >
							<th width="50">序号</th>
							<th width="150">评价内容</th>
							<th v-for="(item,index) in titleList"><div class="cell">选项{{orderNum[index]}}</div></th>
						</tr>
					</thead>
					<tbody>
						<template v-for="(items,index) in contList">
							<tr v-if="items[0] !== 'SUBJECTIVE'">
								<td width="50">{{index+1}}</td>
								<td width="150">{{items[1]}}</td>
								<td v-for="(it,ind) in items" v-if="ind >=2 && ind < items.length">	 
									<div class="cell">{{it}}</div>
								</td>
								<td v-for="n in titleList.length-(items.length-2)">	 
									<div class="cell"> - </div>
								</td>
							</tr>

							<tr v-else-if="items[0] == 'SUBJECTIVE'">
								<td width="50">{{index+1}} </td>
								<td  :colspan="Number(titleList.length+1)">	 
									<div class="cell2" v-for="(it,ind) in items" v-if="ind == 1">{{it}}</div>
									<div class="cell2" v-for="(it,ind) in items" v-if="ind >=2">{{ind-1}}. {{it}}</div>
								</td>
							</tr>
						</template>
						
					</tbody>
				</table>
			</div>
			
		</section>

		<!-- 导出报告 -->
		<forms-summit
			:methods = "formObj.method"
			:urls = "formObj.urls"
			:data = "formObj.data">
		</forms-summit>
	</div>
</template>
<script>
	// 引入 ECharts 主模块
	let echarts = require('echarts/lib/echarts')
	 // 引入饼图组件
  	require('echarts/lib/chart/pie')
  	// 引入提示框和标题组件
	require('echarts/lib/component/tooltip')
	require('echarts/lib/component/title')
	require('echarts/lib/component/legend')

	import Train from 'model/report/training'

	import formsSummit from 'components/formsumit/form'
	import API from '@/global/resource'
	import { getToken } from '@/filters/userVerify'

	import Goback from 'base/goback/goback'

	export default {
		data() {
			return {

		        items: {},			// 培训效果满意度数据
		        pieData: {},		// 饼图数据
		        stuVoice: [],		// 心得体会
		        titleList: [],		// 选项名称
		        contList: [],		// 选择内容

				chartArray:{},     // 导出echarts 数组
		        reportBtnFlag:false,	// 导出报告生成中
        		reportBtnSeconds:5,
        		formObj:{
        		 	method:"post",
        		 	data:{},
        		 	urls:"",
        		},
        		orderNum: ["一","二","三","四","五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十"],		// 选项序号
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			}
		},
		created() {
			this.formObj.urls = API.urls.reportTrainExp;
		},
		mounted() {
			this.reportShow();
			this.getTrain();
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
			getTrain() {
				let data = {
					clazzId: this.clazzId
				}
				Train.getTrain(data, (res => {
					console.log("培训效果数据",res);
					if(res.status == 200) {
						this.items = res.data;
						this.pieData = res.data.satisfied;
						
						this.stuVoice = res.data.questionPaperAnswerVOList || [];
						this.contList = res.data.optionStatisticsList;
						this.titleList = res.data.optionStatisticsTitleList;
						this.setPie();
						
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			
			setPie() {

				let pieSat = echarts.init(document.getElementById("satisfaction"));
				this.chartArray["imageData_1"] = pieSat;
				let option = {
					tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    color: ['#FE8080','#8898FB', '#32D5C5', '#AFA9FF'],
				    // visualMap: {
				    //     show: false,
				    //     min: 80,
				    //     max: 600,
				    //     inRange: {
				    //         colorLightness: [0.1, 1]
				    //     }
				    // },
				    series : [
				        {
				            name:'项目满意度',
				            type:'pie',
				            radius : '80%',
				            center: ['50%', '50%'],
				            data:[
				                {value:this.pieData.satisfied, name:'满意'},
				                {value:this.pieData.verySatisfied, name:'非常满意'},
				                {value:this.pieData.notSatisfied, name:'不满意'},
				                {value:this.pieData.ordinary, name:'一般'}
				            ].sort(function (a, b) { return a.value - b.value; }),
				            roseType: 'radius',
				            label: {
				                normal: {
				                	formatter: '{b}: {c} ',
				                    textStyle: {
				                        color: 'rgba(0, 0, 0, 0.5)'
				                    }
				                }
				            },
				            labelLine: {
				                normal: {
				                    lineStyle: {
				                        color: 'rgba(0, 0, 0, 0.5)'
				                    },
				                    smooth: 0.2,
				                    length: 10,
				                    length2: 20
				                }
				            },

				            animationType: 'scale',
				            animationEasing: 'elasticOut',
				            animationDelay: function (idx) {
				                return Math.random() * 200;
				            }
				        }
				    ]
				};

				pieSat.setOption(option, true);
			},

		},

		components: {
			formsSummit,
			Goback
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	@import "../../../assets/less/btn-search.less";
	@import "../../../assets/less/report.less";
	#satisfaction {
		float: left;
		width: 530px;
		height: 320px;
	}
	.instructions {
		margin-top: 60px;
		float: right;
		width: 480px;
		background: rgba(0,0,0,0.01);
		border: 1px solid rgba(0,37,35,0.15);
		border-radius: 6px;
		ul {
			padding: 38px 0 20px;
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

			}
		}
		.green {
			font-size: 34px;
			color: #009791;
			margin-bottom: 13px;
		}
		
	}
	.page-sum {
    	font-size: 14px;
	    color: #666;
	    text-align: right;
	    padding-top: 15px;
	}
	.tips {
		margin-top: 20px;
		// padding-left: 15px;
		li {
			width: 100%;
			padding: 20px 0;
			margin-right: -45px;
			border-bottom: 1px solid #E6E6E6;
			&:last-child {
				border-bottom: 0;
			}
		}
		.userinfor {
			line-height: 46px;
			margin-bottom: 15px;
		}
		.headpic {
			width: 40px;
			height: 40px;
			border-radius: 40px;
			display: inline-block;
			margin-right: 16px;
			
		}
		.name {
			font-size: 16px;
			color: #333333;
		}
		.school {
			font-size: 16px;
			color: #666666;
		}
		.speak {
			font-size: 16px;
			color: #333333;
			line-height: 1.6em;
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
   				text-align: center;
   			}
   			.cell2 {
   				display: block;
   				margin: 5px 0;
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