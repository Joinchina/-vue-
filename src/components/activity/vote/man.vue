<template>
	<section class="" id="voteNum">
		<main class="x-view">
			<nav class="subnav clearfix">
				
				<Goback passtitle="提交人数" ></Goback>
				<span class="right">
					<button type="button" class="btn-green" @click="exportUser">导出名单</button>
					
				</span>
				
			</nav>
	
			<section class="x-article">
				<div class="header no-border">
					<h1>提交人数 <span class="red">{{submitNum}}</span><em class="ora">/</em><span class="grey" > {{totalNum}} </span></h1>
					<ul class="tab-nav clearfix">
						<!-- <li @click="showAll" :class="status == 'normal' ? 'active' : ''">全部</li> -->
						<li @click="showFinish" :class="status == 'finish' ? 'active' : ''">已提交</li>
						<li @click="showUnfinish" :class="status == 'unfinish' ? 'active' : ''">未提交</li>
					</ul>
				</div>
				
				<table class="table part-list">
					<thead>
						<tr>
							<!-- <th>ID</th> -->
							<th>账号</th>
							<th>姓名</th>
							<th>手机号</th>
							<!-- <th>提交状态</th> -->
							<th v-if="status == 'finish'">提交时间</th>
							<!-- <th v-show="type == 'INTROSPECTION' && status == 'finish' && realname=='true'">操作</th> -->
						    <th v-if="status == 'finish'">操作</th>
							<!-- <th v-show="type == 'QUESTIONNAIRE' && status == 'finish' && selectcolor ==true">操作</th> -->
						</tr>
					</thead>
					<tbody>
						<template v-for="item in users">
							<!-- <tr v-if="status == 'normal'">
								<td >{{item.userId}}</td>
								<td >{{item.username}}</td>
								<td >{{item.name}}</td>
								<td >{{item.phone}}</td>
								<td >{{item.submitStatus == 0 ? '未提交' : '已提交'}}</td>
								<td >{{item.submitTime}}</td>
								<td  v-show="type == 'INTROSPECTION'">
								  <a :href="'/questionpaper/user/answer.xhtml?paperId='+paperId+'&userId='+item.userId" class="btn btn-info" 
                                        v-show="item.submitStatus == 1 && type == 'INTROSPECTION'" >查看详情</a>
                                </td>
							</tr> -->
							<tr v-if="item.submitStatus == 1 && status == 'finish'">
								<!-- <td >{{item.userId}}</td> -->
								<td >{{item.username}}</td>
								<td >{{item.name}}</td>
								<td >{{item.phone}}</td>

								<td >{{item.submitTime}}</td>
								<!-- {{realname}} -->
								<!-- <td  v-show="type == 'QUESTIONNAIRE' && selectcolor ==true">
									<router-link :to="{ path: '/activity/introspection/detail', query: {paperId: paperId, userId: item.userId}}">
										查看详情
									</router-link>
								  
                                </td> -->
								<td>
									<router-link :to="{ path: '/activity/introspection/detail', query: {paperId: paperId, userId: item.userId}}" style="color:#1077D7;">
										查看详情
									</router-link>
								  
                                </td>
							</tr>
							
							<tr v-else-if="item.submitStatus == 0 && status == 'unfinish'">
								<!-- <td >{{item.userId}}</td> -->
								<td >{{item.username}}</td>
								<td >{{item.name}}</td>
								<td >{{item.phone}}</td>

								<!-- <td >{{item.submitTime ? item.submitTime : '-'}}</td> -->
								
							</tr>
							
						</template>
						
					</tbody>
				</table>
	
			</section>
		</main>
	</section>
</template>
<script>
import { getToken } from '@/filters/userVerify'
import API from '@/global/resource'
import model from 'model/activity/paperview'
import Goback from 'base/goback/goback'
export default {
	data() {
		return {
			activityId:"",

			courseType:"",
			type:"",
			submitNum:0,
			undoNum:0,
			status:"finish",
			users:"",
			realnamedata:""
		}

	},
	computed: {
		totalNum: function() {
			// console.log("qqqdgd",this.undoNum)
			return this.submitNum + this.undoNum;
		},

		clazzId() {
			return this.$route.query.clazzId;
		},

		paperId() {
			return this.$route.query.paperId;
		},
		token() {
			return getToken();
		},
		selectcolor(){
			return this.$route.query.selectcolor;
		}
	},
	created(){
		
		this.getData();	
		// this.getFlag()
	},

	methods: {
		showFinish: function() {
			this.status = "finish";
		},
		showUnfinish: function() {
			this.status = "unfinish";
		},
		showAll: function() {
			this.status = "normal";
		},
		getData: function() {
			let data = {
				paperId: this.paperId
			}        
			model.getSubUser(data, (res => {
				// console.log("getSubUser", res);
				if(res.status == 200) {
					this.type = res.data.type;
					this.submitNum = res.data.submitNum;
					this.undoNum = res.data.undoNum;
					this.users = res.data.users;
				} else {
					this.$message.error(res.message);
				}
			}));			
		},
		// getFlag(){

		// 	let data = {
		// 		activityId: this.activityId,
		// 	}
        //     // console.log(data)
		// 	model.getrealNameFlag( data, (res => {
		// 		console.log("当前状态",res);
		// 		if (res.status == 200) {
		// 			this.selectcolor=res.data.realNameFlag;										
		// 		} else {
		// 			this.$message.error(res.message);
		// 		}
		// 	}));
		// },
		exportUser() {
			if(!this.$store.getters.getOrgVipInfo.vip){
				this.$store.state.vipFuncPopFalg = true;
				return;
			}
			window.open(API.urls.exportSubUserExcel+"?paperId="+this.paperId+"&token="+getToken());
		}
	},

	components: {
		Goback
	}
}
</script>
<style scoped lang="less">
	@import "../../../assets/less/activity.less";
</style>