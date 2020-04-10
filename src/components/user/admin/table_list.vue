<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	@import "../../../assets/less/btn-search.less";
	@import "../../../assets/reset-element-ui/user-table.css";
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
</style>
<template>
	<div id="w-table">
		<div class="top mg-b16 clearfix">
			<el-select class="app" v-model="value" placeholder="使用APP"   @change = "appStatusSearch">
		         <el-option
		            v-for="item in options"
		            :key="item.value"
		            :label="item.label"
		            :value="item.value">
		         </el-option>
	        </el-select>
	        <div class="search">
	          <input type="text" v-model="searchQuery" placeholder="账号/姓名/手机号" @keyup.13="getData(role, 'search')" /><i class="el-icon-search" @click.stop="getData(role, 'search')"></i>
	        </div>
	    
	  	</div>
	  	<el-table class=""
			:data = "tableData"
			:empty-text="loading_font"
			@cell-click="clazzHandle"
			stripe
			>
			<el-table-column
				prop="username"
				label="账号"
				fixed="left"
				width="150">
			</el-table-column>
			<el-table-column
				prop="name"
				label="姓名"
				fixed="left"
				width="150"
				>
			</el-table-column>
			<el-table-column
				prop="phone"
				label="手机号"
				fixed="left"
				width="150">
			</el-table-column>
				<el-table-column
				prop="appStatus"
				label="使用APP"
				width="100">
			</el-table-column>
			<el-table-column
				v-if="role!='STUDENT'"
				prop="organizationName"
				label="所在机构"
				:show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column
				v-if="role=='STUDENT'"
				prop="organizationName"
				label="所在机构"
				:show-overflow-tooltip="true"
				width="150">
			</el-table-column>
			<el-table-column
				v-if="role=='STUDENT'"
				prop="projectName"
				label="所在项目"
				:show-overflow-tooltip="true"
				width="150">
			</el-table-column>
			<el-table-column
				v-if="role=='STUDENT'"
				prop="clazzName"
				label="所在班级"
				class-name="coursor"
				:show-overflow-tooltip="true"
				width="150">
			</el-table-column>
			<el-table-column
			    label="操作"
			    width="150">
			    <template slot-scope="scope">
			    	<el-button type="text" @click.native="handleEdit(scope.$index, scope.row)">编辑</el-button>

			        <el-dropdown class="more"  placement="bottom-start" >
						<span class="el-dropdown-link">
							更多
							<i class="el-icon-caret-bottom"></i>
						</span>
						<el-dropdown-menu class="down" slot="dropdown">
							<el-dropdown-item  @click.native="handlePwd(scope.$index, scope.row)" >
								<i class="icon-reset"></i>
								密码重置
							</el-dropdown-item>
							<el-dropdown-item  @click.native="handleDel(scope.$index, scope.row, tableData)" >
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

		
	</div>
</template>
<script>
	import model from 'model/user/admin_list'
	import user from 'model/user/user_manage'
	import pwdReset from 'components/user/pwd_reset'

	import { delTip } from '@/global/open'
	import bus from '@/global/bus'

	export default {
		data () {
			return {
				tableData: [],
				searchQuery: "",
				cur_page: 1,
				pwdShow: false,		//密码重置弹出框
				rowUserId:"",		// 当前row userid
				totalElements:0	,	// 总条数
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
		props: ['role'],
		created() {
			// ORGADMIN
			// PROJECTADMIN
			// CLAZZMANAGER
			// PROFESSOR
			// STUDENT
			let _this = this;
			this.getData(this.role);
			if (this.role == "ORGADMIN") {
				bus.$on('updateOrgUserList',function(role) {
					_this.getData(role);
				});
			}
			if (this.role == "PROJECTADMIN") {
				bus.$on('updateProUserList',function(role) {
					_this.getData(role);
				})
			}
			if (this.role == "CLAZZMANAGER") {
				bus.$on('updateClassUserList',function(role) {
					_this.getData(role);
				})
			}
			if (this.role == "PROFESSOR") {
				bus.$on('updateProfessorUserList',function(role) {
					_this.getData(role);
				})
			}
			if (this.role == "STUDENT") {
				bus.$on('updateStuUserList',function(role) {
					_this.getData(role);
				})
			}
			
			
		},

		mounted() {

		},

		methods: {
			appStatusSearch(value){
		        this.app = value;
		        this.cur_page = 1;
		        this.getData(this.role);
		    },
			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getData(this.role);
			},

			getData(role, type, cur_page) {
				let data = {
					keyword: this.searchQuery,
					number: cur_page || this.cur_page,
					appStatus:this.app
				}
				if(type == 'search') {
					data.number = 1;
				}

				switch(role) {
					case "ORGADMIN": 
						model.getOrgList(data, (res => {
							this.applyData(res);
						}));
						break;
					case "PROJECTADMIN":
						model.getProList(data, (res => {
							this.applyData(res);
						}));
						break;
					case "CLAZZMANAGER":
						model.getClassList(data, (res => {
							this.applyData(res);
						}));
						break;
					case "PROFESSOR":
						model.getProfessorList(data, (res => {
							this.applyData(res);
						}));
						break;
					case "STUDENT": 
						model.getStudentList(data, (res => {
							this.applyData(res);
						}));
						break;
				}
				// if(role === "ORGADMIN") {
				// 	model.getOrgList(data, (res => {
				// 		this.applyData(res);
				// 	}));
				// } 
			},
			applyData(res) {
				// console.log("tableData",res)
				if(res.status == 200) {
					this.totalElements = res.data.totalElements;
					// this.totalElements = 100;
					// console.log("totalElements",this.totalElements);		
					this.tableData = res.data.content;
					this.loading_font=this.$globalParam.dataEmpty;
					this.tableData.forEach(function(value,index,arr) {
						arr[index].appStatus = value.appStatus == 1 ? '是' : '否';
					})
				}
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
			                		_this.getData(_this.role, 'page', val);
			                	} else {
			                		_this.getData(_this.role);
			                	}
			                	
			              	}
			            });
		    			
		    			
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));
		    	
		    },
		    handleEdit(index, row) {
		    	this.rowUserId = row.id;
		    	this.$emit('edit', row.id);
				},
				//班级跳转
				clazzHandle(row, column, cell, event){
					console.log(row);
					console.log(column);
					console.log(cell);
					if(column.property=="clazzName"){
						let {href} = this.$router.resolve({
								path:"/clazz/index",
								query: {clazzId:row.clazzId}
						});
						window.open(href);
					}
						
      	}
		},

		components: {
			pwdReset
		}

		

	}
</script>
<style scoped lang="less">
	.el-dropdown-link {
		color: #20a0ff;
	}
	.el-icon-caret-bottom:before {
		color: #94a5bc;
	}
	.more {
		margin-left: 10px;
	}
	.app {
		float: right;
	    width: 105px;
	    margin-left: 10px;
	    outline: 0;
	}
</style>
<style lang="less">
	.coursor{
		cursor: pointer;
		color:#409eff;
	}
</style>