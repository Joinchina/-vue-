<template>
	<div id="w-table">
		<div class="top mg-b16 clearfix">
			<span class="w-sum">专家：{{totalElements}}人</span>

	        <button class="w-add" type="button" @click="addProfessor = true">
	          <i class="icon-circle-add"></i>
	          新增专家
	        </button>

	        <el-select class="app" v-model="value" placeholder="使用APP"   @change = "appStatusSearch">
		         <el-option
		            v-for="item in options"
		            :key="item.value"
		            :label="item.label"
		            :value="item.value">
		         </el-option>
	        </el-select>

	        <div class="search">
	          <input type="text" v-model="searchQuery" placeholder="账号/姓名/手机号" @keyup.13="getProfessorList('search')" /><i class="el-icon-search" @click.stop="getProfessorList('search')"></i>
	        </div>
	    
	  	</div>
		<el-table class="list"
			:data = "tableData"
			:empty-text="loading_font"
			stripe
			>
			<el-table-column
				prop="username"
				label="账号"
				width="180">
			</el-table-column>
			<el-table-column
				prop="name"
				label="姓名"
				width="180">
			</el-table-column>
			<el-table-column
				prop="phone"
				label="手机号"
				width="200">
			</el-table-column>
			<el-table-column
				prop="appStatus"
				label="使用APP"
				width="180">
			</el-table-column>
			<el-table-column
			    
			    label="操作"
			    width="200">
			    <template slot-scope="scope">
			        <el-button type="text" @click.stop="handleSel(scope.$index, scope.row)">选班</el-button>
			        <el-button type="text" @click.native="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-dropdown class="down more" placement="bottom-start" >
						<span class="el-dropdown-link">
							更多
							<i class="el-icon-caret-bottom"></i>
						</span>
						<el-dropdown-menu class="down" slot="dropdown">
							<el-dropdown-item  @click.native="handlePwd(scope.$index, scope.row)">
								<i class="icon-reset"></i>
								密码重置
							</el-dropdown-item>
							<el-dropdown-item  @click.native="handleDel(scope.$index, scope.row, tableData)">
								<i class="icon-del"></i>
								删除账号
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
			    </template>
		    </el-table-column>
		</el-table>
		<p class="page-sum">共{{totalElements}}条 每页20条</p>
		<!-- 分页 -->
		<div class="pagination">
	      	<el-pagination
	      		:current-page="cur_page"
	        	@current-change ="handleCurrentChange"
	        	layout="prev, pager, next"
	        	:page-size ="20"
	        	:total="totalElements">
	      	</el-pagination>
	    </div>
		<!-- 密码重置 -->
		<pwd-reset 
			:dialogPwdReset.sync="pwdShow"
			:userId = "rowUserId"
			></pwd-reset>
			
		<!-- 创建专家 -->
		<add-professor
			:dialogAddProfessor.sync="addProfessor"
			:orgId = "orgId"
			role = "PROFESSOR"
			@updateProfessorUserList="getProfessorList"></add-professor>

		
		<!-- 编辑专家 -->
		<edit-professor
			:dialogEditProfessor.sync="editProfessor"
			:userId = "rowUserId"
			:orgId = "orgId"
			role = "PROFESSOR"
			@updateProfessorUserList="getProfessorList"></edit-professor>

		<!-- 选班 -->
		<sel-class
			:dialogSelClass.sync="selClass"
			:userId = "rowUserId"
			:orgId = "orgId"
			role = "PROFESSOR"
			@updateClassList="getProfessorList"></sel-class>

	</div>
	
