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
				width: 50%;
				box-sizing: border-box;
				padding: 35px 56px;
				text-align: center;
				cursor: pointer;
				transition: all .5s;
				-moz-transition: all .5s;
				-webkit-transition: all .5s;
				-o-transition: all .5s;

				&:first-child{
					border-right: 1px solid #e3e4e6;
				}
				&:hover {
					.export-box {
						background: #7092e2;

    					background:-moz-linear-gradient(top, #7f8fe0, rgba(113, 146, 226, 1));
    					background:-webkit-gradient(linear, 0 200,252  bottom, from(#7f8fe0), to(rgba(113, 146, 226, 1)));
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
			margin: 0 auto;
			min-width: 200px;
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



</style>
<template>
	<div id="wexportWork">
		<el-dialog class="dialog-form brief" title="导出反思"
			:visible.sync="dialogExport"
			:close-on-click-modal="false"
			:before-close="close">
			<ul class="work-box clearfix">
				<li @click="introsExcel">
					<div class="export-box">
						<span data-v-fd8852ee="" class="vipLogo"></span>
						<i class="icon-exp-excel"></i>
						<h3 class="sub-title">EXCEL</h3>
						<p class="desc">原数据导出</p>
					</div>

				</li>
				<li @click="introsPdf">
					<div class="export-box">
						<span data-v-fd8852ee="" class="vipLogo"></span>
						<i class="icon-exp-pdf"></i>
						<h3 class="sub-title">PDF</h3>
						<p class="desc">统计结果导出</p>
					</div>
				</li>
			</ul>
		</el-dialog>
	</div>
</template>
<script>
	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'

	export default {
		data () {
			return {
				paperId:""
			}
		},

		props: ['dialogExport', 'questionPaperIds'],
		created() {
		},
		methods: {
			close () {
				this.$emit('update:dialogExport', false);
			},
			introsExcel() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				this.paperId = this.questionPaperIds;
				window.open(API.urls.exportResExcel+"?paperId="+this.paperId+"&token="+getToken());
			},
			introsPdf() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				// this.paperId = this.questionPaperIds;
				// window.open(API.urls.exportResPDF+"?paperId="+this.paperId+"&token="+getToken());
				setTimeout(()=>{
					this.$emit('exportEvaluationPdfM')
				    this.close()
				})
			},
		}
	}
</script>
