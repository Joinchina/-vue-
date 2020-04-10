import API from '@/global/resource'
import http from '@/global/request'

export default {
		// 题目总数，预览题目页面
		getQuesView (data, callback) {
			http.get(API.urls.quesCount, data, 'h2', callback)
		},
		// 提交人列表页面
		getSubUser (data, callback) {
			http.get(API.urls.quesSubUser, data, 'h2', callback)
		},
		// 查看反思详情
		getIntroDetail (data, callback) {
			http.get(API.urls.introspectionDetail, data, 'h2', callback)
		},

		// 问卷，投票，草稿删除
		postPaperDel (data, callback) {
			http.post(API.urls.quesPaperDel, data, 'h2', callback)
		},
		// 获取实名非实名状态
		getrealNameFlag (data, callback) {
		http.get(API.urls.courseActPaperRes, data, 'h2', callback)
	   },

	// getCourseActPaperRes (data, callback) {
	// 	http.get(API.urls.courseActPaperRes, data, 'h2', callback)
	// },
 //    closeVote (data, callback) {
 //        http.post(API.urls.closeVote, data, 'h2', callback)
 //    },
    




}