</template>
<script>
	import model from 'model/user/org_list'
	import user from 'model/user/user_manage'
	import pwdReset from 'components/user/pwd_reset'
	import addProfessor from 'components/user/add_professor'
	import editProfessor from 'components/user/edit_professor'
	import selClass from 'components/user/sel_class'
	import { delTip } from '@/global/open'
	// import bus from '@/global/bus'

	export default {
		data () {
			return {
				tableData: [],
				orgId: "",
				searchQuery: "",
				cur_page: 1,
				pwdShow: false,		//密码重置弹出框
				rowUserId:"",		// 当前row userid
				addProfessor: false,		// 添加项目弹出框
				editProfessor: false,		// 编辑项目弹出框
				selClass: false, 		// 选班弹出框
				totalElements: 0,
				loading_font:this.$globalParam.loadText,

				app: "",
				options: [{
		          value: "",
		          label: "全部"
		        }, {
		          value: "TRUE",
		          label: "是"
		        }, {
		          value: "FALSE",
		          label: "否"
		        }],
		        value: "使用APP"
			}
		},

		created() {
			
			this.getProfessorList();
			// bus.$on('orgListEvent', ( message => {
	  //           this.getProfessorList();
	  //       }))
		},

		mounted() {
			
		},
		methods: {
			appStatusSearch(value){
		        this.app = value;
		        this.cur_page = 1;
		        this.getProfessorList();
		    },
			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getProfessorList();
			},
			getProfessorList(type, cur_page) {
				this.orgId = this.$route.query.orgId;
				let data = {
					organizationId: this.orgId,
					keyword: this.searchQuery,
					number: cur_page || this.cur_page,
					appStatus:this.app
				}
				if(type == 'search') {
					data.number = 1;
				}

				if(!!this.orgId) {
					model.getProfessorList(data, ( res => {
						console.log("列表数据 ", res)
						if(res.status == 200) {
							this.totalElements = res.data.totalElements;
							this.tableData = res.data.content;
							this.loading_font=this.$globalParam.dataEmpty;
							this.tableData.forEach(function(value,index,arr) {
								arr[index].appStatus = value.appStatus == 1 ? '是' : '否';
							})

							
						}
					}));
				} else {
					console.log('缺少orgId');
				}
			},

			handleEdit(index, row) {
		    	this.editProfessor = true;
		    	this.rowUserId = row.id;

		    	// console.log("orgiiii", this.rowUserId);
		    },

		    handlePwd(index,row) {
				this.pwdShow = true;
				this.rowUserId = row.id;
				// console.log("row",index,row.id);
		    },
		    handleDel(index, row, rows) {
		    	this.rowUserId = row.id;
		    	let str = "确定要删除该账号吗？";
		    	delTip(this, str, this.delUser, index);
		    	// console.log(row.id);
		    },
		    handleSel(index, row) {
		    	this.selClass = true;
		    	this.rowUserId = row.id;
		    },
		    delUser(index) {
		    	let _this = this;
		    	let data = {
		    		id: this.rowUserId
		    	}
		    	user.deleteUser(data, ( res => {
		    		// console.log("delete",res);
		    		
		    		if(res.status == 200) {
		    			this.$message({
			              	type: 'success',
			              	message: '删除成功',
			              	duration: 1000,
			              	onClose() {
			                	_this.tableData.splice(index, 1);
			                	if(_this.tableData.length == 0) {
			                		let val = _this.cur_page-1;
			                		_this.cur_page = val;
			                		_this.getProfessorList('page', val)
			                	}
			                	_this.getProfessorList();
			              	}
			            });
		    			
		    			
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));
		    	
		    }
			
		},

		components: {
			pwdReset,
			addProfessor,
			editProfessor,
			selClass
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	@import "../../../assets/less/btn-search.less";
	@import "../../../assets/reset-element-ui/user-table.css";
	.app {
		float: right;
	    width: 105px;
	    margin-left: 10px;
	    outline: 0;
	}
	
	#w-table {
		.w-sum {
			display: inline-block;
			margin-top: 8px;
		}
		
	}
	.down {
		.icon-reset,.icon-del {
			vertical-align: text-bottom;
			background-size: 90% 90%;
		}
		
		.el-dropdown-menu__item{	
			font-size: 14px;
			border-bottom: 1px solid #eee;
			&:last-child {
				border-bottom: 0;
			}
		}
	}
	.el-dropdown-link {
		color: #20a0ff;
	}
	.el-icon-caret-bottom:before {
		color: #94a5bc;
	}
	.more {
		margin-left: 10px;
	}
</style>