<template>
	<div class="j-group">
		 <div class="j-content round-layout">
			<!--行列表-->
			<el-row :gutter="24" >
				<el-col :span="6" @click.native="routerLink('system')">
					<div class="grid-content bg-purple" >
						<span class="icon-system"></span>
						<span class="text">
								系统维护
						</span>
					</div>
				</el-col>
				<el-col :span="6" @click.native="routerLink('version')">
					<div class="grid-content bg-purple" >
						<span class="icon-version"></span>
						<span class="text">
								版本发布
						</span>
					</div>
				</el-col>
				<el-col :span="6" @click.native="routerLink('general')">
					<div class="grid-content bg-purple" >
						<span class="gneral-tit"></span>
						<span class="text">
								通用题目
						</span>
					</div>
				</el-col>
				<el-col :span="6" @click.native="routerLink('integral')">
					<div class="grid-content bg-purple" >
						<span class="icon-integral"></span>
						<span class="text">
								积分管理
						</span>
					</div>
				</el-col>
				<el-col :span="6" @click.native="routerLink('trial')">
					<div class="grid-content bg-purple" >
						<span class="icon-trial"></span>
						<span class="text">
								申请试用
						</span>
					</div>
				</el-col>

				<el-col :span="6" @click.native="routerLink('helpcenter')">
					<div class="grid-content bg-purple" >
						<span class="icon-help"></span>
						<span class="text">
							帮助中心
						</span>
					</div>
				</el-col>

				<el-col :span="6" @click.native="routerLink('questemp')">
					<div class="grid-content bg-purple" >
						<span class="icon-questemp"></span>
						<span class="text">
								问卷模板库
						</span>
					</div>
				</el-col>
				<el-col :span="6" @click.native="routerLink('business')">
					<div class="grid-content bg-purple" >
						<span class="icon-business"></span>
						<span class="text">
								商务联系表
						</span>
					</div>
				</el-col>
					<el-col :span="6" @click.native="routerLink('expert')">
					<div class="grid-content bg-purple" >
						<span class="icon-expert"></span>
						<span class="text">
								专家库
						</span>
					</div>
				</el-col>
					<el-col :span="6" @click.native="routerLink('management')">
					<div class="grid-content bg-purple" >
						<span class="icon-management"></span>
						<span class="text">
								课程领域管理
						</span>
					</div>
				</el-col>
				<el-col :span="6" @click.native="routerLink('expertlist')">
					<div class="grid-content bg-purple" style="padding-left: 15px">
						<span class="icon-expertlist"></span>
						<span class="text">
								申请专家联系表
						</span>
					</div>
				</el-col>
				<el-col :span="6" @click.native="routerLink('vipapplylist')">
					<div class="grid-content bg-purple" style="padding-left: 15px">
						<span class="icon-vipApply"></span>
						<span class="text">
								VIP申请
						</span>
					</div>
				</el-col>

				<!-- <el-col :span="6" @click.native="routerLink('wechat')">
					<div class="grid-content bg-purple" >
						<span class="icon-wechat"></span>
						<span class="text">
              				微信接收数据
            			</span>
					</div>
				</el-col> -->

			</el-row>
		</div>
	</div>
</template>

<script>
	export default{

		created(){

		},

		data(){
			return{
				routerLink(type){
					switch(type){
						case 'system':
							this.$router.push("/comtopic/system/maintain");
							break;
						case 'version':
							this.$router.push("/comtopic/version/list");
							break;
						case 'general':
							this.$router.push("/comtopic/list");
							break;
						case 'integral':
							this.$router.push("/comtopic/integral/list");
							break;
						case 'trial':
							this.$router.push("/comtopic/apply/trial");
							break;
						case 'helpcenter':
							this.$router.push("/comtopic/helpcenter/index");
							break;
						case 'questemp':
							this.$router.push("/comtopic/questemp/list");
							break;
						case 'wechat':
							this.$router.push("/comtopic/wechat/list");
							break;
						case 'business':
							this.$router.push("/comtopic/business/business");
							break;
						case 'expert':
							this.$router.push("/expert/org/expert");
							break;
						case 'management':
							this.$router.push("/expert/org/management");
							break;
						case 'expertlist':
							this.$router.push("/expert/org/expertlist");
							break;
						case 'vipapplylist':
							this.$router.push("/comtopic/vipapply/list");
							break;			
						default:

					}
				}
			}
		},

		methods:{
			prolistClick(){

			}
		}

	}
