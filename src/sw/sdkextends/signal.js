//extends 信令
/**
 * Wrapper for Agora Signaling SDK
 * Transfer some action to Promise and use Event instead of Callback
 */

const AgoraSig = require('@/sw/plugins/AgoraSig');


import config from '../config';


import storge from '@/global/storage'




class signalClient {
    constructor(options) {
        if (options) {
            this.options = options;
        }
        //sinal类
        this.signal = null;
        //channel类
        this.channel = null;
        //初始化session类
        this.session = null;
        //call类
        this.call = null;
        //接收频道点消息
        this.msgCallback = null;
        //接收答题器消息
        this.msgAnsCallback = null;
        //接收答题器消息2
        this.msgDtCallback = null;
        //接收点对点消息
        this.msgPtoPCallback = null;
        //讨论组接收点对点消息
        this.msgDisPtoPCallback = null;
        //学员接收点对点消息
        this.msgStuPtoPCallback = null;
        //加入直播间
        this.userJoin = null;
        //离开直播间
        this.userLeave = null;
        //获取当前状态的登录码
        this.getStatusCode = null;
    }

    static userList


    login(options) {

        let _this = this;
        _this.optionsLogin = options;
        _this.signal = Signal(options.appId);
        console.log("版本号=========",_this.signal.getSDKVersion());
        console.log("后台获取token");
        console.log(options.signalToken);
        _this.session = _this.signal.login(options.account, options.signalToken);

        _this.getStatusCode = _this.session.getStatus();
        //登录成功
        _this.session.onLoginSuccess = function(uid) {

            _this.getStatusCode = _this.session.getStatus();
            //设置频道属性
            _this.channel = _this.session.channelJoin(options.channelName);
            _this.options.channelName = options.channelName;

            _this.channel.onChannelJoined = function() {
                //发送服务器
                if (options.callback) {
                    options.callback(_this.session);
                }
                //初始化-频道聊天
                _this.channelChat();
                //初始化-发送点对点
                _this.channelChatPtoP();
                
                
                _this.addChannelAttr("_auto_update_num",30);

            }

            //某人加入直播间
            _this.userJoins();
            //某人离开直播间
            _this.userLeaves();
            //频道属性更新
            _this.channelUpdate();

            //加入频道失败 登录 0未登录 1登录中 2已登录
            console.log("登录状态码",_this.getStatusCode); 
            if(_this.getStatusCode == 2){
                _this.channel.onChannelJoinFailed = _this.onChannelJoinFailOut
            }
            
            _this.channel.onChannelLeaved = function(ecode) {
                console.log('离开频道', ecode);
            };

            _this.channel.onChannelUserList = function(users) {
                console.log('获取频道内用户列表',users);
                signalClient.userList = users;
                console.log(users);
            };
            if(this.checkStatus){
                _this.checkStatus(_this.getStatusCode);
            }
            
        }

        //收到呼叫邀请回调 
        _this.session.onInviteReceived = function(call) {
            console.log(_this.options.onInviteReceived);
            _this.options.onInviteReceived(call).then((params) => {
                // call.channelInviteAccept("");
                // this.options = Object.assign(this.options,param);
                if (params.role != "Broadcaster") {
                    _this.call = call;
                }
                Array.isArray(_this.callCollection) ? JSON.stringify(_this.callCollection).indexOf(JSON.stringify(call)) > 0 ? "" : _this.callCollection.push(call) : _this.callCollection = [call];
                _this.initCall(call, params);
                params.punStr();
            }).catch(() => {
                // call.channelInviteRefuse("");
                console.log('reject')
            });



        };

        //登出回调
        _this.session.onLoginFailed = _this.onLoginFailOut;
        //websocklet链接失败
        _this.session.onLogout = _this.onLogoutWebsoket;
    }

    signalLogOut(callback){
        this.session.logout();
    }

    onLoginFail(callback){
        this.onLoginFailOut = callback;
    }
    webSocketFail(callback){
        this.onLogoutWebsoket = callback;
    }
    onChannelJoinFail(callback){
        this.onChannelJoinFailOut = callback;
    }
    checkLoginStatus(callback){
        this.checkStatus = callback;
    }
    setInviteReceived(cb) {
            this.options.onInviteReceived = cb;
        }
        //某人加入直播间
    userJoins() {
        let _this = this;
        _this.channel.onChannelUserJoined = _this.userJoin;
    }
    userJoinChannel(callback) {
        this.userJoin = callback;
    }

    //某人离开直播间
    userLeaves() {
        let _this = this;
        _this.channel.onChannelUserLeaved = _this.userLeave;
    }
    userleaveChannel(callback) {
        this.userLeave = callback;
    }

