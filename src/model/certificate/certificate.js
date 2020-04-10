import API from '@/global/resource'
import http from '@/global/request'

export default {
	getOrgCert(data, callback) {
		http.get(API.urls.getOrgCert, data, 'h2', callback)
	},
	// 保存机构证书模板
	orgCertSave(data, callback, fileArray) {
		http.post(API.urls.orgCertSave, data, 'file', callback,'file')
	},
	// 编辑机构证书模板
	orgCertUpdate(data, callback) {
		http.post(API.urls.orgCertUpdate, data, 'file', callback, 'file')
	},
}