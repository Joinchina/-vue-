<template>
	<div class="learn-case">
		<Goback :passtitle="passtitle"></Goback>

		<!-- 右侧功能 -->
		<div class="handle" >
			<div class="search">
				<input type="text" v-model.trim="search" placeholder="姓名" @keyup.13="getSearch()" /><i class="el-icon-search" @click.stop="getSearch()"></i>
			</div>
			<button class="btn-green" type="button" @click="handleExp">
				<i class="icon-export-white"></i>
				导出
			</button>
		</div>

		<div class="round-layout ">
			<section class="average">
				<ul>
					<li class="tip">平均学习任务完成率：<span class="rate">{{clazzFinishRate}}</span></li>
					<li class="bar-bg">
						<p class="bar" :style="{ width: clazzFinishRate }"></p>
					</li>
				</ul>

				<a class="rule" href="javascript:;" @click="rulesFlag = true">
					<i class="icon-learn-set-blue"></i>
				    规则配置
				</a>

				<!--面授任务完成率-->
				<ul class="type-rate" v-if="clazzOnlineFinishRate != ''">
					<li>
						面授任务完成率：
						<span>{{clazzOfflineFinishRate}}</span>
					</li>
					<li>
						网课学习完成率：
						<span>{{clazzOnlineFinishRate}}</span>
					</li>
				</ul>

			</section>

			<el-table 
				class="table"
				stripe

				:empty-text="loading_font"
				:data = "searchItem.slice((cur_page-1)*pagesize,cur_page*pagesize)">
				<el-table-column
					
					prop="rank"
					label="排名"
					>
					<template slot-scope="scope">
						<span v-if="scope.row.rank == 1">
			              <i class="l-one"></i>
			              </span>
			            <span v-else-if="scope.row.rank == 2">
			              <i class="l-two"></i>
			              </span>
			            <span v-else-if="scope.row.rank == 3">
			              <i class="l-three"></i>
			              </span>
			            <span v-else>
			              <span style="margin-left: 6px">{{ scope.row.rank }}</span>
			            </span>
					</template>
				</el-table-column>
				<el-table-column
					
					label="姓名"
					width="">
					<template slot-scope="scope">
						<p v-if="scope.row.rank == 1" class="table-pic">
							<span v-if="scope.row.avatar"><img :src="scope.row.avatar"/></span>
	              			<span v-else><img src="../../../assets/img/activity/example2.png"/>&nbsp;</span>
	              			<span class="rank-first"></span>
							<a href="javascript:;"  @click="stuMsgView(scope.$index, scope.row)" class="name">{{scope.row.name}}</a>
						</p>
						<p v-else-if="scope.row.rank == 2" class="table-pic">
							<span v-if="scope.row.avatar"><img :src="scope.row.avatar"/></span>
	              			<span v-else><img src="../../../assets/img/activity/example2.png"/>&nbsp;</span>
	              			<span class="rank-second"></span>
							<a href="javascript:;" @click="stuMsgView(scope.$index, scope.row)" class="name">{{scope.row.name}}</a>
						</p>
						<p v-else-if="scope.row.rank == 3" class="table-pic">
							<span v-if="scope.row.avatar"><img :src="scope.row.avatar"/></span>
	              			<span v-else><img src="../../../assets/img/activity/example2.png"/>&nbsp;</span>
	              			<span class="rank-three"></span>
							<a href="javascript:;"  @click="stuMsgView(scope.$index, scope.row)" class="name">{{scope.row.name}}</a>
						</p>
						<p v-else class="table-pic">
							<span v-if="scope.row.avatar"><img :src="scope.row.avatar"/></span>
	              			<span v-else><img src="../../../assets/img/activity/example2.png"/>&nbsp;</span>
							<a href="javascript:;" @click="stuMsgView(scope.$index, scope.row)" class="name">{{scope.row.name}}</a>
						</p>
					</template>
				</el-table-column>
				<el-table-column
					v-if="onlineCourseFlag"
					align="center"
					label="面授任务完成率"
					width="">
					<template slot-scope="scope">
						{{(scope.row.offlineCourseFinishRate*100).toFixed(2) + "%"}}
					</template>
				</el-table-column>
				<el-table-column
					v-if="onlineCourseFlag"
					align="center"
					prop=""
					label="网课学习完成率"
					width="">
					<template slot-scope="scope">
						{{(scope.row.onlineCourseFinishRate*100).toFixed(2) + "%"}}
					</template>
				</el-table-column>
				<el-table-column
					align="center"
					label="任务完成率"
					width="">
					<template slot-scope="scope">
						{{(scope.row.finishRate * 100).toFixed(2) + '%'}}
					</template>
				</el-table-column>
				
				<el-table-column
					align="center"
				    label="操作"
				    width="">
				    <template slot-scope="scope" >
				    	<template>
				    		<a class="view-link"  href="javascript:;" @click="stuView(scope.$index, scope.row)">查看</a>
				    	</template>
				    </template>
			    </el-table-column>
			</el-table>

			<!--page-footer-->
		    <div class="page-footer">
		      <p>共{{totalElements}}条&nbsp;每页20条</p>
		    </div>
		    <!--分页-->
		    <div class="pagination">
		      <el-pagination
		        @current-change ="handleCurrentChange"
		        layout="prev, pager, next"
		        :page-size="20"
		        :total="totalElements">
		      </el-pagination>
		    </div>
		    <!--  -->

		    <!--查看学员-->
		    <stu-msg
		      :dialogStuMsg.sync="stuMsgFlag"
		      :stuId="userId"
		    ></stu-msg>

		    <!-- 查看个人详情 -->
			<stu-view
				:dialogStu.sync="stuLearn"
				:clazzId="clazzId"
				:stuId="userId"></stu-view>

		    <!-- 规则设置 -->
		    <rules
		    	:curIndexn="0"
		    	:dialogRules.sync="rulesFlag"
		    	:clazzId="clazzId"></rules>
		</div>
	</div>
