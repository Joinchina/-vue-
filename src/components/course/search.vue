<template>
<div id="wsearch">
	
	<div class="coursebox">
		<Goback passtitle="课程搜索" ></Goback>

		<div class="search-box round-layout">
			<div class="search-top">
				
				<el-select class="type" v-model="value" placeholder="课程">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
				<div class="search">
					<input type="text" v-model="keyword" placeholder="课程名称/主讲人" @keyup.13="getCourseList" /><i class="el-icon-search" @click.stop="getCourseList"></i>
				</div>				
			</div>
			
			<div class="timer load-minheight" 
				>
				<dl v-for="(date,index) in courseList" :key="index">
					<dt>
						<i class="danri" v-if="date.type == 'SINGLE'"></i>
						<i class="kuatian" v-if="date.type == 'MULTI'"></i>
						<i class="icon-live-course" v-if="date.type == 'LIVE'"></i>
						<i class="xuanxiu" v-if="date.type == 'ELECTIVE'"></i>
					    <span class="classtitle" v-if="date.type == 'MULTI'">{{date.courseDate}} {{date.beginTime}}-{{date.endDate}} {{date.endTime}}</span>
					    <span class="classtitle" v-else>{{date.courseDate}} {{date.beginTime}}-{{date.endTime}}</span>
					</dt>
					<dd>
						<!-- 必修课 -->
						<section class="course-box" v-if="date.type=='SINGLE' || date.type=='MULTI'">
							<h3 class="headline">
								<router-link v-if="date.type=='SINGLE'" class="title" :to="{ path: '/course/detail', query: {clazzId:clazzId, courseId: date.id}}" >
								   {{date.name}}
								</router-link>
								<router-link  v-if="date.type=='MULTI'" class="title-days" :to="{ path: '/course/detail', query: {clazzId:clazzId, courseId: date.id}}">									
									{{date.name}}
								</router-link>
								
								<span class="rest">（{{date.activityCount}}个课程活动）</span>
								<el-dropdown class="more" trigger="click" placement="bottom-start">
									<span class="el-dropdown-link">
										<i class="el-icon-more"></i>
									</span>
									<el-dropdown-menu class="more-menu" slot="dropdown">
										<el-dropdown-item @click.native.stop="handleEdit(date.id, date.type)">
											<i class="icon-edit2"></i>
											编辑
										</el-dropdown-item>
										<el-dropdown-item  @click.native.stop="handleDel(date.id)">
											<i class="el-icon-delete2"></i>
											删除
										</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</h3>
							<div class="details clearfix" @click="routerlink(date.id)">
								<div class="desc">
									<p class="row-two">
										<span>
											<i class="el-icon-tickets"></i>{{date.subjectTypeName}}
										</span>
										<span>
											<i class="icon-user"></i>专家：{{date.mainTeacherName}}
										</span>
									</p>
									<p class="row-one">
										<i class="icon-address"></i>上课地点：<span v-show="!date.location">无</span>
										<el-popover
										    placement="bottom"
										    width="200"
										    trigger="hover"
										    :content="date.location">
										    <span slot="reference">{{date.location}}</span>
										</el-popover>
										
									</p>
								</div>
								<div class="subjoin">
									<a @click.stop="topingjia(date.id)" v-if="date.createEvaAndIntro">
										<i class="icon-speak"></i>
										评价
									</a>
									<a @click.stop="tofansi(date.id)" v-if="date.createEvaAndIntro">
										<i class="icon-introspection"></i>
										反思
									</a>
									
									<a @click.stop="toliuyan(date.id)">
										<i class="icon-message"></i>
										留言板
									</a>
									<a @click.stop="tokechegn(date.id)">
										<i class="icon-course-report"></i>
										课程报告
									</a>
								</div>
							</div>
						</section>
						<!-- 云课堂 -->
						<section class="course-box" v-else-if="date.type=='LIVE'">
							<h3 class="headline">
								<router-link v-if="date.type=='LIVE'" class="title" :to="{ path: '/course/detail', query: {clazzId:clazzId, courseId: date.id}}" >
								   {{date.name}}
								</router-link>
								
								
								<span class="rest">（{{date.activityCount}}个课程活动）</span>
								<el-dropdown class="more" trigger="click" placement="bottom-start">
									<span class="el-dropdown-link">
										<i class="el-icon-more"></i>
									</span>
									<el-dropdown-menu class="more-menu" slot="dropdown">
										<el-dropdown-item @click.native.stop="liveCourseFn('edit',date.id,date.type)">
											<i class="icon-edit2"></i>
											编辑
										</el-dropdown-item>
										<el-dropdown-item  @click.native.stop="handleDel(date.id)">
											<i class="el-icon-delete2"></i>
											删除
										</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</h3>
							<div class="details clearfix" @click="routerlink(date.id)">
								<div class="desc">
									<p class="row-two">
										
										<span>
											<i class="icon-user"></i>主讲人：{{date.mainTeacherName}}
										</span>
									</p>
									<p class="row-one">
										<span class="golive" @click.stop="golive(date.id,'host')" v-if="curUserId == date.mainTeacherId">
											<i class="icon-live"></i> 去直播 <i class="el-icon-d-arrow-right"></i></span>
										<span  class="golive" @click.stop="golive(date.id,'host')"  v-else-if="date.liveStatus == 'LIVING' && curRole != 'ADMIN' && curRole != 'PROFESSOR'">进入直播间 </span>
									</p>
								</div>
								<div class="subjoin">
									<a href="javascript:;" @click.stop="topingjia(date.id)" v-if="date.createEvaAndIntro">
										<i class="icon-speak"></i>
										评价
									</a>
									<a href="javascript:;" @click.stop="tofansi(date.id)" v-if="date.createEvaAndIntro">
										<i class="icon-introspection"></i>
										反思
									</a>
									
									<a href="javascript:;" @click.stop="toliuyan(date.id)">
										<i class="icon-message"></i>
										留言板
									</a>
									<a href="javascript:;" @click.stop="tokechegn(date.id)">
										<i class="icon-course-report"></i>
										课程报告
									</a>
								</div>
							</div>
						</section>
						<!-- 选修课 -->
						<section class="course-box" v-else>
							<div class="selectclazz">
								<div class="selectclazz_top">
									<h3 class="headline2">
										<span class="title2">选修课</span>
										<span class="open-time">(选修课开放时间  {{date.openBeginTime}} — {{date.openEndTime}})</span>
										<span class="take-rate blue">选课进度： {{date.progress}}% </span>

									</h3>
									<el-dropdown class="more" trigger="click" placement="bottom-start">
										<span class="el-dropdown-link">
											<i class="el-icon-more"></i>
										</span>
										<el-dropdown-menu class="more-menu" slot="dropdown">
											<el-dropdown-item @click.native.stop="handleEditBasic(date.id, date.type)">
												<i class="icon-edit2"></i>
												编辑
											</el-dropdown-item>
											<el-dropdown-item  @click.native.stop="handleExp(date.id)">
												<i class="icon-exp-grey"></i>
												导出
											</el-dropdown-item>
											<el-dropdown-item  @click.native.stop="handleDelnew(date.id)">
												<i class="el-icon-delete2"></i>
												删除
											</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
									<div class="select_cen clearfix">
										<p class="take-desc">选课说明：<span >{{date.description}}</span></p>
										<!-- <p class="take-rate"><span class="blue">选课进度： {{date.progress}}% </span></p> -->
									</div>
								</div>
								
								<div class="details2 clearfix" v-for="(course,index) in date.courseVoList" >
										<!-- <router-link v-if="course.type=='ELECTIVE'" class="title" :to="{ path: '/course/detail', query: {clazzId:clazzId, courseId: course.id}}" >
											{{index+1}}. {{course.name}}
										</router-link> -->
										<div class="h1font" @click="routerlink(course.id)">{{index+1}}. {{course.name}}</div>
										<el-dropdown class="more" trigger="click" placement="bottom-start">
											<span class="el-dropdown-link">
												<i class="el-icon-more"></i>
											</span>
											<el-dropdown-menu class="more-menu" slot="dropdown">
												<el-dropdown-item @click.native.stop="handleEditChild(course.id, date.id,course.selectCount,index)">
													<i class="icon-edit2"></i>
													编辑
												</el-dropdown-item>
												<el-dropdown-item  @click.native.stop="handleDel(course.id)">
													<i class="el-icon-delete2"></i>
													删除
												</el-dropdown-item>
											</el-dropdown-menu>
										</el-dropdown>										

									<div class="desc">
										<p class="row-two">
											<span>
												<i class="el-icon-tickets"></i>{{course.subjectTypeName}}
											</span>
											<span>
												<i class="icon-user"></i>专家：{{course.mainTeacherName}}
											</span>
										</p>
										<div class="address">

											<i class="icon-address"></i>上课地点：<span v-show="!course.location">无</span>
											<el-popover
											    placement="bottom"
											    width="200"
											    trigger="hover"
											    :content="course.location">
											    <span slot="reference">{{course.location}}</span>
											</el-popover>
										</div>
										<div class="progress">
											选课进度：<span>{{course.selectCount}}</span>/{{course.upperLimit}}
										</div>	
											
									</div>
									<div class="subjoin2">										
										<a @click.stop="toliuyan(course.id)">
											<i class="icon-message"></i>
											留言板
										</a>										
									</div>
								</div>
							</div>
						</section>
						
					</dd>
				</dl>
			</div>
		</div>
	</div>
	
	<!-- 编辑单日课程 -->
	<edit-course
		:dialogEditCourse.sync="editCourse"
		:clazzId="clazzId"
		:courseId="editCourseId"
		@updateCourseList="getCourseList"></edit-course>
	<!-- 编辑跨天课程 -->
	<edit-course2
		:dialogEditCourse.sync="editCourse2"
		:clazzId="clazzId"
		:courseId="editCourseId"
		@updateCourseList="getCourseList"></edit-course2>

	<editElectiveBasic
		:visibleFlag.sync="editCourseBasic"
		:electiveCourseId="electiveCourseId"
		@updateElectiveList="getCourseList"></editElectiveBasic>

	<editElectiveChild
		:visibleFlag.sync="editCourseChild"
		:clazzId="clazzId"
		:courseId="childCourseId"
		:electiveId = electiveCourseId
		:addFlag = childAddFlag
		:selectCount = childSelectCount
		:childcourseCount = childCourseCount
		@updateElectiveList="getCourseList"></editElectiveChild>
	
	<!-- 编辑直播课 -->
	<live-course
		:dialogLiveCourse.sync="addliveCourse"
		:clazzId="clazzId"
		:courseId = "editCourseId"
		type="LIVE"
		genre="edit"
		@updateCourseList="getCourseList"
		></live-course>

	<overLimitPop 
		:overLimitDialog.sync = "overLimit" 
		:text = "'该机构直播时长已用尽，无法开启课程直播'" 
		:footerText = "'增加直播课时长'" 
		:param="'liveTime'"></overLimitPop>

	<router-view></router-view>
