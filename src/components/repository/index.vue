<template>
	<div class="w-menu">
		<div class="w-content round-layout">
			<!--行列表-->
			<el-row :gutter="24" >
				
				<el-col :span="6" @click.native="routerLink('questemp')">
					<div class="grid-content bg-purple" >
						<span class="icon-questemp"></span>
						<span class="text">
              				问卷模板库
            			</span>
					</div>
				</el-col>
				<el-col :span="6" @click.native="routerLink('worktemp')">
					<div class="grid-content bg-purple" >
						<span class="icon-library"></span>
						<span class="text">
              				资源库
            			</span>
					</div>
				</el-col>
				
			</el-row>
		</div>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				
			}
		},
		computed: {
			orgId() {
				return this.$route.query.orgId;
			}
		},
		mounted() {
		},
		methods: {
			routerLink(type){
				switch(type){
					
					case 'questemp':
						this.$router.push("/org/repository/queslist?orgId=" + this.orgId);
						break;
					default:
						this.$router.push("/org/repository/reposilist?orgId=" + this.orgId);
					

				}
			}
		}
	}
</script>
<style scoped lang="less">
.w-menu{
    .w-content{
      	padding:0 32px 70px 80px;
      	
    }
		
	.bg-purple {
      	box-sizing: border-box;
      	background: #fff;
      	border: 0;
      	box-shadow:-3px 0 3px #e7f5f3, 3px 0 3px #e7f5f3, 0 -3px 3px #e7f5f3, 0 3px 3px #e7f5f3;
      	margin-bottom: 36px;
      	padding-left: 36px;
      
      	height: 89px;
      	line-height: 89px;
      	width: 216px;
      	cursor: pointer;
      	position: relative;

      	
		.icon-questemp {
			background: url("../../assets/img/template/icon-questemp.png") no-repeat;
	        background-size: 100% 100%;
	        width: 44px;
	        height: 44px;
	        display: inline-block;
	        vertical-align: middle;
		}
		.icon-library {
			background: url("../../assets/img/library/kuu.png") no-repeat;
	        background-size: 100% 100%;
	        width: 44px;
	        height: 44px;
	        display: inline-block;
	        vertical-align: middle;
		}

      	.text{
	        font-size: 20px;
	        display: inline-block;
	        padding-left: 8px;
	        color: #666;
	        a {
		        color: #666;
		    }
      	}
     
  	}	
}
.el-row {
	margin-top: 120px;
}
</style>
