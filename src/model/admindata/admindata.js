import API from '@/global/resource'
import http from '@/global/request'

export default {
    //获取周增张数据
    getweekAdd(data, callback) {
        http.get(API.urls.getweekAdd, data, 'h2', callback)
    },
    //获取年增张数据
    getyearAdd(data, callback) {
        http.get(API.urls.getyearAdd, data, 'h2', callback)
    },
    //获取周新增数据统计
    getweekAdddetail(data, callback) {
        http.get(API.urls.getweekAdddetail, data, 'h2', callback)
    },
    //  训前数据
    getbeforeData(data, callback) {
        http.get(API.urls.getbeforeData, data, 'h2', callback)
    },
    getstatbeforeDate(data, callback) {
        http.get(API.urls.getstatbeforeDate, data, 'h2', callback)
    },
    // 分页查询每日训前，训中数据
    getpageData(data, callback) {
        http.get(API.urls.getpageData, data, 'h2', callback)
    },
    //训中数据
    getcenterData(data, callback) {
        http.get(API.urls.getcenterData, data, 'h2', callback)
    },
    getstatcenterData(data, callback) {
        http.get(API.urls.getstatcenterData, data, 'h2', callback)
    },
    //训后数据
    getafterData(data, callback) {
        http.get(API.urls.getafterData, data, 'h2', callback)
    },
    //查看讯后班级详情
    getafterdetailData(data, callback) {
        http.get(API.urls.getafterdetailData + data.clazzId, data, 'h2', callback)
    },
    //其他数据
    getotherdata(data, callback) {
        http.get(API.urls.getotherdata, data, 'h2', callback)
    },

}