    //添加频道属性
    addChannelAttr(name, val,cb) {
        let _this = this;
        if (_this.channel) {
            _this.channel.channelSetAttr(name, val, function() {
                // attr name was set
                console.log("频道属性已添加");
                console.log(name);
                console.log(val);
                typeof cb=="function"?cb():"";
            });
        }
    }

    //更新频道属性
    channelUpdate() {
        // this.channel.onChannelAttrUpdated = this.channelAtrUpdate;
        let _this = this;
        this.channel.onChannelAttrUpdated = function(name, val, v) {
            if (typeof(_this.channelAtrUpdate) == 'function') {
                _this.channelAtrUpdate(name, val, v);
            }
            if (typeof(_this.channelAtrUpdateStu) == 'function') {
                _this.channelAtrUpdateStu(name, val, v);
            }
            if (typeof(_this.channelAtrUpdateDis) == 'function') {
                _this.channelAtrUpdateDis(name, val, v);
            }



        }
    }
    channelAttrUpdated(callback) {
            this.channelAtrUpdate = callback;
        }
        //活动-更新频道属性
    channelAttrUpdatedStu(callback) {
            this.channelAtrUpdateStu = callback;
        }
        //活动-更新频道属性
    channelAttrUpdatedDis(callback) {
            this.channelAtrUpdateDis = callback;
        }
        //删除频道属性
    delChannelAttr(name) {
            if (this.channel) {
                this.channel.channelDelAttr(name, function() {
                    console.log(name);
                    console.log("所有频道属性已删除");
                });
            }
        }
        //删除所有频道属性
    delchannelClearAttr() {
        if (this.channel) {
            this.channel.channelClearAttr(function() {
                //频道属性已删除
            });
        }
    }

    //频道接收消息
    channelChat() {
        let _this = this;
        console.log("频道接收消息被调用===", _this.channel);
        _this.channel.onMessageChannelReceive = function(account, uid, msg) {
            //console.log("频道接收消息", account, uid, msg);
            //接收频道消息回调设置
            let data = JSON.parse(msg);
             //大屏幕
            if(data.command == "CHAT" || data.command == "TURN_OFF_ALL_MIC" || data.command == "TURN_ON_ALL_MIC"){
                //大屏幕-单独路由懒加载
                if(_this.msgCallbackChat){
                    _this.msgCallbackChat(account, uid, msg)
                //讨论组聊天
                }else if(_this.msgCallback){  
                    _this.msgCallback(account, uid, msg)
                }
            }else if(data.command=="FINISHED_TASK" || data.command=="OVER_TASK" || data.command=="PUBLISH_CLOSE"){
                _this.msgAnsCallback(account, uid, msg)
            }else if(data.command=="PUBLISH_TASK"){
                //接受答题卡的数据
                _this.msgDtCallback(account, uid, msg);
                _this.msgDtCallback2(account, uid, msg)
            }else if(data.command=="TOURCLASS_OVER" || data.command == "TOURCLASS_OPEN"){
                _this.msgTourCallback(account, uid, msg)
            }
        }
    }
    receiveChannelMsg(callback) {
        this.msgCallback = callback;
    }
    receiveChannelAnsMsg(callback) {
        this.msgAnsCallback = callback;
    }
    receiveChannelDtMsg(callback) {
        this.msgDtCallback = callback;
    }
    receiveChannelDtMsg2(callback) {
        this.msgDtCallback2 = callback;
    }
    receiveChannelMsgChat(callback) {
        this.msgCallbackChat = callback;
    }
    receiveChannelTourMsg(callback) {
        this.msgTourCallback = callback;
    }
    
    //离开频道
    leaveChanel() {
        this.channel && this.channel.channelLeave();
    }

    //发送频道聊天
    sendChannelMsg(msg,cb) {
        this.channel.messageChannelSend(msg,cb);
    }

    //点对点聊天-初始化
    channelChatPtoP() {
        let _this = this;
        _this.session.onMessageInstantReceive = function(account, uid, msg) {
            //发送给服务端消息
            _this.sendServerMsg(account,'CURRENT_DEVICE');
            if (_this.msgPtoPCallback) {
                _this.msgPtoPCallback(account, uid, msg);
            }
            if (_this.msgDisPtoPCallback) {
                _this.msgDisPtoPCallback(account, uid, msg);
            }
            if (_this.msgTourPtoPCallback) {
                console.log("%c 接收点对点=====", "color:red", account, uid, msg)
                _this.msgTourPtoPCallback(account, uid, msg);
            }
        }
    }
    sendServerMsg(account,command){
        let data = {
            "fromRole":this.optionsLogin.role,
            "from":this.optionsLogin.account,
            "command":command,
            "roomCode":this.optionsLogin.channelName,
            "to":account
        }
        console.log("管理端发送account");
        console.log(JSON.stringify(data));
        this.sendPtoPMsg("sxb_1",JSON.stringify(data));
    }
    receivePtoPMsg(callback) {
        this.msgPtoPCallback = callback;
    }
    receiveDisPtoPMsg(callback) {
        this.msgDisPtoPCallback = callback;
    }
    receiveStuPtoPMsg(callback) {
        this.msgStuPtoPCallback = callback;
    }
    receiveTourPtoPMsg(callback) {
        this.msgTourPtoPCallback = callback;
    }
    //发送点对点聊天
    sendPtoPMsg(account, msg,cb) {
        //console.log("msgsssss");
        // console.log( this.session.messageInstantSend);
        this.session.messageInstantSend(account, msg,cb);
    }

