<template>
	<div class="activity">
		<ul class="act-list" >
			<template v-for="item in items">
			<li  v-if="item.type == 'HOMEWORK'">
				<div class="top clearfix" >
					<img src="../../assets/img/liveIcon/icon-act-work.png" alt="">
					<span class="white" ><i class="green">作业 ({{item.commitCount}}/</i>{{item.totalCount}})</span>
					<a href="javascript:;" class="open" 
						@click = "handleAct('HOMEWORK', 'start', item.id)"
						v-if="item.status !== 'INPROGRESS'"
						>开启</a>
					<a href="javascript:;" class="close" 
						@click = "handleAct('HOMEWORK', 'end', item.id)"
						v-else-if="item.status == 'INPROGRESS'">关闭</a>
				</div>
				<p class="title">{{item.title}}</p>
			</li>
			<li v-if="item.type == 'VOTE'">
				<div class="top">
					<img src="../../assets/img/liveIcon/icon-act-vote.png" alt="">
					<span class="white"><i class="green">投票 ({{item.commitCount}}/</i>{{item.totalCount}})</span>
					<a href="javascript:;"  class="open" 
						@click = "handleAct('VOTE', 'start', item.id)"
						v-if="item.status !== 'INPROGRESS'"
						>开启</a>
					<a href="javascript:;" class="close" 
						@click = "handleAct('VOTE', 'end', item.id)"
						v-else-if="item.status == 'INPROGRESS'"
						>关闭</a>
				</div>
				<p class="title">{{item.title}}</p>
			</li>
			<li v-if="item.type == 'QUESTIONNAIRE'">
				<div class="top">
					<img src="../../assets/img/liveIcon/icon-act-ques.png" alt="">
					<span class="white"><i class="green">问卷 ({{item.commitCount}}/</i>{{item.totalCount}})</span>
					<a href="javascript:;"  class="open" 
						@click = "handleAct('QUESTIONNAIRE', 'start', item.id)"
						v-if="item.status !== 'INPROGRESS'"
						>开启</a>
					<a href="javascript:;" class="close" 
						@click = "handleAct('QUESTIONNAIRE', 'end', item.id)"
						v-else-if="item.status == 'INPROGRESS'"
						>关闭</a>
				</div>
				<p class="title">{{item.title}}</p>
			</li>
			<li v-if="item.type == 'EVALUATION'">
				<div class="top">
					<img src="../../assets/img/liveIcon/icon-act-pj.png" alt="">
					<span class="white"><i class="green">评价 ({{item.commitCount}}/</i>{{item.totalCount}})</span>
					<a href="javascript:;"  class="open" 
						@click = "handleAct('EVALUATION', 'start', item.id)"
						>开启</a>
					
				</div>
				<p class="title">{{item.title}}</p>
			</li>
			<li v-if="item.type == 'INTROSPECTION'">
				<div class="top">
					<img src="../../assets/img/liveIcon/icon-act-fs.png" alt="">
					<span class="white"><i class="green">反思 ({{item.commitCount}}/</i>{{item.totalCount}})</span>
					<a href="javascript:;"  class="open"  
						@click = "handleAct('INTROSPECTION', 'start', item.id)"
						>开启</a>
				
				</div>
				<p class="title">{{item.title}}</p>
			</li>
			</template>
		</ul>

		<!-- 活动开启关闭提示弹出框 -->
		<act-pop
			:dialogTip.sync = "popShow"
			:activityId = "curActId"
			:type = "actType"
			:aswitch = "actSwitch"
			@updateList = "getList"
			:liveController = "liveController"
			:courseId = "courseId"></act-pop>

	</div>
</template>
<script>
	import actPop from './actpop'
	import live from 'model/live/live'

	export default {
		data () {
			return {
				items: [],			// 活动列表
				popShow: false,
				curActId: "",		// 当前活动id
				actType: "",	// 活动类型
				actSwitch: "",	// 活动操作
			}
		},

		props: ["courseId", "liveController"],
		mounted() {
			this.getList();
		},
		methods: {
			handleAct(stype, sswitch, actId) {
				this.actSwitch = sswitch;
				this.actType = stype;
				this.curActId = actId;
				this.popShow = true;
			},

			getList() {
				let data = {
					courseId: this.courseId
				}

				live.liveCourseActList(data, (res => {
					console.log("直播活动列表=================", res);
					if(res.status == 200) {
						this.items = res.data;
					} else {
						this.$message.error(res.message);
					}
				}));
			}
		},

		components: {
			actPop
		}
	}
</script>
<style scoped lang="less">
::-webkit-scrollbar {
	width: 10px;/*竖向滚动条的宽度*/
	height: 10px;/*横向滚动条的高度*/
}
/*滚动条轨道的样式*/
::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	-webkit-border-radius: 10px;
	border-radius: 10px;
}
/*滚动条轨道内滑块的样式*/
::-webkit-scrollbar-thumb {
	-webkit-border-radius: 10px;
	border-radius: 10px;
	background: rgba(155,155,155,0.8);
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
}
	.act-list {
		width: 100%;
		height: 100%;
		li {
			padding: 12px 20px;
			border-bottom: 1px solid rgba(255,255,255,0.05);
		}
		.top {
			font-size: 16px;
			line-height: 16px;
			margin-bottom: 10px;

			>img {
				display: inline-block;
				width: 24px;
				height: 24px;
				border-radius: 12px;
				vertical-align: -6px;
			}
			.green {
				color: #08BF8F;
			}
			.white {
				color: #FFFFFF;
			}
			.open,
			.close {
				float: right;
				font-size: 14px;
				line-height: 14px;
				padding: 6px 14px;
				background: rgba(0,0,0,0.74);
				border-radius: 14px;
				color: #fff;
			}
			.close {
				color: #D0021B;
			}
		}
		.title {
			font-size: 14px;
			color: #CCCCCC;
			line-height: 1.5em;

			overflow:hidden; 
			text-overflow:ellipsis;
			display:-webkit-box; 
			-webkit-box-orient:vertical;
			-webkit-line-clamp:2; 
		}
		
	}
	.activity {
		height: 80vh;
		overflow-y: auto;
	}
	
</style>