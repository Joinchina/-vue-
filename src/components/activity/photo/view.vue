<style scoped lang="less">
@import "../../../assets/less/icon.less";

#photoWall {
	.bread-box {
		position: relative;
		.btn-green {
			display: inline-block;
			position: absolute;
			top:0;
			padding: 10px 20px;
			
		}
		i{
			vertical-align: -2px;
		}
		.wfull {
			right: 0;
			background-color: #3f99f6;
			&::after{
				display: none;
			}
		}
		.wexport {
			right: 140px;

		}
	}
	.photo-box {
		box-sizing: border-box;
		background-color: #fff;
	    border: 1px solid #f0f0f0;
	    border-radius: 6px;
	    box-shadow: -2px 0 3px #f0f0f0, 2px 0 3px #f0f0f0, 0 -2px 3px #f0f0f0, 0 2px 3px #f0f0f0;
	}
	.top-box {
		.h1 {
			height: 75px;
			padding: 25px 36px;
			font-size: 24px;
			line-height: 1em;
			>span {
				border-left: 3px solid #35a69d;
				padding-left: 8px;
			}
		}
	}

	.wtabs-box {
		border-top: 1px solid #e6e6e6;
		padding: 0 36px 40px;

		.wtabs {
			height: 64px;
			font-size: 20px;
			color: #333;

			li {
				float: left;
				padding-top: 20px;
				padding-bottom: 14px;
				margin-right: 40px;
				border-bottom: 4px solid #fff;
				&.active {
					border-bottom: 4px solid #35a69d;
					color: #35a69d;
				}


			}
		}


	}
	.wtab-cont {
		margin-right: -18px;
		li {
			position: relative;
			width: 360px;
			height: 418px;
			float: left;
			margin-top: 18px;
			margin-right: 18px;
			border-radius: 4px;
			border: 1px solid #cee7e5;

			.icon-del-white {
				position: absolute;
				top: 16px;
				right: 15px;
				cursor: pointer;
				z-index: 2;
			}
			p {
				height: 78px;
				font-size: 16px;
				color: #333;
				line-height: 1.4em;
				padding: 10px;
				overflow: hidden;
				&.subjoin {
					margin-top: -3px;
				}
			}
			span {
				font-size: 14px;
				color: #666;
			}
			.praise {
				float: right;
			}
		}
		.photo {
			display: block;
			width: 100%;
			height: 298px;
			border-radius: 4px;
		}
		.bg-photo {
			width: 100%;
			position: absolute;
			z-index: 1;
		}
	}

}
#scheduleShowbigPic {
	width: 100%;
	height: auto;	
	display: block;
	margin: 0 auto;
}
</style>
<template>
	<div id="photoWall">
		<template v-if="emptyFlag">
			<bread-crumb
			:courseId="courseId"
			:clazzId="clazzId"
			:breadPhoto = '1'

			></bread-crumb>

			<section class="wempty round-layout">
				<!-- 没有资源时 -->
			    <empty
			      	:tip="tip"
					></empty>
			    <!-- /没有资源时 -->
			</section>
		</template>
		<template v-if="!emptyFlag">
			<div class="bread-box">
				<bread-crumb
				:courseId="courseId"
				:clazzId="clazzId"
				:breadPhoto = '1'

				></bread-crumb>

		        <a href="javascript:void(0)" @click="photoScreen" class="btn-green wfull">
			          <i class="icon-full-white"></i>
			          大屏幕
		        </a>

				<button class="btn-green wexport" type="button"  @click="exportPhoto">
		          <i class="icon-export-white"></i>
		          导出
		        </button>
			</div>

			<div class="photo-box">
				<section class="top-box wrapper clearfix">
					<h1 class="h1">
						<span>【照片墙】{{title}}</span>
					</h1>
				</section>
				<section class="wtabs-box">
					<ul class="wtabs clearfix">
						<li v-for="(item,index) in tabsParam"
						@click="toggleTabs(index)"
						:class="{active:index==nowIndex}">{{item}}</li>
					</ul>

					<ul class="wtab-cont load-minheight clearfix"
					v-loading="loading"
				    :element-loading-text="$globalParam.loadText"
				    :element-loading-spinner="$globalParam.loadSpinner"
				    :element-loading-background="$globalParam.loadText" 
					v-show="nowIndex==='time'">

						<li v-for="(item,index) in photoList" :key="item.id">
							<img class="bg-photo" src="../../../assets/img/common/bg-photo.png" alt="">
							<i @click="delPhotoPic(item.id)" class="icon-del-white"></i>

							<img class="photo" 
								:src="item.url" alt=""
								@click="showmodel(index)"
								>

							<p class="desc">{{item.content}}</p>
							<p class="subjoin clearfix">
								<span>上传人：{{item.name}}</span>
								<span class="praise">赞 {{item.likeCount}}</span>
							</p>
						</li>

					</ul>
					<ul class="wtab-cont clearfix" 
					 v-show="nowIndex==='like'">
						<li v-for="(item,index) in photoList" :key="item.id">
						<img class="bg-photo" src="../../../assets/img/common/bg-photo.png" alt="">
							<i @click="delPhotoPic(item.id)" class="icon-del-white"></i>
							<img class="photo" 
								:src="item.url" alt=""
								@click="showmodel(index)"
								>
							<p class="desc">{{item.content}}</p>
							<p class="subjoin clearfix">
								<span>上传人：{{item.name}}</span>
								<span class="praise">赞 {{item.likeCount}}</span>
							</p>
						</li>

					</ul>
				</section>

				<!-- 分页 -->
				<div class="pagination">
			      	<el-pagination
			        	@current-change ="handleCurrentChange"
			        	layout="prev, pager, next"
			        	:page-size ="21"
			        	:total="totalElements">
			      	</el-pagination>
			    </div>
			</div>
		</template>
		<!-- 图片预览组件 -->
		<imgView :passimg="img" ref="number"></imgView>



	</div>
