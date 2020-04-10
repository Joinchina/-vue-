<template>
	<div class="wleavemsg">
		<template v-if="emptyFlag">
			<!-- 返回 -->
			<section class="handle mgb20 clearfix">
				<span>
					<Goback passtitle="学员留言" ></Goback>
					<span class="tip2">（注：数据统计截止到昨日）</span>
				</span>
			</section>
			<empty
				class="round-layout "
		      	:tip="tip"></empty>
		</template>
		
		<template v-if="!emptyFlag">
			<!-- 返回 -->
			<section class="handle clearfix">
				<span>
					<Goback passtitle="学员留言" ></Goback>
					<span class="tip2">（注：数据统计截止到昨日）</span>
				</span>
				<p class="right">
					<button class="btn-green" type="button"  @click="resExport">
						<i class="icon-export-white"></i>
						导出
					</button>
				</p>
			</section>
			
			<!-- 内容 -->
			<section class="wcont-box"
				v-loading="loading"
			    :element-loading-text="$globalParam.loadText"
			    :element-loading-spinner="$globalParam.loadSpinner"
			    :element-loading-background="$globalParam.loadText">
				<ul class="wcont2 round-layout">
					<li v-for="item in items">
						<p class="date">{{item.createTime}}</p>
						<div>
							<img class="head" v-if="item.miniAvatar" :src="item.miniAvatar" alt="">
							<img class="head" v-else src="../../assets/img/common/avatar.png" alt="">
							<h3 class="name">{{item.name}} 
							<template v-if="item.workPlace">
								&middot; <span class="school">{{item.workPlace}}</span>
							</template>
							</h3>
							<p class="tip">{{item.clazzName}}</p>
						</div>
						<p class="desc">{{item.answer}}</p>
					</li>
					
				</ul>
				
				<p class="page-sum">共{{totalElements}}条 每页10条</p>
				<!-- 分页 -->
				<div class="pagination">
			      	<el-pagination
			        	@current-change ="handleCurrentChange"
			        	:current-page="cur_page"
			        	layout="prev, pager, next"
			        	:page-size ="10"
			        	:total="totalElements">
			      	</el-pagination>
			    </div>

			</section>
		</template>

		
		
	</div>
</template>
<script>
	import orgReport from 'model/orgreport/orgreport'

	import { getCurRole } from '@/filters/userVerify'
	import API from '@/global/resource';
	import { getToken } from '@/filters/userVerify'

	import Empty from 'base/empty/empty'
	import Goback from 'base/goback/goback'

	export default {
		data() {
			return {
				role: getCurRole(),
				items: [],
				cur_page: 1,
		        totalElements: 0,

		        tip: "暂无数据！",
		        emptyFlag: false,
		        loading: true,
				loading_font:this.$globalParam.loadText,
			}
		},
		computed: {
			orgId() {

				return this.$route.query.orgId;
			}
		},
		mounted() {
			
			if(this.role == 'PROJECTADMIN') {
				this.getItemData();
			} else {
				this.getOrgData();
			}
		},
		methods: {
			handleCurrentChange (val) {
				this.cur_page = val;
        		if(this.role == 'PROJECTADMIN') {
					this.getItemData();
				} else {
					this.getOrgData();
				}
        		console.log("number", this.cur_page);
			},

			getOrgData() {
				let data = {
					orgId: this.orgId,
					number: this.cur_page,
					size: 10
				}

				orgReport.RepOrgMsg(data, (res => {
					console.log('机构-学员留言 ', res)
					if(res.status == 200) {
						if(res.data != undefined) {
							this.items = res.data.content;
							this.totalElements = res.data.totalElements;

							if(this.items.length == 0) {
								this.emptyFlag = true;
							} else {
								this.emptyFlag = false;
							}

						} else {
							this.emptyFlag = true;
						}

						this.loading_font=this.$globalParam.dataEmpty;
						this.loading = false;
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
				}));
			},

			getItemData() {
				let data = {
					orgId: this.orgId,
					number: this.cur_page,
					size: 10
				}

				orgReport.RepItemMsg(data, (res => {
					console.log('项目-学员留言 ', res)
					if(res.status == 200) {
						if(res.data != undefined) {
							this.items = res.data.content;
							this.totalElements = res.data.totalElements;

							if(this.items.length == 0) {
								this.emptyFlag = true;
							} else {
								this.emptyFlag = false;
							}

						} else {
							this.emptyFlag = true;
						}

						this.loading_font=this.$globalParam.dataEmpty;
						this.loading = false;
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
				}));
			},

			resExport() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				if(this.role == 'PROJECTADMIN') {
					window.open(API.urls.RepItemExpMsg+"?orgId="+this.orgId+"&token="+getToken());
				} else {
					window.open(API.urls.RepOrgExpMsg+"?orgId="+this.orgId+"&token="+getToken());
				}
				
			}
		},

		components: {
			Empty,
			Goback
		}


	}
</script>
<style scoped lang="less">
	@import "../../assets/less/icon.less";
	@import "../../assets/less/btn-search.less";
	.mgb20 {
		margin-bottom: 20px;
	}
	.wcont2 {
		width: 100%;
		min-height: 200px;
		box-sizing: border-box;
		background: #fff;
		padding: 0 18px;

		li {
			position: relative;
			border-bottom: 1px solid  #E6E6E6;
			padding: 22px 20px 30px;

			&:last-child {
				border-bottom: 0;
			}
		}
		.date {
			position: absolute;
			right: 20px;
			font-size: 14px;
			color: #666666;
		}
		.head {
			float: left;
			width: 46px;
			height: 46px;
			border-radius: 46px;
			margin-right: 16px;
		}
		.name {
			font-size: 18px;
			color: #333333;
			line-height: 1.2em;
			width: 86%;
		}
		.school {
			color: #666;
			line-height: 1em;
		}
		.tip {
			font-size: 16px;
			color: #333333;
			line-height: 1.5em;
			margin-top: 8px;
		}
		.desc {
			font-size: 18px;
			color: #666666;
			line-height: 1.5em;
			margin-top: 10px;
		}
	}

	.page-sum {
		font-size: 14px;
		color: #666666;
		text-align: right;
		margin-top: 12px;
	}

</style>