<template>
	<div class="w-homeList">
		<section class="handle">
			<button type="button" class="btn-green-line" @click="homeworkCreate" >
				<i class="icon-add"></i> 创建学员互评作业
			</button>

			<button type="button" class="btn-green" @click="exportList">
				<i class="icon-export-white"></i> 导出
		   </button>
			
		</section>

		<section class="list round-layout mutualList">
			
			<el-table class="" 
				:data = "items"
				:empty-text="loading_font"
				stripe>
				<el-table-column
					prop="title"
					label="标题"
					show-overflow-tooltip
					width="150">
				</el-table-column>
				<el-table-column
					prop="createUserName"
					label="发起人"
					show-overflow-tooltip
					width="100">
				</el-table-column>
				<el-table-column
					prop="courseName"
					label="关联课程"
					show-overflow-tooltip
					width="110">
				</el-table-column>
				<el-table-column
					label="状态"
					show-overflow-tooltip
					width="90">
					<template slot-scope="scope">
						{{scope.row.status|statusFilter}}
					</template>
				</el-table-column>
				<el-table-column
					prop="commitCount"
					label="已提交"
					show-overflow-tooltip
					width="80">
				</el-table-column>
				<el-table-column
					prop="finishedCount"
					label="已完成"
					show-overflow-tooltip
					width="80">
				</el-table-column>
				<el-table-column
					prop="unFinishedCount"
					label="未完成"
					show-overflow-tooltip
					width="80">
				</el-table-column>
				<el-table-column
					prop="homeworkAttachment"
					label="附件总数"
					show-overflow-tooltip
					width="80">
					<template slot-scope="scope">
						<span>
							{{scope.row.homeworkAttachment|filterAttachment}}
						</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="finishedRate"
					label="完成率"
					show-overflow-tooltip
					width="80">
				</el-table-column>
				<el-table-column
					prop="excellenceRate"
					label="优秀率"
					show-overflow-tooltip
					width="80">
				</el-table-column>
				<el-table-column
					prop="avgScore"
					label="平均得分"
					show-overflow-tooltip
					width="80">
					<template slot-scope="scope">
						{{scope.row.avgScore|avgScoreFilter}}
					</template>
				</el-table-column>
				<el-table-column
				    label="操作"
				    >
				    <template slot-scope="scope" >
				    	<template v-if="scope.row.status !=='add'">
				    		<el-button  type="text" @click.native="handleView(scope.$index, scope.row)">查看</el-button>
				    		<el-button type="text" @click.native="handleExport(scope.$index, scope.row)">导出作业</el-button>
				    		<el-button type="text" v-if="scope.row.operationStatus && scope.row.status == 'WAITING'" @click.native="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button type="text" v-if="scope.row.operationStatus" @click.native="handleDel(scope.$index, scope.row)">删除</el-button> 

							<el-button v-if="scope.row.operationStatus && scope.row.status != 'WAITING' && scope.row.openMode != 'MANUAL'" type="text" @click.native="timeSet(scope.$index, scope.row)">时间设置</el-button>

				    	</template>
				    </template>
			    </el-table-column>
			</el-table>
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
			<!--导出学员作业-->
		    <export-homework
		        :dialogExport.sync = "exportHomeWork"
		        :activityId = "activityId"
		    ></export-homework>

		    <!-- 创建作业 -->
			<work-create
				:dialogAddMutual.sync = "addWork"
				:needLink="true"
				@updateClazzWorkList = "getList">

			</work-create>

			<!-- 编辑作业 -->
			<work-edit
				:dialogEditMutual.sync="editWork"
				:activityId = "activityId"
				:courseId = "courseId"
				@updateList="getList"></work-edit>

			<!-- 起止时间设置 -->
			<!-- <er-time-set
			:dialogSetTime.sync="setTimeEr"
			:activityId = "activityId">
			</er-time-set> -->
			<!-- 进行中的作业设置时间 -->
			<setTimehomework
			:dialogSetTimeMutual.sync="settime"
			:activityId = "activityId">
			</setTimehomework>
		</section>
	</div>
