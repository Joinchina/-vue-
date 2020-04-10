import API from '@/global/resource'
import http from '@/global/request'
//班级统计
export default {
    //正态分布图
    clazzNormalDistribution(data,callback){
        http.get(API.urls.clazzNormalDistribution, data, 'h2', callback)
    },
    //资源阅读top帮
    clazzResourceViewTopStatistics(data,callback){
         http.get(API.urls.clazzResourceViewTopStatistics, data, 'h2', callback)
    },
    //班级人均积分 - 开始时间-结束时间
    clazzAvgIntegralStartAndEndDate(data,callback){
        http.get(API.urls.clazzAvgIntegralStartAndEndDate, data, 'h2', callback)
    },
    //班级人均积分
    clazzAvgStatistics(data,callback){
        http.get(API.urls.clazzAvgStatistics, data, 'h2', callback)
    },
    //班级概况  班级成员
    getClazzTotal(data, callback) {
        http.get(API.urls.clazzStatistics, data, 'h2', callback)
    },
    // 班级签到
    getClazzSign(data, callback) {
        http.get(API.urls.clazzSignStat, data, 'h2', callback)
    },

    // 班级综合评估、学员积分获得分布图
    getClazzDaily(data, callback) {
        http.get(API.urls.clazzDailyStat, data, 'h2', callback)
    },

      //项目满意度
    clazzSatisfaction(data,callback){
        http.get(API.urls.clazzSatisfaction, data, 'h2', callback)
    },

    //学情统计
    clazzLearnSatistics(data,callback){
        http.get(API.urls.clazzLearnSatistics, data, 'h2', callback)
    },

    // 作业概况
    getWorkStat(data, callback) {
        http.get(API.urls.clazzWorkStat, data, 'h2', callback)
    },

    //获取剩余的短信提醒次数（提醒学员登录APP）
    clazzLoginRemindTimes(data,callback){
        http.get(API.urls.clazzLoginRemindTimes, data, 'h2', callback)
    },

    //发送短信提醒未登录学员登录APP
    clazzLoginAPP(data,callback){
         http.post(API.urls.clazzLoginAPP,data,'h2', callback)
    }
    


}