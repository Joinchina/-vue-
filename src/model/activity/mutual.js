import API from '@/global/resource'
import http from '@/global/request'

export default {
	//讨论组列表
	discussActivityListInClazz(data, callback) {
		http.get(API.urls.discussActivityListInClazz, data, 'h2', callback)
	},
	
	// 统计讨论组发言数量，发言人数
	getDiscussCount(data, callback) {
		http.get(API.urls.discussCount, data, 'h2', callback)
	},
	// 同步讨论组成员
	
	getDiscussSync(data, callback) {
		http.get(API.urls.discussSync, data, 'h2', callback)
	},

	// 时间设置
	setDisdussTime(data, callback) {
		http.post(API.urls.discussEdit, data, 'h2', callback)
	},

	// 讨论组-详情
	getDisDetail(data, callback) {
		http.get(API.urls.courseDiscussDetails, data, 'h2', callback)
	},
	// 设置学员户互评作业结束时间
	setMutualEndtime(data, callback) {
		http.post(API.urls.setMutualTime, data, 'h2', callback)
    },
  // 学员互评作业-统计信息
	workTotal(data, callback) {
		http.get(API.urls.mutualWorkTotal, data, 'h2', callback)
	},
	// 学员互评作业-详细信息
	activityDetail(data, callback) {
		http.get(API.urls.mutualWorkDetail, data, 'h2', callback)
	},
	//学员提交作业分页列表信息
	mutualworkPage(data, callback) {
		http.get(API.urls.mutualworkPage, data, 'h2', callback)
	},
	//学员提交作业详细信息
	mutualOtherDetail(data, callback) {
		http.get(API.urls.mutualOtherDetail, data, 'h2', callback)
	},
	//给学员打分
	setReviewScore(data, callback) {
		http.post(API.urls.setReviewScore, data, 'h2', callback)
	},
	//已完成人员列表
	ReviewgetFinishedUser(data, callback) {
		http.get(API.urls.ReviewgetFinishedUser, data, 'h2', callback)
	},
	//未提交人员列表
	ReviewgetUnCommitUser(data, callback) {
		http.get(API.urls.ReviewgetUnCommitUser, data, 'h2', callback)
	},
	//未评阅人员列表
	ReviewgetUnReviewUser(data, callback) {
		http.get(API.urls.ReviewgetUnReviewUser, data, 'h2', callback)
	},
	//班级-互评作业活动列表
	ReviewgetActivityList(data, callback) {
		http.get(API.urls.ReviewgetActivityList, data, 'h2', callback)
	},
}