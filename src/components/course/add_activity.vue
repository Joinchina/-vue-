<template>
	<div id="waddActivity">
		<el-dialog class="dialog-form" title="添加课程活动"
		:visible.sync="dialogAddAct"
		:close-on-click-modal="false"
		:before-close="close">
		<div class="box clearfix">
			<a href="javascript:;" @click="createWork">
				<i class="icon-homework"></i>
				<p>作业</p>
			</a>
			<a href="javascript:void(0)" @click="createDiscuss">
				<i class="icon-discuss"></i>
				<p>讨论组</p>
			</a>
			<a href="javascript:void(0)" @click="createVote" >
				<i class="icon-vote"></i>
				<p>投票</p>
			</a>
			<a href="javascript:void(0)">
				<el-dropdown @command="handleCommand">
					<i class="icon-questionnaire"></i>
					<p>问卷</p>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="a">新建问卷</el-dropdown-item>
						<el-dropdown-item command="b">选择模板</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</a>
			<!--问答暂时功能不要了-->
			<!-- <a href="javascript:void(0)" @click="addAnswer = true">
				<i class="icon-qa"></i>
				<p>问答</p>
			</a> -->
			<a href="javascript:void(0)" @click="createPhoto">
				<i class="icon-photowall"></i>
				<p>拍照上墙</p>
			</a>
			<!-- <a href="javascript:void(0)"></a> -->
			<a href="javascript:void(0)" @click="issueRes">
				<i class="icon-resource-com"></i>
				<p>资源</p>
			</a>
			<a href="javascript:void(0)" @click="workMutual">
				<i class="icon-mutual"></i>
				<p>学员互评作业</p>
			</a>
		</div>
		</el-dialog>
		<!--新建问答-->
		<answer-create :dialogAddAnswer.sync = "addAnswer"
		title="新建问答" :dialogcourseId="courseId"></answer-create>

		<!-- 新建照片墙 -->
		<photo-create
		:dialogAddPhoto.sync = "addPhoto"
		:courseId="courseId"></photo-create>


	    <!--新建讨论组-->
	    <discuss-create :dialogAddDiscuss.sync = "addDiscuss"
	                    :taskName = "taskName"
	                    :dialogcourseId = "courseId"
	    ></discuss-create>

	    <!-- 创建作业 -->
		<work-create
			:dialogAddWork.sync = "addWork"
			:taskName = "taskName"
			:courseId = "courseId"
			:defaultFlag = "defaultFlag"
			@createmywork="createmywork"
			>
			
		</work-create>

		<!-- 发布资源 -->
		<issue-res
			:dialogIssue.sync = "addRes"
			:courseId = "courseId"
			:courseName = "taskName">
		</issue-res>

		<!-- 创建学员互评作业 -->
		<mutual-create
			:dialogAddMutual.sync = "addMutual"
			:taskName = "taskName"
			:courseId = "courseId"
			:defaultFlag = "defaultFlag"
			@createmywork="createmywork">
			
		</mutual-create>
	</div>

</template>
<script>
	import { getToken, getCurRole } from '@/filters/userVerify';
//	import { getApi } from '@/global/util'
	import answerCreate from '../activity/answer/create';
	import discussCreate from '../activity/discuss/create';
	import photoCreate from 'components/activity/photo/create'
	import workCreate from 'components/activity/homework/create'
	import mutualCreate from 'components/clazz/createMutualWork'
	import issueRes from 'components/activity/resource/issue'

	import Clazz from "model/clazz/clazz"

export default {
	data() {
		return {
			clazzId:this.$route.query.clazzId,
			addAnswer:false,
			addPhoto: false,
			addDiscuss:false,
			addWork: false,
			addMutual:false,
			addRes: false,
      		typeFlag:"",
      		role: getCurRole(),
      		orgId: "",	// 机构id
		}
	},
	// defaultFlag = true  是项目任务
	props: ['dialogAddAct', 'courseId',"taskName", 'defaultFlag'],
	created() {
	  if(this.$route.path == "/course/detail"){
        this.typeFlag = "detail"
    }else{
        this.typeFlag = "task"
    }
	},
	mounted() {
		this.getClazzetails();
	},
	methods: {
		createmywork(){
			this.$emit('getwork')
		},
		close() {
			this.$emit('update:dialogAddAct', false);

		},
		getClazzetails() {
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
						courseId:this.courseId,
						type:this.typeFlag
					}
				})
	        }
	        if(command == 'b') {
	        	this.$router.push({
					path:"/questemp/seltemp",
					query:{
						orgId: this.orgId,
						clazzId: this.clazzId,
						courseId:this.courseId,
						type:this.typeFlag
					}
				})
	        }
	    },
		// createQuestion(){
		// 	// window.open("/static/page/question.html?clazzId="+this.clazzId+"&courseId="+this.courseId+"&type="+this.typeFlag+"&token="+getToken());

		// 	this.$router.push({
		// 		path:"/activity/questionare/create",
		// 		query:{
		// 			clazzId:this.clazzId,
		// 			courseId:this.courseId,
		// 			type:this.typeFlag
		// 		}
		// 	})
		// },
		createVote(){
			window.open("/static/page/vote.html?clazzId="+this.clazzId+"&courseId="+this.courseId+"&type="+this.typeFlag+"&token="+getToken());
		},

		createPhoto() {
			this.addPhoto = true;
			this.close();
		},
	    createDiscuss(){
	      	this.addDiscuss = true;
	      	this.close();
	    },
	    createWork() {
	    	this.addWork = true;
	    	this.close();
	    },
	    issueRes() {
	    	this.addRes = true;
	    	this.close();
		},
		workMutual(){
			this.addMutual = true;
	    	this.close();
		}
	},
	components:{
		answerCreate,
		photoCreate,
		discussCreate,
		workCreate,
		issueRes,
		mutualCreate
	}

}
</script>
<style scoped lang="less">
	@import "../../assets/reset-element-ui/form.css";
	@import "../../assets/less/icon.less";

	#waddActivity {
		.el-dialog__body{
            max-height: 700px;
        }
		padding: 25px 15px;

		.box {
			width: 600px;
			margin: 0 auto;
			background-color: #fff;
			position: relative;
			z-index: 2;
		}

		a {
			box-sizing: border-box;
			float: left;
			width: 195px;
			height: 170px;
			text-align: center;
			color: #666;
			padding-top: 35px;
			border-right: 1px solid #f3f3f3;
			border-bottom: 1px solid #f3f3f3;
			

			&:nth-child(1),
			&:nth-child(2),
			&:nth-child(3){
				border-top: 0;
			}
			&:nth-child(3){
				border-right: 0;
			}

			&:nth-child(1),
			&:nth-child(4),
			&:nth-child(7) {
				border-left: 0;
			}

			&:nth-child(6) {
				cursor: default;
				border-right: 0;
			}
			&:nth-child(7){
				border-bottom: 0;
				border-right: 1px solid #f3f3f3;
			}
		}
	}
</style>
