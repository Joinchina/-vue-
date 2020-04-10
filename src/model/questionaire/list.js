 import API from '@/global/resource'
import http from '@/global/request'
import { setOneToken} from '@/filters/userVerify'
 //问卷列表
export default {
	questionnaireActivityListInClazz(data, callback) {
    	http.get(API.urls.questionnaireActivityListInClazz, data, 'h2', callback)
  	},

}