</template>
<script>
import model from 'model/clazz/learncase'
import Goback from 'base/goback/goback'
import stuMsg from 'components/clazz/stumsg'
import stuView from 'components/clazz/learncase/stu_view'
import rules from 'components/clazz/learncase/rules'

import { getToken } from '@/filters/userVerify'
import API from '@/global/resource'

	export default {
		data () {
			return {
				searchItem: [],
				items: [],		//学员排名列表
				clazzFinishRate: 0,		// 班级平均完成率
				search: "",		// 搜索内容
				totalElements:0,
		        cur_page:1,
		        pagesize:20,
		        stuMsgFlag:false,	//查看学员弹出框
		        stuLearn: false,	//查看学员学情弹出框
		        rulesFlag: false,	//规则设置
		        userId: "",  

		        //判断是否存在网课平均值
		        clazzOnlineFinishRate:"",
		        clazzOfflineFinishRate:"",

		        //判断是否存在网课完成率
				onlineCourseFlag:false,
				passtitle:'班级学情',
				loading_font:this.$globalParam.loadText
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			}
		},
		mounted() {
			this.getList();
		},
		methods: {
			handleCurrentChange(val){
		        this.cur_page = val;
		    },
			// 导出
			handleExp() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.clazzLearnListExp+"?clazzId="+this.clazzId+"&token="+getToken());
			},
			// 搜索
			getSearch() {
				let search = this.search && this.search.toLowerCase();
					search = search.trim();
				let data = this.items;
				let item;
				if(search) {
					data = data.filter(function(row) {
						return Object.keys(row).some(function() {
							return String(row.name).toLowerCase().indexOf(search) > -1
						})
					})
					this.searchItem = data;
				} else {
					this.searchItem = this.items;
				}
				this.cur_page = 1;
				this.totalElements = this.searchItem.length;
				console.log("searchItem", this.searchItem);
			},
			// 获取详情列表
			getList() {
				let _this = this;
				let data = {
					clazzId: this.clazzId
				}
				model.clazzLearnList(data, (res => {
					//console.log("学情列表", res);
					if(res.status == 200) {
						this.loading_font="暂无排名";
						this.clazzFinishRate = res.data.clazzFinishRate;
						// this.searchItems = res.data.userLearnList;
						this.items = res.data.userLearnList;

						this.totalElements = res.data.userLearnList.length;

						let w = this.clazzFinishRate.substring(0, this.clazzFinishRate.length -1);

						//网络课程平均任务完成率
						if(res.data.clazzOnlineFinishRate){
							this.clazzOnlineFinishRate = res.data.clazzOnlineFinishRate;
							this.clazzOfflineFinishRate = res.data.clazzOfflineFinishRate;
						}


						this.items.forEach((item,index) =>{

							if(item.onlineCourseFinishRate==0 || item.onlineCourseFinishRate){
								_this.onlineCourseFlag = true;
								return false;	
							}

						})


						// 学情排序
						if(this.items.length > 0) {
							this.sortArray(this.items);
						}
						
					}
				}));
			},

			// 排序
			sortArray(arr) {
				let rank = 0;
				let score = '';
				
				this.searchItem = arr;
				console.log("arr======", this.searchItem);
				for (var i=0; i<=arr.length; i++) {
					// console.log(arr[i], arr[i].finishRate);

					if(arr[i].finishRate === score) {
						arr[i].rank = rank;
					} else {
						score = arr[i].finishRate;
						rank++;
						arr[i].rank = rank;
					}

				}

				
				
			},
			// 查看学员
			stuMsgView(index,scope){
		        this.userId = scope.userId;
		        this.stuMsgFlag = true;
		    },
		    // 查看学员详情
		    stuView(index, scope) {
		    	this.userId = scope.userId;
		        this.stuLearn = true;
		    },


		},
		components: {
			Goback,
			stuMsg,
			stuView,
			rules
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	@import "../../../assets/less/btn-search.less";
	@import "../../../assets/reset-element-ui/user-table.css";
	.handle {
		margin-top: -40px;
		height: 40px;
		text-align: right;
		.search {
			float: none;
			display: inline-block;
			background-color: #fff;
		}
		.btn-green,
		.btn-blue {
			display: inline-block;
			margin-left: 15px;
			font-size: 16px;
			padding: 10px 15px;
			border-radius: 5px;
			
		}

		i {
			vertical-align: middle;
		}
	}
	.round-layout {
		padding: 30px 60px;
	}
	.table {
		margin-top: 35px;
	}
	.learn-case {

		.table-pic {
			img {
				width: 45px!important;
		        height: 45px!important;
		        border-radius: 50%;
		        position: relative;
			}
	       
	    }
	    .name {
	    	color: #333;
	    }
	    .rank-first{
	      position: absolute;
	      bottom:2px;
	      left: 9px;
	      background: url("../../../assets/img/clazz/one_l.png") no-repeat;
	      display: inline-block;
	      width: 48px;
	      height: 21px;
	    }
	    .view-link {
	    	color: #35A69D;
	    }
	    .rank-second{
	      position: absolute;
	      bottom:2px;
	      left: 9px;
	      background: url("../../../assets/img/clazz/two_l.png") no-repeat;
	      display: inline-block;
	      width: 48px;
	      height: 21px;
	    }
	    .rank-three{
	      position: absolute;
	      bottom:2px;
	      left: 9px;
	      background: url("../../../assets/img/clazz/three_l.png") no-repeat;
	      display: inline-block;
	      width: 48px;
	      height: 21px;
	    }
		.l-one{
	      background: url("../../../assets/img/clazz/one.png") no-repeat;
	      display: inline-block;
	      width: 19px;
	      height: 23px;
	      vertical-align: middle;
	    }
	    .l-two{
	      background: url("../../../assets/img/clazz/two.png") no-repeat;
	      display: inline-block;
	      width: 19px;
	      height: 23px;
	      vertical-align: middle;
	    }
	    .l-three{
	      background: url("../../../assets/img/clazz/three.png") no-repeat;
	      display: inline-block;
	      width: 19px;
	      height: 23px;
	      vertical-align: middle;
	    }
	    .page-footer {
	    	font-size: 14px;
			color: #666666;
			letter-spacing: 0;
			text-align: right;
			line-height: 36px;
	    }
	}

	.average {
		position: relative;
		text-align: center;
		.type-rate{
			text-align: center;
			li{
				display: inline-block;
				padding:10px 0 10px 35px;
				font-size: 18px;
				color: #333;
				span{
					color: #CC3300;
					font-size: 22px;
				}
			}
		}
		.tip {
			font-size: 24px;
			color: #333333;
		}
		.rate {
			font-size: 36px;
			color: #CC3300;
			letter-spacing: 0;
			line-height: 36px;
		}
		.bar-bg {
			position: relative;
			margin: 20px auto;
			width: 300px;
			height: 10px;
			border: 0; 
			border-radius: 5px;
			background: #e4e4e4;
		}
		.bar {
			position: absolute;
			left: 0;
			top: 0;
			width: 1%;
			height: 10px;
			border-radius: 5px;
			background-color: #FF8C53;
			border: 0; 
			transition: width 0.5s;
			-moz-transition: width 0.5s;	
			-webkit-transition: width 0.5s;	
			
		}
		.rule {
			position: absolute;
			top: 0;
			right: 0;
			font-size: 18px;
			line-height: 18px;
			color: #1077D7;
			i {
				vertical-align: middle;
			}
		}
	}

</style>