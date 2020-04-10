<template>
	<div id="w-table">
		<div class="top mg-b16 clearfix">
			<span class="w-sum">学员：{{totalElements}}人</span>
			<span class="remainingStu" @click="toAccountCenter">机构剩余学员数：<em :class="{attention:(vipInfo.studentCount-(!!vipInfo.useStudentCount ? vipInfo.useStudentCount : 0)<121)}">{{vipInfo | studentLeaveFilter}}</em></span>
			<!-- v-show="vipInfo.studentCount!=-1" -->
			<el-select class="app" v-model="value" placeholder="使用APP"   @change = "appStatusSearch">
		         <el-option
		            v-for="item in options"
		            :key="item.value"
		            :label="item.label"
		            :value="item.value">
		         </el-option>
	        </el-select>

	        <div class="search">
	          <input type="text" v-model="searchQuery" placeholder="账号/姓名/手机号" @keyup.13="getStudentList('search')" /><i class="el-icon-search" @click.stop="getStudentList('search')"></i>
	        </div>

	  	</div>
		<el-table class="list"
			:data = "tableData"
			:empty-text="loading_font"
			@cell-click="clazzHandle"
			stripe
			>
			<el-table-column
				prop="username"
				label="账号"
				fixed="left"
				width="180">				
			</el-table-column>
			<el-table-column
				prop="name"
				label="姓名"
					fixed="left"
				width="150">
			</el-table-column>
			<el-table-column
				prop="phone"
				label="手机号"
					fixed="left"
				width="120">
			</el-table-column>
			<el-table-column
				prop="appStatus"
				label="使用APP"
				width="120">
			</el-table-column>
			<el-table-column
				prop="organizationName"
				label="所在机构"
				:show-overflow-tooltip="true"
				width="150">
			</el-table-column>
			<el-table-column
				prop="projectName"
				label="所在项目"
				:show-overflow-tooltip="true"
				width="150">
			</el-table-column>
			<el-table-column
				prop="clazzName"
				label="所在班级"
				class-name="coursor"
				:show-overflow-tooltip="true"
				width="150">
			</el-table-column>
			<el-table-column

			    label="操作"
			    width="160">
			    <template slot-scope="scope">
			    	<el-button type="text" @click.native="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-dropdown class="more" placement="bottom-start">
						<span class="el-dropdown-link">
							更多
							<i class="el-icon-caret-bottom"></i>
						</span>
						<el-dropdown-menu class="down" slot="dropdown">
							<el-dropdown-item  @click.native="handlePwd(scope.$index, scope.row)">
								<i class="icon-reset"></i>
								密码重置
							</el-dropdown-item>
							<el-dropdown-item @click.native="handleDel(scope.$index, scope.row, tableData)">
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

		<!-- 编辑学员 -->
		<edit-stu
			:dialogEditClass.sync="editStu"
			:userId = "rowUserId"
			role = "STUDENT"
			></edit-stu>
	</div>

</template>
<script>
	import model from 'model/user/org_list'
	import user from 'model/user/user_manage'
	import pwdReset from 'components/user/pwd_reset'
	import editStu from 'components/members/student_edit'
	import { delTip } from '@/global/open'
	import bus from '@/global/bus'

	export default {
		data () {
			return {
				tableData: [],
				orgId: "",
				searchQuery: "",
				cur_page: 1,
				pwdShow: false,		//密码重置弹出框
				rowUserId:"",		// 当前row userid
				editStu: false,		// 编辑学员弹出框
				totalElements: 0,
				loading_font:this.$globalParam.loadText,
				vipInfo : {}, 	// 账号vip信息
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
			let _this = this;
			this.$nextTick(()=>{
				this.getStudentList();
			})
			bus.$on('updateStuUserList',function(role) {
					_this.getStudentList();
			})
			// bus.$on('orgListEvent', ( message => {
	  //           this.getStudentList();
		//       }))
		},

		mounted() {

		},
		methods: {
			appStatusSearch(value){
		        this.app = value;
		        this.cur_page = 1;
		        this.getStudentList();
		    },
			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getStudentList();
			},
			getStudentList(type, cur_page) {
				this.orgId = this.$route.query.orgId;
				let data = {
					organizationId: this.orgId,
					keyword: this.searchQuery,
					number: cur_page || this.cur_page,
					appStatus:this.app

				}
				if(type == 'search') {
					data.number=1;
				}

				if(!!this.orgId) {
					model.getStudentList(data, ( res => {
						// console.log("class", res)
						if(res.status == 200) {
							this.totalElements = res.data.totalElements;
							this.tableData = res.data.content;
							this.loading_font=this.$globalParam.dataEmpty;
							this.tableData.forEach(function(value,index,arr) {
								arr[index].appStatus = value.appStatus == 1 ? '是' : '否';
							})
							this.vipInfo = this.$store.getters.getOrgVipInfo
							//用来控制学员人数的显示隐藏
							if(this.vipInfo.studentCount!=-1){
								$(".remainingStu").show();
							}
						}
					}));
				} else {
					console.log('缺少orgId');
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
		    handleEdit(index, row) {
		    	this.editStu = true;
		    	this.rowUserId = row.id;

		    	// console.log("orgiiii", this.rowUserId);
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
			                		_this.getStudentList('page', val);
			                	} else {
			                		_this.getStudentList();
			                	}
			                	
			              	}
			            });


		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));

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
						
				},
				toAccountCenter(){
					this.$router.push({path: "/orgAccount/index", query:{orgId: this.orgId}})
				}
		},

		filters:{
			studentLeaveFilter(value){
				let studentCount = value.studentCount ? value.studentCount : 0;
				let useStudentCount = value.useStudentCount ? value.useStudentCount : 0;
				if(studentCount > useStudentCount){
					return studentCount - useStudentCount;
				}else{
					return 0	
				}
			}
		},

		components: {
			pwdReset,
			editStu
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
		.remainingStu{
			font-size: 16px;
			color: #FD7E23;
			margin-left: 20px;
			cursor: pointer;
			display: none;
			.attention{
				color: #CC3300;
			}
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
<style lang="less">
	.coursor{
		cursor: pointer;
		color:#409eff;
	}
</style>
