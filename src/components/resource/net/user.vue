<template>
	<div class="user" 
		v-loading="loading"
	    :element-loading-text="$globalParam.loadText"
	    :element-loading-spinner="$globalParam.loadSpinner"
	    :element-loading-background="$globalParam.loadText">
		<section class="handle">
			<Goback passtitle="查看人数" ></Goback>
			<button type="button" class="btn-blue view" @click="exportViewUser">
				<i class="icon-export-white"></i>
				导出已查看
			</button>
			<button type="button" class="btn-green unview" @click="exportunViewUser">
				<i class="icon-export-white"></i>
				导出未查看
			</button>
		</section>

		<section class="round-layout">
			<ul class="wtabs clearfix">
				<li v-for="(item,index) in tabsParam"
					@click="toggleTabs(index)"
					:class="{active:index==nowIndex}">
					{{item.name}}
					<span>({{item.sum}})</span>
				</li>
			</ul>
			<div class="wtab-cont" v-show="nowIndex==0">
				<el-table
					:data = "viewUser"
					stripe>
					<el-table-column
						prop="name"
						label="姓名"
						width="180">
					</el-table-column>
					<el-table-column
						prop="phone"
						label="手机号"
						width="200"
						>
					</el-table-column>
					<el-table-column
						prop="workPlace"
						label="单位"
						>
					</el-table-column>
					<el-table-column
						prop="time"
						label="学习时长"
						width="200">
					</el-table-column>
					
				</el-table>
			</div>
			<div class="wtab-cont" v-show="nowIndex==1">
				<el-table
					:data = "unViewUser"
					stripe>
					<el-table-column
						prop="name"
						label="姓名"
						width="">
					</el-table-column>
					<el-table-column
						prop="phone"
						label="手机号"
						width=""
						>
					</el-table-column>
					<el-table-column
						prop="workPlace"
						label="单位"
						width="">
					</el-table-column>
					
				</el-table>
			</div>
		</section>
	</div>
</template>
<script>
	import Net from 'model/resource/net'
	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'
	import Goback from 'base/goback/goback'

	export default {
		data() {
			return {
				tabsParam: [{
					name: '查看',
					sum: 0,
				}, {
					name: '未查看',
					sum: 0
				}],
				nowIndex: 0,
				totalElements:0,
				viewUser: [],
				unViewUser: [],
				loading: true,
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			},
			// 资源id
			id() {
				return this.$route.query.id;
			}
		},
		mounted() {
			this.getUserList();
		},
		methods: {
			handleCurrentChange (val) {
				this.cur_page = val;
        		// this.getUserList();
			},
			toggleTabs(index) {
				this.nowIndex=index;
			},

			getUserList() {
				let data = {
					clazzId: this.clazzId,
					onlineCourseId: this.id
				}
				Net.getOnlineUser(data, (res => {
					console.log("学员列表", res);
					if(res.status == 200) {
						this.viewUser = res.data.finishedUsers;
						this.tabsParam[0].sum = res.data.finishedUsers.length;
						this.unViewUser = res.data.unfinishedUsers;
						this.tabsParam[1].sum = res.data.unfinishedUsers.length;
						this.loading = false;
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
				}));
			},
			
			// 导出已查看
			exportViewUser() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.onlineUserExp+"?clazzId="+this.clazzId+"&onlineCourseId="+this.id+"&bool=true"+"&token="+getToken());
			},
			// 导出未查看
			exportunViewUser() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.onlineUserExp+"?clazzId="+this.clazzId+"&onlineCourseId="+this.id+"&bool=false"+"&token="+getToken());
			}
		},

		components: {
			Goback
		}
	}

</script>
<style scoped lang="less">
	@import "../../../assets/reset-element-ui/user-table.css";
	@import "../../../assets/less/icon.less";
	.handle {
		position: relative;
		height: 55px;
		.btn-green,
		.btn-blue {
			display: inline-block;
			position: absolute;
			top:0;
			padding: 10px 20px;
			font-size: 16px;
			&::after{
				position: absolute;
				right: -6px;
				top: -10px;
				width: 27px;
				height: 15px;
				content: "";
				background: url("../../../assets/img/expert/vipLogo.png") center center no-repeat;
				background-size: 27px 14px;
			}
		}
		.view {
			right: 150px;
		}
		.unview {
			right: 0;
		}
		.btn-green-line {
			display: inline-block;
			font-size: 16px;
		}
		.back {
			color: #333;
			font-size: 16px;
		}
	}
	.wtabs {
		font-size: 20px;
		padding: 0 70px;
		li {
			display: inline-block;
			padding: 20px 20px 15px;
			margin-right: 56px;
			&.active {
				color: #35a69d;
				border-bottom: 5px solid #35a69d;
			}
		}
		span {
			font-size: 16px;
			color: #FF8200;
		}
	}
	.wtab-cont {
		padding: 20px 70px;

		.total {
			font-size: 14px;
			color: #999;
			text-align: right;
			line-height: 2em;
		}
		a {
			color: #3182d9;
		}
	}
</style>