<template>
	<div class="content">
		<section class="handle clearfix">
			<Goback :passtitle="passtitle" ></Goback>
			<p class="right" style="margin-bottom: 15px;">
				<button class="btn-green" type="button"  @click="exportdata">
					<i class="icon-export-white"></i>
					导出学员日志
				</button>
			</p>
		</section>

		<section class="round-layout j-cont">
			<div class="j-title">
				<span class="left-line">日志任务要求</span>

				<span class="btn-red" @click="comPlete()">
					学员完成情况
					<span class="orange">{{logTask.finishedUserCount}}/{{parseInt(logTask.finishedUserCount+logTask.unFinishedUserCount)}}</span>
					<i class="icon-double-corner"></i>
				</span>

				<h2 class="right">
					<a href="javascript:;"  @click="editLog" class="edit">
						<i class="icon-edit-ora"></i>&nbsp修改要求
					</a>
				</h2>
			</div>

			<div class="box">
				<ul>
					<li>【日志篇数】至少完成{{logTask.minCountLimit}}篇日志</li>
					<li>【字数要求】最低{{logTask.minWordLimit}}字</li>
					<li>【截止日期】{{logTask.endDate?logTask.endDate:'永久'}}</li>
				</ul>
			</div>
		</section>

		<section class="round-layout j-cont mt17 mg-b16">
			<div class="j-title">
				<span class="left-line">学员的日志</span>
			</div>

			<empty tip = "暂时没有学员提交作业" v-if="emptyFlag"></empty>
			<load-more :loadData = "loadData" :loadUrl = "loadUrl" @getList = "getList">
				<section  class="stubox">

					<section class="every" v-for= "(item,index) in stuList">
						<header class="clearfix">
							<div class="logo">
								<img src="../../../assets/img/common/avatar.png" v-if="!item.miniAvatar">
								<img :src="item.miniAvatar" v-else>
							</div>
							<div class="con">
								<h2>{{item.title}}</h2>
								<p>{{item.createDate}}</p>
							</div>
						</header>
						<div class="daily-letter">
							<router-link :to="{path:'/clazz/dailyrecord/detail',query:{logId:item.id,clazzId:clazzId}}" >
								<section @mouseover="blueColur(index,'1')"  @mouseout="blueColur(index,'2')" :class = "{'j-bule':index == colorIndex}">             
									<span  v-for="(obj,indext) in JSON.parse(item.content)">
										{{obj.content}}
									</span>
								</section> 
							 </router-link>
						</div>
					</section>
				</section>

			</load-more>
		</section>

		<!--导出-->
		<export-pop :dialogExport.sync="exportFlag" :clazzId="clazzId"></export-pop>
	</div>
</template>

<script>

	import Empty from '@/base/empty/empty'
	import model from '@/model/clazz/dailyrecord'
	import Api from '@/global/resource'
	import exportPop from './export_pop'
import Goback from 'base/goback/goback';
	import LoadMore from '@/base/loadmore/loadmore'
	export default{
		data(){
			return{
				passtitle:"日志管理",
				clazzId:"",
				exportFlag:false,
				logTask:{},
				stuList:[],
				colorIndex:'z',
				emptyFlag:false,

				loadData:{},
				loadUrl:"",
				query:  {}
			}
		},
		computed:{
			
		},
		created(){
			this.clazzId = this.$route.query.clazzId;

			//获取任务要求
			this.getTaskData();

			this.loadTransfer();
			//获取学员的日志列表
			//this.getStuData();
		},
		mounted() {
			this.query = {
				clazzId: this.clazzId
			}
		},
		methods:{

			blueColur(index,type){
				//console.log(type);
				if(type == '1'){

					this.colorIndex = index;	

				}else{

					this.colorIndex = 'z';

				}
				
			},
			loadTransfer(){
				this.loadData = {
					clazzId:this.clazzId,
					number:1,
					size:20
				}
				this.loadUrl = Api.urls.getUserlogPageByClazzId
			},
			getList(val){

				val.forEach((item,index)=>{
					this.stuList.push(item);
				})

				if(this.stuList.length == 0){
					this.emptyFlag = true;
				}else{
					this.emptyFlag = false;
				}


			},

			comPlete(){
				this.$router.push({
				 	path:'/clazz/dailyrecord/commit',
				 	query:{
				 		clazzId:this.clazzId
				 	}
				 })
			},
			editLog(){

				 this.$router.push({
				 	path:'/clazz/dailyrecord/edit',
				 	query:{
				 		clazzId:this.clazzId
				 	}
				 })
			},

			getTaskData(){

				let data = {
					clazzId:this.clazzId
				}
				model.getUserlogRule(data,(res) =>{

					if(res.status == 200){
						this.logTask = res.data;
					}else{
						this.$message.error(res.message);
					}
				})
			},

			// getStuData(){

			// 	let data = {
			// 		clazzId:this.clazzId
			// 	}
			// 	model.getUserlogPageByClazzId(data,(res) =>{

			// 		if(res.status == 200){
			// 			this.stuList = res.data.content;
			// 		}else{
			// 			this.$message.error(res.message);
			// 		}
			// 	})

			// },

			exportdata(){
				//window.open(Api.urls.)
				this.exportFlag = true;
			}
		},
		components:{
			Empty,
			exportPop,
			LoadMore,
			Goback
		},


	}
</script>

<style lang="less" scoped="">
	@import "../../../assets/less/report.less";
	@import "../../../assets/less/icon.less";
	.btn-green{
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
    .j-cont{
    	padding-left:20px;
    	padding-top: 5px;

    	.j-title{
    		padding: 20px 0;
    		border-bottom: 1px solid #e6e6e6;
    		a.edit,a.edit:hover{
    			color:#FD7E23
    		}
    		.right{
    			float: right;
    			margin-top: 15px;
    			margin-right: 28px;
    			color: #FD7E23;
    			font-size: 18px;
    			display: inline-block;
    			i{
    				vertical-align: middle;
    			}
    		}
    	}
    	.left-line{
    		margin: 0 20px;
    	}
    	.box{
    		padding: 30px 0;
    		li{
    			line-height: 50px;
    			color: #666;
    			padding: 0 13px;
    			font-size: 18px;
    		}
    	}
    	.stubox{
    		padding: 0 10px;

    		.every{
    			border-bottom: 1px solid #e6e6e6;
    			padding-top: 20px;
    			padding-bottom: 20px;
    			padding-left: 20px;
    			margin-bottom: 20px;
    			.j-bule{
    				color:#1077d7;
    			}
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
    		}
    		
    	}
    }
</style>