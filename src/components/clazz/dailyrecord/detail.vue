<template>
	<div class="content">
		<section class="handle clearfix">
			
			<Goback passtitle="日志详情" ></Goback>
		</section>

		<section class="round-layout j-article">
			<section class="every">
				<header class="clearfix">
					<div class="logo">
						<img src="../../../assets/img/common/avatar.png" v-if="!stuDetail.miniAvatar">
						<img v-else :src="stuDetail.miniAvatar">
					</div>
					<div class="con">
						<h2>{{stuDetail.title}}</h2>
						<p>{{stuDetail.createDate}}</p>
					</div>
				</header>
				<div class="letter">

					<div v-for="(item,index) in stuContent"  >
						<p v-if="item.content != ''" :style="{color:item.color,fontSize:fontFormat[item.size]}">
							{{item.content}}
						</p>
						<p v-if="!!item.url">
							<img :src="item.url" @click="showbigimg(item.url)">
						</p>
						<p v-else>
							<br/>
						</p>
					</div>

				</div>
			</section>
		</section>
		<imgview :passimg='img' ref="number"></imgview>
	</div>
</template>
<style scoped="" lang="less">
	@import "../../../assets/less/report.less";
	@import "../../../assets/less/icon.less";
	@import "../../../assets/less/btn-search.less";
	.j-article{
		padding: 25px 0 10px 20px;
		.every{
    			padding-top: 20px;
    			padding-bottom: 20px;
    			padding-left: 20px;
    			margin-bottom: 20px;
    			width: 680px;
    			.logo{
	    				float: left;
	    				vertical-align: middle;
	    				img{
	    					width: 50px;
	    					height: 50px;
	    					border-radius: 50%;
	    				}
	    		}
	    		.con{
	    				float:left;
	    				padding-left: 17px;
	    				h2{
	    					color: #333;
	    					font-size: 18px;
	    				}
	    				p{
	    					color: #999;
	    					padding-top: 10px;
	    				}
	    		}
	    		.letter{
	    								
					margin-top: 21px;
					color: #666;
					img{
						margin:10px 0;
						max-width: 300px;
						height: auto;
						text-align: center;
					}
					p{
						line-height: 28px;
						color: #666;
					}

	    		}
    		}	
	}
</style>
<script>
	import { getToken } from '@/filters/userVerify';
	import model from '@/model/clazz/dailyrecord';
	import Api from '@/global/resource';
	import Goback from 'base/goback/goback';
	import imgview from 'base/modal/imgviewone';
	export default{
		data(){
			return{
				stuDetail:{},
				clazzId:"",
				stuContent:[],
				fontFormat:{
					normal:'14px',
					middle:"16px"
				},
				img:[],
				imgArr:[],
			}
		},
		created(){
			this.getDetailData();

			this.clazzId = this.$route.query.clazzId;
		},
		

		methods:{

			getDetailData(){
				let data = {
					userLogId:this.$route.query.logId
				}
				model.getUserlogDetails(data,(res)=>{
					this.stuDetail = res.data;
					this.stuContent = JSON.parse(res.data.content);
					this.stuContent.forEach(ele=>{
						if (!!ele.url) {
						   this.img.push(ele)
					    }
					})								
				})
			},
			showbigimg(num){
				this.img.forEach((msg,index)=>{
					if(msg.url==num){
						this.$refs.number.getpassindex(index)
					}
				})				
			}
		},

		components: {
			Goback,
			imgview,
		}
	}
</script>