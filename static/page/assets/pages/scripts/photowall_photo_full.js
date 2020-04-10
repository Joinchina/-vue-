var utl = api()+"/photowall/getPictureList";
var datas = [];
var datasRows = [];
var imageFullScreen = "imageFullScreen";
var rows = 20;
var records = 0;
var page = 1;
var num = 0;
var onlyone = false;
var flagauto = false;
var ceshi = ["aa","bb","cc"];
var clazzId = $.fn.splitSearchMethod()["clazzId"];
var courseId = $.fn.splitSearchMethod()["courseId"];
var activityId = $.fn.splitSearchMethod()["activityId"];
var sortTime = $.fn.splitSearchMethod()["sort"];
var csrf_token = $.fn.splitSearchMethod()["token"];

var obj = {
  InitPhotoWall(){
    //初始化数据
    obj.getData();

  },
  getData(){
    $.ajax({
      url:api()+"/photowall/getPictureList",
      method:"get",
      data:{
        number:page,
        size:rows,
        activityId:activityId,
        sort:sortTime
      },
      headers: {
        "Authorization":csrf_token
      },
      dataType:"json",
      success:function(res){
        if(res.status == 200){
          var data = res.data;
          datas = data;
          datasRows = res.data.content;

          //初始化图片
          obj.swiperSlideInt(res.data.content);
          obj.swiperPlugins();

          //_this.checkbrower();
          //只有一张图片进行提示
          if(datasRows.length == 1){
           var onlyone = true;
          }
          records = data.totalElements;
        }else {
          window.toastr.error(res.message);
        }
      }
    })
  },
  swiperPlugins(){
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
        var index = swiper.activeIndex;

        $('#zoomInButton,#zoomOutButton').unbind("click").bind("click", function(e){
          var scaleToAdd = 0.5;
          //放大
          if(e.target.id == 'zoomOutButton')
            scaleToAdd = -scaleToAdd;
          $('.imageFullScreen:eq('+index+')').smartZoom('zoom',scaleToAdd);
        });

        //获取图片的值
        setTimeout(function(){
          obj.zooms();
          obj.headContent(swiper.activeIndex);
        },300)
      },
      onSlideChangeStart:function(swiper){
        //改变头部
        obj.headContent(swiper.activeIndex);
        obj.zooms();
        var index = swiper.activeIndex;
        $('#zoomInButton,#zoomOutButton').unbind("click").bind("click", function(e){
          var scaleToAdd = 0.5;
          //放大缩小
          if(e.target.id == 'zoomOutButton')
            scaleToAdd = -scaleToAdd;
          $('.imageFullScreen:eq('+index+')').smartZoom('zoom',scaleToAdd);
        });
      },
      //自动切换开始
      onAutoplay: function(swiper){
        var activeIndex = swiper.activeIndex;
        var activityId = $.fn.splitSearchMethod()["activityId"];
        var sortTime = $.fn.splitSearchMethod()["sort"];
        var csrf_token = $.fn.splitSearchMethod()["token"];
        //加载数据到满足rows进行加载数据
        if(num < (records-1)){
          if(num == ((rows*page)-2)){
            page++;
            $.ajax({
              url: api() + "/photowall/getPictureList",
              method: "get",
              data: {
                number: page,
                size: rows,
                activityId: activityId,
                sort: sortTime
              },
              headers: {
                "Authorization": csrf_token
              },
              dataType:"json",
              success:function(res) {
                if (res.status == 200) {
                  //获取imgurl数组
                  datasRows = [];
                  var data = res.data.content;
                  for(var i=0;i<data.length;i++){
                     datasRows.push(data[i]);
                  }
                  //更新数据
                  swiper.update(true);
                  obj.swiperSlideInt(datasRows);

                } else {
                  window.toastr.error(res.message);
                }
              }
            })
          }
        }

        num++;
        //自动播放判断最后一张放到底端，执行少一次
        //console.log("zidong" + "num" + num  + "records" + (records-1));
        if(num == (records-1)){
          swiper.stopAutoplay();
          if(window.toastr){
            window.toastr.error("已经是最后一张了");
            swiper.startAutoplay();
            num = -1;
          }
          $(".stop").addClass("stop");
          $(".stop").removeClass("play");
          flagauto = true;
        }

      }

    })
    swiperObj.stopAutoplay();
    obj.next(swiperObj);
    obj.prev(swiperObj);
    obj.play(swiperObj);
    obj.stop(swiperObj);
  },
  headContent:function(index){
    var title = $(".content_h:eq("+index+")").val();
    var praise = $(".praise_h:eq("+index+")").val();
    var avatar = $(".avatar_h:eq("+index+")").val();
    var name = $(".name_h:eq("+index+")").val();
    if(avatar == ""){
     // console.log("默认")
      $(".avatar").attr("src","/static/page/assets/pages/img/photowall_photo_full/pic10.png");
    }else{
     // console.log("diannao")
      $(".avatar").attr("src",avatar)
    }
    // if(avatar !== undefined && avatar !== ""){
    //   $(".avatar").attr("src",avatar)
    // }else{
    //   $(".avatar").attr("src","assets/pages/img/photowall_photo_full/pic10.png");
    // }
    if(title != "" && title != undefined ||praise != "" && praise != undefined || avatar != "" && avatar != undefined || name != "" && name != undefined){
      $(".title").text(title);
      $(".title").attr("title",title)
      $(".praise").text(praise);
      $(".names").text(name);

    }


  },
  next:function(swiper){
    $(".next").unbind("click").bind("click",function(){
      flagauto = false;
      //只有一张图片提示无法播放
      if(onlyone){
        if(window.toastr){
          window.toastr.error("只有一张图片");
        }
        return;
      }

      //头部改变数值
      //obj.headContent();

      //最后一张图片提示;
      if(num == (records-1)){
        swiper.stopAutoplay();
        if(window.toastr){
          window.toastr.error("已经是最后一张了");
        }
        $(".stop").addClass("play");
        $(".stop").removeClass("stop");
        flagauto = true;
        return;
      }
      if(num < records-1){
        //向后台请求
        if(num == ((rows*page)-2)){
          page++;
          $.ajax({
            url: api() + "/photowall/getPictureList",
            method: "get",
            data: {
              number: page,
              size: rows,
              activityId: activityId,
              sort: sortTime
            },
            headers: {
              "Authorization": csrf_token
            },
            dataType:"json",
            success:function(res) {
              if (res.status == 200) {
                datasRows = [];
                //获取imgurl数组
                var data = res.data.content;
                for(var i=0;i<data.length;i++){
                  datasRows.push(data[i]);
                }
                //更新数据
                swiper.update(true);
                obj.swiperSlideInt(datasRows);
              } else {
                window.toastr.error(res.message);
              }
            }
          })
        }
      }
      num++;
      //console.log("right"+"num" + _this.num + "records" + (_this.records-1));

    })
  },
  prev:function(swiper){
    $(".prev").unbind("click").bind("click",function(){
      //只有一张图片提示无法播放
      flagauto = false;
      if(onlyone){
        if(window.toastr){
          window.toastr.error("只有一张图片");
        }
        return;
      }
      if(num == 0 ){
        console.log("图片第一张了");
        return;
      }
      num--;
      //console.log("jian" +　_this.num);
    })
  },
  play:function(swiper){
    $("#picwall").off("click",".play").on('click',".play",function(){
      if(flagauto){
        num = -1;
        flagauto = false;
      }
      //只有一张图片提示无法播放

      if(onlyone){
        if(window.toastr){
          window.toastr.error("只有一张图片");
        }
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
  zooms:function(_this){
    var imageFullScreen = $(".imageFullScreen");
    imageFullScreen.each(function(){
      $(this).smartZoom({
        'containerClass':'zoomableContainer',
        initCallback:function(){
          $(".zoomableContainer").css({
            "overflow":"visible"
          })
        }
      });
    })
  },
  swiperSlideInt(data){
    $(data).each(function (index,item) {
        var div = "<div class='swiper-slide'>";
        div += "<img src = '"+item.url+"' class = 'imageFullScreen'/>";
        div += "</div>";
        var  inputs = '<input type = "hidden" value = "'+item.content+'" class="content_h"/>';
          inputs+='<input type = "hidden" value = "'+item.likeCount+'" class="praise_h"/>';
          if(!!item.avatar){
            inputs+= '<input type = "hidden" value = "'+item.avatar+'" class="avatar_h"/>';
          }else {
            inputs+= '<input type = "hidden" value = "" class="avatar_h"/>';
          }

         inputs+='<input type = "hidden" value = "'+item.name+'" class="name_h"/>';
        $("#swiper-wrapper").append(div);
        $("#swiper-wrapper").append(inputs);
    })
  }
}
obj.InitPhotoWall();
function goBack() {
  window.location.href = devlopMent()+"/activity/photo/view?clazzId="+clazzId+"&courseId="+courseId+"&activityId="+activityId+"&crumb=task";
}

