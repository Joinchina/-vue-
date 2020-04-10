<template>
<div id="wcourseAll">
	<!-- 项目任务-->
	<div class="objectcurrent"
		v-loading="loading2"
	    :element-loading-text="$globalParam.loadText"
	    :element-loading-spinner="$globalParam.loadSpinner"
	    element-loading-background="#f7f7f7"
	>
		<div class="obgleft">
			<img src="../../assets/img/icon/367.png" alt="">
			<h1>项目任务</h1>
			<h2>{{allcourse.activityCount}}个活动</h2>
		</div>
		<div class="obgrig">
			<ul>
				<li @click="evaluation"><i class="icon-speak"></i><h1>评价</h1></li>
				<li @click="reflection"><i class="icon-introspection"></i><h1>反思</h1></li>
				<li @click="Thelog"><i class="icon-message"></i><h1>日志</h1></li>
				<li @click="photo"><i class="icon-wonderful"></i><h1>精彩瞬间</h1></li>
				<li @click="classgroup"><i class="icon-clazz"></i><h1>班级群</h1></li>
				<li @click="more"><i class="icon-bigmore"></i><h1>更多</h1></li>
			</ul>
		</div>
	</div>


	<div class="allloading"
	    v-loading="loading"
	    :element-loading-text="$globalParam.loadText"
	    :element-loading-spinner="$globalParam.loadSpinner"
	    element-loading-background="#f7f7f7"		
	>
		<!-- 空页面 -->
		<div class="nodate" v-if="emptyFlag">
			<empty
			:tip="tip"
			>
			</empty>
			<div class="btn">
				<el-dropdown class="more" trigger="click" placement="bottom-start">

					<span class="el-dropdown-link">
						<i class="icon-circle-add"></i>
						创建课程
					</span>
					<el-dropdown-menu class="more-menu" slot="dropdown">
						<el-dropdown-item @click.native.stop="addCourse1 = true">
							
							单日课程
						</el-dropdown-item>
						<el-dropdown-item  @click.native.stop="addCourse2 = true">
							
							跨天课程
						</el-dropdown-item>
						<el-dropdown-item  @click.native.stop="createTake">
							<img src="../../assets/img/expert/vipLogo.png" class="vipExportLogo">
							选修课
						</el-dropdown-item>
						<el-dropdown-item @click.native.stop="liveCourseFn('create')">
							
							直播课
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				
				<el-button type="primary" @click="importCourse = true">
					<i class="icon-importtt"></i>
					导入课程
				</el-button>

			</div>
		</div>
		<!-- 日期选择组件 -->
		<div class="coursebox" v-else>
			<div class="box_left">
				<el-button type="primary" @click="importCourse = true">
					<i class="icon-importtt"></i>
					导入课程
				</el-button>
				<timeDate
				v-on:choseDay="clickDay"
				:markDate=dataArr
				:setdate=setdate
				v-if="setdate.length>0"
				>
				</timeDate>
			</div>
			<div class="box_right">
				<div class="right_top">
					<span class="liveTimeLeave"  @click="toAccountCenter">直播课剩余：<em :class="{attention:(liveCourseTime<7201)}">{{liveCourseTime}}</em></span>
					<el-dropdown class="more" trigger="click" placement="bottom-start">
						<span class="el-dropdown-link">
							<i class="icon-circle-add"></i>
							创建课程
						</span>
						<el-dropdown-menu class="more-menu" slot="dropdown">
							<el-dropdown-item @click.native.stop="addCourse1 = true">
								
								单日课程
							</el-dropdown-item>
							<el-dropdown-item  @click.native.stop="addCourse2 = true">
								
								跨天课程
							</el-dropdown-item>
							<el-dropdown-item  @click.native.stop="createTake">
								<img src="../../assets/img/expert/vipLogo.png" class="vipExportLogo">
								选修课
							</el-dropdown-item>
							<el-dropdown-item @click.native.stop="liveCourseFn('create')">
								
								直播课
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<div class="search" @click="search">
						
						<i class="icon-search-white"></i>
						搜索

					</div>
									
				</div>
				<!-- 课程信息<i class="icon-course-days"></i> -->
				<div class="timer load-minheight" v-show="!days_no">
					<dl v-for="(date,index) in choosedate" :key="index">
						<dt>
							<i class="danri" v-if="date.type=='SINGLE'"></i>
							<i class="kuatian" v-else-if="date.type=='MULTI'"></i>
							<i class="icon-live-course" v-else-if="date.type == 'LIVE'"></i>
							<i class="xuan" v-else></i>
							<span class="classtitle">{{date.beginTime}}-{{date.endTime}}</span>
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
												<i class="el-icon-tickets"></i>
												{{date.subjectTypeName}}
											</span>
											<span>
												<i class="icon-user"></i>专家：
												{{date.mainTeacherName}}
											</span>
										</p>
										<p class="row-one">
											<i class="icon-address"></i>
											上课地点：<span v-show="!date.location">无</span><el-popover
												placement="bottom"
												width="200"
												trigger="hover"
												:content="date.location">
												<span slot="reference">{{date.location}}</span>
											</el-popover>
											
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
							<!-- 直播课 -->
							<section class="course-box" v-if="date.type=='LIVE'">
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
											<el-dropdown-item @click.native.stop="liveCourseFn('edit',date.id,date.type) ">
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
								<div class="details clearfix" @click.stop="routerlink(date.id)">
									<div class="desc">
										<p class="row-two">
											
											<span>
												<i class="icon-user"></i>主讲人：
												{{date.mainTeacherName}}
											</span>
										</p>
										<p class="row-one">
											<span class="golive" @click.stop="golive(date.id,'host')" v-if="curUserId == date.mainTeacherId">
												<i class="icon-live"></i> 去直播 <i class="el-icon-d-arrow-right"></i>
											</span>
											<span  class="golive" @click.stop="golive(date.id,'atten')" v-else-if="date.liveStatus == 'LIVING' && curRole != 'ADMIN' && curRole != 'PROFESSOR'">
												进入直播间
											</span>
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
							<section class="course-box" v-if="date.type=='ELECTIVE'">
								<div class="selectclazz">
									<div class="selectclazz_top">
										<h1>选修课<span>(选修课开放时间{{date.openBeginTime}}  — {{date.openEndTime}} )</span><span class="jindu">选课进度： {{date | selsectj}}%</span></h1>
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
										<div class="select_cen">
											<p >
												<span>选课说明</span>：{{date.description}} 												
											</p>											
										</div>
									</div>
									
									<div class="details2 clearfix"  v-for="(item,index) in date.courseVoList" :key="index">
											<div class="h1font" @click="routerlink(item.id)">{{index+1}}. {{item.name}}</div>
											<el-dropdown class="more" trigger="click" placement="bottom-start">
												<span class="el-dropdown-link">
													<i class="el-icon-more"></i>
												</span>
												<el-dropdown-menu class="more-menu" slot="dropdown">
													<el-dropdown-item @click.native.stop="handleEditChild(item.id, date.id,item.selectCount,index)">
														<i class="icon-edit2"></i>
														编辑
													</el-dropdown-item>
													<el-dropdown-item  @click.native.stop="handleDel(item.id)">
														<i class="el-icon-delete2"></i>
														删除
													</el-dropdown-item>
												</el-dropdown-menu>
											</el-dropdown>										

										<div class="desc"  @click="routerlink(item.id)">
											<p class="row-two">
												<span>
													<i class="el-icon-tickets"></i>
													{{item.subjectTypeName}}
												</span>
												<span>
													<i class="icon-user"></i>专家：
													{{item.mainTeacherName}}
												</span>
											</p>
											<div class="address">
													<i class="icon-address"></i>
													上课地点：<span v-show="!item.location">无</span><el-popover
														placement="bottom"
														width="200"
														trigger="hover"
														:content="item.location">
														<span slot="reference">{{item.location}}</span>
													</el-popover>
													
											</div>
											<div class="progress">
												选课进度：<span>{{item.selectCount}}</span>/{{item.upperLimit}}
											</div>	
												
										</div>
										<div class="subjoin2">										
											<a @click.stop="toliuyan(item.id)">
												<i class="icon-message"></i>
												留言板
											</a>										
										</div>
									</div>
									<el-button type="primary" v-if="date.courseVoList.length < 20" @click.native.stop="handleEditChild(null, date.id,null,null,true)">
										<i class="icon-circle-add2"></i>
										选修课
									</el-button>
								</div>
							</section>

							
						</dd>
					</dl>
				</div>
				<!-- 没课程的时候显示没有 -->
				<div class="days_no" v-show="days_no">
					<empty
					:tip="tip2"
					>
					</empty>
				</div>
			</div>
		</div>
	</div>
	<!-- 创建选修课 -->
	<createTakeCourse
		:dialogTakeCourse.sync = "addtakecourse"
		:clazzId = "clazzId"
		@updateList="getclazzlist"
		>
	</createTakeCourse>
	<router-view></router-view>
	<editElectiveBasic
		:visibleFlag.sync="editCourseBasic"
		:electiveCourseId="electiveCourseId"
		@updateElectiveList="getclazzlist"></editElectiveBasic>

	<editElectiveChild
		:visibleFlag.sync="editCourseChild"
		:clazzId="clazzId"
		:courseId="childCourseId"
		:electiveId = electiveCourseId
		:addFlag = childAddFlag
		:selectCount = childSelectCount
		:childcourseCount = childCourseCount
		@updateElectiveList="getclazzlist"></editElectiveChild>

	<!-- 创建单日课程 -->
	<create-course
		:dialogAddCourse.sync="addCourse1"
		:clazzId="clazzId"
		type="SINGLE"
		@updateCourseList="getclazzlist"
		></create-course>
	<!-- 创建跨天课程 -->
	<create-course
		:dialogAddCourse.sync="addCourse2"
		:clazzId="clazzId"
		type="MULTI"
		@updateCourseList="getclazzlist"
		
		></create-course>
	<!-- 编辑单日课程 -->
	<edit-course
		:dialogEditCourse.sync="editCourse"
		:clazzId="clazzId"
		:courseId="editCourseId"
		@updateCourseList="getclazzlist"></edit-course>
	<!-- 编辑跨天课程 -->
	<edit-course2
		:dialogEditCourse.sync="editCourse2"
		:clazzId="clazzId"
		:courseId="editCourseId"
		@updateCourseList="getclazzlist"></edit-course2>
	
	<!-- 创建直播课 -->
	<live-course
		:dialogLiveCourse.sync="addliveCourse"
		:clazzId="clazzId"
		:courseId = "editCourseId"
		type="LIVE"
		:genre="liveGenre"
		@updateCourseList="getclazzlist"
		></live-course>

	<!-- 导入课程 -->
	<course-import
		:dialogImportCourse.sync="importCourse"
		:clazzId="clazzId"
		@updateList="getclazzlist"></course-import>
	<!-- 直播时长不够 -->
	<overLimitPop 
		:overLimitDialog.sync = "overLimit" 
		:text = "'该机构直播时长已用尽，无法开启课程直播'" 
		:footerText = "'增加直播课时长'" 
		:param="'liveTime'"></overLimitPop>
