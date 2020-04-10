<style scoped lang="less">
@import "../../../assets/less/icon.less";
.bread-box {
	position: relative;
	margin-bottom: 15px;
	.btn-green,
	.btn-blue {
		display: inline-block;
		position: absolute;
		top:0;
		padding: 10px 15px;
		font-size: 16px;
	}
	.wissue {
		right: 0;
		&::after{
			width: 0;
			height: 0;
		}
	}
	.wexport {
		right: 0;

	}
}
.wschedule {
	padding: 28px 34px;
	dt {
		font-size: 20px;
		color: #333;
		margin-bottom: 12px;
	}
	dd {
		font-size: 16px;
		color: #666;
		line-height: 1.6em;
	}
	.pic-box {
		margin-bottom: 34px;
		img {
			float: left;
			width: 90px;
			height: 90px;
			border-radius: 5px;
			margin-right: 10px;
			cursor: pointer;

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
	<div id="wcoursePlanRes">
		<template v-if="emptyFlag">
			<Goback :passtitle="passtitle" path="/clazz/menu" :query="query"></Goback>
			<!-- 没有课程安排时 -->
		    <empty 
		      :tip="tip"
		      :btntext="btntext"
		      @add="addPlan"></empty>
		    <!-- /没有课程安排时 -->
		</template>
		

	    <template v-if="!emptyFlag" v-loading="loading"
        :element-loading-text='this.$globalParam.loadText'
        :element-loading-spinner='this.$globalParam.loadSpinner'
        :element-loading-background='this.$globalParam.loadBg'>
	    	<div class="bread-box">
				<Goback :passtitle="passtitle" path="/clazz/menu" :query="query"></Goback>

				<router-link :to="{ path: '/clazz/course/add', query: {clazzId: clazzId }}" class="btn-green wissue" >
					<i class="icon-issue"></i>
					重新发布
				</router-link>
				
			</div>

			<section v-if="type ==='IMAGE'" class="wschedule round-layout">
				<dl>
					<dt>图片：</dt>
					<dd class="pic-box clearfix">
						<img 
							v-for="item in pictures" 
							:src="item.transUrl"
							@click="showBigPic(item.url)">
					</dd>
				</dl>
				<dl>
					<dt>补充内容：</dt>
					<dd>{{schedule.content}}</dd>
				</dl>
			</section>

			<section v-if="type ==='PDF'" class="wschedule round-layout" style="min-height:1000px">
	    		<iframe :src="schedule.fileUrl" id="showIframe" width="100%" height="1000px" frameborder="0"></iframe>
	    	</section>
	    </template>
	
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
	import model from 'model/clazz/course'
	import Empty from 'base/empty/empty'
	import Goback from 'base/goback/goback';
	import Modal from 'base/modal/modal'

	export default {
		data () {
			return {
				id:"",
				type: "",     // 显示类型
				schedule: {},
				pictures: [],
				tip: '暂无课程安排，点击添加吧!',			
				btntext: '添加课程安排',
				dialogPic: false,		// 查看大图弹出框
				bigUrl: "",				// 大图路径
				firstBigUrl: "",			// 默认第一个大图的
				emptyFlag: false,		// 是否显示空页面
				passtitle:'课程安排',
				loading:true,

			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			},
			query() {
				return { clazzId: this.$route.query.clazzId };
			}
		},
		created() {
			this.getSchedule();
			
		},
		methods: {
			getSchedule() {
				let data = {
					clazzId: this.clazzId
				}
				// console.log("课程安排");
				model.scheduleFind(data, (res => {
					console.log("课程安排",res);
					if(res.status == 200) {
						this.loading=false
						if(res.data == undefined) {
							this.emptyFlag = true;
						} else {
							this.emptyFlag = false;
						}
						
						this.schedule = res.data.schedule;
					
						

						this.id = res.data.schedule.id;
						
						this.type = res.data.schedule.type;
						this.pictures = res.data.pictures;
						this.firstBigUrl = res.data.pictures[0].url;

						


					} else {
						this.$message.error(res.message);
					}
				}));
			},
			addPlan() {
				this.$router.push({ path: '/clazz/course/add', query:{clazzId: this.clazzId } });
			},
			showBigPic(url) {
				this.bigUrl = url;
				this.dialogPic = true;
			}
		}, 

		components: {
			Empty,
			Goback,
			Modal
		}
	}
</script>
