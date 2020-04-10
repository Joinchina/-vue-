<style scoped lang="less">
	@import '../../../../node_modules/swiper/dist/css/swiper.min.css';
	@import "../../../assets/less/fullscreen.less";
	@import "../../../../static/js/scren.css";
	.swiper-slide > dl{
		padding-top: 5vh;
		overflow: hidden;
	}
	.x-ques dt{
		padding-bottom: 10px;
	}
</style>
<template>
	<div class="" id="fullRes">
		<header class="header">
			<img class="logo" src="../../../assets/img/vote/logo.png" alt="师训保培训">
		</header>
		
		<div class="swiper-container x-ques">
			<div class="swiper-wrapper">
				<div class="swiper-slide">
					<div class="first-bg">
						<h1 v-cloak>{{title}}</h1>
						<ul class="media clearfix">
							<li class="qr-code-box">
								<img class="qr-code" :src="qrcodeUrl" aglt="" />
								<p v-cloak>请使用师训宝扫一扫参与{{typename[type]}}</p>
							</li>
							<li class="desc">
								<strong class="sub-num" v-cloak>{{submitNum}}</strong>
								<br/>
								<span class="sub-tip">提交人数</span>
								<br/>
								<i class="icon-line"></i>
								<br/>
								<span class="ques-num" v-cloak><i class="icon-ques-num-big"></i> 题目总数：{{questionCount}}</span>
							</li>

						</ul>
						<a id="swiperNext" class="btn-first" href="javascript:;">查看结果</a>
					</div>
				</div>
				
				<template v-for="(item, index) in quesList">
				<div class="swiper-slide updateQues" v-if="item.type == 'SELECT'" >
					<dl>
						<dt class="headline" v-cloak><span class="q" v-cloak>Q{{index+1}}.</span> {{item.question}}  <span
									class="type" v-if="type == 'QUESTIONNAIRE' " v-cloak>
									（单选）（{{item.required ? '必答' : '选答'}}） </span>
						</dt>
						<dd class="res-opt clearfix" v-for="(optStat, index) in item.optionStatistics">
							<p class="tit-opt clearfix" v-cloak>{{selList[index]}} {{optStat.optionContent}}</p>
							<div class="progress-out">
								<progress-bar 
									:selected-counts = "optStat.selectedCounts" 
									:bg-color="colorList[index]"
									:submit-num="submitNum"></progress-bar>
								
							</div>
							<div class="progress-num">
								<span :style="'color:'+colorList[index]" >
									<i class="updatePrec" v-cloak>{{optStat.selectedCounts == 0 ? '0' : (optStat.selectedCounts / submitNum * 100) | mround }}</i>%
									&bull;</span> <em class="updateSelt" v-cloak>{{optStat.selectedCounts}}</em>人
							</div>
						</dd>


						
					</dl>

				</div>
				<div class="swiper-slide updateQues" v-else-if="item.type == 'MUILTSELECT'" >
					<dl>
						<dt class="headline"><span class="q" v-cloak>Q{{index+1}}.</span>{{item.question}} <span
									class="type" v-if="type == 'QUESTIONNAIRE' " v-cloak>
									（多选）（{{item.required ? '必答' : '选答'}}） </span></dt>
						<dd class="res-opt clearfix" v-for="(optStat, index) in item.optionStatistics">
							<p class="tit-opt clearfix" v-cloak>{{selList[index]}} {{optStat.optionContent}}</p>
							<div class="progress-out">
								<progress-bar 
									:selected-counts = "optStat.selectedCounts" 
									:bg-color="colorList[index]"
									:submit-num="submitNum"></progress-bar>
								
							</div>
							<div class="progress-num">
								<span :style="'color:'+colorList[index]" >
									<i class="updatePrec" v-cloak>{{optStat.selectedCounts == 0 ? '0' : (optStat.selectedCounts / submitNum * 100) | mround }}</i>%
									&bull;</span> <em class="updateSelt" v-cloak>{{optStat.selectedCounts}}</em>人
							</div>
						</dd>

						
					</dl>

				</div>
				<div class="swiper-slide updateQues" v-else-if="item.type == 'SUBJECTIVE'">
					<dl>
						<dt class="headline"><span class="q" v-cloak>Q{{index+1}}.</span>{{item.question}} <span
									class="type" v-if="type == 'QUESTIONNAIRE' " v-cloak>
									（问答）（{{item.required ? '必答' : '选答'}}） </span></dt>
						<dd class="answer-list">
							<!-- 我就是问答题的大屏幕哈哈哈
							<ul class="answer-box">
								
								<li class="clearfix" v-for="(answer, index) in item.answers">
									<span class="order" v-cloak>{{index+1}}.</span>
									<span v-cloak>{{answer}}</span>
								</li>			
								style="margin-top:0;width:800px;height:600px; margin-top:0;"					
							</ul> -->
							<div  class="container">             									
								<tag-cloud :keyWords = "item.keywords"></tag-cloud>										
							</div>
							
						</dd>
					</dl>
				</div>
				</template>
				


			</div>
			
			
		</div>
		<footer class="footer clearfix">
			<p class="left" v-cloak><span class="ora" v-cloak>[{{status == 'END' ? '已结束' : '进行中'}}]</span> {{title}}</p>
			<p class="right">
				<span><i class="icon-course"></i> 提交人数：<em class="ora subNum" v-cloak>{{submitNum}}</em></span>
				<span><i class="icon-ques-num"></i> 题目总数：<em class="ora" v-cloak>{{questionCount}}</em></span>
			</p>
		</footer>
		<!-- Add Navigation -->
		<div class="swiper-button-prev"></div>
	    <div class="swiper-button-next outer"></div>

	    <!-- 浏览器提示 -->
	    <div id="checkBrowser" style="display:none" class="bb">
			<div class="sign_check_bowser"></div>
			<div class = "sign_check_tips">
				<div>为了能达到最佳的显示效果，强烈建议您使用Chrome浏览器来查看此页面。</div>
				<div class="sign_google"><a href="http://w.x.baidu.com/alading/anquan_soft_down_ub/14744"><img src="../../../assets/img/common/sign_google.png"/></a></div>
			</div>
		</div>
	</div>
	
