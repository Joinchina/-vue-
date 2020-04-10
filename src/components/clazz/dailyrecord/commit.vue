<template>
	<div class="content">
		<section class="handle clearfix">
			<Goback passtitle="提交名单" ></Goback>
			<p class="right">
				<button class="btn-green" type="button"  @click="exportdata">
					<i class="icon-export-white"></i>
					导出提交名单
				</button>
			</p>
		</section>

		<!--已提交、未提交-->
		<section class="round-layout">
			<ul class="wtabs clearfix">
				<li v-for="(item, index) in tabsParam"
					@click="toggleTabs(index)"
					:class="{active:index==nowIndex}">{{item.name}}<span>({{item.sum}})</span></li>
			</ul>
			<div class="wtab-cont"  v-show="nowIndex==0">
				<el-table class=""
						:data = "commitUser"
						stripe>
						<el-table-column
							prop="name"
							label="姓名"
							width="220">
						</el-table-column>
						<el-table-column
							prop="phone"
							label="手机号"
							width="150">
							<template slot-scope = "scope">
								<span v-if="scope.row.phone">{{scope.row.phone}}</span>
								<span v-else>
									无
								</span>
							</template>
							
						</el-table-column>
						<el-table-column
							prop="ratio"
							label="提交日志数/任务要求数">
							<template slot-scope="scope">
								{{(scope.row.ratio).split("-")[1]}}/{{(scope.row.ratio).split("-")[0]}}
							</template>
						</el-table-column>
				</el-table>
			</div>

			<div class="wtab-cont"  v-show="nowIndex==1">
				<el-table class=""
						:data = "unCommitUser"
						stripe>
						<el-table-column
							prop="name"
							label="姓名"
							width="220">
						</el-table-column>
						<el-table-column
							prop="phone"
							label="手机号"
							width="150">
							<template slot-scope="scope">
								<span v-if="scope.row.phone">{{scope.row.phone}}</span>
								<span v-else>
									无
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="ratio"
							label="提交日志数/任务要求数">
							<template slot-scope="scope">
								{{(scope.row.ratio).split("-")[1]}}/{{(scope.row.ratio).split("-")[0]}}
							</template>
						</el-table-column>
				</el-table>
			</div>

		</section>

		
	</div>
</template>
<script>
	import model from '@/model/clazz/dailyrecord'
	import Api from '@/global/resource'
	import { getToken } from '@/filters/userVerify'
	import Goback from 'base/goback/goback'
	export default{
		data(){
			return{
				tabsParam: [{
					name:'已提交',
					sum: 0,
				}, {
					name: '未提交',
					sum: 0
				}],
				nowIndex: 0,
				commitUser:[],
				unCommitUser:[],
				ratio:"",

				clazzId:""
			}
		},
		created(){

			this.clazzId = this.$route.query.clazzId;
			this.getData();
		},
		methods:{

			getData(){
				let data = {
					clazzId:this.clazzId
				}

				model.getUserlogFindProgressByClazzId(data,(res=>{
					if(res.status == 200){

						let ratio = [];
						if(res.data.finishedUsers){
							this.commitUser = res.data.finishedUsers;

							this.commitUser.forEach((item,index) =>{
								item["ratio"] = item["requiredCount"] + "-" + item["finishedCount"];
							})

							this.tabsParam[0]["sum"] = this.commitUser.length;
						}

						if(res.data.unfinishedUsers){
							this.unCommitUser = res.data.unfinishedUsers;
							this.unCommitUser.forEach((item,index) =>{
								item["ratio"] = item["requiredCount"] + "-" + item["finishedCount"];
							})

							this.tabsParam[1]["sum"] = this.unCommitUser.length;
						}
						
					}else{
						this.$message.error(res.message);
					}

				}))

			},
			exportdata(){
				if(!this.$store.getters.getOrgVipInfo.vip){
          this.$store.state.vipFuncPopFalg = true;
          return;
      	}
				window.open(Api.urls.getUserExportUserList + '?clazzId=' + this.clazzId + '&token='+getToken())
			},

			toggleTabs(index) {
				this.nowIndex=index;
			},

		},

		components: {
			Goback
		}
	}
</script>
<style lang="less" scoped="">
	@import "../../../assets/reset-element-ui/user-table.css";
	@import "../../../assets/less/report.less";
	@import "../../../assets/less/icon.less";
	@import "../../../assets/less/btn-search.less";
	.btn-green {
		display: inline-block;
	}
	.btn-green {
        font-size: 16px;
        line-height: 1em;
        color: #FFFFFF;
        letter-spacing: 0;
        background: #35A69D;
        padding: 10px 20px;
    }
    .wtabs {
		border-bottom: 1px solid #e6e6e6;
		height: 72px;
		line-height: 66px;
		font-size: 20px;
		padding: 0 70px;
		li {
			display: inline-block;
			padding: 0 10px;
			margin-right: 56px;
			// border-bottom: 5px solid #fff;
			span{
				font-size: 22px;
				color: #FF8200;
			}
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
		padding: 30px 0 30px 70px;
		width: 80%;
	}
</style>