<template>
	<div>
		<Goback :passtitle="passtitle"></Goback>
		<div class="handles" >
			<div class="search">
				<input type="text" v-model.trim="searchQuery" placeholder="机构名称" @keyup.13="getList('search')" /><i class="el-icon-search" @click.stop="getList('search')"></i>
			</div>
			<button class="btn-green" type="button" @click="addWechatM">
				<i class="icon-add-white"></i>
				添加
			</button>
		</div>

		<el-table 
				class="table"
				stripe
				:data = "items"
				:empty-text="loading_font">

			<el-table-column
					align="left"
					prop="organizationName"
					label="机构名称"
					width="">
			</el-table-column>

			<el-table-column
					align="left"
					prop="openId"
					label="微信号：openid"
					width="">
			</el-table-column>

			<el-table-column
					align="left"
					prop="nickname"
					label="微信昵称"
					width="">
			</el-table-column>

		</el-table>

		<p class="page-sum">共{{totalElements}}条 每页20条</p>

		<!--分页-->
	    <div class="pagination">
	      <el-pagination
	        :page-size="20"
	        @current-change ="handleCurrentChange"
	        layout="prev, pager, next"
	        :total="totalElements">
	      </el-pagination>
	    </div>

		<!--添加微信绑定机构-->
		<add-wechat 
			title="添加微信绑定机构"
			@updataWechatList = "getListSucess"
			:dialogAddWechat.sync = "addWechatFlag">
				
		</add-wechat>

	</div>
</template>
<script type="text/javascript">
	import Goback from 'base/goback/goback';
	import Model from '@/model/wechat/wechat';
	import addWechat from './add-wechat';
	export default{
		created(){
			this.getList();
		},

		data(){
			return{
				searchItem:[],

				items:[],

				addWechatFlag:false,

				searchQuery: "",	// 搜索内容
				totalElements:0,
		        cur_page:1,
		        pagesize:20,

				passtitle:'微信接收数据',

				loading_font:this.$globalParam.loadText
			}
		},

		methods:{

			getListSucess(){

				this.getList();

			},

			handleCurrentChange(val){
		        this.cur_page = val;
		        this.getList();
      		},

			addWechatM(){
				this.addWechatFlag = true;
			},

			getList(type){
				console.log("list");
				
				let data = {
					orgName:this.searchQuery,
					page:this.cur_page,
					size:this.pagesize
				}

				if(type == 'search') {
            		data.page = 1;
            		this.cur_page = 1;
       			}

				Model.wechatUser(data,(res=>{
					if(res.status == 200){
						this.items = res.data.content;
						this.totalElements = parseInt(res.data.totalElements);

						if(this.items.length==0){
							this.loading_font="暂无数据";
						}

					}else{
						this.$message.error(res.message);
					}
				}))
			},

		},

		components:{
			Goback,
			addWechat
		}

	}
</script>
<style type="text/css" lang="less" scopped>
	@import "../../../assets/less/icon.less";
	@import "../../../assets/less/btn-search.less";
	@import "../../../assets/reset-element-ui/user-table.css";
	.handles {
		height: 50px;
		margin-top: -50px;
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
	.page-sum {
			font-size: 14px;
		    color: #666;
		    text-align: right;
		    padding-top: 15px;
		}
</style>