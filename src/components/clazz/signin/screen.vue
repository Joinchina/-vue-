<style scoped="" lang="less">
	/*滚动条*/
	::-webkit-scrollbar {
	    width: 10px;
	    height: 10px;
    /*background-color: #ddd;*/
	}


	/*滑块*/
	::-webkit-scrollbar-thumb {
	    // background-color: #ccc;
	    opacity: 0;
	    border-radius: 10px;
	}

	::-webkit-scrollbar-thumb:hover {
	    background-color: rgba(119,119,119,.1);
	    border-radius: 10px;
	}


	/*滑道*/
	// ::-webkit-scrollbar-track {
	//     box-shadow:#ccc;
	//     opacity: 0;
	//     border-radius: 10px;
	// }

	#apps{
		font-family:"Microsoft YaHei";
		transition:background .8s ease-out;
 		-moz-transition: background .8s ease-out; /* Firefox 4 */
 		-webkit-transition: background .8s ease-out; /* Safari and Chrome */
		-o-transition: background .8s ease-out; /* Opera */
		overflow-x:hidden;
	}
	.blue{
		background:#A4CEEE;
		/*background-image: linear-gradient(-1deg, rgba(209,237,255,1) 0%, rgba(164,206,238,1) 100%);*/
		
	}
	.pink{
		/*background-image: linear-gradient(0deg, #F8E5D0 0%, #F0D4B9 100%);*/
		background: pink;
	}
	.yellow{
		/*background-image: linear-gradient(0deg, #F8E5D0 0%, #F0D4B9 100%);*/
		background: yellow;
	}
	.screen{ 
		height: 100%;
		width: 100%;
		color: #333;
	}
	.screen .header{
		background: rgba(255,255,255,.6);
		height: 9%;
		vertical-align: middle;
		width: 100%;
		
	}
	.screen .header .h_con{
		width: 75%;
		margin: 0 auto;
		height: 100%;
		display: table;
	}

	.screen .header .h_con .logo{
		float: left;
		width: 10%;
	}


	.screen .header .h_con #imgbox{
		display: table-cell;
		vertical-align: middle;
	}

	.screen .header .h_con #imgbox img{
		width: 100%;
		height: auto;

	}
	.screen .header .h_con h2{
		float: right;
		font-weight: normal;
		text-align: right;
		padding-right: 32px;
	}
	.screen .header .h_con .full{
		vertical-align: middle;

	}
	.screen .con{
		width: 80%;
		margin: 0 auto;
	}

	.screen .con .left{
		float: left;
		width: 51%;
		padding-left:4%;
		box-sizing: border-box;
		padding-top: 15px;
		overflow: hidden;
	}
	.screen .con .left li{
		float: left;
		/*width: 16%;*/
		/*width: 120px;
		height: 145px;*/
		margin-right: 9%;
		margin-bottom: 2%;
		text-align: center;
	}
	.screen .con .left li span{
		display: inline-block;
		width: 114px;
		margin-top: 1%;
		font-size: 22px;
	}
	.screen .con .left li img{
		/*width: 100%;
		height: auto;
*/
		/*width: 130px;
		height: 130px;*/
	}
	.screen .con .rg{
		float: left;
		width: 49%;
		// margin-top: 8%;
	}
	.screen .con .rg .qrcode-wap{
		border:1px solid #ddd;
		box-shadow: 10px #ccc;
		width: 85%;
		margin: 0 auto;
		border-radius:10px;
		background: #fff;
		padding: 20px;
		box-shadow:0 0 18px rgba(0,0,0,.1);

	}

	.screen .con .rg .qrcode-wap img{
		display: inline-block;
		padding: 10px;
		width: 100%;
		height: auto;
	}
	.screen .con .rg img{
		width: 100%;
		height: auto;
	}

	.screen .con .rg .footer{
		margin-top: 2%;
		text-align: center;
	}
	.screen .con .rg .org{
		color: #FD7E23;
	}
	.screen .con .rg .footer span{
		display: inline-block;
		text-align: center;
	}
	.screen .con .rg .footer .padrg{
		padding-left: 10%;
	}
	/*"#E388B5","#E388B5","#F5A623","#5192DE"*/
	.down .b-con ,.down .b-con-img{
		border-radius: 50%;
		display: inline-block;
		text-align:center;
		color: #fff!important;
		font-family: PingFangSC-Medium;
	}
	.down .b-con-img img{
		border-radius: 50%;
	}
	.down .b-red{
		background: #958FF4;
		
	}
	.down .b-pink{
		background: #E388B5;
	}
	.down .b-orange{
		background: #F5A623;
	}

	.down .b-blue{
		background: #5192DE;
	}

	


	@-webkit-keyframes pulse {
	  from {
	    -webkit-transform: scale3d(1, 1, 1);
	    transform: scale3d(1, 1, 1);
	  }

	  50% {
	    -webkit-transform: scale3d(1.05, 1.05, 1.05);
	    transform: scale3d(1.05, 1.05, 1.05);
	  }

	  to {
	    -webkit-transform: scale3d(1, 1, 1);
	    transform: scale3d(1, 1, 1);
	  }
	}

	@keyframes pulse{
	  from {
	    -webkit-transform: scale3d(1, 1, 1);
	    transform: scale3d(1, 1, 1);
	  }

	  50% {
	    -webkit-transform: scale3d(1.05, 1.05, 1.05);
	    transform: scale3d(1.05, 1.05, 1.05);
	  }

	  to {
	    -webkit-transform: scale3d(1, 1, 1);
	    transform: scale3d(1, 1, 1);
	  }
	}
	.down{
		position: relative;
	}

	.down .qrcode,.down .txt{
	    position: absolute;
	    top: 0;
	    left: 0;
	    backface-visibility: hidden;
	    -webkit-backface-visibility: hidden;
	    -moz-backface-visibility: hidden;
	    -ms-backface-visibility: hidden;
	    -o-transition: .8s ease-in-out;
	    transition: .8s ease-in-out;
	    -webkit-transition: .8s ease-in-out;
	    -moz-transition: .8s ease-in-out;
	    -ms-transition: .8s ease-in-out;
	}


	.down .txt {
	    z-index: 2;
	    transform: rotateY(0);
	    -webkit-transform: rotateY(0);
	    -moz-transform: rotateY(0);
	    -ms-transform: rotateY(0)
	}

	.down .qrcode {
	    transform: rotateY(180deg);
	    -webkit-transform: rotateY(180deg);
	    -moz-transform: rotateY(180deg);
	    -ms-transform: rotateY(180deg);
	}
	.down .qrcode-cur{
		 transform: rotateY(0);
	    -webkit-transform: rotateY(0);
	    -moz-transform: rotateY(0);
	    -ms-transform: rotateY(0);
	    z-index:3;
	    /*-webkit-animation: pulse .5s linear .7s;
        animation:  pulse .5s linear .7s;*/
	}

	.down .qrcode-cur-dh{
		transform: rotateY(0);
	    -webkit-transform: rotateY(0);
	    -moz-transform: rotateY(0);
	    -ms-transform: rotateY(0);
	    z-index:3;
	    -webkit-animation: pulse .5s linear .7s;
        animation:  pulse .5s linear .7s;
	}

	.down .txt-cur {
	    z-index: 3;
	    transform: rotateY(-180deg);
	    -webkit-transform: rotateY(-180deg);
	    -moz-transform: rotateY(-180deg);
	    -ms-transform: rotateY(-180deg);
	}

	@media screen and (max-width: 1279px){
	    .screen .header .h_con{
			width: 94%;
			margin: 0 auto;
			height: 100%;
		}
		.screen .con{
			width: 99%;
			margin: 0 auto;
		}
		.screen .header .h_con h2{
				float: right;
				font-size: 18px;
				font-weight: normal;
				text-align: right;
				padding-right: 20px;
				font-size: 16px;
		}
		.screen .con .rg .qrcode-wap{
		border:1px solid #ddd;
		box-shadow: 10px #ccc;
		width: 85%;
		margin: 0 auto;
		border-radius:10px;
		background: #fff;
		padding: 15px;
		box-shadow:0 0 18px rgba(0,0,0,.1);

		}
	}

	@media screen and (max-width: 800px){
		.screen .con .rg .footer span{
			display: inline-block;
			text-align: center;
			font-size: 16px;
		}

	}


