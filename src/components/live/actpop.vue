<template>
	<div>
		<el-dialog
			class="live-tip"
		  	title="提示"
		  	:visible.sync="dialogTip"
			:modal-append-to-body="false"
		  	:close-on-click-modal="false"
		  	width="30%"
		  	:before-close="handleClose"
			:show-close="false"
		  	@open = "open">
		  	<div class="tip-txt">
		  		<img class="tip-img" v-if="type == 'HOMEWORK'" src="../../assets/img/liveIcon/tip-work.png" alt="">
		  		<img class="tip-img" v-else-if="type == 'VOTE'" src="../../assets/img/liveIcon/tip-vote.png" alt="">
		  		<img class="tip-img" v-else-if="type == 'QUESTIONNAIRE'" src="../../assets/img/liveIcon/tip-ques.png" alt="">
		  		<img class="tip-img" v-else-if="type == 'EVALUATION'" style="vertical-align: text-bottom;" src="../../assets/img/liveIcon/tip-pj.png" alt="">
		  		<img class="tip-img" v-else-if="type == 'INTROSPECTION'" src="../../assets/img/liveIcon/tip-fs.png" alt="">
		  		<img class="tip-img" v-else-if="type == 'SIGN'" src="../../assets/img/liveIcon/tip-sign.png" alt="">
		  		是否确认立即
		  		<span :class="status">{{aswitch == 'start' ? '开启' : '关闭'}}{{actname}}</span> ？
		  	</div>
		  	
		  	<span slot="footer" class="dialog-footer">
		  		<a href="javascript:;" class="btn-cancel"  @click = "handleClose">取 消</a>
		  		<a href="javascript:;" class="btn-sure" @click = "sendAct()">确 定</a>
		    	
		  	</span>
		</el-dialog>
	</div>
</template>
<script>
	import live from 'model/live/live';
	import { actStatus,startsign } from '@/sw/utils/sig';
	export default {
		data() {
			return {
				
			}
		},


		props: ['dialogTip', 'activityId', 'type', 'aswitch', "liveController"],

		computed: {
			courseId(){
				return this.$route.query.courseId
			},
			status() {
				return {
					green: this.aswitch == 'start',
					yellow: this.aswitch == 'end'
				}
			},
			actname() {
				let name = "";
				switch(this.type) {
					case 'HOMEWORK':
						name = "作业";
						break;
					case 'VOTE':
						name = "投票";
						break;
					case 'QUESTIONNAIRE':
						name = "问卷";
						break;
					case 'EVALUATION':
						name = '评价';
						break;
					case 'INTROSPECTION':
						name = "反思";
						break;
					case 'SIGN':
						name = "签到";
						break;
				}
				return name;
			}
		},

		methods: {

			open() {

			},

			handleClose() {
				this.$emit('update:dialogTip', false);
			},
			sendAct() {				
				if(this.type=='SIGN'){
					this.gignin()
				}else{
					this.activity()
				}							
			},
			//直播间活动
			activity(){
				let data = {
					activityId: this.activityId,
					status: this.aswitch
				}
				live.liveCourseActStatus(data, (res => {
					console.log("更改活动状态", res);
					if(res.status == 200) {
						this.handleClose();
						this.$emit("updateList");
						if(this.aswitch == 'start') {
							// 发送开启信道
							this.liveController.sendChannelMsg(actStatus("PUBLISH_TASK",this.type, this.activityId, this.courseId));
						}
						if(this.aswitch == 'end') {
							// 发送关闭信道
							this.liveController.sendChannelMsg(actStatus("OVER_TASK",this.type, this.activityId, this.courseId));
						}
					} else {
						this.$message.error(res.message);
						this.handleClose();

						if(this.type == 'EVALUATION' || this.type == 'INTROSPECTION' ) {
							if(this.aswitch == 'start') {
								// 发送开启信道
								this.liveController.sendChannelMsg(actStatus("PUBLISH_TASK",this.type, this.activityId, this.courseId));
							}
							if(this.aswitch == 'end') {
								// 发送关闭信道
								this.liveController.sendChannelMsg(actStatus("OVER_TASK",this.type, this.activityId, this.courseId));
							}
						}
					}
				}));
				
			},
			//签到
			gignin(){
				this.$emit('showtoollist')				
			},

		}
	}
</script>
<style scoped lang="less">
	@import "../../assets/reset-element-ui/livetip.css";

	.live-tip {
		
		.tip-img {
			width: 46px;
			height: 37px;
		}

		.tip-txt {
			font-size: 18px;
			color: #333333;
		}
		.green {
			color: #009791;
		}
		.yellow {
			color: #FD7E23;
		}
		.btn-cancel {
			display: inline-block;
			font-size: 15px;
			color: #666666;
			line-height: 1em;
			padding: 8px 25px;
			border: 1px solid #ededed;
			border-radius: 18px;
			margin-right: 10px;
		}
		.btn-sure {
			display: inline-block;
			font-size: 15px;
			color: #FFFFFF;
			line-height: 1em;
			padding: 8px 25px;
			background-image: linear-gradient(90deg, #4AC9AA 0%, #1CB6C8 100%);
			border-radius: 18px;

		}
	}
</style>