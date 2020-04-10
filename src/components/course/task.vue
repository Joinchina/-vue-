<style scoped="" lang="less">
	@import "../../assets/less/icon.less";
	@import "../../assets/less/btn-search.less";
	#iframeId{
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
	}
	.icon-begin,
	.icon-shut-down,
	.icon-time,
	.icon-edit3 {
		vertical-align: text-bottom;
	}
	#wtaskAll {
		
		.top-box {
			box-sizing: border-box;
			height: 90px;
			padding: 0 36px;
			.tabnav {
				width: 400px;
				float: left;
				font-size: 20px;
				li {
					float: left;
					a {
						display: inline-block;
						padding: 36px 18px 24px;
						color: #333;
					}
					&.active a {
						color: #34a69c;
						border-bottom: 4px solid #34a69c;
					}
				}
			}
			.handle {
				padding: 28px 0 18px;
			}
			.type {
				float: right;
				width: 90px;
				outline: 0;
				margin-right: 6px;
			}
		}
		.taskList {
			background-color: #fff;
			border: 1px solid #f0f0f0;
			border-radius: 6px;
			box-shadow: -2px 0 3px #f0f0f0, 2px 0 3px #f0f0f0, 0 -2px 3px #f0f0f0, 0 2px 3px #f0f0f0;
			li {
				border-top: 1px solid #dfe6ec;
				padding: 23px 30px;
			}
			.desc {
				width: 82%;
				float: left;
				border-right: 1px solid #dfe6ec;
			}
			.icon-wres {
				width: 25px;
				height: 25px;
				vertical-align: text-bottom;
			}
			h3 {
				font-size: 20px;
				color: #333;
				line-height: 1.2em;
				margin-bottom: 20px;
			}
			.title {
				color: #333;
				font-size: 20px;
				font-weight: 500;
				&:hover {
					color: #1077d7;
				}
			}
			.status {
				font-size: 16px;
				color: #999;
			}
			.statistics {
				box-sizing: border-box;
				width: 100%;
				font-size: 16px;
				padding-left: 85px;
				color: #999;
				&.three {
					padding-left: 105px;
				}
				> span,a {
					display: inline-block;
					width: 23%;
				}
				a {
					color:  #1077d7;
				}
			}
			.operate {
				height: 66px;
				line-height: 66px;
				display: table-cell;
				width: 18%;
				font-size: 15px;
				padding-left: 30px;
				float: left;
				vertical-align: middle;
				color: #1077d7;
				text-align: center;
				&.three {
					line-height: 1.5em;
				}
				.no-full {
			        padding-top: 20px;
			    }
				.more {
					line-height: 1.5em;
					color: #1077d7;
				}
				.screen {
					width: 170px;
					color: #fd7e23;
					margin: 10px auto;
				}
				.el-icon-caret-bottom {
					color: #999;
				}
				.icon-del {
					width: 15px;
					height: 15px;
				}
				a {
					display: inline-block;
					color:  #1077d7;
					&:first-child {
						margin-right: 30px;
					}
					&.long {
						margin-right: 10px;
					}
				}
				i {
					vertical-align: -2px;
				}
			}
		}
	}