</div>

</template>
<script>
  import model from "model/course/course.js"
  import live from 'model/live/live'
  import storage from '@/global/storage'
  import timeDate from 'base/timedate/timedate.vue';
  import editElectiveBasic from "components/course/edit_elective_basic"
  import editElectiveChild from "components/course/deal_elective_course"

  	import { delTip } from '@/global/open'
	import createCourse from 'components/course/create_course'
  	import editCourse from 'components/course/edit_course'
  	import editCourse2 from 'components/course/edit_course2'
  	import createTakeCourse from 'components/course/create_takecourse'
  	import liveCourse from 'components/course/live_course_pop'
  	import courseImport from 'components/course/course_import'

  	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'

	import Empty from 'base/empty/empty'

	import { getCurRole, getCurUserId } from '@/filters/userVerify'

	import overLimitPop from "@/base/overLimitPop/index"
	import httpRequest from '@/model/orgAccount/index'

	export default {
		data () {
			return {
				courseList:[],//接口返回的数据
				dateList:[],//根据日期拍好的数据
				newdate:[],	//遍历出来的所有数据			
				keyword:"",
				currDay: "",
				options: [{
					value: "course",
					label: "课程"
				}, {
					value: "teacher",
					label: "专家"
				}],
				value: "course",
				addCourse1: false,
				addCourse2: false,
				editCourse: false,
				editCourse2: false,
				overLimit : false , 
				editCourseId: "",
				crumb:"",
				importCourse: false,
				//更新
				dataArr:[],//'2018/11/12','2018/11/18'用于设置日期下的点指示当前日期下有课
				setdate:'',//2018/11/19用于设置默认显示的日期
				choosedate:[], //选择日期下的课程
				editCourseBasic:false,  //选修课主体显隐flag
				editCourseChild:false,  //选修课子课程显隐flag
				electiveCourseId: "",  //选修课主体id
				childCourseId: '', //子选修课id
				childAddFlag: "",  //添加子选修标识
				childSelectCount: 0, //选修课进度
				childCourseCount: 0, //选修课索引

				addtakecourse: false,	// 创建选修课
				tip: '班级内还没有创建任何课程额~',
				tip2: '当前日期下没有课程额~',
				emptyFlag:true,
				loading:true,
				loading2:true,
				allcourse:'',
				oldcourse:{},
				havework:false,
				submitdatetime:'',
				days_no:false,

				addliveCourse: false,	// 直播课
				liveGenre: 'create',	// 直播课弹出框类型
				curRole: getCurRole(),
				curUserId: getCurUserId(),
				vipInfo:{},
				liveCourseTime:"",
				canCreatTake : false,
			}
		},
		beforeRouteEnter (to, from, next) {
		    next(vm => {
		        if(vm.role == 'PROFESSOR') {
		          	vm.$router.push({path: '/course/experts', query: { clazzId: vm.clazzId}});
		        }
		    })
		},
		filters: {
			selsectj(val){
				// console.log(val.courseVoList)
				if(val.courseVoList){
					let file=val.courseVoList;
					let end=[];
					let all=[];
					let en=0;
					let al=0;
					for (let i = 0; i < file.length; i++) {
						end.push(file[i].selectCount)
						all.push(file[i].upperLimit)
					};
					for (let j = 0; j < end.length; j++) {
						en+=end[j];
						al+=all[j]
					}					
					return Math.floor((en/al)*100)
				}
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
		created() {			
			this.getclazzlist();
			this.getcourseactive();
			this.getVipInfo();
		},		
		mounted(){
		},	
		methods: {
			golive(courseId,host) {
				if(host){
					// 如果直播课剩余时长不足，则不允许上课
					if(this.liveCourseTime<1 && host == "host"){
						this.overLimit = true;
						return 
					}
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
							// window.open(href, 'live');
						}else{
							newWindow.close();
							this.$message.error(res.message);
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
			handleEdit(courseId,type) {
				this.editCourseId = courseId;
				
			},
			// 添加直播课
			liveCourseFn(genre,courseId, type ) {

				this.addliveCourse = true;
				this.liveGenre = genre;

				if(courseId) {
					this.editCourseId = courseId;
				}
				
				console.log("直播课弹出框 ", this.dialogLiveCourse, genre);

			},
			// 添加单日课程
			addCoursedan() {
				this.addCourse1 = true;

			},
			//获取班级下的活动
			getcourseactive(){
				let data={
					clazzId:this.clazzId
				}
				model.getcoursedefault(data,(res=>{
					if(res.status==200){
						// console.log("123",res.data);
						this.allcourse=res.data
						this.getTaskList()
					}
				}))
			},
			getTaskList() {
				let data = {
					clazzId: this.clazzId,
				}
				// console.log("data", data);
				model.getItemTaskList(data, ( res => {
					// console.log("getItemTaskList",res);
					if(res.status == 200) {
						//  console.log("222",res.data)
						res.data.forEach(val=>{
							if (val.type=='INTROSPECTION') {
								//反思
								this.oldcourse.INTROSPECTION=val.id;
							}else if(val.type=='EVALUATION'){
								//评价
								this.oldcourse.EVALUATION=val.id;
							}
						});
						this.loading2=false;
					} else {
						this.loading2=false;					
						this.$message.error(res.message);
					}
				}));
			},
			//处理旧接口的信息

			//获取课程信息
			getclazzlist(res){
				let data={
					clazzId:this.clazzId,
					keyword:'',
					type:'',
				};
				console.log(res)
				this.submitdatetime='';
				if(res!=undefined){
					this.submitdatetime=res.replace(/-/g,'/');
				}				
				model.getcourseListv360(data,(res)=>{
					console.log("全部课程", res);
					this.vipInfo = this.$store.getters.getOrgVipInfo;
					let allTime = this.vipInfo.liveTime ? this.vipInfo.liveTime : 0;
					let useTime = this.vipInfo.useLiveTime ? this.vipInfo.useLiveTime : 0;
					if(Number(allTime)>Number(useTime)){
						this.liveCourseTime = this.formatSeconds(allTime - useTime);
					}else {
						this.liveCourseTime = 0;
					}
					if(res.status==200){						
						if(res.data.length>0){
							this.emptyFlag=false;
							this.acrossdays(res.data);
						}else{
							this.emptyFlag=true;
						}	
						this.loading=false;
																	
					} else {
						this.emptyFlag=false;
						this.loading=false;
					
						this.$message.error(res.message);
					}
				})
			},
			//处理跨天课程，如果是跨天课程则计算出所有的天数，并且将数据添加到每个天数下面
			acrossdays(res){
				//console.log(res);
				this.newdate=[];
				this.courseList=[];
				this.dateList=[];
				this.choosedate=[];
				res.forEach(val=>{
					if(val.type=='MULTI'){
						this.acrossalldays(val)
					}else{
						this.courseList.push(val);
					}
				});
				this.addconcat(this.newdate);

			},
			//计算跨天课程下所有的天数
			acrossalldays(res){
				// console.log(res)
				let adddate=[];
				function getDate(datestr){
					var date = new Date(datestr);
					return date;
				};
				var start = res.courseDateForCheck;
				var end = res.multiCourseEndDateForCheck;
				var startTime = getDate(start);
				var endTime = getDate(end);
				// console.log(startTime)
				// console.log(endTime)
				while((endTime.getTime()-startTime.getTime())>=0){
					var year = startTime.getFullYear();
					var month = (startTime.getMonth()+1).toString().length==1?"0"+(startTime.getMonth()+1).toString():(startTime.getMonth()+1);
					var day = startTime.getDate().toString().length==1?"0"+startTime.getDate():startTime.getDate();
					startTime.setDate(startTime.getDate()+1);
					if(month=='00'){
						month=12;
						year=year-1;
					}
					let newdays=year+"/"+month+"/"+day;					
					// console.log(newdays)
					adddate.push(newdays);	
				};
				this.addobjectdays(res,adddate)				
			},
			addobjectdays(res,day){
				let newdays=[];
				for (let i = 0; i < day.length; i++) {
						let newres=Object.assign({},res);
						newdays.push(newres);							
				};
				for(let t=0;t<day.length;t++){					
					newdays[t].courseDateForCheck = day[t];
				}
				this.newdate.push(newdays)							
				// console.log("重新生成后的数据",newdays);							
			},
			//数组合并
			addconcat(res){
				// console.log(res)
				res.forEach(val=>{
					val.forEach(obj=>{
						// console.log(obj);
						this.courseList.push(obj)
					})
				});
				// console.log(this.courseList)								
				this.dateArr(this.courseList)
			},
			dateArr(arr) {
				
				let res = [], obj = {}, index = 0;
				arr.forEach(val => {
					if(obj.hasOwnProperty(val.courseDateForCheck)) {
						res[obj[val.courseDateForCheck]].item.push(val);
					} else {
						obj[val.courseDateForCheck] = index ++;
						res.push({
							courseDateForCheck:val.courseDateForCheck,
							item: [val]
						});
						
					}
				});
				this.dateList = res;
				this.datespot(res)	
				// console.log('相同天数添加到一块',this.dateList)			
			},
			//在日期下匹配...
			datespot(res){
				let spotArr=[];
				res.forEach(val=>{
					if(val.courseDateForCheck){
						spotArr.push(val.courseDateForCheck)
					}	
				});
				this.dataArr=spotArr;
				// console.log(spotArr)
				if (this.submitdatetime=='') {
					this.getdatetime(res)	
				}else{
					this.clickDay(this.submitdatetime)
				}				
															
			},
			//就近匹配日期
			getdatetime(res){
				// console.log(this.dateList)
				//获取当前时间的时间戳				
				let bigtimedate=[];//大于上千日期的数据
				let smalltimedate=[];//小鱼当前日期的数据
				let nowtimedate=[];
				let nowtime=new Date();
				nowtime=nowtime.getFullYear()+'/'+(nowtime.getMonth()+1)+'/'+nowtime.getDate()
				nowtime=Date.parse(new Date(nowtime))
				res.forEach(val=>{
					if(val.courseDateForCheck){
						if(nowtime<Date.parse(new Date(val.courseDateForCheck))){
							bigtimedate.push(val)
						}else if(nowtime==Date.parse(new Date(val.courseDateForCheck))){
							nowtimedate.push(val)
						}else{
							smalltimedate.push(val)
						}
					}
				});
				//就近匹配当前的课程
				let bigdate='';
				let big=[];
				let smalldate='';
				let small=[];
				if(nowtimedate.length>0){
					if(storage.session.get('当前班级'+this.clazzId)!=undefined){
						this.clickDay(storage.session.get('当前班级'+this.clazzId))
					}else{
						this.datesort(nowtimedate[0].item)
						this.setdate=this.getDate(Date.parse(new Date(nowtimedate[0].courseDateForCheck)));
						storage.session.set('当前班级'+this.clazzId,this.setdate);
					}
					console.log("今天课程")
				}else{
					if(bigtimedate.length>0){
						
						this.datemonthsort(bigtimedate);
						// console.log(bigtimedate)
						if(storage.session.get('当前班级'+this.clazzId)!=undefined){
							this.clickDay(storage.session.get('当前班级'+this.clazzId))
						}else{
							this.datesort(bigtimedate[0].item)
							this.setdate=this.getDate(Date.parse(new Date(bigtimedate[0].courseDateForCheck)));
							storage.session.set('当前班级'+this.clazzId,this.setdate);
						}						
					}else{
						
						this.datemonthsort(smalltimedate);
						console.log(smalltimedate)
						if(storage.session.get('当前班级'+this.clazzId)!=undefined){
							this.clickDay(storage.session.get('当前班级'+this.clazzId))
							console.log(123)
						}else{
							this.setdate=this.getDate(Date.parse(new Date(smalltimedate[smalltimedate.length-1].courseDateForCheck)));
							this.datesort(smalltimedate[smalltimedate.length-1].item)
							storage.session.set('当前班级'+this.clazzId,this.setdate);
							console.log(567)
						}															
					};
				}
			},
			//选中某天
			clickDay(data) {
				let clazzId=this.clazzId;
				console.log(data)
				this.setdate=data;							
				storage.session.set('当前班级'+clazzId,data);								
				//过滤所有的课程
				let havework=[];			
				this.dateList.forEach(element => {
					if(Date.parse(new Date(data))==Date.parse(new Date(element.courseDateForCheck))){												
						havework.push(element.item)					
					}
				});
				if(havework.length!=0){
					this.datesort(havework[0]);
					this.days_no=false;
					havework=[];
				}else{
					this.choosedate=[];
					this.days_no=true;
				};					
			},		
			//对选中的课程进行排序
			datesort(res){			 
				var rows = res;
				rows.sort((a,b)=>{
					return this.time_to_min(a.beginTime) - this.time_to_min(b.beginTime);//时间正序
				});
				this.choosedate=rows;							
			},
			//对月份进行排序
			datemonthsort(res){
				var rows = res;
				rows.sort((a,b)=>{
					return Date.parse(new Date(a.courseDateForCheck)) - Date.parse(new Date(b.courseDateForCheck));//时间正序
				});
				return rows
			},
			//格式化初始时间
			time_to_min(time) {
				var s = '';
				var hour = time.split(':')[0];
				var min = time.split(':')[1];
				s = Number(hour*3600) + Number(min*60) ;
				return s;
			},						
			//点击课程跳转
			routerlink(res){
				// console.log(res)
				this.$router.push({ 
					path: '/course/detail',
					query: {clazzId:this.clazzId, courseId: res}
				})				
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
			//点击编辑函数
			handleEditBasic(id,type){
				if(type =="ELECTIVE"){
					this.electiveCourseId = id;
					this.editCourseBasic = true;
				}
			},
			//编辑子选修课函数
			handleEditChild(childid,electiveCourseId,selectCount,index,addFlag){
				console.log("第几", index);
				this.childCourseId = childid;
				this.childSelectCount = selectCount;
				this.childAddFlag = addFlag?true:false;
				this.electiveCourseId = electiveCourseId;
				this.childCourseCount = index+1;
				this.editCourseChild = true;
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
			               _this.getclazzlist();
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
			               _this.getclazzlist();
			              }
			            });
					} else {
						this.$message.error(res.message);
					}
				}));
			},

			handleExp(courseId) {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				window.open(API.urls.courseElectiveExp+"?electiveId="+courseId+"&token="+getToken());
			},

			//搜索跳转
			search(){
				this.$router.push({
					path:'/course/search',
					query: {clazzId:this.clazzId}
				})
			},
			//点击班级跳转
			evaluation(){
				this.$router.push({
					path:'/activity/evaluation/result?clazzId='+this.clazzId+'&activityId='+this.oldcourse.EVALUATION+'&crumb=task'
				})
			},
			reflection(){
				this.$router.push({
					path:'/activity/introspection/result?clazzId='+this.clazzId+'&activityId='+this.oldcourse.INTROSPECTION+'&crumb=task'
				})
			},
			Thelog(){
				this.$router.push({
					path:'/clazz/dailyrecord/list?clazzId='+this.clazzId+''
				})
			},
			photo(){
				this.$router.push({
					path:'/activity/photo/view?clazzId='+this.clazzId+'&courseId='+this.allcourse.id+'&activityId='+this.allcourse.defaultPhotoWallActivityId+'&crumb=task'
				})
			},
			classgroup(){
				this.$router.push({
					path:'/activity/discuss/result?clazzId='+this.clazzId+'&courseId='+this.allcourse.id+'&activityId='+this.allcourse.defaultDiscussActivityId+'&crumb=task'
				})
			},
			more(){
				this.$router.push({
					path:'/course/task?clazzId='+this.clazzId+''
				})
			},
			//时间戳转时间
			getDate(date){ 
			    var t = new Date(date);
			    var year=t.getFullYear();
				var month=t.getMonth()+1;
				var data=t.getDate(); 
				var time=t.getHours();
				var fen=t.getMinutes();
				var credata=year+'/'+month+'/'+data
			    return credata; 
			},

			// 格式化秒
             formatSeconds(value) {
                let secondTime = parseInt( value ); // 秒
                let minuteTime = 0; // 分
                let hourTime = 0; // 小时
                if(secondTime == NaN) return 0
                if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
                    //获取分钟，除以60取整数，得到整数分钟
                    minuteTime = parseInt( secondTime / 60 );
                    //获取秒数，秒数取佘，得到整数秒数
                    secondTime = parseInt( secondTime % 60 );
                    //如果分钟大于60，将分钟转换成小时
                    if(minuteTime > 60) {
                        //获取小时，获取分钟除以60，得到整数小时
                        hourTime = parseInt( minuteTime / 60 );
                        //获取小时后取佘的分，获取分钟除以60取佘的分
                        minuteTime = parseInt( minuteTime % 60 );
                    }
                }
                let result = secondTime!=0?(secondTime + "秒"):"";
    
                if( minuteTime > 0 ) {
                    result = minuteTime + "分" + result;
                }
                if( hourTime > 0 ) {
                    result = hourTime + "小时" + result;
                }
                return result;
			},
			
			createTake(){
				if(!this.canCreatTake){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				this.addtakecourse = true
			},

			toAccountCenter(){
				this.$router.push({path: "/orgAccount/index",query:{clazzId: this.clazzId}})
			},

			getVipInfo(){
				let data = {}
				let orgId = !!this.$route.query.orgId ? this.$route.query.orgId : localStorage.orgId ? JSON.parse(localStorage.orgId).identification : '';
				let clazzId = !!this.$route.query.clazzId ? this.$route.query.clazzId : '';
				if(Boolean(orgId)){
					data.orgId = orgId;
				}else if(Boolean(clazzId)){
					data.clazzId = clazzId;
				}else{
					return
				}
				httpRequest.getAccountInfo(data,(res)=>{
					if(res.status==200){
						this.canCreatTake = res.data.vip;
					}else{
						// this.$message.error(res.message);
						if(JSON.parse(localStorage.exp_role).data == "ADMIN"){
							store.state.orgVipInfo = {vip: true}
						}
					}
				})
			}
		},
		components: {
			timeDate,
			editElectiveBasic,
			editElectiveChild,
			createTakeCourse,
			createCourse,
			editCourse,
			editCourse2,
			courseImport,
			Empty,
			liveCourse,
			overLimitPop

		}
	}