</script>
<style scoped="" lang="less">
	.worgList{
		 background-color: #fff;
    	 border-radius: 6px;
    	 box-shadow: 0 0 3px #eee;
	}

	  .j-group{
	    .j-content{
	      padding:0 32px 70px 80px;
	      h2{
	        float: right;
	        padding-right: 30px;
	        color: #333;
	        font-size:18px;
	        padding-top:22px;
	        a{ color: #333;}
	        i{
	          background:url("../../assets/img/clazz/clazz-line.png") no-repeat;
	          width: 1px;
	          height: 12px;
	          overflow: hidden;
	          display: inline-block;
	          margin:0 14px;
	        }
	      }
	    }
		
	.bg-purple {
      box-sizing: border-box;
      background: #fff;
      border: 0;
      box-shadow:-3px 0 3px #e7f5f3, 3px 0 3px #e7f5f3, 0 -3px 3px #e7f5f3, 0 3px 3px #e7f5f3;
      margin-bottom: 36px;
      padding-left: 30px;
      
      height: 89px;
      line-height: 89px;
      width: 216px;
      cursor: pointer;
      position: relative;
      .gneral-tit{
        background: url("../../assets/img/template/gen_title.png") no-repeat;
        background-size: 100% 100%;
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
      }
		.icon-trial {
			background: url("../../assets/img/template/icon-trial.png") no-repeat;
	        background-size: 100% 100%;
	        width: 44px;
	        height: 44px;
	        display: inline-block;
	        vertical-align: middle;
		}
		.icon-system {
			background: url("../../assets/img/template/icon-system.png") no-repeat;
	        background-size: 100% 100%;
	        width: 44px;
	        height: 44px;
	        display: inline-block;
	        vertical-align: middle;
		}
		.icon-integral {
			background: url("../../assets/img/template/icon-integral.png") no-repeat;
	        background-size: 100% 100%;
	        width: 44px;
	        height: 44px;
	        display: inline-block;
	        vertical-align: middle;
		}
		.icon-version {
			background: url("../../assets/img/template/icon-version.png") no-repeat;
	        background-size: 100% 100%;
	        width: 44px;
	        height: 44px;
	        display: inline-block;
	        vertical-align: middle;
		}

		.icon-help {
			background: url("../../assets/img/template/help.png") no-repeat;
			 background-size: 100% 100%;
	        width: 44px;
	        height: 44px;
	        display: inline-block;
	        vertical-align: middle;
		}
		.icon-questemp {
			background: url("../../assets/img/template/icon-questemp.png") no-repeat;
	        background-size: 100% 100%;
	        width: 44px;
	        height: 44px;
	        display: inline-block;
	        vertical-align: middle;
		}
		.icon-business {
			background: url("../../assets/img/template/business.png") no-repeat;
	        background-size: 100% 100%;
	        width: 44px;
	        height: 44px;
	        display: inline-block;
	        vertical-align: middle;
		}
		.icon-wechat {
			background: url("../../assets/img/wechat/icon-wechat.png") no-repeat;
	        background-size: 100% 100%;
	        width: 44px;
	        height: 44px;
	        display: inline-block;
	        vertical-align: middle;
		}
		.icon-expert{
			background: url("../../assets/img/expert/expert.png") no-repeat;
	        background-size: 100% 100%;
	        width: 44px;
	        height: 44px;
	        display: inline-block;
	        vertical-align: middle;
		}
		.icon-management{
			background: url("../../assets/img/expert/management.png") no-repeat;
	        background-size: 100% 100%;
	        width: 44px;
	        height: 44px;
	        display: inline-block;
	        vertical-align: middle;
		}
		.icon-expertlist{
			background: url("../../assets/img/expert/expertlist.png") no-repeat;
	        background-size: 100% 100%;
	        width: 44px;
	        height: 44px;
	        display: inline-block;
	        vertical-align: middle;
		}
			.icon-vipApply{
				background: url("../../assets/img/expert/VIPicon.png") no-repeat;
				background-size: 100% 100%;
				width: 44px;
				height: 44px;
				display: inline-block;
				vertical-align: middle;
			}
      .text{
        font-size: 20px;
        display: inline-block;
        padding-left: 3px;
        color: #666;
      }
      .text a{
        color: #666;
      }
  	}
  }
   .el-row{
    margin-top:120px;
  }

</style>