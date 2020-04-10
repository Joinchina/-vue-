<template>
	<div class="w-satisfied">
		<section class="handle">
			<button type="button" class="btn-green" @click="exportList">
				<i class="icon-export-white"></i>
				导出
			</button>
		</section>

		<section class="list round-layout">
			
			<el-table class=""
				:data = "items"
				:empty-text="loading_font"
				stripe>
				<el-table-column
					prop="courseName"
					label="课程名称"
					>
				</el-table-column>
				<el-table-column
					prop="mainTeacherName"
					label="专家"
					>
				</el-table-column>
				<el-table-column
					prop="status"
					label="状态"
					>
					<template slot-scope="scope">
						{{statusName[scope.row.status]}}
					</template>
				</el-table-column>
				<el-table-column
					label="提交人数/学员数"
					>
					<template slot-scope="scope">
						{{scope.row.submitNum}}/{{scope.row.totalNum}}
					</template>
				</el-table-column>
				<el-table-column
					label="非常满意"
					>
					<template slot-scope="scope" >
						{{scope.row.ratio_A}}%
					</template>
				</el-table-column>
				<el-table-column
					label="满意"
					>
					<template slot-scope="scope" >
						{{scope.row.ratio_B}}%
					</template>
				</el-table-column>
				<el-table-column
					label="一般"
					>
					<template slot-scope="scope" >
						{{scope.row.ratio_C}}%
					</template>
				</el-table-column>
				<el-table-column
					label="不满意"
					>
					<template slot-scope="scope" >
						{{scope.row.ratio_D}}%
					</template>
				</el-table-column>
				<el-table-column
					label="操作"
					>
					<template slot-scope="scope" >
			    		<el-button  type="text" @click.native="handleView(scope.$index, scope.row)">查看</el-button>
			    		<el-button type="text" @click.native="handleExport(scope.$index, scope.row)">导出</el-button>
				    </template>
				</el-table-column>
			</el-table>
		</section>
		<!-- 导出评价 -->
		<export-eval
			:dialogExport.sync = "exportEval"
			:paperId = "paperId"
			@exportPdf="exportPdf"
		></export-eval>
		<!-- PDF导出 -->
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
	import courseSatisfied from 'model/clazz/course'
	import model from 'model/activity/evaluation'
	import exportEval from 'components/activity/evaluation/export_pop'

	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'
	import formsSummit from 'components/formsumit/form'
	export default {
		data() {
			return {
				items: [],
				cur_page: 1,
				totalElements: 1,
				paperId: '',
				exportEval: false,
				statusName: {
					'WAITING': '未开始',
					'INPROGRESS': '进行中',
					'END': '已结束'
				},
				loading_font:'加载中...',
				iframeurl:'',
				formObj:{
					method:"post",
					urls:API.urls.experttutu,
					data:{}
				},
				courseName:'',
				title:'',
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
			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getList();
			},
			getList() {
				let data = {
					clazzId: this.clazzId,
					order: true
				}

				courseSatisfied.getCourseSatisfaction(data, (res => {
					// console.log("满意度", res);
					if(res.status == 200) {
						this.items = res.data;
						if(this.items.length==0){
							this.loading_font="暂无数据"
						}
					} else {
						this.$message.error(res.message);
					}
				}));

			},
			handleView(index, row) {
				let activityId = row.activityId;
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
				this.exportEval = true;
				this.courseName=row.courseName;
				this.title=row.title==undefined?'培训课程评价':row.title;
				this.iframeurl='../../../../static/page/questionadmin.html?activityId='+row.activityId+'&token='+getToken()
			},
			//获取导出的pdf
			exportPdf () {
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
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.clazzCourseSatExp+"?clazzId="+this.clazzId+"&token="+getToken());
			},
		},
		components: {
			exportEval,
			formsSummit,
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	@import "../../../assets/reset-element-ui/user-table.css";
	#iframeId{
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
	}
	.w-satisfied {
		.handle {
			text-align: right;
			.btn-green {
				display: inline-block;
				margin-bottom: 20px;
				padding: 10px 15px;
				font-size: 16px;
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