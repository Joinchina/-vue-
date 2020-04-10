<template>
	<div class="w-menu">
		<div class="w-content round-layout">
			<!--行列表-->
			<el-row :gutter="24" >
				
				<el-col :span="6" @click.native="routerLink('itemcount')">
					<div class="grid-content bg-purple" >
						<span class="icon-item-count"></span>
						<span class="text">
              				项目统计
            			</span>
					</div>
				</el-col>

				<el-col :span="6" @click.native="routerLink('expert')">
					<div class="grid-content bg-purple" >
						<span class="icon-expert"></span>
						<span class="text">
              				专家授课情况
            			</span>
					</div>
				</el-col>

				<el-col :span="6" @click.native="routerLink('itemscore')">
					<div class="grid-content bg-purple" >
						<span class="icon-item-score"></span>
						<span class="text">
              				项目评分
            			</span>
					</div>
				</el-col>

				<el-col :span="6" @click.native="routerLink('coursescore')">
					<div class="grid-content bg-purple" >
						<span class="icon-course-score"></span>
						<span class="text">
              				课程评分
            			</span>
					</div>
				</el-col>
				<el-col :span="6" @click.native="routerLink('itemsatisfact')">
					<div class="grid-content bg-purple" >
						<span class="icon-item-satisfact"></span>
						<span class="text">
              				项目满意度
            			</span>
					</div>
				</el-col>

				<el-col :span="6" @click.native="routerLink('coursesatisfact')">
					<div class="grid-content bg-purple" >
						<span class="icon-course-satisfact"></span>
						<span class="text">
              				课程满意度
            			</span>
					</div>
				</el-col>

				<el-col :span="6" @click.native="routerLink('taskstate')">
					<div class="grid-content bg-purple" >
						<span class="icon-task-state"></span>
						<span class="text">
              				任务完成情况
            			</span>
					</div>
				</el-col>

				<el-col :span="6" @click.native="routerLink('leavemsg')">
					<div class="grid-content bg-purple" >
						<span class="icon-leave-msg"></span>
						<span class="text">
              				学员留言
            			</span>
					</div>
				</el-col>
			</el-row>
				
		</div>
	</div>
</template>
<script>
	import {getCurRole} from '../../filters/userVerify'
	import { mapGetters} from 'vuex';
	import storage from '@/global/storage'

	export default {
		data () {
			return {
				role: getCurRole(),
				orgId: this.$route.query.orgId,
			}
		},
		computed: {
			// orgId() {
			// 	return this.$route.query.orgId;
			// },
			...mapGetters(['showOrgObj'])
		},
		watch:{

	        showOrgObj(cur,old){
	            console.log("总结报告 －　当前机构id", cur.identification);
	             this.orgId = cur.identification;

	             console.log("vuex orgId *** ", cur.identification);
	             this.role = cur.role || storage.get("exp_role"); 
	        },

	    },
		mounted() {
		},
		methods: {
			routerLink(type){
				switch(type){
					
					case 'itemcount':
						this.$router.push("/orgreport/itemstat?orgId=" + this.orgId);
						break;
					case 'expert':
						this.$router.push("/orgreport/expertstate?orgId=" + this.orgId);
						break;
					case 'itemscore':
						this.$router.push("/orgreport/itemscore?orgId=" + this.orgId);
						break;
					case 'coursescore':
						this.$router.push("/orgreport/coursescore?orgId=" + this.orgId);
						break;
					case 'itemsatisfact':
						this.$router.push("/orgreport/itemsat?orgId=" + this.orgId);
						break;
					case 'coursesatisfact':
						this.$router.push("/orgreport/coursesat?orgId=" + this.orgId);
						break;
					case 'taskstate':
						this.$router.push("/orgreport/taskstate?orgId=" + this.orgId);
						break;
					case 'leavemsg':
						this.$router.push("/orgreport/leavemsg?orgId=" + this.orgId);
						break;

				}
			}
		}
	}
</script>
<style scoped lang="less">
.w-menu{
    .w-content{
      	padding:0 32px 70px 80px;
      	
    }
		
	.bg-purple {
      	box-sizing: border-box;
      	background: #fff;
      	border: 0;
      	box-shadow:-3px 0 3px #e7f5f3, 3px 0 3px #e7f5f3, 0 -3px 3px #e7f5f3, 0 3px 3px #e7f5f3;
      	margin-bottom: 36px;
		text-align: center;
      
      	height: 89px;
      	line-height: 89px;
      	width: 216px;
      	cursor: pointer;
      	position: relative;

      	
		.icon-item-count,
		.icon-expert,
		.icon-item-score,
		.icon-course-score,
		.icon-item-satisfact,
		.icon-course-satisfact,
		.icon-task-state,
		.icon-leave-msg {
			background: url("../../assets/img/moduleicon/icon-item-count.png") no-repeat;
	        background-size: 100% 100%;
	        width: 44px;
	        height: 44px;
	        display: inline-block;
	        vertical-align: middle;
		}
		.icon-expert {
			background: url("../../assets/img/moduleicon/icon-app.png") no-repeat;
			background-size: 100% 100%;
		}
		.icon-item-score {
			background: url("../../assets/img/moduleicon/icon-item-score.png") no-repeat;
			background-size: 100% 100%;
		}
		.icon-course-score {
			background: url("../../assets/img/moduleicon/icon-course-score.png") no-repeat;
			background-size: 100% 100%;
		}
		.icon-item-satisfact {
			background: url("../../assets/img/moduleicon/icon-item-satisfact.png") no-repeat;
			background-size: 100% 100%;
		}
		.icon-course-satisfact {
			background: url("../../assets/img/moduleicon/icon-course-satisfact.png") no-repeat;
			background-size: 100% 100%;
		}
		.icon-task-state {
			background: url("../../assets/img/moduleicon/icon-task-state.png") no-repeat;
			background-size: 100% 100%;
		}
		.icon-leave-msg {
			background: url("../../assets/img/moduleicon/icon-leave-msg.png") no-repeat;
			background-size: 100% 100%;
		}

      	.text{
	        font-size: 20px;
	        display: inline-block;
	        padding-left: 8px;
	        color: #666;
	        a {
		        color: #666;
		    }
      	}
     
  	}	
}
.el-row {
	margin-top: 120px;
}
</style>
