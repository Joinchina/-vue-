<style scoped lang="less">
	@import "../../../assets/reset-element-ui/form.css";
	@import "../../../assets/less/icon.less";
	#wexportWork {


		.work-box {
			margin: -30px -20px;
			padding: 15px 0;
			background-color: #f2f3f5;
			li {
				float: left;
				width: 33%;
				box-sizing: border-box;
				padding: 35px 46px;
				text-align: center;
				cursor: pointer;
				transition: all .5s;
				-moz-transition: all .5s;
				-webkit-transition: all .5s;
				-o-transition: all .5s;
				position: relative;
				z-index: 10;

				&:first-child{
					border-right: 1px solid #e3e4e6;
				}
				&:nth-child(2){
					border-right: 1px solid #e3e4e6;
				}
				

				.sub-title {
					font-size: 18px;
					color: #333;
					line-height: 2em;
				}
				.desc {
					font-size: 14px;
					color: #666;
					margin-top: 25px;
				}


			}
			
		}
		.work-hover{
			&:hover {
					.export-box {
							background: #7092e2;

	    					background:-moz-linear-gradient(top, #7f8fe0, rgba(113, 146, 226, 1));
	    					background:-webkit-gradient(linear, 0 200,252  bottom, from(#7f8fe0), to(rgba(113, 146, 226, 1)));
					}
					.icon-pre-export{
							background-image: url("../../../assets/img/icon/icon-pre-export.png");
					}
					.icon-export-all {
							background-image: url("../../../assets/img/icon/icon-export-all2.png");
					}
					.icon-export-sel {
							background-image: url("../../../assets/img/icon/icon-export-sel2.png");
					}
					.sub-title {

						color: #fff;

					}
					.desc {

							color: #fff;

					}
			}
		}

		.export-box {
			margin: 0 auto;
			min-width: 140px;
			height: 252px;
			background-color: #fff;
			border-radius: 8px;
			box-shadow: 0 0 2px 3px #ebecee;
			display: block;
			padding-top: 40px;
			position: relative;
			.vipLogo{
				position: absolute;
				right: 10px;
				top: 10px;
				width: 27px;
				height: 15px;
				content: "";
				background: url("../../../assets/img/expert/vipLogo.png") center center no-repeat;
				background-size: 27px 14px;
			}

		}
		
	}

	.work-box-disable{
		    li{
		    	cursor: default!important;
		    }
			.opacity{
				background: rgba(255,255,255,0.9);
				z-index: 20;
				position: absolute;
				left: 45px;
				top: 35px;
				height: 252px;
				width: 70%;
				box-sizing: border-box;
				border-radius: 8px;

			}
			.opacity-text{
				color: #1077d7;
				font-size: 18px;
				line-height: 25px;
				position: absolute;
				left: 35%;
				top: 45%;
				z-index: 30;
			}
	}



</style>
<template>
	<div id="wexportWork">
		<el-dialog class="dialog-form brief" title="导出学员作业"
			:visible.sync="dialogExport"
			:close-on-click-modal="false"
			:before-close="close">
			<ul class="work-box clearfix">
				<li :class="{'work-hover':workHover}">
					<a href="javascript:void(0)" @click="workExportEachStu('EXCELLENT')" :class="{'work-box-disable':applyFlagO}">
						<div class="export-box">
							<span class="vipLogo"></span>
							<i class="icon-pre-export"></i>
							<h3 class="sub-title">优秀作业导出</h3>
							<p class="desc">
							    指本作业中被评为<br/>优秀的学员作业
							</p>
						</div>

						<!--报告生成中-->
						<section v-show = "applyFlagO">
							<div class="opacity"></div>
							<div class="opacity-text">
								报告生成中...<br/>
								请2小时后再来
							</div>
						</section>
					</a>
					

				</li>
				<li class="work-hover" @click="workExportAllStu">
						<div class="export-box">
							<span class="vipLogo"></span>
							<i class="icon-export-all"></i>
							<h3 class="sub-title">整体导出</h3>
							<p class="desc">所有学员作业生成<br/>一个word文档</p>
						</div>

				</li>
				<li :class="{'work-hover':workHover}">
					<a href="javascript:void(0)" @click="workExportEachStu('ALL')" :class="{'work-box-disable':applyFlagT}">
						<div class="export-box">
							<span class="vipLogo"></span>
							<i class="icon-export-sel"></i>
							<h3 class="sub-title">分学员导出</h3>
							<p class="desc">每一个学员作业<br/>生成一个文件夹</p>
						</div>

						<!--报告生成中-->
						<section v-show = "applyFlagT">
							<div class="opacity"></div>
							<div class="opacity-text">
								报告生成中...<br/>
								请2小时后再来
							</div>
						</section>
					</a>
				</li>
			</ul>

		</el-dialog>
	</div>
</template>
<script>
	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'
	import model from '@/model/activity/homework'

	export default {
		data () {
			return {
				applyFlagO:false,
				applyFlagT:false,
				workHover:true,
				urlO:"javascript:void(0)",
				urlT:"javascript:void(0)"
			}
		},

		props: ['dialogExport', 'activityId'],
		created() {

		},
		methods: {
			close () {
				this.$emit('update:dialogExport', false);
				this.applyFlagO = false;
				this.applyFlagT = false;
				this.urlO = "javascript:void(0)",
				this.urlT = "javascript:void(0)"
			},
			workExportAllStu() {
				//return false;
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.workExportAllStu+"?activityId="+this.activityId+"&token="+getToken());
			},

			//优秀作业导出 -- 分学员导出
			workExportEachStu(type) {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				let data = {
					activityId : this.activityId,
					homeworkType :type
				}
				model.getWorkApply(data, (res => {
					if(res.status == 200) {
						 if(!res.data){

						 	//分学员导出，正在申请中
						 	if(type == "ALL"){
						 		this.applyFlagT = true;
						 		
						 	//优秀作业，正在申请中
						 	}else{
						 		this.applyFlagO = true;
						 	}

						 	this.workHover = false;
						 	
						 }else{


						 	//分学员导出，正在申请中
						 	if(type == "ALL"){
						 		
						 		this.applyFlagT = false;
						 		this.urlT = res.data;
						 		window.location = this.urlT;
						 		
						 		
						 	//优秀作业，正在申请中
						 	}else{						 		
						 		this.applyFlagO = false;
						 		this.urlO = res.data;
						 		window.location = this.urlO;
						 	}
						 	this.workHover = true;


						 }
					} else {
						this.$message.error(res.message);
					}
				}));
				//this.applyWhether(type);
				//window.open(API.urls.workExportEachStu+"?activityId="+this.activityId+"&token="+getToken());
			}
		}
	}
</script>
