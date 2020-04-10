<template>
	<div class="wQuestemp">
		<section class="handle clearfix">
			<Goback passtitle="问卷模板库" :path="path" :query="query"></Goback>
			<p class="right">
				<button class="btn-green" type="button"  @click="createQustion">
					<i class="icon-circle-add"></i>
					创建问卷模板
				</button>
			</p>
		</section>

		<section id="w-table" class="round-layout">
			<el-table class=""
				:data="items"
				stripe>
				<el-table-column
					prop = ""
					label="模板名称"
					width="">
					<template slot-scope="scope">
						<router-link class="link" :to="{ path: '/questemp/view', query: {id: scope.row.id }}">{{scope.row.title}}</router-link>
					</template>
				</el-table-column>
				<el-table-column
					prop = "createUserName"
					label="创建人"
					width="200">
				</el-table-column>
				<el-table-column
					prop = "updateDate"
					label="最近更新时间"
					width="200">
				</el-table-column>
				<el-table-column
					prop = "usedTimes"
					label="被使用次数"
					width="100">
				</el-table-column>
				<el-table-column
					label="操作"
					width="180">
					<template slot-scope="scope">
						<el-button type="text" @click="handleView(scope.$index, scope.row)">预览</el-button>

						<el-button type="text" v-if="scope.row.operationStatus" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						
						<el-button type="text" v-if="scope.row.operationStatus" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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

	</div>
</template>
<script>
	import Questemp from 'model/questemp/questemp'
	import { delTip } from '@/global/open'
	import { mapGetters, mapActions } from 'vuex'
	import Goback from 'base/goback/goback'

	export default {
		data() {
			return {
				items: [],		// 列表数据
				cur_page: 1,
				totalElements: 0,
				currId: "",			// 当前行id

				path: "",	// 路由返回
				query: {},
			}
			
		},

		computed: {
			orgId() {
				return this.$route.query.orgId;
			},
			clazzId() {
				return this.$route.query.clazzId;
			}
		},
		
		mounted() {
			this.goback();
			// if(this.orgId) {
				this.getPage();
			// }
			
			

		},

		methods: {
			goback() {
				if(this.clazzId) {
					this.path = "/evaltemp/admin";
					this.query = { 
						orgId: this.orgId,
						clazzId: this.clazzId 
					};
				
				} else {
					this.path = "/org/repository/menu";
					this.query = { 
						orgId: this.orgId
					};
					
				}
				
			},
			createQustion(){
				if(this.clazzId) {
					this.$router.push({
					path:"/questemp/create",
						query: {
							orgId: this.orgId,
							clazzId: this.clazzId
						}
					})
				} else {
					this.$router.push({
						path:"/questemp/create",
						query: {
							orgId: this.orgId
						}
					})
				}
				
			},
			handleCurrentChange (val) {
				this.cur_page = val;
				console.log("cur_page", this.cur_page);
        		this.getPage();
			},
			getPage() {
				let data = {
					organizationId: this.orgId,
					number: this.cur_page,
					size: 20
				}

				console.log("data== ",data, this.orgId);
				Questemp.getQuestempOrgPage(data, (res => {
					console.log("机构列表", res);
					if(res.status == 200) {
						this.items = res.data.content;
						this.totalElements = res.data.totalElements;
					} else {
						this.$message.error(res.message);
					}
				}));

			},
			handleView(index, row) {
				this.$router.push({
					path: '/questemp/view',
					query: {
						id: row.id
					}
				});
			},
			handleEdit(index, row) {
				if(this.clazzId) {
					this.$router.push({
						path:"/questemp/edit",
						query: {
							createUserId: row.createUserId,
							id: row.id,
							clazzId: this.clazzId
						}
					})
				} else {
					this.$router.push({
						path:"/questemp/edit",
						query: {
							createUserId: row.createUserId,
							id: row.id
						}
					})
				}
				
			},
			handleDel(index, row) {
				let str = "是否删除此问卷模板？";
				this.currId = row.id;
				delTip(this, str, this.delQuestemp, index);
			},
			delQuestemp(index) {
				let data = {
					id: this.currId
				}
				Questemp.postDel(data, (res => {
					console.log('删除', res)
					if(res.status == 200) {
						this.$message.success("删除成功");
						this.getPage();
					} else {
						this.$message.error(res.message);
					}
				}));
			}
		},

		components:{
			Goback
		}
	}
</script>
<style scoped lang="less">
	@import "../../assets/less/icon.less";
	@import "../../assets/less/btn-search.less";
	@import "../../assets/reset-element-ui/user-table.css";
	#w-table {
		box-sizing: border-box;
		padding: 20px 20px 0;
	}
	.btn-green::after{
		width: 0;
		height: 0;
	}
</style>