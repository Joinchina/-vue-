<template>
	<div class="j-pos">

		<span class="btn-green j-btn-gray" v-show="!reportBtnFlag">
	        报告生成中......
	    </span>
		<button class="btn-green" type="button"  @click="exportdata"  v-show="reportBtnFlag">
			<i class="icon-export-white"></i>
			导出
		</button>

	</div>
</template>
<script>
	export default{
		created(){
			this.reportBtnShow();
		},
		data(){
			return{
				reportBtnFlag:false,
				reportBtnSeconds:5
			}
		},
		methods:{
			reportBtnShow(){
				let _this = this;
		        if(_this.reportBtnSeconds <= 0){
		            _this.reportBtnFlag = true;
		        }else{
		            _this.reportBtnSeconds--;
		            setTimeout(function () {
		              _this.reportBtnShow();
		            }, 1000);
		        }
			},
			exportdata(){
				this.$emit("exportCountdown");
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../assets/less/icon.less";
	.j-pos,.btn-green{
		display: inline-block;
	}
	.btn-green{
      font-size: 16px;
      line-height: 1em;
      color: #FFFFFF;
      letter-spacing: 0;
      background: #35A69D;
      padding: 10px 20px;
    }
	.j-btn-gray{
	    background: #999!important;
		cursor:default!important;		
	}
</style>