<template>
    <div class="z-contant">
        <div class="answer_box">
            <header>
                <span>答题器</span>
                <!-- <i class="closeBtn" @click.stop="handleClose(false)">&times;</i> -->
            </header>
            <div class="answerinfo">
                <span class="span_1">答题人数：{{allpeople}}</span>
                <span class="span_3">用时：{{usetime}}</span>
            </div>
            <div class="progress_box">
                <ul>
                    <li v-for="(questions,index) in allquestion" :key="index">
                        <img src="../../../assets/images/liveIcon/duihao.png" alt="" :style="{opacity:questions.question==rightanswer?1:0}">
                        <h1>{{questions.question}}</h1>
                        <div class="progress">
                            <span :style="{width:progresswidth[index],background:color[index]}"></span>                                                        
                            <h2 :style="{color:color[index]}">{{apeople[index]}}</h2> 
                        </div>
                                               
                    </li>
                </ul>
                                
            </div>
            <div class="answer_end">
                  <button @click="endanswer(true)" class="btn_1">结束答题</button>
                  <button @click="closeanswer(false)" class="btn_2">关闭</button>    
            </div>    
        </div>
        <!-- 结束答题弹框组建 -->
        <transition name="slide-fadein">
            <answerEnd  v-if="showanswerend" @showanswerisend="showanswerisend" :controller="controller" :answerenddata="answerenddata" :useendtime="passusetime"></answerEnd>
        </transition>
    </div>
</template>
<script>
import {publishanswer,passendanswerdata} from '@/sw/utils/sig.js'
import answerEnd from './answerend'
import live from '@/model/live/live.js'
import { clearInterval, setInterval } from 'timers';
export default {
    data(){
        return{
            allpeople:0,
            correctlv:0,
            usetime:"",
            passusetime:"",
            allquestion:[],
            getanan:[],
            color:["#009791","#4A90E2","#7D70CD","#CF788D","#009791","#4A90E2","#7D70CD","#CF788D"],
            apeople:[0,0,0,0,0,0,0,0],
            progresswidth:[0,0,0,0,0,0,0,0],
            rightanswer:"",
            getanswerdata:{},
            showanswerend:false,
            answerenddata:{},
            timer:null,
            timermin:0,
        }
    },
    filters:{
        jindu:function(val){
            if(!val){
                return 0
            }else{
                return parseInt(val*100)+'%'
            }
        }
    },
    props:["controller"],
    computed:{
        courseId(){
            return this.$route.query.courseId
        },
        clazzId(){
            return this.$route.query.clazzId
        },
    },
    created(){
        this.getanswerdata=this.$store.getters.getanswer;
        this.handleanswerdata();
        this.getanswer();
        this.gettime();
    },
    mounted(){
        this.detescreen()
    },
    components:{
        answerEnd,
    },
    methods:{
        
        //答题计时函数
        gettime(){
            this.timer=setInterval(()=>{
                this.timermin+=1;
                this.formatSeconds(this.timermin)
            },1000)
        },
        formatSeconds(value) { 
            let theTime = parseInt(value);// 秒 
            let theTime1 = 0;// 分 
            let theTime2 = 0;// 小时 
            if(theTime > 60) { 
                theTime1 = parseInt(theTime/60); 
                theTime = parseInt(theTime%60); 
                if(theTime1 > 60) { 
                theTime2 = parseInt(theTime1/60); 
                theTime1 = parseInt(theTime1%60); 
                } 
            };
            theTime=theTime<10?'0'+theTime:theTime;
            theTime1=theTime1<10?"0"+theTime1:theTime1;
            theTime2=theTime2<10?"0"+theTime2:theTime2;
            this.usetime=theTime2+":"+theTime1+":"+theTime;           
        }, 
        showanswerisend(bl){
            this.showanswerend=true;
            // this.handleClose()
        },
        //关闭弹窗
        handleClose(){
            this.$emit("showansweris");
        },
        //结束答题
        endanswer(){
            let data={
                id:this.getanswerdata.ext.questionId
            };
            live.liveanswerend(data,(res=>{
                if(res.status==200){
                    let userinfo=res.data.questionAndAnswerUsers;
                    let newinfo=[]; //答案选项集合
                    for (let i = 0; i < userinfo.length; i++) {
                        let oneinfo={};
                        oneinfo.question=userinfo[i].question;
                        if(userinfo[i].answerUsers){
                           oneinfo.people=userinfo[i].answerUsers.length;
                        }else{
                            oneinfo.people=0;
                        }
                        
                        newinfo.push(oneinfo)
                    };
                    let allpeopel=0;//获取总人数
                    for (let j = 0; j < this.apeople.length; j++) {
                        allpeopel+=this.apeople[j];
                        
                    };
                    let rightlv="0%";//计算正确却率
                    let rightArr={};
                    newinfo.forEach(val=>{
                        if(val.question==this.rightanswer){
                            rightArr=val
                        }
                    });
                    if(rightArr.people==0){
                       rightlv='0%' 
                    }else{
                        let a=rightArr.people;
                        rightlv=(a/allpeopel);
                        rightlv=parseInt(rightlv*100)+'%'
                    }                    
                    // console.log(newinfo)
                    //发送频道消息，推送答题结果                    
                    this.controller.sendChannelMsg(passendanswerdata("OVER_TASK","ANSWER",this.getanswerdata.ext.questionId,newinfo,this.rightanswer,allpeopel,rightlv));
                    //关闭进度弹窗，打开结果弹窗
                    this.passusetime=this.usetime;

                }
            }))
        },
        //关闭答题
        closeanswer(){
            let data={
                id:this.getanswerdata.ext.questionId
            };
            live.livecloseanswer(data,(res=>{
                if(res.status==200){
                    this.controller.sendChannelMsg(publishanswer("PUBLISH_CLOSE","ANSWER",this.getanswerdata.ext.questionId,'','',''));
                    this.handleClose(false);
                }
            }))            
        },
        //操作答题器数据
        handleanswerdata(){
            this.rightanswer=this.getanswerdata.ext.result;
            this.allquestion=this.getanswerdata.ext.options;
        },
        //接收频道传递过来的消息，如果登陆着是助教角色则显示答题器
        getanswer(){
            let _this=this;

            _this.allquestion.forEach((val,index)=>{
                _this.getanan.push(val.question)

            });
                      
            _this.controller.receiveChannelAnsMsg(function(account,uid,msg){                                        
                let data=JSON.parse(msg);
                console.log("用来接收一些信息",data)
                if(data.command=="FINISHED_TASK" && data.fromRole=="Attendee" && data.ext.type=="ANSWER"){
                    console.log("来自学员答题的提交信息",data);
                    _this.allpeople+=1;
                    // 计算进度条宽度
                    let result=data.ext.result;
                    let weizhi=_this.getanan.indexOf(result);                    
                    _this.apeople[weizhi]+=1;
                    for (let i = 0; i < _this.apeople.length; i++) {
                        let pwidth=(_this.apeople[i])/_this.allpeople*350+"px"
                        _this.$set(_this.progresswidth, i,pwidth)
                    }
                }else if(data.command=="OVER_TASK" && data.ext.type=="ANSWER"){
                    console.log("来自主播推送的结束答题器信息",data)
                    _this.showanswerisend(true);
                    //将数据发到答题卡结束信息的界面
                    _this.answerenddata=data;                    
                }else if(data.command=="PUBLISH_CLOSE" && data.ext.type=="ANSWER"){
                    console.log("来自主播推送的关闭答题器信息",data);
                     _this.$emit("showansweris");
                }
                
            })  
        },
        //检测屏幕高度，在小于960的屏幕下将弹窗高度上移至5vh，保证不会被压到下面的按钮
        detescreen(){
            let screenheight=$(window).height();            
            if(screenheight<=768 && this.allquestion.length>6){
                $(".answer_box").css({"top":"5vh"})
            }
        },
    },
    destroyed(){
        clearInterval(this.timer)
    },
}
</script>

