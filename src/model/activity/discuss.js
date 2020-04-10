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
	// 设置作业结束时间
	setworkEndtime(data, callback) {
		http.post(API.urls.worktimeEnd, data, 'h2', callback)
	},
	
}