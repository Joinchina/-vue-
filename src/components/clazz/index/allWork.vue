<template>
	<div class="w-homeList">
		<section class="handle">
            <button type="button" class="btn-green-line" @click="mutualHomeworkCreate" >
				<i class="icon-add"></i> 创建学员互评作业
			</button>
			<button type="button" class="btn-green-line" @click="homeworkCreate" >
				<i class="icon-add"></i> 创建作业
			</button>

			<button type="button" class="btn-green" @click="exportList">
				<i class="icon-export-white"></i> 导出
		   </button>
			
		</section>

		<section class="list round-layout">
			
			<el-table class="" 
				:data = "items"
				:empty-text="loading_font"
				stripe>
				<el-table-column
					prop="title"
					label="标题"
					width="150">
				</el-table-column>
				<el-table-column
					prop="createUserName"
					label="发起人"
					width="100">
				</el-table-column>
				<el-table-column
					prop="courseName"
					label="关联课程"
					width="110">
				</el-table-column>
				<el-table-column
					label="状态"
					width="90">
					<template slot-scope="scope">
						{{statusName[scope.row.status]}}
					</template>
				</el-table-column>
				<el-table-column
					prop="finishedCount"
					label="已完成"
					width="80">
				</el-table-column>
				<el-table-column
					prop="unFinishedCount"
					label="未完成"
					width="80">
				</el-table-column>
				<el-table-column
					prop="homeworkAttachment"
					label="附件总数"
					width="80">
					<template  slot-scope="scope">
						{{scope.row.homeworkAttachment | attrCount}}
					</template>
				</el-table-column>
				<el-table-column
					prop="finishedRate"
					label="完成率"
					width="80">
				</el-table-column>
<!-- 				<el-table-column
					prop="qualifiedRate"
					label="合格率"
					width="90">
				</el-table-column> -->
				<el-table-column
					prop="excellenceRate"
					label="优秀率"
					width="80">
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
				:dialogAddWork.sync = "addWork"
				@updateClazzWorkList = "getList">

			</work-create>

			<!-- 编辑作业 -->
			<work-edit
				:dialogEditWork.sync="editWork"
				:activityId = "activityId"
				:courseId = "courseId"
				@updateList="getList"></work-edit>

            <!-- 创建作业 -->
			<mutual-work-create
				:dialogAddMutual.sync = "addMutualWork"
				:needLink="true"
				@updateClazzWorkList = "getList">

			</mutual-work-create>

			<!-- 编辑作业 -->
			<mutual-work-edit
				:dialogEditMutual.sync="editMutualWork"
				:activityId = "activityId"
				:courseId = "courseId"
				@updateList="getList"></mutual-work-edit>

			<!-- 起止时间设置 -->
			<!-- <er-time-set
			:dialogSetTime.sync="setTimeEr"
			:activityId = "activityId">
			</er-time-set> -->
			<!-- 进行中的作业设置时间 -->
			<setTimehomework
			:dialogSetTimehomework.sync="settime"
			:activityId = "activityId">
			</setTimehomework>
            <setTimeMutualhomework
                :dialogSetTimeMutual.sync="setMutualTime"
                :activityId = "activityId">
			</setTimeMutualhomework>
		</section>
	</div>
</template>
<script>
	import model from 'model/activity/homework'
	import { delTip } from '@/global/open'
	import course from 'model/course/course'
	import exportHomework from 'components/activity/homework/export_pop'
	import workCreate from 'components/clazz/create_homework'
	import workEdit from 'components/activity/homework/edit'
    import mutualWorkCreate from 'components/clazz/createMutualWork'
	import mutualWorkEdit from 'components/clazz/editMutual'
	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'

    import setTimehomework from 'components/activity/discuss/sethomeworktime'
    import setTimeMutualhomework from 'components/clazz/ecitMutualEndTime'

	export default {
		data() {
			return {
				items: [],
				cur_page: 1,
				totalElements: 1,
				activityId: '',
				courseId: '',
				statusName: {
					'WAITING': '未开始',
					'INPROGRESS': '进行中',
					'END': '已结束',
					'REVIEWING':'评阅中'
				},
				addWork:false,
				editWork: false,
				exportHomeWork: false,
				loading_font:'加载中...',

                settime:false, //起止时间设置
                addMutualWork: false,
                editMutualWork: false,
                setMutualTime : false
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
					case "END":
						return "已结束"
						break;
					case "REVIEWING":
						return "评阅中"
						break;
				}
			},
			attrCount(value){
				if(!value){
					return 0
				}else{
					return value
				}
			}
		},
		mounted() {
			this.getList();
		},
		methods: {
			timeSet(index,row){
                this.activityId = row.id;
                if(row.type == "HOMEWORK"){
                    this.settime = true;
                }else if(row.type == "REVIEWHOMEWORK"){
                    this.setMutualTime = true;
                }
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
				model.getAllWorkList(data, (res => {
					let _this = this;
					console.log("作业列表",res);
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
				let pathUrl='';
				if(row.type=='REVIEWHOMEWORK'){
					pathUrl="/clazz/mutualDetail"
				}else{
					pathUrl='/activity/homework/result'
				}
				const {href} = this.$router.resolve({
					path: pathUrl,
					query: {
						clazzId: this.clazzId,
						courseId: courseId,
						activityId: activityId
					}
				})
				window.open(href, '_blank')
			},
			handleEdit(index, row) {
				this.activityId = row.id;
                this.courseId = row.courseId;
                if(row.type == "HOMEWORK"){
                    this.editWork = true;
                }else if(row.type == "REVIEWHOMEWORK"){
                    this.editMutualWork = true;
                }
				
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
				if(row.commitCount && Number(row.commitCount) > 0){
					this.activityId = row.id;
					this.exportHomeWork = true;
				}else{
					this.$message.error('暂无学员提交作业');
				}
				
			},
			exportList() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.exportAllWorkClazz+"?clazzId="+this.clazzId+"&token="+getToken());
			},

			homeworkCreate(){
				this.addWork = true;
            },
            
            mutualHomeworkCreate(){
                this.addMutualWork = true;
            }

		},
		components: {
			exportHomework,
			workCreate,
			workEdit,
            setTimehomework,
            mutualWorkCreate,
            mutualWorkEdit,
            setTimeMutualhomework
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