<style lang="less" scoped>
.slide-fadein-enter-active {
    transition: all .3s ease;
    }
    .slide-fadein-leave-active {
    transition: all .3s cubic-bezier(0, 0.5, 0.8, 1.0);
    }
    .slide-fadein-enter, .slide-fadein-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(-10px);
    opacity: 0;
    }
.z-contant{
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    .answer_box{
        width: 574px;
        min-height: 405px;
        background: #212833;
        border-radius: 10px;
        position: absolute;
        top:15vh;
        left: 50%;
        margin-left: -287px;
        overflow: hidden;
        header{
            text-align: center;
            margin-top: 3.3vh;
            position: relative;
            span{
                display: inline-block;
                padding: 0 30px;
                background: url(../../../assets/img/liveIcon/titleLeft.png) center left no-repeat,
                            url(../../../assets/img/liveIcon/titleRight.png) center right no-repeat;
                background-size:20px 16px;
                font-size: 18px;
                color: #FFFFFF;
                letter-spacing: 0;
                line-height: 18px;
                height: 20px;
    
            }
            .closeBtn{
                position: absolute;
                width: 28px;
                height: 28px;
                top:-26px;
                right: 6px;
                background-color: #121720;
                border-radius: 28px;
                cursor: pointer;
                text-align: center;
                line-height: 28px;
                font-size: 24px;
                color: #ffffff;
            }   
        }
        .answerinfo{
            width: 100%;
            overflow: hidden;
            font-size: 14px;
            color: #B8E986;
            margin-top: 20px;
            .span_1{
                margin-left: 187px;
            }
            .span_2{
                margin-left: 40px;
            }
            .span_3{
                margin-left: 40px;
            }
        }
        .progress_box{
            width: 500px;
            margin: 35px auto;
            
            ul{
                width: 100%;
                overflow: hidden;
                li{
                    width: 100%;
                    overflow: hidden;
                    margin-top: 26px;
                    img{
                        float: left;
                        max-width:25px;
                    }
                    h1{
                        float: left;
                        font-size: 21px;
                        color: #FFFFFF;
                        margin-left: 10px;
                    }
                    .progress{
                        width: 395px;
                        overflow: hidden;
                        margin-left: 14px;
                        float: left;
                        span{
                            height: 10px;
                            float: left;
                            border-radius: 10px;
                            margin-top: 6px;
                            margin-left: 14px;
                            transition: all 0.3s;
                        } 
                        h2{
                            float: left;
                            font-size: 20px;
                            color: #05CDC5;
                            margin-left: 14px;
                        }                       
                    }
                    
                }
            }
        }
       
        .answer_end{
            width: 100%;
            overflow: hidden;
            background: rgba(255,255,255,0.03);
            margin-top: 40px;

            .btn_1{
                width: 120px;
                height: 34px;
                background-image: linear-gradient(-102deg, #F2829C 12%, #ED5F5F 97%);
                border-radius: 22px;
                font-size: 16px;
                color: #FFFFFF;        
                margin: 20px auto;
                margin-left: 151px;
            }
            .btn_2{
                width: 120px;
                height: 34px;
                background: #000000;
                border-radius: 18px;
                border-radius: 22px;
                font-size: 16px;
                color: #FFFFFF;        
                margin: 20px auto;
                margin-left: 25px;
            }
        }  
    }
}
</style>