.photoclass{
	float:left;
	margin-left:20px
}
</style>
<template>
	<div id="wtaskAll">
		<!-- <section class="top-box wrapper clearfix">
			<ul class="tabnav clearfix">
				<li><router-link :to="{path: '/course/all', query: {clazzId: clazzId}}">全部课程</router-link></li>
				<li class="active"><router-link :to="{path: '/course/task', query: {clazzId: clazzId}}">项目任务</router-link></li>
			</ul>
			<div class="handle clearfix">
				<button class="add-clazz" type="button" @click="addAct = true">
					<i class="icon-circle-add"></i>
					添加活动
				</button>
			</div>
		</section> -->
		
		<div class="handle clearfix">
			<Goback passtitle="项目任务" path="/course/all" :query="query"></Goback>
			<button class="add-clazz" type="button" @click="addAct = true">
				<i class="icon-circle-add"></i>
				添加活动
			</button>
		</div>
		<ul class="taskList load-minheight"
		v-loading="loading"
	    :element-loading-text="$globalParam.loadText"
	    :element-loading-spinner="$globalParam.loadSpinner"
	    :element-loading-background="$globalParam.loadText">
			
			<template v-for="task in taskList">
				<!-- 增加一个作业 -->
				<li class="clearfix" v-if="task.type == 'HOMEWORK'">
					<div class="desc">
						<h3>
							【{{task.type | actType}}】
							<router-link class="title" :to="{ path: '/activity/homework/result', query: {clazzId:clazzId, courseId:courseId, activityId: task.id, crumb:'task'}}">{{task.title}} </router-link>
							<span class="status">（{{task.status | actStatus}}）</span>
						</h3>
						<p class="statistics">
							<router-link :to="{ path: '/activity/homework/mansum', query: {clazzId:clazzId, courseId:courseId, activityId: task.id, crumb:'task'}}">提交人数：{{task.commitCount}}/{{task.totalCount}}</a></router-link>
							<span>合格率：{{task.pass}}%</span>
							<span>优秀率：{{task.excellent}}%</span>
						</p>
					</div>
					<div class="operate three">
						<router-link class="screen" target="_blank" :to="{ path: '/activity/homework/homeworkview/', query:{activityId:task.id, paperKey:paperKey(task.id)}}">
							<i class="icon-large-screen"></i>
							大屏幕
						</router-link>
						<p :class="task.status == 'END' ? 'no-full' : ''">
							<a href="javascript:;" @click="exportWork(task.id)">
								<i class="icon-export-gray"></i>
								导出
							</a>
							<el-dropdown class="more" trigger="click" placement="bottom-start"  v-if="task.operationStatus == true">
								<span class="el-dropdown-link">
									更多
									<i class="el-icon-caret-bottom"></i>
								</span>
								<el-dropdown-menu class="more-menu" slot="dropdown">
									<el-dropdown-item v-if="task.openMode=='MANUAL' && task.status == 'WAITING'" @click.native="actUpdateStatus(task.id, 'start')">
										<i class="icon-begin"></i>
										立即开放
									</el-dropdown-item>
									<el-dropdown-item v-if="task.openMode == 'MANUAL' && task.status == 'INPROGRESS'" @click.native="actUpdateStatus(task.id, 'end')">
										<i class="icon-shut-down"></i>
										立即关闭
									</el-dropdown-item>
									<el-dropdown-item v-show=" task.status == 'WAITING'" @click.native="WorkEditPop(task)">
										<i class="icon-edit3"></i>     
										编辑
									</el-dropdown-item>
									<el-dropdown-item v-show=" task.status != 'WAITING' && task.openMode == 'TIMING'"  @click.native="setTimehomework(task)">
										<i class="icon-time"></i>
										时间设置
									</el-dropdown-item>
									<el-dropdown-item @click.native="workDelete(task.id)">
										<i class="el-icon-delete2"></i>
										删除
									</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</p>
						
					</div>
				</li>
				<!-- 学员互评作业 -->
				<li class="clearfix" v-if="task.type == 'REVIEWHOMEWORK'">
					<div class="desc">
						<h3>
							【{{task.type | actType}}】
							<router-link class="title" :to="{ path: '/clazz/mutualDetail', query: {clazzId:clazzId, courseId:courseId, activityId: task.id}}">{{task.title}} </router-link>
							<span class="status">（{{task.status | actStatus}}）</span>
						</h3>
						<p class="statistics">
							<router-link :to="{ path: '/clazz/mutualDetail', query: {clazzId:clazzId, courseId:courseId, activityId: task.id}}">提交人数：{{task.commitCount}}/{{task.totalCount}}</router-link>
							<router-link :to="{ path: '/clazz/mutualPeoples', query: {clazzId:clazzId, courseId:courseId, activityId: task.id, nowIndex:'first',count:parseInt(task.totalCount - task.commitCount)+';'+task.unReviewCount+';'+task.finishCount}}">完成人数：{{task.finishCount}}/{{task.totalCount}}</router-link>
							<span>合格率：{{task.pass}}%</span>
							<span>优秀率：{{task.excellent}}%</span>

						</p>
					</div>
					<div class="operate three">
						<router-link target="_blank" v-if="task.status !=='END'" class="screen" :to="{ path: '/activity/homework/homeworkview/', query:{activityId:task.id, paperId:task.paperId, paperKey:paperKey(task.id)}}">
							<i class="icon-large-screen"></i>
							大屏幕
						</router-link>
						<p :class="task.status == 'END' ? 'no-full' : ''">
							<a href="javascript:;" @click="exportMutualWork(task)">
								<i class="icon-export-gray"></i>
								导出
							</a>
							<el-dropdown class="more" trigger="click" placement="bottom-start"  v-if="task.operationStatus == true">
								<span class="el-dropdown-link">
									更多
									<i class="el-icon-caret-bottom"></i>
								</span>
								<el-dropdown-menu class="more-menu" slot="dropdown">
									<!-- <el-dropdown-item v-if="task.status == 'WAITING'" @click.native="actUpdateStatus(task.id, 'start')">
										<i class="icon-begin"></i>
										立即开放
									</el-dropdown-item>
									<el-dropdown-item v-if="task.status == 'INPROGRESS'" @click.native="actUpdateStatus(task.id, 'end')">
										<i class="icon-shut-down"></i>
										立即关闭
									</el-dropdown-item> -->
									<el-dropdown-item v-if="task.status == 'WAITING'" @click.native="WorkEditPop(task)">
										<i class="icon-edit3"></i>
										编辑
									</el-dropdown-item>
									<el-dropdown-item v-show=" task.status != 'WAITING' && task.openMode == 'TIMING'"  @click.native="setTimehomework(task)">
									<i class="el-icon-time"></i>
									时间设置
								</el-dropdown-item>
									<el-dropdown-item @click.native="workDelete(task.id)">
										<i class="el-icon-delete"></i>
										删除
									</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</p>
						
					</div>
				</li>
                 <!-- 问卷 -->
				<li class="clearfix" v-if="task.type == 'QUESTIONNAIRE'">
					<div class="desc">
						<h3>
							【{{task.type | actType}}】
							<router-link class="title" :to="{ path: '/activity/questionare/result', query: {clazzId:clazzId, activityId: task.id, crumb:'task' }}">{{task.title}} </router-link>
							<span class="status">（{{task.status | actStatus}}）</span>
						</h3>
						<p class="statistics">
							<router-link :to="{ path: '/activity/vote/man', query: {clazzId:clazzId,activityId: task.id, paperId:task.paperId, crumb:'task' }}">提交人数：{{task.submitNum}}/{{task.totalNum}}</router-link>
							<span>题目数量：{{task.quesNum}}</span>
						</p>
					</div>
					<div class="operate three">
						<router-link class="screen" v-if="task.status !=='END'" target="_blank" :to="{ path: '/activity/vote/fullScreen/', query:{activityId:task.id, paperId:task.paperId, paperKey:paperKey(task.id)}}">
							<i class="icon-large-screen"></i>
							大屏幕
						</router-link>
						<p :class="task.status == 'END' ? 'no-full' : ''">
							<a href="javascript:;" @click="exportPaper(task)">
								<i class="icon-export-gray"></i>
								导出
							</a>
							<el-dropdown class="more" trigger="click" placement="bottom-start"  v-if="task.operationStatus == true">
								<span class="el-dropdown-link">
									更多
									<i class="el-icon-caret-bottom"></i>
								</span>
								<el-dropdown-menu class="more-menu" slot="dropdown">
									<el-dropdown-item v-if="task.status == 'WAITING'" @click.native="actUpdateStatus(task.id, 'start')">
										<i class="icon-begin"></i>
										立即开放
									</el-dropdown-item>
									<el-dropdown-item v-if="task.status == 'INPROGRESS'&&task.openMode=='MANUAL'" @click.native="actUpdateStatus(task.id, 'end')">
										<i class="icon-shut-down"></i>
										立即关闭
									</el-dropdown-item>
									
									<el-dropdown-item @click.native="handleDelPaper(task.paperId)" v-if="task.operationStatus == true">
										<i class="el-icon-delete2"></i>
										删除
									</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
							<!-- <a href="javascript:;" @click="handleDelPaper(task.paperId)" v-if="task.operationStatus == true">
								<i class="icon-del"></i>
								删除
							</a> -->
						</p>
					</div>
				</li>
                <!-- 投票 -->
				<li class="clearfix" v-if="task.type == 'VOTE'">
					<div class="desc">
						<h3>
							【{{task.type | actType}}】
							<router-link class="title" :to="{ path: '/activity/vote/result', query: {clazzId:clazzId,activityId: task.id, crumb:'task' }}">{{task.title}} </router-link>
							<span class="status">（{{task.status | actStatus}}）</span>
						</h3>
						<p class="statistics">
							<router-link :to="{ path: '/activity/vote/man', query: {clazzId:clazzId,activityId: task.id, paperId:task.paperId, crumb:'task'}}">提交人数：{{task.submitNum}}/{{task.totalNum}}</router-link>
							<span>题目数量：{{task.quesNum}}</span>
						</p>
					</div>
					<div class="operate three">
						<router-link class="screen"  v-if="task.status !=='END'" target="_blank" :to="{ path: '/activity/vote/fullScreen/', query:{activityId:task.id, paperId:task.paperId, paperKey:paperKey(task.id)}}">
							<i class="icon-large-screen"></i>
							大屏幕
						</router-link>
						<p :class="task.status == 'END' ? 'no-full' : ''">
							<a href="javascript:;" @click="exportPaper(task)">
								<i class="icon-export-gray"></i>
								导出
							</a>
							<el-dropdown class="more" trigger="click" placement="bottom-start"  v-if="task.operationStatus == true">
								<span class="el-dropdown-link">
									更多
									<i class="el-icon-caret-bottom"></i>
								</span>
								<el-dropdown-menu class="more-menu" slot="dropdown">
									<el-dropdown-item v-if="task.status == 'WAITING'" @click.native="actUpdateStatus(task.id, 'start')">
										<i class="icon-begin"></i>
										立即开放
									</el-dropdown-item>
									<el-dropdown-item v-if="task.status == 'INPROGRESS'&&task.openMode=='MANUAL'" @click.native="actUpdateStatus(task.id, 'end')">
										<i class="icon-shut-down"></i>
										立即关闭
									</el-dropdown-item>
									
									<el-dropdown-item @click.native="handleDelPaper(task.paperId)" v-if="task.operationStatus == true">
										<i class="el-icon-delete2"></i>
										删除
									</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
							<!-- <a href="javascript:;" @click="handleDelPaper(task.paperId)" v-if="task.operationStatus == true">
								<i class="icon-del"></i>
								删除
							</a> -->
						</p>
					</div>
				</li>
                <!-- 讨论组 -->
				<li class="clearfix" v-if="task.type == 'DISCUSS'">
					<div class="desc">
						<h3>
							【{{task.type | actType}}】
							<router-link class="title" :to="{ path: '/activity/discuss/result', query: {clazzId:clazzId, courseId:courseId, activityId: task.id, crumb:'task'} }">{{task.title}} </router-link>
							<span class="status">（{{task.status | actStatus}}）</span>
						</h3>
						<p class="statistics three">
							<span>发言数量：{{task.chatCount}}</span>
							<span>发言人数：{{task.peopleCount}}</span>
							<span>状态：{{task.openStatus | openStatus}}</span>
						</p>
					</div>
					<div class="operate">
						<a href="javascript:;" class="long" @click="getDiscussSync(task.id)" >
							<i class="icon-sync"></i>
							同步群组成员
						</a>
						<el-dropdown class="more" trigger="click" placement="bottom-start" v-if="task.operationStatus == true">
							<span class="el-dropdown-link">
								更多
								<i class="el-icon-caret-bottom"></i>
							</span>
							<el-dropdown-menu class="more-menu" slot="dropdown">
								<el-dropdown-item @click.native="setDisTime(task.id)" >
									<i class="icon-time"></i>
									时间设置
								</el-dropdown-item>
								<el-dropdown-item  v-if="task.operationStatus == true"  @click.native="discussDelete(task.id)">
									<i class="el-icon-delete2"></i>
									删除
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
				</li>
                <!-- 照片墙 -->
				<li class="clearfix" v-if="task.type == 'PHOTOWALL'">
					<div class="desc">
						<h3>
							【{{task.type | actType}}】
							<router-link class="title" :to="{ path: '/activity/photo/view', query: {clazzId:clazzId, courseId:courseId, activityId: task.id, crumb:'task' }}">{{task.title}} </router-link>
						</h3>
						<p class="statistics three">
							<span>图片数量：{{task.photoNum}}</span>
						</p>
					</div>
					<div class="operate three">
			            <a href="javascript:void(0)" target="_blank" class="screen" @click="photoScreen(task.id)">
								<i class="icon-large-screen"></i>
								大屏幕
			            </a>
						<p>
							<a href="javascript:;" @click="exportPhoto(task.id)" :class="{photoclass:task.level=='CLAZZ'}">
								<i class="icon-export-gray"></i>
								导出
							</a>
							<el-dropdown class="more" trigger="click" placement="bottom-start" v-if="task.operationStatus == true && task.level=='COURSE'">
								<span class="el-dropdown-link" >
									更多
									<i class="el-icon-caret-bottom"></i>
								</span>
								<el-dropdown-menu class="more-menu" slot="dropdown">
									<el-dropdown-item @click.native="photoEdit(task.id)">
										<i class="icon-edit3"></i>
										编辑
									</el-dropdown-item>
									<el-dropdown-item @click.native="photoDelete(task.id)" >
										<i class="el-icon-delete2"></i>
										删除
									</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</p>
					</div>
				</li>
                <!-- 反思 -->
				<li class="clearfix" v-if="task.type == 'INTROSPECTION'">
					<div class="desc">
						<h3>
							【{{task.type | actType}}】
							<router-link class="title" :to="{ path: '/activity/introspection/result', query: {clazzId:clazzId,activityId: task.id, crumb:'task' }}">{{task.title}} </router-link>
						</h3>
						<p class="statistics">
							<router-link :to="{ path: '/activity/vote/man', query: {clazzId:clazzId, paperId:task.paperId, crumb:'task' }}">提交人数：{{task.submitNum}}/{{task.totalNum}}</router-link>
							<span>题目数量：{{task.quesNum}}</span>
						</p>
					</div>
					<div class="operate three">
						<router-link class="screen"  v-if="task.status !=='END'" target="_blank" :to="{ path: '/activity/vote/fullScreen/', query:{activityId:task.id, paperId:task.paperId, paperKey:paperKey(task.id)}}">
							<i class="icon-large-screen"></i>
							大屏幕
						</router-link>
						<p>
							<a href="javascript:;" @click="exportPaper(task)">
								<i class="icon-export-gray"></i>
								导出
							</a>
				            <a href="javascript:;" v-if="role === 'ADMIN' || role === 'ORGADMIN' || role ==='PROJECTADMIN' || role ==='CLAZZMANAGER'" @click="setTimeErM(task.id)">
				              <i class="icon-time"></i>
				              时间设置
				            </a>
						</p>
						
					</div>
				</li>
                 <!-- 评价 -->
				<li class="clearfix" v-if="task.type == 'EVALUATION'">
					<div class="desc">
						<h3>
							【{{task.type | actType}}】
							<router-link class="title" :to="{ path: '/activity/evaluation/result', query: {clazzId:clazzId,activityId: task.id, crumb:'task' }}">{{task.title}} </router-link>
						</h3>
						<p class="statistics">
							<router-link :to="{ path: '/activity/vote/man', query: {clazzId:clazzId, paperId:task.paperId, crumb:'task' }}">提交人数：{{task.submitNum}}/{{task.totalNum}}</router-link>
							<span>题目数量：{{task.quesNum}}</span>
						</p>
					</div>
					<div class="operate three">
						<router-link class="screen"  v-if="task.status !=='END'" target="_blank" :to="{ path: '/activity/vote/fullScreen/', query:{activityId:task.id, paperId:task.paperId, paperKey:paperKey(task.id)}}">
							<i class="icon-large-screen"></i>
							大屏幕
						</router-link>
						<p>
							<a href="javascript:;" @click="exportPaper(task)">
								<i class="icon-export-gray"></i>
								导出
							</a>
				            <a href="javascript:;" v-if="role === 'ADMIN' || role === 'ORGADMIN' || role ==='PROJECTADMIN' || role ==='CLAZZMANAGER'" @click="setTimeErM(task.id)">
				              <i class="icon-time"></i>
				              时间设置
				            </a>
						</p>
						
					</div>
				</li>
			</template>
			<!-- 资源列表 -->
			<li class="clearfix" v-for="item in resList">
				<div class="desc">
					<h3>
						【资源】
						<i :class="item.type | resType" class="icon-wres"></i>
						<a href="javascript:;" @click="handleView(item.resourceId, item.type)" class="title">{{item.name}}</a>
					</h3>
					<p class="statistics" v-if="item.viewCount !== undefined">
						<span>查看次数：{{item.viewCount}}</span>
					</p>
				</div>
				<div class="operate">
					<a href="javascript:;" @click="resourceDel(item.id)">
						<i class="icon-del"></i>
						删除
					</a>
				</div>
			</li>
			<!-- 日志列表 -->
			<li class="clearfix" >
				<div class="desc">
					<h3>
						【日志】
						<router-link class="title" :to="{ path: '/clazz/dailyrecord/list', query: {clazzId:clazzId}}">日志任务要求 </router-link>
					</h3>
					<p class="statistics">
						<router-link :to="{ path: '/clazz/dailyrecord/commit', query: {clazzId:clazzId}}">学员完成情况：{{logTask.finishedUserCount}}/{{parseInt(logTask.finishedUserCount+logTask.unFinishedUserCount)}}</router-link>
						<span>日志篇数：至少完成{{logTask.minCountLimit}}篇日志</span>
					</p>
				</div>
				<div class="operate">
					<a href="javascript:;" @click="exportlog = true">
						<i class="icon-export-gray"></i>
						导出
					</a>
				</div>
			</li>
		</ul>
		<!-- 添加活动 -->
		<add-act
		:dialogAddAct.sync="addAct"
		:courseId="courseId"
		taskName = "项目任务"
		@getwork="getwork"
		:defaultFlag = "true" ></add-act>
		<!-- 编辑照片墙 -->
		<photo-edit
		:dialogEditPhoto.sync="editPhoto"
		:activityId = "photoActId"
		:courseId = "courseId"
		@updateList="getTaskList"></photo-edit>
		<!-- 讨论组设置时间 -->
		<set-time
		:dialogEditTime.sync="disSetTime"
		:activityId = "disActId"
		@updateList="getTaskList"
		></set-time>
		<!-- 导出作业 -->
		<export-work
		:dialogExport.sync="exportWorkPop"
		:activityId = "workActId"
		></export-work>
		<!-- 编辑作业 -->
		<work-edit
		:dialogEditWork.sync="editWork"
		:activityId = "workActId"
		:courseId = "courseId"
		:defaultFlag = "true"
		taskName = "项目任务"
		@updateList="getTaskList">
		</work-edit>

		<!-- 编辑学员互评作业 -->
		<mutual-edit
		:dialogEditMutual.sync="editMutual"
		:activityId = "workActId"
		:courseId = "courseId"
		:defaultFlag = "false"
		taskName = "taskName"
		@updateList="getTaskList"></mutual-edit>


		<!-- 起止时间设置 -->
		<er-time-set
		:dialogSetTime.sync="setTimeEr"
		:activityId = "activityId">
		</er-time-set>

		<!-- 进行中的学员互评作业设置时间 -->
		<settimemutual
		:dialogSetTimeMutual.sync="settimeMutual"
		:activityId = "activityId">
		</settimemutual>

    	<!-- 查看资源 url-->
		<view-url
			:dialogViewUrl.sync="viewUrlShow"
			:resId = "resId"
			></view-url>
		<!-- 查看资源 Text-->
		<view-text
			:dialogViewText.sync="viewTextShow"
			:resId = "resId"></view-text>
		<!-- 查看pdf -->
		<modal :show.sync = "viewPdfShow" contWidth = '80%' bgColor="transparent">
			<div slot="body" style="height:100%">
				<iframe v-if="details.type==='WORD' || details.type==='PPT' || details.type==='PDF'" :src="details.linkUrl" id="showIframe" frameborder="0" width="100%" height="100%"></iframe>
				
			</div>
		</modal>
        <!-- 进行中的作业设置时间 -->
		<settimehomework
		:dialogSetTimehomework.sync="settimehomework"
		:activityId = "activityId">
		</settimehomework>
		<!-- 查看视频 -->
		<modal :show.sync = "viewVideoShow" bgColor="transparent" contWidth = '80%' :before-close="videoClose">
			<div slot="body" style="height:100%">
				<video :src="details.linkUrl" controls="controls"  width="100%" height="100%" id="myVideo">
				您的浏览器不支持video标签
				</video>
			</div>
		</modal>
		<!--导出-->
		<export-pop :dialogExport.sync="exportlog" :clazzId="clazzId"></export-pop>
		<!--导出报告-->
		<iframe :src="iframeUrl" frameborder="0" id="iframeId"></iframe>
		<forms-summit 
				:methods = "formObj.method"
				:urls = "formObj.urls"
				:data = "formObj.data"
				ref="postdata">
		</forms-summit>
	</div>
