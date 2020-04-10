/***
声网sdk公用方法抽象
音视频流公用抽象
**/

import AgoraRTC from "agora-rtc-sdk";
import config from '../config';
import storge from '@/global/storage'
class liveStream {

    constructor(option){
        this.getDevices();
        option?this.options = option:"";
        console.warn(AgoraRTC.VERSION)
        console.warn(option);
    }

    static client=null;  //客户端

    static channel_key;

    static hostStream;   //主播音视频流

    static audioAevicesArr = []   //音频输入设备

    static vedioAevicesArr = []     //视频输入设备

    static liveFlag = true          //设置直播(true)/屏幕共享(false)

    totalStreamArr = []   //音视频流集合

    static playAreaId = 'liveItem'  //播放流的元素基础id

    static usedCamera = ''          //正在使用的摄像头

    static attachmentFlag = false   //连线标志

    resolution = '720p'           //主播分辨率
    connectResolution = '240p'
    
    permissions="requesting"               //摄像头，麦克风权限
    
    reconnectCount=0

    published=false                   //是否已经推流

    mirror=false                //镜像模式

    //cdn播流
    cdnUsersArray=[]    //cdn合图数组 
    cdnUsersWidth=210 // cdn连麦小图宽
    cdnUserObj={} // cdn禁用摄像头存储
    cdnNum=0  
    cdnPushUrl="" 
    options={}
    cdnTotal=6
    //cdnSetComplete=false
    cdnSetTransCodeOr=""
    cdnConflict={}
    cdnHasPublish = false
    lastPubAgoraTime = 0 //上次推流成功时长

    //设置主播分辨率
    set imageQuality(value){
        if(value.finalQuality!==this.resolution||value.mirror!==this.mirror){
            liveStream.hostStream.stop();
            this.resolution = value.finalQuality;
            this.mirror = value.mirror;
            this.liveHostHandle(this.uid);
        }
        
    }
    //设置连线分辨率
    set ConnectQuality(value){
        if(value!==this.connectResolution){
            this.connectResolution = value;
            console.log('%c'+this.connectResolution,'background:red;color:#fff;font-size:20px;');
        }
        
    }

    //获取用户是否允许权限
    get getPermissions(){
        return this.permissions
    }

    //获取媒体源
    getDevices(success=()=>{}){
        AgoraRTC.getDevices(devices=>{
            liveStream.devicesArr=devices;
            devices.forEach(element => {
                if(element.kind=='audioinput'){
                    liveStream.audioAevicesArr.some((item,index)=>{return item.deviceId==element.deviceId})?"":liveStream.audioAevicesArr.push(element);
                    
                }else if(element.kind=='videoinput'){
                    liveStream.vedioAevicesArr.some((item,index)=>{return item.deviceId==element.deviceId})?"":liveStream.vedioAevicesArr.push(element);
                }
            });
            console.log(liveStream.audioAevicesArr);
            success(liveStream.vedioAevicesArr);
        });
        
    }
    
    /**
     * @description 加入房间  包含创建client->加入频道->根据options.liveFlag判断是否为主播
     * @param {Object} options  包含频道名，是否为主播等等的对象
     * @param {Function} success    加入频道成功后执行的回调
     */
    joinSuccess(options,success=()=>{}){

        let _this = this;
        return new Promise((resolve,reject)=>{
            /**
             * 创建客户端
             */
            /**
             * 加入频道
             */
            // console.error(config)
            // liveStream.joinChannel(config.mediaToken,config.channelName,(uid)=>{
            //     //cdn直播
            //     this.options = options;
            //     if(typeof(options) == "object" && options.cdn){
            //         this.cdnPushUrl = options.cdnPushUrl;
            //         this.cdnCallback();
            //     }
            //     if(options.liveFlag){
            //         this.publish();
            //         success(_this.liveHostHandle(uid,options))
            //     }else{
            //         success();
            //     }
            //     resolve()
            // },(err)=>{
            //     console.log(err);
            // });
            _this.createClient(options,()=>{
                liveStream.joinChannel(config.mediaToken,config.channelName,(uid)=>{
                    //cdn直播
                    this.options = options;
                    if(typeof(options) == "object" && options.cdn){
                        this.cdnPushUrl = options.cdnPushUrl;
                        this.cdnCallback();
                    }
                    if(options.liveFlag){
                        this.publish();
                        this.cndLiveTranscoding(this.uid);
                        success(liveStream.hostStream)
                    }else{
                        success();
                    }
                    resolve()
                },(err)=>{
                    console.log(err);
                });
            })
        })

    }

    //创建并初始化client
    createClient(options,success){
        liveStream.client = AgoraRTC.createClient({
            mode: 'live',
            codec: "vp8"
            // codec:"h264"
        });
        let callback = success||function(){};
        let initHandler = liveStream.client.init;
        if(initHandler){
            initHandler(config.appId,()=>{
                console.log("AgoraRTC client initialized");
                callback();
            },(err)=>{
                this.$message.error('client初始化失败');
            })
        }

        let channelKey = "";
        /**
         * 客户端错误回调
         */
        liveStream.client.on('error', function(err) {
            console.log("Got error msg:", err.reason);
            if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
                liveStream.client.renewChannelKey(channelKey, function(){
                    console.log("Renew channel key successfully");
                }, function(err){
                    console.log("Renew channel key failed: ", err);
                });
            }
        });

