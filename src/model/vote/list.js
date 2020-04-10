  import API from '@/global/resource'
  import http from '@/global/request'
  import { setOneToken} from '@/filters/userVerify'
  //投票列表
  export default {
	  voteActivityListInClazz(data, callback) {
	    http.get(API.urls.voteActivityListInClazz, data, 'h2', callback)
	  },
  }