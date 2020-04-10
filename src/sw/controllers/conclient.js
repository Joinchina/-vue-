/**
controller
集中管理和分发
*/

// 获取常量 appId 和 cetificateId
import config from '../config';

import { liveStream } from '../sdkextends/stream';


import signalClient from '../sdkextends/signal';






class SxbRtc {

    constructor(methods, options) {

        this.methods = methods || "";

        this.defaults = {
            appId: config.appId,
            channelName: config.channelName,
            token: config.token
        }

        this.options = Object.assign(this.defaults, options);

        this.init();


        this.liveStream = this.liveStream ? this.liveStream : new liveStream();

        this.signalClinet = new signalClient(Object.assign(this.defaults, options));

    }

    init() {


        if (SxbRtc.prototype.hasOwnProperty(this.methods)) {
            return this[this.methods]();
        }


    }

    /*********************************音视频流入口集合*******************************/

    //获取视频输入设备
    getVedioInput(cb) {
        this.liveStream.getDevices(cb);
    }
    createClient(){
        this.liveStream.createClient();
    }
    //加入直播间
    joinRoom(param, cb) {

        let jionOptions = Object.assign(param, this.options);
        return this.liveStream.joinSuccess(jionOptions, cb)
    }
    //加入直播间
    previewStream(uid,options,errCall) {
        return this.liveStream.liveHostHandle(uid,options,errCall)
    }
    //主播本地流数据
    getLocalStreamStates(cb) {
        this.liveStream.getLocalStreamStates(cb, cb);
    }
        //播放视频流
    palyStream(stream) {
        return this.liveStream.playStream(stream);
    }

    //订阅远端视频流
    subscribedStream(cb, RemoteStreamStates) {
        this.liveStream.subscribedStream(cb, RemoteStreamStates);
    }
    subscribedStreamTour(cb, RemoteStreamStates) {
        this.liveStream.subscribedStreamTour(cb, RemoteStreamStates);
    }
    //对方结束推流
    streamRemoved(cb) {
        this.liveStream.streamRemoved(cb);
    }
    streamRemovedTour(cb) {
        this.liveStream.streamRemovedTour(cb);
    }
    //成员离开直播间
    peerLeave(cb) {
        this.liveStream.peerLeave(cb);
    }


    //推流
    publish() {
        this.liveStream.publish()
    }

    //结束推流
    unpublish() {
        this.liveStream.unpublish();
    }

    //离开频道
    leavelChannel() {
        this.liveStream.leavelChannel();
    }

    // 视频轨道开启与关闭
    closeVedioHandle(flag, stream) {
        this.liveStream.closeVedioHandle(flag, stream);
    }

    // 音频轨道开启与关闭
    closeAudioHandle(flag, stream) {
        this.liveStream.closeAudioHandle(flag, stream);
    }

    //伴奏
    startAudioMixing(flag) {
        this.liveStream.startAudioMixing(flag);
    }

    //切换摄像头
    switchCamera(id, success) {
        this.liveStream.switchCamear(id, success);
    }

    //摄像头预览
    cameraPreview(camearId) {
        return this.liveStream.cameraPreview(camearId)
    }
     //摄像头预览
     cameraPreview2(camearId) {
        return this.liveStream.cameraPreview2(camearId)
    }
    //全员禁麦
    banTotalMic(cd) {
        this.liveStream.banTotalMic(cd);
    }


    //屏幕共享
    screenShare() {
        this.liveStream.screenShare(this.options);
    }

    //结束屏幕共享
    closeShareScreen() {
        this.liveStream.closeShareScreen();
    }


    attachment(flag, cb) {
        this.liveStream.attachment(flag, cb);
    }

    //调节远端流音量
    changeHostVolume(stream, vol) {
        this.liveStream.changeHostVolume(stream, vol);
    }

    //获取分辨率
    getImageQuality() {
            return this.liveStream.resolution;
        }
        //设置主播分辨率
    setImageQuality(q) {
        this.liveStream.imageQuality = q;
    }

    //设置连线分辨率
    setConnectQuality(q) {
        this.liveStream.ConnectQuality = q;
    }

    shareScreenC(callback,successCallBack,stopCall) {
        this.liveStream.shareScreenC(callback,successCallBack,stopCall);
    }

    //用户列表
    getAccountList() {
        return this.signalClinet.accountList;
    }

    //获取推流便是
    publishSuccess(cb) {
        this.liveStream.streamPublished(cb);
    }

    //连线人员下线
    attachmentOffline(stream) {
            this.signalClinet.attachmentOffline(stream);
        }
        //本地挂断连线
    invitateEndBySelf() {
        this.signalClinet.invitateEndBySelf();
    }

    //获取是够允许摄像头权限
    getPermissions() {
        return this.liveStream.getPermissions;
    }

