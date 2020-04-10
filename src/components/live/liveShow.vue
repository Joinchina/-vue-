<template>
    <div class="liveBox" v-loading="allLoading">
        <header>            
            <el-row :gutter="10" type="flex" justify="center">
                <el-col  :span="19">
                    <div class="fl">
                        <img class="iconImg" src="@/assets/img/liveIcon/liveIcon.png" alt="">
                        <span class="iconText">云课堂</span>
                        <p class="netWorkStates">
                            <b v-if="hostFlag">
                                <span>延迟：<em>{{systemsStates.aventerEnd2EndDelay}}ms</em></span>
                                <!-- <span>丢包率：<em>{{systemsStates.aventerPacketLossRate}}%</em></span> -->
                                <span>网速：<em>{{systemsStates.aventerRecvBitrate}}Kb/s </em></span>
                                <span v-if="cpuInfo.show">CPU：<em>{{cpuInfo.cpuLoad}}%</em></span>
                                <span v-if="systemsStates.aventerRecvBitrate<300&&inClass">网络：<em>差 </em></span>
                            </b>
                            <b class="roomPeople">({{viewPeople<0?0:viewPeople}}人观看)</b>
                        </p>
                    </div>

                    <div class="fl">
                        <ul class="operaBtn">
                            <li class="liOne">媒体库</li>
                            <li class="liTwo" @click="toolboxshow('this')">工具箱</li>
                            <li class="liThree" @click="openscreen" v-if="hostFlag">屏幕共享</li>
                             <li class="liFour"  @click="tourclassFn">巡课</li>
                            <li class="liFive" @click.stop="dialogVisible=true" v-if="hostFlag">设置</li>
                        </ul>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="fr rightCon" v-if="hostFlag">
                        <transition name="el-fade-in-linear">
                            <span class="timeLength" v-show="inClass">{{hours<10?"0"+hours:hours}}:{{minutes<10?"0"+minutes:minutes}}:{{seconds}}</span>
                        </transition>
                        <el-button class="remove-el-button" :class={inClass:inClass} @click.stop="inclassHandle" :loading="inClassTextFlag">{{inClassText}}</el-button>
                        <span class="scaleBtn" @click.stop="viewPortScale"></span>
                    </div>
                </el-col>
            </el-row>
        </header>

        <div class="streamBox">
            <el-row :gutter="10" type="flex" justify="center">
                <el-col :span="19">
                    <div class="grid-content bg-purple">
                        <div class="liveWrapper showbarrageBox" id="barrageBox">
                            <transition name="el-fade-in-linear">
                                <div class="playBtn" @click.stop="playHandler(hostStream[0])"  v-if="(!hostFlag&&inClass&&hostStream[0].autoplayFailed)"><span><img class="iconImg" :src="livingGif" alt="">正在直播中</span></div>
                            </transition>
                            <div class="noclass" v-if="!inClass&&!hostFlag">
                                <p>主播不在线～</p>
                            </div>
                            <div class="hostViewBox" v-for="(item,index) in hostStream" v-loading="item.loading" :key="index" :id="item.playAreaId+item.getId()"></div>
                        </div>
                        <div class="streamOpera" v-if="hostFlag">
                            <label class="volLabel" >
                                <em :class="{'volumnIcon':true, 'micIcon':true, 'micIconClosed':closeAudio}" @click="closeAudioHandle"></em>
                                <!-- <el-slider v-model="micVolumn"></el-slider> -->
                            </label>
                            <label class="volLabel">
                                <!-- <em class="volumnIcon outputIcon"></em> -->
                                <!-- <el-slider v-model="outputVolumn"></el-slider> -->
                            </label>
                            <button :class={barrageBtn:true,openBarrage:barrageFlag} @click.stop="barrageHandle">
                                <!-- {{barrageText}} -->
                                <em>弹</em>
                            </button>
                            <div class="cameraCon">
                                <em :class="{cameraIcon:true,cameraClosed:closeVedio}" @click.stop="closeVedioHandle"></em>
                                <b>摄像头：{{usedCameraLabel}}</b>
                                <button class="conBtn" @click="getCameraArr();cameraDialogVisible=true">切换</button>
                            </div>
                            <div class="detection" @click="tabledetection">
                                <el-tooltip class="item" effect="dark" content="设备检测" placement="top">
                                    <el-button></el-button>
                                </el-tooltip> 
                                <img src="../../assets/images/liveIcon/xitong.png" alt="">                                                          
                            </div>
                        </div>
                        <div :class={streamOpera:true,zjstreamOpera:!hostFlag} v-if="!hostFlag">
                            <div class="cameraCon">
                                <button :class={barrageBtn:true,openBarrage:barrageFlag} @click.stop="barrageHandle">
                                    <!-- {{barrageText}} -->
                                    <em>弹</em>
                                </button>
                                <label class="volLabel">
                                    <em class="volumnIcon outputIcon"></em><el-slider v-model="outputVolumn" @change="setVolume"></el-slider>
                                </label>
                                <em :class="{scaleIcon:true}" @click.stop="viewPortScale"></em>
                                <div class="detection" @click="tabledetection" style="margin:2px 10px">
                                    <el-tooltip class="item" effect="dark" content="设备检测" placement="top">
                                        <el-button></el-button>
                                    </el-tooltip> 
                                    <img src="../../assets/images/liveIcon/xitong.png" alt="">                                                          
                                </div>
                            </div>
                        </div>
                        <ul class="connectionList" v-if="connectStream.length>0">
                            <li v-for="(item,index) in connectStream" :key="index" v-loading="item.loading" :id="item.playAreaId+item.getId()">
                                <transition name="el-fade-in-linear">
                                    <div class="playBtn" @click.stop="playHandler(item)"  v-if="item.autoplayFailed"></div>
                                </transition>
                                <div class="videoMask" v-if="item.closeVedio"></div>
                                <!-- <div class="connectItem" :id="item.playAreaId+item.getId()"></div> -->
                                <div class="popLayer">
                                    <span class="nameText" :title="item.accountName">{{item.accountName}}</span>
                                    <div class="popOpera">
                                        <em :class="{closeAudio:item.closeAudio}" @click="connectMicCon(item)"></em>
                                        <em :class="{closeVedio:item.closeVedio}" @click="connectCarCon(item,index)"></em>
                                        <em @click.stop="attachmentOffline(item)"></em>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-col>

                <!-- 聊天box -->
                <el-col :span="5" class="singalBox">
                    <div class="grid-content bg-purple">

                        <!--讨论组-->
                        <ul class="tab clearfix tab-hei">
                            <li :class="{'cur':nowIndex === index}" v-for="(item,index) in tabData" :key="index" @click="tabSwitch(index)">
                                
                                <div class="sessionName">
                                    {{item}}
                                    <div v-if="index==2" :class="{'connectHint':connectHintFlag,'curIcon':true}">
                                        <em></em>
                                        <img src="../../assets/img/liveIcon/singOne.png" alt="" class="singOne">
                                        <img src="../../assets/img/liveIcon/singTwo.png" alt="" class="singTwo">
                                        <img src="../../assets/img/liveIcon/signThree.png" alt="" class="signThree">
                                    </div>
                                </div>
                                
                            </li>
                        </ul>
                        <div class="clearfix"></div>

                         <!--讨论组内容-->
                        <section class="discuss" v-show="nowIndex===0">

                            <discuss
                                ref="discuss"
                                :liveMemberArray = "liveMemberArray" 
                                :authInfos= "liveAuthInfo.authInfo"
                                :channelUpdateObj="channelUpdateObj"
                                :barrageFlag = "barrageFlag"
                                :courseId="courseId"
                                @userJoinChannel="userJoinChannel"
                                @userleaveChannel="userleaveChannel"
                                :liveController = "liveController">
                            </discuss>
                            
                        </section>

                        <section  v-show="nowIndex===1">
                            <activity :courseId = "courseId" :liveController = "liveController" ref="act"></activity>
                        </section>

                        <!--******************************学员*****************************-->

                        <section class="staff"  v-show="nowIndex===2">
                            <keep-alive>
                                <student
                                    :cdnPushUrl = "cdnPushUrl" 
                                    :liveController = "liveController" 
                                    :hostFlag="hostFlag"
                                    :inClass.sync="inClass"
                                    @updateinClass="inclassHandle"
                                    @tourClassOpen = "tourClassOpen"
                                    :liveAuthInfo="liveAuthInfo"
                                    :channelUpdateObj="channelUpdateObj"
                                    :updateAttchented="updateAttchented"
                                    ref="studentEle"
                                    :hours.sync="hours"
                                    :minutes.sync="minutes"
                                    :seconds.sync="seconds"
                                    :touring.sync="touring"
                                    :tourClassFlag="tourClassFlag"
                                    :connectStream = "connectStream">                                  
                                </student>
                            </keep-alive>
                        </section>

                    </div>

                </el-col>

                
            </el-row>
        </div>

        <!-- 设置弹窗 -->
        <seeting :dialogVisible.sync="dialogVisible" :inclass="inClass" @setQuality="setquality" ref="seetingBox" @setConnectQuality="setConnectQuality"></seeting>

        <!-- 切换摄像头弹窗 -->
        <seetingCamera :controller="liveController" :cameraDialogVisible.sync="cameraDialogVisible" @switchCamera="switchCamera" :cameraArr="cameraArr" :initCamearId="usedCameraVal" :currentResolution="liveController.getImageQuality()"></seetingCamera>

        <!-- 被踢出后的弹层 -->
        <div class="kickedOut" v-if="kickOut">
            <p>你已经被主播退出啦～</p>
        </div>
        <!-- 工具箱签到 -->
        <transition name="slide-fade">
            <toolbox  v-if="Toolboxdialog" @openanswer="openanswer" :controller="liveController" ></toolbox>
        </transition>
        <!-- 增加答题卡弹窗 -->
        <transition name="slide-fade">
            <answerSheet v-if="isshowanswer" @showanswerbox="showanswerbox" :controller="liveController" ref="getpush"></answerSheet>
        </transition>
         <!-- 答题器进度组建 -->
        <transition name="slide-fadein">
            <answerIs  v-if="showanswerIs" @showansweris="showansweris" :controller="liveController"></answerIs>
        </transition>             
        <!-- 屏幕共享引导弹框 -->
        <screendiog :screenVisible.sync="screenVisible" :passscreenfont="passscreenfont"></screendiog>
         <!--设备检查-->
        <transition name="slide-fade">
            <detection v-if="showdetection" @tabledetection="tabledetection" :liveController="liveController"></detection>
        </transition>
        <!-- 巡课 -->
        <tour-class-pop
            ref = "tourclassEle"
            :tourShow.sync = "tourClassFlag"
            :liveController = "liveController"
            :courseId = "courseId"
            :liveAuthInfo = "liveAuthInfo"
            :touring.sync="touring"
             @tourClassOpen = "tourClassOpen"
        ></tour-class-pop>     

        <!-- 直播时长用尽弹窗 -->
        <overLimitPop 
            :overLimitDialog.sync = "overLimit" 
            :text = "'该机构直播时长已用尽，无法开启课程直播'" 
            :footerText = "'增加直播课时长'" 
            :param="'liveTime'">
        </overLimitPop>         
                       
    </div>
    
