<template>
	<div class="cert-list">
		
		<Goback :passtitle="passtitle"></Goback>
		<!-- 右侧功能 -->
		<div class="handle" v-if="dataFlag && setCert">
			

			<div class="search">
				<input type="text" v-model.trim="search" placeholder="姓名和证书名称" @keyup.13="getCertSearch()" /><i class="el-icon-search" @click.stop="getCertSearch()"></i>
			</div>
			<button type="button" class="btn-blue" @click="importStu = true">
				<i class="icon-import"></i>
				导入学员信息
			</button>
			<button class="btn-green" type="button" @click="certExpAll">
				<i class="icon-export-white"></i>
				导出证书
			</button>
		</div>

		<!-- 没有设置证书 -->
		<template v-if="setCert == false && emptyFlag">
			<!-- 没有数据时 -->
			<div class="round-layout">
				<empty 
			      :tip="tip"
			      ></empty>
			</div>
		    <!-- /没有数据时 -->
		</template>
		
		<!-- 设置证书样式 -->
		<template v-else>
			<div class="round-layout">
				<h2 class="cert-title clearfix">
					证书列表
					<template v-if="dataFlag">
						<span>（{{count}}个）</span>
						<span class="del-all" @click="delAll">
							<i class="icon-del"></i>
							全部删除
						</span>
					</template>
				</h2>
				
				<!-- 无学员信息 -->
				<div class="no-student" v-if="!dataFlag">
					<ul class="th clearfix">
						<li>姓名</li>
						<li>证书类型</li>
						<li>证书编号</li>
						<li>操作</li>
					</ul>
					<p class="note">请完善学员证书信息，给学员颁发证书</p>
					<button class="btn-green-line" @click="importStu = true">
						<i class="icon-cert-import-green"></i>
						导入学员信息
					</button>
				</div>
				
				<!-- 有学员信息 -->
				<div class="stu-cont" v-else>
					<el-table class=""
						:data = "items"
						empty-text = "搜索结果为空"
						stripe
						>
						<el-table-column
							prop = "name"
							label="姓名">
							
						</el-table-column>
						<el-table-column
							prop="certificateName"
							label="证书类型"
							width="">
							
						</el-table-column>
						<el-table-column
							prop="certificateNo"
							label="证书编号"
							width="">
						</el-table-column>
						
						<el-table-column
						    label="操作"
						    width="">
						    <template slot-scope="scope" >
						    	<template>
						    		<a class="view-link" v-if="scope.row.certificateUrl" :href="scope.row.certificateUrl" target="_blank">预览</a>
						    		<span v-else class="no-link" @click="handleView">预览</span>
						    		<el-button type="text" @click.native="handleEdit(scope.$index, scope.row)">编辑</el-button>
									<el-button type="text" class="red" @click.native="delOne(scope.$index, scope.row)">删除</el-button> 
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
				</div>
				<!-- /有学员信息 -->
			</div>
		</template>

		<!-- 导入学员信息 -->
		<stu-import
			:dialogImportStu.sync = "importStu"
			:clazzId = "clazzId"
			@updateList = "getCertList()"></stu-import>

		<!-- 编辑学员 -->
		<edit
			:dialogEditStu.sync = "editStu"
			:clazzId = "clazzId"
			:certificate = "certRow"
			@updateList = "getCertList()"></edit>
	</div>
</template>
<script>
	import Empty from 'base/empty/empty'
	import breadCrumb from 'components/clazz/breadcrumb'
	import certificate from 'model/certificate/certificate'
	import clazz from 'model/clazz/clazz'
	import cert from 'model/clazz/certificate'

	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'
	import { delTip } from '@/global/open'

	import stuImport from 'components/clazz/certificate/stu_import'		//导入学员信息
	import edit from 'components/clazz/certificate/edit'			// 编辑学员
