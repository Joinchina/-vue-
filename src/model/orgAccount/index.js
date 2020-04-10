import API from '@/global/resource'
import http from '@/global/request'
import { setOneToken} from '@/filters/userVerify'

export default {

	getAccountInfo (data, callback) {
        // http.post(API.urls.saveVipApply, data, 'h2', callback);
        http.get(API.urls.getAccountInfo, data, 'h2', callback)
        
	},


}
