<template>
	<div class="content">
		<section class="handle clearfix">
			<Goback passtitle="学员报告" ></Goback>
			<p class="right">
				<span class="tip">注：实时数据，集中培训结束30天后数据停止更新</span>
				<!-- <span class="btn-green j-btn-gray" v-show="!reportBtnFlag">
	                			报告生成中......
	            </span>
				<button class="btn-green" type="button"  @click="exportdata"  v-show="reportBtnFlag">
					<i class="icon-export-white"></i>
					导出
				</button> -->
				<export-countdown @exportCountdown = "exportdata"></export-countdown>
			</p>
		</section>

		<h2 class="title">{{curClazzName}}</h2>

		<!--学员使用情况-->
		<section class="round-layout wcont">
			<h3 class="sub-tit">学员使用概况</h3>

			<section v-if = "stuDataFlag" v-show = "hasDataFlag">
				<!--饼图-->
				<div class="j-pie">
					<div id="studentUseAll" :style="{width: '618px', height: '389px'}"></div>
				</div>

				<!--列表-->
				<div class="j-list clearfix">
					<!--评价、反思、发言、发帖一直存在-->
					<!--创建数为0，证明没有创建-->
					<dl v-if = "stuData.homeworkCount > 0 || stuData.reviewHomeworkCount > 0">
						<dt><img src="../../../assets/img/report/icon-hwork-submit.png"></dt>
						<dd>
							<h2>{{stuData.homeworkCommitCount}}</h2>
							<p>作业完成数量</p>
						</dd>
					</dl>

					<dl>
						<dt><img src="../../../assets/img/report/icon-post-num.png"></dt>
						<dd>
							<h2>{{stuData.topicCount}}</h2>
							<p>发帖数量</p>
						</dd>
					</dl>

					<dl v-if="stuData.photowallCount > 0">
						<dt><img src="../../../assets/img/report/icon-photo-num.png"></dt>
						<dd>
							<h2>{{stuData.photowallCommitCount}}</h2>
							<p>照片数量</p>
						</dd>
					</dl>

					<dl>
						<dt><img src="../../../assets/img/report/icon-speak-num.png"></dt>
						<dd>
							<h2>{{stuData.discussMessageCount}}</h2>
							<p>发言数量</p>
						</dd>
					</dl>

					<dl v-if="stuData.evaluationCount > 0">
						<dt><img src="../../../assets/img/report/icon-partic-number.png"></dt>
						<dd>
							<h2>{{stuData.evaluationCommitCount}}</h2>
							<p>评价参与人次</p>
						</dd>
					</dl>

					<dl v-if="stuData.introspectionCount > 0">
						<dt><img src="../../../assets/img/report/icon-reflect-number.png"></dt>
						<dd>
							<h2>{{stuData.introspectionCommitCount}}</h2>
							<p>反思参与人次</p>
						</dd>
					</dl>

					<dl v-if = "stuData.signCount > 0">
						<dt><img src="../../../assets/img/report/icon-sign-number.png"></dt>
						<dd>
							<h2>{{stuData.signCommitCount}}</h2>
							<p>签到参与人次</p>
						</dd>
					</dl>

					<dl  v-if="stuData.courseCount > 0">
						<dt><img src="../../../assets/img/report/icon-msg-number.png"></dt>
						<dd>
							<h2>{{stuData.messageBoardCommitCount}}</h2>
							<p>课程留言量</p>
						</dd>
					</dl>

					<dl v-if="stuData.voteCount > 0">
						<dt><img src="../../../assets/img/report/icon-vote-number.png"></dt>
						<dd>
							<h2>{{stuData.voteCommitCount}}</h2>
							<p>投票参与人次</p>
						</dd>
					</dl>

					<dl v-if = "stuData.questionnaireCount > 0">
						<dt><img src="../../../assets/img/report/icon-qustion-number.png"></dt>
						<dd>
							<h2>{{stuData.questionnaireCommitCount}}</h2>
							<p>问卷参与人次</p>
						</dd>
					</dl>

				</div>
			</section>

			<!--暂无数据-->
			<section v-else class="w-nocont" v-show = "emptyFlag">
				<p>还没有添加学员哦~~</p>
			</section>
		</section>

		<!--学员使用情况-->
		<section class="round-layout wcont" >
			<h3 class="sub-tit">学员参与情况</h3>

			<div id="chartStudentUse"  :style="{width:'1155px',height:'591px',marginLeft:'-15px'}" v-if = "stuDataFlag"></div>

			<!--暂无数据-->
			<section v-else class="w-nocont">
				<p>还没有添加学员哦~~</p>
			</section>
		</section>

		<!--培训情况-->
		<section class="round-layout wcont" id="w-table">
			<h3 class="sub-tit">培训情况</h3>

			<div class="j-train">
				<div class="active-bar"></div>
				<ul>
					<li :class="{'active':0 == curIndex}" @click="tab(0)">学员报告</li>
					<li @click="tab(1)" :class="{'active':1 == curIndex}">学员参与明细</li>
				</ul>
			</div>

			<!--学员报告-->
			<section id = "report" :class="0 == curIndex ? {'j-status':true}:{'j-status-none':true}">
				<!--展示数据-->
				<div v-if="this.totalElements !== 0" v-show="hasDataFlag">
					<el-table
						:data="stuDetails"
						stripe
						class="list">
					    <el-table-column
					    	fixed
					      	label="序号"
					      	width="80">
					      	<template slot-scope = "scope">
					      		{{(curPage-1)*10+scope.$index+1}}
					      	</template>
					    </el-table-column>
					    <el-table-column
					    	fixed
					      	prop="name"
					      	label="姓名"
					      	width="80">
					    </el-table-column>
					    <el-table-column
					      	prop="phone"
					      	label="联系电话"
					      	width="110">
					      	<template slot-scope="scope">
					      		<span v-if="scope.row.phone">{{scope.row.phone}}</span>
					      		<span v-else>无</span>
					      	</template>
					    </el-table-column>
					    <el-table-column
					      	prop="workPlace"
					      	label="单位"
					      	width="110">
					      	<template slot-scope="scope">
					      		<span v-if="scope.row.workPlace">{{scope.row.workPlace}}</span>
					      		<span v-else>暂无单位信息</span>
					      	</template>
					    </el-table-column>
					    <el-table-column
					      	prop="userLearnStatisticsFinishedRate"
					      	label="任务完成率"
					      	width="115">
					    </el-table-column>
					    <el-table-column
					      	prop="trainingDays"
					      	label="参加培训天数"
					      	width="115">
					    </el-table-column>
					    <el-table-column
					      	prop="homeworkFinishedRate"
					      	label="作业完成"
					      	width="105">
					    </el-table-column>
					    <el-table-column
					      	prop="positiveLevel"
					      	label="活跃情况"
					      	:render-header="renderheaderH"
					      	width="115">
					      	<template slot-scope = "scope">
					      		{{posTransfer(scope.row.positiveLevel,0)}}
					      	</template>
					    </el-table-column>
					    <el-table-column
					      	prop="userLearnAttitude"
					      	label="学习态度"
					      	:render-header="renderheaderT"
					      	width="115">
					      	<template slot-scope = "scope">
					      		{{posTransfer(scope.row.userLearnAttitude,1)}}
					      	</template>
					    </el-table-column>
					    <el-table-column
					      	prop="learningDisciplineLevel"
					      	:render-header="renderheaderJ"
					      	label="学习纪律">
					      	<template slot-scope = "scope">
					      		<span v-if = "scope.row.learningDisciplineLevel">
					      			{{posTransfer(scope.row.learningDisciplineLevel,1)}}
					      		</span>
					      		<span v-else>
					      			—
					      		</span>
					      		
					      	</template>
					    </el-table-column>
					</el-table>
					<p class="page-sum">共{{totalElements}}条 每页10条</p>

					<!-- 分页 -->
					<div class="pagination">
				      	<el-pagination
				      		:page-size ="10"
				      		layout="prev, pager, next"
				        	@current-change ="handleCurrentChange"
				        	:total="totalElements">
				      	</el-pagination>
				    </div>

				</div>

				<!--空页面-->
				<div class="w-nocont-table" v-else v-show="emptyFlag">
					还没有添加学员哦~~
				</div>

			</section>


			<!--学员参与明细-->
			<section id = "detail"  :class="1 == curIndex ? {'j-status':true}:{'j-status-none':true}">
				<div v-if="this.totalElementsA !== 0" v-show="hasDataFlag">
					<el-table
						stripe
						:data="stuAttendDetails"
						class="list">
						<el-table-column 
						:key="index" 
						v-if = "index == 0"
						v-for="(col,index) in cols"
						fixed="fixed"
						label="序号" >
							<template slot-scope="scope">
								{{(curPageA-1)*10+scope.$index+1}}
							</template>
						</el-table-column>

						<el-table-column 
						:key="index" 
						v-if = "index == 1"
						v-for="(col,index) in cols"
						fixed="fixed"
						prop="name" 
						label="姓名" >
						</el-table-column>

						<el-table-column
						v-if="index != 0 && index !=1"
						:key="index" 
						:width="col.width"
						v-for="(col,index) in cols"
						:fixed="col.fixed"
						:prop="col.prop" 
						:label="col.label" >
						</el-table-column>

					</el-table>


					<p class="page-sum">共{{totalElementsA}}条 每页10条</p>

					<!-- 分页 -->
					<div class="pagination">
				      	<el-pagination
				        	@current-change ="handleCurrentChangeA"
				        	layout="prev, pager, next"
				        	:page-size ="10"
				        	:total="totalElementsA">
				      	</el-pagination>
				    </div>
				</div>

				<!--空页面-->
				<div class="w-nocont-table" v-else v-show="emptyFlag">
					还没有添加学员哦~~
				</div>

			</section>
		</section>
		
		<!--导出-->
		<forms-summit 
		ref="form"
		:methods = "formObj.method"
		:urls = "formObj.urls"
		:data = "formObj.data">
		</forms-summit>

	</div>
