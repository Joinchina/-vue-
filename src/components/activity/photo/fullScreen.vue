<style scoped lang="less">
  @import '../../../../node_modules/swiper/dist/css/swiper.min.css';
  @import "../../../assets/less/activity";
  html, body {
    position: relative!important;
    height: 100%;
    background: #000!important;
  }
  body {
    font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    margin: 0;
    padding: 0;
    position: relative!important;
  }
  .swiper-wrapper{
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    height: 100%!important;
  }
  .swiper-container {
    width: 100%;
    height: 100%;
  }
  .swiper-slide {
    text-align: center;
    font-size: 18px;
    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    //height:800px;
    /*height: auto!important;*/
  }
</style>

<template>
	<div class="photofull" style="background: #000!important;">
    <header class="header">
      <Goback passtitle="照片大屏幕" path="/activity/photo/view" :query="query"></Goback>
      <div class="name" style="padding-left:55px;line-height:73px;margin-top:5px;">
        <img alt="" class="avatar"><span class="names"></span>
      </div>
      <a href="javascript:;" style="cursor:default" class="praise"></a>
      <div class="title ani bounceInLeft animated" title=""></div>
    </header>
    <div class="page-container" style="width:100%;height:100%;">
      <!-- BEGIN CONTENT -->
      <div class="page-content-wrapper" style="width:100%;height:100%;">
        <!-- BEGIN CONTENT BODY -->
        <div id="photowall_photo_full" style="margin-top:79px;">
          <!-- swiper_start -->
          <div class="swiper-container" id = "picwall">
            <div class="swiper-wrapper">
              <div class="swiper-slide"  v-for="(item,index) in datasRows">
                <img :src = "item.url" class = "imageFullScreen"/>
                <!--<img src="../../../assets/img/activity/big.png" :width="imgWidths" :height="imgHeights">-->
                <!--<input type = "hidden" :value = "item.content" class="content_h"/>-->
                <!--<input type = "hidden" :value = "item.likeCount" class="praise_h"/>-->
                <!--<input type = "hidden" :value = "item.avatar" class="avatar_h"/>-->
                <!--<input type = "hidden" :value = "item.name" class="name_h"/>-->
              </div>

            </div>
            <!--footer_start-->
            <div class="footer">
              <a href="javascript:void(0)" class="prev"></a>
              <a href="javascript:void(0)" class="next"></a>
              <!--<a href="javascript:void(0)" class="enlarge" id="zoomInButton"></a>-->
              <a href="javascript:void(0)" class="play" style="margin-left: 90px;"></a>
              <!--<a href="javascript:void(0)" class="narrow"  id ="zoomOutButton"></a>-->
            </div>
            <!--footer_end-->
          </div>
          <!-- swiper_end -->
        </div>
      </div>
    </div>
    <div id="checkBrowser" class="bb" v-show="browserFlag">
      <div class="sign_check_bowser"></div>
      <div class = "sign_check_tips">
        <div>为了能达到最佳的显示效果，强烈建议您使用Chrome浏览器来查看此页面。</div>
        <div class="sign_google"><a href="http://w.x.baidu.com/alading/anquan_soft_down_ub/14744"><img src="../../../assets/img/photowall_photo_full/sign_google.png"/></a></div>
      </div>
    </div>
	</div>
</template>
<script>
  import model from 'model/activity/photo';
  import {isChromeCheck} from '../../../global/open';
  import swiperSlide from 'components/activity/photo/swiperSilder';
