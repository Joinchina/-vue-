<template>
	<div class="discuss">
		<div class="con" ref="chatId" id="chatId">
            <section style="position:relative;">
                <!--有更多的消息-->
                <section class="moreMsg" @click="moreMsgAdd" v-if="moreMsgAddFlag">
                    <i class="el-icon-arrow-down"></i>&nbsp;有更多地消息
                </section>
                <!--公告占位-->
                <!-- <section>
                    <div class="noticeTop" id="noticeTop" v-show="chatNoticeFlag">
                        <div class="title title-top">
                            <span class="horn"></span>
                            <span class="yellow">公告：</span> 
                            <span class="text">{{chatNotice.msg}}</span>
                        </div>
                    </div>
                </section> -->
    	        <!--系统消息-->
    	        <div class="sys">
    	            系统消息：欢迎来到直播间。请各位老师认真听讲,积极发言,配合学员完成教学。同时禁止发送任何违法、违规、低俗等不良信息行为。
    	        </div>

    	        <section  v-for="(item,index) in chatArray">

    	            <div class="title" v-if="item.notice">
    	                <span class="horn"></span>
    	                <span class="yellow">公告：</span> 
    	                <span class="text">{{item.notice.msg}}</span>
    	            </div>

    	            <!--进入直播间-->
                    <div class="sectionjoin">
        	            <!-- <div class="comin" v-if="item.joinRoom">
        	                {{item.joinRoom.account | namefilter}}进入教室
        	            </div> -->

        	            <!--进入直播间-->
        	            <!-- <div class="comin" v-if="item.leaveRoom">
        	                {{item.leaveRoom.account | namefilter}}离开教室
        	            </div> -->
                        <!--xx收到了花-->
        	            <div class="comin" v-if="item.content">
        	                {{item.content}}
        	            </div>
                        <!--申请连线-->
                        <div class="apply-connect" v-if="item.apply">
                            {{item.apply.account | namefilter}}申请连线啦
                        </div>

                         <!--您已被下线-->
                        <div class="apply-connect" v-if="item.close">
                            {{item.close.msg}}
                        </div>
                        <!--全体禁言已开启-->
                        <div class="comin" v-if="item.turnOffAllMic">
                            <ul>
                                <li>
                                    <div>{{item.turnOffAllMic.msg}}</div>
                                </li>
                            </ul>
                        </div>
                         <!--全体禁言已结束-->
                         <div class="comin" v-if="item.turnOnAllMic">
                            <ul>
                                <li>
                                    <div>{{item.turnOnAllMic.msg}}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
    	            <!--聊天-频道聊天-->
    	            <div class="chat" v-if="item.chat">
    	                <ul>
    	                    <li>
    	                        <span class="icon-identity" v-if="item.chat.role == 'Assistant' || item.chat.role == 'Broadcaster'">{{item.chat.role | rolefilter}}</span>
                                <span class="icon-Audience" v-else-if="item.chat.role == 'Audience'">{{item.chat.role | rolefilter}}</span>
    	                        <span class="name">{{item.chat.account | namefilter}}</span>
    	                        <div class="text">{{item.chat.msg}}</div>
    	                    </li>
    	                </ul>
    	            </div>

    	            <!--聊天-点对点-->
    	            <div class="chat" v-if="item.PtoMsg">
    	                <ul>
    	                    <li>
    	                        <span class="icon-identity">{{item.PtoMsg.role | rolefilter}}</span>
    	                        <span class="name">{{item.PtoMsg.account | namefilter}}</span>
                                <span style="color:yellow;">&nbsp;to:&nbsp;&nbsp;{{item.PtoMsg.to}}</span>
    	                        <div class="text">{{item.PtoMsg.msg}}</div>
    	                    </li>
    	                </ul>
    	            </div>
    	        </section>
            </section>
	    </div>

        <!--进入、离开直播间-->
	    <section class="inleftRoom">
            <i class="name" v-if="!!comeLeftRoom.account">
                {{comeLeftRoom.account | namefilter}}
            </i>
            <span v-if="!!comeLeftRoom.type">
                {{comeLeftRoom.type == "come" ? "进入" : "离开"}}直播间
            </span>
        </section>
	        <!--发送信息-->
	        <section class="sendMsg">
	           
	            <div class="clearfix">
	                <div class="tab tab-title" :class="{'cur':nowIndex2 === 0}" @click.stop="tabChat(0)">
	                   <span class="dis" :class="{'n-cur':buttonGrayFlag,'gray':!buttonGrayFlag}">
                            <span class="tab-distance">聊天</span>to:
                       </span>
                       <!-- <span class="button-gray" v-show="!buttonGrayFlag"></span> -->
                       <div class="button-live button-gray" v-show="!buttonGrayFlag">
                           <el-button type="primary" style="cursor:default">
                                <span class="staffname">{{staffname}}</span><i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                        </div>
	                   <el-dropdown size="mini" class="button-live" v-show="buttonGrayFlag" trigger="click">
	                      <el-button type="primary" @click.stop="menus">
	                        <span class="staffname">{{staffname}}</span><i class="el-icon-arrow-down el-icon--right"></i>
	                      </el-button>

	                     <el-dropdown-menu slot="dropdown">
	                        <el-dropdown-item @click.stop.native="menuItem('所有人')">所有人</el-dropdown-item>
	                        <el-dropdown-item v-if="onlineData.length > 0" v-for="(item,index) in onlineData" :key="index" @click.stop.native="menuItem(item)">
	                            {{item.name}}
	                        </el-dropdown-item>

	                      </el-dropdown-menu>
	                    </el-dropdown>

	                </div>
	                <div class="tab-rg" :class="{'cur':nowIndex2 === 1}" @click.stop="tabChat(1)" >
	                   公告
	                </div>
	            </div>

                <section class="el-form-height">
    	             <el-form :model="form" :rules="rules" ref="form">
    	                <div class="textareaBg" v-show="nowIndex2 === 0">
    	                    
    	                        <el-form-item prop="textarea">
    	                            <el-input
    	                              type="textarea"
    	                              :rows="3"
    	                              :disabled="chatTextAreaFlag"
    	                              @keyup.native.13="sendChannelMsgClick('form')"
    	                              placeholder="请输入"
    	                              v-model.trim="form.textarea">
    	                            </el-input>
    	                        </el-form-item>
    	                        <div>
    	                            <a href="javascript:void(0)" :class="{'icon-all-nopeak':speakFlag,'icon-cancel':!speakFlag}" @click.stop="allNoSpeak">{{speakText}}</a>
    	                           <!--  <a href="#" class="icon-cancel" @click="addChannelAttr" >添加频道属性</a> -->
    	                            <el-button class="icon-send" @click.stop="sendChannelMsgClick('form')">发送</el-button>
    	                        </div>
    	                </div>
    	             </el-form>

    	             <el-form :model="formNotice" :rules="rulesNotice" ref="formNotice">
    	                <div class="textareaBg" v-show="nowIndex2 === 1">
    	                        <el-form-item prop="textareaNotice">
    	                         <el-input
    	                          type="textarea"
    	                          :rows="3"
    	                          placeholder="请输入"
    	                           @keyup.native.13="sendNoticeMsgClick('formNotice')"
    	                          v-model.trim="formNotice.textareaNotice">
    	                         </el-input>
    	                       </el-form-item>
    	                    <div>
    	                        <el-button class="icon-send" @click.stop="sendNoticeMsgClick('formNotice')">发送</el-button>
    	                    </div>
    	                </div>
    	            </el-form>
                </section>

	        </section>
	</div>
