<style scoped lang="less">
	@import "../../../assets/reset-element-ui/user-table.css";
	@import "../../../assets/less/icon.less";
	#wmanSum {

	}
	.bread-box {
		position: relative;
		.btn-green {
			display: inline-block;
			position: absolute;
			top:0;
			padding: 10px 20px;
		}

		.wexport {
			right: 0;

		}
	}
	.wtabs-box {
		box-sizing: border-box;
		background-color: #fff;
	    border: 1px solid #f0f0f0;
	    border-radius: 6px;
	    box-shadow: -2px 0 3px #f0f0f0, 2px 0 3px #f0f0f0, 0 -2px 3px #f0f0f0, 0 2px 3px #f0f0f0;
	}
	.wtabs {
		border-bottom: 1px solid #e6e6e6;
		height: 72px;
		line-height: 66px;
		font-size: 20px;
		padding: 0 70px;
		li {
			display: inline-block;
			padding: 0 10px;
			margin-right: 56px;
			// border-bottom: 5px solid #fff;
			&.active {
				color: #35a69d;
				border-bottom: 5px solid #35a69d;
			}
		}
		span {
			font-size: 16px;
			color: #666;
		}
	}
	.wtab-cont {
		padding: 30px 70px;

		.total {
			font-size: 14px;
			color: #999;
			text-align: right;
			line-height: 2em;
		}
		a {
			color: #3182d9;
		}
	}
	


</style>
<template>
	<div id="wmanSum">
		<div class="bread-box">
			<bread-crumb
				:courseId="courseId"
				:clazzId="clazzId"
				:activityId = "activityId"
				:breadWorkUser = '1'
				></bread-crumb>
			<button class="btn-green wexport" type="button"  @click="exportUser">
	          <i class="icon-export-white"></i>
	          导出学员名单
	        </button>
		</div>
		<section class="wtabs-box" id="w-table">
			<ul class="wtabs clearfix">
				<li v-for="(item, index) in tabsParam"
					@click="toggleTabs(index)"
					:class="{active:index==nowIndex}">{{item.name}}<span>({{item.sum}})</span></li>
			</ul>

			<div class="wtab-cont"  v-show="nowIndex==0">
				<el-table class=""
					:data = "commitUser"
					:empty-text = "loadText"
					stripe>
					<el-table-column
						prop="username"
						label="账号"
						width="150">
					</el-table-column>
					<el-table-column
						prop="name"
						label="姓名"
						width="150"
						>
					</el-table-column>
					<el-table-column
						prop="phone"
						label="手机号"
						width="150">
					</el-table-column>
					<el-table-column
						prop="workPlace"
						label="单位">
					</el-table-column>
					<el-table-column
						prop="scoreLevel"
						label="评分">
						<template slot-scope="scope">
							<div v-if="!!scope.row.scoreLevel">
								<span v-if = "scope.row.scoreLevel == 'A'">
									优秀
								</span>
								<span v-else-if = "scope.row.scoreLevel == 'B'">
									较好
								</span>
								<span v-else-if = "scope.row.scoreLevel == 'C'">
									及格
								</span>
								<span v-else>
									不及格
								</span>
							</div>
							<div v-else>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						prop="attachmentCount"
						label="附件">
						 <template slot-scope="scope">
						 	<span v-if = "scope.row.attachmentCount == 0">
						 		否
						 	</span>
						 	<span v-else>
						 		是
						 	</span>
						 </template>
					</el-table-column>
                    <!--查看作业以后可能会加-->
					<el-table-column
						label="操作"
						>
						<template slot-scope="scope">
							<router-link :to="{ path: '/activity/homework/detail', query: {clazzId:clazzId, courseId:courseId,activityId:activityId, homeworkId: scope.row.homeWorkId, crumb: crumb, crumb2: crumb2, crumb3: 'man'}}">
								查看作业
							</router-link>
					    </template>
					</el-table-column>
				</el-table>

			</div>
			<div class="wtab-cont"  v-show="nowIndex==1">
				<el-table class=""
					:empty-text = "loadTextUn"
					:data = "unCommitUser"
					stripe>
					<el-table-column
						prop="username"
						label="账号"
						width="180">
					</el-table-column>
					<el-table-column
						prop="name"
						label="姓名"
						width="200"
						>
					</el-table-column>
					<el-table-column
						prop="phone"
						label="手机号"
						width="200">
					</el-table-column>
					<el-table-column

						label="提交时间"
						>
						<template slot-scope="scope">
							-
						</template>
					</el-table-column>

				</el-table>

			</div>
		</section>

	</div>
</template>
<script>
	import work from 'model/activity/homework'
	import breadCrumb from 'components/course/breadcrumb'

	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'

	export default {
		data() {
			return {
        tabsParam: [{
					name:'已提交',
					sum: 0,
				}, {
					name: '未提交',
					sum: 0
				}],
				nowIndex: 0,
				totalElements: 0,
				commitUser: [],
				unCommitUser: [],

				loadTextUn:this.$globalParam.loadText,

				loadText:this.$globalParam.loadText
			}
		},
		computed: {
			activityId() {
				return this.$route.query.activityId;
			},
			clazzId() {
				return this.$route.query.clazzId;
			},
			courseId() {
				return this.$route.query.courseId;
			},
			nowIndexCrumb() {
				return this.$route.query.nowIndex;
			},
			crumb() {
				return this.$route.query.crumb;
			},
			crumb2() {
				return this.$route.query.crumb2;
			}
		},
		created() {
			if(this.nowIndexCrumb) {

				this.nowIndex = this.nowIndexCrumb;
				//console.log(this.nowIndex);

			}
			this.getCommitUser();
			this.getUnCommitUser();

		},
		methods: {
			handleCurrentChange (val) {
				this.cur_page = val;
        		// this.getUserList();
			},
			toggleTabs(index) {
				this.nowIndex=index;

				// console.log(index);
			},

			getCommitUser() {
				
				let data = {
					activityId: this.activityId
				}

				work.getWorkCommitUser(data, (res => {

					if(res.status == 200) {
						// console.log("已提交作业",res.data);
						this.commitUser = res.data;

						//暂无数据
						if(this.commitUser.length == 0){
							this.loadText = this.$globalParam.dataEmpty;
							return;
						}

						this.tabsParam[0].sum = res.data.length;
					} else {
						this.$message.error(res.message);
					}
				}));
			},

			getUnCommitUser() {
				let data = {
					activityId: this.activityId
				}

				work.getWorkUnCommitUser(data, (res => {
					// console.log("getWorkUnCommitUser",res);
					if(res.status == 200) {
						this.unCommitUser = res.data;

						//暂无数据
						if(this.unCommitUser.length == 0){
							this.loadTextUn = this.$globalParam.dataEmpty;
							return;
						}

						this.tabsParam[1].sum = res.data.length;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			exportUser() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.workExportUser+"?activityId="+this.activityId+"&token="+getToken());
			}
		},
		components: {
			breadCrumb
		}
	}
</script>