        /**
         * 订阅流回调--add加入
         */
        liveStream.client.on('stream-added', function (evt) {
            let stream = evt.stream;
            console.log("New stream added: " + stream.getId());
            console.log("Subscribe ", stream);
            liveStream.client.subscribe(stream, function (err) {
                console.log("Subscribe stream failed", err);
            });
        });

        /**
         * 推流成功callback
         */
        liveStream.client.on('stream-published', ()=>{
            clearTimeout(this.lastPubAgoraTime);
            this.PublisheSuccess()
            console.log("stream punlish successfully");
            // this.PublisheSuccess();
            
        });
        /**
         * 连接声网服务器发生变化时callback
         */
        // liveStream.client.on("connection-state-change", (evt)=> {
        //     if(evt.curState=="DISCONNECTED"){
        //         liveStream.client.stopLiveStreaming(this.cdnPushUrl);
        //     }
        //     console.warn(evt);
        // })
        /**
         * 角色发生变化时callback
         */
        liveStream.client.on("client-role-changed", (evt)=> {
            console.warn("client-role-changed", evt);
        });

        /**
         * 网络发生变化时
         */
        liveStream.client.on("network-type-changed", function(evt) {
            console.warn("Network Type Changed to", evt.networkType);
        });

        /**
         * 开始尝试重新发布/订阅音视频流
         */
        liveStream.client.on("stream-reconnect-start", function(evt) {
            console.warn("开始尝试重新发布/订阅音视频流", evt);
        });

        /**
         * 重新发布/订阅音视频流结束
         */
        liveStream.client.on("stream-reconnect-end", function(evt) {
            console.warn("重新发布/订阅音视频流结束", evt);
        });

        /**
         * 本地用户当前的上行和下行网络质量。
         */
        liveStream.client.on("network-quality", function(stats) {
            // console.warn("downlinkNetworkQuality", stats.downlinkNetworkQuality);
            // console.warn("uplinkNetworkQuality", stats.uplinkNetworkQuality);
        });

        liveStream.client.on("exception", function(evt) {
            console.log(evt.code, evt.msg, evt.uid);
        })