</template>
<script type="text/javascript">
	import { sendPtoP,sendChat,splitUid,setChannle,sliceArray,curDate} from '@/sw/utils/sig';
	import barrageWall from '@/sw/utils/barrage.js';
	import storge from '@/global/storage';
    import Timer from '@/sw/utils/timer';
    import model from '@/model/live/live';
    import { mapGetters, mapActions } from 'vuex';
import { fail } from 'assert';
	export default {
		data() {
			return {
				chatArray : [],  // 记录聊天的数组
                // chatNotice:{}, // 管理端暂不需要公告具体展现信息
                // chatNoticeFlag:false,
				nowIndex2 : 0, //聊天、公告tab索引 
				speakFlag : true, //全体禁言标识
				speakText : "全体禁言", // 全体禁言 -- 文本
				chatTextAreaFlag : false, // 聊天输入框置灰标识
				staffname : "所有人", // 聊天至所有人
				form : { // 聊天输入框
                  textarea: ''
                }, 
                formNotice : { // 公告输入框
                  textareaNotice: ''
                },
                rules : { // 校验聊天输入框
                  textarea: [
                    {required: true, message: '聊天不能为空',trigger: 'focus'},
                    {max: 100, message: '最多100字', trigger: 'change'}
                  ],
                  
                },
                rulesNotice : { // 校验公告
                  textareaNotice : [
                    {required: true, message: '公告不能为空', trigger: 'focus'},
                    {max: 100, message: '最多100字', trigger: 'change'}
                  ],  
                },
                chatSingleAccount : "", // 对某人说账号
                chatType : "channel", // 发送消息类型 频道消息 or 单点消息
                buttonGrayFlag : true, // tab聊天to的置灰标识
                liveOnlineMember : [], // 在线学员列表数组(仅有userId)
                onlineData : [], // 在线学员列表(包含userName、userId)
                applyUserList : [], // 正在申请学员列表集合
                temp : {},
                updateObj : {}, // 频道属性对象缓存

                kickOutList : [], // 踢出人员列表

                comeLeftRoom : {}, // 进入离开直播间
                chatNumTotal : 0, // 记录收到消息的总数量
                chatLimit : { // 记录消息的最小、最大条数
                    min:100,
                    max:200
                },
                lock : false, // 默认锁为关闭
                moreMsgAddFlag : false, // 是否显示查看更多的消息


			}
		},
		props:["liveController","authInfos","liveMemberArray","liveMemberArrayC","barrageFlag","courseId"],
        computed:{
            ...mapGetters(['getAssistantStatus'])
        },
        watch:{
            authInfos:{
                handler(n,o){
                    this.chatList();
                },
                deep:true
            },
            getAssistantStatus(cur,old){
                this.chatArray.push({
                    "close":{
                        msg:"您已被关闭连线"
                    }
                });  
                this.chatScrollBottom();
            }
        },
        
		filters:{
			namefilter:function(val) {
                //alert(val);
                return val.split("_")[0];
            },
			rolefilter:function(val){
                //alert(val);
                if(val == "Broadcaster"){
                    return val = "主播";
                }else if(val == "Attendee"){
                    return val = "学员";
                }else if(val == "Assistant"){
                    return val = "助教"
                }else if(val == "Audience"){
                    return val = "游客"
                }
            }
		},
		created(){
            //频道属性发生变化
            this.channelUpdatedDis();
            this.userJoinChannel();
            //某人离开直播间
            this.userleaveChannel();
             //获取聊天信息
            this.chatList();
            //接收消息
            this.receiveMsg();
            //接收点对点消息
            this.receivePtoP();
            barrageWall.init({container:"#barrageBox",barrageLen:6});

		},
        mounted(){
            this.chatHeight();
            $(window).resize(()=>{
                this.chatHeight();
            })
            this.scrollPage();  
        },
		methods:{
            scrollPage(){
                // 元素滚动时，锁开启，滚动至底部，锁关闭
                var ele = document.getElementById("chatId");
                ele.onscroll = (e=>{
                    this.lock = true;
                    let chatId = $("#chatId");
                    let viewH = chatId.height(); // 可见高度
                    let contentH = chatId[0].scrollHeight;// 内容高度
                    let scrollTop = chatId.scrollTop(); // 滚动高度
                    if(contentH - viewH - scrollTop <= 20) { //当页面滚动到底部,解锁,更多消息隐藏
                        this.moreMsgAddFlag = false;
                        this.lock = false;
                    }
                })
            },
            //更多的消息，消息滚动到最底部
            moreMsgAdd(){
                this.lock = false;
                this.moreMsgAddFlag = false;
                this.chatScrollBottom();
            },
            chatScrollBottom(){
                // 锁关闭时-- 聊天内容至底部
                setTimeout(()=>{
                    if(!!this.$refs.chatId && !this.lock){
                        var chatId = this.$refs.chatId;
                        chatId.scrollTop = chatId.scrollHeight;
                        console.log("chatId===",chatId.scrollTop);
                    }
                },50)
            },
            chatHeight(){
                let _this = this;
                setTimeout(function(){
                    let height = $(window).height();
                    let len = height - ($(".tab").outerHeight(true) + 55 + $(".tab-title").outerHeight(true) + $(".el-form-height").outerHeight(true) + 70);
                    $("#chatId").css({
                        'height':len + "px",
                        'overflow-y':"auto"
                    })
                    _this.chatScrollBottom();
                },50)
            },
            chatList(){
                if(!!this.authInfos){
                    let _this = this;
                    let data = {
                        roomCode:this.authInfos.roomCode
                    }
                    model.liveRoomChat(data, ( res => {
                        if(res.status == 200){
                            let data = res.data.content;
                            data.forEach((item,index)=>{
                                let obj = {
                                    "chat":{
                                        role:item.fromRole,
                                        msg:item.content,
                                        account:item.fromName + "_" + item.from
                                    }
                                }
                                this.chatArray.push(obj);
                            })
                            _this.chatScrollBottom();
                        }else{
                            this.$message.error(res.message);
                        }
                    }))
                }

            },
            channelUpdatedDis(){
                let _this = this;
                _this.liveController.channelAttrUpdatedDis((name,value,v)=>{
                    console.log('%c学员频道属性更新变化名' + name + ":" + value + ":" + v,'background:yellow;color:#fff;font-size:20px;');
                    if(v == "update"){
                        _this.updateObj[name] = value;
                        //开启全体禁言
                        if(name == "can_speak"){
                            if(value == "_0_"){
                                this.speakText = "取消禁言";
                            }else{
                                this.speakText = "全体禁言";
                            }
                            
                        }else if(name == "apply_user_list"){
                            var connectIndex = 0;
                            var tempIndex = 0;
                            var data = {
                                command:"apply"
                            }
                            var account = "";
                            var valueFomat = value.substring(value.indexOf("_")+1,value.length-1);
                            this.applyUserList = valueFomat.split("_");
                            var obj = this.applyUserList;
                            //如果已存在不执行
                            for(var j = 0; j < obj.length; j++){
                                if(this.temp[obj[j]] !== undefined){
                                    //console.log("已经存在");
                                }else{
                                    console.log("申请连线了");
                                    this.liveMemberArray.forEach((item,index)=>{
                                        if(item.identification == obj[j]){
                                            account = item.name + "_" + item.identification;
                                            _this.chatAll(data,_this,account,null,null,"no");
                                        }
                                    })
                                }
                            }
                            for(var i = 0; i < obj.length; i++){
                                connectIndex++;
                                this.temp[obj[i]] = "true"
                            }
                            for(var z in this.temp){
                                tempIndex++;
                            }
                            //删除了
                            if(connectIndex < tempIndex){
                                var objTemp = {};
                                obj.forEach((item,index)=>{
                                    objTemp[item] = "true";
                                })
                                for(var i in this.temp){
                                    if(objTemp[i] !== undefined){
                                        //console.log("没被删除");
                                        //console.log(i);
                                    }else{
                                        //console.log("被删除的元素");
                                        //console.log(i);
                                        delete this.temp[i];
                                    }
                                }
                            }
                            
                        }else if(name == "non_access_user_list"){
                            var valueFomat = value.substring(value.indexOf("_")+1,value.length-1);
                            this.kickOutList = valueFomat.split("_");
                        }
                    }
                })
            },
            liveOn(callback){
                let data = {
                    roomCode:this.authInfos.roomCode
                }
                model.liveRoomOnlineList(data, ( res => {
                    if(res.status == 200){
                        this.liveOnlineMember = res.data;
                        console.log("liveonlineMever",this.liveOnlineMember);
                        callback();
                    }else{
                        this.$message.error(res.message);
                    }
                }))
            },
			//某人加入直播间
            userJoinChannel(){
                 var _this = this;
                 _this.liveController.userJoinChannel((account,uid)=>{
                    console.log("加入了",account);
                    if(account.indexOf("直播课小助手") == -1&&account.indexOf("_") > -1&&account.indexOf("-") < 0){
                        console.log("加入直播间ss",account);
                        _this.comeLeftRoom = {
                            "type" : "come",
                            "account" : account
                        }
                    }
                    _this.$emit("userJoinChannel",account);
                    //非本班级成员
                    if(!(_this.liveMemberArray.some((item)=>{return (account.indexOf(item.identification)>-1)})))
                        return
                    //获取当前踢出人员列表，如果被踢出，当前人员进行离开信令
                    let flag = this.kickoutChat(account);
                    if(!!flag){
                        return;
                    }
                 })
             },
             //离开直播间
             userleaveChannel(){
                let _this = this;
                _this.liveController.userleaveChannel((account,uid)=>{
                    console.log("离开了",account);
                    if(account.indexOf("直播课小助手") == -1&&account.indexOf("_") > -1&&account.indexOf("-") < 0){
                       console.log("离开直播间ss",account);
                        _this.comeLeftRoom = {
                            "type" : "leave",
                            "account" : account
                        }
                    }
                    _this.$emit("userleaveChannel",account);
                    //非本班级成员
                    if(!(_this.liveMemberArray.some((item)=>{return (account.indexOf(item.identification)>-1)})))
                        return
                    //获取当前踢出人员列表，如果被踢出，当前人员进行离开信令
                    let flag = this.kickoutChat(account);
                    if(!!flag){
                        return;
                    }          
                    //检测退出，频道属性删除申请连线人员和已删除连线。
                    this.checkAppLeave(account,_this);
                    
                })
             },
             //删除
             kickoutChat(account){
                var list = this.kickOutList;
                var curAccount = account.split("_")[1];
                if(list.length > 0){
                    for(var i = 0; i < list.length; i++){
                        if(list[i] == curAccount){
                            return true;
                        }
                    }
                    return false;
                }
             },
             checkAppLeave(account,_this){
                //正在申请连线的用户
                if(_this.updateObj["apply_user_list"]){
                    var value = _this.updateObj["apply_user_list"];
                    var valueFomat = value.substring(value.indexOf("_")+1,value.length-1);
                    var applyUserList = valueFomat.split("_");
                    var curAccount = account.split("_")[1];
                    applyUserList.forEach((item,index)=>{
                        if(item.indexOf(curAccount) > -1){
                            applyUserList.splice(index,1);
                        }
                    })
                    setChannle("apply",this.liveController,applyUserList.join("_"));
                }
                //正在连线的用户
                if(_this.updateObj["connected_user_list"]){
                    var value = _this.updateObj["connected_user_list"];
                    var valueFomat = value.substring(value.indexOf("_")+1,value.length-1);
                    var connectUserList = valueFomat.split("_");
                    var curAccount = account.split("_")[1];
                    connectUserList.forEach((item,index)=>{
                        if(item.indexOf(curAccount) > -1){
                            connectUserList.splice(index,1);
                        }
                    })
                    setChannle("connect",this.liveController,connectUserList.join("_"));
                }
                //禁音频的用户列表
                if(_this.updateObj["connect_disaudio_list"]){
                    var value = _this.updateObj["connect_disaudio_list"];
                    var valueFomat = value.substring(value.indexOf("_")+1,value.length-1);
                    var connectDisaudioList = valueFomat.split("_");
                    var curAccount = account.split("_")[1];
                    connectDisaudioList.forEach((item,index)=>{
                        if(item.indexOf(curAccount) > -1){
                            connectDisaudioList.splice(index,1);
                        }
                    })
                    setChannle("disaudio",this.liveController,connectDisaudioList.join("_"));
                }
                //禁摄像头的视频
                if(_this.updateObj["connect_disvideo_list"]){
                    var value = _this.updateObj["connect_disvideo_list"];
                    var valueFomat = value.substring(value.indexOf("_")+1,value.length-1);
                    var connectDisvedioList = valueFomat.split("_");
                    var curAccount = account.split("_")[1];
                    connectDisvedioList.forEach((item,index)=>{
                        if(item.indexOf(curAccount) > -1){
                            connectDisvedioList.splice(index,1);
                        }
                    })
                    setChannle("disvideo",this.liveController,connectDisvedioList.join("_"));
                }
             },
			receiveMsg(){
                var _this = this;
                this.liveController.receiveChannelMsg(function(account,uid,msg){  
                    let data = JSON.parse(msg);
                    if(data.command == "TURN_OFF_ALL_MIC"){
                        _this.chatAll(data,_this,account,uid,msg,"no");
                    }else if(data.command == "TURN_ON_ALL_MIC"){
                        _this.chatAll(data,_this,account,uid,msg,"no");
                    }else if(data.command == "CHAT"){
                        console.log("statrus===",_this.lock);
                        if(_this.authInfos.account !== account && _this.lock){
                            _this.moreMsgAddFlag = true;
                        }
                        _this.chatNumTotal = _this.lock ? _this.chatLimit.max : _this.chatLimit.min;
                        if(!_this.lock){
                            // 如果聊天条数为最大聊天天数,进行删除,调整为最少条数 
                            if(_this.chatArray.length > _this.chatLimit.min){
                                 _this.chatArray.splice(_this.chatLimit.min);
                            }
                        }
                        if(_this.chatArray.length >= _this.chatNumTotal){
                            var deletes = _this.chatArray.splice(_this.chatArray[0],1);
                        }
                        //送花
                        if(data.chatMessage.msgType=="REWARD"){
                            _this.chatArray.push(data.chatMessage);
                        //聊天相关提示语
                        }else{
                            _this.chatAll(data,_this,account,uid,msg);
                        }
                       // console.log("最终数字显示=======",_this.chatArray.length);
                       // console.log("最终显示数组===",_this.chatArray);
                    }
                    
                });
                     
             },
             chatAll(data,_this,account,uid,msg,no){
                if(!no){
                    var msgs = data.chatMessage.content;
                }
                let type = _this.commonDataChat(data);
                let obj = {};
                let roleimg={Broadcaster:"/static/img/barrageOne.png",Assistant:'/static/img/barrageTwo.png',Audience:'/static/img/barrageThree.png'};
                //聊天内容
                if(type === "channelChat"){
                    let sobj = {
                        account:account,
                        role:data.fromRole,
                        msg:msgs
                    }
                    _this.$set(obj,'chat',sobj);
                    if(this.barrageFlag)
                        barrageWall.upWall(roleimg[data.fromRole], account.split('_')[0], msgs,data.fromRole);
                //私聊信息
                }else if(type === "PtoMsg"){
                    let sobj = {
                        account:account,
                        role:data.fromRole,
                        msg:msgs
                    }
                    _this.$set(obj,"PtoMsg",sobj);
                //公告内容
                }else if(type == "NOTICE"){
                    let sobj = {
                        account:account,
                        msg:msgs
                    }
                    _this.$set(obj,"notice",sobj);
                    if(this.barrageFlag)
                        barrageWall.upWall("/static/img/horn.png", "公告", msgs,"horn");
                //全体禁言已开始
                }else if(type == "turnOffAllMic"){

                    let sobj = {
                         msg:"全体禁言已开始"
                    }
                    _this.$set(obj,"turnOffAllMic",sobj);
                //全体禁言已结束
                }else if(type == "turnOnAllMic"){
                    let sobj = {
                         msg:"全体禁言已结束"
                    }
                    _this.$set(obj,"turnOnAllMic",sobj);
                //有人申请连线了
                }else if(data.command == "apply"){
                    let sobj = {
                            "account":account
                    }
                    _this.$set(obj,"apply",sobj);
                }
                _this.chatArray.push(obj);
                _this.chatScrollBottom();

                
             },
             //聊天信息
             //公告 -- 单聊  -- 私聊
             commonDataChat(data){
                if(data.command == "CHAT"){

                    //私聊
                    if(data.chatMessage.chatType == "USER"){
                        return "PtoMsg";
                    }

                    //公告
                    if(data.chatMessage.chatMessageType == "NOTICE"){

                        return "NOTICE";
                    }

                    //频道消息
                    if(data.chatMessage.chatMessageType == "CHAT"){
                        
                        return "channelChat";
                    }

                //全体禁言已结束
                }else if(data.command == "TURN_ON_ALL_MIC"){
                    return "turnOnAllMic";
                //全体禁言已开启
                }else if(data.command == "TURN_OFF_ALL_MIC"){
                    return "turnOffAllMic";
                }

             },
            //接收对点消息
            receivePtoP(){
                let _this = this;
                this.liveController.receiveDisPtoPMsg(function(account,uid,msg){
                    console.log("接受账号为：accountss");
                    console.log(account + uid);
                    let data = JSON.parse(msg);
                    if(typeof(data)=="object"){

                        let studentMember;
                        _this.liveMemberArray.forEach(item=>{
                            if(Boolean(data.to)&&data.to.indexOf(item.identification)>-1){
                                studentMember = item;
                            }
                        })
                        
                        if(data.command=="INV_ONINE"){
                            studentMember.connectState = "online";
                        }else if(data.command=="INV_CONNECT"){
                            studentMember.connectState = "connect";
                        }else if(data.command=="INV_OFFLINE"){
                            studentMember.connectState = "offline";
                        }else if(data.command == "CHAT"){
                            _this.chatAll(data,_this,account,uid,msg);
                        }
                    }
                })
            },
			//发送频道消息
            sendChannelMsgClick(formName){
                let _this = this;
                _this.lock = false;
                _this.$refs[formName].validate((valid) =>{
                    if(valid){
                        if(this.chatType == "single"){
                             Timer.sendTime({
                                 time:3,
                                 callback:function(status){
                                     if(status == 200){
                                        console.log("当发送");
                                       _this.singleSuccess();
                                       _this.roomChatSave();
                                       _this.chatScrollBottom();
                                       
                                     }else{
                                        _this.$message({
                                              message: '歇一会儿再发~',
                                              type: 'warning'
                                        });
                                     }
                                 }
                            });
                            
                        }else{
                            Timer.sendTime({
                                 time:3,
                                 callback:function(status){
                                     if(status == 200){
                                        _this.sendSucess();
                                        
                                     }else{
                                        _this.$message({
                                              message: '歇一会儿再发~',
                                              type: 'warning'
                                        });
                                     }
                                 }
                            });
                            
                        }  
                    }else{
                        console.log('error submit!!');
                        return false;
                    }
                })
                
            },
            roomChatSave(){
                 //发送后台接口
               let data = {
                 chatMessageType:"CHAT",
                 chatType:"USER",
                 content:this.form.textarea,
                 contentType:"TXT",
                 from:splitUid(this.authInfos.account),
                 fromRole:this.authInfos.role,
                 roomCode:this.authInfos.roomCode,
                 to:splitUid(this.chatSingleAccount)
               }
               model.liveRoomChatSave(data,(res)=>{
                    if(res.status == 200){
                        //发送消息成功
                        console.log("发送消息成功");
                        this.form.textarea = "";
                    }else{
                        this.$message.error(res.message);
                    }
               })
            },
            sendNoticeMsgClick(formName){
               let _this = this;
                this.$refs[formName].validate((valid) =>{
                    if(valid){
                        Timer.sendTime({
                             time:3,
                             callback:function(status){
                                 if(status == 200){
                                    _this.sendSucess();
                                 }else{
                                     _this.$message({
                                        message: '歇一会儿再发~',
                                        type: 'warning'
                                    });
                                 }
                             }
                        });
                           
                    }else{
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            singleSuccess(){
                //当前页面需展现内容
                let userName = storge.get("exp_name");
               // let uid = storge.get("exp_userId");
                let account = userName;
                let avatar = null,time = null;
                let objw={};
                let obj={
                    account:account,
                    msg:this.form.textarea,
                    role:this.authInfos.role,
                    to:this.staffname
                };
                this.$set(objw,"PtoMsg",obj);
                this.chatArray.push(objw);

                this.liveMemberArray.forEach((item,index)=>{
                    if(account == item.identification){
                        avatar = item.miniAvatar ? item.miniAvatar:"";
                    }
                })
                time = curDate("yyyy-MM-dd HH:mm");
                //发送信令
                console.log("发送账号为：");
                console.log(this.chatSingleAccount);
                console.log(sendChat("singleChat",this.form.textarea,this.authInfos.role,avatar,time));
                this.liveController.sendPtoPMsg(this.chatSingleAccount,sendChat("singleChat",this.form.textarea,this.authInfos.role,avatar,time));
                

            },
            tabChat(index){
                this.textareaFlag = "public";
                this.nowIndex2 = index;
                if(index === 0){
                    this.buttonGrayFlag = true;
                }else{
                    this.buttonGrayFlag = false;
                }
            },
             //禁言取消禁言
             allNoSpeak(){
                 
                var msg = {};
                var _this = this;  
                if(this.speakText == "全体禁言"){
                    Timer.sendTime({
                         time:3,
                         callback:function(status){
                             if(status == 200){
                                    msg ={
                                        "command":"TURN_OFF_ALL_MIC"
                                    }
                                    _this.speakText = "取消禁言";
                                    _this.speakFlag = false;
                                    _this.liveController.addChannelAttr("can_speak","_0_"); 
                               
                             }else{
                                _this.$message({
                                      message: '操作太频繁~',
                                      type: 'warning'
                                });
                             }
                         }
                     });
                                     
                }else{
                    
                    Timer.sendTime({
                         time:3,
                         callback:function(status){
                             if(status == 200){
                                msg =  {
                                     "command":"TURN_ON_ALL_MIC"
                                }
                                _this.speakText = "全体禁言";
                                _this.speakFlag = true;
                                _this.liveController.addChannelAttr("can_speak","_1_"); 
                               
                             }else{
                                _this.$message({
                                      message: '操作太频繁~',
                                      type: 'warning'
                                });
                             }
                         }
                     });   
                }
                this.liveController.sendChannelMsg(JSON.stringify(msg));
             },
             menus(){
                let _this = this;
             	_this.liveOn(function(){
                    _this.onlineData = [];
                    _this.liveMemberArray.forEach((item,index)=>{
                        _this.liveOnlineMember.forEach((ins,z)=>{
                            //console.log("ziaxian");
                            //console.log(ins);
                            if(item.role == "STUDENT"&&item.identification == ins.userId){
                                _this.onlineData.push(item);
                            }
                        })
                    })
                    console.log("zaixian");
                    console.log(_this.onlineData);
                });
                
             },
             menuItem(item){
                this.staffname = item == "所有人" ? "所有人" : item.name;
                this.chatSingleAccount = item.name + "_" + item.identification;
                if(item == "所有人"){
                    this.chatType = "chat";
                }else{
                    this.chatType = "single";
                }
             },
             speakSatus(command,item){
                console.log(item);
             },
             sendSucess(){
                var msg = {};
                var role = this.authInfos.role,uid = this.authInfos.uid,avatar=null,time=null;
                switch(this.nowIndex2){
                    case 0:
                    this.liveMemberArray.forEach((item,index)=>{
                        if(uid == item.identification){
                            avatar = item.miniAvatar ? item.miniAvatar:"";
                        }
                    })
                    time = curDate("yyyy-MM-dd HH:mm");
                    this.liveController.sendChannelMsg(sendChat("chat",this.form.textarea,role,avatar,time));
                    break;
                    case 1:
                    this.liveController.sendChannelMsg(sendChat("notice",this.formNotice.textareaNotice));
                    break;
                    default:
                }                  
                
                this.form.textarea = "";
                this.formNotice.textareaNotice = "";
                
            },   

		},
	}
</script>
<style lang="less" scopped>

.discuss{
    .sectionjoin{
        text-align: center;
    }
    ::-webkit-scrollbar {
        width: 10px;/*竖向滚动条的宽度*/
        height: 10px;/*横向滚动条的高度*/
    }
    /*滚动条轨道的样式*/
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        -webkit-border-radius: 10px;
        border-radius: 10px;
    }
    /*滚动条轨道内滑块的样式*/
    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 10px;
        border-radius: 10px;
        background: rgba(155,155,155,0.8);
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }
    .title{
        font-size: 14px;
        line-height: 25px;
        margin-bottom: 10px;
        .horn{
            display: inline-block;
            width: 16px;
            height: 13.6px;
            background-image: url(../../assets/img/liveIcon/horn.png);
            background-position: center center;
            background-size: 16px 13.6px;
            background-repeat: no-repeat;
            vertical-align:middle;
        }
        .text{
            color: #fff;
        }

        .yellow{
            color: #F8E71C;
        }
    }
    .title-top{
        width: 25%;
        margin-top: 14.3vh;
        right: -2vh;
        position: fixed;
        top: 0;
        background: #2e4567;
    }

    .title-none{
        background: none;
    }

    .con{
        padding:10px 20px 0 15px;
        line-height: 18px;
        font-size: 14px;
        height: 60vh;
        overflow-y:auto;
        word-break: break-all;
        position: relative;
        .noticeTop{
            background: #2e4567;
            //transition: .2s;
        }
        .sys{
            color:#FFBF55;
            line-height: 18px;
            margin-bottom: 6px;
        }
        .comin{
            background: #313844;
            border-radius: 100px;
            font-size: 14px;
            color: #666;
            padding:6px 25px 5px 25px!important;
            display: inline-block;
            line-height: 14px;
            margin: 1vh auto;
            border-radius: 20px;
            text-align: center;
        }
        .apply-connect{
            background: #292f3a;
            border-radius: 100px;
            font-size: 14px;
            color: #fcbd54;
            padding:5px 10px;
            line-height: 14px;
            margin: 1vh auto;
            border-radius: 20px;
            text-align: center;
            display: inline-block;
        }
        .chat{
            margin-bottom: 20px;
            li{
                color: #fff;
                font-size: 14px;
                line-height: 30px;

                .icon-identity,.icon-Audience{
                    padding:1px 4px 3px 4px;
                    background-image: linear-gradient(90deg,#248D53 0%, #00b883 100%);
                    border-radius: 2px;
                    margin-bottom: 2vh;
                    font-size: 12px;
                }
                .icon-Audience{
                    background-image: linear-gradient(90deg,#0B89C5 0%, #18B3D1 100%);
                }
                .name{
                    color:#4A90E2;
                }
                .text{
                    line-height: 20px;
                }
            }
            
        }
        .chat::-webkit-scrollbar {/*滚动条整体样式*/
            width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
            height: 6px;
        }
        .chat::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: rgba(0,0,0,0.1);
        }
        .chat::-webkit-scrollbar-thumb:hover {/*滚动条里面小方块hover*/
            background: rgba(0,0,0,0.4);
        }
        .chat::-webkit-scrollbar-track {/*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            border-radius: 0;
            background: rgba(0,0,0,0.1);
        }
    }
}
.inleftRoom{
    font-size: 14px;
    text-align: center;
    height: 30px;
    .name{
        color: #4A90E2;
    }
}
.moreMsg{
    background: rgba(0,151,145, 0.7);
    color: #fff;
    height: 26px;
    line-height: 26px;
    text-align: center;
    position: fixed;
    bottom: 202px;
    width: 18%;
    z-index: 50;
}
.sendMsg{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        .tab{
            background: #373D47;
            border-radius: 3px;
            width: 53%;
            padding: 0 9px;
            font-size: 14px;
            color: #9B9B9B;
            float: left;
            border-bottom: none!important;
        }
        .button-live{
            padding-top: 7px;
        }
        // .horn{
        //     display: inline-block;
        //     width: 10px;
        //     height: 13px;
        //     background-image: url(../../assets/img/liveIcon/horn.png);
        //     background-position: center center;
        //     background-size: 10px 13px; 
        //     background-repeat: no-repeat;
        //     vertical-align:middle;
        .gray-icon{
            color: #9B9B9B;
        }
        .button-gray{
            // background: #373D47;
            // border-radius: 3px;
            // display: inline-block;
            // width: 12vh;
            // height: 2.7vh;
            // background-image: url(../../assets/img/liveIcon/button-dis.png);
            // background-position: center center;
            // background-size: 12vh 2.7vh; 
            // background-repeat: no-repeat;
            // vertical-align:middle;
            span{
                color: #999;
            }
        }
        .tab-rg{
            margin-left: 20px;
            background: #373D47;
            border-radius: 3px;
            height: 37px;
            padding-top: 7px;
            width: 15%;
            text-align: center;
            font-size: 14px;
            color: #9B9B9B;
            float: left;
        }
        
        .cur{
            color: #3adbd2;
            background: #005A5E;
        }

        .textareaBg{
            background: #2d333e;
            height: 125px;
            margin-top: 0;
            position: relative;
            z-index: 10;
            .icon-all-nopeak{
                font-size: 14px;
                color: #289CF6;;
                display: inline-block;
                padding-top: 10px;
                margin-left: 10px;
            }
            .icon-cancel{
                font-size: 14px;
                color: #E49B54;
                display: inline-block;
                padding-top: 10px;
                margin-left: 10px;
                
            }
            .icon-send{
                background: #009791;
                padding: 3px 18px 4px 18px!important;
                display: inline-block;
                color: #fff;
                border-radius: 20px;
                float: right;
                margin-top: 2%;
                margin-right: 5%;
                border:0;
            }
            .icon-send-gray{
                background: #ccc;
                padding: 4px 8px!important;
                display: inline-block;
                color: #fff;
                border-radius: 12px;
                float: right;
                margin-top: 2%;
                margin-right: 5%;
                border:0;
            }
        }
    }
.bounceInUp {
  -webkit-animation: bounceInUp .6s;
  animation: bounceInUp .6s;
}
@-webkit-keyframes bounceInUp {
  from,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 3000px, 0);
    transform: translate3d(0, 3000px, 0);
  }

  /*60% {
    opacity: 1;
    -webkit-transform: translate3d(0, -20px, 0);
    transform: translate3d(0, -20px, 0);
  }

  75% {
    -webkit-transform: translate3d(0, 10px, 0);
    transform: translate3d(0, 10px, 0);
  }

  90% {
    -webkit-transform: translate3d(0, -5px, 0);
    transform: translate3d(0, -5px, 0);
  }*/

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 10vh, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes bounceInUp {
  from,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 3000px, 0);
    transform: translate3d(0, 3000px, 0);
  }

  /*60% {
    opacity: 1;
    -webkit-transform: translate3d(0, -20px, 0);
    transform: translate3d(0, -20px, 0);
  }

  75% {
    -webkit-transform: translate3d(0, 10px, 0);
    transform: translate3d(0, 10px, 0);
  }

  90% {
    -webkit-transform: translate3d(0, -5px, 0);
    transform: translate3d(0, -5px, 0);
  }*/

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

.fadeOut {
    /*animation: fadeOut 2s;*/
    opacity: 0;
    transition: .5s;
}
</style>