<template>
	<div class="photo-list">
		<section class="handle">
			<button type="button" class="btn-green-line" @click="addPhoto = true">
				<i class="icon-add"></i>
				创建照片墙
			</button>
		</section>

		<section class="list round-layout">
			
			<el-table class=""
				:data = "items"
				:empty-text="loading_font"
				stripe>
				<el-table-column
					prop="title"
					label="照片墙主题"
					width="200"
					>
				</el-table-column>
				<el-table-column
					prop="createUserName"
					label="发起人"
					width="180"
					>
				</el-table-column>
				<el-table-column
					prop="courseName"
					label="关联课程"
					width="200"
					>
				</el-table-column>
				<el-table-column
					prop="photoWallCount"
					label="图片数量"
					width="100"
					>
					
				</el-table-column>
				<el-table-column
					prop="photoWallLikedCount"
					label="获赞图片数"
					width="100"
					>
				</el-table-column>
				<el-table-column
					prop="publishPhotoWallPersonCount"
					label="传照片人数"
					width="100"
					>
				</el-table-column>
				<el-table-column
					label="操作"
					>
					<template slot-scope="scope" >
			    		<!-- <el-button  type="text" @click.native="handleView(scope.$index, scope.row)">查看</el-button> -->
						<router-link class="link" target="_blank" :to="{ path: '/activity/photo/view', query: {clazzId: clazzId, courseId: scope.row.courseId, activityId: scope.row.id }}">查看</router-link>

			    		<a href="javascript:void(0)" target="_blank" class="link" @click="photoScreen(scope.$index, scope.row)">大屏幕</a>

			    		<el-button type="text" @click.native="handleExport(scope.$index, scope.row)" :class="'vipLogo'">导出</el-button>
			    		<template v-if="scope.row.operationStatus">
			    			<el-button type="text" @click="photoEdit(scope.$index, scope.row)">编辑</el-button>
			    			<el-button type="text" @click="photoDelete(scope.$index, scope.row)">删除</el-button>
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
		</section>

		<!-- 创建照片墙 -->
		<photo-create
			:dialogAddPhoto.sync = "addPhoto"
			:clazzId="clazzId"
			@updateList="getList"></photo-create>

		<!-- 编辑照片墙 -->
		<photo-edit
			:dialogEditPhoto.sync="editPhoto"
			:activityId = "photoActId"
			:courseId = "courseId"
			@updateList="getList"></photo-edit>
	</div>
</template>
<script>
	import photo from 'model/activity/photo'
	import courseSatisfied from 'model/clazz/course'
	import course from 'model/course/course'

	import photoCreate from 'components/activity/photo/create'
	import photoEdit from 'components/activity/photo/edit'
	import { getToken } from '@/filters/userVerify'
	import { delTip } from '@/global/open'

	import API from '@/global/resource'

	export default {
		data() {
			return {
				items: [],
				cur_page: 1,
				totalElements: 1,

				addPhoto: false,	// 创建照片墙
				editPhoto: false,	// 编辑照片墙
				photoActId: '',			// 照片墙activityId
				courseId: '',
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
			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getList();
			},
			getList() {
				let data = {
					clazzId: this.clazzId,
					number: this.cur_page,
					size: 20
				}
				photo.getClazzPhotoList(data, (res => {
					// console.log("photolist ========", res);
					if(res.status == 200) {
						this.items = res.data.content;

						this.totalElements = res.data.totalElements;
						if(this.items.length==0){
							this.loading_font="暂无数据"
						}
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			photoScreen(index, row) {
				let courseId = row.courseId;
				let activityId = row.id;
				window.open("/static/page/photo_screen.html?clazzId="+this.clazzId+"&courseId="+courseId+"&activityId="+activityId+"&sort=time&token="+getToken());
			},
			photoEdit(index, row) {
				let id = row.id;
				this.courseId = row.courseId;
				this.photoActId = id;
				this.editPhoto = true;
			},
			photoDelete(index, row) {
				let str = "确定删除此照片墙活动吗？";
				delTip(this, str, this.delCourseAct, row.id);

				

			},
			delCourseAct(id) {
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
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.photoExport+"?activityId="+row.id+"&token="+getToken());
			},
		},

		components: {
			photoCreate,
			photoEdit
		}
	}

</script>
<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	@import "../../../assets/reset-element-ui/user-table.css";
	.photo-list {
		.handle {
			text-align: right;
			margin-bottom: 20px;
			.btn-green-line {
				display: inline-block;
				margin-right: 12px;
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
		.link {
			color: #409EFF;
			margin-right: 10px;
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
	// .vipLogo{
	// 	position: relative;
	// 	&::after{
	// 		position: absolute;
	// 		right: -10px;
	// 		top: 10px;
	// 		width: 14px;
	// 		height: 6px;
	// 		content: "";
	// 		background: url("../../../assets/img/icon/textVip.png") center center no-repeat;
	// 		background-size: 27px 14px;
	// 	}
	// }
</style>