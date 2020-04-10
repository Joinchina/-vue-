import API from '@/global/resource'
import http from '@/global/request'

export default {
	scheduleFind(data, callback) {
		http.get(API.urls.scheduleFind, data, 'h2', callback)
	},
	// 发布图片
	scheduleAddImg(data, callback, fileArray) {
		http.post(API.urls.scheduleAdd, data, 'file', callback,'file',fileArray)
	},
	// 发布PDF文件
	scheduleAddPdf(data, callback) {
		http.post(API.urls.scheduleAdd, data, 'file', callback, 'file')
	},

	// 课程列表
	getCourseList(data, callback,loading) {
		http.get(API.urls.courseListByClazz, data, 'h2', callback,loading)
	},

	// 课程满意度列表
	getCourseSatisfaction(data, callback) {
		http.get(API.urls.clazzCourseSatisfaction, data, 'h2', callback)
	}
}