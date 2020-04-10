<template>
    <div class="tourclasspop" >
        <tour-class
            :show.sync = "tourShow"
            contWidth = '780px' 
			contHeight = 'auto'
			bgColor="#212833"
			:before-close="closeConfirm" 
			@open="open"
			@update="update"
            >
            <div slot="header" class="header">
                <a href="javascript:;" class="screenshots" id="screenShots" @click="tourShoot">
                    <i class="icon-screenshots"></i>
                    截屏
                </a>
            </div>
            <div slot="body" class="content" ref="captureEle"  v-loading="tourLoading" element-loading-text="拼命加载中">
                <p class="curtime">
                    <i class="icon-time"></i>
                    当前时间：{{timenow}}
                </p>
                <section class="swiper-box" id="tourClassCut">
                    <ul class="items clearfix">
                        <!-- <li class="item" >
                            <img src="https://www.shixunbao.cn/images/product/viewdata.gif" alt="">
                            <p class="txt">啊啊啊<span class="status">斯蒂芬是否</span></p>
                        </li> -->
                        <li class="item" v-for="(item,index) in conStream" ref="liref" :key="index" :id="item.playAreaId+item.getId()">
                            <!-- <div class="playBtn" ></div> -->
                            <p class="txt">{{item.stuname.length>5?item.stuname.substr(0,5)+'...':item.stuname}}<span class="status">{{item.status}}</span></p>
                        </li>
                        
                    </ul>
                </section>
            </div>
            <div slot="footer" class="footer">
                <a href="javascript:;" class="refresh" @click="goNext();">
                    <i class="icon-refresh"></i>
                    换一换
                </a>
            </div>
        </tour-class>
    </div>
