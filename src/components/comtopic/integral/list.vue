<template>
	<div class="wIntergral">
		<section class="handle clearfix">
			<Goback passtitle="积分管理" ></Goback>
			<p class="right">
				<button class="btn-green" type="button"  @click="createFlag = true">
					<i class="icon-circle-add"></i>
					新增积分项目
				</button>

				<button class="btn-blue" type="button"  @click="setFlag = true">
					<i class="icon-manually"></i>
					手动加分设置
				</button>
			</p>
		</section>

		<section id="w-table" class="round-layout">
			<el-table class=""
				:data="items"
				stripe>
				<el-table-column
					prop="orderNumber"
					label="顺序"
					width="50">
					
				</el-table-column>

				<el-table-column
					prop="name"
					label = "名称"
					width="140">
				</el-table-column> 

				<el-table-column
					prop = "available"
					label="状态"
					width="60">
					<template slot-scope="scope">
						{{scope.row.available ? '启用' : '禁用'}}
					</template>
				</el-table-column>
				<el-table-column
					prop = "rewards"
					label="分值"
					width="50">
				</el-table-column>
				<el-table-column
					prop = ""
					label="账号限制类型"
					width="155">
					<template slot-scope="scope">
						{{limitTypeC[scope.row.limitType]}}
					</template>
				</el-table-column>
				<el-table-column
					prop = ""
					label="加分上线类型"
					width="120">
					<template slot-scope="scope">
						{{limitWayC[scope.row.limitWay]}}
					</template>
				</el-table-column>

				<el-table-column
					prop = "limits"
					label="上限值"
					width="80">
					<template slot-scope="scope">
						{{scope.row.limits ? scope.row.limits : '--'}}
					</template>
				</el-table-column>
				<el-table-column
					prop = "description"
					label="说明"
					width="">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" :content="scope.row.description" placement="bottom">
					      	<el-button class="text" type="text">{{scope.row.description}}</el-button>
					    </el-tooltip>
					</template>
				</el-table-column>
				
				<el-table-column
					label="操作"
					width="150">
					<template slot-scope="scope">
						<el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="text" @click="handleCommand(scope.$index, scope.row)">{{scope.row.available ? '启用' : '禁用'}}</el-button>
						<el-button type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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

		<!-- 新增积分 -->
		<create-integral
			:dialogIntegral.sync="createFlag"
			@updateList = "getList"
			></create-integral>

		<!-- 编辑积分 -->
		<edit-integral
			:dialogEdit.sync="editFlag"
			:id = "integralId"
			@updateList = "getList"></edit-integral>

		<!-- 手动加分设置 -->
		<man-set
			:dialogSet.sync="setFlag"
			></man-set>
	</div>
</template>
<script>
	import Integral from "model/comtpoc/integral" 
	import { delTip } from '@/global/open'
	import createIntegral from "components/comtopic/integral/create"
	import editIntegral from "components/comtopic/integral/edit"
	import manSet from "components/comtopic/integral/manset"
	import Goback from 'base/goback/goback'
	export default {
		data() {
			return {
				items: [],		// 列表数据
				cur_page: 1,
				totalElements: 0,
				integralId: '',		// 当前积分id

				setFlag: false,		// 设置弹出框
				createFlag: false,		// 新增弹出框
				editFlag: false,	// 编辑弹出框
			}
		},
		computed: {
			typeC() {
				return {
					"SYSTEM_TASK": "系统积分",
					"CLAZZ_TASK": "学习积分"
				}
			},
			limitTypeC() {
				return {
					"ACCOUNT": "同一账号",
					"DAILY" : "同一账号每天",
					"COURSE" : "同一账号任意课程下"
				}
			},
			limitWayC() {
				return {
					"TIMES" : "次数上限",
					"NO_LIMIT" : "无上限"
				}
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
					number: this.cur_page,
					size: '20'
				}

				Integral.getTaskList(data, (res => {
					console.log("列表数据", res)
					if(res.status == 200) {
						this.items = res.data.content;
						this.totalElements = res.data.totalElements;
					} else {
						this.$message.error(res.message);
					}
				}));

			},
			
			handleEdit(index, row) {
				this.editFlag = true;
				this.integralId = row.id;
			},
			handleCommand(index, row) {
				let data = {
					userTaskId: row.id,
					available: !row.available
				}

				Integral.postTaskAvailable(data, (res => {
					if(res.status == 200) {
						this.getList();
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			handleDel(index, row) {
				this.integralId = row.id;
				let str="是否删除此积分项目？";
				delTip(this, str, this.integralDel, index);
			},
			integralDel(index) {
				let _this = this;
				let data = {
					userTaskId: this.integralId
				}

				Integral.postDelTask(data, (res => {
					if(res.status == 200) {
						this.$message({
							type: 'success',
			              	message: '删除成功',
			              	duration: 1000,
			              	onClose() {
			                	_this.items.splice(index, 1);
			                	if(_this.items.length == 0) {
			                		let val = _this.cur_page-1;
			                		_this.cur_page = val;
			                	} 
			                	_this.getList();
			                	
			              	}
						})
					} else {
						this.$message.error(res.message);
					}
				}));
			}
		},

		components: {
			createIntegral,
			editIntegral,
			manSet,
			Goback
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	@import "../../../assets/less/btn-search.less";
	@import "../../../assets/reset-element-ui/user-table.css";
	.round-layout {
		box-sizing: border-box;
		padding: 20px 20px 0 20px;
	}
	.btn-blue {
		display: inline-block;
	    font-size: 16px;
	    line-height: 1em;
	    color: #FFFFFF;
	    padding: 10px 20px;
	    margin-left: 10px;
	}
	.text {
		color: #1f2d3d;
	}
	.btn-green::after{
		width: 0;
		height: 0;
	}
</style>