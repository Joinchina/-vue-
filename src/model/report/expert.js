import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 课程报告内容
	getProfessor(data, callback) {
		http.get(API.urls.reportProfessor, data, 'h2', callback)
	},
	
}