</template>
<script>
import tourClass from "base/modal/tourclass"
import { tourClassStatus } from '@/sw/utils/sig'
import live from '@/model/live/live'
import storage from '@/global/storage'
import html2canvas from 'html2canvas'
export default {
    data() {
        return {
            tourLoading:true, //loading状态
            timenow: '',    // 当前时间
            items: [], // 当前邀请学员显示
            curpage: 1,   // 当前页码
            limit: 6,   // 每页默认显示条数
            total: 8,      // 总条数  总的学员人数
            conStream: [],      // 当前巡课接收的流
            stuStream: {}, // 点对点收到的学生状态
            tourClassInterval:null,     // 巡课轮训      
            lastServeTime: 0,           // 上次服务器时间
            lastLocalTime: 0,           // 上次本地时间
            openTime : 0, // 打开弹框时间
        }
    },
    props: ['tourShow','liveController', 'courseId','liveAuthInfo',"touring"],
    computed: {
        name() {
            return storage.get('exp_name');
        },
        uid() {
            return storage.get('exp_userId');
        },
        
    },
    created() {
        // 接收巡课频道消息
        this.receiveMsgTour();
        this.receivePtoPtour();
        
    },
    updated() {
        // this.mergeArray();
    },
    directives:{},
    methods: {
        open() {
            this.openTime = new Date().getTime();
            
            // 设置频道属性
            this.liveController.addChannelAttr('tourclass', '_1_',()=>{
                // 发起连麦
                this.goNext();
            });
        },
        update() {
            
        },
        getCurTime() {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            let strMin = date.getMinutes()>9?date.getMinutes():"0"+date.getMinutes()
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                    + " " + date.getHours() + seperator2+ strMin;
            // var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            //         + " " + date.getHours() + seperator2 + date.getMinutes()
            //         + seperator2 + date.getSeconds();
            this.timenow = currentdate;
        },
        // 获取学员
        getStudent() {
            this.tourLoading = true;
            let data = {
                roomCode: this.liveAuthInfo.roomCode
            }
            // 关闭所有学员巡课
            // this.tourClassOver();
            live.liveRoomLookStuList(data, (res => {
                console.log("在线学员=====", res);
                let userIds = [];
                if(res.status == 200) {
                    this.lastLocalTime = new Date().getTime();
                    this.lastServeTime = Number(res.time);
                    this.tourLoading = false;
                    this.items = res.data;
                    let num = res.data.length;
                    if(num > 0) {
                        this.items.forEach((val,index)=> {
                            if(userIds.indexOf(val) == -1){
                                userIds.push(val.id);
                            }
                                
                        })
                        // 开启巡课
                        this.tourClassOpen(userIds);
                    } else {
                        this.$message.error("巡课已结束！");
                        clearInterval(this.tourClassInterval);
                        this.close();
                    }
                    
                } else {
                    this.tourLoading = false;
                    this.$message.error(res.message);
                    clearInterval(this.tourClassInterval);
                    this.close();
                }
            }));
        },
        // 接收点对点消息
        receivePtoPtour() {
            this.liveController.receiveTourPtoPMsg((account,uid,msg)=>{
                console.log("%c 点对点消息","color:blue; font-size:26px",account, uid);
                let data = JSON.parse(msg);
                console.log("%c 点对点消息","color:red; font-size:26px", data)
                let status = '';
                //判断是否禁用了摄像头或者没有摄像头
                if(data.ext&&data.ext.visible){
                    status = '';
                    if(!data.ext.videoInput){
                        status = '无摄像头';
                    }else if(!data.ext.camerastate){
                        status = '拒绝授权';
                    }
                }else{
                    status = '非直播页面';
                    if(!data.ext.videoInput){
                        status = '无摄像头';
                    }else if(!data.ext.camerastate){
                        status = '拒绝授权';
                    }
                }
                this.stuStream[data.ext.stu.stuId]={
                    stuId: data.ext.stu.stuId,
                    stuname: data.ext.stu.stuname,
                    visible: data.ext.visible,
                    videoInput: data.ext.videoInput,
                    camerastate: data.ext.camerastate,
                    status: status
                }
                this.mergeInfo();
            })
        },
        //插入信息
        mergeInfo(){
            //区分巡课
            
            this.conStream.forEach(item=>{
                if(this.stuStream[String(item.getId())]){
                    clearTimeout(item.timeout);
                    Object.assign(item,this.stuStream[String(item.getId())]);
                }
            })
        },        
        // 接收频道消息关闭巡课
        receiveMsgTour() {
            this.liveController.receiveChannelTourMsg((accout,uid,msg)=>{
                let data = JSON.parse(msg);
                if(this.liveAuthInfo.authInfo.account!=accout&&data.command == "TOURCLASS_OVER") {
                    this.liveController.tourClassFlag(false);
                    if(this.tourShow){
                        this.closeTourClass();
                        this.$emit('update:tourShow', false);
                        clearInterval(this.tourClassInterval);
                        this.$message.error("连麦互动中，无法使用此功能。");
                    }
                    this.$emit('update:touring', false);
                }else if(data.command == "TOURCLASS_OPEN"){
                    this.$emit("tourClassOpen")
                }
            })
        },
        // 关闭巡课给后台
        closeTourClass() {
            
            let data = {
                roomCode: this.liveAuthInfo.roomCode
            }
            live.liveRoomTourEnd(data, (res => {
                console.log("关闭巡课", res);
                if(res.status == 200) {
                    // 设置频道属性
                    this.liveController.addChannelAttr('tourclass', '_0_');
                    this.conStream=[];
                    this.stuStream={};
                } else {
                    this.$message.error(res.message);
                }
            }))
        },
        tourClassOpen(userIds) {
            // this.lastLocalTime = new Date().getTime();
            // this.lastServeTime = Number(res.time);
            let currentTime = new Date().getTime() - this.lastLocalTime + this.lastServeTime;
            // return
            console.log("在线人员列表 userIds=====", userIds);
            this.liveController.sendChannelMsg(tourClassStatus("TOURCLASS_OPEN", this.courseId, userIds, this.name, this.uid, currentTime),()=>{
                userIds.forEach(item=>{
                    let obj = {getId:()=>{return item},playAreaId:"liveItem",stuname:"",status:''};
                    obj.timeout = setTimeout(()=>{
                        obj.status="用户未做操作";
                        this.items.forEach(val=>{
                            if(item==val.id)
                                obj.stuname=val.name;
                        })
                    },20*1000)
                    this.conStream.push(obj)
                });
                clearInterval(this.tourClassInterval);
                this.tourClassInterval=setInterval(()=>{this.goNext()},30*1000)
            })
        },
        tourClassOver(userIds) {
            this.liveController.sendChannelMsg(tourClassStatus("TOURCLASS_OVER", this.courseId, userIds));
            clearInterval(this.tourClassInterval);
            
        },
        
        goNext() {
            clearInterval(this.tourClassInterval);
            this.getCurTime();
            this.getStudent();
            this.conStream=[];
        },
        close() {
            //结束训课---cdn编码开启
            this.liveController.tourClassFlag(false);
            this.tourClassOver();
            this.closeTourClass();
            this.$emit('update:tourShow', false);
            
            
        },
        closeConfirm(){
            if(new Date().getTime() - this.openTime < 5*1000){
                this.$message.error("操作太快，请稍后再试");
                return
            }
            this.$confirm('是否确定关闭巡课功能?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.close();
            }).catch(()=>{
                console.log("cancel tourClass Closed");
            })
        },
        tourShoot(){
            let list = this.$refs.liref;
            let canvas = document.createElement("canvas");
            let imgList = new Array();
            list.forEach(item=>{
                // let videoTag = 
                let videoTag = item.getElementsByTagName('video')[0];
                if(videoTag){
                    let parent = videoTag.parentNode;
                    canvas.width = videoTag.videoWidth;
                    canvas.height = videoTag.videoHeight;
                    canvas.getContext('2d').drawImage(videoTag, 0, 0, canvas.width, canvas.height);
                    let img = document.createElement("img");
                    img.src = canvas.toDataURL('image/png');
                    parent.insertBefore(img,videoTag);
                    imgList.push(img);
                }
            })
            html2canvas(this.$refs.captureEle).then(canvas => {
                // document.body.appendChild(canvas);
                console.log(this.$refs.captureEle)
                let url = canvas.toDataURL('image/png');
                let dom = document.createElement('a');
                dom.href= url;
                let currentDate = new Date();
                let year = currentDate.getFullYear();
                let months = currentDate.getMonth()+1<10?"0"+(currentDate.getMonth()+1):currentDate.getMonth();
                let currentDay = currentDate.getDate()<10?"0"+currentDate.getDate():currentDate.getDate();
                let hours = currentDate.getHours()<10?"0"+currentDate.getHours():currentDate.getHours();
                let minutes = currentDate.getMinutes()<10?"0"+currentDate.getMinutes():currentDate.getMinutes();
                let seconds = currentDate.getSeconds()<10?"0"+currentDate.getSeconds():currentDate.getSeconds();
                let downloadName = year+"-"+months+"-"+currentDay+" "+hours+"："+minutes+"："+seconds+"截屏";
                dom.download=downloadName;
                console.log(downloadName);
                let customE = new MouseEvent('click');
                dom.dispatchEvent(customE);
                imgList.forEach(item=>{
                    item.parentNode.removeChild(item);
                })
            });
        }
        
    },
    destroyed() {
        // 接收远端流
        // this.getDistalStream();
        // this.getDistalStreamRemoved();
    },
    components: {
        tourClass
    }
}
</script>
<style lang="less" scope>
@import "../../assets/reset-element-ui/form.css";
    .icon-screenshots {
        display:inline-block;
        width: 20px;
        height: 21px;
        background: url("../../assets/img/liveIcon/icon-screenshots.png") 0 0 no-repeat;
        background-size: 100% 100%;
    }
    .icon-time {
        display:inline-block;
        width: 14px;
        height: 14px;
        background: url("../../assets/img/liveIcon/icon-time.png") 0 0 no-repeat;
        background-size: 100% 100%;
    }
    .icon-refresh {
        display:inline-block;
        width: 13px;
        height: 14px;
        background: url("../../assets/img/liveIcon/icon-refresh.png") 0 0 no-repeat;
        background-size: 100% 100%;
    }
    .no-camera {
        display:inline-block;
        width: 49px;
        height: 54px;
        background: url("../../assets/img/liveIcon/no-camera.png") 0 0 no-repeat;
        background-size: 100% 100%;
    }
    .header {
        text-align: right;
        padding-top: 15px;
        .screenshots {
            font-size: 16px;
            color: #FFFFFF;
            margin-right: 80px;
        }
        .icon-screenshots {
            vertical-align: text-bottom;
        }
    }
    .content {
        padding: 30px 35px;
        .curtime {
            font-size: 16px;
            color: #FFFFFF;
            line-height: 50px;
            background: rgb(33, 40, 51);
        }
        .swiper-box {
            width: 710px;
            height: 438px;
            background: #212833;
            overflow: hidden;
        }
        .items {
            height: auto;
        }
        .item {
            position: relative;
            float: left;
            background-color: #282f3a;
            background:  #282f3a url("../../assets/img/liveIcon/no-camera-bg.png") center center no-repeat;
            background-size: cover;
            border: 1px solid #979797;
            border-radius: 10px;
            padding: 10px;
            margin-right: 20px;
            margin-bottom: 20px;
            text-align: center;
            font-size: 16px;
            color: #FFFFFF;
            width: 221px;
            // height: 199px;
            height: 170px;
            img{
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
            }
            &:nth-child(3n) {
                margin-right: 0;
            }
            .status {
                color:rgb(240, 150, 28);
                margin-left: 5px;
            }
            .txt {
                position: absolute;
                bottom: 0;
                line-height: 30px;
                margin-top: 15px;
                z-index: 9;
                background: rgba(0,0,0,0.5);
                height: 30px;
                width: 201px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            >video {
                width: 199px;
                height: 146px;
                border-radius: 10px;
            }
            .playBtn{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: url(../../assets/img/liveIcon/playBtn.png) center center no-repeat;
                z-index: 99;
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
        }
    }
    .tourclasspop{
        .el-loading-mask{
            background:rgb(33, 40, 51)!important;
        }
    }
    .footer{
        background: #282f3a;
        width: 100%;
        height: 70px;
        border-radius: 0 0 10px 10px;
        text-align: center;
        .refresh {
            display: inline-block;
            margin: 18px auto;
            background: rgb(53, 58, 68);
            border-radius: 18px;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 1em;
            padding: 8px 20px;
        }
        .icon-refresh {
            vertical-align: middle;
        }
    }
</style>