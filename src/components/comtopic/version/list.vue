<template>
	<div class="w-version">
		<section class="handle clearfix">
			<ul class="search-box clearfix">
				<li>
					<el-select v-model="deviceType" placeholder="设备类型">
						<el-option value="" label="请选择"></el-option>
						<el-option value="ANDROID" label="Android"></el-option>
						<el-option value="IOS" label="iOS"></el-option>
					</el-select>
				</li>
				<li>
					<el-select v-model="updateType" placeholder="更新类型">
						<el-option value="" label="请选择"></el-option>
						<el-option value="force" label="强制更新"></el-option>
						<el-option value="free" label="非强制更新"></el-option>
					</el-select>
				</li>
				<li>
					<el-button type="primary" @click="getList('search')">搜索</el-button>
				</li>
			</ul>
			<p class="right">
				<button class="btn-green" type="button" @click="addVersion = true">
					<i class="icon-circle-add"></i>
					添加
				</button>
			</p>
		</section>

		<section id="w-table" class="round-layout">
			<el-table class="normal"
				:data="items"
				stripe>
				<el-table-column
					prop = "id"
					label="ID"
					width="50">
				</el-table-column>
				<el-table-column
					prop = ""
					label="设备类型"
					width="100">
					<template slot-scope="scope">
						{{deviceFn[scope.row.device]}}
					</template>
				</el-table-column>
				<el-table-column
					prop = ""
					label="APP类型"
					width="100">
					<template slot-scope="scope">
						{{APPFn[scope.row.platform]}}
					</template>
				</el-table-column>
				<el-table-column
					prop = "iversion"
					label="版本号"
					width="80">
				</el-table-column>
				<el-table-column
					prop = "version"
					label="版本代码"
					width="80">
				</el-table-column>
				<el-table-column
					prop = "description"
					label="描述"
					class-name ="pre"
					width="">
				</el-table-column>
				<el-table-column
					prop = "downloadUrl"
					label="下载地址"
					width="200">
				</el-table-column>

				<el-table-column
					prop = "type"
					label="更新类型"
					width="100">
					<template slot-scope="scope">
						{{typeFn[scope.row.type]}}
					</template>
				</el-table-column>
			
				<el-table-column
					label="操作"
					width="80">
					<template slot-scope="scope">
						<el-button type="text" @click.native="handleDel(scope.$index, scope.row)">删除</el-button>
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

		<!-- 创建客户端版本 -->
		<create-version
			:dialogVersion.sync="addVersion"
			@updateList = "getList"></create-version>
	</div>
</template>
<script>
import Version from "model/comtpoc/version" 
import createVersion from "components/comtopic/version/create"
export default {
	data() {
		return {
			deviceType: '',		//设备类型
			updateType: '',    // 更新类型
			items: [],		// 列表数据
			cur_page: 1,
			totalElements: 0,

			addVersion: false,		// 添加客户端版本
		}
	},
	computed: {
		deviceFn() {
			return {
				"IOS" : "iOS",
				"ANDROID" : "android"
			}
		},
		APPFn() {
			return {
				"ttManager" : "管理端",
				"ttStudent" : "学员端"
			}
		},
		typeFn() {
			return {
				"force" : "强制更新",
				"free" : "非强制更新"
			}
		}
	},
	filters: {

	},
	mounted() {
		this.getList();
	},

	methods: {
		handleCurrentChange(val) {
			this.cur_page = val;
			this.getList();
		},

		getList(type) {
			let data = {
				device: this.deviceType,
				type: this.updateType,
				number: this.cur_page,
				size: '20'
			}
			if(type == 'search') {
				data.number = 1;
			}
			Version.getList(data, (res => {
				console.log("版本列表", res);
				if(res.status == 200) {
					this.items = res.data.content;
					this.totalElements = res.data.totalElements;
				} else {
					this.$message.error(res.message);
				}
			}));
		},
		handleDel(index, row) {
			this.$confirm('是否删除此版本？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				// 执行删除
				this.delVersion(index,row.id);
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除！'
				});
			});
		},
		delVersion(index,id) {
			let _this = this;
			let data = {
				id: id
			}

			Version.delVersion(data, (res => {
				if(res.status == 200) {

					this.items.splice(index, 1);
					if(this.items.length == 0) {
						this.cur_page--;
					} 
					this.getList();

					this.$message({
						type: 'success',
						message: '删除成功'
					});
				} else {
					this.$message.error(res.message);
				}
			}));
		}
	},

	components: {
		createVersion
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
	.handle {
		.search-box {

			>li {
				float: left;
				height: 40px;
				margin-right: 20px;
			}
		}
		.right {
			margin-top: -40px;
		}
	}
	.normal {
		white-space: normal;
	}
	.btn-green::after{
		display: none;
	}
</style>