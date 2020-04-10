import API from '@/global/resource'
import http from '@/global/request'
export default {
    //获取班级学员列表
    liveMemberList(data, callback) {
        http.get(API.urls.liveMemberList, data, 'h2', callback)
    },

    //获取直播课程的直播间授权token信息
    liveRoomAuth(data, callback) {
        http.get(API.urls.liveRoomAuth, data, 'h2', callback)
    },

    //分页获取直播间的聊天记录
    liveRoomChat(data, callback) {
        http.get(API.urls.liveRoomChat, data, 'h2', callback)
    },

    //结束直播
    liveRoomEnd(data, callback) {
        http.post(API.urls.liveRoomEnd, data, 'h2', callback);
    },

    //获取直播间在线用户id集合
    liveRoomOnlineList(data, callback) {
        http.get(API.urls.liveRoomOnlineList, data, 'h2', callback);
    },

    //开始直播
    liveRoomStart(data, callback) {
        http.post(API.urls.liveRoomStart, data, 'h2', callback);
    },

    // 获取直播课程活动列表
    liveCourseActList(data, callback) {
        http.get(API.urls.livecourseActList, data, 'h2', callback);
    },

    // 直播间活动状态切换
    liveCourseActStatus(data, callback) {
        http.post(API.urls.livecourseActStatus, data, 'h2', callback);
    },
    //直播间开始签到
    livestartsignin(data, callback) {
        http.post(API.urls.livestartsignin, data, 'h2', callback);
    },
    //直播间关闭签到
    liveendsignin(data, callback) {
        http.post(API.urls.liveendsignin, data, 'h2', callback);
    },
    //直播间正在进行签到
    liveforsignin(data, callback) {
        http.get(API.urls.liveforsignin, data, 'h2', callback);
    },

    //直播间正在进行的答题器
    liveforanswer(data, callback) {
        http.get(API.urls.liveforanswer, data, 'h2', callback);
    },
    //直播间结束的答题器
    liveanswerend(data, callback) {
        http.get(API.urls.liveanswerend, data, 'h2', callback);
    },
    //直播间创建答题器
    livepublishanswer(data, callback) {
        http.jsonPost(API.urls.livepublishanswer, data, callback)
    },
    //直播间关闭答题
    livecloseanswer(data, callback) {
        http.post(API.urls.livecloseanswer, data, 'h2', callback);
    },

    //上传保存记录
    liveRoomChatSave(data, callback) {
        http.post(API.urls.liveRoomChatSave, data, 'h2', callback);
    },

    liveLoginOsType(data, callback) {
        http.get(API.urls.liveLoginOsType, data, 'h2', callback);
    },

    // 奖励送花
    liveRoomSendFlower(data, callback) {
        http.post(API.urls.liveRoomSendFlower, data, 'h2', callback);
    },

    // 踢出直播间
    liveRoomKickout(data, callback) {
        http.post(API.urls.liveRoomKickout, data, 'h2', callback);
    },

    // 禁言
    liveRoomShutup(data, callback) {
        http.post(API.urls.liveRoomShutup, data, 'h2', callback);
    },

    // 课堂表现
    livecourseStatistics(data, callback) {
        http.get(API.urls.livecourseStatistics, data, 'h2', callback);
    },

    //直播状态
    liveroomStatus(data,callback){
        http.get(API.urls.liveroomStatus, data, 'h2', callback);
    },

    //踢出用户列表集合
    kickOutList(data,callback){
        http.get(API.urls.kickoutList, data, 'h2', callback);
    },
    // 开启巡课
    liveRoomTourStart(data, callback) {
        http.post(API.urls.liveRoomTourStart, data, 'h2', callback);
    },
    // 结束巡课
    liveRoomTourEnd(data, callback) {
        http.post(API.urls.liveRoomTourEnd, data, 'h2', callback);
    },
    // 获取巡课学员
    liveRoomLookStuList(data, callback) {
        http.get(API.urls.liveRoomLookStuList, data, 'h2', callback);
    },
    //获取直播间推流地址
    liveroomPlayUrl(data,callback){
        http.get(API.urls.liveroomPlayUrl, data, 'h2', callback);
    }
}