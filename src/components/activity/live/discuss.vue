<template>
	<div class="discuss-tit margin16 round-layout">
      	<div class=" discuss-con">
        	<div class="title">
          		<div class="right">
					<router-link :to="{ path: '/activity/live/chatscreen/', query:{clazzId: clazzId, courseId: courseId}}" class="btn-blue" target="_blank" >
		            	<i class="icon-full-white"></i>
		            	大屏幕
		          	</router-link>
              		<span class="btn-green" @click = "exportChat">
                		<i class="icon-export-white"></i>
                		内容导出
              		</span>
          		</div>
          		<span class="icon"></span>讨论组聊天内容
        	</div>
	        <!--详情_start-->
	        <ul class="con discuss-detail" v-if="items.length > 0">
		        <li class="clearfix border-none" v-for="item in items">
		            
		            <div class="image" v-if="item.fromAvatar"><img :src="item.fromAvatar"/></div>
		            <div class="image" v-else><img src="../../../assets/img/activity/example2.png"/></div>

		            <div class="text text-none">
		               	<h2 class="">{{item.fromName}}<span class="gray">{{item.time}}</span></h2>
		              	<p class="p-border" v-if="item.contentType == 'TXT'"><span class="p-corner"></span>{{item.content}}</p>
		              	<p class="p-border-img" v-if="item.contentType == 'IMG'">
		                	<span class="p-corner"></span>
		                	<img :src="item.content"/>
		             	</p>
		            </div>
		        </li>

		    </ul>
	        <!--详情_end-->
      	</div>
      	<p class="page-total">共{{totalElements}}条&nbsp;每页20条</p>
	    <!--footer_start-->
	    <!--分页-->
	    <div class="pagination">
	        <el-pagination
	          @current-change ="handleCurrentChange"
	          :page-size="20"
	          layout="prev, pager, next"
	          :total="totalElements">
	        </el-pagination>
	    </div>
	   
      	<!--footer_end-->
    </div>
</template>
<script>
	import live from "model/activity/live"
	import API from '@/global/resource'
	import { getToken } from '@/filters/userVerify'

	export default {
		data() {
			return {
				cur_page:1,
        		totalElements:0,
        		items: [],
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			},
			courseId() {
				return this.$route.query.courseId;
			},
			roomCode() {
				return this.$route.query.roomCode;
			}
		},
		mounted() {
			this.getlivechats();
		},
		methods: {
			exportChat() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.liveroomExpChat+"?courseId="+this.courseId+"&token="+getToken());
			},
			handleCurrentChange(val){
		        this.cur_page = val;
		        this.getlivechats();
		    },

		    getlivechats() {
		    	let data = {
		    		courseId: this.courseId,
		    		number: this.cur_page,
		    		roomCode: this.roomCode,
		    		size: 20
		    	}
		    	live.liveroomChatRecord(data, (res => {
		    		console.log("直播聊天信息", res);
		    		if(res.status == 200) {
		    			if(res.data) {
		    				this.items = res.data.content;
		    				this.totalElements = res.data.totalElements;
		    			} 
		    			
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));
		    },
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/less/icon.less";

	.btn-green {
		display: inline-block;
		font-size: 16px;
		padding: 10px 15px;
	}
	.btn-blue {
	    display: inline-block;
	    font-size: 16px;
	    line-height: 1em;
	    color: #fff;
	    padding: 10px 15px;
	    margin-right: 15px;
	}

	.discuss-con {
		
	}
	.title {
	    border-bottom: 1px solid #e6e6e6;
	    padding-bottom: 25px;
	    font-size: 20px;

	    .icon {
	    	border-bottom: 1px solid #e6e6e6;
		    width: 3px;
		    height: 18px;
		    overflow: hidden;
		    display: inline-block;
		    background: #35a69d;
		    vertical-align: middle;
		    margin-right: 10px;
	    }
	}
	.con {
		padding-top: 10px;

		.border-none {
			border-bottom: none;
		}

		li {
			padding-left: 10px;
			padding-bottom: 15px;
			.image {
				float: left;
				margin-top: 15px;
				img {
					border-radius: 50%;
				    width: 40px;
				    height: 40px;
				}
			}
			.text-none {
				border-left: none;
			    background: none;
			    width: auto;
			}
			.text {
				float: left;
			    padding-top: 16px;
			    padding-left: 16px;
				color: #333;
				max-width: 1050px;
			    h2 {
			    	font-size: 16px;
					color: #959595;
					padding-bottom: 5px;
					span {
						font-size: 14px;
						padding-top: 8px;
						padding-left: 19px;
						display: inline-block; 
					}
			    }
			}

			p {
				line-height: 25px;
			    font-size: 14px;
			}
		}
	}
	.discuss-detail {
		li {
			.p-border {
				border: 1px solid #c0e0e0;
			    background: #f5fafa;
			    border-radius: 3px;
			    padding: 15px 12px;
			    color: #333;
			    width: auto!important;
			    position: relative;
			}
			.p-border-img {
				border:1px solid #c0e0e0;
			    background: #f5fafa;
			    border-radius: 3px;
			    padding:15px 12px;
			    color: #333;
			    line-height: 25px;
			    width: auto!important;
			    position: relative;
			    max-width: 100px;
			    max-height:auto;
			    img{
				    width: 100%;
				    height: 100%;
				}
			}
			.p-corner {
			    background: url("../../../assets/img/icon/icon-answer-corner.png") center center no-repeat;
			    width: 10px;
			    height: 20px;
			    position: absolute;
			    left: -10px;
			    top: 10px;
			    display: inline-block;
			}
		}
	}
	.gray {
	    color: #999;
	}
	.page-total {
		text-align: right;
		margin-top: 10px;
	}
	.discuss-tit {
		padding: 20px;
	}

	
</style>