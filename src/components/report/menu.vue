<template>
	<div class="rcontent round-layout">
		<el-row :gutter="24">
			<el-col :span="6">
				<router-link class="grid-content" :to="{path: '/report/course/creport', query: { clazzId: clazzId, courseId: courseId}}">
					<i class="icon-report-course"></i>
					课程报告
				</router-link>
			</el-col>
			<el-col :span="6">
				<router-link class="grid-content" :to="{ path: '/report/attendance/areport', query: { clazzId: clazzId}}">
					<i class="icon-report-attendance"></i>
					考勤报告
				</router-link>
			</el-col>
			<el-col :span="6">
				<router-link  class="grid-content" :to="{path: '/report/stu/sreport', query: {clazzId:clazzId}}">
					<i class="icon-report-stu"></i>
					学员报告
				</router-link>
			</el-col>
			<el-col :span="6">
				<router-link  class="grid-content" :to="{path: '/report/expert/ereport', query: { clazzId: clazzId}}">
					<i class="icon-report-expert"></i>
					专家报告
				</router-link>
			</el-col>
			<el-col :span="6">
				<router-link  class="grid-content" :to="{path: '/report/traineff/freport', query: {clazzId:clazzId}}">
					<i class="icon-report-stu2"></i>
					学员成果报告
				</router-link>
			</el-col>
			<el-col :span="6">
				<router-link  class="grid-content" :to="{path: '/report/training/treport', query: { clazzId: clazzId}}">
					<i class="icon-report-train"></i>
					培训效果报告
				</router-link>
			</el-col>
			<el-col :span="6">
				<router-link  class="grid-content" :to="{path: '/report/pro/summary', query: { clazzId: clazzId}}">
					<i class="icon-report-all"></i>
					项目总结(模板)
				</router-link>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import course from 'model/report/course'
	export default {
		data() {
			return {
				courseList: [],	//课程列表
			}
		},
		created(){

		},
		mounted() {
			this.getCourseList();
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			},
			courseId() {
				return this.courseList.length > 0 ? this.courseList[0].id : '';
			}
		},
		methods: {
			getCourseList() {
				// console.log("clazzId", this.clazzId);
				let data = {
					clazzId: this.clazzId
				}
				course.getCourseList(data,res => {
					
					if(res.status == 200 ) {
						this.courseList = res.data;
						console.log("课程列表", this.courseList);
					} else {
						this.$message.error(res.message);
					}
				});
			}
		}
	}
</script>
<style scoped lang="less">
.rcontent {
	padding: 120px 32px 70px 80px;

	.grid-content {
		box-sizing: border-box;
		display: inline-block;
	    background: #fff;
	    border: 0;
	    box-shadow:-3px 0 3px #e7f5f3, 3px 0 3px #e7f5f3, 0 -3px 3px #e7f5f3, 0 3px 3px #e7f5f3;
	    margin-bottom: 36px;
	    padding-left: 18px;
	      
	    height: 89px;
	    line-height: 89px;
	    width: 216px;
	    cursor: pointer;
	    position: relative;
	}
	i {
		width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 8px;
	}
	.icon-report-course {
		background: url("../../assets/img/report/icon-report-course.png") 0 0 no-repeat;
	}
	.icon-report-attendance {
		background: url("../../assets/img/report/icon-report-attendance.png") 0 0 no-repeat;
	}
	.icon-report-stu {
		background: url("../../assets/img/report/icon-report-stu.png") 0 0 no-repeat;
	}
	.icon-report-expert {
		background: url("../../assets/img/report/icon-report-expert.png") 0 0 no-repeat;
	}
	.icon-report-stu2 {
		background: url("../../assets/img/report/icon-report-stu2.png") 0 0 no-repeat;
	}
	.icon-report-train {
		background: url("../../assets/img/report/icon-report-train.png") 0 0 no-repeat;
	}
	.icon-report-all {
		background: url("../../assets/img/report/icon-report-all.png") 0 0 no-repeat;
	}
	a {
		font-size: 20px;
	    color: #666;
	}
}
</style>