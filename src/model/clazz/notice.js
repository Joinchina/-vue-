import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 删除通知
	noticeDel (data, callback) {
		http.post(API.urls.noticeDel, data, 'h2', callback)
	},
	// 详情
	noticeDet (data, callback) {
		http.get(API.urls.noticeDet, data, 'h2', callback)
	},
	// 列表
	noticeList (data, callback) {
		http.get(API.urls.noticeList, data, 'h2', callback)
	},
	// 发布通知
	noticeAdd(data, callback, fileArray) {
		http.post(API.urls.noticeAdd, data, 'file', callback,'file',fileArray)
	},
}