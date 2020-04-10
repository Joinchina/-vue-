<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	.bread-box {
		position: relative;
		.btn-green,
		.btn-blue {
			display: inline-block;
			position: absolute;
			top:0;
			padding: 10px 15px;
			font-size: 16px;
		}
		.wissue {
			right: 110px;
		}
		.wexport {
			right: 0;

		}
	}
	.wnotice-list {
		// padding-top: 63px;
		
		.total {
			padding: 0 26px;
			height: 54px;
			line-height: 54px;
			color: #333;
			border-bottom: 1px solid #e6e6e6;

		}
		.wlist {
			padding: 0 15px;
			li {
				padding: 24px 11px;
				border-bottom: 1px solid #e6e6e6;
			}
			.title {
				font-size: 20px;
				line-height: 1em;
				margin-bottom: 14px;
				
				a {
					color: #333;
					font-weight: 500;
					&:hover {
						color: #1077d7;
					}
				}
				
			}
			.handle {
				float: right;
				font-size: 14px;
				color: #666;
				line-height: 1em;
				.del {
					color: #1077d7;
					cursor: pointer;
				}
				em {
					margin-left: 8px;
				}
				i {
					vertical-align: -2px;
				}
			}
			.desc {
				font-size: 16px;
				color: #999;
				margin-bottom: 8px;
				img {
					width: 20px;
					height: 20px;
					border-radius: 20px;
					margin-right: 8px;
				}
				span {
					margin-right: 14px;
				}
			}
			.cont {
				font-size: 16px;
				color: #333;
				line-height: 1.6em;
				max-height: 50px;
   				overflow: hidden;
			}
		}
	}

</style>
<template>
	<div id="wnoticeList">
		<template v-if="emptyFlag">
				<Goback :passtitle="passtitle"></Goback>
			<!-- 没有通知时 -->
		    <empty 
		      :tip="tip"
		      :btntext="btntext"
		      @add="addNot = true">
			</empty>
		    <!-- /没有通知时 -->
		</template>
		
		
		<template v-if="!emptyFlag">
			<div class="bread-box">
				<Goback :passtitle="passtitle"></Goback>

				<button type="button" class="btn-blue wissue" @click="addNot = true">
					<i class="icon-issue"></i>
					发布通知
				</button>
				<button class="btn-green wexport" type="button" @click="exportExcel" >
		          	<i class="icon-export-white"></i>
		          	导出
		        </button>
			</div>

			<section class="wnotice-list round-layout" v-loading="loading"
        :element-loading-text='this.$globalParam.loadText'
        :element-loading-spinner='this.$globalParam.loadSpinner'
        :element-loading-background='this.$globalParam.loadBg'>
				<p class="total">
					已发布通知: {{totalElements}}
				</p>
				<ul class="wlist">
					<li  v-for="(item,index) in items">
						<h3 class="title clearfix">
							<router-link :to="{ path: '/clazz/notice/detail', query:{clazzId: clazzId, noticeId: item.id }}">{{item.title}}</router-link>
							<span class="handle">
								<em class="del" @click="handleDel(index,item.id)"><i class="icon-del-blue"></i>删除</em>  
								<em>阅读人数： {{item.peopleCount}}</em>
							</span>
						</h3>
						
					
						<p class="desc">
							<img v-if="!item.miniAvatar" src="../../../assets/img/common/header.png" alt="">
							<img v-if="!!item.miniAvatar" :src="item.miniAvatar" alt="">
							<span>{{item.userName}}</span>   
							<span>{{item.createDate}}</span>
						</p>
						<p class="cont">{{item.content}}</p>						
					</li>
				</ul>
				
				<!-- 分页 -->
				<div class="pagination">
			      	<el-pagination
			        	@current-change ="handleCurrentChange"
			        	layout="prev, pager, next"
			        	:page-size ="20"
			        	:total="totalElements">
			      	</el-pagination>
			    </div>
			</section>

		</template>
		<add-notice 
			:dialogAddNotice.sync="addNot"
			:clazzId="clazzId"
			@updateNotice="getNoticeList"></add-notice>
	</div>
</template>
<script>
	import model from 'model/clazz/notice'
	import addNotice from 'components/clazz/notice/add'
	import Empty from 'base/empty/empty'
import Goback from 'base/goback/goback'

	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'
	import { delTip } from '@/global/open'

	export default {
		data () {
			return {
				items: [],			// 通知列表
				addNot: false,		// 发布通知
				tip: '还没有通知，点击发布通知吧!',			// 
				btntext: '发布通知',
				cur_page: 1,
				totalElements: 0,
				noticeId:"",		// 通知Id
				emptyFlag: false,	
				passtitle:'通知管理',
				loading:true,

			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			}
		},
		created() {
			this.getNoticeList();
		},
		methods: {
			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getNoticeList();
			},
			getNoticeList(type, cur_page) {
				let data = {
					number: cur_page || this.cur_page,
					size: '20',
					clazzId: this.clazzId
				}

				model.noticeList(data, (res => {
					// console.log("通知列表", res);
					if(res.status == 200) {
						this.items = res.data.content;
						this.totalElements = res.data.totalElements;
						this.loading=false;
						if(this.items.length == 0) {
							this.emptyFlag = true;
						} else {
							this.emptyFlag = false;
						}

					} else {
						this.$message.error(res.message);
					}
				}));
			},

			exportExcel () {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.noticeExport+"?clazzId="+this.clazzId+"&token="+getToken());
			},

			handleDel (index,id) {
				this.noticeId = id;
		    	let str = "确定要删除该通知吗？";
		    	delTip(this, str, this.delNotice, id,index);
			},
			delNotice (id,index) {
				let _this = this;
		    	let data = {
		    		id: this.noticeId
		    	}
		    	model.noticeDel(data, ( res => {
		    		// console.log("delete",res);
		    		
		    		if(res.status == 200) {
		    			this.$message({
			              	type: 'success',
			              	message: '删除成功',
			              	duration: 1000,
			              	onClose() {
			                	
			                	_this.items.splice(index, 1);
				                  if(_this.items.length == 0) {

				                        let val = _this.cur_page-1;
				                        _this.cur_page = val;
				                        _this.getNoticeList('page', val);

				                  } else {
				                          _this.getNoticeList();
				                  }
			              	}
			            });
		    			
		    			
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));
			}
		},
		components: {
			addNotice,
			Empty,
			Goback
		}
	}
</script>