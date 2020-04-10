<template>

<div id="wcourseAll">

	<div class="top">

		<section class="top-box wrapper clearfix">
			<h2 class="my-course">我的课程</h2>
			<div class="handle clearfix" v-if="!emptyFlag">
				
				<div class="search">
					<input type="text" v-model="keyword" placeholder="课程名称" @keyup.13="getCourseList" /><i class="el-icon-search" @click.stop="getCourseList"></i>
				</div>
				
			</div>

		</section>
	</div>
	<template v-if="emptyFlag">
		<section class="wempty round-layout">
			<!-- 没有资源时 -->
		    <empty
		      	:tip="tip"
				></empty>
		    <!-- /没有资源时 -->
		</section>
	</template>
	<div class="timer" v-if="!emptyFlag">
		<dl v-for="date in dateList">
			<dt

			:class="date.courseDateForCheck == currDay ? 'now' : (date.courseDateForCheck < currDay ? 'past' : 'future')"
			>{{date.courseDate}}</dt>
			<dd>
				<section class="course-box" v-for="course in date.item" >

					<h3 class="headline">
						<router-link class="title" :to="{ path: '/course/detail', query: {clazzId:clazzId, courseId: course.id}}">{{course.name}}</router-link>

						<span class="rest">（{{course.activityCount}}个课程活动）</span>

						
					</h3>
					<div class="details clearfix">
						<div class="desc">
							<p class="row-two">
								<span>
									<i class="icon-time"></i>时间：{{course.beginTime}}-{{course.endTime}}
								</span>
								<span v-if="course.type == 'LIVE'">
									<i class="icon-user"></i>主讲人：{{course.mainTeacherName}}
								</span>
								<span v-else>
									<i class="icon-user"></i>专家：{{course.mainTeacherName}}
								</span>
							</p>
							<p class="row-one"  v-if="course.type == 'LIVE'" @click="live(course.id)">
								<span class="go-live">
									<i class="icon-live"></i> 去直播 <i class="el-icon-d-arrow-right"></i></span>
							</p>
							<p class="row-one" v-else>
								<i class="icon-address"></i>上课地点：<span v-show="!course.location">无</span>
								<el-popover
								    placement="bottom"
								    width="200"
								    trigger="hover"
								    :content="course.location">
								    <span slot="reference">{{course.location}}</span>
								</el-popover>
							</p>
							<p class="row-one take" v-if="course.type == 'ELECTIVE'">
								<i class="icon-take"></i> 
								<span class="text">选课开放时间 {{course.openBeginTime}} - {{course.openEndTime}} </span>
								<span class="blue">{{course.selectCount}}人已选</span>
							</p>
						</div>
						<div class="subjoin">
							<template v-if="course.type !== 'ELECTIVE'">
								<router-link v-if="course.createEvaAndIntro" :to="{ path: '/activity/evaluation/result', query: {clazzId:clazzId, type:'EVALUATION', courseId: course.id}}">
									<i class="icon-speak"></i>
									评价
								</router-link>
								<router-link v-if="course.createEvaAndIntro" :to="{ path: '/activity/introspection/result', query: {clazzId:clazzId, type: 'INTROSPECTION', courseId: course.id}}">
									<i class="icon-introspection"></i>
									反思
								</router-link>
							</template>
							
							<router-link :to="{ path: '/activity/message/list', query: {clazzId:clazzId,courseId: course.id}}">
								<i class="icon-message"></i>
								 留言板
							</router-link>
						</div>
					</div>

				</section>
			</dd>
		</dl>
	</div>
	

	<router-view></router-view>
</div>

</template>
<script>
  import model from "model/course/course.js"
  import storage from '@/global/storage'
  import Empty from 'base/empty/empty'
  import live from 'model/live/live'

	export default {
		data () {
			return {
				courseList:[],
				dateList:[],
				clazzId:"",
				keyword:"",
				currDay: "",
				tip: "您的课程尚在建设中，请联系班主任给你添加课程吧 ~",
				emptyFlag: false,

				

			}
		},
		beforeRouteEnter (to, from, next) {
		    next(vm => {
		        if(vm.role !== 'PROFESSOR') {
		          	vm.$router.push({path: '/course/all', query: {clazzId: vm.clazzId}});
		        }
		    })
	    },
		computed : {
			role() {
				return storage.get("exp_role");
			}
		},
		created() {
			this.clazzId = this.$route.query.clazzId;
			this.getCourseList();
			this.systemDate();

		},
		methods: {
			live(courseId){
				let data = {
					courseId:courseId
				};
				let newWindow = window.open('');
				live.liveLoginOsType(data,(res)=>{
					console.log(res);
					if(res.status == 200){
						if(!!res.data && res.data == "android" || !!res.data && res.data == "ios"){
							newWindow.close();
							this.$message.error("不支持多设备同时进入直播间");
							return;
						}
						let {href} = this.$router.resolve({
							path:"/live/show",
							query:{
								clazzId:this.clazzId,
								courseId:courseId
							}
						});
						newWindow.location.href=href;
						// window.open(href, '_blank');
					}else{
						newWindow.close();
						this.$message.error(res.message);
					}
					
				})
			},
			systemDate() {

				model.systemDate(res => {
					// console.log("systemDate",res);
					if (res.status == 200) {
						this.currDay = res.data;

					} else {
						this.$message.error(res.message);
					}
				});
			},

			getCourseList() {

				let data = {
					keyword:this.keyword,
					clazzId: this.clazzId
				}
				// console.log("data", data);
				model.myCourseList(data, ( res => {
					console.log("专家课程列表",res);
					if(res.status == 200) {
						this.courseList = res.data;

						if(this.courseList.length == 0) {
							this.emptyFlag = true; 
						} else {
							this.emptyFlag = false;
						}
						this.dateArr(res.data);
					} else {
						this.$message.error(res.message);
					}
				}));
			},

			dateArr(arr) {
				let res = [], obj = {}, index = 0;
				arr.forEach(val => {
					if(obj.hasOwnProperty(val.courseDate)) {
						res[obj[val.courseDate]].item.push(val);
					} else {
						obj[val.courseDate] = index ++;
						let time = Date.parse(new Date(val.courseDateForCheck));
						res.push({
							courseDate: val.courseDate,
							courseDateForCheck: time,
							item: [val]
						});
					}
				});
				this.dateList = res;

				console.log("this.dateList", this.dateList);
				// return res;
			},

			
		},
		components: {
			Empty
		}

		
	}
