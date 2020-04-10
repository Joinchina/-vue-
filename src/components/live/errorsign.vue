<template>
	<div>
		<el-dialog
			class="live-tip"
		  	title="提示"
		  	:visible.sync="signerror"
		  	:close-on-click-modal="false"
			:modal-append-to-body="false"
		  	width="30%"
		  	:before-close="handleClose"
		  	@open = "open">
		  	<div class="tip-txt">		  		
		  		<img class="tip-img" v-if="type == 'SIGN'" src="../../assets/images/liveIcon/error.png" alt="">
		  		{{message}}
		  		<!-- <span :class="status">{{aswitch == 'start' ? '开启' : '关闭'}}{{actname}}</span> ？ -->
		  	</div>		  	
		  	<span slot="footer" class="dialog-footer">
		  		<!-- <a href="javascript:;" class="btn-cancel"  @click = "handleClose">取 消</a> -->
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
        
		props: ['dialogTip', 'activityId', 'type', 'aswitch', "liveController","message","signerror"],

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
				this.$emit("showerrorsign");
			},
			sendAct() {				
				if(this.type=='SIGN'){
					this.gignin()
				}else{
					this.activity()
				}							
			},
			//签到
			gignin(){
				this.$emit('showerrorsign')				
			},

		}
	}
</script>
<style scoped lang="less">
	@import "../../assets/reset-element-ui/livetip.css";
	.live-tip {
		
		.tip-img {
			width: 46px;
		
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
			font-size: 16px;
			color: #666666;
			line-height: 1em;
			padding: 10px 32px;
			border: 1px solid #ededed;
			border-radius: 18px;
			margin-right: 10px;
		}
		.btn-sure {
			display: inline-block;
			font-size: 16px;
			color: #FFFFFF;
			line-height: 1em;
			padding: 10px 32px;
			background-image: linear-gradient(90deg, #4AC9AA 0%, #1CB6C8 100%);
			border-radius: 18px;

		}
	}
</style>