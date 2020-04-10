import API from '@/global/resource'
import http from '@/global/request'

export default {

	// 获取项目详情
	getProInfor (data,callback) {
		// console.log("callback"+callback);
		http.get(API.urls.getProInfor, data, 'h2', callback)
	},

	editPro (data, callback) {
		http.post(API.urls.editPro, data, 'h2', callback)
	},

	delPro (data, callback) {
		http.post(API.urls.delPro, data, 'h2', callback)
	}

	
}