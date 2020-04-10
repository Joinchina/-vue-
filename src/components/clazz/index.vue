<template>
	<div class="w-index">
		<section class="w-seclink">
			<div class="clearfix">
				<div class="export">
						 <span class="btn-green j-btn-gray" v-show="!reportBtnFlag">
	                			报告生成中......
	             		 </span>
						 <span class="btn-green" @click = "exportHomePage" v-show="reportBtnFlag">
	                		  <i class="icon-export-white"></i>导出报告
	              		 </span>

				</div>
				<h1 class="tit left">
					班级概况
				</h1>
			</div>
			<ul class="sec-nav clearfix round-layout" v-loading="loading1"
			element-loading-text="加载中..."
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(255,255, 255,1)">
				<li>
					<router-link :to="{path: '/course/all', query:{clazzId:clazzId}}">
						<h3>{{wTotal.courseCount}}</h3>
						<p>
							<i class="icon-course-purple"></i>
							课程
						</p>
					</router-link>
				</li>
				<li>
					<router-link :to="{path: '/clazz/notice/list', query:{clazzId:clazzId}}">
						<h3>{{wTotal.noticeCount}}</h3>
						<p>
							<i class="icon-notice-green"></i>
							通知
						</p>
					</router-link>
				</li>
				<li>
					<router-link :to="{path: '/clazz/signin/res', query:{clazzId:clazzId}}">
						<h3>{{wTotal.signCount}}</h3>
						<p>
							<i class="icon-sign-pink"></i>
							签到
						</p>
					</router-link>
				</li>
				<li>
					
					<router-link :to="{path: '/clazz/index/homeworklist', query:{clazzId:clazzId}}">
						<h3>{{wTotal.homeworkCount}}</h3>
						<p>
							<i class="icon-work-blue"></i>
							作业
						</p>
					</router-link>
				</li>
				<li>
					
					<router-link :to="{path: '/clazz/index/mutuallist', query:{clazzId:clazzId}}">
						<h3>{{wTotal.reviewHomeworkCount}}</h3>
						<p>
							<i class="icon-mutual-index"></i>
							学员互评作业
						</p>
					</router-link>
				</li>
				<li>
					
					<router-link :to="{path: '/clazz/index/evalist', query:{clazzId:clazzId}}">
						<h3>{{wTotal.evaluationCount}}</h3>
						<p>
							<i class="icon-eval-ora"></i>
							评价
						</p>
					</router-link>
				</li>
				<li>
					
					<router-link :to="{path: '/clazz/index/introspectlist', query:{clazzId:clazzId}}">
						<h3>{{wTotal.introspectionCount}}</h3>
						<p>
							<i class="icon-intro-purple"></i>
							反思
						</p>
					</router-link>
				</li>
				<li>
					
					<router-link :to="{path: '/resource/list', query:{clazzId:clazzId}}">
						<h3>{{wTotal.resourceCount}}</h3>
						<p>
							<i class="icon-resource-green"></i>
							资源
						</p>
					</router-link>
				</li>
				<li>
					<router-link :to="{path: '/clazz/post/list', query:{clazzId:clazzId}}">
						<h3>{{wTotal.topicCount}}</h3>
						<p>
							<i class="icon-post-ora"></i>
							发帖量
						</p>
					</router-link>
				</li>
				<li>
					
					<router-link :to="{path: '/clazz/index/discusslist', query:{clazzId:clazzId}}">
						<h3>{{wTotal.discussMessageCount}}</h3>
						<p>
							<i class="icon-discuss-blue"></i>
							讨论数
						</p>
					</router-link>
				</li>
			</ul>
		</section>
		<template>
			<el-popover
			    ref="radar"
			    placement="bottom-start"
			    width="200"
			    trigger="hover"
			    content="指通过班级互动、作业完成、学员出勤、学习心得、活动参与五个角度对本班活跃性以及任务完成率的综合评分。">
			</el-popover>
			<el-popover
			    ref="qin"
			    placement="bottom-start"
			    width="200"
			    trigger="hover"
			    content="指学员通过APP扫码签到的平均签到率情况对本班出勤率的整体评估。">
			</el-popover>
			<el-popover
			    ref="jiao"
			    placement="bottom-start"
			    width="200"
			    trigger="hover"
			    content="指通过对本班有效作业完成情况的评估。">
			</el-popover>
			<el-popover
			    ref="dong"
			    placement="bottom-start"
			    width="200"
			    trigger="hover"
			    content="指通过对本班同学圈、会话讨论的发帖/发言数量、发帖/发言率等综合维度对本班互动的评估。">
			</el-popover>
			<el-popover
			    ref="de"
			    placement="bottom-start"
			    width="200"
			    trigger="hover"
			    content="指对本班所有评价、反思参与和提交情况的综合评估。">
			</el-popover>
			<el-popover
			    ref="yu"
			    placement="bottom-start"
			    width="200"
			    trigger="hover"
			    content="指对本班活动如：照片墙、问卷、投票的参与情况的综合评估。">
			</el-popover>
			<el-popover
			    ref="pie"
			    placement="bottom-start"
			    width="200"
			    trigger="hover"
			    content="指本班学员APP使用过程中积分获得类别占比。">
			</el-popover>
			<el-popover
			    ref="jintegral"
			    placement="bottom-start"
			    width="200"
			    trigger="hover"
			    content="指本班学员积分分数出现的频率，横坐标代表学员积分档位，纵坐标代表该档位积分出现的频次。">
			</el-popover>
			<el-popover
			    ref="jperintegral"
			    placement="bottom-start"
			    width="200"
			    trigger="hover"
			    content="班级人均积分是指班级学员所获得的积分的平均数，即班级学员积分之和/学员人数。">
			</el-popover>
		</template>		
		<section class="w-charts">
			<!--班级概况-->
			<section class="w-radar round-layout clearfix" v-show="echatShowFlag">
				<div class="radar">
					<div id="chartClazzProfile" :style="{width:'649px',height:'377px'}"></div>
				</div>
				
			</section>

			<!--班级综合评估-->
			<section class="w-radar round-layout clearfix" v-if="wScoreFlag == true" 
			v-loading="loading2"
			element-loading-text="加载中..."
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(255,255, 255,1)">
				<h2 class="tit clearfix">
					班级综合评估 
					<i class="icon-ques" v-popover:radar></i>
					<span class="date">评估时间： {{wAll.date}} 24:00</span>
				</h2>
				<div class="radar">
					<div id="chartRadar"></div>
				</div>
				
				<div class="explain">
					<h3 class="">总分数：<span>{{wAllScore}}</span></h3>
					<div class="progress-box">
						<p class="bar-bg">
							<span class="bar-rate" :style="{ width: wOverstepRate}"></span>
						</p>
						<p class="bar-text">超过<span class="green">{{wOverstepRate}}</span>的班级</p>
					</div>
					<ul class="clearfix">
						<li>学员出勤 <i class="icon-ques" v-popover:qin></i>：<span class="num">{{wAll.attendance}}</span>
							<el-popover
								width="170"
							    trigger="hover"
							    :content="wRateAttend[1]">
								<i slot="reference" :class="wRateAttend[0]"></i>
							</el-popover>
						</li>
						<li>作业完成 <i class="icon-ques" v-popover:jiao></i>：<span  class="num">{{wAll.homeworkSubmit}}</span>
							<el-popover
								width="165"
							    trigger="hover"
							    :content="wRateHomework[1]">
								<i slot="reference" :class="wRateHomework[0]"></i>
							</el-popover>

						</li>
						<li>班级互动 <i class="icon-ques" v-popover:dong></i>：<span  class="num">{{wAll.interactive}}</span>
							<el-popover
								width="165"
							    trigger="hover"
							    :content="wRateInter[1]">
								<i slot="reference" :class="wRateInter[0]"></i>
							</el-popover>
						</li>
						<li>学习心得 <i class="icon-ques" v-popover:de></i>：<span  class="num">{{wAll.learningExperience}}</span>
							<el-popover
								width="165"
							    trigger="hover"
							    :content="wRateLearn[1]">
								<i slot="reference" :class="wRateLearn[0]"></i>
							</el-popover>
						</li>
						<li>活动参与 <i class="icon-ques" v-popover:yu></i>：<span  class="num">{{wAll.activityParticipate}}</span>
							<el-popover
								width="165"
							    trigger="hover"
							    :content="wRateActivity[1]">
								<i slot="reference" :class="wRateActivity[0]"></i>
							</el-popover>
						</li>
					</ul>
					<p class="tip">( 注：每项分值为100分；总分值500分 )</p>
				</div>
			</section>

			<!--项目满意度-->
			<section class="j-project round-layout clearfix" v-show="satisFlag"
			v-loading="loading3"
			element-loading-text="加载中..."
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(255,255, 255,1)">
				<div class="left">
					<h3 class="title">
						<span>{{(satisfact["ratio_A"] + satisfact["ratio_B"]) | mathRound}}%</span>
					</h3>
					<p>项目满意度</p>
				</div>

				<div class="mid">
					<h3 class="title">
						<span>{{satisfact["submitNum"] | mathRound}}</span>
					</h3>
					<p>参与人数</p>
				</div>

				<div class="rg">
					<dl class="clearfix">
						<dt>非常满意：<span>{{satisfact["ratio_A"] | mathRound}}%</span></dt>
						<dd>一般：<span>{{satisfact["ratio_C"] | mathRound}}%</span></dd>
					</dl>
					<dl class="clearfix">
						<dt>满意：<span>{{satisfact["ratio_B"] | mathRound}}%</span></dt>
						<dd>不满意：<span>{{satisfact["ratio_D"] | mathRound}}%</span></dd>
						
					</dl>
					<div class="cor"></div>
				</div>
			</section>

			<!--班级学情-->
			<section class="w-radar round-layout clearfix" style="position:relative;"
			v-loading="loading4"
			element-loading-text="加载中..."
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(255,255, 255,1)">
				<h2 class="tit clearfix">
					班级学情
					<router-link class="link" :to="{path: '/clazz/learncase/list', query:{clazzId:clazzId}}">查看详情  <i class="icon-alt-right-blue"></i></router-link>
				</h2>
				<div v-if="clazzLearnFlag">
					<div id="jclazzLearn" class="jclazzLearn" :style="{width: '1000px', height: '350px'}"></div>
					<div class="jclazzLearn-rg" v-show = "clazzWordFlag">
						<p>{{clazzAverageRate + '%'}}</p>
						<div class="txt">
							班级平均任务完成率
						</div>
					</div>
				</div>

				<p class="w-nocont" v-else>暂无数据</p>

			</section>

			<!--班级人均积分_start-->
			<section class="w-radar round-layout clearfix j-index" id="perIntergral" v-if="perIntergralFlag"
			v-loading="loading5"
			element-loading-text="加载中..."
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(255,255, 255,1)">
					<h2 class="tit left">
						 班级人均积分
						<i class="icon-ques" v-popover:jperintegral></i>
					</h2>
					<div class="right tit clearfix">
						    <el-date-picker
						      v-model="valueDate"
						      value-format="yyyy-MM-dd"
						      type="daterange"
						      @change="logTimeChange"
						       :picker-options="pickerOptions">
						    </el-date-picker>
					</div>
					<div class="clearfix"></div>
					<div class="dis" v-show = "contentFlag">
						本数据为 {{beginTime}}—{{endDate}}历史数据
					</div>
					
					<div class="integral">
						<div id="integral" :style="{width: '1250px', height: '340px'}"></div>
						<div id="integral-r" :style="{width: '666px', height: '240px'}" v-show="echatShowFlag"></div>
					</div>
					<div class="con">
						<span class="icon"></span>每日班级人均积分
						
					</div>
					
				</section>
			<!--班级人均积分_end-->

			
			<div class="clearfix" v-loading="loading6"
			element-loading-text="加载中..."
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(255,255, 255,1)">
				<section class="w-pie round-layout"  >
					<h2 class="tit clearfix">
						积分获得分布图
						<template v-if="wScoreFlag == true">
							<span v-if="!!wAll.date">（{{wAll.date}}）</span>
						</template>
						 
						<i class="icon-ques" v-popover:pie></i>
					</h2>
					<div id="chartPie" v-if="wScoreFlag == true"></div>
					<p class="w-nocont" v-else>暂无数据</p>
				</section>
				

				<section class="w-integral round-layout" >
					<h2 class="tit clearfix">
						积分分布图<span v-if="IntergralDate != ''">（{{IntergralDate}}）</span>  
						<i class="icon-ques" v-popover:jintegral></i>
					</h2>
					<div class="integralDistribute" v-if="distributeFlag">
						<div id="integralDistribute" :style="{width: '560px', height: '380px'}"></div>
					</div>
					<p class="w-nocont" v-else>暂无数据</p>
				</section>
				
				
			</div>

			<div class="clearfix" v-loading="loading7"
			element-loading-text="加载中..."
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(255,255, 255,1)">
				<section class="w-member round-layout">
					<h2 class="tit clearfix">
						班级成员
						<router-link class="link" target="_blank" :to="{ path: '/members/student', query: {clazzId: clazzId}}">查看详情  <i class="icon-alt-right-blue"></i></router-link>
					</h2>

					<ul class="cont clearfix">
						<li class="sum">
							<h3 class="rate" v-if="wTotal.studentCount == 0">{{ 0 | numTwo}}%</h3>
							<h3 class="rate" v-else>{{ (wTotal.studentAppCount/wTotal.studentCount)*100 | numTwo}}%</h3>
							<p class="explain">APP学员登录率</p>
						</li>
						<li class="single-clazz clearfix">
							<dl class="top">
								<dt>
									<span>{{wTotal.studentCount}}</span>
									<div class="dis">总学员</div>
								</dt>
								<dd>
									<span>{{wTotal.managerCount}}</span>
									<div class="dis">班主任</div>
								</dd>
								<dd>
									<span>{{wTotal.professorCount}}</span>
									<div class="dis">专家</div>
								</dd>
							</dl>

							<dl class="bottom clearfix">
								<dt>
									<span>{{wTotal.studentCount - wTotal.studentAppCount}}</span>
									<div class="dis">
										未登录APP学员
									</div>
								</dt>
								<dd>
									<span>{{wTotal.studentAppCount}}</span>
									<div class="dis">
										登录APP学员
									</div>
								</dd>
							</dl>
							<div class="msg-btn">
								<button class="btn-green-square" @click = "sentMsg">
									给未登录学员发送短信提醒
								</button>
								<!-- <button class="btn-green-square btn-green-square-gray">
									给未登录学员发送短信提醒
								</button> -->
								<p>每天只能发送3次，还剩{{msgTimes}}次机会</p>
							</div>
							<!-- <p>APP登录学员：<span>{{wTotal.studentAppCount}}</span></p>
							<p>学员：<span>{{wTotal.studentCount}}</span></p>
							<p>班主任：<span>{{wTotal.managerCount}}</span></p>
							<p>专家：<span>{{wTotal.professorCount}}</span></p> -->
						</li>
					</ul>
				</section>
				<section class="w-sign round-layout">
					<h2 class="tit clearfix">
						班级签到
						<router-link class="link"  :to="{ path: '/clazz/signin/res', query: {clazzId: clazzId}}">查看详情  <i class="icon-alt-right-blue"></i></router-link>
					</h2>

					<ul class="cont clearfix">
						<li class="sum">
							<h3 class="rate pink" v-if="wSign.studentCount == 0">{{ 0 | numTwo }}%</h3>
							<h3 class="rate pink" v-else>{{ wSign.historyAvgSignRate*100 | numTwo }}%</h3>
							<p class="explain">历史平均签到率</p>
						</li>
						<li class="single">
							<p>应签到人数：<span>{{wSign.studentCount}}</span></p>
							<p>历史平均签到人数：<span>{{wSign.historyAvgSignCount}}</span></p>
							<p>创建签到（次）：<span>{{wSign.signCount}}</span></p>
							<p>已完成签到（次）：<span>{{wSign.completedSignCount}}</span></p>
						</li>
					</ul>
				</section>
			</div>
			
			<section class="w-barline round-layout" v-if="wHomeFlag" v-loading="loading8"
			element-loading-text="加载中..."
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(255,255, 255,1)">
				<h2 class="tit clearfix">
					作业概况
					<router-link class="link" :to="{path: '/clazz/index/allWork', query:{clazzId:clazzId}}">查看详情  <i class="icon-alt-right-blue"></i></router-link>
				</h2>
				<h3 class="chart-tit">作业完成分析情况</h3>
				<p class="legend clearfix">
					<span>
						<i class="blue"></i>
						已完成人数
					</span>
					<span>
						<i class="circle"></i>
						完成率
					</span>
				</p>
				<div id="chartBarLine"></div>
				<div id="chartBarLine-r" :style="{width:'1190px',height:'500px'}" v-show="echatShowFlag"></div>

			</section>
		</section>
		<!-- 课程满意度 -->
		<div class="round-layout clearfix" v-if="wCourseSat" v-loading="loading9"
			element-loading-text="加载中..."
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(255,255, 255,1)">
			<!-- 课程满意度分布图 -->
			<section class="w-satisfied ">
				<h3 class="chart-tit">课程满意度</h3>
				<div id="wScatter" style="width: 560px; height: 380px "></div>
			</section>

			<!-- 课程满意度排行榜 -->
			<section class="w-satisfied-list ">
				<h3 class="chart-tit clearfix">
					课程满意度榜
					<router-link :to="{path:'/clazz/index/coursesatisfied', query:{clazzId:clazzId}}">查看全部 <i class="el-icon-d-arrow-right"></i></router-link>
				</h3>
				<table class="w-table-sat">
					<tr>
						<th>课程名称</th>
						<th>专家姓名</th>
						<th>满意度</th>
					</tr>
					<tr v-for="(item,index) in wCourseSatRank">
						<td class="">
							<span>{{index+1}} {{item.courseName}}</span>
						</td>
						<td class=""><span>{{item.mainTeacherName}}</span></td>
						<td>{{item.ratio_A}}%</td>
					</tr>
					
				</table>
			</section>
		</div>
		<!--课程资源概况_start-->
		<section class="j-index" v-loading="loading10"
			element-loading-text="加载中..."
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(255,255, 255,1)">
			<div class="other clearfix">

				<div class="other-right round-layout">
					<h2 class="tit">其他活动概况</h2>
					<table class="table-wap">
						<tr class="bg">
							<th>活动</th>
							<th><span class="icon-a-discuss"></span>讨论数</th>
							<th><span class="icon-a-photo"></span>照片墙</th>
							<th><span class="icon-a-question"></span>问卷调查</th>
							<th><span class="icon-a-vote"></span>投票</th>
							<th class="none"><span class="icon-app-log"></span>日志</th>	
						</tr>
						<tr>
							<td>
								<span class="blue">已创建</span>
							</td>
							<td>{{wTotal.discussCount}}</td>
							<td>{{wTotal.photowallCount}}</td>
							<td>{{wTotal.questionnaireCount}}</td>
							<td>{{wTotal.voteCount }}</td>
							<!-- <td class="none">{{wTotal.userLogCommitCount }}</td> -->

							<td class="none">{{wTotal.userLogCount}}</td>

						</tr>
						<tr class="bg">
							<td>
								<span class="blue">参与总数</span>
							</td>
							<td>{{wTotal.discussMessageCount}}</td>
							<td>{{wTotal.photowallCommitCount}}</td>
							<td>{{wTotal.questionnaireCommitCount}}</td>
							<td>{{wTotal.voteCommitCount}}</td>
							<!-- <td class="none">{{wTotal.userLogCount}}</td> -->
							<td class="none">{{wTotal.userLogCommitCount}}</td>
						</tr>
						<tr>
							<td>
								<span class="blue">操作</span>
							</td>
							<td><router-link :to="{path: '/clazz/index/discusslist', query: {clazzId: clazzId}}" class="wlink">查看详情</router-link></td>
							<td><router-link :to="{path: '/clazz/index/photolist', query: {clazzId: clazzId}}" class="wlink">查看详情</router-link></td>
							<td><router-link :to="{path:'/clazz/index/questionaire',query:{clazzId:clazzId}}" class="wlink">查看详情</router-link></td>
							<td><router-link :to="{path:'/clazz/index/vote',query:{clazzId:clazzId}}" class="wlink">查看详情</router-link></td>
							<td class="none"><router-link :to="{path:'/clazz/dailyrecord/list',query:{clazzId:clazzId}}" class="wlink">查看详情</router-link></td>
							<!-- <td><router-link :to="{path:'/clazz/dailyrecord/list',query:{clazzId:clazzId}}" class="wlink">查看详情</router-link></td> -->

						</tr>
					</table>
					<div class="tip">
						参与总数指其他班级活动参与情况，包含讨论组发言总条数，照片墙上传总张数，问卷/投票提交总份数，学员提交的日志总篇数
					</div>
				</div>

				<div class="other-left round-layout">
					<h2 class="tit">课程资源概况</h2>
					<div class="top clearfix">
						<div class="left">
							<h3>{{wTotal.resourceCount}}</h3>
							<p>已上传资源</p>
						</div>
						<div class="right border-left">
							<h3><span>{{wTotal.resourceViewCount}}</span></h3>
							<p>资源总阅读量</p>
						</div>
					</div>
					<div class="table-wap" >
							<div class="icon-a-corner"></div>
							<table  v-if="resource.length != 0" >
								<tr v-for = "(item,index) in resource">

									<td class="right-border" width="84%">
										{{item.name}}
									</td>
									<td>
										{{item.viewCount}}
										<div class="triangle-up"></div>
									</td>
								</tr>
								
							</table>
							<table  style="height:300px;" v-else>
								<tr>
									<td colspan="2" align="center" class="no-resouce">
										暂无资源
									</td>
								</tr>
							</table>
					</div>
				</div>
				
			</div>
		</section>
		<!--课程资源概况_end-->	
            <!-- urls:this.formObj.urls,
    		method:this.formObj.method -->
		<!--导出报告-->
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
	// 引入柱状图
	require('echarts/lib/chart/bar')
	// 引入折线图
	require('echarts/lib/chart/line')
	// 引入雷达
  	require('echarts/lib/chart/radar')
  	// 引入scatter 散射图
  	require('echarts/lib/chart/scatter')
	// 引入提示框和标题组件
	require('echarts/lib/component/tooltip')
	require('echarts/lib/component/title')
	require('echarts/lib/component/visualMap')
	require("echarts/lib/component/legend")

	import api from '@/global/resource'

	import { getToken } from '@/filters/userVerify'

	import model from 'model/clazz/index'

	import formsSummit from 'components/formsumit/form'

	import courseSatisfied from 'model/clazz/course'

	export default {
		data() {
			return {
				wTotal: [],
				wSign: [],
				wAll: [],
				wClazzAvgStat: [],	// 班级综合评估平均值
				wOverstepRate: '',  // 本班在所有班级内的综合评价率
				wRateAttend:[],	// 学员出勤率
				wRateHomework: [],	// 作业提交出勤率
				wRateInter: [],		// 班级互动率
				wRateLearn: [],		// 学习心得率
				wRateActivity: [],	// 活动参与率
				wHomeWork: [],
				wHomeManSum: 0,
				wHomeRate: [],
				wHomeCommit: [],
				wHomeTitle: [],
				wHomeFlag: true, 	//是否存在作业
				wScoreFlag: true,	// 是否存在积分
				wAllScore: 0,		// 总积分
				wCourseSatRank: [],		// 课程满意度排行榜
				wCourseSat: [],		// 课程满意度列表


				contentFlag:false,
				defaultBeginDate:"",
				defaultendDate:"",
				beginTime:"",
				endDate:"",
				pickerOptions: {},
				normalDistributionList:[],
				intervalSectionList:{
				 	section:[],
				 	peopleCount:[]
				 },
				 valueDate:[],
				 labelWidth:"120px",
				 resource:[],
        		 ruleForm: {
			         signDate: ''
        		 },
        		 perIntergralFlag:true, //是否存在班级人均积分
        		 distributeFlag:true, //是否存在积分分布
        		 IntergralDate:"",//积分获取当前时间

        		 chartArray:{},
        		 reportBtnFlag:false,
        		 reportBtnSeconds:5,

        		 //项目满意度
        		 satisFlag:false,
        		 satisfact:{

        		 },

        		 
        		
        		 echatShowFlag:false,

        		 clazzAverageRate:"",
        		 clazzLearnFlag:true,
        		 clazzWordFlag:false,

        		 formObj:{
        		 	method:"post",
        		 	data:{},
        		 	urls:"",
        		 },

        		 msgTimes:0,
				 loading1:true,
				 loading2:true,
				 loading3:true,
				 loading4:true,
				 loading5:true,
				 loading6:true,
				 loading7:true,
				 loading8:true,
				 loading9:true,
				 loading10:true,

			}
		},
		created() {
			this.formObj.urls = api.urls.clazzReportdownload;
		},
		mounted() {
			this.reportBtnShow();

			this.wgetClazzTotal();  //班级概况，班级成员	
			this.wgetClazzSign();   //班级签到
			this.wgetClazzDaily();  // 班级综合评估、学员积分获得分布图
			this.wgetWorkStat();	// 作业概况

			//项目满意度
			this.jproSatisfaction();
			//班级学情
			this.jClazzLearning();
			//积分分布图
			this.jgetDistributeData();
			//班级人均积分
			this.jgetIntegralTime();
			//资源top帮
			this.jresouceData();

			// 课程满意度
			this.wgetCourseSat();
			this.wgetCourseSatisfaction();

			//获取剩余短信的次数
			this.clazzLoginRemindTimes();
			
			
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			}
		},
		filters: {
			numTwo(value) {
				value = Number(value);
				return value.toFixed(2);
			},

			mathRound(value){
				return Math.round(value);
			}
		},
		components:{
			formsSummit,
		},
		methods: {

			sentMsg(){
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				var data = {
					clazzId:this.clazzId
				};
				model.clazzLoginAPP(data, (res => {
					if(res.status == 200){

						this.msgTimes = res.data;
						this.$message({
							message: '提醒成功，还剩' + this.msgTimes + '次提醒',
							type: 'success'
						});


					}else{
						this.$message.error(res.message);
					}
					
				}))
			},

			clazzLoginRemindTimes(){
				
				var data = {
					clazzId:this.clazzId
				};
				model.clazzLoginRemindTimes(data, (res => {
					if(res.status == 200){

						this.msgTimes = res.data;

					}else{
						this.$message.error(res.message);
					}
					
				}))
			},

			reportBtnShow(){
		          var _this = this;
		          if(_this.reportBtnSeconds <= 0){
		            _this.reportBtnFlag = true;
		          }else{
		            _this.reportBtnSeconds--;
		            setTimeout(function () {
		              _this.reportBtnShow();
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
    				clazzAvgIntegralStartDate:this.beginTime,
    				clazzAvgIntegralEndDate:this.endDate,
    				token:getToken(),	
    			}
    			for(var i in this.chartArray){
    				data[i] = this.chartArray[i].getDataURL({pixelRatio:1, backgroundColor:'#fff'});
    			}

    			this.formObj.data = data;

    			setTimeout(function(){
    				$("#exportClazzExport").submit();
    			},50)
    			
			},

			jresouceData(){
				var data = {
					clazzId:this.clazzId
				};
				model.clazzResourceViewTopStatistics(data, (res => {
					if(res.status == 200){
						if(!!res.data){
							this.resource = res.data;
						}
					}else{
						this.$message.error(res.message);
					}
					
				}))
			},

			//项目满意度
			jproSatisfaction(){
				var data = {
					clazzId:this.clazzId
				};
				model.clazzSatisfaction(data, (res => {
					if(res.status == 200){
						this.loading3=false;
						if(!!res.data){
							this.satisFlag = true;
							this.satisfact = res.data;

						//data整行不显示
						}else{
							this.satisFlag = false;
						}
					}else{
						this.$message.error(res.message);
					}
					
				}))
			},

			//班级学情
			jClazzLearning(){

				var data = {
					clazzId:this.clazzId
				};
				model.clazzLearnSatistics(data, (res => {
					if(res.status == 200){
						this.loading4=false;
						if(!!res.data && res.data.length != 0){

							this.clazzWordFlag = true;
							this.jclazzLearnData(res.data);

						}else{

							this.clazzLearnFlag = false;
						}
					}else{
						this.$message.error(res.message);
					}
					
				}))

				
			},

			jclazzLearnData(resData){
				//console.log(resData.length);
				let data = [];
				let data1 = [];

				let totalPeople = resData.length;
				let totalFinishRate = 0;

				resData.forEach((item,index) =>{

					//算平均任务完成率
					totalFinishRate += item.finishRate;

					data1[index] = new Array();
					data1[index].push(index,item.finishRate,item.name);
					
				})

				this.clazzAverageRate = (totalFinishRate / totalPeople).toFixed(2);
				data[0] = data1;

				//console.log("=========================");
				// var data = [
				// 	[
				// 		[38, '', ''],
				// 		[0, 20, '贾君彦'],
				// 		[1, 5, '齐齐'],
				// 	]
				// ]
				//console.log(data);
				var myoption = {
				    backgroundColor:"#fff",
				    tooltip: {
								padding: 10,
								backgroundColor: '#222',
								borderColor: '#777',
								borderWidth: 1,
								formatter: function (params) {
										var value = "";
										value += params["data"][2];
										value += '<br/>';
										value += "任务完成率：" +params["data"][1] + "%";
										return value;
								    }
								},
				    // title: [
				    // 	 {
				    //             text: averageRate+"%",
				    //             textAlign: 'center',
				    //             left: '92%',
				    //             top: '25%',
				    //             textStyle: {
				    //                 fontWeight:400,
				    //                 fontSize: 46,
				    //                 color: '#ca4800'
				    //      		}
				            
				            
				    //     },
				    //     {
				    //             subtext: "平均任务完成率",
				    //              textAlign: 'center',
				    //             left: '92%',
				    //             top: '38%',
				    //             subtextStyle: {
				    //                 fontSize: 18,
				    //                 color: '#333'
				    //             }
				            
				            
				    //     },
				    // ],
				    // title : [{
				    //     text: '95%',
				    //     subtext: '班级平均任务完成率',
				    //     x:'center'
    				// }],
				    xAxis: {
				        splitLine: {
				        	show:false,
				        }
				    },
				    yAxis: {
				        splitLine: {
				        	show:false,
				        },
				         axisLabel: {
            				formatter: '{value} %'
        				},
				        scale: true
				    },
				    series: [{
				        name: '班级学情',
				        data: data[0],
				        type: 'scatter',
				        symbolSize: 12,
				        itemStyle: {
							normal: {
								color:"#fd9e59",
								opacity:1
							}
						}
				    }]
				};
				let jclazzLearn = echarts.init(document.getElementById('jclazzLearn'));	

				this.chartArray["image_3"] = jclazzLearn;

				jclazzLearn.setOption(myoption,true);
			},

			jgetDistributeData(){
				var _this = this;
				var data = {
						clazzId:this.clazzId
				};
				model.clazzNormalDistribution(data, (res => {
					if(res.status == 200){
						this.loading6=false;
						if(!!res.data.intervalSectionList && res.data.intervalSectionList.length != 0){
							//获取积分时间
							this.IntergralDate = this.jgetIntergalDate();

							var data = res.data.intervalSectionList;
							//var dataPint = res.data.normalDistributionList;
							data.forEach(function(item,index){
								_this.intervalSectionList.section.push(item.section);
								_this.intervalSectionList.peopleCount.push(item.peopleCount);
							})
							// dataPint.forEach(function(item,index){
							// 	_this.normalDistributionList.push(parseFloat(item.probability));
							// })
							_this.jsetIntegralDistribute(_this.intervalSectionList.section,_this.intervalSectionList.peopleCount);
						}else{
							_this.distributeFlag = false;
						}
						
					}else{
						this.$message.error(res.message);
					}
					
				}))
			},
			jgetIntergalDate(){
				let curDate = new Date();
				let curY = curDate.getFullYear();
				let curM = curDate.getMonth() + 1;
				let curD = curDate.getDate();
				let startDate =  curY + "-" + (curM < 10 ? "0" + curM:curM) + "-" + (curD < 10 ?"0" + curD : curD);
				return startDate;
			},
			jgetIntegralTime(){
				var data = {
					clazzId:this.clazzId
				};
				model.clazzAvgIntegralStartAndEndDate(data, (res => {
					if(res.status == 200) {
                         this.loading5=false;
						if(!!res.data.startDate){

							let days = this.compareDate(res.data.endDate, res.data.startDate);

							//昨天
							var yesterDay = new Date();
	 						yesterDay = (yesterDay.getTime())-24*60*60*1000;
	 						
	 						//最大值的毫秒
	 						var maxDate = new Date(res.data.endDate).getTime();
	 						

	 						//console.log(days);

							//显示30天以内数据
							if(days <= 30){
							
								this.beginTime = res.data.startDate;

								this.endDate = res.data.endDate;

							}else{
								
								this.beginTime = this.startDate(maxDate);
								this.endDate = res.data.endDate;
								
							}
							//最大截止日期小于昨天，则时间显示
							//console.log(new Date(maxDate));
							//console.log(new Date(curDay));
							//console.log(new Date(curDay).getFullYear + "-" + new Date(curDay).getMonth);
							if(maxDate < yesterDay){
								this.contentFlag = true;
								//console.log(this.beginTime);
							}

							//默认日期展示
							this.getDefaultDate(this.beginTime,this.endDate);

							//disable日期
							this.disableDate(this.beginTime,this.endDate);
						

							 //班级人均积分图标展示
							this.jgetIntegralData(this.beginTime,this.endDate); 
						}else{
							this.perIntergralFlag = false
						}
						
						

					} else {
						this.$message.error(res.message);
					}
				}));



			},
			disableDate(beginDate,endDate){
				this.pickerOptions = {
					disabledDate(date) {
				   	    var beginTime = beginDate;
			            var lastTime = endDate;
				        var minDate =  (new Date(beginTime)).getTime();
				        var maxDate =  (new Date(lastTime)).getTime();
				        var time = date.getTime();
				        return time < minDate - 8.64e7 || time > maxDate;
			            
			        } 
				}
				 
			},
			getDefaultDate(beginTime,endDate){
				let bg = this.formatDate(beginTime);
				let ed = this.formatDate(endDate);
				var bg1 = bg.split(",")[0];
				var bg2 = bg.split(",")[1];
				var bg3 = bg.split(",")[2];

				var ed1 = ed.split(",")[0];
				var ed2 = ed.split(",")[1];
				var ed3 = ed.split(",")[2];
				this.valueDate = [
					new Date(bg1,bg2,bg3), 
					new Date(ed1,ed2,ed3)
				]

			},
			formatDate(date){
				let lw = new Date(date);
				let lastY = lw.getFullYear();
				let lastM = lw.getMonth();
				let lastD = lw.getDate();
				let startDate =  lastY + "," + (lastM < 10 ? lastM:lastM) + "," + (lastD < 10 ?lastD : lastD);
				return startDate;
			},
			startDate(MaxendTime){
				var beginTime = 0;
				let lw = new Date(new Date(MaxendTime) - 1000*60*60*24*30);
				let lastY = lw.getFullYear();
				let lastM = lw.getMonth() + 1;
				let lastD = lw.getDate();
				let startDate =  lastY + "-" + (lastM < 10 ? "0" + lastM:lastM) + "-" + (lastD < 10 ?"0" + lastD : lastD);
				beginTime = startDate;
				return beginTime;
			},
			compareDate(MaxendTime,beginTime){
				let days = 0;
				let compareDays = (new Date(MaxendTime).getTime()) - (new Date(beginTime).getTime());
				days = parseInt(compareDays / (1000 * 60 * 60 * 24));
				return days;
			},
			jgetIntegralData(beginDate,endDate){
				if(beginDate != "" && endDate != ""){
					var _this = this;
					var dataX = [];
					var dataY = [];
					let data = {
						clazzId: this.clazzId,
						beginDate:beginDate,
						endDate:endDate
					}
					model.clazzAvgStatistics(data, (res => {
						if(res.status == 200) {
							res.data.forEach(function(item,index){
								dataX.push(item.date);
								dataY.push(item.averageIntegral);
							})
							this.setIntegralLine(dataX,dataY);
						} else {
							this.$message.error(res.message);
						}
					}));
					}
				
			},
			logTimeChange(val){
				this.valueDate = val;
				var _this = this;
				let beginDate = val[0].match(/\d\d\d\d-\d\d-\d\d/)[0];
				let endDate = val[1].match(/\d\d\d\d-\d\d-\d\d/)[0];
				this.beginTime = beginDate;
				this.endDate = endDate;
				this.jgetIntegralData(beginDate,endDate);
			},
			setIntegralLine(dataX,dataY){
				let integralLine = echarts.init(document.getElementById('integral'));

				let integralLineR = echarts.init(document.getElementById('integral-r'));

				this.chartArray["image_4"] = integralLineR;
				


				var myoption = {
					
				     tooltip: {
				        trigger: 'axis'
				    },
				    
					 xAxis: {
				        type: 'category',
				        // axisLine:{
				        // 	lineStyle:{
				        // 		color:"#ccc"
				        // 	}
				        // },
				        data: dataX
				    },
				    yAxis: {
				        type: 'value',
				        // axisLine:{
				        // 	lineStyle:{
				        // 		color:"#ccc"
				        // 	}
				        // }
				        splitLine: {
		                    lineStyle: {
		                        color: ['#f2f0f0']
		                    }
		                }
				    },
				    grid:{
				    	show:true,
				    	borderColor:"#f2f0f0"
				    },
				    series: [{
				    	name:"人均积分",
				        data: dataY,
				        type: 'line',
				        areaStyle: {
				        	normal: {
				        		color:"#f6f9fc"
				        	}
				    	}
				    }],
				    itemStyle:{
				    	normal:{color:'#8897f1'}
				    }
			   }
			    integralLine.clear();
				integralLine.setOption(myoption,true);

				integralLineR.clear();
				integralLineR.setOption(myoption,true);

			},
			jsetIntegralDistribute(integralCont,peopleCount){
				//积分分布图
				 //console.log("积分分数" + integralCont);
				// console.log("人数" + peopleCount);
				let integralDistribute = echarts.init(document.getElementById('integralDistribute'));

				this.chartArray["image_6"] = integralDistribute;
				

					var myoption = {
						   tooltip : {
						        trigger: 'axis',
						        formatter: function(params) {
						        	//console.log(params);
						        	var value = "";
						        	value += params[0].axisValue + "积分区间";
						        	value += '<br/>';
						        	value += "人数：" + params[0].value;
									return value;
					            }
						    },
						    xAxis: {
						        type: 'category',
						        data: integralCont,

						    },
						    yAxis: {
						        type: 'value',
						        splitLine: {
				                    lineStyle: {
				                        color: ['#f2f0f0']
				                    }
				                }
						    },
						    series: [{
						        data: peopleCount,
						        type: 'bar',
						         itemStyle: {
									normal: {
											// opacity: 1.0,
											color:"#b792d9",
											barBorderRadius: 5,
											//shadowColor: '#98aaee'
									}
						        }
						    }]
					}

					integralDistribute.setOption(myoption,true)
			},

			jChartClazzProfile(){
				let chartClazzProfile = echarts.init(document.getElementById('chartClazzProfile'));

				this.chartArray["image_1"] = chartClazzProfile;

				let seriesLabel = {
				    normal: {
				        show: true,
				        color: '#000',
				        position:"right"
				    }
				}
				var myoption = {
					    title: {
					        text: '班级创建数据概况',
					        subtext: '',
					        left:'center'
					    },
					    tooltip: {
					        trigger: 'axis',
					        axisPointer: {
					            type: 'shadow'
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
					        data: ['课程','通知','签到','互评作业','作业','评价','反思','资源'],
					        
					    },
					    series: [
					        {
					            type: 'bar',
					            data: [this.wTotal.courseCount,this.wTotal.noticeCount, this.wTotal.signCount, this.wTotal.reviewHomeworkCount,this.wTotal.homeworkCount, this.wTotal.evaluationCount, this.wTotal.introspectionCount, this.wTotal.resourceCount],
					            label: seriesLabel,
					            itemStyle: {
									normal: {
										color:"#0070c0"
									}
						        }
					        }
					    ]
				};
				chartClazzProfile.setOption(myoption,true);
				
			},

			// 班级概况
			wgetClazzTotal() {
				let data = {
					clazzId: this.clazzId
				}
				model.getClazzTotal(data, (res => {
					// console.log("班级概况",res);
					if(res.status == 200) {
						this.wTotal = res.data;

						this.jChartClazzProfile();
						this.loading1=false;
						this.loading7=false;
						this.loading10=false;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 班级签到
			wgetClazzSign() {
				let data = {
					clazzId: this.clazzId
				}

				model.getClazzSign(data, (res => {
					// console.log("班级签到",res);
					if(res.status == 200) {
						this.wSign = res.data;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 班级综合评估、积分获得分布图
			wgetClazzDaily() {
				let data = {
					clazzId: this.clazzId
				}

				model.getClazzDaily(data, (res => {
					console.log("班级综合评估、学员积分获得分布图",res)
					if(res.status == 200) {
						this.wAll = res.data.clazzDailyStatistics;
						this.loading2=false;
						this.wOverstepRate = res.data.overstepRate;
						this.wClazzAvgStat = res.data.clazzAvgStatistics;

						console.log("clazzDailyStatistics", res.data.clazzDailyStatistics);
						
						if(!!res.data.clazzDailyStatistics) {
							this.wScoreFlag = true;

							// 计算比率
							this.wRatio(this.wAll.attendance, this.wClazzAvgStat.attendance, this.wRateAttend);
							this.wRatio(this.wAll.homeworkSubmit, this.wClazzAvgStat.homeworkSubmit, this.wRateHomework);
							this.wRatio(this.wAll.interactive, this.wClazzAvgStat.interactive, this.wRateInter);
							this.wRatio(this.wAll.learningExperience, this.wClazzAvgStat.learningExperience, this.wRateLearn);
							this.wRatio(this.wAll.activityParticipate, this.wClazzAvgStat.activityParticipate, this.wRateActivity);


							this.setRadar();		// 班级综合评估
							this.setPie();			// 积分获得分布图
							this.wAllScore = this.wAll.attendance + this.wAll.homeworkSubmit + this.wAll.interactive + this.wAll.learningExperience + this.wAll.activityParticipate;
						} else {
							this.wScoreFlag = false;
						}
						// console.log("积分",this.wScoreFlag);
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 比率
			wRatio(_self, _average, arr) {
				let remainder = _self - _average;
				let rate = (_self - _average)/_average;
				rate = Math.round(rate*10000)/100;
				let cla = "", text="";

				if(remainder > 0) {
					cla = 'icon-arrow-on';
					text = '高于平均值'+rate+'%';
				} 
				if(remainder < 0) {
					cla = 'icon-arrow-under';
					text = '低于平均值'+Math.abs(rate)+'%';
				}
				if(remainder == 0) {
					cla = 'icon-equal';
					text = '等于平均值';
				}

				// console.log("cla, text ===", cla, text);
				arr.push(cla);
				arr.push(text);


			},
			
			wgetWorkStat() {
				let data = {
					clazzId: this.clazzId
				}
				// console.log("this wHomeFlag",this.wHomeFlag);
				model.getWorkStat(data, (res => {
					//console.log("作业概况",res);
					if(res.status == 200) {
						this.wHomeWork = res.data.homeworkList;
						this.wHomeManSum = res.data.studentCount;
                    this.loading8=false;
						if(!!res.data.homeworkList) {
							this.wHomeFlag = true;
							this.wHomeArr(this.wHomeWork);
							
						} else {
							this.wHomeFlag = false;
						}

						
						
					} else {
						this.$message.error(res.message);
					}
				})) 
			},
			wHomeArr(arr) {
				arr.map((item) => {
					this.wHomeTitle.push(item.title);
					this.wHomeCommit.push(item.commitCount);
					let rate = parseFloat(item.committedRate);
					this.wHomeRate.push(rate);
				})

				this.setBarLine();	  // 作业概况

			},
			setRadar() {
				let data = [this.wAll.homeworkSubmit, this.wAll.interactive, this.wAll.attendance, this.wAll.activityParticipate, this.wAll.learningExperience];
				let dataAvg = [this.wClazzAvgStat.homeworkSubmit, this.wClazzAvgStat.interactive, this.wClazzAvgStat.attendance, this.wClazzAvgStat.activityParticipate, this.wClazzAvgStat.learningExperience];
				// console.log("data ", data);
				let chartRadar = echarts.init(document.getElementById('chartRadar'));
				this.chartArray["image_2"] = chartRadar;

				chartRadar.setOption({
					title: {
						text: ''
					},
					tooltip: {
				        
				    },
					legend: {
						bottom: 40,
            			left: 'center',
				        data: ['本班评估', '同阶段班级平均值'],
				        textStyle: {
				        	fontSize: 16,
				        }
				    },
					radar: {
						name: {
							textStyle: {
				                color: '#000',
				                fontSize: 16,
				                borderRadius: 3,
				                padding: [3, 5]
				           }
				       },
				       indicator: [
				           { name: '作业完成', max: 100},
				           { name: '班级互动', max: 100},
				           { name: '学员出勤', max: 100},
				           { name: '活动参与', max: 100},
				           { name: '学习心得', max: 100}
				        ],
				        center: ['50%', '50%'],
				        // radius: 120
					},
					series: [{
						name: '雷达图',
						type: 'radar',
						itemStyle: {
			                emphasis: {
			                    // color: ['#D15525', '#620B0B'],
			                    lineStyle: {
			                        width: 4
			                    }
			                }
			            },
						data : [
				            {
				                value : data,
				                name : '本班评估',
				                // symbol: 'rect',
                    // 			symbolSize: 5,
				                label: {
			                        normal: {
			                            show: true,
			                            formatter:function(params) {
			                                return params.value;
			                            }
			                        }
			                    },
				                areaStyle: {
			                        normal: {
			                            opacity: 0.9,
			                            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
			                                {
			                                    color: '#fcbfa7',
			                                    offset: 0
			                                },
			                                {
			                                    color: '#d35d2f',
			                                    offset: 1
			                                }
			                            ])
			                        }
			                    }
				            },
				            {
				            	value: dataAvg,
				            	name: '同阶段班级平均值',
				            	// symbol: 'rect',
                 //    			symbolSize: 5,
			                    lineStyle: {
			                        normal: {
			                            type: 'dashed'
			                        }
			                    },

				            }
				        ]
					}]
				});
			},
			setPie() {
				let chartPie = echarts.init(document.getElementById('chartPie'));

				this.chartArray["image_5"] = chartPie;

				chartPie.setOption({
					tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    // legend: {
				    //     orient: 'vertical',
				    //     left: 'left',
				    //     data: ['活动参与','交流','评价反思','其他','作业提交']
				    // },
				    series : [
				        {
				            name: '积分获得',
				            color: ['#fe7170', '#3cb6fb', '#fd8b74', '#40a9b2', '#8899fc'],
				            type: 'pie',
				            radius: '50%',
				            // center: ['50%', '50%'],
				            label: {
				            	normal: {
				            		formatter: '{abg|}  {b|{b}：}{per|{d}%}',
				                    rich: {

				                        b: {
				                            fontSize: 14,
				                            lineHeight: 33
				                        },
				                        per: {
				                            color: '#000',
				                            fontSize: 14,
				                            // backgroundColor: '#334455',
				                            padding: [2, 4],
				                            borderRadius: 2
				                        }
				                    }
				            	}
				            },
				            data:[
				                {value:this.wAll.integralActivity, name:'活动参与'},
				                {value:this.wAll.integralInteractive, name:'交流'},
				                {value:this.wAll.integralEvaAndInt, name:'评价反思'},
				                {value:this.wAll.integralOther, name:'其他'},
				                {value:this.wAll.integralHomework, name:'作业完成'}
				            ],
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ]
				});
			},
			setBarLine() {
				let dataX = this.wHomeTitle,   // 作业名称
					maxMan = this.wHomeManSum,  //提交人总数
					commanCount = this.wHomeCommit, //提交人
					ratePoint = this.wHomeRate;   // 提交率
				
				let chartBarLine = echarts.init(document.getElementById('chartBarLine'));

				let chartBarLineR = echarts.init(document.getElementById('chartBarLine-r'));

				this.chartArray["image_7"] = chartBarLineR;

				var myOption = {
					// title: {
				 //        text: '作业提交情况分析',
				 //        left: 'center',
				 //        padding: [0, 0, 80, 0],
				 //    },
				    // legend: {
				    	
				    //     data:['已提交人数','提交率']
				    // },
				    grid: {
				        bottom: 100,
				    },
				    tooltip: {
				        trigger: 'axis',
				        axisPointer: {
				            // type: 'cross',
				            // crossStyle: {
				            //     color: '#999'
				            // },
				            label: {
				            	formatter: function (params) {
				            		// console.log("params",params);
				            		params.seriesData[1].value = params.seriesData[1].value+'%';
					                return params.value;
					            },
				            }
				        },
				        formatter: function (params) {
				        	let val;
				        	val = params[1];
				        	return val.name + '<br/>' + params[0].seriesName + '：' + params[0].value + '<br/>' + val.seriesName + '：' + val.value+'%';
				        }
				    },
				    toolbox: {
				        feature: {
				            dataView: {show: true, readOnly: false},
				            magicType: {show: true, type: ['line', 'bar']},
				            restore: {show: true},
				            saveAsImage: {show: true}
				        }
				    },
				    
				    xAxis: [
				        {
				            type: 'category',


				            axisLabel: {
				            	interval:0,
				            	formatter: function (value) {
					                return '{a|'+value+'}';
					            },

		            			align:'center',

				            	rich: {
				            		a: {
							            lineHeight: 18,
							        },
				            		
				            	}
				            },
				            data: dataX.map(function(str) {
				            		return str.replace(/[^\x00-\xff]/g,"$&\x01").replace(/.{14}\x01?/g,"$&\n").replace(/\x01/g,"");
				            	})
				        }
				    ],
				    yAxis: [
				        {
				            type: 'value',
				            name: '完成人数',
				            min: 0,
				            max: Number(maxMan),
				            // interval: ynum,
				            axisLabel: {
				                formatter: '{value} 人'
				            },
				            splitLine: {
			                    lineStyle: {
			                        color: ['#f2f0f0'],
			                        type: 'dashed'
			                    }
			                }
				        },
				        {
				            type: 'value',
				            name: '完成率',
				            min: 0,
				            max: 100,
				            // interval: 10,
				            axisLabel: {
				                formatter: '{value} %'
				            },
				            splitLine: {
			                    lineStyle: {
			                        color: ['#f2f0f0'],
			                        type: 'dashed'
			                    }
			                }
				        }
				    ],
				    series: [
				        {
				            name:'完成人数',
				            type:'bar',
				            color: ['#6eb8ff'],
				            data: commanCount,
				            barWidth: 70,		//宽度
				            
				            itemStyle: {
				                normal: {
				                    color: new echarts.graphic.LinearGradient(
				                        0, 0, 0, 1,
				                        [
				                            {offset: 0, color: '#8dc9ff'},
				                            {offset: 0.5, color: '#77bdff'},
				                            {offset: 1, color: '#67b4ff'}
				                        ]
				                    )
				                },
				                emphasis: {
				                    color: new echarts.graphic.LinearGradient(
				                        0, 0, 0, 1,
				                        [
				                            {offset: 0, color: '#8dc9ff'},
				                            {offset: 0.7, color: '#77bdff'},
				                            {offset: 1, color: '#67b4ff'}
				                        ]
				                    )
				                }
				            }
				        },
				        
				        {
				            name:'提交率',
				            label: {
				            	normal: {
							        show: true,
							        textBorderColor: '#fff',
							        textBorderWidth: 2,
							        color: '#ff7747',
							        formatter: function(params) {
								    	return params.value+'%';
								    }
							    },

				            },
				            type:'line',
				            color: ['#ffa687'],
				            yAxisIndex: 1,
				            data:ratePoint,

				        }
				    ]
				}

				chartBarLine.setOption(myOption,true);

				chartBarLineR.setOption(myOption,true);
			},
			// 课程满意度排行
			wgetCourseSatisfaction() {
				let data = {
					clazzId: this.clazzId,
					order: true
				}
				courseSatisfied.getCourseSatisfaction(data, (res => {
					
					if(res.status == 200) {
						this.loading9=false;
						this.wCourseSatRank = res.data ? res.data.slice(0,5) : [];
						// console.log("满意度", this.wCourseSatRank);
					} else {
						this.$message.error(res.message);
					}
				}));

			},
			// 课程满意度数据
			wgetCourseSat() {
				let data2 = {
					clazzId: this.clazzId,
					order: false
				}
				courseSatisfied.getCourseSatisfaction(data2, (res => {
					
					if(res.status == 200) {
						this.wCourseSat = res.data;
						this.wScatter();
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 课程满意度图
			wScatter() {
				
				//console.log("满意度",this.wCourseSat);
				
				var data1 = this.wCourseSat || [];
				console.log("课程", this.wCourseSat);
				var personNum = 0
				if (!!this.wCourseSat && this.wCourseSat.length > 0) {
					//参与评价人数
					var personNum = this.wCourseSat[0].totalNum;
				} 
				var data = [];
				console.log("personNum", parseInt(personNum));
				data1.forEach(function(item, index) {
					var courseNum = index+1;
					data[index] = new Array();
					data[index].push(courseNum, item.ratio_A, item.submitNum, item.mainTeacherName, item.courseName);

				})
				
				var len = data.length; // 数组长度
				console.log("点图=====", data);
				console.log("点图=====",data1)
				let chartWScatter = echarts.init(document.getElementById('wScatter'));
				this.chartArray["image_8"] = chartWScatter;
				
				

				var schema = [
				    {name: 'num', index: 0, text: '评价人数'},
				    {name: 'rate', index: 1, text: '好评率'}
				];


				var itemStyle = {
				    normal: {
				        opacity: 0.8,
				        shadowBlur: 3,
				        shadowOffsetX: 0,
				        shadowOffsetY: 0,
				        shadowColor: 'rgba(0, 0, 0, 0.5)'
				    }
				};

				var option = {
				    backgroundColor: '#fff',
				    color: [
				        '#6355BC'
				    ],
				    
				    grid: {
				        x: '10%',
				        x2: 150,
				        y: '18%',
				        y2: '10%'
				    },
				    tooltip: {
				        padding: 10,
				        backgroundColor: '#222',
				        borderColor: '#777',
				        borderWidth: 1,
				        formatter: function (obj) {
				            var value = obj.value;
				            return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;max-width: 250px; white-space: normal; ">'
				                + '<p style="margin-bottom: 10px;">课程：'  + value[4] + '</p>'
				                + value[3]
				                + '</div>'
				                + schema[0].text + '：' + value[2] + '<br>'
				                + schema[1].text + '：' + value[1] + '%<br>';
				        }
				    },
				    xAxis: {
				        type: 'value',
				        // name: '课程数量',
				        nameGap: 16,
				        nameTextStyle: {
				            color: '#000',
				            fontSize: 14
				        },
				        max: parseInt(len),
				        splitLine: {
				            show: false
				        },
				        axisLine: {
				            lineStyle: {
				                color: '#000'
				            }
				        }
				    },
				    yAxis: {
				        type: 'value',
				        axisLabel: {
		                    formatter: '{value} %'
		                },
				        // name: '好评率',
				        nameLocation: 'end',
				        nameGap: 20,
				        nameTextStyle: {
				            color: '#000',
				            fontSize: 14
				        },
				        axisLine: {
				            lineStyle: {
				                color: '#000'
				            }
				        },
				        splitLine: {
				            show: false
				        }
				    },
				    visualMap: [
				        {
				            left: 'right',
				            top: '10%',
				            dimension: 2,
				            min: 0,
				            max: parseInt(personNum),
				            itemWidth: 17,
				            itemHeight: 50,
				            calculable: true,
				            precision: 0.1,
				            text: ['圆形大小：参与人数'],
				            textGap: 30,
				            textStyle: {
				                color: '#000'
				            },
				            inRange: {
				                symbolSize: [10, 60]
				            },
				            outOfRange: {
				                symbolSize: [10, 60],
				                color: ['rgba(255,255,255,.2)']
				            },
				            controller: {
				                inRange: {
				                    color: ['#BDC6D7']
				                },
				                outOfRange: {
				                    color: ['#BDC6D7']
				                }
				            }
				        },
				        {
				            left: 'right',
				            bottom: '5%',
				            dimension: 1,
				            min: 0,
				            max: 100,
				            itemWidth: 17,
				            itemHeight: 50,
				            calculable: true,
				            precision: 0.1,
				            text: ['明暗：好评率'],
				            textGap: 30,
				            textStyle: {
				                color: '#000'
				            },
				            inRange: {
				                colorLightness: [1, 0.5]
				            },
				            outOfRange: {
				                color: ['rgba(255,255,255,.2)']
				            },
				            controller: {
				                inRange: {
				                    color: ['#9286DF']
				                },
				                outOfRange: {
				                    color: ['#fff']
				                }
				            }
				        }
				    ],
				    series: [
				        {
				            name: '北京',
				            type: 'scatter',
				            itemStyle: itemStyle,
				            data: data
				        }
				    ]
				};
				chartWScatter.setOption(option);
			}
		}

	}
</script>
<style scoped lang="less">
@import url("../../assets/less/icon.less");

.j-index{

	.tit{
		margin-right: 20px;
		padding-right: 20px;
	}
	.more{
		font-size:16px;
		padding-left: 50px;
		cursor: pointer;
	}
	.dis{
		font-size: 20px;
		color: #35a69d;
		text-align: center;
		font-weight: 400;
	}
	.con{
		margin-top: 0;
		margin-bottom: 10px;
		text-align: center;
		.icon{
			background: #8897f1;
			width: 21px;
			height: 11px;
			margin-right: 10px;
			border-radius: 2px;
			display: inline-block;
		}
	}
	.other{
		.other-left{
			width: 49%;
			float: left;
			height: 500px;
			.top{
				margin:15px auto 40px auto;
				font-size: 18px;
				padding-left: 40px;
				.left,.right{
					float: left;
					padding-left: 65px;
					padding-right: 65px;
					>h3{
						color: #333;
						font-size: 22px;
						text-align: center;
						>span{
							color: #f65e94;
							font-size: 20px;
							font-weight: bold;
						}
					}
					
					>p{
						margin-top: 20px;
					}
					
				}
				.border-left{
					border-left: 1px solid #e6e6e6;
					margin-left: 10px;
				}
			}
			.table-wap{
				border: 1px solid #dfdede;
				border-radius: 5px;
				background: #fff;
				padding:0 10px;
				margin: 20px;
				color: #666;
				width: 90%;
				position: relative;
				.no-resouce{
					font-size:24px;
					font-weight:400;
					height:100%;
					border-bottom:0;
					color: #999;
				}
				.icon-a-corner{
					position: absolute;
					top: -20px;
					right: 30%;
				}
				table{
					width: 100%;
					table-layout: fixed;
					td{
						border-bottom: 1px dashed #f2f0f0;
						line-height: 58px;
						padding-left: 16px;
					}
					.none{
						border-bottom: none;
					}

				}
				
				.right-border{
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					border-right: 1px solid #f2f0f0;
					padding-right: 10px;
				}

			}

		}
		.other-right{
			float: right;
			width: 49%;
			height: 500px;
			.table-wap{
				width: 100%;
				th,td{
					border: 1px solid #efeef2;
					color: #333;
					font-size: 18px;
					height: 60px;
					line-height: 60px;
					text-align: center;
					font-weight: 400;
					.blue{
						color: #35a69d;
						font-weight: 400;
					}
					.bold{
						font-size: 24px;
						color: #333;	
					}
					>span{
						vertical-align: middle;
						margin-right: 4px;
						display: inline-block;
					}
				}
				th{
					font-weight: normal;
				}
				.none{
					border-right: none;
				}
				.bg{
					th,td{
						background: #f8f7fc;
					}
					
				}
				
			}
			.tip{
				width: 90%;
				margin:20px auto 30px auto;
				margin-top: 32px;
				font-size: 16px;
				line-height: 28px;
				margin-top: 32px;
			}
			
		}
	}
	

}

.w-index {
	.j-btn-gray{
    	background: #999!important;
    	cursor:default!important;
	}

	.btn-green{
		display: inline-block;
		font-size: 16px;
		color: #fff;
		padding: 10px 15px;
		i{
			margin-right: 10px;
		}
	}
	.tit {
		font-size: 24px;
		color: #333;
		line-height: 1em;
		padding:20px;
		.icon-ques {
			margin-right: 20px;
			vertical-align: middle;
		}
		>.date {
			font-size: 16px;
			color: #333;
		}
		.link {
			float: right;
			font-size: 16px;
			color: #289cf6;
			i{
				width: 12px;
				height:12px;
			}
		}
	}
	.round-layout {
		margin-bottom: 20px;
	}
}
.w-seclink {
	
	.export{
		float: right;
		padding-right: 10px;
		margin-top: 13px;
	}
	.sec-nav {
		padding: 24px 0;
		display: flex;
		li {
			flex: 0.7;
			border-right:1px solid #e9e9e9;
			text-align: center;
			&:last-child{
				border-right: 0;
			}

			a {
				display: block;
				color: #666;
				font-size: 18px;
				line-height: 1.4em;
				transition:all .3s ease-in-out;
				i {
					vertical-align: middle;
				}
				>h3 {
					font-size: 24px;
					color: #333;
					font-weight: 500;
				}
				&:hover {
					margin-top: -5px;
					color: #35a69d;
					>h3 {
						color: #35a69d;
					}
					.icon-course-purple {
						background-image: url("../../assets/img/icon/icon-course-green.png");
					}
					.icon-sign-pink {
						background-image: url("../../assets/img/icon/icon-sign-green.png");
					}
					.icon-work-blue {
						background-image: url("../../assets/img/icon/icon-work-green.png");
					}
					
					.icon-eval-ora {
						background-image: url("../../assets/img/icon/icon-eval-green.png");
					}
					.icon-intro-purple {
						background-image: url("../../assets/img/icon/icon-intro-green.png");
					}
					.icon-resource-green {
						background-image: url("../../assets/img/icon/icon-resource-green2.png");
					}
					.icon-post-ora {
						background-image: url("../../assets/img/icon/icon-post-green.png");
					}
					.icon-discuss-blue {
						background-image: url("../../assets/img/icon/icon-discuss-green.png");
					}
					
				}
			}
			&:nth-child(5){
				flex: 1;
			}
		}
	}
}
.w-charts {
	
}
.w-radar {
	width: 100%;
	.radar {
		width: 60%;
		float: left;
		padding-left: 50px;

		.legend {
			position: relative;
			top: -50px;
			font-size: 16px;
			line-height: 1em;
			color: #000;
			text-align: center;
			.ora {
				display: inline-block;
				margin-right: 5px;
				width: 22px;
				height: 12px;
				background-color: #f7ac8f;
				border-radius: 2px;
			}
			
		}
	}
	#chartRadar {
		width: 630px;
		height: 630px;
	}
	.explain {
		float: left;
		width: 420px;
		padding: 30px 43px;
		margin-top: 110px;
		background: #FFFFFF;
		box-shadow: 0 2px 29px 21px rgba(0,0,0,0.03);

		>h3 {
			width: 270px;
			font-size: 24px;
			color: #000;
			line-height: 1em;
			text-align: center;
			>span{
				font-size: 34px;
				color: #e66432;
			}
		}
		li {
			float: left;
			width: 155px;
			line-height: 1em;
			color: #333;
			font-size: 16px;
			margin-bottom: 25px;
			margin-right: 20px;
			&:nth-child(2n) {
				margin-right: 0;
			}
			.num {
				font-size: 20px;
				color: #333;
				display: inline-block;
				// width: 35px;
			}
			i {
				cursor: pointer;
			}
			.icon-ques {
				width: 18px;
				height: 18px;
				cursor: pointer;
				vertical-align: text-bottom;
			}
			.icon-arrow-on {
				display: inline-block;
				width: 11px;
				height: 14px;
				background: url("../../assets/img/icon/icon-arrow-on.png");
				background-size: 100% 100%;
				vertical-align: 1px;
			}
			.icon-arrow-under {
				display: inline-block;
				width: 11px;
				height: 14px;
				background: url("../../assets/img/icon/icon-arrow-under.png");
				background-size: 100% 100%;
				vertical-align: 1px;
			}
			.icon-equal {
				display: inline-block;
				width: 9px;
				height: 8px;
				background: url("../../assets/img/icon/icon-equal.png");
				background-size: 100% 100%;
				vertical-align: 3px;
			}
		}
		.tip {
			font-size: 16px;
			color: #666;
			margin-top: 20px;
		}

		.progress-box {
			width: 250px;
			margin: 40px auto;
			
			.bar-bg {
				position: relative;
				width: 100%;
				height: 8px;
				background: #E2E6EA;
				border-radius: 100px;
			}
			.bar-rate {
				position: absolute;
				height: 8px;
				background: #06CA96;
				border-radius: 100px;
			}
			.bar-text {
				text-align: center;
				margin-top: 10px;
				font-size: 16px;
				color: #333333;
				.green {
					color: lighten(#003D00, 10%);
				}
			}
		}
	}
}
.w-nocont {

	height: 467px;
	margin-bottom: 20px;
	text-align: center;
	color: #999;
	font-size: 24px;
	padding-top: 150px;
}
.w-pie,
.w-integral {
	box-sizing: border-box;
	width: 585px;
	height: 467px;
	float: left;

	#chartPie {
		width: 90%;
		height: 400px;
		margin: 0 auto;
	}
}
.w-integral {
	height: 467px;
	margin-left: 20px;
}

.w-member,
.w-sign {
	padding-bottom: 20px;
	box-sizing: border-box;
	float: left;
	width: 585px;
	margin-right: 20px;

	.cont {
		padding: 40px;
		li {
			float: left;
			height: 185px;
			border-right: 1px solid #e9e9e9;
			&:last-child{
				border-right: 0;
			}
		}
		.sum {
			width: 185px;
			text-align: center;
			padding-top: 50px;
			>.rate {
				font-size: 34px;
				font-weight: 500;
				color: #ee7b4e;
				margin-bottom: 10px;
				line-height: 1em;
			}
			.pink {
				color: #ff86aa;
			}
			>.explain {
				font-size: 18px;
				color: #666;
			}
		}
		.single-clazz{
			color: #666;
			font-size: 18px;
			padding-top: 10px;
			padding-left: 30px;
			width: 62%;

			.top ,.bottom{
				dt,dd{
					float: left;
					text-align: center;

					>span{
						color: #333;
						font-size: 20px;
					}
				}
				.dis{
						padding-top: 7px;
				}
				
			}
			.top{
				dt,dd{
					width: 30%;
					
				}
			}
			.bottom{
		
				dt,dd{
					margin-top: 27px;
					width: 50%;
				}
			}


			.msg-btn{
				margin-top: 24px;
				text-align: center;
				p{
					margin-top: 5px;
					font-size: 14px;
					color:#999;
					text-align: center;
				}
				.btn-green-square:hover{
					background: #34A49B;
				}
				.btn-green-square{
					position: relative;
					&::after{
						position: absolute;
						right: -10px;
						top: -10px;
						width: 27px;
						height: 15px;
						content: "";
						background: url("../../assets/img/expert/vipLogo.png") center center no-repeat;
						background-size: 27px 14px;
					}
				}
			}
		}
		.single {
			padding-left: 60px;
			padding-top: 20px;
			>p {
				font-size: 18px;
				color: #666;
				line-height: 1em;
				margin-bottom: 20px;
				>span {
					color: #333;
					font-size: 20px;
					font-weight: 500;
				}
			}
		}
	}
}
.w-sign {
	margin-right:0;
	
}
.w-barline {
	width: 100%;
	#chartBarLine {
		width: 100%;
		height: 500px;
	}
	.chart-tit {
		text-align: center;
		font-size: 22px;
		color: #333;
		margin-bottom: 25px;
		line-height: 1em;
	}
	.legend {
		text-align: center;
		font-size: 16px;
		line-height: 1em;
		color: #000;
		>span {

			margin-right: 48px;
		}
		i {
			display: inline-block;
		}
		.blue {
			width: 22px;
			height: 12px;
			background-color: #77bdff;
			border-radius: 2px;
		}
		.circle {
			box-sizing: border-box;
			width: 50px;
			height: 0;
			border-top: 1px solid #ffa687;
			position: relative;
			top: -5px;
			z-index: 1;
			
			&:before {
				position: absolute;
				z-index: 2;
				top: -8px;
				left: 17px;
				content: "";
				width: 14px;
				height: 14px;
				border-radius: 14px;
				background-color: #fff;
				border: 1px solid #ffa687;
			}
		}
	}
}
.wlink {
	color: #289cf6;
}
.w-satisfied,
.w-satisfied-list
 {
	box-sizing: border-box;
    float: left;
    width: 584px;
    margin-right: 20px;
    padding-top: 35px;

    .chart-tit {
		font-size: 24px;
		color: #333;
		line-height: 24px;
		text-align: center;
		padding-right: 40px;

		>a {
			float: right;
			font-size: 20px;
			color: #289CF6;

		}

    }
}
.w-satisfied-list {
	margin-right: 0;
	text-align: left;
	float: right;
	padding-left: 30px;
	.chart-tit {
		margin-bottom: 30px;
	}
	.w-table-sat {
		width: 520px;
		border: 1px solid #F2F0F0;
		th {
			font-size: 18px;
			color: #333333;
			background-color: #f8f7fc;
			padding: 15px 10px;
			border-bottom: 1px solid #F2F0F0;

		}
		td {
			padding: 12px 10px;
			font-size: 16px;
			color: #666;
			span {
				display: inline-block;
				width: 200px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			
			
		}
	}
}
.jclazzLearn-rg{
	border-bottom: 1px solid #000;
	position: absolute;
	left: 901px;
	height: 255px;
	top:100px;
	padding-top: 70px;
	padding-left: 70px;
	text-align: center;
	p{
		color: #ce4e00;
		font-size: 46px;
		font-weight: 400;
		font-family: "微软雅黑";
		-webkit-mask-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#d35906), to(#b92b00));
	}
	.txt{
		color: #484848;
		font-size: 18px;
		color: #333;
		padding-top: 5px;

	}
}
.j-project{
	padding-left: 10%;
	padding-top: 5%;
	padding-bottom: 4%;
	color:#333;
	
	.left{
		float: left;
		text-align: center;
		padding-right: 5%;
		padding-top: 2%;
		padding-bottom: 2%;
		.title{
			font-size: 50px;
			color: #ee7b4e;
			font-weight: 400;
		}
		p{
			padding-top: 28px;
		}
		border-right: 1px solid #e9e9e9;
	}
	.mid{

		float: left;
		text-align: center;
		padding-left: 5%;
		padding-top: 2%;
		padding-bottom: 2%;
		.title{
			font-size: 50px;
			color: #04908a;
			font-weight: 400;
		}
		p{
			padding-top: 28px;
		}
	}
	.rg{
		float: left;
		border: 1px solid #d6dcdb;
		background:#fcfcfc;
		width:45%;
		margin:0 auto 0 10%;
		padding-top: 20px;
		padding-bottom: 20px;
		position: relative;

		dl{
			padding-left: 15%;
			span{
				color:#00958f;
				font-size: 24px;
				font-weight: 400;
			}
			dt,dd{
				float: left;
				padding: 15px 0;
				width: 200px;

			}
		}
		.cor{
			position: absolute;
			background: url("../../assets/img/clazz/leftconer.png") no-repeat;
			width: 46px;
			height: 71px;
			left: -24px;
			top:33%;
		}

		
	}

}
</style>