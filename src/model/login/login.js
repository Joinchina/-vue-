import API from '@/global/resource'
import http from '@/global/request'
import { setOneToken} from '@/filters/userVerify'

export default {

	login (data, callback) {
		http.post(API.urls.login, data, 'h1', callback)
	},
	loginPhone (data, callback) {
		http.post(API.urls.loginPhone, data, 'h1', callback)
	},
	getSms (data, callback) {
		http.get(API.urls.getSms, data, 'h1', callback)
	},
	userListByPhone(data,callback){
		http.get(API.urls.userListByPhone, data, 'h2', callback)
	},
	updateOwnPassWord(data,callback){
		http.post(API.urls.updateOwnPassWord, data, 'h2', callback)
	}

}
