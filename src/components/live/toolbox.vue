<template>
    <div class="tool_box">        
        <div class="settingOuter">
            <i class="closeBtn" @click.stop="handleClose('that')">&times;</i>
            <div class="popInner">
                <ul>
                    <Throttle :wait="500" :isDebounce="false" events="click">
                        <li @click="dialogTipbox">
                            <img src="../../assets/images/liveIcon/tool5.png" alt="">
                            <span>签到</span>
                        </li>
                    </Throttle>
                    
                    <li @click="answersheet">
                        <img src="../../assets/images/liveIcon/tool6.png" alt="">
                        <span>答题卡</span>
                    </li>
                </ul>                
            </div>
        </div> 
        <!-- 确认开启的弹窗-->
        <Actpop :dialogTip.sync="dialogTip" :type="type" :aswitch='aswitch' @showtoollist="showtoollist" :liveController="controller"></Actpop>
        <!-- 签到弹窗 -->
        <transition name="slide-fade">
            <Toolboxlist v-if="Toolboxlistdialog" @hiddertoolbox="hiddertoolbox"  :liveController="controller" :signpassdata="signpassdata" ></Toolboxlist>
        </transition> 
        <!-- 创建签到错误提示弹窗  -->
        <errorsign :signerror.sync="signerror"  :type="type" :aswitch='aswitch' :message="message" @showerrorsign="showerrorsign"></errorsign>
            
    </div>        
</template>

<script>
    import Actpop from './actpop';
    import Toolboxlist from './toolboxlist';
    import errorsign from './errorsign';
    import live from 'model/live/live';
    import clazz from 'model/clazz/signin';
    import answerSheet from './answer/answer'
    import { startsign } from '@/sw/utils/sig';
    export default{
        data(){
            return{
               dialogTip:false, //提示弹窗 
               type:'SIGN',//什么样的弹窗
               aswitch:'start',
               Toolboxlistdialog:false,
               signpassdata:{},
               newsign:{},
               signerror:false,
               message:'',
               
            }
        },
        computed:{
            courseId(){
				return this.$route.query.courseId
            },
            clazzId(){
                return this.$route.query.clazzId
            },
        },
        props:["controller"],
        created(){
           this.gettoollist();

        },       
        methods:{           
            handleClose(val){
                this.$emit("openanswer",val);
            },
            showtoollist(){
                //确认开启后回调发送开启信令
                this.gignin();                
            },
            hiddertoolbox(){                 
                //  this.$emit("showtoobox");
                this.Toolboxlistdialog=false
            },
            dialogTipbox(){                
                // this.gignin();
                this.getsignlist();
            },
            showerrorsign(){
                this.signerror=false;
            },
            //查询当前班级下面有没有签到
            getsignlist(){
                let data={
                    clazzId :this.clazzId 
                };
                live.liveforsignin(data,(res=>{
                    if(res.status==200 && res.data){
                        console.log("签到时间",res)
                        //有签到，直接显示签到列表
                        // console.log("当前班级下的签到列表",res.data);
                        if(res.data){
                            this.signpassdata=res.data
                            this.Toolboxlistdialog=true //显示签到列表                           
                        }
                        
                    }else if(res.status==205){
                        //刚刚关闭了签到还不能创建
                           this.signerror =true; //显示错误提示
                           this.dialogTip=false; //关闭提示确认开启弹窗
                           this.message=res.message;

                    }else{
                         //创建签到
                         this.dialogTip=true; //打开提示确认开启弹窗
                          this.signerror=false;
                    }
                }))
            },                                 
            //开启签到签到
			gignin(){
				let data={
					courseId:this.courseId
				}
				live.livestartsignin(data,(res=>{
					if(res.status==200){
                            console.log("新床间的签到活动",res.data)
                            this.signpassdata=res.data
                            //发信令开启签到
                            this.Toolboxlistdialog=true
                             this.dialogTip=false;
                            this.controller.sendChannelMsg(startsign("PUBLISH_TASK",this.type, res.data.id,''));                     												
					}else if(res.status==205){
                        //刚刚关闭了签到还不能创建
                           this.signerror =true;
                           this.dialogTip=false;
                           this.message=res.message;
                    }
				}))
            },
            //接受频道传递的消息
            gettoollist(){
                let _this=this;
                _this.controller.receiveStuPtoPMsg(function(account,uid,msg){ 
                                                          
                    let data=JSON.parse(msg);
                    console.log("接收来自学员端的签到",data) 
                    // console.log(data)
                    if(data.command=="FINISHED_TASK"){
                        //签到列表的返回数据                        
                        _this.signList.push(data.ext.user)
                    }
                })  
            },
            //答题卡弹窗
            answersheet(){               
                this.getpublishanswer();
            },
            //查询当前班级下是否存在答题器，存在则直接打开答题器进度，不存在则重新创建答题器
            // {
            //     "command":"PUBLISH_TASK",
            //     "fromRole":"Broadcaster",
            //     "ext":{
            //         "type":"ANSWER",
            //         "questionId":"5c404f9aa435a18be4b1fdab",
            //         "options":
            //         [{"question":"A"},{"question":"B"},{"question":"C"},{"question":"D"}],
            //         "result":"C"}
            //         }
            getpublishanswer(){
                let obgext={};
                let data={
                    courseId:this.courseId
                };
                live.liveforanswer(data,(res=>{
                    console.log("答题卡借口查询到的数据",res)
                    if(res.status==200){
                        if(res.data==undefined){
                            //不存在答题卡,关闭当前弹窗，打开答题卡选择弹窗
                             this.$emit("openanswer",'this')
                        }else{
                             obgext.ext={
                                "type":"ANSWER",
                                "questionId":res.data.id,
                                "options":res.data.questionAndAnswerUsers,
                                "result":res.data.anser
                             };
                             
                             this.$store.state.answerdata=obgext;
                             this.$emit("openanswer",'')
                            
                        }                                               
                    }
                }))
            },
            //删除答题卡
            deleteanswer(msg){                
                let data={                    
                    id:msg.id                
                    };                
                    live.livecloseanswer(data,(res=>{                    
                        if(res.status==200){                        
                            console.log("删除成功")                        
                            // this.isshowanswer=!this.isshowanswer                    
                            }               
                        }))            
                        },
            
            tableanswer(bl){
                this.isshowanswer=bl
            },
            

        },
        components:{
            Actpop,
            Toolboxlist,
            errorsign,
            answerSheet,
        }
    }
