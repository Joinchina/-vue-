<template>
	<div class="w-homeList" id = "reflectList">
		<section class="handle">
			<el-dropdown @command="handleCommand">
				<button type="button" class="btn-green-line" >
					<i class="icon-add"></i> 创建问卷
				</button>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command="a">新建问卷</el-dropdown-item>
					<el-dropdown-item command="b">选择模板</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</section>

		<section class="list round-layout">
			
			<el-table class="" 
				:data = "items"
				:empty-text="loading_font"
				stripe>
				<el-table-column
					prop="title"
					label="问卷名称"
					width="150">
				</el-table-column>
				<el-table-column
					prop="createUserName"
					label="发起人"
					width="140">
				</el-table-column>
				<el-table-column
					prop="courseName"
					label="关联课程"
					width="120">
				</el-table-column>
				<el-table-column
					prop="status"
					label="状态"
					width="110">
					<template slot-scope="scope">
						{{statusName[scope.row.status]}}
					</template>
				</el-table-column>
				<el-table-column
					prop="commitCount"
					label="已提交"
					width="110">
				</el-table-column>
				<el-table-column
					prop="unCommitCount"
					label="未提交"
					width="110">
				</el-table-column>
				<el-table-column
					prop="questionCount"
					label="题目数量"
					width="110">
				</el-table-column>
				<el-table-column
				    label="操作"
				    >
				    <template slot-scope="scope" >
				    	<el-button  type="text" @click.native="handleView(scope.$index, scope.row)">查看</el-button>

				    	<template>
				    		<el-button  type="text" v-if="scope.row.status !=='END'" @click.native="screenView(scope.$index, scope.row)">大屏幕</el-button>
				    		<el-button  type="text" @click.native="exportPaper(scope.row)">导出</el-button>
				    		<el-button  
				    			type="text" 
				    			v-if="scope.row.operationStatus"
				    			@click.native="handleDelPaper(scope.row.questionPaperId)">
				    				删除
				    		</el-button>
				    	</template>

				    </template>
			    </el-table-column>
			</el-table>
			<p class="page-sum">共{{totalElements}}条</p>

			<div class="pagination">
		      <el-pagination
		        :page-size="20"
		        @current-change ="handleCurrentChange"
		        layout="prev, pager, next"
		        :total="totalElements">
		      </el-pagination>
    		</div>

		</section>

		<!--导出报告-->
		<forms-summit 
				:methods = "formObj.method"
				:urls = "formObj.urls"
				:data = "formObj.data"
				ref="postdata">
		</forms-summit>
		<iframe src="" frameborder="0" id="iframeId"></iframe>
	</div>
</template>
<script>
	import { delTip } from '@/global/open'
	import model from 'model/activity/discuss'
	import questionaire from 'model/questionaire/list'
	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'
	import delpaper from 'model/activity/paperview'

	import Clazz from "model/clazz/clazz"
	import formsSummit from 'components/formsumit/form'