//  import '../../../global/e-smart-zoom-jquery';
  import swiper from 'swiper'
  import Goback from 'base/goback/goback'

	export default {
	   data(){
	     return{
         activityId:"",
         clazzId:"",
         courseId:"",
         browserFlag:false,
         datasRows:[],
         datas:[],
         imageFullScreen:"imageFullScreen",
         rows:2,
         records:0,
         page:1,
         num:0,
         sort:"",
         onlyone:false,
         //播放最后一张循环播放
         flagauto:false,

         query:{}
       }
     },
      created(){
	      this.clazzId = this.$route.query.clazzId;
	      this.courseId = this.$route.query.courseId;
        this.activityId = this.$route.query.activityId;
        this.sort = this.$route.query.sort;
        this.browserFlag = isChromeCheck(this.browserFlag);
        this.getData();
        this.imgWidth(0);

      },
    mounted:function(){
      this.query = {
        clazzId: this.clazzId,
        course: this.coursem,
        activity: this.activity
      }
      var _this = this;
      _this.$nextTick(function(){
        _this.swiperM();
      })
    },
      methods:{
        imgWidth(index){

        },
        goBack(){
              this.$router.push({path:"/activity/photo/view?clazzId="+this.clazzId+"&courseId="+this.courseId+"&activityId="+this.activityId+"&crumb=time"})

        },
        getData(){
          var data = {
            activityId:this.activityId,
            sort:"time",
            number:this.page,
            size:this.rows
          }
          model.getPhotoList(data, ( res => {
            if(res.status == 200){
              var data = res.data;
              this.datas = data;
              this.datasRows = data.content;
              //只有一张图片进行提示
              if(this.datasRows.length == 1){
                this.onlyone = true;
              }
              this.records = data.totalElements;
            }else{
              this.$message.error(res.message)
            }

          }))
        },
        swiperM(){
          var _this = this;
          var swiperObj = new Swiper('.swiper-container', {
            pagination: 'null',
            paginationClickable: '.swiper-pagination',
            nextButton: '.next',
            prevButton: '.prev',
            spaceBetween: 30,
            onlyExternal:true,
            autoplay : 3000,
            followFinger:false,
            observer:true,
            observeParents:true,
            onSlideChangeEnd: function(meSwiper){
              //最后一张
              if(meSwiper.isEnd) {
              }else if(meSwiper.isBeginning){
                //alert("第一张");
              }
            },
            onInit:function(swiper){
              //获取图片的值
              setTimeout(function(){
               // _this.zooms();
                _this.headContent(swiper.activeIndex);
                _this.imgWidth(0);
              },300)
            },
            onSlideChangeStart:function(swiper){
              //改变头部
              _this.headContent(swiper.activeIndex);
              _this.imgWidth(swiper.activeIndex);
//              _this.zooms();
//              var index = swiper.activeIndex;
//              $('#zoomInButton,#zoomOutButton').unbind("click").bind("click", function(e){
//                var scaleToAdd = 0.5;
//                //放大缩小
//                if(e.target.id == 'zoomOutButton')
//                  scaleToAdd = -scaleToAdd;
//                $('.imageFullScreen:eq('+index+')').smartZoom('zoom',scaleToAdd);
//              });
            },
            //自动切换开始
            onAutoplay: function(swiper){
              var activeIndex = swiper.activeIndex;
              //加载数据到满足rows进行加载数据
              if(_this.num < (_this.records-1)){
                if(_this.num == ((_this.rows*_this.page)-2)){
                  _this.page++;
                  _this.getPageData(_this,_this.page)
                }
              }

              _this.num++;
              //console.log("auto" + (_this.num));
              //自动播放判断最后一张放到底端，执行少一次
              if(_this.num == (_this.records-1)){
                swiper.stopAutoplay();
                if(window.toastr){
                  window.toastr.error("已经是最后一张了");
                }
                $(".stop").addClass("play");
                $(".stop").removeClass("stop");
                _this.flagauto = true;
              }

            }



          })
          swiperObj.stopAutoplay();
          _this.next(swiperObj);
          _this.prev(swiperObj);
          _this.play(swiperObj);
          _this.stop(swiperObj);
        },
        prev:function(swiper){
          var _this= this;
          $(".prev").unbind("click").bind("click",function(){
            //只有一张图片提示无法播放
            _this.flagauto = false;
            if(_this.onlyone){
              _this.$message.info("只有一张图片");
              return;
            }
            if(_this.num == 0 ){
              console.log("图片第一张了");
              return;
            }
            _this.num--;
            //console.log("jian" +　_this.num);
          })
        },
        play:function(swiper){

          var _this = this;
          $("#picwall").off("click",".play").on('click',".play",function(){
            if(_this.flagauto){
              _this.num = -1;
              _this.flagauto = false;
            }
            //只有一张图片提示无法播放

            if(_this.onlyone){
              _this.$message.info("只有一张图片");
              return;
            }
            //开始轮播
            swiper.startAutoplay();
            $(this).removeClass("play");
            $(this).addClass("stop");

          })
        },
        stop:function(swiper){
          $("#picwall").off("click",".stop").on('click',".stop",function(){
            swiper.stopAutoplay();
            $(this).removeClass("stop");
            $(this).addClass("play");
          })
        },
        //放大缩小效果
//        zooms:function(_this){
//          var imageFullScreen = $(".imageFullScreen");
//          imageFullScreen.each(function(){
//            $(this).smartZoom({
//              'containerClass':'zoomableContainer',
//              initCallback:function(){
//                $(".zoomableContainer").css({
//                  "overflow":"visible"
//                })
//              }
//            });
//          })
//        },
        headContent:function(index){
          var _this = this;
          var title = $(".content_h:eq("+index+")").val();
          var praise = $(".praise_h:eq("+index+")").val();
          var avatar = $(".avatar_h:eq("+index+")").val();
          var name = $(".name_h:eq("+index+")").val();
          if(avatar == ""){
           // console.log(_this.imgSrc)
            $(".avatar").attr("src","/static/img/example2.png");
          }else{
            $(".avatar").attr("src",avatar)
          }
          if(title != "" && title != undefined ||praise != "" && praise != undefined || avatar != "" && avatar != undefined || name != "" && name != undefined){
            $(".title").text(title);
            $(".title").attr("title",title)
            $(".praise").text(praise);
            $(".names").text(name);

          }


        },
        next:function(swiper){
          var _this= this;
          $(".next").unbind("click").bind("click",function(){
            _this.flagauto = false;
            //只有一张图片提示无法播放
            if(_this.onlyone){
              _this.$message.info("只有一张图片");
              return;
            }

            //头部改变数值
            _this.headContent();

            //最后一张图片提示;
            if(_this.num == (_this.records-1)){
              swiper.stopAutoplay();
              _this.$message.info('已经是最后一张了');
              $(".stop").addClass("play");
              $(".stop").removeClass("stop");
              _this.flagauto = true;
              return;
            }
            if(_this.num < _this.records-1){
              //向后台请求
              if(_this.num == ((_this.rows*_this.page)-2)){
                _this.page++;
                _this.getPageData(_this,_this.page);


              }
            }
            _this.num++;
            //console.log("right"+"num" + _this.num + "records" + (_this.records-1));

          })
        },
        getPageData(_this,page){
          var sortTime = _this.$route.query.sort;
          var data = {
            activityId:_this.activityId,
            sort:sortTime,
            number:page,
            size:_this.rows
          }
          model.getPhotoList(data, ( res => {
            if(res.status == 200){
              var data = res.data.content;
              for(var i=0;i<data.length;i++){
                _this.datasRows.push(data[i]);
              }
              //更新数据
              swiper.update(true);
            }else{
              this.$message.error(res.message)
            }

          }))
        },
      },

      components:{
        swiperSlide,
        Goback
      }
	}
</script>
<style type="text/css" lang="less">
  @import "../../../assets/reset-element-ui/form.css";
  #photowall_photo_full{
    background: #000!important;
  }
  html,body{
    background: #000!important;
  }
  /*.swiper-slide{*/
    /*align-items:center!important;*/
    /*justify-content:center!important;*/
    /*-webkit-box-align:center!important;*/
  /*}*/
  .swiper-slide{

    justify-content: center!important;
  }
</style>
