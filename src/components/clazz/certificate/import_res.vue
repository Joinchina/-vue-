<template>
	<div class="import-res">
		<el-dialog class="dialog-form" title="导入结果"
               :visible.sync = "dialogImportRes"
               :close-on-click-modal="false"
               :before-close="close">
	      	<!--content_start-->
	      	<div class="import-res" >
		        <p class="import-data">
		        	您共导入<span class="ora">{{total}}</span>条数据，<span class="ora">{{res.success}}</span>条数据导入成功！<span class="ora">{{res.fail}}</span> 条数据导入失败！
		        </p>

		        <div class="tip">
		        	<p>导入成功的证书已经发给学员：学员可以在我的证书里面查看下载。如下图：</p>
		        	<img src="../../../assets/img/certificate/eg1.png" alt="">
		        	<img src="../../../assets/img/certificate/eg2.png" alt="">
		        	<p v-if="res.exportFlag">
		        		<span class="ora">{{res.fail}}</span>
		        		条数据导入失败，请下载文件查看失败原因
		        		<a href="javascript:;" class="download" @click = "clazzCertExpFail">下载文件</a>
		        	</p>
		        </div>
		        
	        </div>
	        <!--content_end-->

	        <div slot="footer" class="dialog-footer">
	        	<button @click="close" class="btn-green-square">确定</button>
	        </div>
	    </el-dialog>
	</div>
</template>
<script>
	import API from '@/global/resource'
	import { getToken } from '@/filters/userVerify'
	export default {
		data() {
			return {

			}
		},
		props: ['dialogImportRes','res'],
		computed: {
			total() {
				return parseInt(this.res.success) + parseInt(this.res.fail);
			}
		},
		methods: {
			close() {
				this.$emit('update:dialogImportRes', false);
				
			},
			// 导出学员失败文件
			clazzCertExpFail() {
				window.open(API.urls.clazzCertExpFail+"?excelUrl="+this.res.url+"&token="+getToken());
			},
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/reset-element-ui/form.css";
	.import-res {
		padding-left: 35px;
	}
	.import-data {
		font-size:18px;
		color:#333333;
		letter-spacing:0;
		line-height:36px;
		margin-bottom: 14px;
		
	}
	.ora {
		color: #ea5113;
	}
	.tip {

		img {
			width: 97px;
			height: 166px;
			display: inline-block;
			margin: 10px 15px 24px 0;
		}
	}
	.download {
		color:#1077d7;
		text-decoration: underline;
	}
	.btn-green-square {
		padding: 7px 24px;
	}
</style>