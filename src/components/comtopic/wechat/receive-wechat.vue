<template>
	<div>
		
		<el-dialog class="dialog-form dialog-form-wechat"
			:visible.sync = "dialogReceiveWechat"
			:close-on-click-modal="false"
			:before-close="close"
            @open="open">

             <div slot="title" class="title">
             	<h3>微信接收数据</h3>
             	(选择微信接收数据后，将会每周一定时发送数据，推送到您的微信上~)
             </div>

            <!--手机扫码_start-->
            <div v-show="!sanFlag" v-loading="loading"
        :element-loading-text='this.$globalParam.loadText'
        :element-loading-spinner='this.$globalParam.loadSpinner'
        :element-loading-background='this.$globalParam.loadBg'>
	            <section  class="discentet">
	            	<div class="img-i">
	            		<span>
	            			<img v-if="qrcodeSrc != ''" :src="qrcodeSrc">
	            		</span>
	            	</div>
	            </section>

		        <p class="p-width">
		            请使用微信扫描二维码绑定机构数<br/>
		            据，并在手机上点击关注公众号
		        </p>
	           
       	 	</div>
       	 	<!--手机扫码_end-->

       	 	<!--授权成功_start-->
       	 	<div class = "scan" v-show="sanFlag">
       	 		<section class="discentet">
       	 			<div class="img-i img-i-s">
       	 				<img src="../../../assets/img/wechat/success.png">
       	 			</div>
       	 		</section>

       	 		<div class="box">
       	 			<p>授权成功</p>
       	 			<p>已绑定该机构数据</p>
       	 		</div>
       	 		

       	 	</div>
       	 	<!--授权成功_end-->

       	 	<!--扫描成功_start-->
       	 	<!-- <div class="sm">

       	 			<span class="sm-left">
       	 				<img src="../../../assets/img/wechat/scan-sucess.png">
       	 			</span>

       	 			<span class="sm-rg">
       	 				扫描成功！<br/>
       	 				请在手机上进行授权 
       	 			</span>
       	 	</div> -->
       	 	<!--扫描成功_end-->

       	 	 <div slot="footer" class="dialog-footer">
	            	<el-button type="primary" @click="close()">关闭</el-button>
	         </div>
        </el-dialog>
	</div>
</template>
<script type="text/javascript">
	import Model from '@/model/wechat/wechat';
	import storage from '@/global/storage';
	import Api from '@/global/resource';

	export default{

		props:["dialogReceiveWechat"],


		created(){
			
		},

		data(){
			return{
				loading:false,

				qrcodeSrc:"",

				webSocketUrl:"",

				userIdKey:"",

				sanFlag:false,

				clearInterval:""
			}
		},
		methods:{

			open(){

				this.loading = true;
				this.qrCodeGet();
				this.initWebsocket();

				//清除信息
			    this.sanFlag = false;
			    this.qrcodeSrc = false;
			},

			initWebsocket(){

				let websocket = null;
				let _this = this;

				//userID key
				let userId = storage.get("exp_userId");
			    _this.userIdKey = userId;



			    _this.webSocketUrl = Api.urls.wechatWebsocket;

				if('WebSocket' in window){
				    websocket = new WebSocket("wss://"+_this.webSocketUrl+"");
				}else{
				    alert('请选择使用谷歌浏览器、火狐浏览器、IE10及以上浏览器')
				}

				// signKey
			    //连接发生错误的回调方法
			    websocket.onerror = function(){
			    	alert("服务器连接错误，请刷新页面重新连接");

					websocket.send('#ERROR#' + _this.userIdKey);
			    };

			    //连接成功建立的回调方法
			    websocket.onopen = function(event){
			    	

			    	console.log("链接成功");
			    	this.loading = false;

			    	websocket.send('#OPEN#' + _this.userIdKey);

			    	clearInterval(_this.clearInterval);

					_this.clearInterval = setInterval(function(){
						websocket.send('#heartbeat#' + _this.userIdKey);
					},1000*3*10);

					

			    },

			     //接收到消息的回调方法
			    websocket.onmessage = function(event){
			    	
			    	console.log("关注成功");
			    	console.log(event);

			    	_this.sanFlag = true;

			    	setTimeout(function(){
			    		_this.close();

			    	},3000)
			    	//var newData = JSON.parse(event.data);
			    	//console.log("websocket",event);

			    }

			     //连接关闭的回调方法
			    websocket.onclose = function(){
					//websocket.send('#CLOSE#' + _this.userIdKey);
			    }
			    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
			    window.onbeforeunload = function(){
			        websocket.close();
			    }

			},

			close(){
				this.$emit('update:dialogReceiveWechat', false);
			},

			qrCodeGet(){
				let data = {

				}
				Model.wechatQrcode(data,(res=>{
					if(res.status == 200){

						this.loading = false;
						console.log(res);
						if(res.data != ''){

							this.qrcodeSrc = res.data;
						}
						
					}else{

						this.loading = false;
						
						this.$message.error(res.message);
					}
					
				}))
			}
		},

	}
</script>

<style scoped lang="less">
	@import "../../../assets/reset-element-ui/form.css";
	.discentet{
		display: table;
		width: 100%;
		.img-i{
			vertical-align: middle;
			display: table-cell;
			text-align: center;
			span{
				display: inline-block;
				padding: 18px;
				background-image: linear-gradient(-180deg, #AFE8C7 0%, #68CBD0 97%);
				border-radius: 11px;
				width: 299px;
				height: 299px;
			}
			img{
				width: 263px;
				height: 263px;
			}
		}
		.img-i-s{
			img{
				width: 177px;
				height: 157px;
			}
		}
	}
	.p-width{
		margin:30px auto;
		line-height: 30px;
		text-align: center;
		font-size: 16px;
		color: #333;
	}

	.scan{
		padding-top: 3%;
		text-align: center;
		.box{
			padding-top: 25px;
			padding-bottom: 20px;
			p{
				line-height: 28px;
				color: #333;
				font-size: 16px;
			}
		}
		
	}

	.sm{
		width: 245px;
		margin:0 auto;
		padding-top: 100px;
		padding-bottom: 150px;
		line-height: 30px;
		font-size: 16px;
		color: #333;
		.sm-left{
			float: left;
		}
		.sm-rg{
			float: left;
			margin-left: 30px;
			text-align: left;
		}
		.text{
			padding-left: 30px;
			padding-top: 30px;
		}
	}
	.title{
		padding-bottom: 32px;
		h3{
			font-weight: 400;
			color: #333;
			font-size: 22px;
			margin-bottom: 14px;
		}
	}
</style>