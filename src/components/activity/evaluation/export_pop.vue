<template>
	<div id="wexportEavl">
		<el-dialog class="dialog-form " title="导出类型"
			:visible.sync="dialogExport"
			:close-on-click-modal="false"
			:before-close="close">
			<ul class="eval-box clearfix">
				<li @click="exportEvalExcel">
					
					<div class="export-box">
						<span class="vipLogo"></span>
						<i class="icon-exp-excel"></i>
						<h3 class="sub-title">EXCEL</h3>
						<p class="desc">原始数据导出</p>
					</div>
				</li>
				<li @click="exportEvalPdf">
					
					<div class="export-box">
						<span class="vipLogo"></span>
						<i class="icon-exp-pdf"></i>
						<h3 class="sub-title">PDF</h3>
						<p  class="desc">统计结果导出</p>
					</div>
				</li>
				<li>
					
					<div class="export-box">
						<span class="vipLogo"></span>
						<i class="icon-exp-word"></i>
						<h3 class="sub-title">WORD</h3>
						<p  class="desc">统计结果导出</p>
						<div class="exp-btn clearfix">
							<a class="green" href="javascript:;"  @click="exportEvalWord">整体导出</a>
							<a class="blue" href="javascript:;" @click="exportEvalWordDetail">分学员明细</a>
						</div>
					</div>
				</li>
			</ul>
		</el-dialog>
	</div>
</template>
<script>
	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'
import { setTimeout } from 'timers';

	export default {
		props: ['dialogExport', 'paperId'],
		methods: {
			close() {
				this.$emit('update:dialogExport', false);
			},
			exportEvalExcel() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.exportResExcel+"?paperId="+this.paperId+"&token="+getToken());
			},
			exportEvalPdf() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				// window.open(API.urls.exportResPDF+"?paperId="+this.paperId+"&token="+getToken());
				setTimeout(()=>{
					this.$emit('exportEvaluationPdfM')
				    this.close()
				},100)
				
			},
			exportEvalWord() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.exportEvaluationWordTable+"?paperId="+this.paperId+"&token="+getToken());
			},
			exportEvalWordDetail() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.exportEvalWordDetail+"?paperId="+this.paperId+"&token="+getToken());
			}

		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/reset-element-ui/form.css";
	@import "../../../assets/less/icon.less";
	#wexportEavl {
		.eval-box {
			margin: -30px -42px -30px -15px;
    		overflow: hidden;
			padding: 15px 0;
			background-color: #f2f3f5;
			>li {
				position: relative;
				float: left;
				width: 33%;
				box-sizing: border-box;
				padding: 35px 0;
				text-align: center;
				cursor: pointer;
				transition: all .5s;
				-moz-transition: all .5s;
				-webkit-transition: all .5s;
				-o-transition: all .5s;
				border-right: 1px solid #e3e4e6;

				&:last-child{
					border-right: 0;
				}
				&:hover {
					.export-box {
						background: #7092e2;

    					background:-moz-linear-gradient(top, #7f8fe0, rgba(113, 146, 226, 1));
    					background:-webkit-gradient(linear, 0 200,252  bottom, from(#7f8fe0), to(rgba(113, 146, 226, 1)));
					}
					.icon-exp-excel {
						background-image: url("../../../assets/img/icon/icon-exp-excel2.png");
					}
					.icon-exp-pdf {
						background-image: url("../../../assets/img/icon/icon-exp-pdf2.png");
					}
					.icon-exp-word {
						background-image: url("../../../assets/img/icon/icon-exp-word2.png");
					}
					.sub-title {

						color: #fff;

					}
					.desc {

						color: #fff;

					}
					.green,.blue {
						color: #fff;
					}
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
		.export-box {
			position: relative;
			margin: 0 auto;
			width: 180px;
			height: 252px;
			background-color: #fff;
			border-radius: 8px;
			box-shadow: 0 0 2px 3px #ebecee;
			display: block;
			padding-top: 40px;
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
		.exp-btn {
			position: absolute;
			bottom: 35px;
			width: 180px;
			height: 41px;
			border-top: 1px solid #eee;
			line-height: 40px;
			text-align: center;
			bottom: 0px;
			>a {
				box-sizing: border-box;
				float: left;
				width: 50%;
				font-size: 14px;
				&:first-child {
					border-right: 1px solid #eee;
				}
				&.green {
					color: #009791;
				}
				&.blue {
					color: #1077D7;
				}
				
			}
		}
	}

</style>