</template>
<script>
	import model from 'model/activity/mutual'
	import { delTip } from '@/global/open'
	import course from 'model/course/course'
	import exportHomework from 'components/activity/homework/export_pop'
	import workCreate from 'components/clazz/createMutualWork'
	import workEdit from 'components/clazz/editMutual'

	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'

	import setTimehomework from 'components/clazz/ecitMutualEndTime'

	export default {
		data() {
			return {
				items : [],
				cur_page : 1,
				totalElements : 1,
				activityId : '',
				courseId : '',
				statusName : {
					'WAITING': '未开始',
					'INPROGRESS': '进行中',
					'END': '已结束'
				},
				addWork :false,
				editWork : false,
				exportHomeWork : false,
				loading_font :'加载中...',
				settime :false,  // 起止时间设置
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			}
		},
		filters: {
			statusFilter:function (value) {
				if(!value) return '';
				switch (value) {
					case "WAITING":
						return "未开始"
						break;
					case "INPROGRESS":
						return "进行中"
						break;
					case "REVIEWING":
						return "评阅中"
						break;
					case "END":
						return "已结束"
						break;
				}
			},
			avgScoreFilter(num){
				let text ='';
				if(!num){
					text="0"
				}else if(~~num==num){
					text=num+'.00'
				}else{
					text=num.toFixed(2);
				}
				return text
			},
			filterAttachment(num){
				let value = 0;
				if(!!num){
					value= num
				}
				return value
			}
		},
		mounted() {
			this.getList();
		},
		methods: {
			timeSet(index,row){
				this.activityId = row.id;
				this.settime = true;
			},
			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getList();
			},
			getList() {
				let data = {
					clazzId: this.clazzId,
					number: this.cur_page,
					size: '20'
				}
				model.ReviewgetActivityList(data, (res => {
					let _this = this;
					// console.log("作业列表",res);
					if(res.status == 200) {
						this.totalElements = res.data.totalElements;
						this.items = res.data.content;
						if(this.items.length==0){
                              this.loading_font="暂无数据"
						}
					} else {
						this.$message.error(res.message);
					}
				}));

			},
			handleView(index, row) {
				let activityId = row.id,
					courseId = row.courseId;
				this.$router.push({
					path:"/clazz/mutualDetail",
					query: {
						clazzId: this.clazzId,
						courseId: courseId,
						activityId: activityId
					}
				})
			},
			handleEdit(index, row) {
				this.activityId = row.id;
				this.courseId = row.courseId;
				this.editWork = true;
			},
			handleDel(index, row) {
				// let id = row.id;
				let str = "确定要删除改作业吗？"
				delTip(this, str, this.workDel, row.id);
			},
			workDel(id) {
				let _this = this;
				let data = {
					activityId: id
				}
				course.delCourseAct(data, (res => {
					if(res.status == 200) {
						this.$message({
							type: 'success',
							message: '删除成功',
							duration: 1000,
							onClose() {
								_this.getList();
							}
						});
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			handleExport(index, row) {
				if(row.commitCount&&row.commitCount>0){
					this.activityId = row.id;
					this.exportHomeWork = true;
				}else{
					this.$message.error("暂无学员提交作业");
				}
				
			},
			exportList() {
				if(this.$store.getters.getOrgVipInfo.vip){
					window.open(API.urls.ReviewExportMutualList+"?clazzId="+this.clazzId+"&token="+getToken());
				}else{
					this.$store.state.vipFuncPopFalg = true;
				}
			},

			homeworkCreate(){
				this.addWork = true;
			}

		},
		components: {
			exportHomework,
			workCreate,
			workEdit,
			setTimehomework,
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/reset-element-ui/user-table.css";
	@import "../../../assets/less/icon.less";
	.btn-green{
		display: inline-block;
		margin-left: 15px;
		font-size: 16px;
		padding: 10px 15px;
		border-radius: 5px;
		i{
			vertical-align: middle;
		}
	}
	.btn-green-line{
    	background-color: #ecf6f5;
    	font-size: 16px;
    	padding: 10px 15px;
    	display: inline-block;
    	i{
    		vertical-align: middle;
    	}
    }
	.w-homeList {
		.handle {
			text-align: right;
			.btn-green {
				display: inline-block;
				margin-bottom: 20px;
			}
		}
		.list {
			padding: 20px;
		}
		.page-sum {
			font-size: 14px;
		    color: #666;
		    text-align: right;
		    padding-top: 15px;
		}
	}
</style>
<style lang="less">
	.mutualList{
		.el-table__body-wrapper{
			overflow-x: auto;
		}
		.el-table__body{
			width: auto !important;
		}
	}
	
</style>
