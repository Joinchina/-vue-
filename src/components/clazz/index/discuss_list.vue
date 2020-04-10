<template>
	<div class="w-homeList" id = "reflectList">
		<section class="handle">
			<button type="button" class="add-discuss btn-green-line" @click="createDiscuss = true">
				<i class="icon-add"></i>
				创建讨论组
			</button>
			<button type="button" class="btn-green" @click = "exportDiscussList">
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
					label="讨论组名称"
					width="150">
				</el-table-column>
				<el-table-column
					prop="createUserName"
					label="发起人/组长"
					width="110">
				</el-table-column>
				<el-table-column
					prop="courseName"
					label="关联课程"
					width="120">
				</el-table-column>
				<el-table-column
					prop="status"
					label="状态"
					width="90">
					<template slot-scope="scope">
						{{statusName[scope.row.status]}}
					</template>
				</el-table-column>
				<el-table-column
					prop="creatTime"
					label="创建时间"
					width="110">
				</el-table-column>
				<el-table-column
					prop="openStatus"
					label="开放状态"
					width="95">
					<template slot-scope="scope">
						{{statusOpenName[scope.row.openStatus]}}
					</template>
				</el-table-column>
				<el-table-column
					prop="chatCount"
					label="发言数量"
					width="95">
				</el-table-column>
				<el-table-column
					prop="commitCount"
					label="发言人数"
					width="95">
				</el-table-column>
				<el-table-column
				    label="操作"
				    >
				    <template slot-scope="scope" >
				    	<!--小组-->
				    	<el-button  type="text" @click.native="handleView(scope.$index, scope.row)">查看</el-button>

				    	<!--创建讨论组-->
				    	<template v-if="!!scope.row.type && scope.row.level !='CLAZZ' && scope.row.type =='DISCUSS'">
				    		<el-button  type="text" @click.native="getDiscussSync(scope.$index, scope.row)">同步群成员</el-button>
				    		<span v-if="!!scope.row.operationStatus">
				    			<el-button  type="text" @click.native="setDisTime(scope.$index, scope.row)">时间设置</el-button>
				    			<el-button  type="text" @click.native="discussDelete(scope.$index, scope.row)">删除</el-button>
				    		</span>
				    	</template>

				    	<!--班级群讨论组-->
				    	<template v-else-if="scope.row.level =='CLAZZ'">
				    		<el-button  type="text" @click.native="getDiscussSync(scope.$index, scope.row)">同步群成员</el-button>
				    	</template>

				    </template>
			    </el-table-column>
			</el-table>
			<p class="page-sum">共{{totalElements}}条</p>

			<!--导出反思-->
		    <export-intros-pection
		        :dialogExport.sync = "exportIntrosPect"
		        :questionPaperIds = "questionPaperId"
		    ></export-intros-pection>
		    <!--导出反思-->
		</section>
		<!-- 讨论组设置时间 -->
		<set-time
		:dialogEditTime.sync="disSetTime"
		:activityId = "disActId"
		></set-time>

		<!-- 创建讨论组 -->
		<discuss-create
			:dialogAddDiscuss.sync = "createDiscuss"
			:clazzId = "clazzId"
			@updateList = "getList"
		></discuss-create>
	</div>
</template>
<script>
	import { delTip } from '@/global/open'
	import setTime from 'components/activity/discuss/set_time'
	import model from 'model/activity/discuss'
	import discuss from 'model/activity/discuss'
	import exportIntrosPection from 'components/activity/introspection/export_pop'
	import course from 'model/course/course'
	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'

	import discussCreate from 'components/clazz/create_discuss';


	export default {
		data() {
			return {
				items: [],
				disActId:"",
				disSetTime:false,
				cur_page: 1,
				totalElements: 1,
				activityId: '',
				questionPaperId:'',
				statusOpenName:{
					'PUBLIC':"公开",
					'PRIVATE':"隐私",
				},
				statusName: {
					'WAITING': '未开始',
					'INPROGRESS': '进行中',
					'END': '已结束'
				},
				exportIntrosPect:false,
				createDiscuss: false,		//创建讨论组
				loading_font:'加载中...'
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			}
		},
		mounted() {
			this.getList();
		},
		methods: {

			//讨论组删除
			discussDelete(index, row) {
				var id = row.id;
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
								_this.getList();
							}
						});
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 讨论组时间设置
			setDisTime(index, row) {
				this.disActId = row.id;
				this.disSetTime = true;
			},
			//同步群成员
			getDiscussSync(index, row){
				let data = {
					activityId: row.id
				}
				discuss.getDiscussSync(data, (res => {
					if(res.status == 200) {
						this.$message.success(res.data);
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			exportDiscussList(){
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.exportDiscussActivityListInClazz+"?clazzId="+this.clazzId+"&token="+getToken());
			},
			getList() {
				let data = {
					clazzId: this.clazzId
				}
				model.discussActivityListInClazz(data, (res => {
					let _this = this;
					if(res.status == 200) {
						this.totalElements = res.data.length;
						this.items = res.data;
						if(this.items.length==0){
							this.loading_font="暂无数据"
						}
					} else {
						this.$message.error(res.message);
					}
				}));

			},
			handleView(index, row) {
				let type = row.type;
				let groupId = row.groupId;
				let courseId = row.courseId;
				let activityId = row.id;
				let imId = row.imId;
				//讨论组跳转
				if(!!type && type == "DISCUSS"){
					const {href} = this.$router.resolve({
						path: '/activity/discuss/result',
						query: {
							clazzId: this.clazzId,
							courseId: courseId,
							activityId:activityId
						}
					})
					window.open(href, '_blank')

				//小组跳转
				}else{
					const {href} = this.$router.resolve({
						path: '/clazz/group/result',
						query: {
							clazzId: this.clazzId,
							groupId: groupId,
							imId: imId
						}
					})
					window.open(href, '_blank')
				}

				
			}

		},
		components: {
			exportIntrosPection,
			setTime,
			discussCreate
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	@import "../../../assets/reset-element-ui/user-table.css";
	.btn-green{
		display: inline-block;
		margin-left: 15px;
		font-size: 16px;
		padding: 10px 25px;
		border-radius: 5px;
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
				font-size: 18px;
			}
			.add-discuss {
				display: inline-block;
			    padding: 9px 15px;
			    line-height: 1em;
			    background-color: #f3faf9;
			    border: 1px solid #8dc6c2;
			    border-radius: 6px;
			    color: #4ba8a2;
			    cursor: pointer;
			    font-size: 16px;

			    >i {
			    	vertical-align: middle;
			    }
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