    /*********************************信令方法入口集合*******************************/
    login(options) {
        this.signalClinet.login(options);
    }
    checkLoginStatus(callback){
        this.signalClinet.checkLoginStatus(callback);
    }
    //屏幕共享
    screenShare() {
        this.liveStream.screenShare();
    }

    //某人加入直播间
    userJoinChannel(callback) {
        this.signalClinet.userJoinChannel(callback);
    }

    //某人离开直播间
    userleaveChannel(callback) {
        this.signalClinet.userleaveChannel(callback);
    }
    // 接收巡课消息
    receiveChannelTourMsg(callback) {
        this.signalClinet.receiveChannelTourMsg(callback);
    }
    //接收点对点消息
    receiveTourPtoPMsg(callback) {
        this.signalClinet.receiveTourPtoPMsg(callback);
    }
    //接收消息
    receiveChannelMsg(callback) {
            this.signalClinet.receiveChannelMsg(callback);
        }
        //答题器接收消息
    receiveChannelAnsMsg(callback) {
            this.signalClinet.receiveChannelAnsMsg(callback);
        }
        //答题卡接收消息3
    receiveChannelDtMsg(callback) {
        this.signalClinet.receiveChannelDtMsg(callback);
    }
    //答题卡接收消息4
    receiveChannelDtMsg2(callback) {
        this.signalClinet.receiveChannelDtMsg2(callback);
    }
    receiveChannelMsgChat(callback) {
        this.signalClinet.receiveChannelMsgChat(callback);
    }

    //发送频道消息
    sendChannelMsg(msg,cb) {
        this.signalClinet.sendChannelMsg(msg,cb);
    }

    //发送点对点消息
    sendPtoPMsg(account, msg,cb) {
        this.signalClinet.sendPtoPMsg(account, msg,cb);
    }

    //接收点对点消息
    receivePtoPMsg(callback) {
            this.signalClinet.receivePtoPMsg(callback);
        }
        //讨论组接收点对点消息
    receiveDisPtoPMsg(callback) {
            this.signalClinet.receiveDisPtoPMsg(callback);
        }
        //学员端接收点对点消息
    receiveStuPtoPMsg(callback) {
        this.signalClinet.receiveStuPtoPMsg(callback);
    }
    invitatePerson(options) {

        return this.signalClinet.invitatePerson(options);
    }

    studentApplyOnLine(msg) {
        this.signalClinet.studentApplyOnLine(msg);
    }

    //添加频道属性
    addChannelAttr(name, val,cb) {
            this.signalClinet.addChannelAttr(name, val,cb);
        }
        //删除频道属性
    delChannelAttr(name) {
            this.signalClinet.delChannelAttr(name);
        }
        //删除所有频道属性
    delchannelClearAttr() {
        this.signalClinet.delchannelClearAttr();
    }

    //更新频道属性
    channelAttrUpdated(callback) {
        this.signalClinet.channelAttrUpdated(callback);
    }

    //更新学员频道属性
    channelAttrUpdatedStu(callback) {
        this.signalClinet.channelAttrUpdatedStu(callback);
    }

    //更新讨论组频道属性
    channelAttrUpdatedDis(callback) {
        this.signalClinet.channelAttrUpdatedDis(callback);
    }


    //离开频道
    leaveChanel() {
            this.signalClinet.leaveChanel();
    }
     //退出信令
    signalLogOut(callback){
        this.signalClinet.signalLogOut(callback);
    }
    //服务器失去链接
    onLoginOut(callback) {
        this.signalClinet.onLoginOut(callback);
    }

    setInviteReceived(cb) {
        this.signalClinet.setInviteReceived(cb);
    }

    //cdn推流
    cdnPublish(cdnPushUrl){
        this.liveStream.cdnPublish(cdnPushUrl);
    }
    cdnPushSuccess(callback){
        this.liveStream.cdnPushSuccess(callback);
    }
    cdnPushFail(callback){
        this.liveStream.cdnPushFail(callback);
    }

    cdnPushStop(callback){
        this.liveStream.cdnPushStop(callback);
    }
    disAudioList(uid,flag){
        this.liveStream.disAudioList(uid,flag);
    }
    cdnUnPublish(url){
        this.liveStream.cdnStopLiveStream(url);
    }
    removeAllCdnVas(){
        this.liveStream.removeAllCdnVas();
    }

    webSocketFail(callback){
        this.signalClinet.webSocketFail(callback);
    }

    onLoginFail(callback){
        this.signalClinet.onLoginFail(callback);
    }

    onChannelJoinFail(callback){
        this.signalClinet.onChannelJoinFail(callback);
    }
    
    tourClassFlag(status){
        this.liveStream.tourClassFlag(status);
    }

    checkUserOnlineStatus(account,cb){
        this.signalClinet.checkUserOnlineStatus(account,cb);
    }

}


export default SxbRtc;