        if(this.liveHost){
            liveStream.client.enableDualStream(()=>{
                console.log('双流开启成功');
            },()=>{
                console.log('双流开启失败');
            })
        }
        
        
    }

    streamPublished(success){
        this.PublisheSuccess = typeof(success)=="function"?success:""
    }

    //成员离开直播间
    peerLeave(success){
        let _this = this;
        liveStream.client.on('peer-leave', function (evt) {
            console.log("离开",evt);
            //手机端连线----离开直播间
            _this.cdnSubscribeAllRemove(evt);
            let stream = evt.stream;
            typeof(success)=="function"?success(evt):""
            // if (stream) {
            //     stream.isPlaying()?stream.stop():"";
            //     $('#'+liveStream.playAreaId + stream.getId()).remove();
            //     console.log(evt.uid + " leaved from this channel");
            //     typeof(success)=="function"?success(evt):""
            // }
        });
    }

    //对方结束推流
    streamRemoved(success){
        let _this = this;
        liveStream.client.on('stream-removed', function (evt) {
            console.log('结束推流',evt);
            //手机端连线----离开直播间
            _this.cdnSubscribeAllRemove(evt);
            let stream = evt.stream;
            stream.isPlaying()?stream.stop():"";
            $('#'+liveStream.playAreaId + stream.getId()).remove();
            console.log("Remote stream is removed " + stream.getId());
            typeof(success)=="function"?success(stream):""
        });
    }
    streamRemovedTour(success) {
        liveStream.client.on('stream-removed', function(evt) {
            let stream = evt.stream;
            // console.log("%c 结束推流报错", "color:green; font-size: 20px;", stream, stream.play(), stream.isPlaying());
            stream.isPlaying()?stream.stop():"";
            $('#' + liveStream.playAreaId + 't' + stream.getId()).remove();
            console.log("Remote stream is removed " + stream.getId());
            typeof(success) == "function" ? success(stream): ""
        });
    }
    //订阅远端流之后的回调
    subscribedStream(success,RemoteStreamStates){
        let _this = this;
        liveStream.client.on('stream-subscribed', function (evt) {
            if(config.role=="Broadcaster"){
                //cdn流
                console.warn("是否能合流，true的话可以合流，false,不可以合流",_this.cdnSetTransCodeOr);

                if(_this.cdnSetTransCodeOr == "false"){
                    _this.cdnUsersArray = [];
                    var userObj = {
                        alpha:1,
                        width:1280,
                        height:720,
                        uid:_this.uid,
                        x:0,
                        y:0,
                        zOrder:1
                    }
                    _this.cdnUsersArray.push(userObj);
                    _this.cdnNum = 0;
                }else if(typeof(_this.options) == "object" && _this.options.cdn&&_this.cdnSetTransCodeOr != 'false'){
                    console.log("ext");
                    console.log(evt);
                    console.log(_this.options)
                    console.log("合流出现问题");
                    _this.cdnSubscribeAll(evt);
                }
            }
            let originStream = evt.stream;
            originStream.liveHost=false;
            originStream.playAreaId = liveStream.playAreaId;

            let returnStream ={
                playAreaId: originStream.playAreaId,
                liveHost: originStream.liveHost,
                play: originStream.play,
                getId: originStream.getId,
                disableVideo: originStream.disableVideo,
                enableVideo: originStream.enableVideo,
                disableAudio: originStream.disableAudio,
                enableAudio: originStream.enableAudio,
                setAudioVolume:originStream.setAudioVolume,
                loading:true
            }
            _this.totalStreamArr.push(originStream);
            typeof(success)=="function"?success(returnStream):""
            
        });
    }
    subscribedStreamTour(success, RemoteStreamStates) {
        let _this = this;
        console.warn(1111);
        liveStream.client.on('stream-subscribed', function(evt) {
            let originStream = evt.stream;
            originStream.liveHost = false;
            originStream.playAreaId = liveStream.playAreaId;
            let returnStream = {
                playAreaId: originStream.playAreaId,
                liveHost: originStream.liveHost,
                play: originStream.play,
                isPlaying: originStream.isPlaying,
                getId: originStream.getId,
                disableVideo: originStream.disableVideo,
                enableVideo: originStream.enableVideo,
                disableAudio: originStream.disableAudio,
                enableAudio: originStream.enableAudio,
                setAudioVolume: originStream.setAudioVolume
            }
            _this.totalStreamArr.push(originStream);
            typeof(success) == "function" ? success(returnStream): ""
            // setInterval(() => {
            //     RemoteStreamStates(_this.getRemoteStreamStates());
            // }, 5000)
        });
    }
    //加入频道
    static joinChannel(mediaToken,channel,success){
        // console.warn(userInfo.curUserId());  userInfo.curUserId()：用户id
        console.log('====================='+Number(storge.get("exp_userId"))+'================')
        console.warn(channel);
        liveStream.client.join(mediaToken, channel, Number(storge.get("exp_userId")), (uid)=>{
            console.log("User " + uid + " join channel successfully");
            liveStream.uid = uid;
            typeof(success)=="function"?success(uid):'';
        },(err)=>{
            console.log("AgoraRTC join channel failed", err);
        })
    }

    //播放视频流
    playStream(stream){
        let _this = this;
        return new Promise((resolve,reject)=>{
            //订阅远端流的播放
            stream.bigScreen = true;
            stream.play(stream.playAreaId + stream.getId(), {fit: 'contain',muted:false});
            resolve()
        })
        
    }

    //推流
    publish(){
        /**
         * reconnectCount  控制重推次数
         */
        try{
            liveStream.client.publish(liveStream.hostStream, function (err) {
                console.log("Publish local stream error: " + err);
            })
        }catch (error){
            // if(this.reconnectCount<5){
            //     setTimeout(()=>{
            //         this.unpublish();
            //         this.publish();
            //         this.reconnectCount++
            //     },1000)
            // }else{
            //     this.reconnectCount=0;
            // }
            console.log(error)
        } 
    }

    //结束推流
    unpublish() {
        liveStream.client.unpublish(liveStream.hostStream, function (err) {
            console.log("Unpublish local stream failed" + err);
        });
        this.published = false;
        // liveStream.hostStream.stop();
        // $('#'+liveStream.playAreaId + liveStream.hostStream.getId()).remove();
    }

    //离开频道
    leavelChannel(){
        liveStream.client.leave(function () {
            console.log("Leavel channel successfully");
            
            if(liveStream.hostStream&&!liveStream.liveFlag){
                liveStream.hostStream.close();
                $('#'+liveStream.hostStream.playAreaId + liveStream.hostStream.getId()).remove();
            }
        }, function (err) {
            console.log("Leave channel failed");
        });
    }
    //直播模式
    liveHostHandle(uid,options,errCall=(err)=>{}){
        let _this = this;
        _this.permissions="requesting"
        /***********创建视频流配置  API:https://docs.agora.io/cn/Interactive%20Broadcast/API%20Reference/web/interfaces/agorartc.streamspec.html*/
        liveStream.usedCamera = String(liveStream.usedCamera).trim()!=""?liveStream.usedCamera:liveStream.vedioAevicesArr[0]?liveStream.vedioAevicesArr[0]:'';

        let hostStreamConfig ={
            streamID: uid,
            audio: true,
            cameraId: liveStream.usedCamera.deviceId,
            microphoneId: liveStream.audioAevicesArr[0]?liveStream.audioAevicesArr[0].deviceId:'1010',
            video: liveStream.liveFlag,
            mirror:_this.mirror,
            screen: !liveStream.liveFlag
        }
        console.warn(liveStream.audioAevicesArr)
        liveStream.hostStream = AgoraRTC.createStream(hostStreamConfig);
        this.uid=Number(uid);
        
        /*******************设置直播分辨率    API：https://docs.agora.io/cn/Interactive%20Broadcast/API%20Reference/web/interfaces/agorartc.stream.html#setvideoprofile*/
        if(liveStream.attachmentFlag){
            console.warn('当前分辨率：'+this.connectResolution+'-----------'+liveStream.usedCamera);
            liveStream.hostStream.setVideoProfile(this.connectResolution);
        }else{
            console.warn('当前主播分辨率：'+this.resolution+'-----------'+liveStream.usedCamera);
            liveStream.hostStream.setVideoProfile(this.resolution);
        }
        //主播标识
        liveStream.hostStream.liveHost=true;
        
        /************监听用户允许获取摄像头和麦克风权限 */
        liveStream.hostStream.on("accessAllowed", ()=>{
            _this.permissions = "allowed";
            console.log("accessAllowed");
        });

         /************监听用户拒绝获取摄像头和麦克风权限 */
        liveStream.hostStream.on("accessDenied", ()=>{
            _this.permissions = "denied";
            console.log("accessDenied");
        });
        liveStream.hostStream.playAreaId = liveStream.playAreaId;

        liveStream.hostStream.usedCamera = liveStream.usedCamera
        // let returnStream = {
        //     playAreaId: liveStream.hostStream.playAreaId,
        //     getId: liveStream.hostStream.getId,
        //     play: liveStream.hostStream.play,
        //     liveHost: liveStream.hostStream.liveHost,
        //     init: liveStream.hostStream.init,
        //     usedCamera: liveStream.usedCamera,
        //     setAudioVolume:liveStream.hostStream.setAudioVolume
        // }


        liveStream.hostStream.init(()=>{
            if(liveStream.attachmentFlag){
                liveStream.client.publish(liveStream.hostStream, function (err) {
                    console.log("Publish local stream error: " + err);
                });
                liveStream.hostStream.play(liveStream.hostStream.playAreaId+liveStream.hostStream.getId(),{fit: 'contain'});
            }else{
                liveStream.hostStream.play('barrageBox',{fit: 'contain'})
            }
        },(err)=>{
            if (err == "NO_CAMERA_PERMISSION") {
                // console.error('有其他设备正在占用摄像头和麦克风，请关闭后刷新并重新加入频道！');
                this.permissions = "denied";
            }
            console.log("getUserMedia failed", err);
            errCall(err);
        })
            
        
        return liveStream.hostStream
    }

    /**
        cdn
    */
    tourClassFlag(status){
        if(status){
            //巡课状态不进行转码
            this.cdnSetTransCodeOr = "false";
        }else{
            //非巡课状态连线进行转码
            this.cdnSetTransCodeOr = "true";
        }
        
    }
    removeAllCdnVas(){
        this.cdnUserObj = {};
    }
    cndLiveTranscoding(uid){
        for(var i = 0; i < this.cdnUsersArray.length;i++){
            if(this.cdnUsersArray[i]["uid"] == uid){
                return;
            }
        }
        var userObj = {
            alpha:1,
            width:1280,
            height:720,
            uid:uid,
            x:0,
            y:0,
            zOrder:1
        }
        this.cdnUsersArray.push(userObj);
    }
    //禁摄像头后，cdn合图不展现连麦画面
    disAudioList(uid,flag){
        let j = 0;
        let position = 0;
        this.cdnUserObj[uid] = flag;
        console.log("禁用摄像头临时存储temp======",this.cdnUserObj);
        for(var i = 0; i < this.cdnUsersArray.length; i++){
            // 主播画面为 1280 * 720 不改变
            if(i == 0){
                continue;
            }
            // 禁用摄像头
            if(!!this.cdnUserObj[this.cdnUsersArray[i]["uid"]]){
                this.cdnUsersArray[i].width = 1;
                this.cdnUsersArray[i].height = 1;
                this.cdnUsersArray[i].x = 0;
                console.log("禁用摄像头index====",i);
            // 开启摄像头
            }else{
                position = this.cdnUsersWidth * j;	
                j++;
                this.cdnUsersArray[i].width = this.cdnUsersWidth;
                this.cdnUsersArray[i].height = Math.ceil((this.cdnUsersWidth/4)*3);
                this.cdnUsersArray[i].x = position + (4 * (j == 1 ? 0 : (j-1)));
                position = 0;
                console.log("开启摄像头index====",i);
            }
        }
        console.log("禁摄像头合流====",this.cdnUsersArray);
        this.cdnSetTransCode();
    }
    cdnPublish(cdnPushUrl){
        if(this.cdnHasPublish){
            console.log("%c cdn已经推流","color:red;")
            return
        }
        this.cndLiveTranscoding(this.uid);
        this.cdnSetTransCode();
        liveStream.client.startLiveStreaming(cdnPushUrl, true);
        this.cdnHasPublish = true;
        this.cdnPushUrl = cdnPushUrl;
    }
    cdnCallback(){
        let _this = this;
        liveStream.client.on("liveStreamingStarted",this.pushSucess)
        liveStream.client.on("liveStreamingFailed",()=>{
            this.cdnPushFail();
            this.cdnHasPublish = false;
        })
        liveStream.client.on("liveStreamingStopped",()=>{
            this.cdnPushStop();
            this.cdnHasPublish = false;
        })
        liveStream.client.on("liveTranscodingUpdated",function(code){
            console.log("cdn主播转码已更新");
            console.log(code);
            //_this.cdnSetComplete = true;

        })
        //在Token过期前 30 秒，会收到该事件通知
        liveStream.client.on("onTokenPrivilegeWillExpire", function(){
          //进行重新申请 Token 操作后
          console.log("token还有30秒过期，需重新连接");
          liveStream.client.renewToken(config.mediaToken);
        });
        //在Token过期后，会收到该事件通知
        liveStream.client.on("onTokenPrivilegeDidExpire", function(){
          //进行重新申请 Token 操作后
          console.log("token已过期,需重新连接");
          liveStream.client.renewToken(config.mediaToken);
        });
    }
    //cdn push 成功
    cdnPushSuccess(callback){
        this.pushSucess = callback;
    }
    //cdn 推流失败
    cdnPushFail(callback){
        this.cdnPushFail = callback;
    }
    //cdn 推流已停止
    cdnPushStop(callback){
        this.cdnPushStop = callback;
    }

    cdnSetTransCode(){
        var LiveTranscoding = {
          width: 1280,
          height: 720,
          videoBitrate: 1130,
          videoFramerate: 15,
          lowLatency: false,
          audioSampleRate: 48000,
          audioBitrate: 48,
          audioChannels: 1,
          videoGop: 30,
          videoCodecProfile: 100,
          userCount: this.cdnUsersArray.length,
          userConfigExtraInfo: {},
          backgroundColor: 0x000000,
          transcodingUsers: this.cdnUsersArray,
        };
        console.log("set");
        console.log(this.cdnUsersArray);
        console.log("total===");
        console.log(LiveTranscoding);
        liveStream.client.setLiveTranscoding(LiveTranscoding);
    }

    cdnSubscribeAll(evt){
        this.cdnConflict = {};
        //this.cdnSetComplete = false;
        if(this.cdnNum >= this.cdnTotal){
            return;
        }
        if(this.cdnNum == 0){
            var number = 0;
        }else{
            var number = 4;
        }
        var userObj = {
            alpha:1,
            width:this.cdnUsersWidth,
            height:Math.ceil((this.cdnUsersWidth/4)*3),
            uid:evt.stream.getId(),
            x:Math.ceil((this.cdnNum * this.cdnUsersWidth)+(number*this.cdnNum)),
            y:Math.ceil(720-(this.cdnUsersWidth/4)*3),
            zOrder:2
        }
        this.cdnNum++;
        console.log("添加cdn图像数量",this.cdnNum);
        this.cdnUsersArray.push(userObj);

        console.log("人员数组组合");
        console.log(this.cdnUsersArray);
        this.cdnSetTransCode();
    }
    cdnSubscribeAllRemove(evt){
        /**
         * evt.stream若取不到stream对象，不执行下面代码；-----C
         * 
         */
        if(!evt.stream)
            return
        if(this.cdnConflict[evt.stream.getId()]){
            return;
        }
        this.cdnConflict[evt.stream.getId()] = true;
        //this.cdnSetComplete = false;
        if(this.cdnNum == 0){
            this.cdnNum = 0;
            return;   
        }
        this.cdnNum--;
        console.log("渐渐",this.cdnNum);
        this.cdnUsersArray.forEach((item,index)=>{
            if(item.uid == evt.stream.getId()){
                this.cdnUsersArray.splice(index,1);
            }
        })
        console.log("结束1");
        console.log(this.cdnUsersArray);
        this.cdnUsersArray.forEach((item,index)=>{
            
            if(index == 0 || index == 1){
                item.x = 0;
            }else{
                let indexs = index - 1;
                var number = indexs * 4;
                item.x = Math.ceil((indexs * this.cdnUsersWidth)+number);
            }
        })
        console.log("结束推流后的绘图");
        console.log(this.cdnUsersArray);
        this.cdnSetTransCode();

    }

    //cdn - 删除直播流
    cdnStopLiveStream(url){
        liveStream.client.stopLiveStreaming(url)
        //删除直播流后所有元素置为成功初始状态
        this.cdnUsersArray = [];
        var userObj = {
            alpha:1,
            width:1280,
            height:720,
            uid:this.uid,
            x:0,
            y:0,
            zOrder:1
        }
        this.cdnUsersArray.push(userObj);
        this.cdnNum = 0;
    }

    // 视频轨道开启与关闭
    closeVedioHandle(flag,stream){
        if(!this.screenFlag){
            let conStream = stream?stream:liveStream.hostStream;
            flag?conStream.muteVideo():conStream.unmuteVideo();
        }
        this.disableVideo=flag;
    }

    // 音频轨道开启与关闭
    closeAudioHandle(flag,stream){
        let conStream = stream?stream:liveStream.hostStream;
        flag?conStream.muteAudio():conStream.unmuteAudio();
        console.log(conStream);
    }

    // 设置混响
    startAudioMixing(flag){
        if(flag&&liveStream.hostStream){
            liveStream.hostStream.startAudioMixing({
                //cycle:1,        //伴奏循环次数
                filePath:"../../assets/music/故乡的原风景.mp3",    //文件路径
                loop:true,       //是否无限循环
                playTime: 0,     //设置音频文件开始播放的时间位置，单位为 ms。
                replace: false   //是否要用音频文件替换本地音频流
            },function(info){
                console.log(info?info:'playing AudioMixing successfully');
            })
        }else if(!flag&&liveStream.hostStream){
            liveStream.hostStream.stopAudioMixing();
        }
       
    }

    //获取摄像头

    /**
     * @deprecated 获取媒体源
     * @param {Function} success 获取摄像头成功后的回调
     */
    getDevices(success=()=>{}){
        AgoraRTC.getDevices(devices=>{
            liveStream.devicesArr=devices;
            liveStream.vedioAevicesArr=[];
            liveStream.audioAevicesArr=[];
            devices.forEach(element => {
                element.kind=='audioinput'?liveStream.audioAevicesArr.push(element):element.kind=='videoinput'?liveStream.vedioAevicesArr.push(element):'';
            });
            console.log(liveStream.audioAevicesArr);
            success(liveStream.vedioAevicesArr);
        });
    }
    

    //摄像头预览
    cameraPreview(cameraId){
        let _this = this;
        return new Promise((resolve,reject)=>{
            
            let uid = _this.uid;
            /***********创建视频流配置  API:https://docs.agora.io/cn/Interactive%20Broadcast/API%20Reference/web/interfaces/agorartc.streamspec.html*/
            let hostStreamConfig ={
                streamID: uid,
                audio: true,
                cameraId: cameraId,
                microphoneId: liveStream.audioAevicesArr[0]?liveStream.audioAevicesArr[0].deviceId:"0001",
                video: liveStream.liveFlag,
                screen: !liveStream.liveFlag
            }
            let previewStream = AgoraRTC.createStream(hostStreamConfig);
            console.warn('当前分辨率：'+this.resolution+'-----------'+liveStream.usedCamera);
            /*******************设置直播分辨率    API：https://docs.agora.io/cn/Interactive%20Broadcast/API%20Reference/web/interfaces/agorartc.stream.html#setvideoprofile*/
            previewStream.setVideoProfile(this.resolution);
            previewStream.liveHost = true;
            previewStream.playAreaId = "previewItem";
            previewStream.init(()=>{
                $("#camerapreShow").empty();
                setTimeout(()=>{
                    previewStream.play("camerapreShow",{fit: 'contain'});
                },200)
            })
            
            // liveStream.hostStream.play('barrageBox',{fit: 'contain'})
        })
    }
    //摄像头预览
    cameraPreview2(cameraId){
        let _this = this;
        return new Promise((resolve,reject)=>{
            
            let uid = _this.uid;
            /***********创建视频流配置  API:https://docs.agora.io/cn/Interactive%20Broadcast/API%20Reference/web/interfaces/agorartc.streamspec.html*/
            let hostStreamConfig ={
                streamID: uid,
                audio: true,
                cameraId: cameraId,
                microphoneId: liveStream.audioAevicesArr[0]?liveStream.audioAevicesArr[0].deviceId:'',
                video: liveStream.liveFlag,
                screen: !liveStream.liveFlag
            }
            let previewStream = AgoraRTC.createStream(hostStreamConfig);
            console.warn('当前分辨率：'+this.resolution+'-----------'+liveStream.usedCamera);
            /*******************设置直播分辨率    API：https://docs.agora.io/cn/Interactive%20Broadcast/API%20Reference/web/interfaces/agorartc.stream.html#setvideoprofile*/
            previewStream.setVideoProfile(this.resolution);
            previewStream.liveHost = true;
            previewStream.playAreaId = "previewItem";
            previewStream.init(()=>{
                $("#camerapreShow2").empty();
                setTimeout(()=>{
                    previewStream.play("camerapreShow2",{fit: 'contain'});
                },200)
            })
            
            // liveStream.hostStream.play('barrageBox',{fit: 'contain'})
        })
    }
    //切换摄像头

    /**
     * 
     * @param {String} cameraId 相机id
     */
    switchCamear(cameraId,success){
        if(cameraId.trim()==""){
            console.log('未检测到设备id');
            return
        }
        let _this = this;
        if(!this.screenFlag){
            let replaceStream = AgoraRTC.createStream({
                streamID: liveStream.uid,
                audio: true, // 设置屏幕共享不带音频，避免订阅端收到的两路流中都有音频，导致回声
                video: true,
                mirror:_this.mirror,
                cameraId: cameraId,
                microphoneId: liveStream.audioAevicesArr[0]?liveStream.audioAevicesArr[0].deviceId:'',
                screen: false,
            });
            replaceStream.setVideoProfile(this.resolution);
            replaceStream.init(()=>{
                liveStream.hostStream.replaceTrack(replaceStream.getVideoTrack(),()=>{
                    //切换成功的回调
                    typeof(success)=="function"?success():"";
                    liveStream.vedioAevicesArr.forEach(item=>{
                        if(item.deviceId == cameraId){
                            liveStream.usedCamera = item
                            return
                        }
                    })
                    console.warn("切换成功")
                },err=>{
                    console.log('替换失败',err);
                })
            })
        }else{
            liveStream.vedioAevicesArr.forEach(item=>{
                if(item.deviceId == cameraId){
                    liveStream.usedCamera = item
                    return
                }
            })
            typeof(success)=="function"?success():"";
        }
        
    }

    //全员禁麦
    banTotalMic(flag){
        console.log(this.totalStreamArr);
        this.totalStreamArr.forEach(item=>{
            flag?item.enableAudio():item.disableAudio();
        })
    }

    //连线
    /**
     * 
     * @param {Boolean} flag 连线标识
     * @param {Function} success 成功回调
     */
    attachment(flag,success){
        if(flag){
            liveStream.liveFlag = true
            liveStream.attachmentFlag = true;
            typeof(success)=='function'?success(this.liveHostHandle(liveStream.uid)):'';
        }else{
            this.unpublish();
            liveStream.attachmentFlag = false;
            if(liveStream.hostStream)
                    typeof(liveStream.hostStream.close) == 'function'?liveStream.hostStream.close():'';
            $('#'+liveStream.playAreaId + liveStream.hostStream.getId()).remove();
            // setTimeout(()=>{
            //     if(liveStream.hostStream)
            //         typeof(liveStream.hostStream.close) == 'function'?liveStream.hostStream.close():'';
            //     $('#'+liveStream.playAreaId + liveStream.hostStream.getId()).remove();
            // },1000);
            success()
        }
        
    }

    //调节远端流音量
    /**
     * 
     * @param {Object} stream 需要调节音量的远端流
     * @param {Number} vlo 音量大小  0-100
     */
    changeHostVolume(stream,vlo){
        if(Array.isArray(stream)){
            stream.forEach(item=>{
                console.log(item);
                item.setAudioVolume(Number(vlo));
            })
        }
        // if(stream){
        //     this.totalStreamArr.forEach(item=>{
        //         if(stream.getId() ==item.getId() ){
        //             item.setAudioVolume(Number(vlo));
        //             return false
        //         }
        //     })
            
        // }
    }

    //获取网络信息--网络类型----------------2.5.1+版本已废弃
    getNetworkStats(){
        liveStream.client.getNetworkStats((states)=>{
            let networkType = '';
            switch(states.NetworkType){
                case "UNSUPPORTED":
                    networkType = "浏览器不支持获取网络类型";
                break

                case "bluetooth":
                    networkType = "蓝牙网络";
                break

                case "cellular":
                    networkType = "蜂窝移动数据网络";
                break

                case "ethernet":
                    networkType = "以太网";
                break

                case "none":
                    networkType = "没有网络";
                break

                case "wifi":
                    networkType = "Wi-Fi";
                break

                case "wimax":
                    networkType = "WiMax";
                break

                case "other":
                    networkType = "其他网络类型";
                break

                case "unknown":
                    networkType = "未知网络类型";
                break
            }
            console.log('%c当前网络类型：'+networkType,"background:black;color:#fff;font-size:20px;")
        })
    }

    //获取远端视频&音频流信息
    getLocalStreamStates(success){
        let streamStates = new Object();
        // liveStream.client.getRemoteVideoStats((states)=>{
        //     streamStates.RemoteVideo =states;
        // })
        // liveStream.client.getRemoteAudioStats((states)=>{
        //     streamStates.RemoteAudio =states;
        // })
        liveStream.client.getTransportStats((states)=>{
            streamStates.TransportStats =states;
        })
        liveStream.client.getLocalAudioStats((states)=>{
            streamStates.LocalAudio =states;
        })
        liveStream.client.getLocalVideoStats((states)=>{
            streamStates.LocalVideo =states;
        })
        typeof(success)=="function"?success(streamStates):"";
    }

    //分辨率+帧率=>视频属性
    setVideoProfile(resolution,fps){
        let result = null;
        let myResolution = resolution.replace(/\s+/g,'')
        switch (myResolution) {
            case "160*120":
                switch(Number(fps)){
                    case 15:
                        result ='120p';
                        break;
                }
                break;
            case "120*120":
                switch(Number(fps)){
                    case 15:
                        result ='120p_3';
                    break;
                }
            break;
            case "320*180":
                switch(Number(fps)){
                    case 15:
                        result ='180p';
                    break;
                }
            break;
            case "180*180":
                switch(Number(fps)){
                    case 15:
                        result ='180p_3';
                    break;
                }
            break;
            case "240*180":
                switch(Number(fps)){
                    case 15:
                        result ='180p_4';
                    break;
                }
            break;
            case "320*240":
                switch(Number(fps)){
                    case 15:
                        result ='240p';
                    break;
                }
            break;
            case "240*240":
                switch(Number(fps)){
                    case 15:
                        result ='240p_3';
                    break;
                }
            break;
            case "424*240":
                switch(Number(fps)){
                    case 15:
                        result ='240p_4';
                    break;
                }
            break;
            case "640*360":
                switch(Number(fps)){
                    case 15:
                        result ='360p';
                    break;
                    case 30:
                        result ='360p_4';
                    break;
                }
            break;
            case "360*360":
                switch(Number(fps)){
                    case 15:
                        result ='360p_3';
                    break;
                    case 30:
                        result ='360p_6';
                    break;
                }
            break;
            case "480*360":
                switch(Number(fps)){
                    case 15:
                        result ='360p_7';
                    break;
                    case 30:
                        result ='360p_8';
                    break;
                }
            break;
            case "640*360":
                switch(Number(fps)){
                    case 15:
                        result ='360p_9';
                    break;
                    case 24:
                        result ='360p_10';
                    break;
                }
            break;
            case "640*480":
                switch(Number(fps)){
                    case 10:
                        result ='480p_10';
                    break;
                    case 15:
                        result ='480p';
                    break;
                    case 30:
                        result ='480p_2';
                    break;
                }
            break;
            case "480*480":
                switch(Number(fps)){
                    case 15:
                        result ='480p_3';
                    break;
                    case 30:
                        result ='480p_6';
                    break;
                }
            break;
            case "848*480":
                switch(Number(fps)){
                    case 15:
                        result ='480p_8';
                    break;
                    case 30:
                        result ='480p_9';
                    break;
                }
            break;
            case "1280*720":
                switch(Number(fps)){
                    case 15:
                        result ='720p';
                    break;
                    case 30:
                        result ='720p_3';
                    break;
                }
            break;
            case "960*720":
                switch(Number(fps)){
                    case 15:
                        result ='720p_5';
                    break;
                    case 30:
                        result ='720p_6';
                    break;
                }
            break;
            case "1920*1080":
                switch(Number(fps)){
                    case 15:
                        result ='1080p';
                    break;
                    case 30:
                        result ='1080p_2';
                    break;
                    case 60:
                        result ='1080p_5';
                    break;
                }
            break;
            case "2560*1440":
                switch(Number(fps)){
                    case 30:
                        result ='1440p';
                    break;
                    case 60:
                        result ='1440p_2';
                    break;
                }
            break;
            case "3840*2160":
                switch(Number(fps)){
                    case 30:
                        result ='4K';
                    break;
                    case 60:
                        result ='4K_3';
                    break;
                }
            break;
        
            default:
                result ='720p';
                break;
        }

        return result
    }


    //屏幕共享
    /**
     * 
     * @param {function} callback  初始化失败的回调
     * @param {function} screenSuccess  屏幕共享成功的回调
     * @param {function} stopScreen  结束屏幕共享的回调
     */
    shareScreenC(callback,replaceSuccess,stopScreen){
        let _this = this;
        
        let screenStream = AgoraRTC.createStream({
            streamID: this.uid,
            audio: false, // 设置屏幕共享不带音频，避免订阅端收到的两路流中都有音频，导致回声
            video: false,
            screen: true,
            // Chrome
            extensionId: 'minllpmhdgpndnkomcoccfekfegnlikg',
            // Firefox
            // mediaSource: 'application' // 'screen', 'application', 'window'
        });
        screenStream.init(()=>{
            if(liveStream.hostStream.player == undefined){
                screenStream.playAreaId = liveStream.playAreaId;
                liveStream.hostStream = screenStream;
                console.log(liveStream.hostStream.getId());
                liveStream.hostStream.play("barrageBox", {fit: 'contain',muted:false});
                typeof(replaceSuccess)=="function"?replaceSuccess():""
            }else{
                let newVideoTrack = screenStream.getVideoTrack();
                // let newAudioTrack = screenStream.getAudioTrack();
                liveStream.hostStream.replaceTrack(newVideoTrack,(res)=>{
                    console.log(res);
                    typeof(replaceSuccess)=="function"?replaceSuccess():""
                });
            }
            //停止共享
            this.screenFlag=true;
            screenStream.on('stopScreenSharing', (evt)=>{
                let mediaStream =AgoraRTC.createStream({
                    streamID: liveStream.uid,
                    audio: liveStream.audioAevicesArr.length > 0,
                    cameraId: liveStream.usedCamera.deviceId,
                    microphoneId: liveStream.audioAevicesArr[0]?liveStream.audioAevicesArr[0].deviceId:'1010',
                    video: liveStream.vedioAevicesArr.length > 0,
                    screen: false
                });
                mediaStream.setVideoProfile(this.resolution);
                mediaStream.init(()=>{
                    let mediaNewVideoTrack = mediaStream.getVideoTrack();
                    // let mediaNewAudioTrack = mediaStream.getVideoTrack();
                    liveStream.hostStream.replaceTrack(mediaNewVideoTrack,(res)=>{
                        typeof(stopScreen)=="function"?stopScreen():""
                    });
                    // liveStream.hostStream.replaceTrack(mediaNewAudioTrack);
                    this.screenFlag=false;
                    console.warn(this.disableVideo);
                    setTimeout(()=>{
                        if(this.disableVideo)
                            liveStream.hostStream.disableVideo()
                    },500)
                })
                if(liveStream.vedioAevicesArr.length == 0 && liveStream.audioAevicesArr.length == 0 ){
                    typeof(stopScreen)=="function"?stopScreen():""
                }

            })

        },(err)=>{
            console.log(err)
            callback(err)                                    
        });
       
    }

}


export {liveStream};
