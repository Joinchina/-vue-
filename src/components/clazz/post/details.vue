<style scoped lang="less">
	@import "../../../assets/less/icon.less";
	#wpostDet {

	}
	.wpost-details {
		padding: 30px 38px;
		margin-bottom: 20px;
		.media {
			>img {
				float: left;
				width: 40px;
				height: 40px;
				border-radius: 40px;
				margin-right: 10px;
			}
			.name {
				font-size: 18px;
				color: #333;
				text-decoration: underline;

			}
			.tag-top {
				font-size: 14px;
				color: #fff;
				background-color: #ff7762;
				border-radius: 5px 0 5px 0;
				padding: 1px 6px;
				margin-left: 8px;
    			vertical-align: text-top;
			}
			.time {
				font-size: 14px;
				color: #999;
			}
		}
		.cont {
			display: block;
			font-size: 20px;
			line-height: 1.6em;
			color: #333;
			margin: 15px 0 18px;
		}
		.img-box {
			>img {
				width: 90px;
				height: 90px;
				border-radius: 5px;
				float: left;
				margin-right: 8px;
			}
		}
		.videoBox{
			width: 100%;
			overflow: hidden;
			li {
				position: relative;
				float: left;
				width: 200px;
				height: 200px;
				margin-right: 20px;
				margin-top: 20px;
				img {
					width: 200px;
					height: 200px;
					border-radius: 5px;
				}
				.playpicvideo{
					width: 36px;
					height: 36px;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%,-50%);
					cursor: pointer;
					z-index: 2;
					img{
					max-width: 100%;
					max-height: 100%;          
					}
				}
				.videotime{
					position: absolute;
					z-index: 2;
					left: 7px;
					bottom: 7px;
					font-size: 14px;
					color: #FFFFFF;
					background: rgba(0, 0, 0, 0.49);
					overflow: hidden;
					padding: 4px 10px;
					border-radius: 20px;
				}
			}
		}
	}
	.wpost-comment {
		padding: 20px 24px;

		.title {
			font-size: 20px;
			line-height: 1em;
			color: #333;
			border-left: 3px solid #35a69d;
			padding:0 8px;
			margin-bottom: 35px;
		}
		.wcomment {
			border-bottom: 1px solid #f1f1f1;
			padding:16px 10px; 
			dt {
				margin-bottom: 18px;
			}
			dd {
				margin-left: 50px;
			}
		}
		.media {
			>img {
				float: left;
				width: 40px;
				height: 40px;
				border-radius: 40px;
				margin-right: 10px;
			}
			>h3 {
				position: relative;
			}
			.name {
				font-size: 18px;
				color: #333;
				text-decoration: underline;

			}
			
			.time {
				font-size: 14px;
				color: #999;
			}
			.del {
				position: absolute;
				right: 0;
				font-size: 16px;
				color: #1077d7;
				cursor: pointer;
				i {
					
					vertical-align: middle;
				}
			}
			.cont  {
				font-size: 18px;
				color: #333;
				line-height: 1.6em;
			}
		}

		.reply {
			border-left: 2px solid #e0e6e2;
			padding-left: 8px;
			font-size: 16px;
			.time {
				font-size: 14px;
				color: #999;
			}
			li {
				margin-bottom: 15px;
				color: #999;
				line-height: 1.6em;
			}
			.cont {
				color: #333;
			}
			.ora {
				color: #ff7e00;
			}
			.green {
				color: #35a69d;
			}

		}

	}
	#scheduleShowbigPic {
		width: 100%;
		// height: auto;	
		display: block;
		margin: 0 auto;

	}
