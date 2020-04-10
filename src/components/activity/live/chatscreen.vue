<template>
	<div class="chatscreen" id="chatScreen">
		<header class="header clearfix">
			<div class="logo">
				<img src="../../../assets/img/screen/screen_logo.png" alt="">
			</div>
			
			<div class="operate">
				<a class="btn" href="javascript:;" v-if="!fullScreen" @click="requestFullScreen">
					<img src="../../../assets/img/screen/icon-full-ora.png" alt="">
					全屏显示
				</a>
				<a class="btn" href="javascript:;" v-else @click="cfScreen">
					<img src="../../../assets/img/screen/icon-full-ora.png" alt="">
					退出全屏
				</a>
			</div>

		</header>
		<section class="chat-cont" id="chatContBox">
			<span class="few-tip" v-if="totalNum > 0">{{totalNum}}条消息</span>
			<ul class="clearfix chat-items" id="chatCont">
				<li class="chat-item clearfix" v-for="(item,index) in chatArray" :key="index">
					<div class="chat-head">
						<img v-if="!!item.avatar" :src="item.avatar" />
						<!-- <div class="topimg" :style="{}" v-else>{{defaultimg}}</div> -->
						<div class="topimg num0"  v-else-if="index%4==0" >{{item.name | namefilter}}</div>
						<div class="topimg num1"  v-else-if="index%4==1" >{{item.name | namefilter}}</div>
						<div class="topimg num2"  v-else-if="index%4==2" >{{item.name | namefilter}}</div>
						<div class="topimg num3"  v-else-if="index%4==3" >{{item.name | namefilter}}</div>						 -->
						 <!-- <img v-else src="../../../assets/img/activity/example2.png" alt=""> -->
					</div>
					<div class="media">
						<p class="name"><span v-if="item.role == 'Broadcaster' || item.role == 'Assistant'">{{item.role | typename}}-</span>{{item.name}}</p>
						<p class="time">{{item.time}}</p>
						<div class="msg">
							{{item.content}}
						</div>
					</div>
				</li>
				
			</ul>
		</section>
	</div>
</template>
<script>
	import SxbRTC from "@/sw/controllers/conclient"
    import swConfig from "@/sw/config"
    import model from '@/model/live/live'

	export default {
		data () {
			return {
				fullScreen: false,
				
				totalNum: 0,	// 总条数

				liveController: null,  // 直播初始化对象
				liveAuthInfo: null,     // 直播权限信息
				chatArray: [],		// 聊天信息
				defaultcolor:["#ABAEEB","#D3A679","#EB9AC4","#5192DE"],
				defaultnum:0,
				
			}
		},
		computed: {
			courseId() {
				return this.$route.query.courseId;
			},
			clazzId() {
				return this.$route.query.clazzId;
			}
			
		},
		filters: {
			typename (type) {
				let res = "";
				switch(type) {
					case "Broadcaster":
						res = '主播';
						break;
					case "Assistant":
						res = '助教';
						break;
					case "Attendee":
						res = '';
						break;
					case "Audience":
						res = '';
						break;
					case "Admin":
						res = '';
						break;
				}

				return res;
			},
			namefilter(val){
				if(val){
					return val.substr(0,1)
				}
			}
		},
		created() {
			// 初始化直播
	        this.liveController = new SxbRTC();
	        //获取授权token
            this.channelTokenAuth();
            // 接收频道消息
            this.receiveMsg();
		},
		mounted() {
			//监听窗口变化
	        window.addEventListener('resize',()=> {
	            this.winHeight();
	        })
	        this.winHeight();

	        
		},
		updated () {
			this.scrollend();
			this.countAll();
			
		},
		methods: {
			// 获取频道token
			channelTokenAuth() {
				let data = {
					courseId: this.courseId
				}
				model.liveRoomAuth(data, (res => {
					console.log("channelTokenAuth",res);
					this.liveAuthInfo = res.data
                    swConfig.channelName = this.liveAuthInfo.roomCode;
                    swConfig.signalToken = this.liveAuthInfo.authInfo.signalToken;
                    var timeStamp = new Date().getTime();
                    //登录信令
                    this.liveController.login(
                        {
                            channelName:this.liveAuthInfo.authInfo.roomCode,
                            appId:this.liveAuthInfo.authInfo.appId,
                            account:timeStamp,
                            signalToken:swConfig.signalToken,
                            callback:function(){
                            	console.log("加入频道成功后执行");
                            }
                        }
                    );

				}))
			},
			

			// 接收频道消息
			receiveMsg() {
				console.log("receiveMsg", '接收内容');
				this.chatArray = [];
      			console.log(this.liveController.receiveChannelMsgChat);
				this.liveController.receiveChannelMsgChat((account, uid, msg) => {
					console.log("接收消息====", account, uid, msg);
					console.log("receiveMsg", account, uid, msg);
					if(JSON.parse(msg).command == 'CHAT' && JSON.parse(msg).chatMessage.chatMessageType == 'CHAT') {
						let name = account.split("_")[0];
						let message = JSON.parse(msg);

						console.log("message==111===", message);
						this.chatArray.push({
							name: name, 
							contentType: message.chatMessage.contentType, 
							content: message.chatMessage.content,
							role: message.fromRole,
							time: message.chatMessage.time,
							avatar: message.chatMessage.avatar
						});

					}
					console.log("chatArray==111===", this.chatArray);
		
					
				})
			},

			// 消息总数
			countAll() {
				this.totalNum = this.chatArray.length;
			},
			winHeight() {
				let height=parseInt($(window).height());
				$(".chatscreen").css({"height": (height)+'px'});
				$("#chatContBox").css({"height": (height-70)+'px'});
			},
			//执行滚动条滚动到底部
	        scrollend(){
	            var div = document.getElementById('chatContBox');
	            $('#chatContBox').animate({ scrollTop: div.scrollHeight}, 800);
	        },
	        //全屏
	        requestFullScreen(){
	            var element = document.getElementById("app");
	            this.fullScreen = true;
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
	            this.fullScreen = false;
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
	            }
	        },
		},

		destroyed(){
            this.liveController.leavelChannel();
        },
	}