import Goback from 'base/goback/goback';
	export default {
		data () {
			return {
				 passtitle:"颁发证书",
				setCert: false,		// 是否设置证书样式
				dataFlag: true,		// 是否有数据
				cur_page: 1,
				totalElements: 0,
				count: 0,			// 列表个数
				tip: `还没有设置证书样式，无法颁发证书。`+`<br/>`+`请去机构下设置证书样式或联系机构管理员设置`,	
				orgId: '',   // 机构id

				items: [],	// 证书列表
				empty: '请完善学员证书信息，给学员颁发证书',
				search: '',		//搜索内容
				importStu: false,		// 导入学员信息
				editStu: false,		//编辑学员弹出框
				certRow: {},		//每一行的证书信息
				emptyFlag: false,	// 是否显示空页面

			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			}
		},
		created() {

		},
		mounted() {
			this.getClazz();
		},
		methods: {
			certExpAll() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.clazzCertExpAll+"?clazzId="+this.clazzId+"&token="+getToken());
			},
			getClazz() {
				let data = {
					id: this.clazzId
				}

				clazz.getClassInfor(data, (res => {
					// console.log("班级信息",res);
					if(res.status == 200) {
						this.orgId = res.data.organizationId;
						this.getCertificate(this.orgId);
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			getCertificate(orgId) {
				let data = {
					organizationId: this.orgId,
				}

				certificate.getOrgCert(data, (res => {
					console.log("获取证书", res);
					if(res.status == 200) {
						this.setCert = true;
						// 证书列表
						this.getCertList();
					}else if(res.status == 206) {
						this.emptyFlag = true;
						this.setCert = false;
						
					} else {
						
						this.$message.error(res.message);
					}
				}))
			},
			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getCertList();
			},
			// 证书列表
			getCertList() {
				let data = {
					clazzId: this.clazzId,
					number: this.cur_page,
					size: '20'
				}
				cert.clazzCertList(data, (res => {
					console.log("证书列表", res);
					if(res.status == 200) {
						this.items = res.data.content;
						this.count = res.data.totalElements;
						this.totalElements = res.data.totalElements;

						if(this.totalElements > 0) {
							this.dataFlag = true;
						} else {
							this.dataFlag = false;
						}

						// 是否显示空页面
						if(this.items.length == 0) {
							this.emptyFlag = true;
						} else {
							this.emptyFlag = false;
						}
					} else {
						this.$message.error(res.message);
					}
				}));
			},

			// 搜索证书
			getCertSearch() {
				// if(!this.search) {
				// 	this.$message.error("请输入搜索内容！");
				// 	return false;
				// }
				let data = {
					keyword: this.search,
					clazzId: this.clazzId
				}

				cert.clazzCertSearch(data, (res => {
					console.log("搜索结果", res);
					if(res.status == 200) {
						this.items = res.data.content;
						this.count = res.data.totalElements;
						this.totalElements = res.data.totalElements;

					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 删除全部证书
			delAll() {
				let str = "确定要删除所有学员证书吗?"
				delTip(this, str, this.handleDelAll);
			},
			handleDelAll() {
				let _this = this;
				let data = {
					clazzId: this.clazzId
				}

				cert.clazzCertDelAll(data, (res => {
					console.log("删除证书结果", res);
					if(res.status == 200) {
						this.$message({
			              	type: 'success',
			              	message: '删除成功',
			              	duration: 1000,
			              	onClose() {
			                	_this.getCertList();
			              	}
			            });
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 删除单个证书
			delOne(index, row) {
				let str = "确定删除该学员的证书吗?"
				delTip(this, str, this.handleDelOne, row.id);
			},
			handleDelOne(id) {
				let _this = this;
				let data = {
					id
				}
				cert.clazzCertDelOne(data, (res => {
					console.log("删除单个", res);
					if(res.status == 200) {
						this.$message({
			              	type: 'success',
			              	message: '删除成功',
			              	duration: 1000,
			              	onClose() {
			                	// _this.items.splice(index, 1);
			                	_this.getCertList();
			              	}
			            });
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 编辑学员信息
			handleEdit(index, row) {
				this.certRow = row;		//赋值
				this.editStu = true;   // 显示弹出框
				
			},
			handleView() {
				this.$message.error("证书生成中,请稍后刷新预览！");
			}
		},
		components: {
			Empty,
			breadCrumb,
			stuImport,
			edit,
			Goback
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	@import "../../../assets/less/btn-search.less";
	@import "../../../assets/reset-element-ui/user-table.css";
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
		.wissue {
			right: 110px;
		}
		.wexport {
			right: 0;

		}
	}
	.handle {
		margin-top: -40px;
		height: 40px;
		text-align: right;
		.search {
			float: none;
			display: inline-block;
			background-color: #fff;
		}
		.btn-green,
		.btn-blue {
			display: inline-block;
			margin-left: 15px;
			font-size: 16px;
			padding: 10px 15px;
			border-radius: 5px;
			
		}

		i {
			vertical-align: middle;
		}
	}
	.round-layout {
		padding: 20px;
	}
	.cert-title {
		font-size:20px;
		color:#333333;
		letter-spacing:0;
		line-height: 1em;
		border-left: 5px solid #35a69d; 
		padding-left: 10px;
		margin-bottom: 20px;

		.del-all {
			float: right;
			font-size:16px;
			color:#4a4a4a;
			letter-spacing:0;
			cursor: pointer;
		}
		.icon-del {
			vertical-align: text-bottom;
			width: 18px;
			height: 18px;
		}
	}
	.stu-cont,.no-student {
		padding: 0 20px;
	}
	.no-student {
		padding-bottom: 50px;
		.th {
			box-sizing: border-box;
			width: 100%;
			height: 46px;
			background: #eef1f6;
			border: 1px solid #dfe6ec;
			li {
				float: left;
				width: 25%;
				text-align: center;
				line-height: 44px;
			}
		}
		.note {
			font-size:18px;
			color:#4a4a4a;
			letter-spacing:0;
			text-align: center;
			margin: 78px 0 25px;
		}
		.btn-green-line {
			margin: 0 auto;
			font-size:14px;
			color:#2c9992;
			background:rgba(39,192,169,0.06);
		}
		i {
			vertical-align: middle;
		}
		
	}
	.stu-cont {
		.red {
			color:#e94e57;
		}

	}
	.page-sum {
		font-size:14px;
		color:#666666;
		letter-spacing:0;
		text-align:right;
		line-height:36px;
	}

	.view-link {
		color: #20a0ff;
		margin-right: 10px;
	}
	.no-link {
		color: #999;
		margin-right: 10px;
	}
</style>