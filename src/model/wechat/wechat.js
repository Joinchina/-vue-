import API from '@/global/resource'
import http from '@/global/request'
//投票列表
export default {
	wechatPage(data, callback) {
	   http.get(API.urls.wechatPage, data, 'h2', callback)
	},
	wechatQrcode(data, callback) {
	   http.get(API.urls.wechatQrcode, data, 'h2', callback)
	},
	wechatUser(data,callback){
		http.get(API.urls.wechatUser, data, 'h2', callback)
	},
	bindWechat(data,callback){
		http.post(API.urls.bindWechat, data, 'h2', callback)
	},
	checkWechatBind(data,callback){
		http.get(API.urls.checkWechatBind, data, 'h2', callback)
	}
}