</template>
<script>
import $ from 'jquery'
import swiper from 'swiper'
import tagCloud from './tagCloud'
import progressBar from 'components/activity/progress_bar'
import model from 'model/activity/result'
	export default {
		data() {
			return {
				paperId:"",
				paperKey: "",
				webSocketUrl:"",
				type:"",
				typename: {
					'VOTE': '投票',
					'QUESTIONNAIRE': '问卷',
					'INTROSPECTION': '反思',
					'EVALUATION': '评价'
				},
				closePrivilege:"",   // 是否有权限结束投票
				status:"",
				title:"",
				qrcodeUrl:"",
				submitNum:"",
				questionCount:"",
				totalNum:"",
				quesNum:"",
				quesList:"",
				selList:["A","B","C","D","E","F","G","H","I","J"],
				colorList:["#4fbeea", "#a9ca77", "#fec457", "#ff7d7a", 
					"#23a565", "#f496aa", "#f4a260", "#cd6ced", "#f7b560", "#ed6cbe"],
				colorArr:['#3982CF;','#AB4142','#EFB660',' #9138C0',' #66A158','#F8E71C','#51A7A6','#D06832','#72B0DA','#AB4142']
				}
				
		},
		computed: {
			// paperId () {
			// 	return this.$route.query.paperId;
			// },
			// paperKey(){
			// 	return this.$route.query.paperKey
				
			// },
			activityId () {
				return this.$route.query.activityId;
			},

		},
		created() {
			this.getData();
		 	this.checkBrowser();
		},
		mounted: function(){
			let clientH = $(window).height();
			// document.getElementById('fullRes').height = 614;
			let h =  $("#fullRes").height(clientH);
			// console.log("fullResk",clientH);

			var _this = this;
			setTimeout(() => {	
				_this.mySwiper();
			}, 20)	
			
			
		},
		filters: {
			mround: function(value) {
				if (!value) return ''
				value = Math.round(value)
				return value
			}
		},
		methods: {			
			checkBrowser: function() {
				var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;//判断是否是谷歌浏览器
				if(isChrome){
					$("#checkBrowser").hide();
				}else{
					$("#checkBrowser").show();
				}
			},
			getData: function(){
				let data = {
					activityId: this.activityId
				}

				model.getCourseActPaperRes(data, (res => {
					// console.log("fullScreen",res);
					if(res.status == 200) {
						this.webSocketUrl = res.data.webSocketUrl;
						
						this.type = res.data.type;
						this.status = res.data.status;
						this.closePrivilege = res.data.closePrivilege;
						this.title = res.data.title;
						this.qrcodeUrl = res.data.qrcodeUrl;
						this.submitNum = res.data.submitNum;
						this.totalNum = res.data.totalNum;
						this.quesNum = res.data.questionCount;
						this.quesList = res.data.questions;
						this.paperId = res.data.questionPaperId;
						this.questionCount = res.data.questionCount;

						this.getWebSocket();
						
					} else {
						this.$message.error(res.message);
					}
				}));

				
			},
			mySwiper: function(){
				var _this = this;
				var meSwiper = new Swiper('.swiper-container', {
					initialSlide :0,
				    observer:true,//修改swiper自己或子元素时，自动初始化swiper
				    observeParents:true, //修改swiper的父元素时，自动初始化swiper

					nextButton: '.swiper-button-next',
		        	prevButton: '.swiper-button-prev',
		        	speed:700,
		        	onInit: function(meSwiper){
		        		meSwiper.nextButton[0].style.display='none';
		        		meSwiper.prevButton[0].style.display='none';
		    			
		    			if(meSwiper.activeIndex == 0) {
		    				$(".footer").hide();
		    			}

		    			
		        	},
		        	onSlideChangeStart: function(meSwiper){
		        		_this.progressOver();
		        		if(meSwiper.activeIndex == 0) {
		        			meSwiper.nextButton[0].style.display='none';
		        			meSwiper.prevButton[0].style.display='none';

		    				$(".footer").hide();
		    				
		    			}else {
		    				meSwiper.nextButton[0].style.display='block';
		    				meSwiper.prevButton[0].style.display='block';
							$(".footer").show();
							// ["老师", "学生", "孩子", "教师", "教学", "学校", "人生", "大家", "习惯", "精彩", "课堂", "问题", "能力", "讲座", "幼儿园", "文化", "时间"]
							
						}
		        	},
		        	onSlideChangeEnd: function(meSwiper){
		        		_this.progress();
		        		
		        		if(meSwiper.isBeginning) {
		        			meSwiper.nextButton[0].style.display='none';
		        			meSwiper.prevButton[0].style.display='none';
		        		}else if(meSwiper.isEnd){
		        			meSwiper.nextButton[0].style.display='none';
						}else{
							meSwiper.nextButton[0].style.display='block';
							
						}
		        		
		        	}
		        	
				});
				$("#swiperNext").click(function(){
					meSwiper.slideNext();
				});
				
			},
			
			
			progress: function(){
				var self = this;
				var arrbar = $('.progress-bar');
				var arrPro = $(".progress-in");
				
					
				arrPro.each(function(index,element){
					var _this = $(this),
						t,
						_progress = _this.find('.progress-bar'),
						_progressNum = _this.parents('.progress-out').siblings('.progress-num').find('i'),
						speed = 500,
						dataperc = _this.attr('data-perc');

						// console.log("dataperc",dataperc);

					t = setInterval(function(){
						var barW = _this.find('.progress-bar').width();
						var proW = _this.width();
						
						_progressNum.html(parseInt(barW / proW * 100));
						
					},speed/100);
			
					_progress.css({"width":dataperc+"%"});
					setTimeout(function(){ 
						clearInterval(t);
						t = null;
						_progressNum.html(dataperc);
					},speed);
					


				})
				
			},
			progressOver: function(){
				var arrbar = $('.progress-bar');
				var arrPro = $(".progress-in");

				arrPro.each(function(index,element){
					var _this = $(this);
					var _progressNum = _this.parents('.progress-out').siblings('.progress-num').find('i');
					_progressNum.html(0);
					
					_this.find('.progress-bar').css({"width":0});

				});
			},
			getWebSocket: function() {
				
				let _this = this;
				let websocket = null;
				this.paperKey = this.$route.query.paperKey;
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
			    	console.log("链接成功");
			    	
					websocket.send('#OPEN#' + _this.paperKey);
					setInterval(function(){
						websocket.send('#heartbeat#' + _this.paperKey);
					},1000*3*10);
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
			
			updataVal: function(data){
				var _this = this;
				
				// 更新提交人数
				$(".sub-num").html(data.submitNum); 
				$(".subNum").html(data.submitNum);
				// Dom ques
		    	var quesDom = $(".updateQues");  
		    	// callback ques
		    	var questions = data.questions;  
		    	$.each(questions,function(index,ques) {
		    		// dom 与 返回数据结构对应
		    		var questype = questions[index].type;

		    		// 添加问答题答案
		    		if(questions[index].type == 'SUBJECTIVE') {
		    			var answerind = parseInt($(quesDom[index]).find(".answer-box li").length) + 1;
		    			var answercont = questions[index].answers[0];
		    			var li = '<li class="clearfix"><span>'+answerind+'.</span><span>'+answercont+'</span></li>';
		    			$(quesDom[index]).find('.answer-box').append(li);
		    			
		    		}else {
		    			// 当前选择题选择答案数组
		    			var opts = questions[index].optionStatistics;
		    			var optsDom = $(quesDom[index]).find(".res-opt");
		    			// console.log("opts",opts);
		    			// console.log("optsDom",optsDom)
		    			$.each(opts, function(ind, opt) {
		    				var prec = opts[ind].percent,
		    					selt = opts[ind].selectedCounts;
		    				// console.log('prec',prec);
		    				$(optsDom[ind]).find(".progress-bar").css({"width":prec+"%"});
		    				$(optsDom[ind]).find(".progress-in").attr("data-perc",prec);  // 更新滚动条
		    				$(optsDom[ind]).find(".updatePrec").html(prec);
		    				$(optsDom[ind]).find(".updateSelt").html(selt);
		    				
		    			});
		    		}
		    	});
		    	
			}
		},

		components: {
			progressBar,
			tagCloud
		}
	}
</script>
<style type="text/css">
	#app{
		background: #352f43!important;
		height: 100%!important;
	}
	.container{
		height: 60vh;
	}
</style>