import { setTimeout } from 'timers';

	export default {
		data() {
			return {
				items: [],
				cur_page: 1,
				totalElements: 1,
				activityId: '',
				questionPaperId:'',
				statusName: {
					'WAITING': '未开始',
					'INPROGRESS': '进行中',
					'END': '已结束'
				},
				exportIntrosPect:false,
				loading_font:'加载中...',
				orgId: "",	// 机构id
				formObj:{
					method:"post",
					urls:API.urls.experttutu,
					data:{}
				},
				token:"",
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			}
		},
		created(){
			this.token=getToken()
		},
		mounted() {
			this.getList();
			this.getClazzDetails();
		},
		methods: {
			handleCurrentChange(val){
		        this.cur_page = val;
		        this.getList();
      		},
			screenView(index,row){
				let paperId = row.questionPaperId;
				const { href } = this.$router.resolve({
					path:"/activity/vote/fullScreen/",
					query:{
						activityId:row.id,
						paperId:paperId,
						paperKey:row.id + "_" + new Date().getTime()

					}
				})
				window.open(href,"_blank");
			},

			exportPaper(row) {

				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				
				// let myhtml =_iframe.document.getElementById('gethtml').innerHTML;	
				document.getElementById('iframeId').src = '../../../../static/page/questionadmin.html?activityId='+row.id+'&token='+this.token
							
				setTimeout(()=>{
					let _iframe = document.getElementById('iframeId').contentWindow;
					let myhtml =_iframe.document.getElementById('gethtml').innerHTML;
					let data={
						fileName:row.title,
						document:'<!DOCTYPE html>'+'<html>'+myhtml+'</html>',
						token:getToken()
					}
					this.formObj.data=data
					setTimeout(()=>{
						this.$refs.postdata.submitData();							 
					},50)	
				},1000)		
				// window.open(API.urls.exportResPDF+"?paperId="+paperId+"&token="+getToken());
			},

			//删除
			handleDelPaper(paperId) {
				let str = "确定删除吗？";
				delTip(this, str, this.delPaper, paperId);
			},

			delPaper (paperId) {
				let _this = this;
				let data = {
					paperId: paperId
				}
				delpaper.postPaperDel(data, (res => {
					if(res.status == 200) {
		    			this.$message({
			              	type: 'success',
			              	message: '删除成功',
			              	duration: 1000,
			              	onClose() {
			                	// _this.tableData.splice(index, 1);
			                	_this.getList();
			              	}
			            });


		    		} else {
		    			this.$message.error(res.message);
		    		}
				}));
			},
			delCourseAct(id) {
				let _this = this;
				let data = {
					activityId: id
				}

				course.delCourseAct(data, (res => {
					// console.log("delCourseAct",res)
					if(res.status == 200) {
						this.$message({
							type: 'success',
							message: '删除成功',
							duration: 1000,
							onClose() {
								_this.getList();
							}
						});
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			getClazzDetails() {
	            let data = {
	                id: this.clazzId
	            }
	            Clazz.getClassInfor(data, (res => {
	                if(res.status == 200) {
	                    this.orgId = res.data.organizationId
	                } else {
	                    this.$message.error(res.message);
	                }
	            }));
	        },
			handleCommand(command) {
		        if(command == 'a') {
		        	this.$router.push({
						path:"/activity/questionare/create",
						query:{
							clazzId:this.clazzId,
							type:'clazz',
						}
					})
		        }
		        if(command == 'b') {
		        	this.$router.push({
						path:"/questemp/seltemp",
						query:{
							orgId: this.orgId,
							clazzId:this.clazzId,
							type:'clazz',
						}
					})
		        }
		    },
			
			getList() {
				let data = {
					number:this.cur_page,
         			size:20,
					clazzId: this.clazzId
				}
				questionaire.questionnaireActivityListInClazz(data, (res => {
					if(res.status == 200) {
						//console.log(res);
						this.totalElements = res.data.totalElements;
						this.items = res.data.content;
						if(this.items.length==0){
							this.loading_font="暂无数据"
						}
					} else {
						this.$message.error(res.message);
					}
				}));

			},
			handleView(index, row) {
				let activity = row.id;
				const {href} = this.$router.resolve({
					path:"/activity/questionare/result",
					query:{
						clazzId:this.clazzId,
						activityId:activity,
						goStatus:false
					}
				})
				window.open(href, '_blank')

				
			}

		},
		components:{
			formsSummit
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/reset-element-ui/user-table.css";
	@import "../../../assets/less/icon.less";
	.btn-green-line{
    	background-color: #ecf6f5;
    	font-size: 16px;
    	padding: 10px 15px;
    	display: inline-block;
    	i{
    		vertical-align: middle;
    	}
    }
	.w-homeList {
		.handle {
			text-align: right;
			margin-bottom: 20px;
		}
		.list {
			padding: 20px;
		}
		.page-sum {
			font-size: 14px;
		    color: #666;
		    text-align: right;
		    padding-top: 15px;
		}
	}
	#iframeId{
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
	}
</style>