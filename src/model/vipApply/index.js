import API from '@/global/resource'
import http from '@/global/request'
import { setOneToken} from '@/filters/userVerify'

export default {

	saveVipApply (data, callback) {
        // http.post(API.urls.saveVipApply, data, 'h2', callback);
        http.jsonPost(API.urls.saveVipApply, data, callback);
        
	},
	applylist (data, callback) {
		http.get(API.urls.vipApplyList, data, 'h2', callback)
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