</style>
<template>
	<div id="wpostDet">

		<div class="bread-box">
			<bread-crumb
			:clazzId="clazzId"
			:crumbPostDetails = '1'
			></bread-crumb>
		</div>

		<section class="wpost-details round-layout">
			<div class="media clearfix">
				<img v-if="topic.miniAvatar" :src="topic.miniAvatar" alt="">
				<img v-else src="../../../assets/img/common/avatar.png" alt="">
				<h3>
					<a href="javascript:;" class="name" @click="handleShow(topic.userId)">{{topic.name}}</a>
					<span v-if="topic.istop" class="tag-top">置顶</span>
				</h3>
				<p class="time">{{topic.createDate}}</p>
			</div>
			<p class="cont">{{topic.content}}</p>
			<div class="img-box clearfix" v-if="!!topic.pictures">
				<img v-for="item in topic.pictures" :src="item.transUrl" alt="" @click="showBigPic(item.url)">
			</div>
			<!-- 帖子视频 -->
			<div class="videoBox" v-if="!!topic.video">
				<ul class="wpic-list clearfix"> 
					<Li>
						<img :src="topic.video.picTransUrl"  alt="">
						<div class="playpicvideo" @click="playvideo(topic.video.videoUrl)">
							<img src="../../../assets/img/clazz/play.png" alt="">
						</div>
						<div class="videotime">
							时长  {{topic.video.videoTime | videotimefilter}}
						</div>
					</Li>
				</ul>
			</div>
		</section>

		<section class="wpost-comment round-layout">
			<h2 class="title">评论（{{commentCount}}）</h2>

			<div class="comment-box">
				<dl class="wcomment" v-for="item in comment" :key="item.id">
					<dt class="media clearfix">
						<img v-if="item.miniAvatar" :src="item.miniAvatar" >
						<img v-else-if="!item.miniAvatar" src="../../../assets/img/common/avatar.png" >
						<h3>
							<a href="javascript:;" class="name"  @click="handleShow(item.userId)">{{item.name}}</a>
							<span class="time">{{item.createDate}}</span>
							<span class="del" @click="handleDel(item.id)">
								<i class="icon-del-blue"></i>
								删除
							</span>
						</h3>
						<p class="cont">{{item.content}}</p>
					</dt>
					<dd>
						<ul class="reply" >
							<li v-for="sub in subComment[item.id]" :key="sub.id">
								<template v-if="sub.toName">
									<span class="ora">{{sub.name}}</span> 回复 <span class="ora">{{sub.toName}}</span> <span class="time"> {{sub.createDate}}</span>
								</template>
								<template v-else>
									<span class="green">{{sub.name}}</span> <span class="time"> {{sub.createDate}}</span>
								</template>

								<p class="cont">{{sub.content}}</p>
							</li>
							
						</ul>
					</dd>
				</dl>
			</div>
		</section>
		
		<!-- 学员信息 -->
		<stu-msg 
			:dialogStuMsg.sync = 'stuShow'
			:stuId = 'stuId'></stu-msg>

		<!-- 大图弹出框 -->
		<modal :show.sync = "dialogPic" contWidth = '80%' >
			<div slot="body">
				<img id="scheduleShowbigPic" v-if="bigUrl" :src="bigUrl">
				<img id="scheduleShowbigPic" v-else-if="!bigUrl" :src="firstBigUrl" >
			</div>
		</modal>
		 <!-- 查看视频 -->
		<Modalvideo :show.sync = "viewVideoShow" contWidth = '80%' bgColor="transparent" :before-close="videoClose">
			<div slot="body" style="height:100%">
			<video :src="videourl" controls="controls"  width="100%" height="100%" id="myVideo">
			您的浏览器不支持video标签
			</video>
			</div>
		</Modalvideo>
	</div>
</template>
<script>
	import post from 'model/clazz/post'
	import breadCrumb from 'components/clazz/breadcrumb'
	import stuMsg from 'components/clazz/stumsg'
	import { delTip } from '@/global/open'
	import Modal from 'base/modal/modal'
	import imgview from 'base/modal/imgviewone';
	import Modalvideo from 'base/modal/modal'
	export default {
		data () {
			return {
				topic: {},	//帖子详情
				pictures: [],	//图片集合
				comment: [],	// 评论
				subComment: {},	// 子评论
				commentCount: 0,
				stuShow: false,	//显示弹出框
				stuId: "",	// 学员id
				dialogPic: false,		// 查看大图弹出框
				bigUrl: "",				// 大图路径
				firstBigUrl: "",			// 默认第一个大图的路径
				viewVideoShow:false,//视频查看
      			videourl:'',//视频查看url
			}
		},
		filters:{
			videotimefilter(val){
			if(val<10){
				return '00:0'+val
			}else{
				return '00:'+val
			}
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			},
			postId() {
				return this.$route.query.postId
			}
		},
		created() {
			this.getDetails();
			this.getComment();
		},
		methods: {
			//贴子视频关闭
			videoClose() {
				document.getElementById("myVideo").pause();
				this.videourl = '';
				this.viewVideoShow=false
				
			},
			//帖子视频播放
			playvideo(val){
				this.videourl=val;
				this.viewVideoShow=true;
			},
			handleShow(stuId) {
				// console.log("学员id",stuId);
				this.stuId = stuId;
				this.stuShow = true;
			},
			getDetails() {
				let data = {
					id: this.postId,
					clazzId:this.clazzId,
				}
				post.topicDetails(data, (res => {
					console.log("帖子详情",res);
					if(res.status == 200) {
						this.topic = res.data;
						// this.pictures = res.data.pictures;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			getComment() {
				let data = {
					topicId: this.postId,
					clazzId:this.clazzId,
				}

				post.topicComment(data, (res => {
					// console.log("帖子评论",res)
					if(res.status == 200) {
						this.comment = res.data;
						this.commentCount = res.data.length;
						// 获取评论回复
						res.data.forEach((item,index) => {
							this.getSubComment(item.id);
						});
					} else {
						this.$message.error(res.message);
					}
				}));
			},

			getSubComment(parentId) {
				let data = {
					parentId:parentId,
					clazzId:this.clazzId 
				}

				post.topicSubComment(data, (res => {
					// console.log('子评论', res);
					if(res.status == 200) {
						
						this.$set(this.subComment, parentId, res.data);
						// console.log("对象数组",this.subComment);
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			handleDel(id) {
				let str = "确定要删除该评论吗？";
				delTip(this, str, this.commentDel, id);
			},

			commentDel(id) {
				let _this = this;
				let data = {
					id: id,
					clazzId:this.clazzId,
				}

				post.topicDelComment(data, (res => {
					if(res.status == 200) {
						this.$message({
							type: 'success',
							message: '删除成功',
							duration: 1000,
							onClose() {
								_this.getComment();
							}
						});
					} else {
						this.$message.error(res.message);
					}
				}));
			},

			showBigPic(url) {
				this.bigUrl = url;
				this.dialogPic = true;
			}

			
		},
		components: {
			breadCrumb,
			stuMsg,
			Modal,
			imgview,
			Modalvideo,
		}
	}
</script>