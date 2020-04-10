<template>
	<div class="wtrial">
		<section class="handle clearfix">
			<Goback passtitle="申请试用" ></Goback>
			<p class="right">
				<button class="btn-green" type="button"  @click="exportList">
					<i class="icon-export-white"></i>
					导出名单
				</button>
			</p>
		</section>

		<section id="w-table" class="round-layout">
			<h2 class="title">申请试用名单</h2>
			<div class="box">
				<el-table class=""
					:data = "tableData"
					stripe
					>
					<el-table-column
						prop="userName"
						label="姓名"
						width="180">
					</el-table-column>
					<el-table-column
						prop="telephone"
						label="手机号"
						width="150"
						>
					</el-table-column>
					<el-table-column
						prop="orgName"
						label="单位名称">
					</el-table-column>
					<el-table-column
						prop="job"
						label="职务"
						width="180">
					</el-table-column>
					<el-table-column
						prop="source"
					    label="从哪了解师训宝">
					    
				    </el-table-column>
				</el-table>
			
			
				<p class="page-sum">共{{totalElements}}条 每页50条</p>
				<!-- 分页 -->
				<div class="pagination">
			      	<el-pagination
			        	@current-change ="handleCurrentChange"
			        	layout="prev, pager, next"
			        	:page-size ="50"
			        	:total="totalElements">
			      	</el-pagination>
			    </div>
		    </div>
		</section>
	</div>
</template>
<script>
	import apply from 'model/comtpoc/apply'
	import API from '@/global/resource'
	import { getToken } from '@/filters/userVerify'
	import Goback from 'base/goback/goback'

	export default {
		data() {
			return {
				tableData: [],
				cur_page: 1,
				totalElements: 0
			}
		},
		computed: {

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
					size: 50,
					number: this.cur_page
				}
				apply.getList(data, (res => {
					console.log("申请试用列表", res);
					if(res.status == 200) {
						this.tableData = res.data.content;
						this.totalElements = res.data.totalElements;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			exportList() {
				window.open(API.urls.reserveUseExp+"?token="+getToken());
			}
		},

		components: {
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
	.box {
		padding: 0 20px;
	}
	.title {
		position: relative;
	    font-size: 20px;
	    line-height: 20px;
	    color: #101010;
	    letter-spacing: 0;
	    margin-bottom: 34px;
	    padding-left: 10px;

	    &:before {
	        content: "";
	        width: 3px;
	        height: 20px;
	        background-color: #35A69D;
	        position: absolute;
	        left: 0;
	    }
	}
	.btn-green::after{
		display: none;
	}
</style>