</template>
<script>
	import api from '@/global/resource'
    // 引入 ECharts 主模块
	let echarts = require('echarts/lib/echarts')
	 // 引入饼图组件
  	require('echarts/lib/chart/pie')

  	// 引入柱状图
	require('echarts/lib/chart/bar')

	// 引入提示框和标题组件
	require('echarts/lib/component/tooltip')
	require('echarts/lib/component/title')
	require('echarts/lib/component/visualMap')

	import model from '@/model/report/stu'

	import formsSummit from 'components/formsumit/form'

	import exportCountdown from '@/base/export_countdown/export_countdown'

	import { getToken } from '@/filters/userVerify'

	import Goback from 'base/goback/goback'

	export default{

		data(){
			return{
				totalElements:0,

				totalElementsA:0,

				curIndex:0,
				curPage:1,

				curPageA:1,

				stuData:{},
				stuDataFlag:true,

				//空页面隐藏
				emptyFlag:false,

				//有数据默认隐藏
				hasDataFlag:false,

				chartArray:{},
				formObj:{
        		 	method:"post",
        		 	data:{},
        		 	urls:api.urls.exportClazzStudentStatisticsReport,
        		 },

        		 stuIndex:0,
        		 stuDetails:[],

        		 stuAttendDetails:[],

        		 cols:[],

        		 positive:{
        		 	A:"非常活跃",
        		 	B:'活跃',
        		 	C:'一般',
        		 	D:'不活跃'
        		 },
        		 attitute:{
        		 	A:"非常好",
        		 	B:"好",
        		 	C:"一般",
        		 	D:"差"
        		 },

        		 attendRateMax:'',
        		 attendRateMaxRate:0,
        		 attendRateMin:'',
        		 attendRateMinRate:0,




			}
		},

		computed:{
			clazzId(){
				return this.$route.query.clazzId;
			},
			curClazzName(){
				return this.$store.getters.showCurClazzName;
			}
		},

		created(){

		},

		mounted(){


			this.pieGetData();
			this.barGetData();

			//学员报告列表
			this.clazzReportList();

			//学员参与明细
			this.clazzReportAttendList();
			
		},

		methods:{

			posTransfer(val,type){

				if(type == 0){
					return this.positive[val];
				}else{
					return this.attitute[val];
				}
				
			},

			//活跃度
			handleCurrentChange(val){
				console.log(val);
                this.curPage = val;
                this.clazzReportList();
            },

            //参与明细
			handleCurrentChangeA(val){
                this.curPageA = val;
                this.clazzReportAttendList();
            },

            clazzReportList(){
            	let data = {
            		clazzId:this.clazzId,
            		number:this.curPage,
            		size:10
            	}
            	model.reportClazzStudentDetail(data,(res => {
					if(res.status == 200){

						if(!!res.data && !!res.data.userList && res.data.userList.content.length > 0){

							this.stuDetails = res.data.userList.content;
							this.totalElements = res.data.userList.totalElements;

						}
						

					}else{

						this.$message.error(res.message);
					}
				}))

            },

            clazzReportAttendList(){
            	let _this = this;
            	let data = {
            		clazzId:this.clazzId,
            		number:this.curPageA,
            		size:10
            	}
            	model.reportClazzStudentAttendDetail(data,(res =>{
            		if(!!res.data && !!res.data.userList && res.data.userList.content.length > 0){

            			this.stuAttendDetails = res.data.userList.content;
            			this.totalElementsA = res.data.userList.totalElements;

            			
            			this.stuAttendDetails.forEach((item,index,arr) =>{


            				if(item.signCount == 0){
            					delete item['signedCount'];
            					delete item['absenceCount'];
            					delete item['unSignCount'];
            				}

            				if(item.questionnaireActivityCount == 0){
            					delete item['questionnaireCount'];
            				}

            				if(item.homeworkActivityCount == 0){
            					delete item['homeworkCount'];
            					delete item['excellentHomeworkCount'];
            				}

            				if(item.voteActivityCount == 0){
            					delete item['voteCount'];
            				}

            				if(item.courseCount == 0){
            					delete item['leaveMessageCount'];
            				}



            				//重组表头
            				if(index == 0){
            					var indexs = index + 2;
            					for(var j in item){
            						
            							if(j != 'name' && !!this.formatName(j,0)){
            								_this.cols[indexs++] = {
		            							prop:j,
			            						label:this.formatName(j,0),
			            						width:this.formatName(j,1),
	            							}
            							}
	            						
            					}
            				}
            				
            			})


            		}
            	}))


            },

            formatName(j,type){

            	let formatObj = this.forMatData();
            	let con = "";

            	for(var i in formatObj){
            		let obj = formatObj[i];
            		let name = obj.substring(0,obj.indexOf("-"));
            		let width = obj.substring(obj.indexOf("-")+1,obj.length)
            		if(j == i){
            			return con = type == 0 ? name:width;
            		}
            	}
            },

            forMatData(){
            	let dataObj = {
            		name:"姓名-100",
            		signedCount:"签到次数-100",
            		homeworkCount:"作业完成数-110",
            		discussCount:'发言数-100',
            		evaluationCount:'评价提交数-110',
            		introspectionCount:'反思提交数-100',
            		topicCount:'发帖数-100',
            		photowallCount:'照片墙发照片数-120',
            		voteCount:'参与投票-100',
            		questionnaireCount:'参与问卷-100',
            		leaveMessageCount:'课程留言数-110',
            		excellentHomeworkCount:'优秀作业数-110',
            		unSignedCount:'未签到次数-110',
            		absenceCount:'请假次数-100',
            		likeCount:'点赞数量-100',
            		topicCommentCount:'评论数量-100',
            		collectCount:'收藏数量-100'
            	}
            	return dataObj;
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

			exportdata(){
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				//console.log(this.attendRateMaxRate);
				//console.log(this.attendRateMax);
				//console.log("===========================");
				//console.log(typeof(this.attendRateMinRate));
				//console.log(typeof(this.attendRateMin));

				let data = {
					clazzId:this.clazzId,
					token:getToken(),
					attendRateMaxRate:this.attendRateMaxRate,
					attendRateMax:this.attendRateMax,
					attendRateMinRate:this.attendRateMinRate,
					attendRateMin:this.attendRateMin
				}
				for(var i in this.chartArray){
    				data[i] = this.chartArray[i].getDataURL({pixelRatio:1, backgroundColor:'#fff'});
    			}
				this.formObj.data = data;
				this.$refs.form.submitData();
			},

			renderheaderH(h, { column, $index }) {
				return h('span',[
			        h('span', column.label),
			        h('i',
			            {
			                class: 'icon-ques',
			                attrs:{
			                	title:"学员参与发帖、讨论、发照片的互动活跃情况",
			                	alt:"学员参与发帖、讨论、发照片的互动活跃情况"
			                },
			                on: {
			                    mouseover: this.change
			                }
			        	}
			        )
			        
			    	],

			    );
			},

			renderheaderT(h, { column, $index }) {
				return h('span',[
			        h('span', column.label),
			        h('i',
			            {
			                class: 'icon-ques',
			                attrs:{
			                	title:"学员任务完成的学习情况",
			                	alt:"学员任务完成的学习情况"
			                },
			                on: {
			                    mouseover: this.change
			                }
			        	}
			        ),
			        
			    	],

			    );
			},

			renderheaderJ(h, { column, $index }) {
				return h('span',[
			        h('span', column.label),
			        h('i',
			            {
			                class: 'icon-ques',
			                attrs:{
			                	title:"学员的考勤情况",
			                	alt:"学员的考勤情况"
			                },
			                on: {
			                    mouseover: this.change
			                }
			        	}
			        ),
			        
			    	],

			    );
			},

			change() {
    			
			},
			pieGetData(){
				let data = {
					clazzId:this.clazzId
				}
				model.reportClazzStudentStatistics(data,(res => {
					if(res.status == 200){

						this.stuData = res.data;

						if(res.data.studentCount == 0){

							this.stuDataFlag = false;

							//空页面展现。默认隐藏
							this.emptyFlag = true;

						}else{

							//有数据展现，默认隐藏
							this.hasDataFlag = true;
						}
						this.pieStudentUse(res.data);
						
						

					}else{

						this.$message.error(res.message);
					}
				}))
				
			},

			pieStudentUse(data){

				//全员
				let allStudent = data.studentCount;

				//已登录APP
				let studentAppCount = data.studentAppCount;

				//未登录APP
				let noStudentAppCount = allStudent - studentAppCount;

				let studentUseAll = echarts.init(document.getElementById('studentUseAll'));

				this.chartArray['imageData_1'] = studentUseAll;


				var formatterRt = function (value) {
				    return (value * 100/allStudent).toFixed(2);
				}
				let myoption = {
				   
				    tooltip : {
				        trigger: 'item',
				        // formatter: "{a} <br/>{b} : {c} ({d}%)"
				        formatter(params,ticket,callback){

				            var name = params.name;
				            var seriesName = params.seriesName;
				            var value = params.value;
				            var valueFliter = formatterRt(value);
				            
				            return seriesName + '<br/>' + name + ':' + value + '(' +valueFliter + ')%';
				        	
				        }
				    },

				    series : [
				        {
				            name:'学员',
				            type:'pie',
				            radius : '55%',
				            center: ['50%', '50%'],
				            data:[
				                {
				                	value:noStudentAppCount, 
				                	name:'未登录APP',
				                	itemStyle:{
				            			normal:{
				            				color:'#74A6FF'
				            			}
				            		}
				                },
				                {
				                	value:studentAppCount, 
				                	name:'已登录APP'
				                }
				            ],
				            label: {
				                normal: {
				                    textStyle: {
				                        color: '#333'
				                    }
				                }
				            },
				            labelLine: {
				                normal: {
				                    lineStyle: {
				                        color: '#333'
				                    },
				                    smooth: 0.2,
				                    length: 10,
				                    length2: 20
				                }
				            },
				            itemStyle: {
				                normal: {
				                    color: '#FFC055',
				                    shadowBlur: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
   					 ]
				};
				studentUseAll.setOption(myoption,true)
			},

			barGetData(){
				let data = {
					clazzId:this.clazzId
				}
				model.reportClazzStudentActivityStatistics(data,(res => {
					if(res.status == 200){

						this.chartStudentUse(res.data.rates);


					}else{

						this.$message.error(res.message);
					}
				}))
			},

			chartStudentUse(data){

				let dataArray = [];
				let dataXArray = [];
				let dataRates = [];

				let title = "";
				let x = "";

				for(var i in data){

					dataRates.push(data[i]);

					//最大的值
					this.attendRateMaxRate = Math.max.apply(Math,dataRates);
					this.attendRateMinRate = Math.min.apply(Math,dataRates);

					if(this.attendRateMaxRate == data[i]){
						this.attendRateMax = i; 
					}
					if(this.attendRateMinRate == data[i]){
						this.attendRateMin = i;
					}

					switch(i){
						case 'questionnaireAttendRate':

						title = "问卷参与率";
						dataArray.push(title);
						break;

						case 'voteAttendRate':
						title = "投票参与率";
						dataArray.push(title);
						break;

						case 'introspectionAttendRate':
						title = "反思率";
						dataArray.push(title);
						break;

						case 'evaluationAttendRate':
						title = "评价率";
						dataArray.push(title);
						break;

						case 'photowallAttendRate':
						title = "照片墙参与率";
						dataArray.push(title);
						break;

						case 'discussAttendRate':
						title = "发言率";
						dataArray.push(title);
						break;

						case 'topicAttendRate':
						title = "发帖率";
						dataArray.push(title);
						break;

						case 'signAttendRate':
						title = "签到率";
						dataArray.push(title);
						break;

						case 'homeworkAttendRate':
						title = "作业完成率";
						dataArray.push(title);
						break;

						default:

					}

					let percent = (data[i] * 100).toFixed(2);
					dataXArray.push(percent);

				}


				let chartStudentUse = echarts.init(document.getElementById('chartStudentUse'));

				this.chartArray['imageData_2'] = chartStudentUse;

				let seriesLabel = {
				    normal: {
				        show: true,
				        color: '#000',
				        position:"right"
				    }
				}

				var myoption = {

					tooltip: {
					    trigger: 'axis',
					    axisPointer: {
					        type: 'shadow'
					    },
					    formatter: function (params) {

					        var tar = params[0];
					        return tar.name + ' : ' + tar.value + '%';
        				}
					},
					    
					grid: {
					    left: '3%',
					    right: '4%',
					    bottom: '3%',
					    containLabel: true
					},
					xAxis: {
					    type: 'value',
					    boundaryGap: [0, 0.01],
					    splitLine: {
			                lineStyle: {
			                    color: ['#f2f0f0']
			                }
		               	}
					},
					yAxis: {
					        type: 'category',
					        data: dataArray.reverse(),
					        
					},
					series: [
					        {
					            type: 'bar',
					            barWidth: '40%',
					            data: dataXArray.reverse(),
					            label: seriesLabel,
					            itemStyle: {
									normal: {
										label: {  
					                        show: true,  
					                        position: 'top',  
					                        formatter: '{c}%'  
					                    },  
										color:"#958FF4"
									}
						        }
					        }
					]
				};
				chartStudentUse.setOption(myoption,true);
			}
		},
		components:{
			formsSummit,
			exportCountdown,
			Goback
		}
	}

</script>
<style scoped lang="less">
@import "../../../assets/less/icon.less";
@import "../../../assets/less/btn-search.less";
@import "../../../assets/reset-element-ui/user-table.css";
@import "../../../assets/less/report.less";


.j-pie{
	width: 618px;
	top: -60px;
	margin: 0 auto 0 auto;
	position: relative;
	.words-lt{
		position: absolute;
		left: 32%;
		width: 120px;
		text-align: center;
		top: 48%;
		color: #fff;
		font-size: 20px;
	}
	.words-rg{
		position: absolute;
		left: 50%;
		width: 100px;
		text-align: center;
		top: 48%;
		color: #fff;
		font-size: 20px;
	}
}
.j-list{
	margin: -70px auto auto 13%;
	dl{
		float: left;
		margin-bottom: 34px;
		width: 25%;

		dt{
			vertical-align: middle;
			margin-top: 5px;
			float: left;

		}
		dd{
			float: left;
			padding-left: 15px;
			h2{
				color: #333;
				font-size: 24px;
			}
			p{
				margin-top: 5px;
				font-size: 16px;
			}
		}
	}
}
.j-train{
	width: 275px;
	height: 42px;
	line-height: 42px;
	color:#666;
	background: #f5f5f5;
	border-radius: 100px;
	font-size: 16px;
	margin-top: 50px;
	position: relative;
	
	.active-bar{
		position: absolute;
		left: 0;
		top: 0;
		background:#EC9931;
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

.lay-content{
	position: absolute;
	top: 50px;
	left: 0;
	background: #ccc;
	color: red;
	padding:10px;
}
.w-nocont p{
	font-size: 22px;
}

</style>