</style>
<template>
	<div id= "apps" class="screen blue">
	
	<!--header_start-->
	<header class="header">
		<div class="h_con">
			<h1 class="logo" style="display:table;height:100%;">
				<div id="imgbox">
					<img src="../../../assets/img/screen/logo.png">
				</div>
			</h1>

			<h2 @click="screenFull" v-if="screenFlag" style="display:table;height:100%;">
				<div style="float:right;display:table;height:100%;">
					<div style="display:table;height:100%;">
						<div id="imgbox" style="font-size:16px;">
							全屏展示
						</div>
					</div>
				</div>
				<div style="float:right;display:table;height:100%;">
					<div class="full" style="display:table;height:100%;">
						<div id="imgbox">
							<img src="../../../assets/img/screen/full.png" style="width:40%;height:auto;padding-right:8px;">
						</div>

					</div>
				</div>
				
			</h2>

			<h2 @click="screenFullExit" v-else style="display:table;height:100%;">
				<div style="float:right;display:table;height:100%;">
					<div style="display:table;height:100%;">
						<div id="imgbox" style="font-size:16px;">
							取消全屏
						</div>
					</div>
				</div>
				<div style="float:right;display:table;height:100%;">
					<div class="full" style="display:table;height:100%;">
						<div id="imgbox">
							<img src="../../../assets/img/screen/full.png" style="width:40%;height:auto;padding-right:8px;">
						</div>

					</div>
				</div>
				
			</h2>

			<!-- <h2 @click="screenFullExit" v-else>
					<div class="full">
						<div id="imgbox">
							<img src="../../../assets/img/screen/full.png">
						</div>
					</div>
					取消全屏
				</div>
			</h2> -->
			<div style="clear:both"></div>
		</div>

		
	</header>
	<!--header_end-->

	<!--content_start-->
	<div class="con">
		<section class="left" id="userList">
			<ul>
				<li v-for="(item,index) in dataAreadySign" class="down">

					<!--已签到人员-->
					<div v-if = "item.check == 1">

							<div class="txt txt-cur">

								<img src="../../../assets/img/screen/default.png" v-if="!item.avatar">
								<img src="../../../assets/img/screen/default.png" v-else>

								<span>&nbsp;</span>
							
							</div>	

							<div class="qrcode qrcode-cur" :class="{'qrcode-cur-dh':item.flag}">
								<p class="b-con-img" v-if="item.avatar != null">
									<img :src="item.avatar">
								</p>
								<p v-else class="b-con" :class="item.class">{{nameSplit(item.name)}}</p>
								<span>{{item.name}}</span>
									
							</div>

								

					</div>

					<!--未签到人员-->
					<div v-else>


 						<div class="txt">

							<img src="../../../assets/img/screen/default.png" v-if="!item.avatar">
							<img src="../../../assets/img/screen/default.png" v-else>


							<span>&nbsp;</span>
							
						</div>	
						<div class="qrcode">
							<p class="com">{{nameSplit(item.name)}}</p>
							<span>&nbsp;</span>
									
						</div>
					</div>

				</li>
			</ul>
		</section>

		<section class="rg">
			<!-- <img src="images/qrcode.png" class="qrcode"> -->
			<div class="qrcode-wap">
				<img src="../../../assets/img/screen/sign_bg_load.gif" id="load-img">
				<div id="qrcode" ref="qrcode"></div>
			</div>
			<footer class="footer">
				<span>签到：<i class="org">{{finishCount}}</i>/{{totalCount}}&nbsp;&nbsp; {{((finishCount / totalCount)*100).toFixed(2) }}%</span>
				<!-- <span>剩余时间：<i class="org">42'43''{{remainTime}}</i></span> -->
				<span class="padrg">剩余时间：<i class="org">{{remainTime}}</i></span>
			</footer>
		</section>
		<div style="clear:both"></div>
	</div>
	<!--content_end-->

