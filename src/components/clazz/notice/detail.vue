<style scoped lang="less">
	#wnoticeDet{
		.wdet {
			padding: 32px 30px;
			h2 {
				font-size: 20px;
				line-height: 1em;
				border-left: 2px solid #35a69d;
				padding-left: 8px;
				margin-bottom: 14px;
			}
			.main {
				padding: 0 10px;
			}
			.desc {
				font-size: 16px;
				color: #999;
				margin-bottom: 14px;
				>img {
					width: 20px;
					height: 20px;
					border-radius: 20px;
					display: inline-block;
					margin-right: 8px;

				}
				span {
					margin-right: 12px;
				}
			}
			.cont {
				font-size: 16px;
				color: #333;
				line-height: 1.8em;
			}
			.pic {
				padding: 8px 0;
				>img {
					display: inline-block;
					width: 90px;
					height: 90px;
					margin-right: 8px;
					border-radius: 5px;
				}
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
	<div id="wnoticeDet">
		<div class="bread-box">
			<bread-crumb	
				:clazzId="clazzId"
				:crumbNoticeDet = '1'
				></bread-crumb>
		</div>
		
		<article class="wdet round-layout">
			<h2>{{detail.title}}</h2>
			<div class="main">
				<p class="desc">
					<img :src="detail.miniAvatar" alt="">
					<span>{{detail.userName}}（{{createRoleName}}）</span>
					<span>{{detail.createDate}}</span>
					<span>阅读次数：{{detail.totalCount}}</span>
				</p>
				<p class="cont">{{detail.content}}</p>
				<p class="pic">
					<img 
						v-for="item in picList" 
						:src="item.transUrl" alt=""
						@click="showBigPic(item.url)">
				</p>
			</div>
			
		</article>

		<!-- 大图弹出框 -->
		<modal :show.sync = "dialogPic" contWidth = '80%' >
			<div slot="body">
				<img id="scheduleShowbigPic" v-if="bigUrl" :src="bigUrl">
				<img id="scheduleShowbigPic" v-else-if="!bigUrl" :src="firstBigUrl" >
			</div>
		</modal>
	</div>
</template>
<script>
	import model from 'model/clazz/notice'
	import breadCrumb from 'components/clazz/breadcrumb'
	import Modal from 'base/modal/modal'

	export default {
		data () {
			return {
				detail: {},
				picList: [],
				createRoleName: "",
				roleVal: {
					'ADMIN': '系统管理员',
					'ORGADMIN': '机构管理员',
					'PROJECTADMIN': '项目管理员',
					'CLAZZMANAGER': '班主任',
					'PROFESSOR': '专家'
				},
				dialogPic: false,		// 查看大图弹出框
				bigUrl: "",				// 大图路径
				firstBigUrl: ""			// 默认第一个大图的路径

			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			},
			noticeId() {
				return this.$route.query.noticeId;
			}
		},
		created() {
			this.getNoticeDet();

		},
		methods: {
			getNoticeDet() {
				let data = {
					id: this.noticeId
				}

				model.noticeDet(data, (res => {
					console.log("通知详情",res);
					if(res.status == 200) {
						this.detail = res.data;
						this.picList = res.data.pictureList;
						this.createRoleName = this.roleVal[res.data.createUserRole];
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
			Modal
		}
	}
</script>