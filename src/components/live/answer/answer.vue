<template>
    <div class="z-contant">
        <div class="answer_box">
            <header>
                <span>答题器</span>
                <i class="closeBtn" @click.stop="handleClose('')">&times;</i>
            </header>
            <h1 :class="{error:errorcolor}">{{tishi}}</h1>
            <div class="setanswer">
                <ul>
                    <li v-for="answer in answerArr" :key="answer" @click="setanswer(answer)" :class="{answertab:answer==isanswer}">
                        <input type="radio" :name="answer" :value="answer">
                        {{answer}}
                    </li>
                </ul>
                <div class="setanswernum">
                    <button @click="add_answer" v-if="show_add" class="button_1">
                        <i class="el-icon-circle-plus-outline"></i>
                        <span>增加选项</span>
                    </button>
                    <button @click="reduce_answer" v-if="show_reduce" class="button_2">
                        <i class="el-icon-remove-outline"></i>
                        <span>减少选项</span>
                    </button>
                </div>
            </div>
            <div class="answer_end">
                  <button @click="publish_answer('this')">发布答题</button>    
            </div>    
        </div>
        
    </div>
</template>
<script>

import {publishanswer} from '@/sw/utils/sig.js'
import live from '@/model/live/live.js'
export default {
    data(){
        return {
            checkboxGroup:'',
            answerArr: ['A', 'B', 'C', 'D'],
            isanswer:'',
            tishi:"点击选项设置正确答案",
            errorcolor:false,
            show_add:true,
            show_reduce:true,
            createanswerdata:{},
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
    methods:{
        handleClose(val){
            //关闭答题卡弹窗
            this.$emit("showanswerbox",val)
        },
        //获取选择的答案
        setanswer(msg){
            console.log(msg);
            this.isanswer=msg;
            this.errorcolor=false;
        },
        //增加选项
        add_answer(){
            let newArr=["A","B","C","D","E","F","G","H"];
            let nownum=this.answerArr[this.answerArr.length-1];
            let newnum=newArr.indexOf(nownum);
            this.answerArr.push(newArr[newnum+1]);
            if(this.answerArr.length==8){
                this.show_add=false
            }else{
                this.show_add=true;
                this.show_reduce=true;
            }
        },
        //减少选项
        reduce_answer(){
            let delanswerArr=this.answerArr[this.answerArr.length-1];
           if(this.isanswer==delanswerArr){
               this.isanswer=''
           }           
            this.answerArr.splice(this.answerArr.length-1,1);
            if(this.answerArr.length==2){
                this.show_reduce=false;
            }else{
                this.show_add=true;
                this.show_reduce=true;
            }
           
        },
        //发布答题
        publish_answer(val){
            //判断当前是否选择了正确答案
            if(this.isanswer){                               
                this.postanswer(val)
            }else{
                this.errorcolor=true;
            }
        },

        //向后端发送接口开启答题器
        postanswer(val){
             //对应上答题器题目
            let questionArr=[];
            for (let i = 0; i < this.answerArr.length; i++) {
                questionArr.push({"question":this.answerArr[i]})
                
            };
            let data={
                "anser": this.isanswer,
                "courseId": this.courseId,
                "clazzId":this.clazzId,
                "questionAndAnswerUsers":questionArr,
            };
            live.livepublishanswer(data,(res=>{
                if(res.status==200){
                    this.createanswerdata=res.data;                
                    this.publishanswerto(val);

                }else{
                    alert("当前已经存在了一个答题器，请先关闭后再创建")
                }
            }))
        },
        //发布答题器
        publishanswerto(val){           
           //发送答题频道信息
            this.getpassdata();
           let AuthInfo=this.$store.getters.getliveAuthInfo;
           if(AuthInfo.authInfo.role=="Broadcaster" || AuthInfo.authInfo.role=="Assistant"){
                this.controller.sendChannelMsg(publishanswer("PUBLISH_TASK","ANSWER",this.createanswerdata.id,this.createanswerdata.questionAndAnswerUsers,this.createanswerdata.anser,'')); 
           }
          
        },
        //获取发送的数据
        getpassdata(){
            let _this=this;
             _this.controller.receiveChannelDtMsg2(function(account,uid,msg){                                       
                    let data=JSON.parse(msg);
                    let AuthInfo=_this.$store.getters.getliveAuthInfo;
                     console.log("我是接收到的答题卡数据2",data)
                     console.log("我是接收到的答题卡数据2", AuthInfo.authInfo.role)
                    //只有当前角色是助教或者是主播时开启答题器
                    if(AuthInfo.authInfo.role=="Broadcaster" || AuthInfo.authInfo.role=="Assistant"){
                        if(data.command=="PUBLISH_TASK" && data.ext.type=="ANSWER"){
                            //存储频道消息至vuex中，方便下个组建调用和更新数据
                            _this.$store.state.answerdata=data;
                            console.log("我是从vuex中获取的答题卡数据2",_this.$store.getters.getanswer)
                             _this.$emit("showanswerbox",'this') 
                        }                        
                    };
                                                                              
                })  
        },
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
        .error{
            color: #f00;
        }
        h1{
            font-size: 14px;
            color: #B8E986;
            text-align: center;
            margin-top: 50px;
        }
        .setanswer{
            width: 452px;
            overflow: hidden;
            margin-left: 61px;            
            ul{
                width:495px;
                overflow: hidden;
                .answertab{
                    background-color: rgba(98,221,117,0.67);
                     border: 1px solid rgba(98,221,117,0.67);
                }
                li{
                    width: 80px;
                    height: 80px;
                    float: left;
                    border: 1px solid #818181;
                    border-radius: 80px;
                    margin-right: 43px;
                    margin-top: 16px;
                    cursor: pointer;
                    input{
                        display: none
                    }
                    font-size: 40px;
                    color: #FFFFFF;
                    text-align: center;
                    line-height: 80px;
                }
            }
        }
        .setanswernum{
            width: 370px;
            height: 34px;
            margin-top: 40px;
            margin-left:42px;
            position: relative;
            .button_1{
                position: absolute;
                top: 0;
                left:41px;
                width: 123px;
                height: 34px;
                background: rgba(10,10,11,0.97);
                border-radius: 22px;
                i{
                    color: #CCCCCC;
                    font-size: 16px;
                }
                span{
                    font-size: 15px;
                    color: #CCCCCC;
                }
            }
            .button_2{
                position: absolute;
                top: 0;
                left: 204px;
                width: 123px;
                height: 34px;
                background: rgba(10,10,11,0.97);
                border-radius: 22px;
                i{
                    color: #CCCCCC;
                    font-size: 16px;
                }
                span{
                    font-size: 15px;
                    color: #CCCCCC;
                }
            }
        }
        .answer_end{
            width: 100%;
            overflow: hidden;
            background: rgba(255,255,255,0.03);
            margin-top: 40px;

            button{
                width: 120px;
                height: 34px;
                background-image: linear-gradient(90deg, #248D53 0%, #51ECCE 100%);
                border-radius: 22px;
                font-size: 16px;
                color: #FFFFFF;
                display: block;           
                margin: 20px auto;
            }
        }  
    }
}
</style>

