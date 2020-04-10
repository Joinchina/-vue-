import API from '@/global/resource'
import http from '@/global/request'

export default{
    //学员信息
    saveBusiness(data, callback) {
        http.post(API.urls.saveBusiness, data, 'file', callback,"file")
    },
}
