var signKey;
var undoUserArryObj = {};
var userIdArry = [];
var finishCount = 0;
var totalCount = 0;
var finishIdx = 0;
var currentTime = 0;// 单位：毫秒
var signBeginTime = 0;// 单位：毫秒
var signEndTime = 0;// 单位：毫秒
//动画参数
var repeatStep;
var linesNum = 5;
var topFlag=true;
var count = 0;
var everylineCount = 6;
var url = host();

var imagesNomal = ["/static/page/assets/pages/img/sign/sign_bg01.png","/static/page/assets/pages/img/sign/sign_bg02.png","/static/page/assets/pages/img/sign/sign_bg03.png","/static/page/assets/pages/img/sign/sign_bg04.png","/static/page/assets/pages/img/sign/sign_bg05.png","/static/page/assets/pages/img/sign/sign_bg06.png"];
var imagesNomalCount = 0;
var imagesCur = ["/static/page/assets/pages/img/sign/sign_01.png","/static/page/assets/pages/img/sign/sign_02.png","/static/page/assets/pages/img/sign/sign_03.png","/static/page/assets/pages/img/sign/sign_04.png","/static/page/assets/pages/img/sign/sign_05.png","/static/page/assets/pages/img/sign/sign_06.png","/static/page/assets/pages/img/sign/sign_07.png","/static/page/assets/pages/img/sign/sign_08.png","/static/page/assets/pages/img/sign/sign_09.png","/static/page/assets/pages/img/sign/sign_10.png"]
var imagesCurCount = 0;
var index;
var secondCount = 0;
//已签到人员实际计数；
var secondCountSj = 0;
var step2;
var showFlag=true;
var timestamp = 0;
var webSocketUrl;
var moren;
checkBrowser();
initFunObj();
function checkBrowser(){
   var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;//判断是否是谷歌浏览器
	if(isChrome){
		$("#checkBrowser").hide();
	}else{
		$("#checkBrowser").show();
	}
}
function initFunObj(){
	var params = {};
	if(location.href.indexOf('?')>0){
	    var paramStr = location.href.substring(location.href.indexOf('?') + 1);  // xx = xxx & xx = xxx
	    paramStr = paramStr.replace(/#/g,"");
	    var paramArry = paramStr.split('&');
	    if(paramArry && paramArry.length>0){
	        for(var i=0;i<paramArry.length;i++){
	            var key = paramArry[i].split('=')[0];
	            var value = paramArry[i].split('=')[1];
	            params[key] = value;
	        }
	    }
	}

	//signKey = params['signKey'];

	//获取账号
  //alert(params['token']);
	$.ajax({
		url : api()+"/sign/largeScreen/",
    contentType:"application/json",
    headers: {
      "Authorization":params['token']
    },
    data:{
      signId:params['signId']
    },
		method : "GET",
		dataType : "json",
		beforeSend : function(){
			return true;
		},
		success : function(response){
			if(response != null && response.status == 200 && !!response.data){
				//加载图片隐藏
				//$(".sign_load").hide();
				// 签到任务
				var signInfo = response.data;
				// 服务器当前系统时间
				var systemTime = response.data.systemTime;
				currentTime = systemTime*1;

				var yyyyMMdd = signInfo.signDate.split('-');
				var beginHHmm = signInfo.beginTime.split(':');
				signBeginTime = new Date(yyyyMMdd[0], yyyyMMdd[1]-1, yyyyMMdd[2], beginHHmm[0], beginHHmm[1], 0).getTime();
				var endHHmm = signInfo.endTime.split(':');
				signEndTime = new Date(yyyyMMdd[0], yyyyMMdd[1]-1, yyyyMMdd[2], endHHmm[0], endHHmm[1], 0).getTime();
				//webSocketUrl
				webSocketUrl = signInfo.webSocketUrl;
				console.log("url" + webSocketUrl);
				// 每秒钟跑一次，更新剩余时间和当前时间
				window.setInterval("updateTime()", 1000);
				//判断是否防作弊,二维码判断,common未做防作弊，avoid防作弊
				if(signInfo.signType == "common"){
					$("#qurcode_wap").hide();
					$("#qurcode_wap").removeClass("qurcode_wap");
					$("#QRCode").show();
					$("#qrcodeCanvas").hide();
					$('#QRCode').find("img").attr('src', signInfo.url);

				}else{
					$("#qurcode_wap").show();
					$("#qurcode_wap").addClass("qurcode_wap");
					$("#qrcodeCanvas").show();
					$("#QRCode").hide();
					var signId = params['signId'];
					var timestamp = parseInt(signInfo.systemTime);
					var url = signInfo.QRCodeUrlContent;

					var deadLine = signInfo.deadline;
					setInterval(function(){
						timestamp += 4000;
						QRCodeCreate(signId,timestamp,url,deadLine);
					},4000)
				}

				finishCount = ~~signInfo.finishCount;
				totalCount = ~~signInfo.totalCount;
				// 已完成签到人数
				$('#finishCount').html(finishCount);
				// 预计签到人数
				$('#totalCount').html(totalCount);
				//下载二维码
				var urlString = signInfo.url;
				var signDate = signInfo.signDate;
				var signTime = signInfo.beginTime + "——" + signInfo.endTime;
				downloadJqcode(urlString,signDate,signTime);
				var dataNum = 30;
				var dataAreadySign = signInfo.userList;
				if(signInfo.userList){
					if(dataAreadySign.length < dataNum){
						var restData = dataNum-(dataAreadySign.length);
						for(var i = 0; i < restData;i++){
							var obj = {"name":"proyx","check":0,"avatar":"null","userId":"proxy","cheatFlag":0};
							dataAreadySign.push(obj);
						}
						index = setInterval(function(){dealDataFirst(true,dataAreadySign)},100);

					}else{
						index = setInterval(function(){dealDataFirst(true,dataAreadySign)},100);
					}

				}

			}else{
				alert(response.message);
			}
		}
	})
}
//获取host路径
function host(){
	var url = window.location.host;
	if(url.indexOf("http") > 0){
		url = url;
	}else{
		url ="http://"+url;
	}
	return url;
}
//生成er
function QRCodeCreate(id,timestamp,urls,deadLine){
	$("#qrcodeCanvas").html("");
	//var text=""+urls+"id="+id+"&type=sign&timestamp="+timestamp+"&deadline="+deadLine;
	var text=urls+"p=sign,"+id+","+timestamp+","+deadLine;

	$("#qrcodeCanvas").qrcode({
		render: "canvas", //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
		text: text, //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
		width: "300", //二维码的宽度
		height: "300", //二维码的高度
		background: "#ffffff", //二维码的后景色
		foreground: "#000000" //二维码的前景色
		//src: ""+url+"/assets/pages/img/sign/sign_jqcode.png" //二维码中间的图片
	});
}
function dealDataFirst(flag,dataAreadySign){
	if(flag){
			//数据小于12条
			if(count == dataAreadySign.length){
				//追加剩余div
				 moren = false;
				 clearInterval(index);
				 setp2 = setInterval(function(){dealDataSecond(count,dataAreadySign)},150);
				 return;
			}
	 		//读取后台数据前12条数据后判断已签到人员进行翻滚显示；
	 		if(count >= (linesNum*everylineCount)){
	 			 clearInterval(index);
	 			 step2 = setInterval(function(){dealDataSecond(count,dataAreadySign)},150);
	 			 return;
	 		}
	 		//初始化进行初始数据(未签到人员)翻动转换
	 		var div = createDiv(dataAreadySign[count].userId,dataAreadySign[count].check,dataAreadySign[count].name,dataAreadySign[count].avatar,imagesNomal,imagesCur);
			$("#userList").append(div);
	 		count++;
	}else{
		if(count == (linesNum+1)*everylineCount || count==dataAreadySign.length){
				linesNum++;
				clearInterval(repeatStep);
				step2=setInterval(function(){dealDataSecond(count,dataAreadySign)},150);
				topFlag=true;
				return;

			}

			//第三行循环步骤1，normal进行展现
			var div = createDiv(dataAreadySign[count]["userId"],dataAreadySign[count].check,dataAreadySign[count].name,dataAreadySign[count].avatar,imagesNomal,imagesCur);
			$(".userList").append(div);

			var lineHeight = $(".sign_rg").find(".col-md-2").height()+10;
			startmarquee(lineHeight);
			count++;

	}
}

function dealDataSecond(counts,dataAreadySign){
		//当前数据少于12条，停止动画，不再执行

		if(dataAreadySign[secondCount]&&dataAreadySign[secondCount]["check"] != 1){
			if(showFlag){
				showFlag=false;
			}
		}
		if(secondCount == counts){
			//小于12条数据，websoket只执行一次
			if(moren && moren != undefined){
				return;
			}
			//数据小于12，最后一条签完到后执行
			if(moren == false){
				clearInterval(step2);
				initWebSocket(dataAreadySign);
				moren = true;
				return;
			}
			//数据大于12条执行,最后一条签完到后执行
			if(step2 != null){
				clearInterval(step2);
			}
			//在该行的div数量满足N*6后，则不再执行加载后续数据的任务

			if(secondCount<=dataAreadySign.length&&showFlag){
				repeatStep = setInterval(function(){dealDataFirst(false,dataAreadySign)},100);
			}else{
				//调用websocket
				initWebSocket(dataAreadySign);
			}
			return;
		}
		//判断签到人数，已签到进行翻转滚动
		if(dataAreadySign[secondCount]["check"] == 1){
			secondCountSj++;
			$(".profile-userpic").eq(secondCount).find(".flipper").css({
				"transform":"rotateY(180deg)"
			});
			$(".profile-userpic").eq(secondCount).next(".profile-usertitle").find(".profile-usertitle-job").show();

		}
		secondCount++;

}

function startmarquee(lh) {
	var o = document.getElementById("userList");
 	if(topFlag){
 		topFlag=false;
 	}else{

 		return;
 	}
   	o.scrollTop += lh;
}
function initWebSocket(dataAreadySign){
	console.log("zuihou");
  signKey = $.fn.splitSearchMethod()["signKey"];
	var websocket = null;
    //判断当前浏览器是否支持WebSocket
    if('WebSocket' in window){
        websocket = new WebSocket("ws://"+webSocketUrl+"");
    }else{
        alert('请选择使用谷歌浏览器、火狐浏览器、IE10及以上浏览器')
    }

    // signKey
    //连接发生错误的回调方法
    websocket.onerror = function(){
    	alert("服务器连接错误，请刷新页面重新连接");

		websocket.send('#ERROR#' + signKey);
    };

    //连接成功建立的回调方法
    websocket.onopen = function(event){
    	
    	//二维码加载中隐藏
    	$(".sign_load").hide();

		websocket.send('#OPEN#' + signKey);
		setInterval(function(){
			websocket.send('#heartbeat#' + signKey);
		},1000*3*10);
    }

    //接收到消息的回调方法
    websocket.onmessage = function(event){
    	console.log(event.data);
    	 if(event.data == "#DELETE#"){
    	 	  $('#myModal').modal({
    	 	  	show:true
    	 	  })
    	 }else{
    	 	var msg = JSON.parse(event.data);
	    	var userId = msg.userId;
	    	  var name = msg.name;
	    	  var singInSrc = msg.avatar;
	    	  updateUserSignStatu(userId,name,singInSrc);
    	 }
    	  

    }

    function updateUserSignStatu(userId,name,singInSrc){
    	var curHtml = $(".sign_rg").find(".col-md-2").eq(secondCountSj).html();
    	//如果当前有这个div

    	if(curHtml){
    		var back = '<div class="back"><img src="'+singInSrc+'"></div>';
			if(singInSrc == null){
				if(imagesCurCount == imagesCur.length){
					imagesCurCount = 0;
				}
				back= '<div class="back"><img src="'+imagesCur[imagesCurCount]+'"></div>';
				imagesCurCount ++;
			}
			$(".sign_rg").find(".col-md-2").eq(secondCountSj).attr("id",userId);
			$(".sign_rg").find(".col-md-2").eq(secondCountSj).children().find(".profile-usertitle-job").html(name);
    		$(".sign_rg").find(".col-md-2").eq(secondCountSj).children().find(".front").after(back);

    	}else{
    		//需另起一行 并将第一个职为已选中 其余为未签到
    		var div = createDiv(userId,1,name,singInSrc,imagesNomal,imagesCur);
    		$(".sign_rg").find(".col-md-2").eq(secondCountSj-1).after(div);
    		//并补齐其他的5个
    		for(var i=0;i<everylineCount-1;i++){
    			$(".userList").append(createDiv("proxy",0,name,singInSrc,imagesNomal,imagesCur));
    		}
    	}
    	$(".profile-userpic").eq(secondCountSj).find(".flipper").css({
        	"transform":"rotateY(180deg)"
        });
		$(".profile-userpic").eq(secondCountSj).next(".profile-usertitle")
		.find(".profile-usertitle-job").show();
    	var hl = $(".sign_rg").find(".col-md-2").height()+10;
    	startmarquee(hl);
    	secondCountSj++;
    	$("#finishCount").html(secondCountSj);
    }

	function startmarquee(lh) {
		 var o = document.getElementById("userList");
	   	o.scrollTop += lh;
	}
    //连接关闭的回调方法
    websocket.onclose = function(){
		//websocket.send('#CLOSE#' + signKey);
    }

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function(){
        websocket.close();
    }

    //关闭连接
    function closeWebSocket(){
        websocket.close();
    }
}

function createDiv(userId,checked,name,singInSrc,imagesNomal,imagesCur){
	if(imagesNomalCount == imagesNomal.length){
		imagesNomalCount = 0;
	}
	var str = "";
	var name = name;
	if(checked == 1){
		name = name;
	}else{
		name = "";
	}
	str +=
	'<div class="col-md-2" id="logoShowDiv' + userId + '">' ;
	str += '<div class="portlet light profile-sidebar-portlet" style="background:none!important">' ;
	str +=  '<div class="profile-userpic">';
	str	+= '<div class="flipper">';
	str	+= '<div class="front">';
	str +=  	'<img src="' + imagesNomal[imagesNomalCount] + '" class="img-responsive " alt="' + name + '" id="logo' + userId + '">' ;
	str += '</div>';

	if( checked == 1){

		str += '<div class="back">';
		//服务器有头像
		if(singInSrc != "null" && singInSrc != null){
			str += '<img src="'+singInSrc+'">';
		//无头像进行12生肖显示
		}else{
			if(imagesCurCount == imagesCur.length){
				imagesCurCount = 0;
			}
			str += '<img src="'+imagesCur[imagesCurCount]+'">';
			imagesCurCount ++;
		}

		str += '</div>';
	}
	str += '</div>';
	str +=  		'</div>' ;
	str +=  		'<div class="profile-usertitle">' ;
	str +=  			'<div class="profile-usertitle-job" style="font-size:18px;color:#333;font-weight:normal;display:none" id="name' + userId +'"> ' + name + ' </div>' ;
	str +=  		'</div>' ;
	str +=  	'</div>' ;
	str +=  '</div>';
	imagesNomalCount++;
	return str;
}


function updateTime(){
	var now = new Date(currentTime);
	var hour = now.getHours();// 小时
	var minute = now.getMinutes();// 分钟
	hour = hour<10?'0'+hour:hour;
	minute = minute<10?'0'+minute:minute;

	// 处理当前时间
	var hhmm = hour + ":" + minute;
	var timeShowV = $('#currentTime').html();
	if(timeShowV!==hhmm){
		$('#currentTime').html(hhmm);
	}



	if(currentTime<signBeginTime){
		// 签到未开始
		$('#remainTime').html('签到未开始');
	}else if(currentTime>signEndTime){
		// 签到已结束始
		$('#remainTime').html('已结束');
	}else{
		// 处理剩余时间
		var remainMillSecond = Math.floor((signEndTime-currentTime)/1000);

		var h = Math.floor(remainMillSecond/60);
		var s = Math.floor(remainMillSecond%60);
		h = h<10?'0'+h:h;
		s = s<10?'0'+s:s;

		$('#remainTime').html(h + ':' + s);
	}

	currentTime += 1000;// 增加1000毫秒
}
//下载二维码
function downloadJqcode(urlString,signDate,signTime){

  var token = $.fn.splitSearchMethod()["token"];
  var signId = $.fn.splitSearchMethod()["signId"];
	var loadUrl = api()+"/sign/signCodeDownLoad?signId="+signId+"&token="+token;
	$("#load").attr("href",loadUrl);
}