</template>
<script>
	import model from 'model/course/course'
	import log from 'model/clazz/dailyrecord'
	import addAct from 'components/course/add_activity'
	import result from 'model/activity/result'
	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'
	import delpaper from 'model/activity/paperview'
	import { delTip } from '@/global/open'
	import photo from 'model/activity/photo'
	import photoEdit from 'components/activity/photo/edit'
	import bus from '@/global/bus'
	import course from 'model/course/course'
	import discuss from 'model/activity/discuss'
	import setTime from 'components/activity/discuss/set_time'
    import setTimehomework from 'components/activity/discuss/sethomeworktime'
	import work from 'model/activity/homework'
	import mutualWork from "model/activity/mutual";
	import exportWork from 'components/activity/homework/export_pop'

	import mutualEdit from "components/clazz/editMutual";
	import settimemutual from "components/clazz/ecitMutualEndTime";

	import workEdit from 'components/activity/homework/edit'
  	import erTimeSet from 'components/course/er_time_set'
  	import { getCurRole } from '@/filters/userVerify'
  	// 查看资源
  	import resource from 'model/resource/resource'
  	import viewUrl from 'components/resource/view_url'
	import viewText from 'components/resource/view_text'
	import Modal from 'base/modal/modal'
	import Goback from 'base/goback/goback'
	import exportPop from 'components/clazz/dailyrecord/export_pop'
	import formsSummit from 'components/formsumit/form'
	export default {
		data () {
			return {
				taskList: [],
				resList: [],	//关联课程资源列表
				clazzId: "",
				courseId: "",
        		activityId:"",
				addAct: false,
				createPhoto: false,
				editPhoto: false,
				photoActId:"",		// 照片墙编辑id
				disSetTime:false,		// 讨论组设置时间
				disActId:"",			//讨论组活动Id
				exportWorkPop: false,			// 导出作业弹出框
				editWork: false,			//编辑作业弹出框
				editMutual: false,//编辑学员互评作业弹出框
				setTimeEr:false, //起止时间设置
				settimeMutual: false,//时间设置----学员互评作业作业
				workActId: "",				//作业Id
				// 查看资源
				viewUrlShow: false,
				viewTextShow: false,
				viewPdfShow: false,
				viewVideoShow: false,
				resId: '',		//资源id
				details: {},	//资源详情
				settimehomework:false,   //  时间设置
				loading:true,
				query:{},
				logTask: {},	// 日志管理相关
				exportlog: false,	// 导出日志
				iframeUrl:'',
				formObj:{
					method:"post",
					urls:API.urls.experttutu,
					data:{}
				},
			}
		},
	    computed: {
	      role() {
	        return getCurRole();
	      }
	    },
		filters: {
			actType(type) {
				let res = "";
				switch(type) {
					case "DISCUSS":
					res = "讨论组";
					break;
					case "HOMEWORK":
					res ="作业";
					break;
					case "QA":
					res = "问答";
					break;
					case "EVALUATION":
					res = "评价";
					break;
					case "INTROSPECTION":
					res ="反思";
					break;
					case "LEAVEMESSAGE":
					res = "留言";
					break;
					case "VOTE":
					res = "投票";
					break;
					case "QUESTIONNAIRE":
					res = "问卷";
					break;
					case "PHOTOWALL":
					res = "照片墙";
					break;
					case "REVIEWHOMEWORK": 
					res = "学员互评作业";
					break;

				}
				return res;
			},
			actStatus(status) {
				let res = "";
				switch(status) {
					case "WAITING":
					res = "未开始";
					break;
					case "INPROGRESS":
					res = "进行中";
					break;
					case "END":
					res = "已结束";
					break;
					case "REVIEWING":
					res = "评阅中";
					break;
				}
				return res;
			},
			openStatus(openStatus) {
				let res = "";
				switch(openStatus) {
					case "PUBLIC":
					res = "公开";
					break;
					case "PRIVATE":
					res = "隐私";
					break;
				}
				return res;
			},
			resType (value) {  
		      	switch(value) {
		      		case 'PDF':
		      			return 'icon-pdf2';
		      		case 'WORD':
		      			return 'icon-word2';
		      		case 'URL':
		      			return 'icon-link';
		      		case 'PPT':
		      			return 'icon-ppt';
		      		case 'TEXT':
		      			return 'icon-text';
		      		case 'VIDEO':
		      			return 'icon-video';
		      	}  
		    }  
		},
		created() {
			this.clazzId = this.$route.query.clazzId;
			this.getTaskList();
			
			// 创建照片墙成功更新数据
			bus.$on('updateList', ()=>{
				this.getTaskList();
			});
		    // 添加讨论组成功更新数据-- 多条数据
		    bus.$on('discussSuccess', ()=>{
		    	this.getTaskList();
		    });
		},
		mounted() {
			this.query = {
		        clazzId: this.clazzId
		    }
		    this.getTaskData();
		},
		// mounted() {
		// 	this.$nextTick(() => {
		// 		this.getTaskList();
		// 	});
		// },
		methods: {
			getwork(){
				this.getTaskList()
			},
			setTimeErM(activityId){
				this.activityId = activityId;
				this.setTimeEr = true;
			},
			setTimehomework(param) {
				if(param.type=="REVIEWHOMEWORK"){
					this.settimeMutual = true
				}else if(param.type=="HOMEWORK"){
					this.settimehomework = true;
				}
				this.activityId = param.id;
			},
			photoScreen(activityId){
				
				window.open("/static/page/photo_screen.html?clazzId="+this.clazzId+"&courseId="+this.courseId+"&activityId="+activityId+"&sort=time&token="+getToken());

			},
			paperKey (activityId) {
				return activityId + "_" + new Date().getTime();
			},
			getTaskList() {
				let data = {
					clazzId: this.clazzId,
				}
				// console.log("data", data);
				model.getItemTaskList(data, ( res => {
					 console.log("getItemTaskList",res);
					if(res.status == 200) {
						this.loading = false;
						this.taskList = res.data;
						this.courseId = res.data[0].courseId;
						// console.log("taskList",res.data);
						this.resListCourse();   //关联课程资源列表
						this.reTaskList();
						
					} else {
						this.loading = false;
						this.$message.error(res.message);
					}
				}));
			},
			reTaskList() {
				this.taskList.forEach((val, ind, items) => {
					// console.log("val",val);
					let _this = this;
					let activityId = val.id;
					// 问卷，投票，评价，反思
					if( val.type == "VOTE" || val.type == "QUESTIONNAIRE" || val.type == "INTROSPECTION" || val.type == "EVALUATION") {
						let reso = this.getResTotal(val.id, function(reso) {
							_this.$set(_this.taskList[ind], 'submitNum', reso.submitNum);
							_this.$set(_this.taskList[ind], 'paperId', reso.paperId);
							_this.$set(_this.taskList[ind], 'totalNum', reso.totalNum);
							_this.$set(_this.taskList[ind], 'quesNum', reso.quesNum);
							// console.log("reso", reso)
						});
					} else if (val.type == "PHOTOWALL") {
						let resphoto = this.getPhotoCount(val.id, function(resPhoto) {
							// console.log("resPhoto",resPhoto.photoCount);
							_this.$set(_this.taskList[ind],'photoNum', resPhoto.photoCount);
							_this.$set(_this.taskList[ind],'levelstatus', resPhoto.level);
						});
					} else if (val.type == "DISCUSS") {
						this.getDiscussCount(val.id, function(resDis) {
							_this.$set(_this.taskList[ind],'chatCount', resDis.chatCount);
							_this.$set(_this.taskList[ind],"peopleCount",resDis.peopleCount);
							
						});
					} else if (val.type == "HOMEWORK") {
						this.getWorkCount(val.id, function(resWork) {
							let pass = resWork.totalCount ? ((resWork.passCount/resWork.totalCount)*100).toFixed(2) : 0;
							let excellent = resWork.totalCount ? ((resWork.excellentCount/resWork.totalCount)*100).toFixed(2) : 0;
							_this.$set(_this.taskList[ind],'commitCount', resWork.commitCount);
							_this.$set(_this.taskList[ind],'totalCount', resWork.totalCount);
							_this.$set(_this.taskList[ind],'excellent', excellent);
							_this.$set(_this.taskList[ind],'pass', pass);
						});
					}else if (val.type == "REVIEWHOMEWORK") {
						this.getMutualWorkCount(val.id, function(resWork) { 
							let pass = resWork.totalCount? ~~(resWork.passCount / resWork.commitCount * 100).toFixed(2): 0;
							let excellent = resWork.totalCount? ~~(resWork.excellentCount / resWork.commitCount * 100).toFixed(2): 0;		
							let finishCount = resWork.finishCount? resWork.finishCount: 0;
							_this.$set(_this.taskList[ind],"commitCount",resWork.commitCount);
							_this.$set(_this.taskList[ind],"unReviewCount",resWork.unReviewCount); 
							_this.$set(_this.taskList[ind],"totalCount",resWork.totalCount);
							_this.$set(_this.taskList[ind], "excellent", excellent);
							_this.$set(_this.taskList[ind], "pass", pass);
							_this.$set(_this.taskList[ind], "finishCount", finishCount);
						});
					}
				});
			},
			// 问卷，投票，评价，反思 统计数据
			getResTotal(activityId,callback) {
				let data = {
					activityId: activityId
				}
				let resTotal = {};
				result.getCourseActPaperStat(data, (res) => {
					// console.log("getResTotal",res);
					if(res.status == 200) {
						resTotal.paperId = res.data.questionPaperId;
						resTotal.submitNum = res.data.submitNum;
						resTotal.totalNum = res.data.totalNum;
						resTotal.quesNum = res.data.questionCount;
					} else {
						this.$message.error(res.message);
					}
					// console.log("resTotal",resTotal)
					callback(resTotal);
				});
			},
			// 问卷，投票，评价，反思 导出
			exportPaper(task) {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				this.iframeUrl='../../../../static/page/questionadmin.html?activityId='+task.id+'&token='+getToken()
				setTimeout(()=>{
					let _iframe = document.getElementById('iframeId').contentWindow;
					let myhtml =_iframe.document.getElementById('gethtml').innerHTML;					
					let data={
						fileName:task.title,
						document:'<!DOCTYPE html>'+'<html>'+myhtml+'</html>',
						token:getToken()
					}
					this.formObj.data=data
					setTimeout(()=>{
						this.$refs.postdata.submitData();							 
					},50)	
				},500)
				
				// "'../../../../static/page/questionadmin.html?activityId='+activityId+'&token='+token"
				console.log(task)
				// window.open(API.urls.exportResPDF+"?paperId="+paperId+"&token="+getToken());
			},
			// 删除问卷，投票
			handleDelPaper(paperId) {
				let str = "确定删除吗？";
				delTip(this, str, this.delPaper, paperId);
			},
			delPaper (paperId) {
				let _this = this;
				let data = {
					paperId: paperId
				}
				delpaper.postPaperDel(data, (res => {
					if(res.status == 200) {
						this.$message({
							type: 'success',
							message: '删除成功',
							duration: 1000,
							onClose() {
			                	// _this.tableData.splice(index, 1);
			                	_this.getTaskList();
			                }
			            });
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 照片墙统计数据
			getPhotoCount(activityId, callback) {
				let data = {
					activityId: activityId
				}
				let resPhoto = {};
				photo.getPhotoCount(data, (res => {
					if(res.status == 200) {
						resPhoto.photoCount = res.data.count;
					} else {
						this.$message.error(res.message);
					}
					callback(resPhoto);
				}));
			},
			// 照片墙导出压缩包
			exportPhoto(activityId) {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.photoExport+"?activityId="+activityId+"&token="+getToken());
			},
			// 照片墙编辑，删除
			photoEdit(id) {
				this.photoActId = id;
				this.editPhoto = true;
			},
			photoDelete(id) {
				let str = "确定删除此照片墙活动吗？";
				delTip(this, str, this.delCourseAct, id);
			},
			workDelete(id) {
				let str = "确定删除此作业吗？";
				delTip(this, str, this.delCourseAct, id);
			},
			discussDelete(id) {
				let str = "确定删除此讨论组吗？";
				delTip(this, str, this.delCourseAct, id);
			},
			delCourseAct(id) {
				let _this = this;
				let data = {
					activityId: id
				}
				course.delCourseAct(data, (res => {
					// console.log("delCourseAct",res)
					if(res.status == 200) {
						this.$message({
							type: 'success',
							message: '删除成功',
							duration: 1000,
							onClose() {
								_this.getTaskList();
							}
						});
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 讨论组统计
			getDiscussCount(activityId, callback) {
				let data = {
					activityId: activityId
				}
				let resDis = {};
				discuss.getDiscussCount(data, (res => {
					// console.log("getDiscussCount",res)
					if(res.status == 200) {
						resDis.peopleCount = res.data.peopleCount;
						resDis.chatCount = res.data.chatCount;
					} else {
						this.$message.error(res.message);
					}
					callback(resDis);
				}));
			},
			// 讨论组同步成员
			getDiscussSync(activityId) {
				let data = {
					activityId: activityId
				}
				discuss.getDiscussSync(data, (res => {
					// console.log("getDiscussSync",res)
					if(res.status == 200) {
						this.$message.success(res.data);
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 讨论组时间设置
			setDisTime(activityId) {
				this.disActId = activityId;
				this.disSetTime = true;
			},
			// 作业导出弹出框
			exportWork(activityId) {
				// console.log('导出作业弹出框',activityId);
				this.workActId = activityId;
				this.exportWorkPop = true;
			},
			// 互评作业导出弹出框
			exportMutualWork(task) {
				if(task.commitCount&&task.commitCount>0){
					this.workActId = task.id;
					this.exportWorkPop = true;
				}else{
					this.$message.error("暂无学员提交作业");
				}
			},
			// 编辑作业弹出框
			WorkEditPop(param) {
				if(param.type=="REVIEWHOMEWORK"){
					this.editMutual = true
				}else if(param.type=="HOMEWORK"){
					this.editWork = true;
				}
	      		this.workActId = param.id;
			},
			// 统计作业
			getWorkCount(activityId, callback) {
				let data = {
					activityId: activityId
				}
				let resWork = {};
				work.workTotal(data, (res => {
					// console.log("getWorkCount",res);
					if(res.status == 200) {
						resWork.commitCount = res.data.commitCount;
						resWork.totalCount = res.data.totalCount;
						resWork.excellentCount = res.data.excellentCount;	//优秀
						resWork.passCount = res.data.passCount;		//及格
					} else {
						this.$message.error(res.message);
					}
					callback(resWork);
				}));
			},

			// 统计学员互评作业
			getMutualWorkCount(activityId, callback) {
				let data = {
					activityId: activityId
				};
				let resWork = {};
				mutualWork.workTotal(data, res => {
					if (res.status == 200) {
						resWork.commitCount = res.data.commitCount;
						resWork.totalCount = res.data.totalCount;
						resWork.excellentCount = res.data.excellentCount; //优秀
						resWork.passCount = res.data.passCount; //及格
						resWork.finishCount = res.data.finishCount; //完成
						resWork.unReviewCount = res.data.unReviewCount; //未评阅
					} else {
						this.$message.error(res.message);
					}
					callback(resWork);
				});
			},
			// 关联课程资源列表
			resListCourse() {
				let data = {
					courseId: this.courseId
				}
				// console.log("courseId", this.courseId);
				course.resListCourse(data, (res => {
					// console.log("关联课程资源列表 ",res);
					if(res.status == 200) {
						this.resList = res.data;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			resourceDel(id) {
				let str = "是否确认删除该资源？";
				delTip(this, str, this.resDelCourse, id);
			},
			// 删除资源
			resDelCourse(id) {
				let _this = this;
				let data = {
					id: id
				}
				course.resDelCourse(data, (res => {
					// console.log("删除关联资源",res);
					if(res.status == 200) {
						this.$message({
							type: 'success',
							message: '删除成功',
							duration: 1000,
							onClose() {
								_this.resListCourse();
							}
						});
						this.resListCourse();
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			handleView(id, type) {
				this.resId = id;
				if(type === 'URL') {
		    		this.viewUrlShow = true;
		    	}
		    	if(type === 'TEXT') {
		    		this.viewTextShow = true;
		    	}
		    	if(type === 'WORD' || type === 'PPT' || type === 'PDF') {
		    		let viewPdfId = id;
		    		this.viewPdfShow = true;
		    		this.getResource(viewPdfId);
		    		
		    	}
		    	if(type === 'VIDEO') {
		    		let viewVideoId = id;
		    		this.viewVideoShow = true;
		    		this.getResource(viewVideoId);
		    		
		    	}
			},
			getResource(resId) {
		    	let data = {
		    		id: resId
		    	}
		    	resource.resDetails(data, (res => {
		    		if(res.status == 200) {
		    			this.details = res.data;
		    			if(this.resType === 'FOLDER') {
		    				this.name = res.data.name;
		    			}
		    			
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));
		    },
		    videoClose() {
		    	document.getElementById("myVideo").pause();
		    	this.viewVideoShow = false;
		    },
		    getTaskData(){
				let data = {
					clazzId:this.clazzId
				}
				log.getUserlogRule(data,(res) =>{
					if(res.status == 200){
						this.logTask = res.data;
					}else{
						this.$message.error(res.message);
					}
				})
			},
			// 作业、问卷、投票修改活动状态
		    actUpdateStatus(id, status) {
		    	let data = {
		    		activityId: id,
		    		status: status
		    	}
		    	result.updateStatus(data,(res => {
		    		if(res.status == 200) {
		    			this.getTaskList();
		    			this.$message.success("活动状态修改成功！");
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));
		    }
		},
		beforeDestroy() {
			bus.$off("updateList");
			bus.$off("discussSuccess");
		},
		components: {
			addAct,
			photoEdit,
			setTime,
			exportWork,
			workEdit,
		    erTimeSet,
		    viewUrl,
			viewText,
			Modal,
			'settimehomework':setTimehomework,
			Goback,
			exportPop,
			mutualEdit,
			settimemutual,
			formsSummit,
		}
	}
</script>