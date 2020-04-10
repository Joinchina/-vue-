<template>
    <div class="z-contant">
        <div class="answer_box">
            <header>
                <span>答题器</span>
                <!-- <i class="closeBtn" @click.stop="handleClose(false)">&times;</i> -->
            </header>
            <div class="answerinfo">
                <span class="span_1">答题人数：{{answerenddata.ext.allpeople}}</span>
                <span class="span_2">正确率：{{answerenddata.ext.correct}}</span>
                <span class="span_3">用时：{{useendtime}}</span>
            </div>
            <div class="progress_box">
                <ul>
                    <li v-for="(questions,index) in answerenddata.ext.options" :key="index">
                        <img src="../../../assets/images/liveIcon/duihao.png" alt="" :style="{opacity:questions.question==answerenddata.ext.result?1:0}">
                        <h1>{{questions.question}}</h1>
                        <div class="progress">
                            <span :style="{width:progress[index],background:color[index]}"></span>                                                        
                            <h2 :style="{color:color[index]}">{{questions.people}}</h2> 
                        </div>
                                               
                    </li>
                </ul>
                                
            </div>
            <div class="answer_end">                 
                  <button @click="closeanswer" class="btn_2">关闭</button>    
            </div>    
        </div>
    </div>
</template>
<script>
import {publishanswer,passendanswerdata} from '@/sw/utils/sig.js'
import live from '@/model/live/live.js'
export default {
    data(){
        return{
            allpeople:0,
            allquestion:[],
            progress:[],
            color:["#009791","#4A90E2","#7D70CD","#CF788D","#009791","#4A90E2","#7D70CD","#CF788D"],
            apeople:[0,0,0,0,0,0,0,0],
            rightanswer:"",
            getanswerdata:{},
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
    props:["controller","answerenddata","useendtime"],
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
    },
    mounted(){
        this.detescreen()
    },
    methods:{
        //关闭弹窗
        handleClose(){
            this.$emit("showanswerisend",false);
          
        },
        //关闭答题
        closeanswer(){
            let data={
                id:this.getanswerdata.ext.questionId
            };
            live.livecloseanswer(data,(res=>{
                if(res.status==200){
                    this.controller.sendChannelMsg(publishanswer("PUBLISH_CLOSE","ANSWER",this.getanswerdata.ext.questionId,'','',''));
                    this.handleClose();
                }
            }))            
        },
        //操作答题器数据
        handleanswerdata(){
            this.rightanswer=this.answerenddata.ext.result;//正确答案
            this.allquestion=this.answerenddata.ext.options;//答题的总人数
            //计算进度条的宽度
            let options=this.answerenddata.ext.options;
            for (let i = 0; i < options.length; i++) {
                let lv=(options[i].people/this.answerenddata.ext.allpeople)*350+"px"
                this.progress.push(lv)                
            }
        },
        //检测屏幕高度，在小于960的屏幕下将弹窗高度上移至5vh，保证不会被压到下面的按钮
        detescreen(){
            let screenheight=$(window).height();            
            if(screenheight<=768 && this.allquestion.length>6){
                $(".answer_box").css({"top":"5vh"})
            }
        },
    },
}
</script>

<style lang="less" scoped>
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
                margin-left: 117px;
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
            .btn_2{
                width: 120px;
                height: 34px;
                background: #000000;
                border-radius: 18px;
                border-radius: 22px;
                font-size: 16px;
                color: #FFFFFF;        
                margin: 20px auto;
                display: block;
            }
        }  
    }
}
</style>

