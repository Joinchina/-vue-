<template>
	<div>
		<section class="handle clearfix">
			<Goback passtitle="项目总结（模板）" ></Goback>
		</section>

		<!--项目总结模板-->
		<section class="round-layout j-r-tem">
			<div class="box">
				<ul class="clearfix">
					<li>
						<a href="javascript:void(0)" @click="viewPdfShowM(0)" class="word">项目绩效自评报告 (模板)</a>
						<a href="javascript:void(0)" class="load" @click="loadUrlM(0)"></a>
					</li>
					<li>
						<a href="javascript:void(0)" @click="viewPdfShowM(1)" class="word">项目绩效自评模板 (样例)</a>
						<a href="javascript:void(0)"  class="load" @click="loadUrlM(1)"></a>
					</li>
					<li>
						<a href="javascript:void(0)" @click="viewPdfShowM(2)" class="word">教师培训管理手册 (模板)</a>
						<a href="javascript:void(0)" class="load" @click="loadUrlM(2)"></a>
					</li>
					<li>
						<a href="javascript:void(0)" @click="viewPdfShowM(3)" class="word">教师培训管理手册 (样例)</a>
						<a href="javascript:void(0)" class="load" @click="loadUrlM(3)"></a>
					</li>
				</ul>
			</div>
		</section>

		<!-- 大图弹出框 -->
	    <modal :show.sync = "viewPdfShow" contWidth = '80%' bgColor="transparent">
		    <div slot="body" class="w-transparent" style="height:100%">

		        <iframe id="showIframe" frameborder="0" width="100%" height="100%" :src="url"></iframe>
        
      		</div>
    	</modal>
		
	</div>
</template>
<script>
import Api from '@/global/resource'
import Modal from 'base/modal/modal'
import Goback from 'base/goback/goback'
export default{
	data(){
		return{

			viewPdfShow:false,

			url:"",
			loadUrl:""


		}
	},
	created(){
		
	},
	methods:{
		viewPdfShowM(type){

			switch(type){
				case 0:
				this.url = Api.urls.reportEvaluateTpdf;
				break;

				case 1:
				this.url = Api.urls.reportEvaluatePdf;
				break;

				case 2:
				this.url = Api.urls.reportTrainTpdf;
				break;

				case 3:
				this.url = Api.urls.reportTrainPdf;
				break;

				default:


			}
			
			this.viewPdfShow = true;
		},

		loadUrlM(type){
			switch(type){
				case 0:
				this.loadUrl = Api.urls.reportEvaluateT;
				window.open(this.loadUrl);
				break;

				case 1:
				this.loadUrl = Api.urls.reportEvaluate;
				window.open(this.loadUrl);
				break;

				case 2:
				this.loadUrl = Api.urls.reportTrainT;
				window.open(this.loadUrl);
				break;

				case 3:
				this.loadUrl = Api.urls.reportTrain;
				window.open(this.loadUrl);
				break;

				default:
			}
			
		}
	},
	components:{
		Modal,
		Goback
	}
	
}
</script>
<style scoped lang="less">
@import "../../../assets/less/report.less";

.j-r-tem{
	margin-top: 10px;
	.box{
		padding-top: 10%;
		padding-bottom: 20%;
		width: 80%;
		margin:0 auto;
		li{
			float: left;
			width: 50%;
			box-sizing: border-box;
			text-align: center;
			float: left;
			font-size: 20px;
			margin-bottom: 6%;
			a.load{
				background: url('../../../assets/img/report/icon-load.png');
				width: 15px;
				height: 18px;
				display: inline-block;
				margin-left: 35px;
			}
		}
		a.word{
			color:#333;
			text-decoration: none;
		}
		a.word:hover{
			color: #3EA6F7;
			text-decoration: underline;
		}
	}
}
</style>