<template>
	<div class="w-seltemp">
		<section class="handle">
			<!-- <span class="back" @click="goback">
				<i class="el-icon-d-arrow-left"></i>
				返回
			</span> -->
			<Goback passtitle="选择模板"  v-if="type == 'clazz'" path="/clazz/index/questionaire" :query="query"></Goback>
			<Goback passtitle="选择模板"  v-if="type == 'task'" path="/course/task" :query="query"></Goback>
			<Goback passtitle="选择模板"  v-if="type == 'detail'" path="/course/detail" :query="query"></Goback>
		</section>

		<section class="seltemp-cont clearfix" id="seltempCont">
			<div class="sidebar ">
				<nav>
				    <template v-if="courseId">
				    	<router-link v-for="item in items" :key="item.id" :to="{ path: '/questemp/seltemp/cont', query:{ orgId:orgId, clazzId: clazzId, courseId:courseId,  type: type, id:item.id }}" >
							<el-tooltip class="item" effect="dark" :content="item.title" placement="bottom-end">
							<span class="tit">{{item.title}}</span>
							</el-tooltip>
						</router-link>
				    </template>
					
					<template v-if="!courseId">
						<router-link v-for="item in items" :key="item.id" :to="{ path: '/questemp/seltemp/cont', query:{ orgId:orgId, clazzId: clazzId, type: type, id:item.id }}" >
							<el-tooltip class="item" effect="dark" :content="item.title" placement="bottom-end">
							<span class="tit">{{item.title}}</span>
							</el-tooltip>
						</router-link>
					</template>
					
				</nav>
			</div>
			
			<div class="w-cont round-layout">
				
				<router-view class="" v-if="id"></router-view>
				
			</div>
		</section>
	</div>
</template>
<script>
	import Questemp from 'model/questemp/questemp'
	import Goback from 'base/goback/goback'

	export default {
		data() {
			return {
				items: [],
				currcreateUserId: "",
				currid: "",

				query: {}
			}
		},
		created() {
			this.getList();
		},
		mounted() {
			this.offtop();
      		this.changesize();

      		if(this.type == 'clazz' || this.type == 'task') {
				this.query= {
					clazzId: this.clazzId
				}
			} 
			
			if(this.type == 'detail') {
				this.query= {
					clazzId: this.clazzId,
					courseId: this.courseId
				}
			}
		},
		updated(){
	      	this.offtop();
	      	this.changesize();
	    },
		computed: {
			orgId() {
				return this.$route.query.orgId
			},
			clazzId() {
				return this.$route.query.clazzId
			},
			courseId() {
				return this.$route.query.courseId
			},
			id() {
				return this.$route.query.id;
			},
			type() {
				return this.$route.query.type;
			}
		},
		methods: {
			goback() {
				if(this.type == 'clazz') {
					this.$router.push({
						path: "/clazz/index/questionaire",
						query: {
							clazzId: this.clazzId
						}
					})
				} 
				if(this.type == 'task') {
					this.$router.push({
						path: "/course/task",
						query: {
							clazzId: this.clazzId
						}
					})
				}
				if(this.type == 'detail') {
					this.$router.push({
						path: "/course/detail",
						query: {
							clazzId: this.clazzId,
							courseId: this.courseId
						}
					})
				}
			},
			getList() {
				let data = {
					organizationId: this.orgId
				}

				Questemp.getQuestempList(data, (res => {
					console.log("list", res);
					if(res.status == 200) {
						this.items = res.data;
						if(!this.id && this.courseId) {
							this.$router.push({
								path: "/questemp/seltemp/cont",
								query: {
									orgId: this.orgId,
									clazzId: this.clazzId,
									courseId: this.courseId,
									type: this.type,
									id: res.data[0].id
								}
							})
						}

						if(!this.id && !this.courseId) {
							this.$router.push({
								path: "/questemp/seltemp/cont",
								query: {
									orgId: this.orgId,
									clazzId: this.clazzId,
									type: this.type,
									id: res.data[0].id
								}
							})
						}
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			changesize() {
				window.addEventListener("resize",this.size);
		        this.size=()=>{
		          	this.offtop();
		        }
			},
			offtop() {
				// 获取当前元素距离顶部的距离
				let offsettop = $("#seltempCont").offset().top;
				// 获取当前浏览器可视区域
				let cliheight = $(window).height();
				//设置列表的默认高度
        		$(".sidebar").css("height",(cliheight - offsettop) + "px");
        		//获取滚动轴滚动的距离
        		this.scroll_=()=>{
        			let scrolltop = $(document).scrollTop();//滚动的距离
        			if(scrolltop >= offsettop) {
        				//为导航列表增加浮动
        				$(".sidebar").css({
        					"position": "fixed",
        					"top": 0
        				})
        				//计算导航列表的高度
        				$(".sidebar").css("height",cliheight + "px") 
        			} else {
        				$(".sidebar").css({
        					"position": "static"
        				})
        				$(".sidebar").css("height",(cliheight - offsettop + scrolltop) + "px");
        			}
        		}

        		window.addEventListener("scroll",this.scroll_);
			}
			
		},
		detroyed() {
			window.removeEventListener("scroll",this.scroll_);
      		window.removeEventListener("resize",this.size);
		},
		components: {
			Goback
		}
	}
</script>
<style scoped lang="less">
@import "../../assets/less/btn-search.less";
.handle {
	width: 1190px;
	margin: 15px auto 0;
}
.seltemp-cont {
	width: 1190px;
	margin: 15px auto 0;
}
.sidebar {
	float: left;
	width: 260px;
	margin-right: 20px;
	box-sizing: border-box;
	overflow-y: auto;
	background: #fff;
	min-height: calc(~'100vh - 111px');
	border-radius: 5px;
	box-shadow: 0 0 35px 0 rgba(0,0,0,0.07);

	>nav {
		width: 100%;
		border-radius: 5px;
		
		

		>a {
			width: 100%;
			display: block;
			font-size: 14px;
			color: #666666;
			line-height: 1.4em;
			padding: 12px;
			border-left: 3px solid #fff;

			&.router-link-exact-active {
				background: #E5F3F3;
				font-size: 16px;
				color: #009791;
				border-left: 3px solid #009791;

				&:first-child {
					border-radius-top-left: 5px;
					border-radius-top-right: 5px;
				}
			}

			.tit {
				overflow:hidden; 
				text-overflow:ellipsis;
				display: -webkit-box;
				-webkit-line-clamp:2; 
				/* autoprefixer: off */
				-webkit-box-orient: vertical;
				/* autoprefixer: on */
			}
			

		}
	}
}

.w-cont {
	float: right;
	width: 910px;
	min-height: calc(~'100vh - 111px');
	box-sizing: border-box;
	padding: 20px 30px 30px;
	

	.fixed {
		position: fixed;
		bottom: 0;
		text-align: center;
		padding: 22px 0;
	    background: #fff;
	    height: 80px;
	    width: 850px;

		.btn-green {
			display: inline-block;
			font-size: 16px;
			padding: 10px 22px;
		}
	}
}


</style>