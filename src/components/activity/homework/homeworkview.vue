<template>
    <div class="z-content">
        <div class="heard">
            <div class="logoxx">
                <img src="../../../assets/img/screen/screen_logo.png" alt="">
            </div>
            <div class="bigbtn">
                <div class="allscreen" v-if="allscreen" @click="requestFullScreen">
                    <img src="../../../assets/img/homework/homework8.png" alt="" >
                    <span>全屏</span>
                </div>
                <div class="allscreen" v-else @click="cfScreen">
                    <img src="../../../assets/img/homework/homework8.png" alt="" >
                    <span>退出全屏</span>
                </div>
            </div>
        </div>
        <section>
                <div class="allcontent">
                <h1>{{title}}</h1>
                <div class="detail_box">
                    <div class="detail_left">
                        <ul>
                            <li>
                                <h2>{{commitCount}}</h2>
                                
                            </li>
                            <li>
                                <h5>已提交人数</h5>
                                <h3>
                                    <router-link :to="{ path:'/activity/homework/homeworkdetail', query: { activityId:activityId, excellent:false}}">查看详情</router-link>                                    
                                </h3>
                                                    
                            </li>
                            <li>
                                <h4>优秀作业：{{excellentCount}}份<router-link :to="{ path:'/activity/homework/homeworkdetail', query: { activityId: activityId, excellent:true}}">查看详情</router-link></h4>
                                
                            </li>
                        </ul>
                    </div>
                    <div class="detail_right" id="testDiv">
                        <ul v-if="this.items.length==0" class="nodata">
                            <img src="../../../assets/img/homework/nostucommit.png" alt="">
                        </ul>
                        <ul v-else>
                            <router-link tag="li" v-for="(item,index) in items" :key="index" :to="{ path:'/activity/homework/homeworkdetail', query: { activityId:activityId, id:item.homeWorkId,excellent:false}}">
                                <div class="imgbox">
                                    <img :src="item.avatar" alt="" v-if="item.avatar">
                                    <img src="../../../assets/img/screen/homework.png" alt="" v-else>
                                    <h1 v-show="!item.avatar">{{item.name | namefilter}}</h1>
                                </div>
                                <h2>{{item.name}}</h2> 
                            </router-link>                
                        </ul>
                    </div>
                </div>
            </div>         
        </section>
    </div>