</template>

<script>
    import SxbRTC from "@/sw/controllers/conclient";
    import seeting from './seeting';
    import toolbox from './toolbox';
    import seetingCamera from './settingCamera';
    import { confirmTip } from '@/global/open';
    import storge from '@/global/storage';
    import { getCurRole } from '@/filters/userVerify';
    import model from '@/model/live/live';
    import { sendPtoP,sendChat,splitUid,setChannle,sliceArray,curDate} from '@/sw/utils/sig';
    import swConfig from "@/sw/config"
    // import barrageWall from '@/sw/utils/barrage.js'
    import activity from './activity';
    import student from './student';
    import { setInterval, clearInterval, setTimeout, clearTimeout, setImmediate } from 'timers';
    import discuss from './discuss';
    import answerSheet from './answer/answer'
    import answerIs from './answer/answeris'
    import screendiog from './screendiog.vue'
    import detection from './detection'
    // import html2canvas from 'html2canvas'
    import tourClassPop from './tourclasspop'
    import storage from '@/global/storage'
    import overLimitPop from "@/base/overLimitPop/index"
	import httpRequest from '@/model/orgAccount/index'
    export default{
        data(){
            return{
                liveController:null,            //控制器
                inClass:false,                  //上课flag
                inClassText:"开始上课",         //上课按钮显示文本
                inClassTextFlag:false,          //上、下课按钮loading
                micVolumn:30,                     //麦克风音量
                outputVolumn:100,                 //播放音量
                barrageFlag:true,              //弹幕flag
                barrageText:"弹幕关",              //弹幕文本
                hostStream:[],                   //主播流
                connectStream:[],               //连线远端流
                usedCameraVal:"",               //正在使用的相机id
                usedCameraLabel:"",               //正在使用的相机设备名称
                closeVedio:false,               //关闭摄像头flag
                closeAudio:false,               //关闭麦克风flag
                dialogVisible:false,            //设置弹出层显隐
                cameraDialogVisible:false,      //设置弹出层显隐
                Toolboxdialog:false,            //设置弹出层显隐
                // Toolboxlistdialog:false,        //设置弹出层显隐       
                cameraArr:'',                   //摄像头集合
                kickOut:false,                  //提出标识

                liveAuthInfo:{},              //直播权限信息

                hostFlag:false,                 //直播标识
                systemsStates:{aventerPacketLossRate:0,aventerEnd2EndDelay:0,aventerRecvBitrate:0,},               //系统信息

                hours:"0",                        //上课--小时
                minutes:"0",                        //上课--分钟
                seconds:"01",                        //上课--秒
                timing:null,                        //上课定时器
                updateAttchented:null,
                autoPlayFalse:false,                //自动播放失败标识
                timeoutShow:false,                  //延时出现
                // applyUserList:null,             //申请连线人员集合
                cpuInfo: {cpuLoad:0,show:false},    //cpu信息
                StreamStatesTiming:null,
                livingGif: require("@/assets/img/liveIcon/living.gif"),
                overLimit: false,           // 直播时长用尽弹框
                hasUseOver: false,              
                hasScreenFlag : false,
                /***********************************************信令相关*****************************************/
                //switchs:true,
                // search:"",

                nowIndex:0,
                // nowIndex2:0,
                tabData:["讨论","活动","成员"],

                num:0,
                chatArray:[],
                userList:[
                   "postman编辑当前用户_1"
                ],
                liveMemberArray:[],
                liveOnlineMember:[],
                applyUserList:[],
                // connectedUserList:[],
                connectDisaudioList:[],
                connectDisvideoList:[],
                channelUpdateObj:{},
                channelUpdatedArray:[],
                connectHintFlag:false,
                isshowanswer:false,//答题卡显示隐藏                
                showanswerIs:false,//答题器进度组建隐藏
                screenVisible:false,//检测屏幕分享弹框
                passscreenfont:'',

                temporaryArray:{},
                latestVersion:0,
                touring:false,          //其他人正在巡课
                tourClassFlag: false,   // 巡课相关
                tourOnlineMember: [],   // 巡课在线人数
                showdetection:false,//显示隐藏设备检查
                viewPeople:0,          //观看人数
                /**
                    about cdn
                */
                cdnPushUrl:"",//推流地址

                webFailNum:0,

                allLoading:true, //整屏大遮罩层

                userJoinChannelAccount:0,
                userleaveChannelAccount:0,
            }
        },

        computed: {
            role() {
                return getCurRole();
            },
            clazzId(){
                return this.$route.query.clazzId;
            },
            courseId(){
                return this.$route.query.courseId;
            },
        },
        watch:{
            minutes:{
                handler(newVal,oldVal){
                    if(newVal>59){
                        this.minutes="0";
                        this.hours=Number(this.hours)+1;
                    }
                }
            },
            seconds:{
                handler(newVal,oldVal){
                    // console.log(newVal);
                    if(Number(newVal)>59){
                        this.seconds="00";
                        this.minutes=Number(this.minutes)+1;
                    }
                    
                }
            },
            touring: {
                handler(newVal,oldVal){
                    if(this.touring){
                        this.connectStream = [];
                    }
                    
                }
            }
        },

        created(){
            this.liveController = new SxbRTC("",{onInviteReceived: this.onInviteReceived});          
            /************************************信令相关******************************************/
            this.getCameraArr();
            //频道属性发生变化
            this.channelUpdated();
            //获取授权token
            this.channelTokenAuth();
            //websoket连接失败
            this.webSocketFail();
            //登录失败
            this.onLoginFail();
            //加入频道失败
            this.onChannelJoinFail();
            //推流成功
            this.cdnPushSuccess();
            //推流已停止
            this.cdnPushStop();
            //推流失败
            this.cdnPushFail();
            window.onunload=()=>{
                if(this.hostFlag){
                    this.liveController.delChannelAttr("apply_user_list");
                    this.liveController.delChannelAttr("connected_user_list");
                    clearInterval(this.StreamStatesTiming);
                }
                //离开信令
                this.liveController.leaveChanel();
                
            }
            this.screenSharebtn()//浏览器检查 
            window.onerror = function (message, url, line, column, error) {
                console.log("errorMessage::::",message);
                console.log("errorUrl::::",url)
                console.log("errorLine::::",line)
                console.log("errorColumn::::",column)
                console.log("errorError::::",error)
            }
        },

        beforeDestroy(){

            //离开信令
            this.liveController.leaveChanel();
            this.screenSharebtn()//浏览器检查          
        },

        mounted(){
            
        },
        destroyed(){
            this.liveController.unpublish();
            this.liveController.cdnUnPublish(this.cdnPushUrl);
            //离开信令
            this.liveController.leaveChanel();

            this.liveController.leavelChannel();

            clearInterval(this.StreamStatesTiming);
        },
        methods:{
            tourClassOpen(){
                this.liveController.tourClassFlag(true);
            },
            userJoinChannel(account){
                console.log("父页-直播加入直播间",account);
                // this.userleaveChannelAccount = account.split("_")[1];
                let userId = account.split("_")[1]
                //成员加入直播间上线
                this.$refs.studentEle.membersSort(1,userId);
                
            },
            userleaveChannel(account){
                //成员离开直播间下线
                console.log("父页-离开直播间",account);
                // this.userleaveChannelAccount = account.split("_")[1];
                let userId = account.split("_")[1];
                this.$refs.studentEle.membersSort(2,userId);
                
                

            },
            onChannelJoinFail(code){
                let _this = this;
                this.liveController.onChannelJoinFail(function(code){
                   console.log("加入频道失败",code);
                    _this.allLoading = true;

                    _this.loginSig();
                });
            },
            cdnPushSuccess(){
                let _this = this;
                this.liveController.cdnPushSuccess(function(code){
                    console.log("推流成功",code);
                    //开始上课
                    _this.classStart();
                   
                });
            },
            cdnPushFail(){
                let _this = this;
                this.liveController.cdnPushFail(function(code){
                    console.log("推流失败",code);
                    _this.liveController.cdnUnPublish(_this.cdnPushUrl);
                    //发送信令至学员端
                    _this.sendOverCLassMsg();
                    _this.cdnPushFailClass();
                    
                });
            },
            cdnPushFailClass(){
                if(this.inClass){
                    this.$confirm("当前直播出现异常，请尝试重新上课", '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // this.getPushUrl(()=>{
                        //     this.liveController.cdnPublish(this.cdnPushUrl);
                        // })
                        // this.cdnUnPublish(this.cdnPushUrl);
                        this.classEnd();
                    }).catch(()=>{
                        console.log("取消");
                    });
                }
            },
            cdnPushStop(){
                let _this = this;
                this.liveController.cdnPushStop(function(code){
                    console.log("推流已停止",code);
                    //发送信令至学员端
                    _this.sendOverCLassMsg();
                    // _this.$message.error("当前直播出现异常，请尝试重新上课");
                });
            },
            //显示隐藏工具箱
            toolboxshow(val){
                if(val=='this'){
                    // 点击工具箱打开关闭工具箱弹窗
                    this.Toolboxdialog=!this.Toolboxdialog;                                        
                }
                
            },
            //显示开启答题器签到
            openanswer(val){
                //关闭工具箱弹窗
                if(val=='that'){
                    this.Toolboxdialog=false;
                }else if(val=='this'){
                    //不存在答题器，创建答题卡
                    this.isshowanswer=true;
                    this.showanswerIs=false;
                    this.Toolboxdialog=false;
                }else{
                    //存在答题器
                    this.isshowanswer=false;
                    this.showanswerIs=true;
                    this.Toolboxdialog=false;
                }
            },           
            // 显示答题卡弹窗
            showanswerbox(val){
                console.log('检测一下到底有没有收到信息',val)
                // 关闭开启答题器
                if(val=='this'){
                   this.isshowanswer=false;
                   // 显示答题器进度
                    this.showanswerIs=true 
                }else{
                    this.isshowanswer=false;                    
                }             
            },  
            //首次进入直播间检查设备，以后不再检查
            getdetection(){
                let detection=storage.get("detection");
                console.log("我是查看是否进行了设备检测",detection)
               
                if(detection==undefined){
                    this.tabledetection()
                }else{    
                    let endinfo= storage.get("detection");
                    let role =this.$store.getters.getliveAuthInfo;
                    //上报摄像头
                    let data = {
                            "command":"CAMERA_STATUS",
                            "roomCode":role.authInfo.roomCode,
                            "fromRole":role.authInfo.role,
                            "ext":endinfo.camera==true?"OK":"NO"
                    }
                     this.liveController.sendPtoPMsg("sxb_1",JSON.stringify(data));
                    //上报麦克风
                    let data2 = {
                            "command":"MIC_STATUS",
                            "roomCode":role.authInfo.roomCode,
                            "fromRole":role.authInfo.role,
                            "ext":endinfo.audio==true?"OK":"NO"
                    }
                    this.liveController.sendPtoPMsg("sxb_1",JSON.stringify(data2));
                   
                }
            },
            //显示隐藏设备检查
            tabledetection(){
                this.showdetection=!this.showdetection
            },
            //屏幕共享
            screenSharebtn(){
                var sBrowser, sUsrAg = navigator.userAgent;
                // The order matters here, and this may report false positives for unlisted browsers.
                if (sUsrAg.indexOf("Firefox") > -1) {
                    sBrowser = "Mozilla Firefox";
                    // 不是谷歌内核
                    this.screenVisible=true;
                    this.passscreenfont="当前浏览器不支持此功能，请下载chrome"
                // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
                } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
                    sBrowser = "Opera";
                    // 不是谷歌内核
                    this.screenVisible=true;
                    this.passscreenfont="当前浏览器不支持此功能，请下载chrome"
                //"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
                } else if (sUsrAg.indexOf("Trident") > -1) {
                    sBrowser = "Microsoft Internet Explorer";
                    // 不是谷歌内核
                    this.screenVisible=true;
                    this.passscreenfont="当前浏览器不支持此功能，请下载chrome"
                // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
                } else if (sUsrAg.indexOf("Edge") > -1) {
                    sBrowser = "Microsoft Edge";
                    // 不是谷歌内核
                    this.screenVisible=true;
                    this.passscreenfont="当前浏览器不支持此功能，请下载chrome"
                // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
                } else if (sUsrAg.indexOf("Chrome") > -1) {
                    sBrowser = "Google Chrome or Chromium";
                    //验证是否是谷歌
                    let chromeArr=sUsrAg.split(' ');
                    let banben;
                    chromeArr.forEach(val=>{                        
                        if(val.indexOf("Chrome")>-1){
                            banben=(val.split("/"))[1].substr(0,2);
                            // 验证版本号是否小于65
                            if(banben<=65){
                                // alert("版本较低请下载新版本")
                                this.screenVisible=true;
                                this.passscreenfont="当前浏览器版本较低，请下载最新版chrome"
                            }
                        }
                    })
                // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
                } else if (sUsrAg.indexOf("Safari") > -1) {
                    sBrowser = "Apple Safari";
                    // 不是谷歌内核
                    this.screenVisible=true;
                    this.passscreenfont="当前浏览器不支持此功能，请下载chrome"
                // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
                } else {
                    sBrowser = "unknown";
                    // 不是谷歌内核
                    this.screenVisible=true;
                    this.passscreenfont="当前浏览器不支持此功能，请下载chrome"
                }

                console.log("当前浏览器为: " + sBrowser);
                // let ischrome=navigator.userAgent; //取得浏览器的userAgent字符串 
                // console.log("我是设备检测信息=========================",ischrome)            
                // if( ischrome.indexOf("Chrome") > -1 ){
                    
                // }else{
                    
                // }                
            },
            // 点击屏幕共享检测插件
            openscreen(){
                //验证是否安装了屏幕共享插件如果安装可以直接打开屏幕共享没有则提示安装
                this.liveController.shareScreenC((res)=>{
                    chrome.runtime.sendMessage("minllpmhdgpndnkomcoccfekfegnlikg", {getVersion:true},reply=>{
                        if(!(reply&&reply.version)){
                            this.screenVisible=true;
                            this.passscreenfont="首次使用屏幕共享，需要安装插件"
                        }
                        
                    });
                    this.hasScreenFlag = false;
                },()=>{
                    this.hasScreenFlag = true;
                },()=>{
                    this.hasScreenFlag = false;
                })     
            },
            
            //控制答题器进度弹窗显示隐藏
            showansweris(){
                this.showanswerIs=!this.showanswerIs;
            },
             // 获取巡课状态
            getTourClassFlag() {
                let data = {
                    roomCode: this.liveAuthInfo.roomCode
                }
                model.liveRoomTourStart(data, (res => {
                    
                    if(res.status == 200) {
                        // 开启巡课
                        // this.tourclassFn();
                        this.tourClassFlag = true;
                    } else if(res.status == 205){
                        this.$message.error("已有正在开启的巡课！");
                        
                    }
                }));
                
            },
            // 是否巡课
            tourclassFn() {
                let _this = this;
                if(!_this.inClass) {
                    this.$message.error("上课之后才能开始巡课！");
                    return false;
                }
                this.$confirm('是否确定开启巡课功能?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    
                    // 开启巡课  人员用新接口获取，实时获取 在线人数
                    let num = _this.$refs.studentEle.allOnlineMembers.length;
                    if(num == 0) {
                        _this.$message.error('目前没有学员在线');
                        _this.tourClassFlag = false;
                    } else if(_this.$refs.studentEle.connectedUserList.length > 0) {
                        _this.$message.error('连麦互动中，无法使用此功能!');
                        _this.tourClassFlag = false;
                    } else if(_this.connectHintFlag) {
                        _this.$message.error('有申请连线的学员，不能开启巡课');
                        _this.tourClassFlag = false;
                        console.log(_this.$refs.studentEle.applyUserList);
                    } else {
                        // 开启巡课弹出框
                        _this.getTourClassFlag()
                        
                     
                    }
             
                    
                }).catch(() => {
                    console.log("已取消巡课");         
                });
            },
            
            getanswerdata(){
                let _this=this;               
                _this.liveController.receiveChannelDtMsg(function(account,uid,msg){                                        
                    let data=JSON.parse(msg);
                    let AuthInfo=_this.$store.getters.getliveAuthInfo;
                    //只有当前角色是助教或者是主播时开启答题器
                    if(AuthInfo.authInfo.role=="Broadcaster" || AuthInfo.authInfo.role=="Assistant"){
                        if(data.command=="PUBLISH_TASK" && data.ext.type=="ANSWER"){
                            //存储频道消息至vuex中，方便下个组建调用和更新数据
                            _this.$store.state.answerdata=data;                
                            _this.showanswerIs=true;
                        }                        
                    };
                                                                              
                })  
            },
            //加入房间
            joinRoom(){
                let _this = this;
                _this.liveController.joinRoom({liveFlag:this.hostFlag,cdn:true,cdnPushUrl:this.cdnPushUrl},(res)=>{
                    if(this.hostFlag){
                        // _this.hostStream.push(res);
                        _this.usedCameraVal = res.usedCamera.deviceId;
                        _this.usedCameraLabel = typeof res.usedCamera.label =='string'?res.usedCamera.label.replace(/\([^\)]*\)/g,""):'';

                    }
                    _this.allLoading = false;
                    
                }).then(()=>{
                    this.streamSubscribe();
                    this.streamRemoved();
                    this.peerLeaveAgora();
                })
                
            },

            //远端流订阅
            streamSubscribe(){
                let _this = this;
                _this.liveController.subscribedStream((res)=>{
                    res.closeVedio=false;
                    res.closeAudio = false;
                    res.autoplayFailed=false;
                    if(res.getId()==this.liveAuthInfo.host){
                        // 获取到的主播流
                        _this.hostStream=[];
                        _this.hostStream.push(res);
                        _this.inClass=true;
                    }else{
                        if(!_this.tourClassFlag&&!_this.touring){
                                //非巡课的人已连接数组存储
                            //this.$refs.studentEle.connectList[res.getId()] = "connect";
                            //不是巡课状态
                            if(this.$refs.studentEle.disaudioList.includes(String(res.getId())))
                                res.closeAudio = true;
                            if(this.$refs.studentEle.disVideoList.includes(String(res.getId())))
                                res.closeVedio = true;

                            console.log(res)

                            let memberInfo = this.$refs.studentEle.allMemebersMap.get(String(res.getId()));
                            if(memberInfo){
                                res.accountName = memberInfo.name;
                                if(!_this.tourClassFlag&&!_this.touring){
                                    _this.$refs.studentEle.membersSort(4,String(res.getId()));
                                }
                            }else{
                                let intervalTime = setInterval(()=>{
                                    memberInfo = this.$refs.studentEle.allMemebersMap.get(String(res.getId()));
                                    if(memberInfo){
                                        res.accountName = memberInfo.name;
                                        clearInterval(intervalTime);
                                        if(!_this.tourClassFlag&&!_this.touring){
                                            _this.$refs.studentEle.membersSort(4,String(res.getId()));
                                        }
                                    }
                                    console.log("%c定时取连麦人员名字","color: purple;")
                                },1000)
                            }
                            
                            this.$refs.studentEle.connectedUserList.includes(String(res.getId()))?"":this.$refs.studentEle.connectedUserList.push(String(res.getId()));
                            if(document.querySelector('#liveItem'+res.getId())==null){
                                //获取到远端流
                                _this.connectStream.push(res)
                                console.log("%获取到远端流=================","color:green",_this.connectStream)
                            }

                        }else{
                            //巡课状态
                            this.$refs.tourclassEle.mergeInfo();
                            
                        }
                        
                    }
                    if(res.getId()==this.liveAuthInfo.host||(_this.tourClassFlag||!_this.touring)){
                        setTimeout(function(){
                            _this.liveController.palyStream(res).then(()=>{
                                let videoTag = document.querySelector('#video'+res.getId());
                                videoTag.onloadstart=()=>{
                                    // videoTag.controls=true
                                    res.autoplayFailed=false;
                                }
                                videoTag.oncanplay=()=>{
                                    console.log("video states is"+videoTag.readyState);
                                    res.autoplayFailed=true;
                                    res.loading=false;
                                }
                                videoTag.onplay=()=>{
                                    res.autoplayFailed=false;
                                }     
                                
                            });
                            
                        },700)
                    }
                
                })
            },

            /**
             * 远端流移出
             */
            streamRemoved(){
                this.liveController.streamRemoved((res)=>{
                    if(res.getId()==this.liveAuthInfo.host&&this.liveAuthInfo.authInfo.role!="Broadcaster"){
                        this.inClass=false;
                        if(this.$refs.studentEle.attchented){
                            this.liveController.attachment(false,()=>{
                                this.liveController.invitateEndBySelf();
                                this.$refs.studentEle.attchented=false;
                            })
                        }
                        this.updateAttchented = false;
                        this.hostStream.length=0;
                        this.$refs.studentEle.connectedUserList = [];
                        this.connectStream = [];
                        this.$refs.studentEle.membersSort(8);
                    }else{
                        this.$refs.studentEle.membersSort(5,String(res.getId()));
                    }
                    $("#liveItem"+res.getId()).remove();
                    sliceArray(this.$refs.studentEle.connectedUserList,String(res.getId()));
                })
            },

            /**
             * 声网人员离开频道
             */
            peerLeaveAgora(){
                this.liveController.peerLeave((res)=>{
                    this.$refs.studentEle.membersSort(5,String(res.uid));
                    if(res.uid==this.liveAuthInfo.host&&this.liveAuthInfo.authInfo.role!="Broadcaster"){
                        if(this.$refs.studentEle.attchented){
                            this.liveController.attachment(false,()=>{
                                this.liveController.invitateEndBySelf();
                                this.$refs.studentEle.attchented=false;
                            })
                        }
                        this.inClass=false;
                        this.updateAttchented = false;
                        this.hostStream.length=0;
                        this.$refs.studentEle.connectedUserList = [];
                        this.connectStream = [];
                    }
                    sliceArray(this.$refs.studentEle.connectedUserList,String(res.uid))
                    $("#liveItem"+res.uid).remove();
                })
            },

            // 摄像头开启与关闭
            closeVedioHandle(){
                this.closeVedio = !this.closeVedio;
                this.liveController.closeVedioHandle(this.closeVedio);
            },

            // 麦克风开启与关闭
            closeAudioHandle(){
                this.closeAudio = !this.closeAudio;
                this.liveController.closeAudioHandle(this.closeAudio)
            },

            //直播状态
            liveroomStatus(){
                if(this.inClass){
                    this.inclassHandle();
                }else{
                    let data = {
                        courseId : this.courseId
                    }
                    model.liveroomStatus(data,(res)=>{
                        console.log(res)
                        if(res.status==200){
                            if(res.data=="LIVING"){
                                this.$confirm("检测到当前直播间已经处于上课状态，重复点击会导致学员观看异常，确定要这么操作吗？", '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning',
                                    closeOnClickModal:false,
                                    closeOnPressEscape:false
                                }).then(() => {
                                    this.inclassHandle();
                                }).catch(()=>{
                                    console.log("取消");
                                });
                            }else{
                                console.log('没有上课');
                                this.inclassHandle();
                            }
                        }else{
                            this.$message.error(res.message);
                        }
                    })
                }
                
            },
            //上下课
            inclassHandle(flag){
                if(flag===false){
                    return
                }
                // this.inClass = !this.inClass;
                if(!this.inClass){
                    this.getVipInfo().then(res=>{
                        if(res){
                            console.log(flag);
                            this.overLimit = true;
                        }else{
                            this.inClassTextFlag = true;
                            this.joinRoom({channelName:this.liveAuthInfo.roomCode});   
                            this.liveController.publishSuccess(()=>{
                                this.getPushUrl(()=>{
                                    this.liveController.cdnPublish(this.cdnPushUrl);
                                })
                            })
                        }
                    });
                    
                }else{
                    this.inClassTextFlag = true;
                    this.inClass = true;
                    this.$confirm("是否确认下课？", '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.classEnd();
                    }).catch(() => {
                        this.inClassTextFlag = false;
                    });
                    
                    
                }
            },
            //开始上课
            classStart(){
                let resolution = null;
                if(this.$refs.seetingBox.hostQuality==720){
                    resolution = '1280*720'
                }else if(this.$refs.seetingBox.hostQuality==480){
                    resolution = '848*480'
                }else{
                    resolution = '1280*720'
                }
                let fps = this.$refs.seetingBox.frameRate;
                let data = {
                    roomCode: swConfig.channelName,
                    resolution: resolution,
                    fps: fps
                }
                model.liveRoomStart(data,(res)=>{
                     if(res.status==200){
                        //发送信令至学员端
                        var msg = {
                            "command":"BEGIN_CLASS",
                            "fromRole":"Broadcaster"
                        }
                        this.liveController.sendChannelMsg(JSON.stringify(msg));
                        this.inClassTextFlag = false;
                        //开始上课
                        this.inClassText="下课";
                        this.inClass = true;
                        clearInterval(this.timing);
                        this.timing = setInterval(()=>{
                            let addSec = Number(this.seconds)+1;
                            this.seconds = addSec<10?"0"+String(addSec):String(addSec);
                        },1000)
                        sessionStorage.removeItem("hostLiveStates");
                        this.getLocalStreamStates();
                     }else{
                        this.errorStatus();
                     }
                })
            },
            //错误状态恢复初始状态
            errorStatus(){
                this.inClass = false;
                this.inClassText="开始上课";
                this.$message.error(res.message);
                this.unpublish();
                this.liveController.cdnUnPublish(this.cdnPushUrl);
                clearInterval(this.timing);
                clearInterval(this.StreamStatesTiming);
            },
            //结束上课
            classEnd(){
                this.inClassTextFlag = true;
                let data = {
                    roomCode: swConfig.channelName
                }
                model.liveRoomEnd(data,(res)=>{
                    if(res.status==200){
                        
                        this.inClassTextFlag = false;
                        this.liveController.unpublish();
                        this.liveController.cdnUnPublish(this.cdnPushUrl);
                        setTimeout(()=>{this.liveController.leavelChannel();},500)
                        //删除所有频道属性
                        this.clearAllttr();
                        this.inClassText="开始上课";
                        this.inClass = false;
                        clearInterval(this.timing);
                        this.hours="0";                        //上课--小时
                        this.minutes="0";                        //上课--分钟
                        this.seconds="01";                        //上课--秒
                        clearInterval(this.StreamStatesTiming);
                        this.connectStream = [];
                        this.$refs.studentEle.membersSort(8);
                        // cdn变量进行释放
                        this.liveController.removeAllCdnVas();
                    }
                })
            },

            sendOverCLassMsg(){
                //发送信令至学员端
                var msg = {
                    "command":"FINISH_CLASS",
                    "fromRole":"Broadcaster"
                }
                this.liveController.sendChannelMsg(JSON.stringify(msg));
            },

            clearAllttr(){
                //this.liveController.addChannelAttr("non_access_user_list","");

                this.liveController.addChannelAttr("non_speak_user_list","");
                this.liveController.addChannelAttr("apply_user_list","");
                this.liveController.addChannelAttr("connected_user_list","");
                this.liveController.addChannelAttr("online_user_list","");
                this.liveController.addChannelAttr("can_speak","_1_");
                
                // this.liveController.delChannelAttr("can_apply");
                this.liveController.addChannelAttr("connect_disaudio_list","");
                this.liveController.addChannelAttr("connect_disvideo_list","");
            },

            //弹幕开关
            barrageHandle(){
                console.log(barrageFlag)
               this.barrageFlag = !this.barrageFlag; 
               this.barrageText=this.barrageFlag?"弹幕开":"弹幕关";
            },

            viewPortScale(){
                console.warn(this.isFullscreenForNoScroll());
                this.isFullscreenForNoScroll()?this.exitFullScreen(document.documentElement):this.fullScreen(document.documentElement);
            },

            //全屏
            fullScreen(el) {
                let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
                    wscript;
            
                if(typeof rfs != "undefined" && rfs) {
                    rfs.call(el);
                    return;
                }
            
                if(typeof window.ActiveXObject != "undefined") {
                    wscript = new ActiveXObject("WScript.Shell");
                    if(wscript) {
                        wscript.SendKeys("{F11}");
                    }
                }
            },
 
            //退出全屏
            exitFullScreen(el) {
                var el= document,
                    cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
                    wscript;
            
                if (typeof cfs != "undefined" && cfs) {
                    cfs.call(el);
                    return;
                }
            
                if (typeof window.ActiveXObject != "undefined") {
                    wscript = new ActiveXObject("WScript.Shell");
                    if (wscript != null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            },

            //判断是否全屏
            isFullscreenForNoScroll(){
                var explorer = window.navigator.userAgent.toLowerCase();
                if(explorer.indexOf('chrome')>0){//webkit
                    if (document.documentElement.scrollHeight === window.screen.height) {
                        return true
                    } else {
                        return false
                    }
                }else{//IE 9+  fireFox
                    if (window.outerHeight === window.screen.height) {
                        return true
                    } else {
                        return false
                    }
                }
            },

            //设置分辨率
            setquality(q){
                this.liveController.setImageQuality(q);
                // this.liveController.addChannelAttr("connectVideoProfile","720_p");
            },
            setConnectQuality(param){
                this.liveController.addChannelAttr("connect_resolution",param);
                // this.liveController.setConnectQuality(param);
            },

            //获取摄像头
            getCameraArr(){
                let _this = this;
                this.liveController.getVedioInput((res)=>{
                    _this.cameraArr= res
                })
            },

            //切换摄像头
            switchCamera(cameraOption){
                let _this = this;
                _this.usedCameraVal = cameraOption.deviceId;
                
                _this.liveController.switchCamera(_this.usedCameraVal,()=>{
                    _this.cameraVisible = false;
                    _this.closeVedio = false;

                    /**切换分辨率 */
                    if(_this.liveController.getImageQuality()!=cameraOption.resolution)
                        _this.setquality(cameraOption.resolution);

                    _this.cameraArr.forEach(item=>{
                        if(item.deviceId==_this.usedCameraVal){
                            _this.usedCameraLabel = item.label
                        }
                    })
                });
            },
            //连麦人员摄像头控制
            connectCarCon(stream,index){
                var obj = {};
                stream.closeVedio = !stream.closeVedio;
                let msg = stream.closeVedio?sendPtoP("close_vedio"):sendPtoP("open_vedio");
                let _this = this;
                
                let memberItem = _this.$refs.studentEle.allMemebersMap.get(String(stream.getId()));
                let account = memberItem["name"] + "_" + memberItem["identification"];
                _this.liveController.sendPtoPMsg(account,msg);
                
                if(stream.closeVedio){
                    console.log("禁摄像头====",stream.closeVedio);
                    // console.log("dississ====", _this.$refs.studentEle.disVideoList);
                    //  console.log("account====", splitUid(account));
                    _this.$refs.studentEle.disVideoList.includes(splitUid(account))?'':_this.$refs.studentEle.disVideoList.push(splitUid(account));
                    console.log("禁摄像头===",_this.$refs.studentEle.disVideoList);
                    _this.liveController.disAudioList(stream.getId(),stream.closeVedio);
                    
                   setChannle("disvideo",this.liveController,this.$refs.studentEle.disVideoList.join("_"));
                   
                }else{
                    sliceArray(this.$refs.studentEle.disVideoList,splitUid(account));
                     _this.liveController.disAudioList(stream.getId(),stream.closeVedio);
                    console.log("取消禁摄像头====",stream.closeVedio);
                    setChannle("disvideo",this.liveController,this.$refs.studentEle.disVideoList.join("_"));
                }
                
            },

             //连麦人员麦克风头控制
            connectMicCon(stream){
                stream.closeAudio = !stream.closeAudio;
                let msg = stream.closeAudio?sendPtoP("close_audio"):sendPtoP("open_audio");
                let _this = this;
                let memberItem = _this.$refs.studentEle.allMemebersMap.get(String(stream.getId()));
                let account = memberItem["name"] + "_" + memberItem["identification"];
               
                this.liveController.sendPtoPMsg(account,msg);

                if(stream.closeAudio){
                    console.log(account)
                    this.$refs.studentEle.disaudioList.push(splitUid(account))
                    this.connectDisaudioList.push(splitUid(account));
                    setChannle("disaudio",_this.liveController,this.$refs.studentEle.disaudioList.join("_"));
                }else{
                    sliceArray(this.$refs.studentEle.disaudioList,splitUid(account));
                    console.warn(this.$refs.studentEle.disaudioList)
                    setChannle("disaudio",this.liveController,this.$refs.studentEle.disaudioList.join("_"));
                    
                }
            },
            //本地推流数据
            getLocalStreamStates(){
                this.StreamStatesTiming=setInterval(()=>{
                    this.liveController.getLocalStreamStates((res)=>{
                        // console.log(res.TransportStats);
                        this.systemsStates.aventerEnd2EndDelay = res&&res.LocalVideo&&res.LocalVideo[this.liveAuthInfo.authInfo.uid].EncodeDelay;
                        if(res.LocalVideo&&res.LocalVideo[this.liveAuthInfo.authInfo.uid]&&res.LocalAudio[this.liveAuthInfo.authInfo.uid]){
                            this.systemsStates.aventerRecvBitrate = Number(res&&res.LocalVideo&&res.LocalVideo[this.liveAuthInfo.authInfo.uid]&&res.LocalVideo[this.liveAuthInfo.authInfo.uid].SendBitrate)+Number(res&&res.LocalAudio&&res.LocalAudio[this.liveAuthInfo.authInfo.uid].SendBitrate);
                        }else{
                            this.systemsStates.aventerRecvBitrate = 0;
                        }
                    })
                },2000)
            },
            //设置音量
            setVolume(){
                let volumeStream = null;
                if(this.hostFlag){
                    volumeStream = this.connectStream;
                }else{
                    volumeStream=Array.concat(this.connectStream,this.hostStream);
                }
                this.liveController.changeHostVolume(volumeStream,this.outputVolumn)
            },

            //连麦人员下线
            attachmentOffline(stream){
                let memberItem = this.$refs.studentEle.allMemebersMap.get(String(stream.getId()));
                memberItem.connectState = 'offline';
                memberItem.connectText = '下线';
                this.$refs.studentEle.connectHandle(memberItem);
            },
            //手动播放
            playHandler(res){
                // console.log(res)
                // document.querySelector('#video'+res.getId()).play();
                // console.log(document.getElementsByTagName("video"));
                let allStream = Array.concat(this.hostStream,this.connectStream);
                // console.log(allStream);
                allStream.forEach(item=>{
                    let tag = document.querySelector('#video'+item.getId())
                    if(tag){
                        tag.play();
                    }
                })
                res.autoplayFailed = false;
                // res.autoplayFailed=false;
            },            
            //*************************************信令相关****************************************************//
            //删除频道属性
            delChannelSet(){
                this.liveController.delChannelSet(stream);
            },
            onLoginFail(){
                let _this = this;
                this.liveController.onLoginFail((code)=>{
                    console.log("登录失败",code);
                    this.allLoading = true;
                    this.loginSig();
                    
                })
            },
            webSocketFail(){
                this.liveController.webSocketFail((code)=>{
                    console.log("websocket链接失败,尝试重新连接",code);
                    if(code == 100 || code == 102){
                        this.allLoading = true;
                        this.loginSig();
                    }
                })
            },
            reLoginSigFail(){
                this.allLoading = true;
                this.$confirm('当前直播出现异常，请点击确定退出当前直播间', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    if(this.inClass){
                        this.classEnd();
                        setTimeout(()=>{
                            window.close();
                        },1000)
                    }
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  });          
                });
            },
            channelTokenAuth(){
                let data = {
                    courseId:this.courseId
                }
                model.liveRoomAuth(data, ( res => {
             
                    if(res.status==200){
                        let _this = this;

                        this.liveAuthInfo = res.data;
                        this.$store.state.liveAuthInfo=res.data;
                        this.viewPeople=res.data.viewPeopleCount
                        this.hostFlag = this.liveAuthInfo.authInfo.role=="Broadcaster"?true:false;
                        //获取主播获者助教发布的答题卡
                        this.getanswerdata()  
                        swConfig.channelName = this.liveAuthInfo.roomCode;
                        swConfig.appId = this.liveAuthInfo.authInfo.appId;
                        if(this.liveAuthInfo.authInfo.mediaToken == "_no_need_token"){
                            swConfig.mediaToken = null;
                        }else{
                            swConfig.mediaToken = this.liveAuthInfo.authInfo.mediaToken;
                        }
                        swConfig.signalToken = this.liveAuthInfo.authInfo.signalToken;
                        swConfig.role = this.liveAuthInfo.authInfo.role;
                        //登录信令
                        this.loginSig();
                        //获取直播间推流信
                        this.liveMemberList();
                        setTimeout(()=>{this.$refs.studentEle.getAllMemebers();},500)
                        // this.liveController.createClient();
                        if(res.data.authInfo.role=="Broadcaster"){
                            var port = chrome.runtime.connect('minllpmhdgpndnkomcoccfekfegnlikg',{name: "knockknock"});port.postMessage({joke: "Knock knock"});
                            port.onMessage.addListener((msg)=>{
                                if(typeof(msg)=="number"){
                                    this.cpuInfo.cpuLoad = msg;
                                }else{
                                    if(msg.hasOwnProperty("connected"))
                                        this.cpuInfo.show=true;
                                        
                                }
                            });
                        }
                    }else{
                        if(res.status==205&&res.message=="您不属于该班级"){
                            /**
                             * 非该班级成员
                             */
                            this.$confirm("非班级成员，无权查看该直播间", '提示', {
                                confirmButtonText: '确定',
                                showClose:false,
                                showCancelButton:false,
                                closeOnClickModal:false,
                                closeOnPressEscape:false,
                                type: 'warning'
                            }).then(() => {
                                window.location.href="";
                                window.close();
                            });
                            return
                        }
                    }
                }))
            },
            previewStaff(){
                if(this.hostFlag){
                    let reStream = this.liveController.previewStream(this.liveAuthInfo.authInfo.uid,{},(err)=>{
                        if(err.info=="Permission denied"){
                            this.$message.error("摄像头权限获取失败");
                        }else if(err.msg=="NotFoundError"){
                            this.$message.error("无可用设备");
                        }
                    });
                    this.usedCameraVal = reStream.usedCamera.deviceId;
                    this.usedCameraLabel = typeof reStream.usedCamera.label =='string'?reStream.usedCamera.label.replace(/\([^\)]*\)/g,""):'';
                    this.allLoading = false;
                    //刷新浏览器重新推流
                    this.refreshBrowser();
                }else{
                    /**
                     * 助教加入直播间直接加入频道--声网
                     */
                    this.joinRoom();
                }
            },
            refreshBrowser(){
                //判断是否为刷新浏览器
                let hostLiveStates = sessionStorage.getItem('hostLiveStates');
                if(hostLiveStates){
                    hostLiveStates = JSON.parse(hostLiveStates);
                    if(Boolean(Number(hostLiveStates.inClass))){
                        console.log("刷新重新上课");
                        this.inclassHandle(Boolean(Number(hostLiveStates.inClass)))
                        this.hours = hostLiveStates.hours;
                        this.minutes = hostLiveStates.minutes
                        this.seconds = hostLiveStates.seconds
                    }                              
                }
            },
            getPushUrl(callback){
                let data = {
                    roomCode:this.liveAuthInfo.roomCode
                }
                model.liveroomPlayUrl(data,(res=>{
                    if(res.status == 200){
                        this.cdnPushUrl = res.data.pushUrl;
                        callback();
                    }else{
                        this.errorStatus();
                    }
                   
                }))
            },
            loginSig(){
                let _this = this;
                //信令重连 0 1 2
                if(_this.webFailNum >= 3){
                    _this.reLoginSigFail();
                    return;
                }
                _this.webFailNum++; //1 2 3
                let userName = storge.get("exp_name");
                //获取当前的账号
                let uid = storge.get("exp_userId");
                let account = userName + "_" + uid;
                this.liveController.login(
                    {
                        channelName:swConfig.channelName,
                        appId:swConfig.appId,
                        account:account,
                        role:swConfig.role,
                        signalToken:swConfig.signalToken,
                        callback:function(){
                            _this.allLoading = false;
                            //信令登录成功设置为0
                            _this.webFailNum = 0;
                            let role = _this.liveAuthInfo.authInfo.role;
                            let data = {
                                    "command":"CURRENT_DEVICE",
                                    "roomCode":_this.liveAuthInfo.authInfo.roomCode,
                                    "to":"pc",
                                    "fromRole":role
                            }
                            _this.liveController.sendPtoPMsg("sxb_1",JSON.stringify(data));
                             //进行设备检测
                            _this.getdetection();
                            _this.previewStaff();
                        }
                    }
                );
            },
            liveOnlineMemberList(callback){
                let data = {
                    roomCode:this.liveAuthInfo.authInfo.roomCode
                }
                model.liveRoomOnlineList(data, ( res => {
                    if(res.status == 200){
                         this.liveOnlineMember = res.data
                         callback();
                        //存储在线人员id缓存
                        this.liveOnlineMember.forEach((item,index)=>{
                        })
                    }else{
                        this.$message.error(res.message);
                    }
                }))
            },

            liveMemberList(){
                this.liveOnlineMemberList(()=>{
                    var data = {
                        clazzId:this.clazzId,
                        version:this.latestVersion,
                    }
                    model.liveMemberList(data, ( res => {
                        if(res.data.latestVersion){
                            this.latestVersion = res.data.latestVersion;
                        }
                        //初始化数据
                        if(res.data.all&&res.data.all.length > 0){
                            res.data.all.forEach((item,index)=>{
                                item.connectState = "no-login";
                                item.connectText = "连线";
                                item.nospeak = "禁言";
                                item.kickout = "踢出";
                                item.wating=false;
                                if(item.role == "CLAZZMANAGER" || item.role == "PROJECTADMIN" || item.role == "PROFESSOR" || item.role == "ORGADMIN"){
                                        if(item.identification == this.liveAuthInfo.host){
                                                item.role = "Broadcaster";
                                            }else{
                                                item.role = "Assistant";
                                            }
                                        }else{
                                            item.role = "STUDENT";
                                        }
                            })
                            this.liveMemberArray = res.data.all;
                            console.log("获取到的接口数据====================","color:res",this.liveMemberArray)
                        }
                        //删除数据
                        if(res.data.delete&&res.data.delete.length > 0){
                            let leg = this.liveMemberArray.length;
                            let deletes = res.data.delete;
                            for (let i = leg - 1; i >= 0; i--) {
                                for (let j = 0; j < deletes.length; j++) {
                                    if (this.liveMemberArray[i]) {
                                        if (this.liveMemberArray[i]["identification"] == deletes[j]) {
                                            this.liveMemberArray.splice(i, 1)
                                            continue; //结束当前本轮循环，开始新的一轮循环
                                        }
                                    }
                                }
                            }
                        }
                        //插入数据
                        if(res.data.insert&&res.data.insert.length > 0){
                            res.data.insert.forEach((item,index)=>{
                                item.connectState = "no-login";
                                item.connectText = "连线";
                                item.nospeak = "禁言";
                                item.kickout = "踢出";
                                item.wating=false;
                            })
                            this.liveMemberArray = this.liveMemberArray.concat(res.data.insert);  
                        }
                        //更新列表属性
                        if(res.data.update&&res.data.update.length > 0){
                            let updateData = res.data.update;
                            console.log(updateData);
                             this.liveMemberArray.forEach((item,index) =>{
                                updateData.forEach((des,z)=>{
                                    if(item.identification == des.identification){
                                        this.liveMemberArray[index] = des;
                                        this.liveMemberArray[index]["nospeak"] = this.temporaryArray[item.identification]["nospeak"];
                                        this.liveMemberArray[index]["connectText"] = this.temporaryArray[item.identification]["connectText"];
                                        this.liveMemberArray[index]["connectState"] = this.temporaryArray[item.identification]["connectState"];
                                    }
                                })
                            })
                            console.log(JSON.stringify(this.liveMemberArray));
                        }
                        //存储列表状态变化
                        this.temporaryArray = {};
                        this.liveMemberArray.forEach((item,index)=>{
                            let obj = {}
                            obj["nospeak"] = item.nospeak;
                            if(this.$refs.studentEle.connectedUserList.includes(item.identification)){
                                obj["connectText"] = "下线";
                                obj["connectState"] = 'offline';
                            }else{
                                obj["connectText"] = item.connectText;
                                obj["connectState"] = item.connectState;
                            }
                            this.temporaryArray[item.identification] = obj;
                        })
                        
                    }))
                });
                
            },

            screenShare(){
                console.log("pingmugongxiang");
                this.liveController.screenShare();
            },

            handleCommand(command){
                this.adressName = command;
            },

            addChannelAttr(){
                this.liveController.addChannelAttr("test","1111");

            },

            channelUpdated(){
                let _this = this;
                //alert(5555);
                _this.liveController.channelAttrUpdated((name,value,v)=>{
                    console.log('%c频道属性更新变化名' + name + ":" + value + ":" + v,'background:blue;color:#fff;font-size:20px;');  
                    //监听频道属性变化更新小红点
                    if(name == "apply_user_list"){
                        if(value != ""){
                            this.connectHintFlag = true;
                        }else{
                            this.connectHintFlag = false;
                        } 
                    }else if(name=="_member_num"){
                        _this.viewPeople=value;
                    }
                    
                })
            },

            tabSwitch(index){
                this.nowIndex = index;

                // 添加活动列表触发器
                if(index == 1) {
                    this.$refs.act.getList();
                }else if(index == 2){
                    //切换学员
                    this.$refs.studentEle.getAllMemebers();
                    
                    this.$refs.studentEle.noDataFlag = false;
                    this.$refs.studentEle.search = "";
                    setImmediate(()=>{
                        this.$refs.studentEle.handleScroll();
                    })
                    
                }else if(index == 0){
                    this.$refs.discuss.chatHeight();
                }
            },            
             leaveChanel(){
                this.liveController.leaveChanel();
             },

             kickOutRoom(command){
                var msg = {};
                if(command == "kick-out"){
                    msg = {
                        "command":"KICK_OUT"
                    }
                }else if(command == "no-speak"){
                    msg = {
                        'command':"TURN_OFF_SINGLE_MIC"
                    }
                }
                this.liveController.sendChannelMsg(JSON.stringify(msg));
             },

            // //获取当前网络状态
            // getNetworkState(){
            //     // setInterval(()=>{
            //         const { rtt, downlink, effectiveType, saveData } = navigator.connection;
            //         console.log(`有效网络连接类型: ${effectiveType}`);
            //         console.log(`估算的下行速度/带宽: ${downlink}Mb/s`);
            //         console.log(`估算的往返时间: ${rtt}ms`);
            //         console.log(`打开/请求数据保护模式: ${saveData}`);
            //     // },2000)
                
            // },
            getVipInfo(){
                return new Promise(reslove=>{
                    let data = {}
                    let orgId = !!this.$route.query.orgId ? this.$route.query.orgId : localStorage.orgId ? JSON.parse(localStorage.orgId).identification : '';
                    let clazzId = !!this.$route.query.clazzId ? this.$route.query.clazzId : '';
                    if(Boolean(orgId)){
                        data.orgId = orgId;
                    }else if(Boolean(clazzId)){
                        data.clazzId = clazzId;
                    }
                    httpRequest.getAccountInfo(data,(res)=>{
                        if(res.status==200){
                            let allTime = res.data.liveTime ? res.data.liveTime : 0;
                            let useTime = res.data.useLiveTime ? res.data.useLiveTime : 0;
                            if(Number(allTime)>Number(useTime)){
                                reslove(false)
                            }else {
                                reslove(true)
                            }
                        }else{
                            reslove(false)
                        }
                    });
                })
				
			}


        },



        components:{
            seeting:seeting,
            seetingCamera:seetingCamera,
            Signal:Signal,
            toolbox:toolbox,  
            activity,
            student,
            discuss,
            answerSheet,
            answerIs,                
            screendiog,
            detection,
            tourClassPop,
            overLimitPop,                  
        },

        beforeDestroy() {
        }

    }