</script>

<style lang="less" scoped>
    .slide-fade-enter-active {
    transition: all .3s ease;
    }
    .slide-fade-leave-active {
    transition: all .3s cubic-bezier(0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(-20px);
    opacity: 0;
    }
.tool_box{
    width: 100%;
    height: 100%;
    background-color: rgba(216, 216, 216, 0);
    position: fixed;
    top: 0;
    left: 0;
    z-index:100; 
    .settingOuter{
        width:467px;
        height:187px;
        overflow: hidden;
        position: fixed;
        top:15vh;
        left:50%;
        margin-left: -233px;
        border-radius: 10px;
        background: #121720;
        overflow: hidden;
        .closeBtn{
            position: absolute;
            width: 28px;
            height: 28px;
            top:6px;
            right: 6px;
            background-color: #121720;
            border-radius: 28px;
            cursor: pointer;
            text-align: center;
            line-height: 28px;
            font-size: 24px;
            color: #ffffff;
        }   
        .popInner{        
            width:467px;
            height:187px;
            background: rgba(216, 216, 216, 0.08);
            border-radius: 10px;
            overflow: hidden;          
             
            ul{
                width: 60%;
                margin-left: 20%;
                overflow: hidden;
                margin-top:36px;
                li:hover{
                    opacity: 1;
                    transition: all 0.2s;
                }
                li{
                    width: 50%;
                    float: left;
                    overflow: hidden;
                    opacity: 0.8;
                    transition: all 0.2s;
                    cursor: pointer;
                    img{
                        width: 50%;
                        display: block;
                        margin: 0 auto;
                    }
                    span{
                        text-align: center;
                        display: block;
                        font-size: 18px;
                        color: #06CA96;
                        margin-top: 20px;
                    }
                }
            }
        }
    }
    
}
    
</style>