</script>
<style scoped="" lang="less">
@import "../../assets/less/icon.less";
@import "../../assets/less/btn-search.less";
@img: "../../assets/img/icon";
#wcourseAll {
	widows: 100%;
	overflow: hidden;	
	.objectcurrent{
		background: #FFFFFF;
		border-radius: 4px;
		width: 100%;
		height: 120px;
		.obgleft{
			float: left;
			img{
				float: left;
				width: 51px;
				height: 51px;
				margin: 35px 0 0 51px;
			}
			h1{
				float: left;
				font-size: 20px;
				color: #333333;
				margin: 35px 0 0 18px;
			}
			h2{
				font-size: 16px;
				color: #181818;
				margin: 57px 0 0 119px;
			}
		}
		.obgrig{
			float: right;
			overflow: hidden;
			ul{
				float: left;
				overflow: hidden;
				margin-top: 42px;
				li{
					float: left;
					width: 70px;
					margin-right: 40px;
					cursor: pointer;
					i{
						margin-left: 24px;
					}
					h1{
						width: 100%;
						font-size: 16px;
						color: #999999;
						text-align: center;
					}
				}
			}
		}
	}
	.nodate{
		width: 100%;
		height: 500px;;
		margin-top: 20px;
		.btn{
			width: 100%;
			margin-top: -96px;
			overflow: hidden;
			.el-dropdown{					
					width: 122px;
					height: 39px;
					border-radius: 6px;
					font-size: 16px;
					color: #FFFFFF;
					margin:0 auto;
					float: left;
					margin-left: 467px;
					background-color: #409EFF;
					border-color: #409EFF;
					cursor: pointer;
					span{
						line-height: 39px;
					}
					i{
						vertical-align: text-bottom;
						margin-left: 17px;
					}
			}
			.el-dropdown:hover{
				background: #66b1ff;
    			border-color: #66b1ff;
			}
			.el-button--primary{
				width:122px;
				height: 39px;
				border-radius: 6px;
				font-size: 16px;
				color: #FFFFFF;
				display: block;
				float: left;
				margin-left: 20px;
				padding: 0;
				i{
					vertical-align: text-bottom;
				}
			}

		}
	}
	.coursebox{
		width: 100%;
		overflow: hidden;
		margin-top: 20px;
		.box_left{
			width: 263px;
			overflow: hidden;
			float: left;
			background-color: #ffffff;
			padding: 10px 0;
			.el-button--primary{
				width: 206px;
				height: 43px;
				border-radius: 4px;
				font-size: 18px;
				color: #FFFFFF;
				display: block;
				margin:0 auto;
				i{
					vertical-align: text-bottom;
				}
			}
		}
		.box_right{
			width: 927px;
			float: left;
			overflow: hidden;
			.days_no{
				width: 100%;
				padding: 30px 30px;
			}
			.right_top{
				width: 100%;
				overflow: hidden;
				position: relative;
				.liveTimeLeave{
					cursor: pointer;
					position: absolute;
					right: 240px;
					top: 10px;
					font-size: 16px;
					color: #FD7E23;
					margin-left: 20px;
					.attention{
						color: #CC3300;
					}
				}
				.el-dropdown{					
					width: 122px;
					height: 39px;
					border-radius: 6px;
					font-size: 16px;
					color: #FFFFFF;
					margin:0 auto;
					float: left;
					margin-left: 705px;
					background-color: #409EFF;
					   border-color: #409EFF;
					cursor: pointer;
					span{
						display: block;
						line-height: 39px;
					}
					i{
						vertical-align: text-bottom;
						margin-left: 17px;
					}
				}
								
				.el-select{					
					width: 81px;
					height: 39px;
					float: left;
					margin-left: 20px;
				}
				.search{
					width: 80px;
					height: 39px;
					line-height: 39px;
					border-radius: 6px;
					font-size: 16px;
					color: #FFFFFF;
					margin:0 auto;
					float: left;
					margin-left: 20px;
					background-color: #409EFF;
					border-color: #409EFF;
					cursor: pointer;
					i{						
						color: #ffffff;
						width: 19px;
						height: 19px;
						border-left:none;
						float: left;
					    margin: 10px 0px 0 10px;
						background-color:#409EFF; 
						background-size: initial;
						vertical-align: text-bottom;

					}
				}
			}
			.timer {
				background-color: #f7f7f7;
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
				.xuan{
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
					color: #333;
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
					color: #999;
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
				.icon-edit2 {
					width: 14px;
					height: 14px;
					vertical-align: text-bottom;
					margin-left: 2px;
				}
				.el-icon-delete2 {
					font-size: 18px;
				}
				.el-icon-more {
				transform: rotate(90deg);
				-ms-transform: rotate(90deg);
				-moz-transform: rotate(90deg);
				-webkit-transform: rotate(90deg);
				-o-transform: rotate(90deg);
				color: #333;
				cursor: pointer;
				}
				dd {
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
				}
				.headline {
					height: 56px;
					line-height: 56px;
					width: 700px;
    				margin: 0 auto;
					border-bottom: 1px solid #e3e9ee;
				}
				.title,.title-days {
					display: inline-block;
					width: 480px;
					font-size: 20px;
					font-weight: 600;
					color: #000000;
					line-height: 56px;
  				    float:left;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
					&:hover {
						color: #1077d7;
					}
				}
				.title-days {
					border-left: 0 none;
					font-weight: 600;
					>.icon-course-days {
						vertical-align: text-bottom;
						margin-top: -2px;
						margin-left: -10px;
						margin-right: 5px;
					}
				}
				.rest {
					font-size: 16px;
					color: #666;
					margin-left: 40px;
				}
				.more {
					color: #999;
					float:right;
					
				}
				.desc {
					width: 364px;
   					margin: 25px 0 0px 60px;
					line-height: 1.5em;
					float: left;
					i {
						vertical-align: text-bottom;
						margin-right: 8px;
					}
				}
				.row-two {
					font-size: 16px;
					color: #666;
					margin-bottom: 15px;
					span {
						margin-right: 30px;
						font-size: 16px;
						color: #666666;
					}
				}
				.row-one {
					height: 46px;
					font-size: 16px;
					color: #666666;
					overflow: hidden;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
					i {
						vertical-align: text-top;
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
					width: 322px;
					height: 85px;
					float:right;
					margin: 20px 51px 0 0;
					background: url("@{img}/icon-line.png") center left no-repeat;
					text-align: center;
					a {
						display: inline-block;
						width: 23%;
						text-align: center;
						vertical-align: top;
						font-size: 16px;
						color: #666666;
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
						cursor: pointer;
						a{
							display: inline-block;
							width: 100%;
							text-align: center;
							vertical-align: top;
							font-size: 16px;
							color: #666666;
							padding-top: 10px;
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

					margin: 0 auto;
					padding: 0 58px;
					box-shadow: 0 5px 13px -6px rgba(0, 0, 0, 0.16);

					h1:hover{
						color: #409EFF!important;	
					}
					h1{
						display: inline-block;
						width:680px;
						font-size: 20px;
						font-weight: 600;
						color: #000000;
						line-height: 56px;
						span{
							font-size: 16px;
							color: #666666!important;
							font-weight: normal;
							margin-left: 20px;
						}
						.jindu{
							font-size: 16px;
							color: #57A2FF!important;
							font-weight: normal;
							margin-left: 40px;
						}
					}
					.el-dropdown{
						float: right;
						line-height: 56px;
					}
					.select_cen{
						overflow: hidden;
						margin-bottom:15px; 
						p{
							font-size: 16px;
							color: #666666;
							line-height: 22px;
							width: 100%;
							float: left;
							span{
								font-weight: 600;
								float: left;
							}							
						}
						span{
							float: right;
						}
					}					
				}
				.icon-circle-add2 {
					margin-right: 4px;
				}
				.el-button--primary{
					    width: 130px;
						height: 35px;
						border-radius: 4px;
						font-size: 16px;
						color: #FFFFFF;
						display: block;
						margin: 20px 58px;
						padding: 0;
						border: 1px solid #5CB7FF;
						border-radius: 4px;
						background-color: #fff;
						color: #409eff;						
					i{
						vertical-align: text-bottom;
					}
				}
				.details2{
						width: 700px;
						margin:0 auto;
						zoom:1;
						border-bottom: 1px solid #dddddd;
						.h1font{
								display: inline-block;
								width: 570px;
								font-weight: 600;
								font-size: 20px;
								color: #000000;
								line-height: 1em;
								line-height: 56px;	
						}
						.h1font:hover{
							color: #409eff;
						}
						.el-dropdown{
							float: right;
							line-height: 56px;
							margin-right: 28px;
						}
						.desc{
							width:590px;
							margin: 0;
							float: left;
							.row-two{
								width:450px;
							}
							.address{
								width: 410px;
								font-size: 16px;
								color: #666666;
								float: left;
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
							}
							.progress{
								font-size: 16px;
								color: #666666;
								float: right;
								width: 140px;
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
.el-dropdown-menu__item{
    .vipExportLogo{
      display: inline-block;
      width: 26px;
      height: 14px;
      vertical-align: middle;
      margin-right: 6px;
    }
  }
</style>

