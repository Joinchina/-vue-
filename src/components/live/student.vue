<template>
	<div class="staff">
		<header class="title">
            <div class="right">
                登录学员
                <span style="font-size:16px;">
                    <span class="yellow">{{studentOnline.size + studentCalling.size + studentConnecting.size}}/</span><span>{{studentOnline.size + studentOffline.size + studentCalling.size + studentConnecting.size}}</span>
                </span>
            </div>
            <div class="left">
                连线

                <el-switch
                  @change="switchRadio"
                  v-model="switchs"
                  active-color="#13ce66">
                </el-switch>

            </div>

        </header>
        <el-input class="search-name" v-model="search" placeholder="搜索" @keyup.native.13="getStudentList"></el-input>
        <div class="no-data" v-show="noDataFlag">
            暂无数据
        </div>
        
        <div class="list-view" 
            v-show="!noDataFlag"
            ref="listBox"
            @scroll="handleScroll">
            <div class="hostName" v-show="!noDataFlag">
                <span class="icon-host"></span>
                <span class="icon-name">{{liveAuthInfo.broadcaster ? liveAuthInfo.broadcaster.name : ''}}</span>
            </div>
            <!-- 将父级撑起 -->
            <div class="list-view-phantom"       
                :style="{
                    height: contentHeight
                }">
            </div>
            <!-- 视口可见元素 -->
            <div>
                <ul class="list list-view-content" ref="content">
                    <li v-for="(item,index) in visibleData" :key="index">
                        <span :class="{'icon-assistant' : item.role == 'Assistant'}">
                            <img v-if="item.role == 'STUDENT'" :src="item.miniAvatar" :class="{'gray-img':item.connectState=='no-login'}">
                        </span>
                        <span class="icon-name">{{item.name}}
                            <!-- 设备检测结果 -->
                            <span class="xiinfo" v-if="item.connectState!='no-login'">
                                <img src="../../assets/images/liveIcon/tool12.png" alt="" v-if="item.camera==true">
                                <img src="../../assets/images/liveIcon/tool11.png" alt="" v-if="item.mic==true">
                            </span>   
                        </span>
                        <button  :disabled="Boolean(item.wating)" :class="{'no-login': item.connectState=='no-login','loading':Boolean(item.wating),linebg:true,'on-line':item.connectState=='online','off-line':item.connectState=='offline','connect':item.connectState=='connect'}" @click.stop="stuAttch(item)">
                            {{item.connectText}}
                            <div class="loading" v-if='Boolean(item.wating)'>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </button>
                        <img v-if="item.role == 'STUDENT'" aria-disabled="false" class="reward" @click.stop="sendSystem($event, item.identification,item.name)" src="../../assets/img/liveIcon/icon-reward.png" alt="奖励">
                        <el-dropdown v-if="item.role == 'STUDENT'&&item.role !=='Assistant'">
                            <span class="el-dropdown-link">
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="noSpeak(item)">{{item.nospeak}}</el-dropdown-item>
                                <el-dropdown-item @click.native="kickOuts(item,index)">{{item.kickout}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </li>
                </ul>
            </div>
        </div>
        
        
	</div>
</template>
<script>
	import { sendPtoP,sendChat,splitUid,setChannle,sliceArray,curDate,tourClassStatus} from '@/sw/utils/sig';
    import { delTip } from '@/global/open';
    import Timer from '@/sw/utils/timer';
    import { setInterval, clearInterval, setTimeout, clearTimeout, setImmediate } from 'timers';

    import Live from 'model/live/live'
	export default{
		data(){
			return{
				totalCount:0,
				onlineCount:0,
				search:"",
				switchs:true,
				connectedUserList:[],
				applyUserList:[],
				noSpeakUserList:[],
                kickOutList:[],
                permissions:false,              //权限获取标识
                attchented:false, //连线状态
                disaudioList:[],            //禁麦列表
                disVideoList:[],             //禁摄像头列表
                kickoutIndex:0,
                studentLength:0,
                onlineLength:0,
                closeLine:"0",
                taOperation:{},             //助教操作列表
                noDataFlag:false,
                nowname:'',//当前送花的人

                connectList:{},
                watingList:{},
                latestVersion:0,        // 增量成员接口版本号
                allMemebersMap: new Map(),  // 所有成员map
                allOnlineMembers: null,  // 所有成员map
                assistantOnline : new Map(),   // 助教在线
                assistantConnecting : new Map(),   // 助教连线
                studentConnecting : new Map(), // 学员连线
                studentOnline : new Map(), // 学员在线
                studentOffline : new Map(),    // 学员下线
                studentCalling : new Map(),    // 学员申请连麦
                renderMembersArr : [],    // 最终渲染的数组
                visibleData : [],   // 可见数据
                itemHeight : 76,    // 每列高度
            }
		},
		props:["hostFlag","liveController","connectStream","liveAuthInfo","channelUpdateObj",'inClass','updateAttchented','hours','minutes','seconds',"touring","tourClassFlag","cdnPushUrl"],
		watch:{
            //连麦人员列表
            connectedUserList:{
                handler(newVal,oldVal){
                    this.connectedUserList.map((item,index)=>{
                        if(item.trim()==""||item==null||item==undefined){
                            this.connectedUserList.splice(index,1);
                        }
                    })
                    console.warn(this.connectedUserList)
                },
                deep:true
            },
            // 申请人员列表
            applyUserList:{
                handler(newVal,oldVal){
                    this.applyUserList.map((item,index)=>{
                        if(item.trim()==""||item==null||item==undefined){
                            this.applyUserList.splice(index,1);
                        }
                    })
                },
                deep:true
            },
            //连线更改
            updateAttchented: {
                handler(n,o){
                    this.attchented = false;
                    // alert(n);
                }
            },

        },
        computed: {
            clazzId(){
                return this.$route.query.clazzId;
            },
            contentHeight() {
                return this.renderMembersArr.length * this.itemHeight + 'px';
            }
        },
		created(){
			//频道属性发生变化
            let _this = this;

            this.liveController.setInviteReceived(this.onInviteReceived);

             //接收点对点消息
            this.receivePtoP();


            //频道属性变化
            this.channelUpdatedStu();

            //页面加载完成函数
            // window.onload=()=>{
            //     this.windowOnLoad();
            // }

            //刷新前触发的函数
            window.onbeforeunload=(e)=>{
                e = e || window.event;
                if(this.liveAuthInfo.authInfo.role=="Broadcaster"){
                    let hostLiveStates = {
                        inClass: Number(this.inClass),
                        hours:this.hours,
                        minutes:this.minutes,
                        seconds:this.seconds,
                        // connected:this.connectedUserList
                    }
                    sessionStorage.setItem("hostLiveStates",JSON.stringify(hostLiveStates));
                    //推流停止，重新再进行推流
                    console.log("刷新前推流地址",this.cdnPushUrl);
                    this.liveController.unpublish();
                    this.liveController.cdnUnPublish(this.cdnPushUrl);
                    //失败
                }else{
                    let taLiveStates = {
                        attchented: this.attchented,
                    }
                    if(this.attchented){
                        this.liveController.invitateEndBySelf();
                    }
                    sessionStorage.setItem("taLiveStates",JSON.stringify(taLiveStates));
                    
                }
                if(e){
                    e.returnValue = "是否重新加载"
                }
                
                return "是否重新加载"
            }
            
        },
        mounted(){
            
        },
		methods:{
            
            // 奖励学员
            sendSystem(event, userId, name) {
                let second = 1000*60;
                let disable = event.target.attributes['aria-disabled'].value;                
                if(disable == 'true' && this.nowname==name) {
                    this.$message.error('1分钟内只能奖励一次');
                    return;
                } else {
                    // 发送系统消息，后台接口
                    this.nowname=name
                    this.succSystem(userId, name);
                    event.target.attributes['aria-disabled'].value = 'true';
                    setTimeout(() => {
                         event.target.attributes['aria-disabled'].value = 'false';
                    }, second)

                }
                
               
            },
            succSystem(userId, name) {
                let role = this.liveAuthInfo.authInfo.role;
                let msg = name + '收到了奖励';
                this.liveController.sendChannelMsg(sendChat("system",msg, role, null, null, 'REWARD', userId,name));

                let data = {
                    roomCode: this.liveAuthInfo.roomCode,
                    studentUserId: userId
                }
                Live.liveRoomSendFlower(data, (res => {
                    console.log("送花返回值===", res)
                    if(res.status == 200) {
                        console.log('送花奖励成功');
                    } else {
                        this.$message.error(res.message);
                    }
                }))

            },
            //切换连线
            switchRadio(){
                //可以开启连线
                if(this.switchs){
                    setChannle("canapply",this.liveController,"_1_");
                //关闭连线
                }else{
                    setChannle("canapply",this.liveController,"_0_");
                }
            },
			channelUpdatedStu(){
				let _this = this;

                _this.liveController.channelAttrUpdatedStu((name,value,v)=>{
                    console.log('%c学员频道属性更新变化名' + name + ":" + value + ":" + v,'background:red;color:#fff;font-size:20px;');
                    if(name=="apply_user_list"||name == "connected_user_list"){
                        this.applyUserList = value.split("_");
                        this.membersSort(3,this.applyUserList);
                        
                    }else if(name=="connect_resolution"){
                        this.liveController.setConnectQuality(value);
                    }else if(name == "non_speak_user_list"){
                            let valueFomat = value.substring(value.indexOf("_")+1,value.length-1);
                            this.noSpeakUserList = valueFomat.split("_");
  
                            let indexsNum;
                            
                            for(let i in this.noSpeakUserList){
                                let item = this.allMemebersMap.get(this.noSpeakUserList[i])
                                if(item){
                                    item.nospeak = "取消禁言";
                                }
                            }
                        
                    }else if(name=="connect_disaudio_list"){
                        let val = value.substring(value.indexOf("_")+1,value.length-1);
                        let disaudio = val.split("_");
                        this.disaudioList = disaudio;
                        this.connectStream.map((item,index)=>{
                            if(disaudio.includes(String(item.getId()))){
                                item.closeAudio = true;
                            }else{
                                item.closeAudio = false;
                            }
                        })
                    }else if(name=="connect_disvideo_list"){
                        if(value == ""){
                            this.disVideoList = [];
                            return;
                        }
                        let val = value.substring(value.indexOf("_")+1,value.length-1);
                        console.log("warn===",val);                            
                        let disaudio = val.split("_");
                        this.disVideoList = disaudio;
                        console.log("数组",this.disVideoList);
                        this.connectStream.map((item,index)=>{
                            if(disaudio.includes(String(item.getId()))){
                                item.closeVedio = true;
                            }else{
                                item.closeVedio = false;
                            }
                        })
                    }else if(name=="can_apply"){
                        let flag = Boolean(Number(value.match(/\d+/g)[0]));
                        this.switchs = flag;
                    }else if(name == "non_access_user_list"){
                        var valueFomat = value.substring(value.indexOf("_")+1,value.length-1);
                        this.kickOutList = valueFomat.split("_");
                        this.membersSort(6)
                    }else if(name=="tourclass"){
                        this.$emit('update:touring',Boolean(Number(value.match(/\d+/g)[0])));
                    }
                })
            	
			},
			//搜索成员
			getStudentList(){
				let searchQuery = this.search.trim();
                let data = [...this.assistantConnecting.values()].concat([...this.studentConnecting.values()], [...this.studentCalling.values()] ,[...this.assistantOnline.values()],  [...this.studentOnline.values()], [...this.studentOffline.values()]);
				if(searchQuery){
					data = data.filter(function(row) {
                        return (String(row["name"]).toLowerCase().indexOf(searchQuery) > -1) && row.role == "STUDENT";
                    })
                    if(data.length == 0){
                        this.noDataFlag = true;
                    }else{
                        let time = this.noDataFlag ? 200 : 0;
                        this.noDataFlag = false;
                        this.renderMembersArr = data;
                        this.updateVisibleData();
                        
                    }
				}else{
                    this.noDataFlag = false;
                    this.renderMembersArr = [...this.assistantConnecting.values()].concat([...this.studentConnecting.values()], [...this.studentCalling.values()] ,[...this.assistantOnline.values()],  [...this.studentOnline.values()], [...this.studentOffline.values()]);
                    this.updateVisibleData();
				}
			},
   			//禁言
   			noSpeak(item){
                let account = item.name + "_" + item.identification;
                let _this = this;
                if(item.nospeak == "禁言"){
                    Timer.sendTime({
                         time:3,
                         callback:function(status){
                             if(status == 200){
                                item.nospeak == "取消禁言";
                                //禁言
                                var msg = {
                                 "command":"TURN_OFF_SINGLE_MIC",
                                 "fromRole":"Broadcaster"
                                }
                                
                                _this.noSpeakUserList.push(splitUid(account));
                                console.log("禁言用户");
                                console.log(_this.noSpeakUserList);
                                setChannle("noSpeak",_this.liveController,_this.noSpeakUserList.join("_"));
                                _this.liveController.sendPtoPMsg(account,JSON.stringify(msg));
                             }else{
                                 _this.$message({
                                    message: '操作太频繁~~',
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
                                item.nospeak = "禁言";
                                var msg = {
                                 "command":"TURN_ON_SINGLE_MIC",
                                 "fromRole":"Broadcaster"
                                }
                                sliceArray(_this.noSpeakUserList,splitUid(account));
                                console.log("取消禁言");
                                console.log(_this.noSpeakUserList);
                                setChannle("noSpeak",_this.liveController,_this.noSpeakUserList.join("_"));
                                _this.liveController.sendPtoPMsg(account,JSON.stringify(msg));
                             }else{
                                 _this.$message({
                                    message: '操作太频繁~~',
                                    type: 'warning'
                                });
                             }
                         }
                    });
                    

                }
                
            },
               
   			//踢出
   			kickOuts(item,index){
                let str = "是否要将此学员进行踢出课堂";
                this.kickoutIndex = index;
                delTip(this, str, this.kickoutUser,item);
   				

   			},
            kickoutUser(item){ 
                if(item.connectState == "offline" || item.connectState == "connect"){
                    this.$confirm("是否挂断连线？", '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.liveController.invitateEndBySelf();
                        this.liveController.attachment(false,(res)=>{
                            this.attchented=false;
                            console.log(this.attchented);
                            clearInterval(this.connectInfo.interval);this.connectInfo.time='00:00'
                        })
                        //挂断

                    });
                    return;
                }
                if(this.onlineLength > 0){
                    this.onlineLength--;
                }
                if(this.studentLength>0){
                    this.studentLength--;
                }
                item.connectState = "no-login";
                let account = item.name + "_" + item.identification;
                console.log("当前账号" + account + "被踢出");
                let msg = sendPtoP("kick_out");
                console.log(msg);
                this.liveController.sendPtoPMsg(account,msg);
                
                this.kickOutList.push(splitUid(account));
                console.log("踢出的用户集合");
                setChannle("black",this.liveController,this.kickOutList.join("_"));



                
                 // 踢出传给后台
                let data = {
                    roomCode: this.liveAuthInfo.roomCode,
                    studentUserId: item.identification
                }
                Live.liveRoomKickout(data, (res => {
                    console.log("踢出返回值===", res)
                    if(res.status == 200) {
                        console.log('踢出成功');
                    } else {
                        this.$message.error(res.message);
                    }
                }));
            },
            //连麦人员下线
            attachmentOffline(stream){
                this.liveController.attachmentOffline(stream);
            },
            //学员连线点击
            stuAttch(parma){
                //巡课 --助教-主播连线操作，当前巡课关闭
                if(this.touring&&!this.tourClassFlag){
                    //alert("正在巡课",JSON.stringify(parma));
                    this.liveController.sendChannelMsg(tourClassStatus("TOURCLASS_OVER", null, null, null, null, null),()=>{
                        this.$emit('update:touring', false);
                        parma.wating=true;
                        setTimeout(()=>{
                                this.connectHandle(parma);
                        },3000)
                    });
                //非巡课
                }else{
                    this.connectHandle(parma);
                }
            },
            
            /**
             * 邀请人员连麦上线---online
             */
            onlineHandler(parma){
                if(this.connectedUserList.length==6){
                    this.$message.error('最多支持6人同时连线');
                    return
                }
                //主播主动邀请的事件
                let params = {
                    account:parma.name+'_'+parma.identification,                //账号
                    onInviteReceivedByPeer:(extra)=>{   //对方收到连麦邀请
                            
                    },
                    onInviteAcceptedByPeer:(extra)=>{   //对方接受连麦邀请

                    },
                    onInviteEndByMyself:(extra)=>{   //本地挂断连麦回调

                    },
                    onInviteEndByPeer:(extra)=>{   //对方挂断连麦回调
                        if(extra.length>1&&JSON.parse(extra).permissions=="denied"){
                            this.$message.error("对方无可用设备，无法连线");
                            parma.wating=false;
                            clearTimeout(parma.timeout);
                            this.attachmentOffline(parma);
                            
                        }else{
                            // this.$message.success("连线断开连接");
                        }
                        //连线中学员-1
                        sliceArray(this.connectedUserList,parma.identification);
                    },
                    onInviteRefusedByPeer:(extra)=>{
                        /** 
                         * 对方拒绝连麦邀请
                         */
                        this.$message.error("对方无可用设备，无法连线");
                        parma.wating=false;
                        clearTimeout(parma.timeout);
                        //连线中学员-1
                        sliceArray(this.connectedUserList,parma.identification);
                        parma.connectState = 'online';
                        parma.connectText='连线';
                        if(this.taOpraFlag){
                            let msg = {
                                command: "STU_REFUSE_LINK",
                                to: parma.name+'_'+parma.identification,
                                fromRole:'Broadcaster'
                            }
                            console.warn(this.taOperation[parma.name+'_'+parma.identification]);
                            this.liveController.sendPtoPMsg(this.taOperation[parma.name+'_'+parma.identification],JSON.stringify(msg));
                        }
                        
                    }
                    
                }
                this.liveController.invitatePerson(params);
                parma.wating=true;
                this.connectedUserList.includes(parma.identification)?'':this.connectedUserList.push(parma.identification);
                parma.timeout = setTimeout(()=>{
                    if(parma.wating){
                        this.attachmentOffline(parma);
                        //连线学员-1
                        sliceArray(this.connectedUserList,parma.identification);
                        // setChannle("connected",this.liveController,this.connectedUserList.join("_"));
                        parma.wating=false; 
                    }
                },1000*15)
            },
            
            //右侧学员列表连线按钮事件
            connectHandle(parma){
                if(this.hostFlag){
                    if(!this.inClass){
                        this.$message.error('请先开始上课');
                        return
                    }
                    this.taOpraFlag=false;
                    if(parma.connectState=="online"){
                        this.onlineHandler(parma);
                    }else if(parma.connectState=="connect"){
                        //学员邀请连麦的事件---接受连麦邀请
                        if(this.connectedUserList.length==6){
                            this.$message.error('最多支持6人同时连线');
                            return
                        }
                        if(parma.InviteAccept){
                            parma.InviteAccept('');
                        }else{
                            let params = {
                                account:parma.name+'_'+parma.identification,                //账号
                                onInviteEndByMyself:(extra)=>{   //本地挂断连麦回调
                                    this.$message.success("下线成功");
                                },
                                onInviteEndByPeer:(extra)=>{   //对方挂断连麦回调
                                    this.$message.success("对方下线成功");
                                },
                                onInviteRefusedByPeer:(extra)=>{ // 对方拒绝回调
                                    this.$message.error("对方无可用设备，无法连线");
                                    parma.wating=false;
                                    clearTimeout(parma.timeout);
                                    //连线中学员-1
                                    sliceArray(this.connectedUserList,parma.identification);
                                    parma.connectState = 'online';
                                    parma.connectText='连线';
                                    console.log('拒绝的');
                                    if(this.taOpraFlag){
                                        let msg = {
                                            command: "STU_REFUSE_LINK",
                                            to: parma.name+'_'+parma.identification,
                                            fromRole:'Broadcaster'
                                        }
                                        console.warn(this.taOperation[parma.name+'_'+parma.identification]);
                                        this.liveController.sendPtoPMsg(this.taOperation[parma.name+'_'+parma.identification],JSON.stringify(msg));
                                    }
                                }
                                
                            }
                            this.liveController.invitatePerson(params);
                        }
                        //申请连线人员 -1
                        sliceArray(this.applyUserList,parma.identification);
                        setChannle("apply",this.liveController,this.applyUserList.join("_"));
                        //连线人员  +1
                        this.connectedUserList.includes(parma.identification)?"":this.connectedUserList.push(parma.identification);
                        parma.wating=true;
                        parma.timeout = setTimeout(()=>{
                            if(parma.wating){
                                this.attachmentOffline(parma);
                                //连线学员-1
                                sliceArray(this.connectedUserList,parma.identification);
                                parma.wating=false;
                            }
                        },1000*15)
                    }else if(parma.connectState=="offline"){
                        //学员下线事件
                        let _this = this;
                        this.attachmentOffline(parma);
                        parma.wating=true;

                        parma.timeout = setTimeout(()=>{
                            if(parma.wating){
                                // this.attachmentOffline(parma);
                                this.mandatoryOffline(parma);
                                $('#liveItem'+parma.identification).remove();
                                parma.connectState = 'online';
                                parma.connectText='连线';
                                parma.wating=false;
                            }
                        },1000*15)
                    }
                }else{
                    if(!this.inClass){
                        this.$message.error('主播还未开始上课');
                        return
                    }
                    let hostAccount = this.liveAuthInfo.broadcaster.name+"_"+this.liveAuthInfo.broadcaster.id;
                    if(parma.connectState=="online"){
                        if(this.connectedUserList.length==6){
                            this.$message.error('最多支持6人同时连线');
                            return
                        }
                        let msg = {
                            command: "INV_ONINE",
                            to: parma.name+'_'+parma.identification,
                            fromRole:'Assistant'
                        }
                        this.liveController.sendPtoPMsg(hostAccount,JSON.stringify(msg));
                        parma.wating=true;


                        //连线人员  +1
                        this.connectedUserList.includes(parma.identification)?"":this.connectedUserList.push(parma.identification);
                        parma.timeout = setTimeout(()=>{
                            if(parma.wating){
                                sliceArray(this.connectedUserList,parma.identification);
                                parma.wating=false;
                            }
                        },1000*15)
                    }else if(parma.connectState=="connect"){
                        if(this.connectedUserList.length==6){
                            this.$message.error('最多支持6人同时连线');
                            return
                        }
                        let msg = {
                            command: "INV_CONNECT",
                            to: parma.name+'_'+parma.identification,
                            fromRole:'Assistant'
                        }
                        this.liveController.sendPtoPMsg(hostAccount,JSON.stringify(msg));
                        parma.wating=true;
                        //连线人员  +1
                        this.connectedUserList.includes(parma.identification)?"":this.connectedUserList.push(parma.identification);
                        parma.timeout = setTimeout(()=>{
                            if(parma.wating){
                                sliceArray(this.connectedUserList,parma.identification);
                                parma.wating=false;
                            }
                        },1000*15)
                    }else if(parma.connectState=="offline"){
                        let msg = {
                            command: "INV_OFFLINE",
                            to: parma.name+'_'+parma.identification,
                            fromRole:'Assistant'
                        }
                        this.liveController.sendPtoPMsg(hostAccount,JSON.stringify(msg));
                        parma.wating=true;

                        parma.timeout = setTimeout(()=>{
                            if(parma.wating){
                                parma.wating=false;
                            }
                        },1000*15)
                    }
                }
            },

            //助教连线被挂断
            taEndByPeer(){
                let _this = this;
                //助教被助教、或主播下线
                _this.$store.commit('assisCloseLine',_this.closeLine);
                _this.closeLine = "1";
                if(_this.attchented){
                    _this.attchented = false;
                    _this.liveController.attachment(false,(res)=>{
                        let taItem = this.allMemebersMap.get(this.liveAuthInfo.authInfo.uid);
                        taItem.connectState = "online";
                        taItem.connectText = '连线';
                        taItem.wating=false;
                        clearTimeout(taItem.timeout);
                        sliceArray(this.connectedUserList,taItem.identification);
                    })
                }
            },

            onInviteReceived(call){
                let _this = this;
                // localStorage.setItem('callArray',JSON.stringify(call));
                return new Promise((reslove,reject)=>{
                    if(_this.liveAuthInfo.authInfo.role=="Broadcaster"){
                        //主播状态的后续操作
                        //申请连线用户集合  +1
                        this.applyUserList.includes(splitUid(call.peer))?"":this.applyUserList.push(splitUid(call.peer));
                        console.warn("申请连线用户测试");
                        console.warn(this.applyUserList);
                        setChannle("apply",this.liveController,this.applyUserList.join("_"));
                        let memberItem = this.allMemebersMap.get(call.peer.split("_")[1]);
                        // memberItem.connectState = "connect";
                        // memberItem.connectText = "接通";
                        memberItem.InviteAccept = call.channelInviteAccept;       //接受邀请的函数
                        memberItem.InviteRefuse = call.channelInviteRefuse;       //拒绝邀请的函数
                        let params = new Object();
                        params.punStr = new Function();
                        params.onInviteEndByPeer = ()=>{
                            /**
                             * 对方挂断回调
                             */
                            sliceArray(this.applyUserList,splitUid(call.peer));
                            sliceArray(this.connectedUserList,splitUid(call.peer));
                            setChannle("apply",this.liveController,this.applyUserList.join("_"));
                            memberItem.connectState = "online";
                            memberItem.connectText = "连线";

                        }
                        params.onInviteRefusedByPeer = (extra)=>{
                            /**
                             * 对方拒绝回调
                             */
                            sliceArray(this.applyUserList,splitUid(call.peer));
                            sliceArray(this.connectedUserList,splitUid(call.peer));
                            setChannle("apply",this.liveController,this.applyUserList.join("_"));
                            memberItem.connectState = "online";
                            memberItem.connectText = "连线";
                            this.$message.error("对方无可用设备，无法连线");
                            memberItem.wating=false;
                            clearTimeout(memberItem.timeout);
                            if(this.taOpraFlag){
                                let msg = {
                                    command: "STU_REFUSE_LINK",
                                    to: memberItem.name+'_'+memberItem.identification,
                                    fromRole:'Broadcaster'
                                }
                                console.warn(this.taOperation[memberItem.name+'_'+memberItem.identification]);
                                this.liveController.sendPtoPMsg(this.taOperation[memberItem.name+'_'+memberItem.identification],JSON.stringify(msg));
                            }
                            
                        }
                        
                        reslove(params);
                        if(call.extra.length>1&&JSON.parse(call.extra).refresh_reconnect){
                            this.connectHandle(memberItem);
                        }
                    }else{
                        //助教状态的后续操作
                        let taItem = this.allMemebersMap.get(this.liveAuthInfo.authInfo.uid);
                        if(_this.attchented){
                            let params = new Object();
                            params.role = this.liveAuthInfo.authInfo.role;
                            params.punStr = new Function();
                            params.onInviteEndByPeer = ()=>{
                                _this.taEndByPeer();
                            }
                            reslove(params);
                        }else{
                            _this.attchented = true;
                            _this.liveController.getVedioInput((device)=>{
                                if(device.length>0){
                                    _this.liveController.publishSuccess(()=>{
                                        // _this.liveController.palyStream(res);
                                        taItem.connectState = "offline";
                                        taItem.connectText = '下线';
                                        taItem.wating=false;
                                        clearTimeout(taItem.timeout);
                                        this.connectedUserList.includes(taItem.identification)?"":this.connectedUserList.push(taItem.identification);
                                    })
                                    _this.liveController.attachment(true,(res)=>{
                                        res.closeAudio=false;
                                        res.closeVedio=false;
                                        res.accountName = this.liveAuthInfo.authInfo.name
                                        if(document.querySelector('#liveItem'+res.getId())==null){
                                            _this.connectStream.push(res);
                                        }
                                        this.membersSort(7)
                                        let params = new Object();
                                        params.role = this.liveAuthInfo.authInfo.role;
                                        params.onInviteEndByPeer = ()=>{
                                            _this.taEndByPeer();
                                        }
                                        params.punStr = ()=>{

                                            if(res){
                                                let timing = setInterval(()=>{
                                                    if(_this.liveController.getPermissions()=="requesting"){
                                                    }else if(_this.liveController.getPermissions()=="denied"){
                                                        clearInterval(timing);
                                                        this.$message.error('获取摄像头与麦克风权限失败');

                                                        call.channelInviteRefuse(JSON.stringify({permissions:"denied"}));
                                                    }else if(_this.liveController.getPermissions()=="allowed"){

                                                        clearInterval(timing);
                                                        call.channelInviteAccept("");
                                                        if(this.disaudioList.includes(this.liveAuthInfo.authInfo.uid)){
                                                            this.liveController.closeAudioHandle(true);
                                                            res.closeAudio = true;
                                                        }
                                                        if(this.disVideoList.includes(this.liveAuthInfo.authInfo.uid)){
                                                            this.liveController.closeVedioHandle(true);
                                                            res.closeVedio=true;
                                                        }
                                                    
                                                        // _this.liveController.publish();
                                                    }
                                                    
                                                },500);
                                                
                                            }
                                            
                                        }
                                        reslove(params);
                                    })
                                }else{
                                    _this.$message.error('无可用设备');  
                                    _this.attchented = false;
                                    $('#liveItem'+_this.liveAuthInfo.authInfo.uid).remove()
                                    call.channelInviteRefuse(JSON.stringify({permissions:"denied"}));
                                    taItem.connectState = "online";
                                    taItem.connectText = '连线';
                                    taItem.wating=false;
                                    clearTimeout(taItem.timeout);
                                    sliceArray(this.connectedUserList,taItem.identification);
                                }
                            })
                            
                        }
                    }
                })
                
            },

            //接收对点消息
            receivePtoP(){
                let _this = this;
                this.liveController.receivePtoPMsg(function(account,uid,msg){
                    console.log("accountss");
                    console.log(account);
                    console.log(uid)
                    let data = JSON.parse(msg);
                    if(typeof(data)=="object"){
                        console.log(data);
                        let studentMember = {};
                        if(data.to){
                            studentMember = _this.allMemebersMap.get(data.to.split('_')[1]);
                        }
                        
                        
                        if(data.command=="INV_ONINE"){
                            studentMember.connectState = "online";
                            _this.connectHandle(studentMember);
                            _this.taOperation[data.to]=account;
                            _this.taOpraFlag=true;
                        }else if(data.command=="INV_CONNECT"){
                            studentMember.connectState = "connect";
                            _this.connectHandle(studentMember);
                            _this.taOperation[data.to]=account;
                            _this.taOpraFlag=true;
                        }else if(data.command=="INV_OFFLINE"){
                            studentMember.connectState = "offline";
                            _this.connectHandle(studentMember);
                        }else if(data.command=="CLOSE_AUDIO"){
                            _this.liveController.closeAudioHandle(true);
                        }else if(data.command=="OPEN_AUDIO"){
                            _this.liveController.closeAudioHandle(false);
                        }else if(data.command=="CLOSE_VEDIO"){
                            _this.liveController.closeVedioHandle(true);
                        }else if(data.command=="OPEN_VEDIO"){
                            _this.liveController.closeVedioHandle(false);
                        }else if(data.command=="STU_REFUSE_LINK"){
                            _this.$message.error('对方无可用设备，无法连线');
                            let studentItem = _this.allMemebersMap.get(data.to.split('_')[1]);
                            studentItem.wating=false;
                            clearTimeout(studentItem.timeout);
                        }
                        
                    }else{
                        _this.chatAll(data,_this,account,uid,msg);
                    }
                })
            },

            // 学员强制下麦信令
            mandatoryOffline(parma){
                let msg = {
                    "command":"shutdown_link",
                    "fromRole":"Broadcaster",
                }
                this.liveController.sendPtoPMsg(parma.name+'_'+parma.identification,JSON.stringify(msg));
            },

            //刷新后加载事件
            windowOnLoad(){
                let _this = this;
                setTimeout(()=>{
                    console.warn("频道信息===",this.liveAuthInfo)
                    if(this.liveAuthInfo.authInfo.role=="Broadcaster"){
                        let hostLiveStates = sessionStorage.getItem('hostLiveStates');
                        if(hostLiveStates){
                            hostLiveStates = JSON.parse(hostLiveStates);
                            this.$emit("updateinClass",Boolean(Number(hostLiveStates.inClass)))
                            this.$emit("update:hours",(hostLiveStates.hours))
                            this.$emit("update:minutes",(hostLiveStates.minutes))
                            this.$emit("update:seconds",(hostLiveStates.seconds))                            
                        }
                    }
                },1000)
            },

            getOnlineMemberList(callback){
                let data = {
                    roomCode:this.liveAuthInfo.authInfo.roomCode
                }
                Live.liveRoomOnlineList(data, ( res => {
                    if(res.status == 200){
                        this.allOnlineMembers = res.data;
                        console.log(this.allOnlineMembers)
                        callback();
                    }else{
                        this.$message.error(res.message);
                    }
                }))
            },
            //获取全部成员列表
            getAllMemebers(){
                this.getOnlineMemberList(()=>{
                    let data = {
                        clazzId:this.clazzId,
                        version:this.latestVersion,
                    }
                    Live.liveMemberList(data, ( res => {
                        if(res.data.latestVersion){
                            this.latestVersion = res.data.latestVersion;
                        }
                        //初始化数据
                        if(res.data.all&&res.data.all.length > 0){
                            /**
                             * 遍历接口返回的数组
                             * 把数组初始化为map =》allMemebersMap
                             * map里面只有助教和学员
                             * 只在页面加载完成后执行一次
                             */
                            res.data.all.forEach((item,index)=>{
                                item.connectState = "no-login";
                                item.connectText = "连线";
                                item.nospeak = "禁言";
                                item.kickout = "踢出";
                                item.wating=false;
                                item.miniAvatar = item.miniAvatar ? item.miniAvatar : "/static/img/noavatar.png";
                                if(item.role != "STUDENT"){
                                    if(item.identification == this.liveAuthInfo.host){
                                        item.role = "Broadcaster";
                                    }else{
                                        item.role = "Assistant";
                                        if(item.identification == this.liveAuthInfo.authInfo.uid){
                                            item.connectState = "online";
                                            this.assistantOnline.set(item.identification,item);
                                        }
                                    }
                                }else{
                                    this.studentOffline.set(item.identification,item);
                                }
                                if(item.role != "Broadcaster"){
                                    this.allMemebersMap.set(item.identification,item);
                                }
                            })
                        }
                        
                        //删除数据
                        if(res.data.delete&&res.data.delete.length > 0){
                            let deletes = res.data.delete;
                            for (let i in deletes){
                                this.allMemebersMap.delete(deletes[i]);
                                this.studentOffline.delete(deletes[i]);
                                this.studentOnline.delete(deletes[i]);
                            }
                        }
                        //插入数据
                        if(res.data.insert&&res.data.insert.length > 0){
                            let insertArr = res.data.insert;
                            for (let i in insertArr){
                                insertArr[i].connectState = "no-login";
                                insertArr[i].connectText = "连线";
                                insertArr[i].nospeak = "禁言";
                                insertArr[i].kickout = "踢出";
                                insertArr[i].wating=false;
                                insertArr[i].miniAvatar = insertArr[i].miniAvatar ? insertArr[i].miniAvatar : "/static/img/noavatar.png";
                                if(insertArr[i].role != "STUDENT"){
                                    insertArr[i].role = "Assistant";
                                }else{
                                    this.studentOffline.set(insertArr[i].identification,insertArr[i]);
                                }
                                this.allMemebersMap.set(insertArr[i].identification,insertArr[i]);
                            }
                        }
                        //更新列表属性
                        if(res.data.update&&res.data.update.length > 0){
                            let updateData = res.data.update;
                            console.log(updateData);
                                updateData.forEach((des,z)=>{
                                    let member = this.allMemebersMap.get(des.identification);
                                    member = Object.assign(member,des);
                                })
                        }
                        
                        window.requestAnimationFrame(this.membersSort);
                    }))
                })
                
            },

            // 数组排序，维护五个数组，
            /**
            * 助教在线：assistantOnline
            * 助教连线：assistantConnecting
            * 学员连线：studentConnecting
            * 学员在线：studentOnline
            * 学员下线：studentOffline
             */
            membersSort(type,userId){
                if(userId == this.liveAuthInfo.host) return
                /**
                 * type:
                 * 1: 成员加入直播间
                 * 2：成员离开直播间
                 * 3, 学员申请连线
                 * 4、成员上麦
                 * 5、成员下麦
                 * 6、踢出学员
                 * 7、助教自己上麦后排序
                 * 8、重置为初始化状态
                 */
                let memberInfo = null;
                if(userId && !Array.isArray(userId) && type){
                    memberInfo = this.allMemebersMap.get(userId);
                    if(!memberInfo) return
                }

                
                switch (type) {
                    case 1:
                        if(memberInfo.role == "STUDENT"){
                            memberInfo.connectState = "online";
                            memberInfo.connectText = "连线";
                            this.studentOffline.delete(userId);
                            this.studentOnline.set(userId,memberInfo);
                        }else{
                            memberInfo.connectState = "online";
                            memberInfo.connectText = "连线";
                            this.assistantOnline.set(userId,memberInfo);
                        }
                        
                        break;
                    case 2:   
                        memberInfo.connectState = "no-login";
                        memberInfo.connectText = "连线";
                        if(memberInfo.role == "STUDENT"){
                            this.studentOnline.delete(userId);
                            this.studentCalling.delete(userId);
                            this.studentConnecting.delete(userId);
                            this.studentOffline.set(userId,memberInfo);
                        }else{
                            this.assistantOnline.delete(userId);
                            this.assistantConnecting.delete(userId);
                        }
                        
                        break;
                    case 3:
                        let connectingArr = [...this.studentCalling.keys()]
                        for(let i in connectingArr){
                            if(connectingArr[i]){
                                let infoItem = this.studentCalling.get(connectingArr[i]);
                                infoItem.connectState = "online";
                                infoItem.connectText = "连线";
                                this.studentOnline.set(connectingArr[i],infoItem);
                            }
                            
                        }
                        this.studentCalling.clear();
                        for(let i in userId){
                            let infoItem = this.allMemebersMap.get(userId[i]);
                            if(infoItem){
                                infoItem.connectState = "connect";
                                infoItem.connectText = "接通";
                                this.studentCalling.set(userId[i],infoItem);
                                this.studentOnline.delete(userId[i]);
                            }
                            
                        }
                        break;
                    case 4:
                        clearTimeout(memberInfo.timeout);
                        memberInfo.connectState = "offline";
                        memberInfo.connectText = "下线";
                        memberInfo.wating=false;
                        
                        if(memberInfo.role == "STUDENT"){
                            this.studentOnline.delete(userId);
                            this.studentCalling.delete(userId);
                            this.studentConnecting.set(userId,memberInfo);
                        }else{
                            this.assistantOnline.delete(userId);
                            this.assistantConnecting.set(userId,memberInfo);
                        }
                        break;
                    case 5:
                        if(!memberInfo || memberInfo.connectState =="no-login"){
                            return
                        }
                        
                        clearTimeout(memberInfo.timeout);
                        memberInfo.connectState = "online";
                        memberInfo.connectText = "连线";
                        memberInfo.wating=false;
                        if(memberInfo.role == "STUDENT"){
                            this.studentConnecting.delete(userId);
                            this.studentOnline.set(userId,memberInfo);
                        }else{
                            this.assistantConnecting.delete(userId);
                            this.assistantOnline.set(userId,memberInfo);
                        }
                        break;
                    case 6 :
                        for(let i in this.kickOutList){
                            let key = this.kickOutList[i];
                            this.allMemebersMap.delete(key);
                            this.studentOnline.delete(key);
                            this.studentOffline.delete(key);
                        }
                        break;
                    case 7 :
                        let taItem = this.allMemebersMap.get(this.liveAuthInfo.authInfo.uid);
                        this.assistantOnline.delete(this.liveAuthInfo.authInfo.uid);
                        this.assistantConnecting.set(this.liveAuthInfo.authInfo.uid,taItem);
                        
                        break;
                    case 8 :
                        for(let i=0; i<this.allOnlineMembers.length; i++){
                            let mapKey = this.allOnlineMembers[i].userId.toString();
                            let memberInfo = this.allMemebersMap.get(mapKey);
                            
                            if(memberInfo){
                                this.studentOffline.delete(mapKey);
                                this.studentConnecting.delete(mapKey);
                                this.studentCalling.delete(mapKey);
                                this.assistantConnecting.delete(mapKey);
                                memberInfo.connectState = "online";
                                memberInfo.connectText = "连线";

                                if(memberInfo.role == "Assistant"){
                                    this.assistantOnline.set(mapKey,memberInfo);
                                }else{
                                    this.studentOnline.set(mapKey,memberInfo);
                                }
                            }
                        }
                        break;
                    default:
                        this.studentOnline.clear();
                        for(let i=0; i<this.allOnlineMembers.length; i++){
                            let mapKey = this.allOnlineMembers[i].userId.toString();
                            let memberInfo = this.allMemebersMap.get(mapKey);
                            if(memberInfo){
                                memberInfo.camera = this.allOnlineMembers[i].camera;
                                memberInfo.mic = this.allOnlineMembers[i].mic;
                            }
                            
                            if(memberInfo && (memberInfo.connectState != "connect" && memberInfo.connectState != "offline")){
                                memberInfo.connectState = "online";
                                memberInfo.connectText = "连线";
                                if(memberInfo.role == "Assistant"){
                                    this.assistantOnline.set(mapKey,memberInfo);
                                }else{
                                    this.studentOffline.delete(mapKey.toString());
                                    if(this.applyUserList.includes(memberInfo.identification)){
                                        memberInfo.connectState = "connect";
                                        memberInfo.connectText = "接通";
                                        this.studentCalling.set(mapKey,memberInfo);
                                    }else{
                                        this.studentOnline.set(mapKey,memberInfo);
                                    }
                                    
                                }
                            }
                        }
                        break;
                }
                
                this.renderMembersArr = [...this.assistantConnecting.values()].concat([...this.studentConnecting.values()], [...this.studentCalling.values()] ,[...this.assistantOnline.values()],  [...this.studentOnline.values()], [...this.studentOffline.values()]);
                setTimeout(this.handleScroll,200);
            },
            
            updateVisibleData(scrollTop) {
                scrollTop = scrollTop || 0;
                const visibleCount = Math.ceil(this.$el.clientHeight / this.itemHeight);  // 计算数据显示数量
                const start = Math.floor(scrollTop / this.itemHeight);  // 根据滚动高度，计算显示数据的开始位置
                const end = start + visibleCount;   // 计算显示数据的结束位置
                this.visibleData = this.renderMembersArr.slice(start, end); // 从所有数据里面截取除视口显示的数据
                this.$refs.content.style.webkitTransform = `translate3d(0, ${ start * this.itemHeight }px, 0)`; // 更新视口元素位置偏移量
            },

            handleScroll() {
                const scrollTop = this.$refs.listBox.scrollTop;
                this.updateVisibleData(scrollTop);
            }
		},
		
	}
</script>
<style type="text/css" lang="less" scopped>
@import "../../assets/reset-element-ui/sw.css";
.staff{
    width: 96%;
    margin: 0 auto;
    padding-left: .8%!important;
    .no-data{
        text-align: center;
        padding-top: 20px;
        font-size: 16px;
        color: #909399;
        height: 72vh;
    }
    .search-name{
        margin-top: 2vh;
        width:95%;
        position:relative;
        left:0;
    }
    .list{
        height: 72vh;
        overflow-y:hidden;
        margin-top: 1vh;
        .stleft{
            float: left;
            width: 55%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .strg{
            float: left;
            margin-top: 1px;

        }
        .reward {
            width: 17px;
            height: 18px;
            border-radius: 0;
            vertical-align: text-bottom;
            margin-right: 10px;
            margin-left: 10px;
            cursor: pointer;
        }
        img{
            width: 28px;
            height: 28px;
            border-radius: 50%;
        }
        .gray-img{
			-webkit-filter: grayscale(100%);
			-moz-filter: grayscale(100%);
			-ms-filter: grayscale(100%);
			-o-filter: grayscale(100%);
			filter: grayscale(100%);
			filter: gray;
        }
    }
    .list::-webkit-scrollbar {/*滚动条整体样式*/
        width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 8px;
    }
    .list::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.35);
        background: rgba(255,255,255,0.35);
    }
    .list::-webkit-scrollbar-thumb:hover {/*滚动条里面小方块hover*/
        background: rgba(255,255,255,0.5);
    }
    .list::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 0;
        background: rgba(255,255,255,0.10);
    }

    padding-left: 15px;

    .title{
        margin-right: 10%;
        padding-top: 3%;
        padding-bottom: 3%;
        color: #fff;
        font-size: 14px;
        background: none;
    }
    .left{
        float: left;
    }
    .rg{
        float: right;
        
    }
    .yellow{
        color: #FCBD54;
    } 

    .search{

    } 
    li:first-child{
        margin-top: 1.5vh!important;         
    }
    .hostName{
        margin: 20px 0;
        margin-bottom: 0px;
        .icon-host{
            display: inline-block;
            width: 26px;
            height: 26px;
            background: url(../../assets/img/liveIcon/host.png) no-repeat center center;
            background-size: 26px 26px;
            vertical-align: middle;
            cursor: pointer;

        }
        .icon-name{
            line-height: 20px;
            display: inline-block;
            width: 90px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
            margin-bottom: -6px;
        }
    }
    li{
        margin-top: 3.5vh;
        margin-bottom: 3.5vh;
        color: #fff;
        font-size: 14px;
        vertical-align: middle;

        .icon-assistant{
            display: inline-block;
            width: 26px;
            height: 26px;
            background: url(../../assets/img/liveIcon/assistant.png) no-repeat center center;
            background-size: 26px 26px;
            vertical-align: middle;

        }

        .icon-name{
            line-height: 20px;
            display: inline-block;
            width: 90px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: -6px;
        }
        .xiinfo{
            overflow: hidden;
            img{
                width: 13.5px;
                height: 16px;
            }
        }
        .linebg{
            cursor: pointer;
            background: rgba(0,0,0,0.74);
            border-radius: 45px;
        }
        button.linebg{
            padding: 2px 10px 4px 10px;
            position: relative;
            .loading{
                position: absolute;
                width: 100%;
                height: 100%;
                margin: 0 auto;
                left: 0;
                top: 4px;
            }
            .loading span{
                display: inline-block;
                width: 8px;
                height: 8px;
                margin-right: 5px;
                border-radius: 50%;
                background: lightgreen;
                -webkit-animation: load 1.04s ease infinite;
            }
            .loading span:last-child{
                margin-right: 0px; 
            }
            @-webkit-keyframes load{
                0%{
                    opacity: 1;
                }
                100%{
                    opacity: 0;
                }
            }
            .loading span:nth-child(1){
                -webkit-animation-delay:0.13s;
            }
            .loading span:nth-child(2){
                -webkit-animation-delay:0.26s;
            }
            .loading span:nth-child(3){
                -webkit-animation-delay:0.39s;
            }
            // .loading span:nth-child(4){
            //     -webkit-animation-delay:0.52s;
            // }
            // .loading span:nth-child(5){
            //     -webkit-animation-delay:0.65s;
            // }
        }
        button.loading{
            color: #000;
        }
        .on-line{
            color: #fff;
        }
        .off-line{
            color: #F5A623;
        }
        .no-login{
            color:#333;
        }
        .connect{
            color: #06CA96;
        }
        
    }
    
    .list-view {
        // flex: 6;
        height: 650px;
        overflow: auto;
        position: relative;
        // border: 1px solid #aaa;
    }
    .list-view::-webkit-scrollbar {/*滚动条整体样式*/
        width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 8px;
    }
    .list-view::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.35);
        background: rgba(255,255,255,0.35);
    }
    .list-view::-webkit-scrollbar-thumb:hover {/*滚动条里面小方块hover*/
        background: rgba(255,255,255,0.5);
    }
    .list-view::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 0;
        background: rgba(255,255,255,0.10);
    }
    .list-view-phantom {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        z-index: -1;
    }

    .list-view-content {
        left: 0;
        right: 20px;
        top: 40px;
        position: absolute;
    }

    .list-view-item {
        padding: 5px;
        color: #666;
        line-height: 30px;
        box-sizing: border-box;
    }
}
</style>