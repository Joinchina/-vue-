<style scoped lang="less">
	@import '../../../../node_modules/swiper/dist/css/swiper.min.css';
	@import "../../../assets/reset-element-ui/form-reset.css";
	@import "../../../assets/less/interactFull.less";
	
	#wInteractFull {
		.black_overlay{
		  display: none;
		  position: absolute;
		  top: 0%;
		  left: 0%;
		  width: 100%;
		  height: 100%;
		  background-color: black;
		  z-index:1001;
		  -moz-opacity: 0.5;
		  opacity:.5;
		  filter: alpha(opacity=50);
		}
		.bg_content {
		  display: none;
		  position: absolute;
		  top: calc(~'50% - 190px');
		  left: calc(~'50% - 185px');
		  width: 379px;
  		  height: 368px;
		 
		  z-index:1002;

		}
		
	}
	.el-select-dropdown__item.selected{
		color: #606266!important;
		font-weight: normal;
		background: url('../../../assets/img/icon/icon-full-yes.png') no-repeat 180px center;
	}

	
	
	
</style>
<template>
	<div id="wInteractFull">
		<main class="x-main full" id="ani">
			<nav class="x-subnav1 clearfix">
				<i class="bg-left"></i>
				<img src="../../../assets/img/rollcall/logo.png" />

				<div class="right">
					<router-link :to="{ path: '/clazz/interact/res', query: {clazzId: clazzId}}">
						<i class="icon-list2"></i>
						历史记录
					</router-link>
					
				</div>
			</nav>

			<section class="x-cont x-page1">
				<!--选择-->
				<div class="x-choose">
					 <el-select v-model="value" class="x-dropdown" placeholder="点名范围"  @change="change">
					    <el-option
					    	class="j-full-options"
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
  					</el-select>
				</div>

				<img src="../../../assets/img/rollcall/bg_box.png" alt="">

				<div class="ques-box">
					<i class="icon-ques"></i>
					<i class="icon-ques"></i>
					<i class="icon-ques"></i>
				</div>
				

				<div class="roll-box swiper-container">
					<ul id="roll" class="roll swiper-wrapper">
						<li 
							:data-userId="item.id" 
							:data-headpic="item.avatar ? item.avatar : headpic" 
							class="swiper-slide"
							v-for="item in stuList"
							>{{item.name}}</li>
						<!-- <li data-userId="111" class="swiper-slide">范冰冰</li>
						<li data-userId="222" class="swiper-slide">刘诗诗</li>
						<li data-userId="333" class="swiper-slide">赵丽颖</li>
						<li data-userId="444" class="swiper-slide">杨幂</li> -->
					</ul>
				</div>
				<a class="go"  href="javascript:;" id="goStop"></a>

				
			</section>

			<section class="x-page2">
				<div class="details" id="details">
					<img src="../../../assets/img/common/avatar.png" class="headpic">

					<div class="check-name"></div>
				</div>
				
				<div class="evaluate">
					<h2 class="eval-title1">请对TA的表现做个评价吧</h2>

					<ul class="eval-desc clearfix" id="eval">
						<li class="good" @click="evalFn($event,'A')">
							<i class=""></i>
							<span>非常好</span>
						</li>
						<li class="better" @click="evalFn($event,'B')">
							<i></i>
							<span>较好</span>
						</li>
						<li class="common" @click="evalFn($event,'C')">
							<i></i>
							<span>一般</span>
						</li>
						<li  class="absent" @click="evalFn($event,'D')">
							<i></i>
							<span>缺席</span>
						</li>
					</ul>
				</div>
				<a href="javascript:;" class="go-again" id="again" @click="againFn">再来一次</a>
			</section>
		</main>
      	<!-- end content -->
        
    	<!-- pop -->
	    <section>    
	    	<div id="fade" class="black_overlay"></div>
	        <!-- very nice -->
	        
            <div class="x-pop bg_content" id="veryNice">
                <i class="icon-close-me" @click="closePop('veryNice', 'fade')"></i>
                <span class="tip">非常好</span>
                <img class="ani-img" src="../../../assets/img/rollcall/img_icon_verynice.png" alt="">
                <p class="desc">回答的非常好
                    <br/>此处应该有掌声 ~</p>
            </div>
	       
			
			<!-- nice -->
            <div class="x-pop bg_content" id="Nice">
                <i class="icon-close-me"  @click="closePop('Nice', 'fade')"></i>
                <span class="tip">较好</span>
                <img class="ani-img" src="../../../assets/img/rollcall/img_icon_nice.png" alt="">
                <p class="desc">回答的还可以<br/>下次要继续加油哦 ~</p>
            </div>
	       
			<!-- soso -->
            <div class="x-pop bg_content" id="Soso">
                <i class="icon-close-me"  @click="closePop('Soso', 'fade')"></i>
                <span class="tip">一般</span>
                <img class="ani-img" src="../../../assets/img/rollcall/img_icon_soso.png" alt="">
                <p class="desc">加把劲儿<br/>老师知道你有潜力 ~</p>
            </div>			
			<!-- absent -->
            <div class="x-pop bg_content" id="Absent" >
                <i class="icon-close-me"  @click="closePop('Absent', 'fade')"></i>
                <span class="tip">缺席</span>
                <img class="ani-img" src="../../../assets/img/rollcall/img_icon_duty.png" alt="">
                <p class="desc">老师和全班同学<br/>&nbsp;&nbsp;&nbsp;呼喊你回到课堂！</p>
            </div>
	        
	    </section>
		
		<!-- 浏览器提示 -->
	    <div id="checkBrowser" style="display:none" class="bb">
			<div class="sign_check_bowser"></div>
			<div class = "sign_check_tips">
				<div>为了能达到最佳的显示效果，强烈建议您使用Chrome浏览器来查看此页面。</div>
				<div class="sign_google"><a href="http://w.x.baidu.com/alading/anquan_soft_down_ub/14744"><img src="../../../assets/img/common/sign_google.png"/></a></div>
			</div>
		</div>
		<!-- /浏览器提示 -->
	</div>