</template>
<script>
  import { getToken } from '@/filters/userVerify';
	import breadCrumb from 'components/course/breadcrumb'
	import model from 'model/activity/photo'
	import { delTip } from '@/global/open'
	import Empty from 'base/empty/empty'
	import API from '@/global/resource'
import imgView from "@/base/modal/imgview";

	export default {
		data() {
			return {
				// clazzId:"",
				// courseId: "",
				title:"默认照片墙",
				photoList:[],
				tip: '暂无照片',
				tabsParam:{
					"time":"时间排序",
					"like": "热度排序"
				},
				nowIndex:"time",
				cur_page: 1,
				totalElements: 0,
				dialogPic: false,		// 查看大图弹出框
				bigUrl: "",				// 大图路径
				firstBigUrl: "",			// 默认第一个大图的
				emptyFlag: false,

				img: [],		


				loading:true	

			}
		},
		computed:{
			courseId() {
				return  this.$route.query.courseId;
			},
			clazzId() {
				return this.$route.query.clazzId;
			},
			activityId() {
				return this.$route.query.activityId;
			}
		},
		created() {
			// this.courseId = this.$route.query.courseId;
			// this.clazzId = this.$route.query.clazzId;

			this.getPhotoList();
		},
		methods: {
		      photoScreen(){
		        window.open("/static/page/photo_screen.html?clazzId="+this.clazzId+"&courseId="+this.courseId+"&activityId="+this.activityId+"&sort="+this.nowIndex+"&token="+getToken());
		      },
			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getPhotoList();
			},
			toggleTabs(index) {
				this.nowIndex=index;

				this.loading = true;
				// console.log(index);
				this.getPhotoList();
			},
			getPhotoList(){
				let data = {
					activityId: this.activityId,
					sort:this.nowIndex,
					number:this.cur_page,
					size:'21'
				}
				// console.log("photoList",data);
				model.getPhotoList(data, (res => {
					console.log("getPhotoList",res)
					if(res.status == 200) {

						this.loading = false;

						this.totalElements = res.data.totalElements;
						this.photoList = res.data.content;
						this.img=res.data.content;	
						console.log(this.img)
						if(res.data.content.length > 0){
							this.title = res.data.content[0].title;	
						}

						// 是否显示空页面
						if(this.photoList.length == 0) {
							this.emptyFlag =  true;
						} else {
							this.emptyFlag = false;
						}
                        									
					} else {

						this.loading = false;

						this.$message.error(res.message);
					}
				}));
			},

			delPhotoPic(id) {
				let str = "确定要删除该照片吗？";
		    	delTip(this, str, this.delPicOne, id);
			},
			delPicOne(id) {
				let data = {
					id: id
				}
				model.delPhotoPic(data, (res => {
					// console.log("delPhotoPic",res);
					if(res.status == 200) {
						this.getPhotoList();
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			showmodel(index) {
				this.$refs.number.getpassindex(index);
				},
			exportPhoto(){
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				// console.log("photoExport",this.activityId)
				window.open(API.urls.photoExport+"?activityId="+this.activityId+"&token="+getToken());

			},

		},
		components: {
			breadCrumb,
			Empty,
			imgView,
		}
	}
</script>
