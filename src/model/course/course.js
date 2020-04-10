import API from '@/global/resource'
import http from '@/global/request'

export default {
	systemDate (callback) {
		http.get(API.urls.systemDate, null, 'h2', callback)
	},

	getCourseList (data,callback) {
		http.get(API.urls.getCourseList, data, 'h2', callback)
	},

	getItemTaskList (data, callback) {
		http.get(API.urls.itemTaskList, data, 'h2', callback)
	},
	// 专家课程列表
	myCourseList (data, callback) {
		http.get(API.urls.myCourseList, data, 'h2', callback)
	},

	getCourseDetails (data, callback) {
		http.get(API.urls.courseDetails, data, 'h2', callback)
	},

	delCourse (data, callback) {
		http.post(API.urls.courseDelete, data, 'h2', callback)
	},

	// 课程内容详情
	getCourseFindOne (data, callback) {
		http.get(API.urls.courseFindOne, data, 'h2', callback)
	},

	createCourse(data, callback) {
		http.post(API.urls.courseCreate, data, 'h2', callback)
	},

	courseSubjectList(data, callback) {
		http.get(API.urls.courseSubjectList, data, 'h2', callback)
	},

	updateCourse(data, callback) {
		http.post(API.urls.courseUpdate, data, 'h2', callback)
	},

	// 选择铸主讲人
	getCourseProfessor(data, callback) {
		http.get(API.urls.courseProfessor, data, 'h2', callback)
	},

  //项目任务-设置起止时间设置
  courseTimeSet(data, callback){
    http.post(API.urls.courseTimeSet, data, 'h2', callback)
  },

  //项目任务-设置起止时间设置 -- 编辑
  courseGetActivityDetail(data, callback){
    http.get(API.urls.courseGetActivityDetail, data, 'h2', callback)
  },

	// 删除课程下活动
	delCourseAct(data, callback) {
		http.post(API.urls.courseDelAct, data, 'h2', callback)
	},

	// 添加关联课程资源
	resRelateCourse(data, callback) {
		http.post(API.urls.resRelateCourse, data, 'h2', callback)
	},

	// 删除课程关联资源
	resDelCourse(data, callback) {
		http.post(API.urls.resDelCourse, data, 'h2', callback)
	},

	// 课程资源列表
	resListCourse(data, callback) {
		http.get(API.urls.resListCourse, data, 'h2', callback)
	},

	// 班级内导入课程
	courseImport(data, callback) {
		http.post(API.urls.courseImport, data, 'file', callback, 'file')
	},

	//编辑选修课科目
	courseElectiveItemUpdate(data,callback){
		http.post(API.urls.courseElectiveItemUpdate, data, 'h2', callback)
	},
	
	//获取选修课主体信息
	findCourseElective(data,callback){
		http.get(API.urls.findCourseElective, data, 'h2', callback)
	},
 
	//编辑选修课主体信息
	courseElectiveUpdate(data,callback){
		http.jsonPost(API.urls.courseElectiveUpdate, data, callback)
	},

	//添加选修课科目 courseElectiveItemSave
	courseElectiveItemSave(data,callback){
		http.post(API.urls.courseElectiveItemSave, data, 'h2', callback)
	},
	// 班级内创建选修课
	courseElectiveSave(data, callback) {
		http.jsonPost(API.urls.courseElectiveSave, data, callback)
	},
	//v360获得班级下所有课程
	getcourseListv360(data,callback){
		http.get(API.urls.courseListv360, data, 'h2', callback)
	},

	// 删除单独选修课
	delElectiveCourse(data, callback) {
		http.post(API.urls.courseElectiveDel, data, 'h2', callback)
	},
	//获取班级的项目活动
	getcoursedefault(data,callback){
		http.get(API.urls.coursedefault, data, 'h2', callback)
	},
	//获取班级的项目活动
	recordingView(data,callback){
		http.post(API.urls.recordingView, data, 'h2', callback)
	},
	//获取录制回放视频的查看学员列表
	recordingUser(data,callback){
		http.get(API.urls.recordingUser, data, 'h2', callback)
	}
}