</div>
</template>

<script>
	import Model from '@/model/clazz/signin';
	import QRCode from 'qrcodejs2'
	import { delTip } from '@/global/open'
	export default{
		mounted(){

			this.size();
			$(window).resize(()=>{
				this.size();

			})
			this.initFunObj();

			this.animateChange();

			


		},
		computed:{
			signId(){
				return this.$route.query.signId
			},

			signKey(){
				return this.$route.query.signKey;
			}
		},
		data(){

			return{
				num:0,

				dataAreadySign:[],
				dataUserList:[],
				everyCount:5,
				line:5,
				socketData:{
					"userId":"24381",
					"name":"白曙光1",
					"check":0,
					"avatar":null
				},
				currentNum:0,
				currentLineNum:0,

				signBeginTime:0,
				signEndTime:0,
				currentTime:0,
				webSocketUrl:"",

				remainTime:"",

				finishCount:"",
				totalCount:"",

				/*colors:["linear-gradient(-1deg, #D1EDFF 0%, #A4CEEE 100%)"," linear-gradient(0deg, #F8E5D0 0%, #F0D4B9 100%)"," linear-gradient(-180deg, #97CCD1 0%, #C9F8F5 100%)"],*/
				colors:["#A4CEEE","#F0D4B9","#C9F8F5"],

				screenFlag:true,

				qrCodeWith:"",

				animateFlag:false,

				staffColors:["b-red","b-pink","b-orange","b-blue"],
				staddJ:0,

				defaultFlag:true,

				dhFlag:false

			}
		},
		methods:{
			screenFullExit(){
				this.cfScreen();

				this.screenFlag = true;

				this.screenNormalStyle();
			},
			animateChange(){
				var index = 0;
				let _this = this;
				var interval = setInterval(function(){
					if(index == _this.colors.length-1){
						index = -1;
					}

					index++;


					$("#apps").css({
						'background':_this.colors[index]
					})

				
					
				},30000)
			},
			size(){

				$("#apps").css({
					"height":$(window).height() + "px"
				})



				this.qrwidth = $(".qrcode-wap").width();


				//每个图片的宽度计算
				let userList = $("#userList").width();

				let dis = parseInt(userList * 0.01);

				let width = parseInt((userList - (dis * 5))/5);


				let imgWidth = width * 0.7;

				
				setTimeout(function(){


					$("#userList").find("li").each((index,item)=>{

						let indexs = index + 1;
						if(indexs % 5 == 0){

							$(item).css({
								"width":(width*0.9)+"px",
								"height":(width*0.8) + 'px',
								'margin-right':0 +'px',
								'margin-bottom':19+'px',
							})

							$(item).find("span").css({
								"width":(width*0.9)+"px",
								"overflow":"hidden",
								"text-overflow":"ellipsis",
								"white-space":"nowrap"
							})


						}else{

							$(item).css({
								"width":(width*0.9)+"px",
								"height":(width*0.8) + 'px',
								'margin-right':dis +'px',
								'margin-bottom':19+'px',
							})

							$(item).find("span").css({
								"width":(width*0.9)+"px",
								"overflow":"hidden",
								"text-overflow":"ellipsis",
								"white-space":"nowrap"
							})

							
						}
						

						$(item).find("img").css({
							"width":imgWidth+"px",
							"height":imgWidth + 'px',
						})

						let yfontSize = imgWidth * 0.4;
						let textSize = imgWidth * 0.2;
						$(item).find("p").css({
							"width":imgWidth+"px",
							"height":imgWidth + 'px',
							'font-size':yfontSize + 'px'
						})

						$(item).find("span").css({
							'font-size':textSize + 'px'
						})

						$(item).find("p.b-con").css({
							'line-height':imgWidth + 'px'
						})

						$(".rg").css({
							'margin-top':leftMargin + 10 +"px"
						})

					})

						$(".header").find("h2").css({
							'font-size':imgWidth*0.2 + "px"
						})

						$(".footer").find("span").css({
							'font-size':imgWidth*0.21+"px"
						})

						let every = $("#userList").find("li:eq(0)").outerHeight(true)+1;

						let leftMargin = ($(window).height()-$(".header").height()-every*5)/2;

						$(".left").css({
							'margin-top':leftMargin+"px"
						}) 
						$(".rg").css({
							'margin-top':leftMargin+"px"
						})

						$("#userList").css({
							"height":(every * 5) + "px",
							"overflow-y":"auto",
							"overflow-x":"hidden"
						})

				},50)
				



				
				

			},

			screenNormalStyle(){

				$("#app").removeAttr("style");
			},

			screenFullStyle(){
				$("#app").attr({
					"style":"background-image:linear-gradient(-1deg, #D1EDFF 0%, #A4CEEE 100%)"
				})
			},

			screenFull(){

				this.screenFlag = false;

				var elem = document.getElementById("app");
				this.requestFullScreen(elem);

			},

			nameSplit(name){
				return name.substring(name.length-1,name.length);
			},

			requestFullScreen(element){

				this.screen = false;
				 var requestMethod = element.requestFullScreen || //W3C
				 					element.webkitRequestFullScreen || //Chrome等
				 					element.mozRequestFullScreen || //火狐
				 					element.msRequestFullScreen;  //ie11
	  
				    if (requestMethod) {    
				        requestMethod.call(element);  
				        this.screenFullStyle();
				        
				    } else if (typeof window.ActiveXObject !== "undefined") {    
				        var wscript = new ActiveXObject("WScript.Shell");  
				        if (wscript !== null) {  
				            wscript.SendKeys("{F11}");  
				        }  

				         this.screenFullStyle();
				    }  

			},
			checkFull(){
				   var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;

	             //to fix : false || undefined == undefined
	             if (isFull === undefined) isFull = false;
	             return isFull;
			},

			initFunObj(){
				//向后台请求数据
				let data = {
					signId:this.signId
				}

				Model.signLargeScreen(data,(res=>{

					if(res.status == 200){

						// 签到任务
						var signInfo = res.data;

						//签到人员总数
						this.dataUserList = signInfo.userList;


						// 服务器当前系统时间
						var systemTime = res.data.systemTime;
						this.currentTime = systemTime*1;

						//签到开始、结束时间
						var yyyyMMdd = signInfo.signDate.split('-');
						var beginHHmm = signInfo.beginTime.split(':');
						this.signBeginTime = new Date(yyyyMMdd[0], yyyyMMdd[1]-1, yyyyMMdd[2], beginHHmm[0], beginHHmm[1], 0).getTime();

						var endHHmm = signInfo.endTime.split(':');
						this.signEndTime = new Date(yyyyMMdd[0], yyyyMMdd[1]-1, yyyyMMdd[2], endHHmm[0], endHHmm[1], 0).getTime();

						//webscoket接口
						this.webSocketUrl = signInfo.webSocketUrl;

						//已签到人数，总计人数
						this.finishCount = ~~signInfo.finishCount;
						this.totalCount = ~~signInfo.totalCount;



						// 每秒钟跑一次，更新剩余时间和当前时间
						var _this = this;
						window.setInterval(function(){
							_this.updateTime();
						}, 1000);

						//生成二维码
						var signId = this.signId;
						var timestamp = parseInt(signInfo.systemTime);
						var url = signInfo.QRCodeUrlContent;

						var deadLine = signInfo.deadline;

						

						this.dataAreadySign = signInfo.userList;



						this.clazzMember();


						this.size();


						this.initWebsocket(signId,timestamp,url,deadLine);




					}else{
						this.$message.error(res.message);
					}

				}))	

				
			},

			QRCodeCreate(id,timestamp,urls,deadLine){
				let _this = this;
				$("#qrcode").html("");
				//var text=""+urls+"id="+id+"&type=sign&timestamp="+timestamp+"&deadline="+deadLine;
				var text=urls+"p=sign,"+id+","+timestamp+","+deadLine;

				
				 let qrcode = new QRCode('qrcode', {
					render: "canvas", //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
					text: text, //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
					width: _this.qrwidth, //二维码的宽度
					height: _this.qrwidth, //二维码的高度
					background: "#ffffff", //二维码的后景色
					foreground: "#000000" //二维码的前景色
					//src: ""+url+"/assets/pages/img/sign/sign_jqcode.png" //二维码中间的图片
				});

			},

			updateTime(){

				var now = new Date(this.currentTime);
				var hour = now.getHours();// 小时
				var minute = now.getMinutes();// 分钟
				hour = hour<10?'0'+hour:hour;
				minute = minute<10?'0'+minute:minute;



				if(this.currentTime<this.signBeginTime){
					// 签到未开始
					//$('#remainTime').html('签到未开始');

					this.remainTime = "签到未开始";
				}else if(this.currentTime>this.signEndTime){
					// 签到已结束始
					//$('#remainTime').html('已结束');

					this.remainTime = "已结束";
				}else{
					// 处理剩余时间
					var remainMillSecond = Math.floor((this.signEndTime-this.currentTime)/1000);

					var h = Math.floor(remainMillSecond/60);

					var s = Math.floor(remainMillSecond%60);
					h = h<10?'0'+h:h;
					s = s<10?'0'+s:s;

					this.remainTime = h + "\' " + s + "\'\'";
				}

				this.currentTime += 1000;// 增加1000毫秒
			},

			clazzMember(){

				this.pushData(true);

			},

			pushData(flag){

				if(flag){


					this.dataAreadySign.forEach((item,index)=>{

						this.$set(item,"flag",false);

						if(item.check == 1){	

							this.commdel(index);

							this.colorsTransFer(index);


						}

					})

					console.log("已签到人数" + this.currentNum);

					console.log("默认行数" + this.currentLineNum);
					//班级人员大于16人
					if(this.dataAreadySign.length >= this.everyCount*this.line){

						//已签到人员小于16人
						if(this.currentNum < (this.everyCount*this.line)){

							this.dataAreadySign = this.dataAreadySign.slice(0,this.everyCount*this.line);

						//已签到人员大于等于16人
						}else{

							this.dataAreadySign = this.dataAreadySign.slice(0,this.currentNum);

							this.residue();

							this.scrollBottom();
						}

						//this.colorsTransFer();


					//班级人员小于16人,前台自动补位
					}else{

						let last = (this.everyCount * this.line)-this.dataAreadySign.length;
						for(var i = 0; i < last; i++){
							var obj = {
								name:"proxy",
								userId:"proxy",
								check:0,
								cheatFlag:0
							}
							this.dataAreadySign.push(obj);
						}
					}


					
					

				}else{
					

					if(this.dataAreadySign[this.currentNum] != null){
						this.commdel(this.currentNum);
					}


					console.log('websocket目前行数' + this.currentLineNum);


				}

				
			},

			colorsTransFer(i){

				let _this = this;
				console.log('avatar');
				console.log(_this.dataAreadySign[i].avatar);
				if(_this.dataAreadySign[i].avatar == null){

					if(_this.staddJ == this.staffColors.length){
						_this.staddJ = 0;
					}


					_this.dataAreadySign[i].class = _this.staffColors[this.staddJ];

					_this.staddJ++;
							

				}


				
			},
			residue(){
				
				//默认补充一行四个空余的占位
				if(this.currentNum % this.everyCount == 0){
					return;
				}
				let last = (this.everyCount - this.currentNum % this.everyCount);

				for(var i = 0; i < last; i++){
					let obj = {
						name:"proxy",
						userId:"proxy",
						check:0,
						cheatFlag:0
					}
					this.dataAreadySign.push(obj);
				}
			
			},
			residue2(){

				let last = 5;
				console.log(last);
				console.log('zuihou');
				for(var i = 0; i < last; i++){
					let obj = {
						name:"proxy",
						userId:"proxy",
						check:0,
						cheatFlag:0
					}
					this.dataAreadySign.push(obj);
				}
			
			},

			commdel(curIndex){

				if(this.currentNum % this.everyCount == 0){
					this.currentLineNum++;
	
				}

				this.currentNum++;


			},

			cfScreen(){
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

			scrollBottom(){				
				setTimeout(function(){
					$('#userList').scrollTop($('#userList')[0].scrollHeight);
				},80)												
			},

			initWebsocket(signId,timestamp,url,deadLine){
			//console.log(this.num);
				let websocket = null;
				let _this = this;
				if('WebSocket' in window){
				    websocket = new WebSocket("wss://"+_this.webSocketUrl+"");
				}else{
				    alert('请选择使用谷歌浏览器、火狐浏览器、IE10及以上浏览器')
				}

				// signKey
			    //连接发生错误的回调方法
			    websocket.onerror = function(){
			    	alert("服务器连接错误，请刷新页面重新连接");

					websocket.send('#ERROR#' + _this.signKey);
			    };

			    //连接成功建立的回调方法
			    websocket.onopen = function(event){
			    	
			    	console.log("链接成功");
			    	_this.QRCodeCreate(signId,timestamp,url,deadLine);
			    	
			    	//二维码加载中隐藏
			    	$("#load-img").hide();

			    	setInterval(function(){
							//console.log("会执行吗？");
							timestamp += 4000;
							_this.QRCodeCreate(signId,timestamp,url,deadLine);

							//二维码加载中隐藏

			    			$("#load-img").hide();

					},4000)
			    	
			    	console.log("open");
			    	console.log(_this.signKey);
					websocket.send('#OPEN#' + _this.signKey);
					setInterval(function(){
						console.log("signkey");
						console.log(_this.signKey);
						websocket.send('#heartbeat#' + _this.signKey);
					},1000*3*10);
			    }

			    //接收到消息的回调方法
			    websocket.onmessage = function(event){
			    	 console.log(event.data);

			    	 if(event.data == "#DELETE#"){

			    	 	//提示语
			    	 	 _this.$confirm("签到任务不存在，请联系班主任", '提示', {
								confirmButtonText: '确定',
								type: 'warning'
						}).then(() => {
								
						})

        				  

			    	 }else{

			    	 	_this.finishCount++;

			    	 	//删除一个人增加一个人会出现105
						if(_this.finishCount > _this.totalCount){
							_this.finishCount = _this.totalCount;
						}

			    	 	var msg = JSON.parse(event.data);
			    	 	

				    	_this.moreAppend(_this);


				    	_this.$set(_this.dataAreadySign[_this.currentNum],msg)
				    	_this.$set(_this.dataAreadySign[_this.currentNum],"check",1);

				    	_this.$set(_this.dataAreadySign[_this.currentNum],"flag",true);

				    	_this.$set(_this.dataAreadySign[_this.currentNum],"name",msg.name);

				    	_this.$set(_this.dataAreadySign[_this.currentNum],"avatar",msg.avatar);

				    	_this.colorsTransFer(_this.currentNum);

				    	_this.size();


				    	


						_this.pushData(false);
							

				    	
			    	 }
			    	  
			    }


			    //连接关闭的回调方法
			    websocket.onclose = function(){
					//websocket.send('#CLOSE#' + signKey);
			    }

			    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
			    window.onbeforeunload = function(){
			        websocket.close();
			    }

				

				
				

			},
			scrollLineHeigh(lh){

				var o = document.getElementById("userList");
				o.scrollTop = $('#userList')[0].scrollHeight + lh;

				console.log('scrolltop');
				console.log(o.scrollTop);

			},
			moreAppend(_this){


				if(_this.currentNum >= (_this.everyCount*_this.line-1)){

					console.log('当前已');
					console.log(_this.currentNum);

					console.log('全部人数');
					console.log(_this.dataUserList.length-1);

					

					
					_this.scrollBottom();


					//默认进来行数不用加1
					if((_this.currentNum) % (_this.currentLineNum) == 0){
						console.log("默认自动补位");
							//一人已签到，自动补三个
							if(_this.defaultFlag){
								_this.residue2();
								_this.defaultFlag = false;
							}
							
					}

					//websocket qiandao - 当前索引增加 + 1
					if((_this.currentNum+1) % (_this.currentLineNum) == 0){

							//websocket签到至最后一行不进行追加
							if(_this.currentNum >= _this.dataUserList.length-1){

								console.log("return");
								//最后一个不执行此操作
								return;
							}

							//一人已签到，自动补三个
							for(var i = 0; i < 5; i++){
								let obj = {
									name:"proxy",
									userId:"proxy",
									check:0,
									cheatFlag:0
								}
								this.dataAreadySign.push(obj);
							}
							_this.defaultFlag = false;
					}
				}
			}
		},
		components:{
			QRCode
		}
	}
</script>
