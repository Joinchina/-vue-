<template>
	<div class="">
		<!-- 保存证书 -->
		<div class="handle2">
			<button class="btn-green" type="button" @click="goUpdate">
				<i class="icon-cert-save"></i>
				重新编辑
			</button>
		</div>
		
		<section class="round-layout clearfix" >
			<h2 class="cert-title">证书样式</h2>
			<div class="cert-box ">
				<img class="bg" :src="cert.backgroundUrl" alt="">
				<div class="cert-bottom clearfix">
					<div class="leftbox">
						<p class="signet-name">{{cert.leftStampName}}</p>
						<img class="left-signet" v-if="cert.leftStampUrl" :src="cert.leftStampUrl" alt="">
					</div>

					<div class="rightbox">
						<p class="signet-name">{{cert.rightStampName}}</p>
						<img class="right-signet" v-if="cert.rightStampUrl" :src="cert.rightStampUrl" alt="">
					</div>
				</div>
			</div>	
		</section>
	
	
		
	</div>
</template>
<script>
import certificate from 'model/certificate/certificate'

export default {
	data () {
		return {
			item: {}
		}
	},
	props: ["orgId", "cert"],
	
	created () {

	},
	mounted () {
		
	},
	methods: {
		goUpdate() {
			this.$router.push({ 
				path: '/org/certificate/update', 
				query: {orgId: this.orgId}
			});
		}
		

	},

	components: {
		
	}
}
</script>
<style scoped lang="less">
	@import "../../assets/less/icon.less";
	// @import "../../assets/less/btn-search.less";


	.handle2 {
		text-align: right;
		margin-top: -40px;
		button {
			display: inline-block;
			margin-left: 12px;
			font-size: 16px;
			padding: 0;
		    height: 38px;
		    width: 105px;
		    margin-bottom: 13px;
		}
		.btn-green {
			border-radius: 3px;
			&::after{
				width : 0;
				height: 0;
			}
		}
	}

	.round-layout {
		
	}
	.cert-title {
		font-size:20px;
		color:#101010;
		letter-spacing:0;
		text-align:center;
		line-height:36px;
		padding: 50px 0 10px;
	}
	.cert-box {
		position: relative;
		width: 525px;
		height: 385px;
		margin: 0 auto 60px;
		.cert-bottom {
			width: 100%;
			position: absolute;
			z-index: 2;
			height: 80px;
			line-height: 80px;
			font-size: 12px;
			bottom: 38px;
    		text-align: center;
		}
		.bg {
			position: absolute;
			z-index: 1;
			width: 525px;
			height: 385px;
		}
		.leftbox,
		.rightbox {
			width: 50%;
			float: left;
			text-align: center;
			> p {
				height: 80px;
			}

		}
		.rightbox {
			float: right;
		}
		.right-signet,
		.left-signet {
			position: absolute;
			width: 80px;
			height: 80px;
			margin-top: -95px;
		    margin-left: -40px;
		    z-index: 3;
		}
		.signet-name {
			white-space: nowrap;
			overflow: hidden;
		}
	}
</style>