    //发送邀请
    invitatePerson(options, cb) {

        let extra = typeof(options.extra) == "object" ? Object.assign(options.extra, { "_timeout": 60 * 3 }) : options.extra;

        this.call = this.session.channelInviteUser2(config.channelName, options.account, JSON.stringify(extra));

        this.initCall(this.call, options);
        typeof(cb) == "function" ? cb(this.call): '';
    }

    //学员申请连麦
    studentApplyOnLine(msg) {
        console.log("msg");
        console.log(msg);
    }

    initCall(call, options) {
        let _this = this;
        let account = call.peer;
        //管理端发送连麦邀请
        call.onInviteReceivedByPeer = function(extra) {
            if (options)
                _this.sendServerMsg(account,"manager_channelInviteUser2");
                options.onInviteReceivedByPeer ? options.onInviteReceivedByPeer(extra) : '';
            console.log('远端已收到呼叫回调' + extra);
        }
        //管理端接受呼叫回调
        call.onInviteAcceptedByPeer = function(extra) {
            if (options)
                _this.sendServerMsg(account,"manager_channelInviteAccept");
                options.onInviteAcceptedByPeer ? options.onInviteAcceptedByPeer(extra) : '';
            Array.isArray(_this.callCollection) ? JSON.stringify(_this.callCollection).indexOf(JSON.stringify(call)) > 0 ? "" : _this.callCollection.push(call) : _this.callCollection = [call];
            console.log('远端已接收呼叫' + extra);
        }
        //对方已拒绝呼叫(没有摄像头或是关闭摄像头权限)
        call.onInviteRefusedByPeer = function(extra) {
            if (options)
                options.onInviteRefusedByPeer ? options.onInviteRefusedByPeer(extra) : '';
            console.log('对方已拒绝呼叫' + extra);
            //clear_call();
        }
        //呼叫失败了
        call.onInviteFailed = function(extra) {
            // alert('超时无响应')
            console.log('呼叫失败' + extra);
            //clear_call();
        }
        //对方挂断
        call.onInviteEndByPeer = function(extra) {
            if (options)
                options.onInviteEndByPeer ? options.onInviteEndByPeer(extra) : '';
            console.log('对方已结束呼叫回调' + extra);
            //clear_call();
        }
        //管理端结束连麦
        call.onInviteEndByMyself = function(extra) {
            if (options)
                _this.sendServerMsg(account,"manager_channelInviteEnd");
                options.onInviteEndByMyself ? options.onInviteEndByMyself(extra) : '';
            console.log('本地已结束呼叫回调' + extra);
            //clear_call();
        }
        call.onInviteMsg = function(extra) {
            console.log('本地已收到消息回调' + extra);
        }
    }
    /****获取账号列表 */
    get accountList() {
        return signalClient.userList;
    }

    /********连线人员下线 */
    attachmentOffline(parma) {
        let _this = this;
        let shouldEndCall = null;
        console.log(this.callCollection);
        if (Array.isArray(this.callCollection)) {
            this.callCollection.forEach((item, index) => {
                if (item.peer.split("_")[1] == parma.identification) {
                    shouldEndCall = item;
                    item.channelInviteEnd();
                    _this.callCollection.splice(index, 1);
                }
            })
        }
        // if (!shouldEndCall) {
        //     _this.invitatePerson({
        //         account: parma.name + '_' + parma.identification,
        //         onInviteAcceptedByPeer: (call) => {
        //             setTimeout(() => {
        //                 this.call.channelInviteEnd();
        //             }, 500)
        //         },
        //         extra: { 'refresh_reconnect': true }
        //     }, (call) => {
        //         // setTimeout(()=>{
        //         //     call.channelInviteEnd();
        //         // },500)
        //     })
        // }
    }

    //本地挂断邀请
    invitateEndBySelf() {
        if (this.call)
            this.call.channelInviteEnd();
    }

    //查询用户在线状态
    checkUserOnlineStatus(account,cb=()=>{}){
        this.session.invoke("io.agora.signal.user_query_user_status",{"account":account},(isin,pa)=>{
            cb(pa)
        });
    }
}


export default signalClient;