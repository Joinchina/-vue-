import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 作业已提交人员
	getWorkCommitUser (data, callback) {
		http.get(API.urls.workCommitUser, data, 'h2', callback)
	},

	// 作业未提交人员
	getWorkUnCommitUser (data, callback) {
		http.get(API.urls.workUnCommitUser, data, 'h2', callback)
	},

	// 作业详情
	getWorkDetail(data, callback) {
		http.get(API.urls.workDetail, data, 'h2', callback)
	},
	// 作业大屏幕
	getWorkscreen(data, callback) {
		http.get(API.urls.workscreen, data, 'h2', callback)
	},	
  // 作业-学员提交的作业
  homeworkPage(data, callback) {
  	http.get(API.urls.homeworkPage, data, 'h2', callback)
  },
  //学员作业提交详情
  studentHomework(data, callback) {
    http.get(API.urls.studentHomework, data, 'h2', callback)
  },
  //学员作业-打分
  markScore(data, callback){
    http.post(API.urls.markScore, data, 'h2', callback)
  },
  //学员作业的评论
  commentHomework(data, callback) {
    http.get(API.urls.commentHomework, data, 'h2', callback)
  },
  //学员作业的评论 - 是否可以评论
  checkedPublishComment(data, callback) {
    http.get(API.urls.checkedPublishComment, data, 'h2', callback)
  },
  //学员作业的评论 -发表
  publishComment(data, callback) {
    http.post(API.urls.publishComment, data, 'h2', callback)
  },


	// 新建作业
	createWork(data, callback, fileArray,fileArray2) {
		http.post(API.urls.workCreate, data, 'file', callback,'file',fileArray,fileArray2)
	},

	// 编辑作业
	editWork(data, callback, fileArray,fileArray2) {
		http.post(API.urls.workEdit, data, 'file', callback, 'file', fileArray,fileArray2)
	},
	// 作业-统计信息
	workTotal(data, callback) {
		http.get(API.urls.workTotal, data, 'h2', callback)
	},


	// 获取课程下主讲人
	getMainProfessor(data, callback) {
		http.get(API.urls.courseMainProfessor, data, 'h2', callback)
	},

	// 作业列表
	getWorkList(data, callback) {
		http.get(API.urls.clazzHomeWorkList, data, 'h2', callback)
	},

	getAllWorkList(data, callback) {
		http.get(API.urls.clazzAllHomeWorkList, data, 'h2', callback)
	},
	//作业导出 -- 是否正在申请中
	getWorkApply(data, callback){
		http.post(API.urls.getWorkApply, data, 'h2', callback)
	},

	//作业下载附件
	workAttchMentList(data,callback){
		http.get(API.urls.workAttchMentList, data, 'h2', callback)
	},
	//大屏幕作业详情
	gethomeworkdetail(data,callback){
		http.get(API.urls.homeworkbigtetail, data, 'h2', callback)
	},
	//大屏幕作业已提交人员
	getcommitpeople(data,callback){
		http.get(API.urls.homeworkcommitpeople, data, 'h2', callback)
	},
	//大屏幕作业未提交人员
	getnocommitpeople(data,callback){
		http.get(API.urls.homeworknocommitpeople, data, 'h2', callback)
	},
	//大屏幕作业提交人列表
	getpeoplelist(data,callback){
		http.get(API.urls.homeworkpeoplelist,data,'h2',callback)
	},
	//学员提交的作业详情
	getstudentcommit(data,callback){
		http.get(API.urls.homeworkstudentcommit,data,'h2',callback)
	},
	// 班级小组列表
  groupList(data, callback) {
    http.get(API.urls.groupList,  data, 'h2', callback)
	},
	// 小组成员列表
  groupUserList(data, callback) {
    http.get(API.urls.groupUserList,  data, 'h2', callback)
  },
}