</script>
<style scoped lang="less">
	.chatscreen {
		width:100%;
        height: 100%;
        background:url('../../../assets/img/homework/homework2.png') center top no-repeat;
        background-size: cover;
	}
	.header {
		// position: fixed;
	    // top: 0;
	    // z-index: 99;
		box-sizing: border-box;
		width: 100%;
		height: 70px; 
		background:rgba(253, 126, 35, 0.28);
		border-bottom: 2px solid #FD7E23;

		padding: 16px 86px 0 86px;

		.logo {
			display: inline-block;
			width: 110px;
			height: auto;
			>img {
				width: 100%;
				height: auto;
			}
		}
		.operate {
			float: right;
			>.btn {
				font-size: 18px;
				color: #FD7E23;
				line-height: 2em;
				>img {
					width: 21px;
					height: 21px;
					display: inline-block;
					vertical-align: text-bottom;
				}
			}
		}
	}
	.chat-cont {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		// background: #F2F4F8;
		padding:48px 86px;
		overflow-x: hidden;
    	overflow-y: scroll;
		// height: 100%;
		// margin-top: 70px;
		.chat-items {
			width: 100%;
			height: 100%;
		}
		.few-tip {
			position: fixed;
		    z-index: 99;
		    right: 20px;
			top: 110px;
			background: #45B0E9;
			border-radius: 20px;
			font-size: 18px;
			color: #FFFFFF;
			padding: 6px 12px;
			line-height: 1em;
		}
	}
	.chat-item {
		width: 100%;
		margin-bottom: 25px;
	}
	.chat-head {
		float: left;
		width: 64px;
		height: 64px;
		border-radius: 64px;
		margin-right: 18px;
		>img {
			width: 64px;
			height: 64px;
			border-radius: 64px;
		}
		.topimg{
			width: 64px;
			height: 64px;
			border-radius: 64px;
			font-size: 34px;
			color: #FFFFFF;
			font-family: PingFangSC-Medium;
			text-align: center;
			line-height: 64px;
		}
		.num0{
			background-color: #ABAEEB
		}
		.num1{
			background-color: #D3A679
		}
		.num2{
			background-color: #EB9AC4
		}
		.num3{
			background-color: #5192DE
		}
	}
	.media {
		width: calc(~"100% - 64px - 18px");
		float: left;

		
		.name {
			font-size: 22px;
			color: #ffffff;
			line-height: 1em;
			margin-bottom: 10px;
		}
		.time {
			font-size: 22px;
			color: #CCCCCC;
			line-height: 1em;
			margin-bottom: 14px;
		}
		.msg {
			position: relative;
			z-index: 1;
			width: 95%;
			min-height: 61px;
			box-sizing: border-box;
			background: rgba(255, 255, 255,0.19);
			// border: 1px solid #B5B5B6;
			border-radius: 8px 8px 8px 8px;
			padding: 10px 30px;

			font-size: 26px;
			color: #ffffff;
			line-height: 1.5em;

			&:after {
				width: 0;
				height: 0;
				border-top: 8px solid transparent;
				border-bottom: 8px solid transparent;
				border-right: 10px solid rgba(255,255,255,0.19);
				content: "";
				position: absolute;
				z-index: 3;
				top: 14px;
				left: -10px;
				// width: 15px;
				// height: 15px;
				// background-color: rgba(255, 255, 255,0.19);
				// border-left: 1px solid #B5B5B6;
				// border-top: 1px solid #B5B5B6;
				// transform: rotate(-45deg);

			}

		}
	}
</style>