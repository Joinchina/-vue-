import API from '@/global/resource'
import http from '@/global/request'

export default {
	rollCallExport(data, callback) {
		http.get(API.urls.rollCallExport, data, 'h2', callback)
	},
	// 历史记录
	rollCallList(data, callback) {
		http.get(API.urls.rollCallList, data, 'h2', callback)
	},
	// 评价学员
	rollCallSave(data, callback) {
		http.post(API.urls.rollCallSave, data, 'h2', callback)
	},

	// 学员列表
	studentList(data, callback) {
		http.get(API.urls.stundentList, data, 'h2', callback)
	},

	//班级学员列表（已登录、未登录）
	rollCallAllStudentList(data,callback){
		http.get(API.urls.rollCallAllStudentList, data, 'h2', callback)
	}

}