<template>
	<div class="user">
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
					:class="{active:index==nowIndex}">{{item.name}}</li>
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
						width="200">
					</el-table-column>
					<el-table-column
						prop="time"
						label="时长"
						width="200">
					</el-table-column>
					<el-table-column
						prop="updateTime"
						label="最后学习时间"
						>
						
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
	import res from 'model/resource/resource'
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
			this.getViewUserList();
			this.getUnviewUserList();
		},
		methods: {
			handleCurrentChange (val) {
				this.cur_page = val;
        		// this.getUserList();
			},
			toggleTabs(index) {
				this.nowIndex=index;
			},

			getViewUserList() {
				let data = {
					clazzId: this.clazzId,
					id: this.id,
					flag: 'view'
				}
				res.resViewUser(data, (res => {
					console.log("查看人列表", res);
					if(res.status == 200) {
						this.viewUser = res.data;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			getUnviewUserList() {
				let data = {
					clazzId: this.clazzId,
					id: this.id,
					flag: 'unView'
				}
				res.resViewUser(data, (res => {
					console.log("未查看人列表", res);
					if(res.status == 200) {
						this.unViewUser = res.data;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 导出已查看
			exportViewUser() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.resExpViewUser+"?clazzId="+this.clazzId+"&id="+this.id+"&flag=view"+"&token="+getToken());
			},
			// 导出未查看
			exportunViewUser() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.resExpViewUser+"?clazzId="+this.clazzId+"&id="+this.id+"&flag=unView"+"&token="+getToken());
			}
		},

		components: {
			Goback
		}
	}

</script>
<style scoped lang="less">
	@import "../../assets/reset-element-ui/user-table.css";
	@import "../../assets/less/icon.less";
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
				background: url("../../assets/img/expert/vipLogo.png") center center no-repeat;
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
			color: #666;
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