</template>
<script>
	import $ from 'jquery'
	import swiper from 'swiper'
	import interact from 'model/clazz/interact'

	export default {
		data () {
			return {
				mySwiper: '',
				userId:'',
				stuList: [],	//学生列表
				headpic: "",		//头像

				options: [{
		          value: 'already',
		          label: '已登录学员'
		        }, {
		          value: 'all',
		          label: '所有学员'
		        }],
        		value: '',
        		usedAppUsers:[],
        		allUsers:[]

				
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			}
		},
		created() {
			this.checkBrowser();
		},
		mounted() {
			let clientH = $(window).height();
			let h =  $("#wInteractFull").height(clientH);

			this.getStudent();

			// go
			$("#ani").on('click', '.go', this.goFn);
			// stop
			$("#ani").on('click', '.stop', this.stopFn);

			
			
			
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
			randomsort(a,b){
				return Math.random() > 0.5 ? -1 : 1;
			},

			getStudent() {
				// let data = {
				// 	clazzId: this.clazzId
				// }
				// interact.studentList(data, (res => {
				// 	// console.log("学生列表",res);
				// 	if(res.status == 200) {
						
				// 		this.stuList = res.data.sort(this.randomsort);

				// 		// 设置随机头像
				// 		// let rand = Math.floor(Math.random()*10+1);
				// 		// this.headpic = '../../../assets/img/rollcall/pic'+rand+'.png';

				// 		// console.log("随机排序",this.stuList);

						
				// 	} else {
				// 		this.$message.error(res.message);
				// 	}
				// }));
			},
			change(type){

				this.stuList = [];

				if($(".corner").length > 0){
					$(".corner").remove();
				}

				//已登录学员
				if(type == "already"){

					if(this.usedAppUsers.length > 0){
						console.log(this.usedAppUsers);
						this.stuList = this.usedAppUsers;
					}
					console.log("已登录学员");
					console.log(this.stuList);
					

				//全员
				}else{

					this.stuList = this.allUsers;
					console.log("所有学员");
					console.log(this.stuList);
					
				}

			},
			getStudent(){
				let data = {
					clazzId:this.clazzId
				}
				interact.rollCallAllStudentList(data, (res => {
					if(res.status == 200){

						if(res.data.usedAppUsers){
							this.usedAppUsers = res.data.usedAppUsers;
						}

						this.allUsers = res.data.allUsers;

						//console.log(usedAppUsers.length);
						if(this.usedAppUsers.length >= 5){

							this.stuList = this.usedAppUsers.sort(this.randomsort);

							console.log("已登录学员length" + this.stuList.length);

							
							let span = "<span class='corner'></span>";
							$(".el-select-dropdown__item").eq(0).find("span").after(span);

						//已登录 < 5 显示全部学员
						}else{

							this.stuList = this.allUsers.sort(this.randomsort);
							//console.log("全部学员");
							console.log("全部学员length" + this.stuList.length);

							let span = "<span class='corner'></span>";
							$(".el-select-dropdown__item").eq(1).find("span").after(span);
						}


					}else{
						this.$message.error(res.message);
					}
				}))
			},


			rollFn() {
				this.stuList = this.stuList.sort(this.randomsort);
				console.log("this-stuList ",this.stuList);
				let _this = this;
				this.mySwiper = new Swiper('.swiper-container', {
					direction: 'vertical',
					autoplay: 90,
					speed: 5,
					loop:true,
					onSlideChangeStart: function(swiper){
						$('#ani .roll li:eq('+[swiper.activeIndex]+')').addClass('active').siblings().removeClass('active');
						$('#ani .swiper-wrapper').find('.swiper-slide-prev').addClass('prev').siblings().removeClass('prev');
					},
					
				});
				this.mySwiper.container[0].style.height='220px';
			},
			goFn () {
				if(this.stuList.length < 5) {
					this.$message.error("班级成员过少，不能点名");
					return false;
				}
				var _this = this;
				$('#ani .ques-box').hide();
				$('#ani .roll-box').show();
				$("#goStop").removeClass('go').addClass("stop");

				this.rollFn();
			},
			stopFn (){
				var _this = this;
				// stop 动画
				this.mySwiper.stopAutoplay(); 
				$(".x-page2").show();
				$("#ani .x-page1").removeClass('show').addClass('hide');
				$("#ani .x-page2").addClass('active');
				// 获取当前用户
				var index = this.mySwiper.activeIndex;
				var active = $("#roll li").eq(index);
				var name = active.html();
				var img = active.attr('data-headpic');

				this.userId = active.attr('data-userId');
				if(img) {
					$("#details .headpic").attr('src',img);
				}
				
				$("#details .check-name").html(name);
			},
			evalFn (event,str){
				let data = {
					result:str,
					userId:this.userId,
					clazzId: this.clazzId
				};

				// console.log("数据 ", data);
					
				interact.rollCallSave(data, (res => {
					// console.log("保存评价",res);
					if(res.status == 200) {
						switch (str) 
						{
							case "A":
								this.showPop('veryNice', 'fade');
								break;
							case "B":
								this.showPop('Nice', 'fade');
								break;
							case "C":
								this.showPop('Soso', 'fade');
								break;
							case "D":
								this.showPop('Absent', 'fade');
								break;
						}
						
					} else {
						this.$message.error(res.message);
					}
				}));

			},
			
			againFn () {
				// 从来
				$("#ani .x-page1").removeClass('hide').addClass('show');
				$(".x-page2").hide();
				$("#ani .x-page2").removeClass('active');
				$("#goStop").removeClass("stop").addClass("go");
				this.goFn();
				
			},
			showPop(show_div,bg_div) {
				document.getElementById(show_div).style.display='block';
				document.getElementById(bg_div).style.display='block' ;
				var bgdiv = document.getElementById(bg_div);
				bgdiv.style.width = document.body.scrollWidth; 
				
				$("#"+bg_div).height($(document).height());
			},
			closePop(show_div,bg_div) {
				document.getElementById(show_div).style.display='none';
  				document.getElementById(bg_div).style.display='none';

  				// 从来
				$("#ani .x-page1").removeClass('hide').addClass('show');
				$(".x-page2").hide();
				$("#ani .x-page2").removeClass('active');
				$("#goStop").removeClass("stop").addClass("go");
				$('#ani .ques-box').show();
				$('#ani .roll-box').hide();
			}

		}
	}
</script>