</div>

</template>
<script>
  	import model from "model/course/course.js"
  	import storage from '@/global/storage'
  	import Goback from 'base/goback/goback'
  	import editCourse from 'components/course/edit_course'
  	import editCourse2 from 'components/course/edit_course2'
	import { delTip } from '@/global/open'
	import editElectiveBasic from "components/course/edit_elective_basic"
  	import editElectiveChild from "components/course/deal_elective_course"
  	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'

	import liveCourse from 'components/course/live_course_pop'
	import { getCurRole, getCurUserId } from '@/filters/userVerify'
	import live from 'model/live/live'

	import overLimitPop from "@/base/overLimitPop/index"

	export default {
		data () {
			return {
				courseList:[],//接口返回的数据
				dateList:[],//根据日期拍好的数据				
				keyword:"",
				currDay: "",
				options: [{
					value: "course",
					label: "课程"
				}, {
					value: "teacher",
					label: "主讲人"
				}],
				value: "course",
				addCourse: false,
				editCourse: false,
				editCourse2: false,
				editCourseId: "",
				crumb:"",
				importCourse: false,
				//更新
				// dataArr:[],//'2018/11/12','2018/11/18'用于设置日期下的点指示当前日期下有课
				// choosedate:[],
				editCourseBasic:false,  //选修课主体显隐flag
				editCourseChild:false,  //选修课子课程显隐flag
				electiveCourseId: "",  //选修课主体id
				childCourseId: '', //子选修课id
				childAddFlag: "",  //添加子选修标识
				childSelectCount: 0, //选修课进度
				childCourseCount: 0, //选修课索引

				addliveCourse: false,	// 直播课
				curRole: getCurRole(),
				curUserId: getCurUserId(),
				overLimit : false ,
			}
		},
		
		computed : {
			role() {
				return storage.get("exp_role");
			},
			clazzId () {
				return this.$route.query.clazzId;
			}
		},
		filters: {
			formatDate(value) {
				if(value) {
					let d = value.split(":");
					return d[0] + ":" + d[1];
				}
			}
		},
		created() {			
			
		},
		mounted() {
			// 获取课程列表
			this.getCourseList();
		},
		methods: {
			// 编辑直播课
			liveCourseFn(genre,courseId,type) {

				this.addliveCourse = true;

				if(courseId) {
					this.editCourseId = courseId;
				}

			},
			//获取课程信息
			getCourseList(){
				let data={
					clazzId:this.clazzId,
					keyword: this.keyword,
					type: this.value
				};
				model.getcourseListv360(data,(res)=>{
					if(res.status==200){
						console.log("课程列表==", res.data);
						this.courseList = res.data;

						this.formatData(res.data);
					} else {
						this.$message.error(res.message);
					}
				})
			},
			// 计算选课进度
			formatData(arr) {
				arr.forEach((item,index) => {
					let type = item.type;
					if(type == 'ELECTIVE') {
						let rate = 0, selectCount = 0, upperLimit = 0;
						item.courseVoList.forEach(val => {
							selectCount += val.selectCount; 
							upperLimit += val.upperLimit; 
						});
						rate =  Math.floor((selectCount/upperLimit)*100)
						console.log("rate===",item.openBeginTime, selectCount, upperLimit, rate)
						this.$set(item, 'progress', rate);
					}
				});
			},
			handleEdit(courseId,type) {
				this.editCourseId = courseId;
				if(type == 'SINGLE') {
					this.editCourse = true;
				} else if(type == 'MULTI') {
					this.editCourse2 = true;
				}
				
			},
			handleDelnew(courseId) {
				let str = "确定要删除课程吗？";
          		delTip(this, str, this.delElectiveCourse, courseId);
			},
			delElectiveCourse(courseId) {
				let _this = this;
				let data = {
					electiveId: courseId
				}
				model.delElectiveCourse (data, (res => {
					// console.log("delCourse",res);
					if(res.status == 200) {
						this.$message({
			              type: 'success',
			              message: '删除成功',
			              duration: 1000,
			              onClose() {
			               _this.getCourseList();
			              }
			            });
					} else {
						this.$message.error(res.message);
					}
				}));
			},

			handleDel(courseId) {
				let str = "确定要删除课程吗？";
          		delTip(this, str, this.delCourse, courseId);
			},
			delCourse (courseId) {
				// console.log("delCourse","ddddd");
				let _this = this;
				let data = {
					courseId: courseId
				}
				model.delCourse (data, (res => {
					// console.log("delCourse",res);
					if(res.status == 200) {
						this.$message({
			              type: 'success',
			              message: '删除成功',
			              duration: 1000,
			              onClose() {
			               _this.getCourseList();
			              }
			            });
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			handleExp(courseId) {
				window.open(API.urls.courseElectiveExp+"?electiveId="+courseId+"&token="+getToken());
			},
			routerlink(index){
			    this.$router.push({ path: '/course/detail', query: {clazzId:this.clazzId,courseId:index}});			
			},
			tofansi(index){
				this.$router.push({ path: '/activity/introspection/result', query: {clazzId:this.clazzId, type: 'INTROSPECTION', courseId:index}});	
			},
			topingjia(index){
				this.$router.push({ path: '/activity/evaluation/result', query: {clazzId:this.clazzId, type:'EVALUATION', courseId: index}})
			},
			toliuyan(index){
				this.$router.push({ path: '/activity/message/list', query: {clazzId:this.clazzId,courseId:index}})
			},
			tokechegn(index){
				this.$router.push({ path: '/report/course/creport', query: {clazzId:this.clazzId,courseId: index}})
			},
			golive(courseId,host) {
				if(host){
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
							if(res.status==423){
								this.overLimit = true;
							}
							// this.$message.error(res.message);
						}
						
					})
				}else{
					let {href} = this.$router.resolve({
							path:"/live/show",
							query:{
								clazzId:this.clazzId,
								courseId:courseId
							}
					});
					window.open(href, '_blank');
				}
			},
			//点击编辑函数
			handleEditBasic(id,type){
				if(type =="ELECTIVE"){
					this.electiveCourseId = id;
					this.editCourseBasic = true;
				}
			},
			//编辑子选修课函数
			handleEditChild(childid,electiveCourseId,selectCount,index,addFlag){
				this.childCourseId = childid;
				this.childSelectCount = selectCount;
				this.childAddFlag = addFlag?true:false;
				this.electiveCourseId = electiveCourseId;
				this.childCourseCount = index+1;
				this.editCourseChild = true;
			}
			
		},
		components: {
			Goback,
			editCourse,
			editElectiveBasic,
			editElectiveChild,
			editCourse2,
			liveCourse,
			overLimitPop
		}
	}
</script>
<style scoped="" lang="less">
@import "../../assets/less/icon.less";
@import "../../assets/less/btn-search.less";
@img: "../../assets/img/icon";
#wsearch {
	widows: 100%;
	overflow: hidden;	
	
	.coursebox{
		width: 100%;
		overflow: hidden;
		
		.search-box{
			margin: 10px auto 0;
			overflow: hidden;
			padding-top: 20px;

			.search-top{
				display: block;
				width: 400px;
				margin: 0 auto;
				overflow: hidden;
				.el-button--primary{					
					width: 122px;
					height: 39px;
					border-radius: 6px;
					font-size: 16px;
					color: #FFFFFF;
					margin:0 auto;
					float: left;
					margin-left: 454px;
					i{
						vertical-align: text-bottom;
					}
				}
				.el-select,.type{					
					width: 100px;
					height: 39px;
					float: left;
					margin-left: 20px;
				}
				.search{
					margin-left: 20px;
					float: left;
					background-color: #ffffff;
				}
			}
			.timer {
				background-color: #fff;
				padding: 54px 0 54px 60px;
				.danri{
					    float: left;
						content: "";
						width: 38px;
						height: 30px;
						background: url('../../assets/img/icon/3610.png') center center no-repeat;
						background-size: cover;
						margin:-20px 0 0 -20px;
				}
				.kuatian{
					    float: left;
						content: "";
						width: 38px;
						height: 30px;
						background: url('../../assets/img/icon/364.png') center center no-repeat;
						background-size: cover;
						margin:-20px 0 0 -20px;
				}
				.xuanxiu {
					float: left;
					content: "";
					width: 38px;
					height: 30px;
					background: url('../../assets/img/icon/368.png') center center no-repeat;
					background-size: cover;
					margin:-20px 0 0 -20px;
				}
				.icon-live-course{
				    float: left;
					content: "";
					width: 38px;
					height: 30px;
					background: url('../../assets/img/icon/icon-live-course.png') center center no-repeat;
					background-size: cover;
					margin:-20px 0 0 -20px;
				}
				dl {
					border-left: 1px solid #d5d5d5;
					&:last-child {
						border-left: 0;
					}
				}
				dt {
					font-size: 24px;
					color: #666;
					.classtitle{
						float: left;
						margin: -20px 0 0 30px;
					}
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
						font-size: 16px;
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
				.icon-edit2 {
					width: 14px;
					height: 14px;
					vertical-align: text-bottom;
					margin-left: 2px;
				}
				.el-icon-delete2 {
					font-size: 16px;
				}
				.el-icon-more {
				transform: rotate(90deg);
				-ms-transform: rotate(90deg);
				-moz-transform: rotate(90deg);
				-webkit-transform: rotate(90deg);
				-o-transform: rotate(90deg);
				color: #666;
				cursor: pointer;
				}
				dd {
					width: 1020px;
					padding-bottom: 48px;
					margin-left: 51px;
					padding-top: 1px;
				}
				.course-box {
					background: #fff;
					border-top: 2px solid #9dcece;
					box-shadow: 0 0 2px 3px  #e5efee;
					clear: left;
					margin-top: 30px;
					padding: 0;
				}
				.headline,.headline2 {
					 height: 56px;
					line-height: 56px;
					margin: 0 60px;
					border-bottom: 1px solid #e3e9ee;
				}
				.headline2 {
					border: 0;
					margin: 0;
				}
				.title,.title-days,.title2 {
					display: inline-block;
					width: 625px;
					font-size: 20px;
					font-weight: 600;
					color: #000;
					line-height: 56px;
					vertical-align: text-bottom;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
					// padding-left: 10px;
					&:hover {
						color: #1077d7;
					}
				}
				.title2 {
					width: 70px;
					vertical-align: middle;
				}
				.open-time {
					display: inline-block;
					font-size: 16px;
					color: #666;
					vertical-align: middle;
				}
				.take-rate {
					display: inline-block;
					margin-left: 200px;
					font-size: 16px;
					vertical-align: middle;
				}
				.title-days {
					border-left: 0 none;
					>.icon-course-days {
						vertical-align: middle;
						margin-top: -2px;
						margin-left: -10px;
						margin-right: 5px;
					}
				}
				.rest {
					font-size: 16px;
					color: #666;
					margin-right:26px;
					padding-left: 50px;
					display: inline-block;
				    line-height: 56px;
				    vertical-align: top;
				}
				.more {
					color: #666;
					float:right;
					// margin-right:40px;
				}
				.details {
					padding: 25px 0;
					margin: 0 60px;
					>div {
						float: left;
					}
				}
				.desc {
					width: 530px;
					line-height: 1.5em;
					i {
						vertical-align: middle;
						margin-right: 8px;
					}
				}
				.row-two {
					font-size: 16px;
					color: #666;
					margin-bottom: 15px;
					span {
						margin-right: 30px;
						color: #666;
					}
				}
				.row-one {
					width: 90%;
					font-size: 16px;
					color: #666;
					overflow: hidden;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
					i {
						vertical-align: text-bottom;
					}
					.el-icon-d-arrow-right {
						vertical-align: text-bottom;
						margin-right: 0px;
					}
					.golive {
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
					}
					.icon-live {
						display: inline-block;
						width: 16px;
						height: 17px;
						background: url("../../assets/img/liveIcon/icon-live.png") center center no-repeat;
						background-size: 100% 100%;
						vertical-align: text-bottom;
						margin-right: 0;
					}
				}
				.subjoin {
					width: 368px;
    				padding-left: 40px;
					height: 85px;
					background: url("@{img}/icon-line.png") center left no-repeat;
					text-align: center;
					a {
						display: inline-block;
						width: 23%;
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
				.subjoin2{
						width: 82px;
						background: #fff;
						height: 82px;
						text-align: center;
						float:right!important;
						a{
							display: inline-block;
							width: 100%;
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
			.selectclazz{
				overflow: hidden;
				.selectclazz_top{
					overflow: hidden;
					padding: 0 60px 15px;
					box-shadow: 0 5px 13px -6px rgba(0,0,0,0.16);

					h1{
						display: inline-block;
						width: 570px;
						font-size: 20px;
						font-weight: 500;
						color: #666;
						line-height: 1em;
						padding-left: 10px;
						line-height: 56px;
					}
					.el-dropdown{
						margin-top: -56px;
						float: right;
						line-height: 56px;
					}
					.select_cen{

						overflow: hidden;
						p{
							
							font-size: 16px;
							color: #666666;
							line-height: 1.5em;
							
						}
						
						.take-desc {
							color: #666;
							span {
								width: 90%;
								display: inline-block;
								vertical-align: top;

							}
						}
					}					
				}
				.details2{
						// width: 764px;
						margin:0 60px;
						zoom:1;
						border-bottom: 1px solid #dddddd;

						&:last-child {
							border-bottom: 0;
						}
						.h1font{
								display: inline-block;
								width: 625px;
								font-size: 20px;
								font-weight: 600;
								color: #000;
								line-height: 22px;
								line-height: 56px;	
								cursor: pointer;
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
								&:hover {
									color: #1077d7;
								}
						}
						.el-dropdown{
							margin-right: 28px;
							float: right;
							line-height: 56px;
						}
						.desc{
							width: 700px;
							float: left;
							.row-two{
								width: 500px;
							}
							.address{
								width: 482px;
								font-size: 16px;
								color: #666;
								float: left;
								white-space: nowrap;
								text-overflow: ellipsis;
								overflow: hidden;
							}
							.progress{
								font-size: 16px;
								color: #666666;
								float: left;
								width: 140px;
								margin-left: 60px;
								span{
									color: #57A2FF!important;
								}
							}
						}
				}
			}
		}
	}
}
.blue {
	color: #7DB7FF;
}

</style>