</script>
<style scoped="" lang="less">
	@import "../../assets/less/icon.less";
	@import "../../assets/less/btn-search.less";
	
	@img: "../../assets/img/icon";
	#wcourseAll {


		.top {
			background-color: #fff;
			margin-top: -18px;
		}
		.top-box {
			box-sizing: border-box;
			height: 90px;
			width: 990px;
			background-color: #fff;

			.my-course {
				width: 400px;
				float: left;
				font-size: 20px;
				color: #34a69c;
				padding: 30px 18px 24px;
			}
			.handle {
				padding: 28px 0 18px;
			}
			
		}

		.timer {
			background-color: #f7f7f7;
			padding: 54px 0;
			width: 990px;
			margin: 0 auto;
			dl {
				border-left: 1px solid #d5d5d5;
				&:last-child {
					border-left: 0;
				}
			}
			dt {
				font-size: 24px;
				color: #000;
				padding-left: 30px;
				&:after {
					position: absolute;
					margin-left: -51px;
					margin-top: -37px;
				}
			}

			.past {
				color: #666;
				&:after {
					display: block;
					content: "";
					width: 42px;
					height: 42px;
					background: url("@{img}/icon-calendar-grey.png") center center no-repeat;

				}
			}
			.now {
				position: relative;
				color: orange;
				&:before {
					position: absolute;
					content: "(今天)";
					font-size: 18px;
					color: #c27400;
					margin-left: 110px;
    				margin-top: 3px;
				}
				&:after {
					display: block;
					content: "";
					width: 42px;
					height: 42px;
					background: url("@{img}/icon-calendar-ora.png") center center no-repeat;

				}
			}
			.future {
				color: green;
				&:after {
					display: block;
					content: "";
					width: 42px;
					height: 42px;
					background: url("@{img}/icon-calendar-green.png") center center no-repeat;

				}
			}


			dd {

				padding-bottom: 48px;
				margin-left: 80px;


			}
			.course-box {
				background: #fff;
				margin-top: 34px;
				border-top: 2px solid #9dcece;
				box-shadow: 0 0 2px 3px  #e5efee;
			}

			.headline {
				height: 56px;
				line-height: 56px;
				padding: 0 15px;
				border-bottom: 1px solid #e3e9ee;
			}
			.title {
				display: inline-block;
				width: 680px;
				font-size: 20px;
				color: #000;
				line-height: 1em;
				border-left: 2px solid #35a69d;
				padding-left: 10px;
				&:hover {
					color: #1077d7;
				}

			}
			.rest {
				font-size: 16px;
				color: #666;
				margin-right: 30px;
			}
			.more {
				color: #666;
			}
			.details {
				padding: 25px;
				>div {
					float: left;
				}
			}

			.desc {
				width: 570px;
				line-height: 1.5em;
				i {
					vertical-align: middle;
					margin-right: 8px;
				}
			}
			.row-two {
				font-size: 18px;
				color: #666;
				margin-bottom: 15px;
				span {
					margin-right: 30px;
				}

			}
			.row-one {
				height: 36px;
				font-size: 16px;
				color: #666;
				white-space: nowrap;
			    overflow: hidden;
			    text-overflow: ellipsis;
			    margin-right: 20px;
				i {
					vertical-align: text-top;
				}
			}
			.go-live {
				display: inline-block;
				padding: 8px 15px;
				background: #F8FBFF;
				font-size: 15px;
				color: #3F99F6;
				line-height: 15px;
				border: 1px solid #99C0E4;
				border-radius: 3px;
				cursor: pointer;
				transition: all .5s;
				&:hover {
					background: #EFF9FF;
				}
				.el-icon-d-arrow-right {
					vertical-align: text-bottom;
					margin-right: 0px;
				}
				.icon-live {
					display: inline-block;
					width: 16px;
					height: 17px;
					background: url("../../assets/img/liveIcon/icon-live.png") center center no-repeat;
					background-size: 100% 100%;
					vertical-align: text-bottom;
					margin-right: 3px;
				}
				
			}
			
			.take {
				.icon-take {
					margin-right: 10px;
					vertical-align: bottom;
				}
				.text {
					font-size: 16px;
					color: #666666;
				}
				.blue {
					font-size: 16px;
					color: #1077D7;
					margin-left: 30px;
				}
			}
			.subjoin {
				width: 288px;
				height: 85px;
				background: url("@{img}/icon-line.png") center left no-repeat;
				text-align: center;
				a {
					display: inline-block;
					width: 32%;
					text-align: center;
					vertical-align: top;
					font-size: 16px;
					color: #666;
					padding-top: 15px;

				}
				i {
					display: block;
					margin: 0 auto;
					margin-bottom: 8px;
				}
			}

		}


	}

</style>