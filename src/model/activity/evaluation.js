import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 班级评价列表
	getClazzEvalList (data, callback) {
		http.get(API.urls.clazzEvalList, data, 'h2', callback)
	},
}