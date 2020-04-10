<template>
	<div class="w-evalList">
		<section class="handle">
			<button type="button" class="btn-green" @click="exportList">
				<i class="icon-export-white"></i> 导出
			</button>
		</section>

		<section class="list round-layout">
			
			<el-table class=""
				:data = "items"
				v-loading="exportLoading"
				:empty-text="loading_font"
				stripe>
				<el-table-column
					prop="courseName"
					label="课程名称"
					width="200"
					>
				</el-table-column>
				<el-table-column
					label="类型"
					width="150">
					<template slot-scope="scope">
						{{levelName[scope.row.level]}}
					</template>
				</el-table-column>
				<el-table-column
					prop="questionCount"
					label="题数"
					width="110">
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
					prop="committedRate"
					label="提交率"
					width="110">
				</el-table-column>
				<el-table-column
				    label="操作">
				    <template slot-scope="scope" >
				    	<template v-if="scope.row.status !=='add'">
				    		<el-button  type="text" @click.native="handleView(scope.$index, scope.row)">查看</el-button>
				    		<el-button type="text" @click.native="handleExport(scope.$index, scope.row)">导出评价</el-button>
				    		<el-button type="text" @click.native="editEvaluation(scope.$index, scope.row)">修改题目</el-button>

				    		<el-button v-if="scope.row.level == 'CLAZZ'" type="text" @click.native="timeSet(scope.$index, scope.row)">时间设置</el-button>
							
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
		</section>
		<!-- 导出评价 -->
		<export-eval
			:dialogExport.sync = "exportEval"
			:paperId = "paperId"
			@exportEvaluationPdfM="exportEvaluationPdfM"
		></export-eval>

		<!--修改模板-->
		<import-template
		:dialogTemModify.sync="TemModify" 
		@listEditSuccess = "getDataWhile"
		:types="type"
		list="list"
		:courseName = "courseName"
		:activityId = "activityId"
		:clazzId = "clazzId">
       </import-template>

       <!-- 起止时间设置 -->
		<er-time-set
		:dialogSetTime.sync="setTimeEr"
		:activityId = "activityId">
		</er-time-set>

		<iframe :src="iframeurl" frameborder="0" id="iframeId"></iframe>
		<!--导出报告-->
		<forms-summit 
			:methods = "formObj.method"
			:urls = "formObj.urls"
			:data = "formObj.data"
			ref="postdata">
		</forms-summit>

	</div>
	
</template>
<script>
	import model from 'model/activity/evaluation'
	import exportEval from 'components/activity/evaluation/export_pop'

	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'


	import importTemplate from 'components/activity/vote/modify'

	import erTimeSet from 'components/course/er_time_set'
	import formsSummit from 'components/formsumit/form'
	export default {
		data() {
			return {
				items: [],
				cur_page: 1,
				totalElements: 1,
				// activityId: '',
				paperId: '',
				levelName: {
					'COURSE': '课程评价',
					'CLAZZ' : '班级评价'
				},
				exportEval: false,
				loading_font:'加载中...',

				//修改评价模板
				type:"",
				courseName:"",
				activityId:"",
				TemModify:false,
				setTimeEr:false, //起止时间设置
				token:'',
				formObj:{
					method:"post",
					urls:API.urls.experttutu,
					data:{}
				},
				iframeurl:'',
				title:"",
				exportLoading: false,
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			}
		},
		mounted() {
			this.getList();
		},
		methods: {

			timeSet(index,row){
				this.activityId = row.id;
		        this.setTimeEr = true;
			},

			getDataWhile(){
				this.getList();
			},


			//修改评价
			editEvaluation(index,row){

				//console.log("对象");
				console.log(row);
				this.type = row.type;
				console.log('type');
				console.log(this.type);
				this.courseName = row.courseName;
				this.activityId = row.id;

				this.TemModify = true;
			},
			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getList();
			},
			getList() {
				let data = {
					clazzId: this.clazzId,
					number: this.cur_page,
					size: '20'
				}
				model.getClazzEvalList(data, (res => {
					//console.log("评价列表",res);
					let _this = this;
					if(res.status == 200) {
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
				let activityId = row.id;
				let level = "";
				//项目任务
				if(row.level == "CLAZZ"){
					level = "task";
				//课程管理
				}else{
					level = "det";
				}
				const {href} = this.$router.resolve({
					path: '/activity/evaluation/result',
					query: {
						clazzId: this.clazzId,
						activityId: activityId,
						crumb:level,
						goStatus:"false"
					}
				})
				window.open(href, '_blank')
			},
			handleExport(index, row) {                
				this.paperId = row.questionPaperId;
				this.iframeurl='../../../../static/page/questionadmin.html?activityId='+row.id+'&token='+getToken();
				this.exportEval = true;
				this.courseName=row.courseName;
				this.title=row.title
			},
			//提交导出
			 exportEvaluationPdfM(){
				let _iframe = document.getElementById('iframeId').contentWindow;
				let myhtml =_iframe.document.getElementById('gethtml').innerHTML;					
				let data={
					fileName:this.courseName+this.title,
					document:'<!DOCTYPE html>'+'<html>'+myhtml+'</html>',
					token:getToken()
				}
				this.formObj.data=data
				setTimeout(()=>{
					this.$refs.postdata.submitData();						 
				},50)		
			},
			exportList() {
				if(this.$store.getters.getOrgVipInfo.vip){
					window.open(API.urls.exportEvalClazz+"?clazzId="+this.clazzId+"&token="+getToken());
				}else{
					this.$store.state.vipFuncPopFalg = true;
				}
				
			}

		},
		components: {
			exportEval,
			importTemplate,
			erTimeSet,
			formsSummit
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/reset-element-ui/user-table.css";
	@import "../../../assets/less/icon.less";
	  #iframeId{
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
	}
	.btn-green{
		display: inline-block;
		margin-left: 15px;
		font-size: 16px;
		padding: 10px 25px;
		border-radius: 5px;
		i{
			vertical-align: middle;
		}
	}
	.w-evalList {
		.handle {
			text-align: right;
			.btn-green {
				display: inline-block;
				margin-bottom: 20px;
			}
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
</style>