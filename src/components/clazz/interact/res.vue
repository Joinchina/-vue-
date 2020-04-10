<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	@import "../../../assets/reset-element-ui/user-table.css";
	#winteractRes {
		.bread-box {
			position: relative;
			.btn-green,
			.btn-blue {
				display: inline-block;
				position: absolute;
				top:0;
				padding: 10px 15px;
				font-size: 16px;
			}
			
			.wexport {
				right: 0;

			}
		}
		.el-select {
			width: 90px;
		}
		.top {
			height: 65px;
			line-height: 64px;
			border-bottom: 1px solid #ededed;
			padding: 0 60px;
		}
		.table-box {
			padding: 27px 60px;
		}
		.total {
			font-size: 12px;
			line-height: 2em;
			color: #999;
			text-align: right;
		}
		.wname {
			cursor: pointer;
			&:hover {
				color: #20a0ff;
			}
		}
	}
	

</style>
<template>
	<div id="winteractRes">
		<div class="bread-box">
			<bread-crumb	
				:clazzId="clazzId"
				:crumbInteractRes = '1'
				></bread-crumb>

			<button class="btn-green wexport" type="button" @click="exportExcel" >
	          	<i class="icon-export-white"></i>
	          	导出
	        </button>
		</div>

		<section id="w-table" class="round-layout">
			<div class="top">
				筛选：
				<el-select v-model="value" placeholder="全部" @change="getItems">
				    <el-option
				      v-for="item in options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				</el-select>
			</div>
			<div class="table-box">
				<el-table :data="items" stripe >
					<el-table-column
						
						label="姓名"
						width="250">
						<template slot-scope="scope">
							<span class="wname" @click="handleShow(scope.row.userId)">{{scope.row.userName}}</span>
						</template>
					</el-table-column>
					<el-table-column
						label="回答结果"
						width="250">
						<template slot-scope="scope">
					        <span>{{ scope.row.result | evalName }}</span>
					     </template>
					</el-table-column>
					<el-table-column
						prop="createDate"
						label="时间"
						>
					</el-table-column>
					<el-table-column
						prop="callUserName"
						label="点名人"
						width="250">
					</el-table-column>
				</el-table>
				<p class="total">共{{totalElements}}条 每页{{size}}条</p>
			</div>
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

		<stu-msg 
			:dialogStuMsg.sync = 'stuShow'
			:stuId = 'stuId'></stu-msg>
	</div>
</template>
<script>
	import interact from 'model/clazz/interact'
	import breadCrumb from 'components/clazz/breadcrumb'
	import stuMsg from 'components/clazz/stumsg'
	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'

	export default {
		data () {
			return {
				items: [],	//历史数据列表
				cur_page: 1,
				totalElements: 0,
				totalPages: 0,
				size: '',
				options: [{
					value: '',
					label: '全部'
				}, {
					value: 'A',
					label: '非常好'
				}, {
					value: 'B',
					label: '较好'
				}, {
					value: 'C',
					label: '一般'
				}, {
					value: 'D',
					label: '缺席'
				}],
				value: '',	//筛选默认为全部，value 为空
				stuShow: false,	//显示弹出框
				stuId: ""	// 学员id
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			}
		},
		filters: {
			evalName(val) {
				let res = "";
				switch(val) {
					case 'A':
					 	res = '非常好';
					 	break;
					case 'B':
						res = '较好';
						break;
					case 'C':
						res = '一般';
						break;
					case 'D':
						res = '缺席';
						break;
				}

				return res;
			}
		},
		created() {
			this.getItems();
		},
		mounted() {
			this.$nextTick(function() {

			})
		},
		methods: {
			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getItems();
			},
			exportExcel() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.rollCallExport+"?clazzId="+this.clazzId+"&token="+getToken());
			},
			getItems() {
				let data = {
					result: this.value,
					number: this.cur_page,
					size: '20',
					clazzId: this.clazzId
				}

				interact.rollCallList(data, (res => {
					// console.log("历史数据", res);
					if(res.status == 200) {
						this.items = res.data.content;
						this.totalElements = res.data.totalElements;
						this.totalPages = res.data.totalPages;
						this.size = res.data.size;
					} else {
						this.$message.error(res.message);
					}
				}));
			},

			handleShow(stuId) {
				this.stuId = stuId;
				this.stuShow = true;
			}
		},
		components: {
			stuMsg,
			breadCrumb
		}
	}
</script>
