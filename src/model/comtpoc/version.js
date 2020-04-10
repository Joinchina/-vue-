import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 版本记录列表
	getList(data, callback) {
		http.get(API.urls.appVersionPage, data, 'h2', callback)
	},

	// 新增版本记录
	addVersion(data, callback, progress) {
		http.post(API.urls.appVersionSave, data, 'file', callback, 'file',[], progress)
	},

	// 删除版本记录
	delVersion(data, callback) {
		http.post(API.urls.appVersionDel, data, 'h2', callback)
	}
}