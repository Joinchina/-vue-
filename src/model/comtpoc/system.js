import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 查看系统维护
	getSystem(data, callback) {
		http.get(API.urls.systemMaintainDet, data, 'h2', callback)
	},

	// 发布维护
	postSystemPub(data, callback) {
		http.post(API.urls.systemMaintainPub, data, 'h2', callback)
	},

	// 系统维护-关闭
	postSystemShut(data, callback) {
		http.post(API.urls.systemMaintainShut, data, 'h2', callback)
	}
}