</template>
<script>
import work from 'model/activity/homework'
export default {
    data () {
        return {
           items:[],
           allscreen:true,
           commitCount:'',
           excellentCount:'',
           title:'',
           paperKey: "",
           webSocketUrl:"",           
        }
    },
    computed: {
        activityId(){
            return this.$route.query.activityId
        },
    },
    filters: {
        namefilter:function(val) {
            return val.substr(val.length-1,1)
        }
    },
    mounted () {
        //监听窗口变化
        window.addEventListener('resize',()=> {
            this.getwindiwheight();
        })
        //获取屏幕高
        this.getwindiwheight();
        this.getallwork();
        

    },
    updated () {
        this.licenter();            
        this.scrollend();
    },
    methods: {             
        getwindiwheight(){
            //设置大屏幕的高度及头部导航的高度
            let height=parseInt($(window).height()); //屏幕的高度
            $(".z-content").css('height',height+'px');//当前可视区的高
            let header=parseInt(height/10);
            $(".heard").css('height',header+'px');//头部的高
            //设置routerview的高度
            let heightTOP=parseInt($(".heard").outerHeight())
            $("section").css("height",(height-heightTOP)+"px");           
            let contentTop=parseInt($(".allcontent").css("marginTop"));
            let allheight=parseInt((((height-heightTOP)-contentTop*2)));
            $(".allcontent").css("height",allheight+"px");
            //设置详情detail的高
            let titleheight=parseInt($(".allcontent h1").outerHeight());
            $(".detail_box").css("height",(allheight-titleheight-70)+"px");
            this.licenter();           
        },
        
        licenter(){
            //获得每一个dl的宽度和高度设置图片大小和距离
            let liwidth=parseInt($(".detail_right ul li").width());
            let liheight=parseInt($(".detail_right ul li").height());
            let imgwidth=parseInt((liwidth-100)); //获得img图片的宽度即高度即div的宽高
            $(".detail_right ul li .imgbox").css({"width":imgwidth+"px","height":imgwidth+"px"});
            $(".detail_right ul li .imgbox img").css({"width":imgwidth+"px","height":imgwidth+"px","border-radius":imgwidth+"px"})
        },
        //执行滚动条滚动到底部
        scrollend(){
            var div = document.getElementById('testDiv');
            $('#testDiv').animate({scrollTop:div.scrollHeight}, 800);
        },
        //全屏
        requestFullScreen(){
            var element = document.getElementById("app");
            this.allscreen = false;
                var requestMethod = element.requestFullScreen || //W3C
                                element.webkitRequestFullScreen || //Chrome等
                                element.mozRequestFullScreen || //火狐
                                element.msRequestFullScreen;  //ie11
    
                if (requestMethod) {    
                    requestMethod.call(element);                      
                } else if (typeof window.ActiveXObject !== "undefined") {    
                    var wscript = new ActiveXObject("WScript.Shell");  
                    if (wscript !== null) {  
                        wscript.SendKeys("{F11}");  
                    }                       
                }  

        },
        //退出全屏
        cfScreen(){
            this.allscreen = true;
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }else {
                //window.parent.showTopBottom();
                // isflsgrn = false;
                // $("#fsbutton").text("全屏");
            }
        },
        //作业接口
        getallwork(){
            let data={
                activityId:this.activityId ,
            };
            work.getWorkscreen(data,(res=>{
                if(res.status==200){
                    console.log(res.data);
                    this.title=res.data.title;
                    this.commitCount=res.data.commitCount;
                    this.excellentCount=res.data.excellentCount;
                    this.items=res.data.users;                   
                    if (window.location.host.indexOf("shixunbao.cn") > -1) {
                        this.webSocketUrl = "mgr.shixunbao.cn/homework/websocket"
                    }else{
                        this.webSocketUrl="10.98.24.67/homework/websocket"
                    }
                   
                    this.getWebSocket();
                    
                }
            }))
        },
        getWebSocket() {				
				let _this = this;
                let websocket = null;
                this.paperKey=this.$route.query.paperKey;
				_this.paperKey = this.paperKey;
				// console.log("paperKey ",_this.paperKey);
				if(!_this.webSocketUrl) {
					alert("当前页面链接失败，请刷新重试");
					return;
				}				
				if('WebSocket' in window){
			        websocket = new WebSocket("wss://"+_this.webSocketUrl+"");
			    }else{
			        alert('请选择使用谷歌浏览器、火狐浏览器、IE10及以上浏览器')
			    }				
				// 链接错误
				websocket.onerror = function(){
					alert("服务器链接错误，请刷新页面重新链接");
					websocket.send('#ERROR#' + _this.paperKey);
				};				
				//连接成功建立的回调方法
			    websocket.onopen = function(event){
			    				    	
					websocket.send('#OPEN#' + _this.paperKey);
					setInterval(function(){
						websocket.send('#heartbeat#' + _this.paperKey);
                    },1000*3*10);
                    console.log("链接成功");
			    };				
			    //接收到消息的回调方法
			    websocket.onmessage = function(event){			    	
			    	var newData = JSON.parse(event.data);
			    	console.log("websocket",event);
			    	_this.updataVal(newData);			    	
			    }			    
			    //连接关闭的回调方法
			    websocket.onclose = function(){
					websocket.send('#CLOSE#' + _this.paperKey);
			    }
			    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
			    window.onbeforeunload = function(){
			        websocket.close();
			    }			    
        },
        updataVal(val){
            // console.log(val)
            this.items.push(val);
            this.getallwork()
        },
        onehomework(item){
            this.$router.push({
                path:"activity/homework/homeworkdetail",
                query:{
                    activityId:this.activityId,
                    id:item.id,
                }               
            })
        },
        
    },
    components: {
        
    },
    destroyed () {
         window.removeEventListener("resize",()=>{
              this.getwindiwheight();
         });
    }
}
</script>
<style lang="less" scoped>
    .z-content{
        width:100%;
        height: 100%;
        background:url('../../../assets/img/homework/homework2.png') center top no-repeat;
        background-size: cover;
        .heard{
            width: 100%;
            overflow: hidden;
            background:rgba(253, 126, 35, 0.28);
            border-bottom: 2px solid rgba(253, 126, 35, 1);
            position: relative;
            .logoxx{
                width: 10%;
                float: left;
                position: absolute;
                top: 50%;
                left: 10%;
                transform: translate(0, -50%);
                img{
                    max-width: 100%;
                }
            }
            .bigbtn{
                width: 8.5%;
                float: right; 
                position: absolute;
                top: 50%;
                right:8%;
                transform: translate(0%, -50%);
                .allscreen{
                    width: 100%;
                    overflow: hidden;
                    cursor: pointer;
                    img{
                        max-height: 100%;
                    }
                    span{
                        font-size: 18px;
                        color: #FFFFFF;
                        line-height: 42px;
                    }
                }
                
            }
        }
        section{
            width: 100%;
            overflow: hidden;
            .allcontent{
                width:98%;
                margin-left: 1%;
                margin-top: 1%;
                background: rgba(23,51,85,0.39);
                border-radius: 18px;
                h1{
                    font-family: PingFangSC-Medium;
                    text-align: center;
                    font-size: 38px;
                    color: #FFFFFF;
                    letter-spacing: -0.02px;
                    padding-top: 34px;
                }
                .detail_box{
                    width: 100%;
                    display: block;
                    margin-top:70px;
                    .detail_left{
                        width: 40%;
                        float: left;
                        height: 100%;
                        ul{
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                            li{
                                width: 100%;
                                height: 33.33%;
                                position: relative;
                                overflow: hidden;
                                h5{
                                    font-family: PingFangSC-Medium;
                                    text-align: center;
                                    font-size: 24px;
                                    color: #FFFFFF;
                                    letter-spacing: -0.04px;
                                    text-align: center;
                                }
                                h2{
                                    font-family: PingFangSC-Medium;
                                    position: absolute;
                                    font-size: 104px;
                                    color: #FFA5D3;
                                    letter-spacing: -0.04px;
                                    text-align: center;
                                    font-weight: 600;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%,-50%);
                                }
                                h3{
                                    font-family: PingFangSC-Medium;
                                    font-size: 36px;
                                    color: #FFFFFF;
                                    letter-spacing: -0.01px;
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%,-50%);
                                    a{
                                        text-align: center;
                                        width: 144px;
                                        height: 46px;
                                        display: block;
                                        background: #284278;
                                        border: 1px solid #081D49;
                                        border-radius: 29px;
                                        font-size: 28px;
                                        color: #FFFFFF;
                                        margin: 0 auto;
                                        margin-top: 33px;
                                    }
                                }
                                
                                h4{
                                    font-family: PingFangSC-Regular;
                                    font-size: 24px;
                                    color: #FFFFFF;
                                    letter-spacing: -0.01px;
                                    width: 290px;
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%,-50%);
                                    a{
                                        opacity: 0.57;
                                        font-family: PingFangSC-Regular;
                                        font-size: 24px;
                                        color: #A9CFFF;
                                        letter-spacing: -0.01px;
                                        margin-left: 20px;                               
                                    }
                                }                        
                            }
                        }
                    }
                    /* for Chrome */
                    .detail_right::-webkit-scrollbar {
                        display: none;
                    }
                    .detail_right{
                        width: 60%;
                        float: left;
                        height: 100%;
                        overflow-x: hidden;
                        overflow-y: scroll;
                        
                        .nodata{
                            position: relative;
                            img{
                                width: 140px;
                                display: block;
                                position: absolute;
                                top: 32%;
                                left: 50%;
                                transform: translate(-50%,-50%); 
                            }
                            
                        }
                        ul{
                            width: 100%;
                            height: 100%;
                           
                            li{
                                width:20%;
                                height: 33.33%;
                                float: left;
                                position: relative;
                                cursor: pointer;                               
                                @keyframes myfirst{
                                    from {
                                        transform: rotateY(0deg);
                                        -webkit-transform: rotateY(0deg);
                                        -moz-transform: rotateY(0deg);
                                        -o-transform: rotateY(0deg);
                                        -ms-transform: rotateY(0deg); 
                                    }
                                    to {
                                        transform: rotateY(360deg);
                                        -webkit-transform: rotateY(360deg);
                                        -moz-transform: rotateY(360deg);
                                        -o-transform: rotateY(360deg);
                                        -ms-transform: rotateY(360deg);
                                    }
                                }                                   
                                .imgbox{
                                    width: 100%;
                                    border-radius: 100%;
                                    overflow: hidden;
                                    position: relative;
                                    margin: 20px 50px 0 50px;
                                    animation:myfirst 1s;
                                                                                      
                                    img{
                                    display: block;                                
                                    }
                                    h1{
                                        position: absolute;
                                        top: 50%;
                                        left: 50%;
                                        transform: translate(-50%,-50%);
                                        font-size: 60px;
                                        color: #FFFFFF;
                                        padding-top: 0;
                                    }
                                }
                                h2{
                                    font-size: 22px;
                                    color: #FFFFFF;
                                    text-align: center;
                                    margin-top: 14px;
                                }
                            }
                        }
                    }
                }
            }           
        }       
    }
</style>