</script>

<style lang="less" scoped>
    @bgColorHead: rgb(18,23,32);
    @bgColorCon:  rgb(23,29,40);
    @bgColorAside: linear-gradient(-180deg, #232E44 0%, #232833 32%, #212833 100%);
    .slide-fade-enter-active {
    transition: all .3s ease;
    }
    .slide-fade-leave-active {
    transition: all .3s cubic-bezier(0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(-10px);
    opacity: 0;
    }
    .liveBox{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: @bgColorCon;
        overflow: hidden;
        overflow-y: auto;
    }
    header{
        // padding: 0vh 2.7%;
        // padding-bottom: 0.3vh;
        background-color: @bgColorHead;
        overflow: hidden;
        position: relative;
        width: 100%;
        // height: 8%;
        // z-index: 10001;
        .fl:nth-child(1){
            width:25%;
        }
        .el-col-19{
            width: 66.7vh*16/9;
        }
        .el-col-5{
            display: table;
            height: 74px;
        }
        .fl{
            // float: left;
            display:table-cell;
            vertical-align: middle;
            height: 74px;
            .iconImg{
                width: 70px;
                height: 30px;   
            }
            .iconText{
                font-family: "FZZZHONGJW--GB1-0","microsoft yahei";
                font-size: 16px;
                color: #1AAB8E;
                letter-spacing: 0;
                line-height: 16px;
                margin-left: 10px;
            }
            .netWorkStates{
                width: 22vw;
                font-size: 12px;
                color: #4A90E2;
                letter-spacing: 0;
                line-height: 14px;
                margin-top: 3px;
                margin-bottom: -10px;
                max-width: 500px;
                min-width: 334px;
                span{
                    margin-right: 6px;
                }
                b{
                    font-weight: normal;
                    display: inline-block;
                }
                b:first-child{
                    min-width: 240px;
                }
                .roomPeople{
                    font-size: 14px;
                    color: #2BE2BE;
                    text-shadow: 0 2px 2px rgba(0,0,0,0.50);
                    text-indent: 16px;
                    background: url(../../assets/img/liveIcon/roomPeople.png) left center no-repeat;
                    background-size: 12px 12px;
                    height: 20px;
                    line-height: 20px;
                }
            }
            .operaBtn{
                margin-top: 12px;
                // margin-left: 5.2vw;
                overflow: hidden;
                display: table;
                li{
                    float: left;
                    padding-top: 30px;
                    font-size: 14px;
                    color: #7E93A6;
                    letter-spacing: 0;
                    line-height: 26px;
                    background: no-repeat;
                    background-size: 26px 26px;
                    background-position-x: center;
                    margin-left: 2.8vw;
                    cursor: pointer;
                    display: table-cell;
                    vertical-align: middle;
                    // min-width: 2.2vw;
                }
                li.liOne{
                    display: none;
                    margin-left: 0;
                    background-image: url(../../assets/img/liveIcon/mediaIcon.png);
                }
                li.liTwo{
                    background-image: url(../../assets/img/liveIcon/toolbox.png);
                }
                li.liThree{
                    background-image: url(../../assets/img/liveIcon/screenShare.png);
                }
                li.liFour{
                    // display: none;
                    width: 34px;
                    text-align: center;
                    background-size: 26*1.19px 26px;
                    background-image: url(../../assets/img/liveIcon/tourClass.png);
                }
                li.liFive{
                    width: 34px;
                    text-align: center;
                    background-size: 26*1.12px 26px;
                    background-image: url(../../assets/img/liveIcon/seting.png);
                }
            }
        }
        .fr{
            // float: right;
            display:table-cell;
            vertical-align: middle;
            text-align: right;
        }
        .rightCon{
            .remove-el-button{
                padding:0!important;
                border: none!important;
                font-size: 16px!important;
            }
            .timeLength{
                font-size: 16px;
                color: #FFFFFF;
                letter-spacing: 0;
                line-height: 16px;
                margin-right: 6px;
            }
            button{
                background-image: linear-gradient(90deg, #4AC9AA 5%, #1CB6C8 100%);
                border-radius: 100px;
                color: #fff;
                text-align: center;
                width: 6.5vw;
                height: 3.4vh;
                line-height: 3.5vh;
                outline: none;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
            }
            .inClass{
                background-image: linear-gradient(90deg, #FF9C23 5%, #FF6F29 100%);
            }
            .scaleBtn{
                display: inline-block;
                width: 30px;
                height: 30px;
                background: url(../../assets/img/liveIcon/scaleBtn.png) no-repeat center center;
                background-size: 30px 30px;
                vertical-align: middle;
                margin-left: 10px;
                cursor: pointer;
            }
        }
    }
    .streamBox{
        width: 100%;
        margin-top: 0.5%;
        // padding-left: 2.7%;
        height: 90%;
        .el-slider{
            display:inline-block;
            width:100px;
            vertical-align: bottom;
            margin-left: 6px;
        }
        .el-row{
            height: 100%;
        }
        .el-col-19{
            height: 66.7vh;
            width: 66.7vh*16/9;
        }
        .liveWrapper{
            position: relative;
            width: 100%;
            height: 66.7vh;
            background: url(../../assets/img/liveIcon/emptyBg.png) center center no-repeat;
            .playOn{
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: 101;
            }
        }
        .hostViewBox{
            // background: #4AC9AA;
            width: 100%;
            height: 100%;
        }
        .zjstreamOpera.streamOpera{
            .barrageBtn{
                margin-right: 16px;
            }
            .scaleIcon{
                margin-bottom: -14px;
            }
            .cameraCon{
                float: left;
                width: 98%;
            }
            .volLabel{
                margin-right: 14px;
                margin-top: -2px;
            }
            .scaleIcon{
                float: right;
            }
        }
        .streamOpera{
            overflow: hidden;
            // background: rgb(18,23,32);
            .volumnIcon{
                display: inline-block;
                width: 30px;
                height: 30px;
            }
            .micIcon{
                background: url(../../assets/img/liveIcon/micOpend.png) center center no-repeat;
                background-size: 25px 25px;
                cursor: pointer;
            }
            .micIconClosed{
                background: url(../../assets/img/liveIcon/micClosed.png) center center no-repeat;
                background-size: 25px 25px;
            }
            .outputIcon{
                background: url(../../assets/img/liveIcon/outputIcon.png) center center no-repeat;
                background-size: 16*1.26px 16px;
            }
            .barrageBtn{
                float: left;
                position: relative;
                background-color: rgb(155,155,155);
                border-radius: 10px;
                width: 40px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                font-size: 14px;
                color: rgb(155,155,155);
                margin-top: 6px;
                em{
                    transition: left .3s;
                    position: absolute;
                    left: 0px;
                    top: 1px;
                    width: 20px;
                    height: 18px;
                    background: #FFFFFF;
                    box-shadow: 1px 0 9px 0 rgba(0,0,0,0.23);
                    border-radius: 50%;
                    font-size: 12px;
                    // background-image: url(../../assets/img/liveIcon/closeBarrage.png);
                    // background-position: center center;
                    // background-repeat: no-repeat;
                    // background-size: 20px 20px;
                }
            }
            .barrageBtn.openBarrage{
                background: #1AAB8E;
                em{
                    left: 100%-52px;
                    // background-image: url(../../assets/img/liveIcon/openBarrage.png);
                    // background-position: center center;
                    // background-size: 20px 20px;
                }
                color: #1AAB8E;
            }
            .volLabel{
                float: left;
                margin-right: 8px;
                margin-top: 2px;
            }
            .cameraCon{
                float: right;
                margin-top: 6px;
                    margin-right: 20px;
                .cameraIcon{
                    display: inline-block;
                    width: 25px;
                    height: 25px;
                    background-color: #000000;
                    border-radius: 4px;
                    background-image: url(../../assets/img/liveIcon/cameraIcon.png);
                    background-position: center center;
                    background-size: 20*0.83px 20px; 
                    background-repeat: no-repeat;
                    vertical-align: bottom;
                    cursor: pointer;
                }
                .scaleIcon{
                    display: inline-block;
                    width: 30px;
                    height: 30px;
                    border-radius: 4px;
                    background-image: url(../../assets/img/liveIcon/scaleBtn.png);
                    background-position: center center;
                    background-size: 30px 30px; 
                    background-repeat: no-repeat;
                    vertical-align: middle;
                    cursor: pointer;
                    margin-left: 10px;
                }
                .cameraIcon.cameraClosed{
                    background-image: url(../../assets/img/liveIcon/closeCaerma.png);
                    background-size: 28.6px 28px;
                }
                b{
                    font-size: 14px;
                    color: #7E93A6;
                    letter-spacing: 0;
                    line-height: 14px;
                    margin: 0 6px;
                    font-weight: normal;
                    display: inline-block;
                    max-width: 400px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .conBtn{
                    background: #1AAB8E;
                    border-radius: 100px;
                    width: 50px;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    font-size: 14px;
                    color: #FFFFFF;
                }
            }
            .detection{
                float:right;
                color: #fff;
                margin: 8px 10px;
                width: 30px;
                height: 30px;
                cursor: pointer;
                position: relative;
                margin-right: 17px;
                .el-button{
                    width: 30px;
                    height: 30px;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index:2;
                    opacity: 0;
                }
                img{
                   width: 30px;
                   height: 30px;
                    margin-top: -2px;
                    position:absolute;
                    top: 0;
                    left: 6px;
                    z-index: 1;
                }
            }
        }
        .playBtn{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url(../../assets/img/liveIcon/playBtn2.png) center 35% no-repeat;
            z-index: 99;
            background-size: 8%;
            cursor: pointer;
            span{
                position: absolute;
                width: 170px;
                height: 30px;
                background: rgba(0,0,0,1);
                border-radius: 22px;
                font-size: 16px;
                color: #FFFFFF;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
                text-align: center;
                line-height: 30px;
                img{
                    vertical-align: baseline;
                    margin-right: 6px;
                }
                // background-image: url(../../assets/img/liveIcon/living.gif);
                // background-position: 20px center;
                // background-repeat: no-repeat;
            }
        }
        .connectionList{
            margin-top: .5vh;
            // margin-bottom: 2vh;
            overflow: hidden;
            .playBtn{
                background-size: 30%;
            }
            .videoMask{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: url(../../assets/img/liveIcon/img_empty_direct@3x.png) center center no-repeat;
                z-index: 101;
                background-size: 50% 50%;
                background-color: #000;
            }
            li{
                float: left;
                width: 10.5vw;
                height: 10.5vw*3/4;
                position: relative;
                margin-right: 0.8vw;
                margin-bottom: 10px;
                .popLayer{
                    // display: none;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 30px;
                    width: 100%;
                    z-index: 102;
                    background: rgba(0,0,0,0.56);
                    z-index: 106;
                    .nameText{
                        float: left;
                        line-height: 200%;
                        font-size: 14px;
                        height: 100%;
                        color: #FFFFFF;
                        width: 40%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        text-align: center;
                    }
                    .popOpera{
                        float: right;
                        margin-top: 4px;
                        overflow: hidden;
                        width: 52%;
                        height: 80%;
                        text-align: right;
                        display: flex;
                        em{
                            display: inline-block;
                            width: 20px;
                            height: 20px;
                            cursor: pointer;
                            flex:1;
                        }
                        em:nth-child(1){
                            background: url(../../assets/img/liveIcon/micConnect.png) center center no-repeat;
                            background-size: 20*42/54px 20px;
                            margin-right: 0px;
                        }
                        em:nth-child(2){
                            background: url(../../assets/img/liveIcon/cameraIcon.png) center center no-repeat;
                            background-size: 20*45/54px 20px;
                            margin-right: 4px;
                        }
                        em:nth-child(3){
                            background: url(../../assets/img/liveIcon/delConnect.png) center center no-repeat;
                            background-size: 20px 20px;
                            margin-right: 4px;
                        }
                        em.closeVedio{
                            background: url(../../assets/img/liveIcon/camConClose.png) center center no-repeat;
                            background-size: 20*45/54px 20px;
                        }
                        em.closeAudio{
                            background: url(../../assets/img/liveIcon/micConClose.png) center center no-repeat;
                            background-size: 20*42/54px 20px;
                        }
                    }
                }
            }
            li:hover{
                .popLayer{
                    display: block;
                }
            }
            li:last-child{
                margin-right: 0;
            }
        }
    }
    @media (max-height: 768px){
        .streamBox{
            height: 86%;
        }
    }
    .kickedOut{
        background: url(../../assets/img/liveIcon/emptyBg.png) center center no-repeat;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        p{
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            text-align: center;
            font-size: 18px;
            color: #FFFFFF;
            line-height: 16px;
            height: 4vh;
            padding-top: 6.1vw;
            background: url(../../assets/img/liveIcon/img_empty_direct@3x.png) top center no-repeat;
            background-size: 4.6vw 4.6vw*192/183;
        }
    }
</style>
<style lang="less">
    .streamBox{
        .el-slider{
            .el-slider__button{
                width: 10px;
                height: 10px;
                border: 0 none;
            }
            .el-slider__button-wrapper{
                top: -16px;
                z-index: 10;
            }
            .el-slider__bar,.el-slider__runway{
                height: 3px;
                // border-radius: 6px;
            }
            .el-slider__bar{
                background-color: #1AAB8E;
            }
        }
    }
</style>


<style type="text/css" lang="less">
@import "../../assets/reset-element-ui/sw.css";
.singalBox{
    background-image: linear-gradient(-180deg, #232E44 0%, #232833 59%, #232E44 100%);
    color: #fff;
    height: 100%;
    position: relative;
    // margin-top: -3px;
    letter-spacing: 1px;
    overflow: hidden;
    .tab{

        border-bottom: 1px solid rgba(255,255,255,0.05);
        color: #ccc;
        font-size: 14px;
        .dis{
            margin-right: 3%;
            float: left;

        }
        .gray{
            color: #9B9B9B;;
        }

        li{
            position:relative;
            float: left;
            width: 18%;
            margin:0 6.5%;
            text-align: center;
            transition: .2s;
            cursor: pointer;
            user-select: none;
            .sessionName{
                position:relative;
                display:inline-block;
            }
            .curIcon{
                position:absolute;
                right:-10px;
                top:-9px;
                width:15px;
                height:15px;
                img{
                    position: absolute;
                    transform: rotate(10deg) skew(10deg,0);
                    display:block;
                }
                .singOne{
                    opacity: 0;
                    width: 10px;
                    height: 10*24/30px;
                    left: 0;
                    bottom:-5px;
                }
                .singTwo{
                    opacity: 0;
                    width: 15px;
                    height: 15*33/42px;
                    left: 1%;
                    transform: rotate(13deg) skew(10deg, 0);
                    bottom: -31%;
                }
                .signThree{
                    opacity: 0;
                    width: 20px;
                    height: 20*39/57px;
                    right: -4px;
                    top: 4px;
                    transform: rotate(12deg) skew(10deg, 0);
                }
            }
            .connectHint{
                .singOne{
                    animation: wifi 1s linear 1s infinite;
                    -webkit-animation: wifi 1s linear 1s infinite;
                    -moz-animation: wifi 1s linear 1s infinite;
                    -o-animation: wifi 1s linear 1s infinite;
                }
                .singTwo{
                    animation: wifi 1s linear 2s infinite;
                    -webkit-animation: wifi 1s linear 2s infinite;
                    -moz-animation: wifi 1s linear 2s infinite;
                    -o-animation: wifi 1s linear 2s infinite;
                }
                .signThree{
                    animation: wifi 1s linear 3s infinite;
                    -webkit-animation: wifi 1s linear 3s infinite;
                    -moz-animation: wifi 1s linear 3s infinite;
                    -o-animation: wifi 1s linear 3s infinite;
                }
            }
        }

        .cur{
            font-size: 16px;
            border-bottom:3px solid #1AAB8E;
            color: #3adbd2;
            height: 37px;
            pointer-events: none;
        }
        .n-cur{
            font-size: 14px;
            color: #3adbd2;
        }

    }
    .tab-title{
        height: 37px;
    }
    .tab-hei{
        padding-top: 8px;
        height: auto!important;
    }
    @keyframes wifi {
        0% {
            // background: red;
            opacity: 0;
        }
        50% {
            opacity: 0.5;
        }
        100% {
            opacity: 1;
        }
    }
}
.noclass{
    p{
        position:absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        text-align: center;
        font-size: 18px;
        color: #FFFFFF;
        line-height: 16px;
        height: 4vh;
        padding-top: 6.1vw;
        background: url(../../assets/img/liveIcon/img_empty_direct@3x.png) top center no-repeat;
        background-size: 4.6vw 4.6vw*192/183;
    }
}
</style>
<style lang="less">
    #app,html{
        height: 100%;
    }
    .showbarrageBox{
        overflow: hidden;
        position: relative;
        .barrageItem{
            position: absolute;
            left: 100%;
            white-space: nowrap;
            height: 38px;
            line-height: 38px;
            font-size: 16px;
            color: #fff;
            -webkit-transition: -webkit-transform 25s linear;
            -moz-transition: -moz-transform 25s linear;
            -o-transition: -o-transform 25s linear;
            transition: transform 25s linear;
            z-index: 99999999999;    
            text-shadow: 0 1px 4px #000000;        
        }
        .hornItem{
            background-image: linear-gradient(270deg,#46A5DF 0%, #3A7DE3 100%);
            border-radius: 50px;
            color: #fff;
            font-size: 15px;
            height: auto;
            line-height: normal;
            padding: 4px 14px;
            text-shadow: 0 0px 0px #000000;
            em{
                color:#F8E71C;
            }
            img{
                width: 45/39*12px;
                height: 12px;
                margin-right: 6px;
                margin-top: -2px;
            }
        }
        .administrator,.tourists{
            b{
                background-image: linear-gradient(90deg, #51ECCE 0%, #248D53 100%);
                font-weight:normal;
                font-size: 14px;
                color: #FFFFFF;
                letter-spacing: 0;
                line-height: 14px;
                padding: 0 4px;
                margin-right: 4px;
                border-radius: 2px;
            }
            img{
                height: 20px;
                width: 40px;
                margin-right: 4px;
                margin-top: -2px;
            }
        }
        .animate{
            -webkit-transform: translateX(-3420px);
            -moz-transform: translateX(-3420px);
            -ms-transform: translateX(-3420px);
            -o-transform: translateX(-3420px);
            transform: translateX(-3420px);
        }
    }
</style>

