<template>
  <div id="modelbox" v-show="showmodel">
      <div class="title">
        <span>{{title}}</span>
        <div class="headimg">
            <img :src="titleimg[realnum].avatar" alt="" v-if="titleimg[realnum].avatar">
            <img src="../../assets/img/common/avatar.png" alt="" v-else>
            <h1>{{titleimg[realnum].name}}</h1>
        </div>
      </div>
      <div class="viewshow">
        <ul>
          <li id="li" v-for="(img,index) in passimg" :key="index">
            <div id="imgbox" style="transition:width 0.2s,height 0.2s;">
              <img :src="img.url" @mousedown="opepicture($event,realnum)" alt=""  draggable="false" style="transition:width 0.2s,height 0.2s;">
              <div class="close" @click="close($event)"></div>
            </div>
          </li>
        </ul>
        
      </div>
      <div id="operation" :class="{setstyle : passimg.length==1}">
        <div id="leftimg" @click="leftbtn($event)" v-show="passimg.length!=1"><img src="static/page/assets/pages/img/imgmoudel/pic9.png" alt=""></div>
        <div id="bigimg" @click="setimgsize(realnum,'big',$event)"><img src="static/page/assets/pages/img/imgmoudel/pic4.png" alt=""></div>
        <div id="playimg" @click="playing($event)" v-if="!playpause"><img src="static/page/assets/pages/img/imgmoudel/pic3.png" alt=""></div>
        <div id="pause"  @click="pause($event)" v-else><img src="static/page/assets/pages/img/imgmoudel/pic5_stop.png" alt=""></div>
        <div id="smallimg" @click="setimgsize(realnum,'small',$event)"><img src="static/page/assets/pages/img/imgmoudel/pic6.png" alt=""></div>
        <div id="rightimg" @click="rightbtn($event)"  v-show="passimg.length!=1"><img src="static/page/assets/pages/img/imgmoudel/pic7.png" alt=""></div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cliheight: 0, //当前窗口的高
      cliwidth: 0, //当前窗口的宽
      realnum: 0, //点击的是第几个图片
      imgnumber: 0, //传递过来的图片数组
      timer: null, //定时器
      showmodel: false, //显示隐藏图层
      opepictureimg: false, //控制拖曳
      title: "默认图片标题",
      headname: "默认", //头像名
      playpause: false, //播放暂停的显示隐藏
      closeimgwidth: 0, //缩放时同步图片宽
      closeimgheight: 0, //缩放时同步图片高
      titleimg:[
        {avatar:"默认",name:"默认"}
      ],
      
    };
  },
  watch:{
    passimg:{
      handler(val, oldVal) {
        // console.log(val)
        // this.setimg(this.realnum)  
      },
      deep: true
    }
  },
  props: {
    passimg: {
      type: Array,
      required: true,
      default: []
    },
  },
  mounted() {
    clearInterval(this.timer);
  },
  // 点击空白区域关闭弹窗
  beforeUpdate() {
    document.onclick = event => {
      event = event || window.event;
      if (event && event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      var db = event.target || event.srcElement;
      if (db.id === "li") {
        this.showmodel = false;
        clearInterval(this.timer);
      }
    };
    // 监控当前窗口是否发生了变化如果变化则改变图片位置
    this.change();
  },
  distroyed() {
    clearInterval(this.timer);
    window.removeEventListener("resize",this.size);
  },
  methods: {
    change(){
      window.addEventListener("resize",this.size);
      this.size=()=>{
          this.setimg(this.realnum);
      }
    },
    getpassindex(n) {
      this.realnum = n;
      this.showmodel = true;
      this.titleimg=this.passimg;
      this.setimg(n);
    },
    setimg(n) {
      // 获取当前窗口的宽高
      let scheight = document.documentElement.clientHeight;
      let scwidth = document.documentElement.clientWidth;
      // 设置当前ul的宽高
      let ulArr = document.getElementsByClassName("viewshow")[0].children[0];
      ulArr.style.width = scwidth * (this.passimg.length + 1) + "px";
      ulArr.style.height = scheight + "px";
      //设置当前li的宽高
      let liArr = ulArr.children;
      for (let i = 0; i < liArr.length; i++) {
        liArr[i].style.height = scheight + "px";
        liArr[i].style.width = scwidth + "px";
      }
      //点击父组件时显示对应的图片并且设置当前img的index
      ulArr.style.transform = "translateX(" + -scwidth * this.realnum + "px)";
      // 设置当前图片的宽度及高度用来去除图片过去时的bug
      let imgbox = liArr[n].children[0];
      let imgli = imgbox.children[0];
      let imgbigwidth = imgli.width;
      let imgbigheight = imgli.height;
      //同步数组
      this.imgnumber = this.passimg; //传递过来的图片数组
      this.cliwidth = scwidth; //设置宽度
      this.cliheight = scheight; //设置高度
      this.realnum = n; //点击的图片是第几个
      this.title = this.passimg[n].content; //显示图片名字
      //如果当前图片的宽高大于可视区的宽高则重置宽高，宽固定，高等比
      // console.log(imgbigwidth)
      // console.log(imgbigheight)
      // console.log(this.cliwidth)
      // console.log(this.cliheight)
      if (imgbigwidth >= this.cliwidth) {
        imgli.style.width = 786 + "px";
        this.closeimgwidth = 786;
        //获取缩放比例
        let bi = imgbigwidth / 786;
        //等比例设置高
        imgli.style.height = imgbigheight / bi + "px";
        this.closeimgheight = imgbigheight / bi;
      } else {
        imgli.style.width = imgbigwidth + "px";
        imgli.style.height = imgbigheight + "px";
        this.closeimgwidth = imgbigwidth;
        this.closeimgheight = imgbigheight;
      }
      //  设置imgbox盒子的宽高
      imgbox.style.width = this.closeimgwidth + "px";
      imgbox.style.height = this.closeimgheight + "px";
      //启动滚轮缩放
      this.wheelimg(this.realnum);
    },
    // 左右滑动的实现
    leftbtn(event) {
      //取消冒泡
      event = event || window.event;
      if (event && event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      //不管定时器是否运行，先清除定时器
      clearInterval(this.timer);
      this.playpause = false;
      let ulArr = document.getElementsByClassName("viewshow")[0].children[0];
      this.realnum--;
      if (this.realnum < 0) {
        this.$message({
          message: "已经是第一张图片了！",
          type: "warning"
        });
        this.realnum = 0;
      }
      let liArr = ulArr.children;
      let imgbox = liArr[this.realnum].children[0];
      let imgli = imgbox.children[0];
      let imgbigwidth = imgli.width;
      let imgbigheight = imgli.height;
      //如果当前图片的宽高大于可视区的宽高则重置宽高，宽固定，高等比
      if (imgbigwidth >= this.cliwidth) {
        imgli.style.width = 786 + "px";
        this.closeimgwidth = 786;
        //获取缩放比例
        let bi = imgbigwidth / 786;
        //等比例设置高
        imgli.style.height = imgbigheight / bi + "px";
        this.closeimgheight = imgbigheight / bi;
      } else {
        imgli.style.width = imgbigwidth + "px";
        imgli.style.height = imgbigheight + "px";
        this.closeimgwidth = imgbigwidth;
        this.closeimgheight = imgbigheight;
      }
      //  设置imgbox盒子的宽高
      imgbox.style.width = this.closeimgwidth + "px";
      imgbox.style.height = this.closeimgheight + "px";
      // 执行一次居中
      imgbox.style.position = "absolute";
      imgbox.style.top = 50 + "%";
      imgbox.style.left = 50 + "%";
      //切换图片
      ulArr.style.transition = "all 0.3s";
      ulArr.style.transform =
        "translateX(" + -this.cliwidth * this.realnum + "px)";
      this.title = this.imgnumber[this.realnum].content; //显示图片名字
      this.wheelimg(this.realnum);
    },
    rightbtn(event) {
      //取消冒泡
      event = event || window.event;
      if (event && event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      //不管定时器是否运行，先清除定时器
      clearInterval(this.timer);
      this.playpause = false;
      let ulArr = document.getElementsByClassName("viewshow")[0].children[0];
      this.realnum++;
      if (this.realnum > this.imgnumber.length - 1) {
        this.$message({
          message: "已经是最后一张图片了！",
          type: "warning"
        });
        this.realnum = this.imgnumber.length - 1;
      }
      let liArr = ulArr.children;
      let imgbox = liArr[this.realnum].children[0];
      let imgli = imgbox.children[0];
      let imgbigwidth = imgli.width;
      let imgbigheight = imgli.height;
      //如果当前图片的宽高大于可视区的宽高则重置宽高，宽固定，高等比
      if (imgbigwidth >= this.cliwidth) {
        imgli.style.width = 786 + "px";
        this.closeimgwidth = 786;
        //获取缩放比例
        let bi = imgbigwidth / 786;
        //等比例设置高
        imgli.style.height = imgbigheight / bi + "px";
        this.closeimgheight = imgbigheight / bi;
      } else {
        imgli.style.width = imgbigwidth + "px";
        imgli.style.height = imgbigheight + "px";
        this.closeimgwidth = imgbigwidth;
        this.closeimgheight = imgbigheight;
      }
      //  设置imgbox盒子的宽高
      imgbox.style.width = this.closeimgwidth + "px";
      imgbox.style.height = this.closeimgheight + "px";
      //执行一次居中
      imgbox.style.position = "absolute";
      imgbox.style.top = 50 + "%";
      imgbox.style.left = 50 + "%";
      //切换图片
      ulArr.style.transition = "all 0.3s";
      ulArr.style.transform =
        "translateX(" + -this.cliwidth * this.realnum + "px)";
      this.title = this.imgnumber[this.realnum].content; //显示图片名字
      this.wheelimg(this.realnum);
    },
    // 图片拖曳
    opepicture(event, n) {
      event = event || window.event;
      if (event && event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      // 先清掉定时器
      clearInterval(this.timer);
      this.playpause = false;

      let ulArr = document.getElementsByClassName("viewshow")[0].children[0]; // ul
      let liArr = ulArr.children[n]; //li数组
      let imgbox = liArr.children[0]; //第几个li
      let img = imgbox.children[0];

      let imgleft = imgbox.offsetLeft;
      let imgtop = imgbox.offsetTop;
      // 获取当前图片的大小和父盒子的宽高
      let imgwidth = imgbox.offsetWidth;
      let imgheight = imgbox.offsetHeight;
      let liwidth = liArr.offsetWidth;
      let liheight = liArr.offsetHeight;
      //获取当前走动的距离
      let xjl;
      let yjl;
      let x = event.pageX - imgleft;
      let y = event.pageY - imgtop;
      let close = document.getElementsByClassName("close")[n]; //
      document.onmousemove = function(event) {
        event = event || window.event;
        let xx = event.pageX;
        let yy = event.pageY;
        //二次操作鼠标位置  减去鼠标在盒子中的坐标
        xjl = xx - x;
        yjl = yy - y;
        //赋值
        //如果图片宽小于可视区宽且高大于可视区高只能上下拖曳
        if (imgwidth < liwidth && imgheight > liheight) {
          imgbox.style.top = yjl + "px";
          imgbox.style.cursor = "move";
        }
        if (imgwidth > liwidth && imgheight < liheight) {
          imgbox.style.left = xjl + "px";
          imgbox.style.cursor = "move";
        }
        if (imgwidth > liwidth && imgheight > liheight) {
          imgbox.style.left = xjl + "px";
          imgbox.style.top = yjl + "px";
          imgbox.style.cursor = "move";
        }
        //禁止文本选中（选中后取消）
        window.getSelection
          ? window.getSelection().removeAllRanges()
          : document.selection.empty();
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        if (imgwidth > liwidth && imgheight > liheight) {
          if (xjl > imgwidth / 2) {
            imgbox.style.left = imgwidth / 2 + "px";
          }
          if (xjl < liwidth - imgwidth / 2) {
            imgbox.style.left = (liwidth - imgwidth / 2)-16 + "px";
          }
          if (yjl > imgheight / 2) {
            imgbox.style.top = imgheight / 2 + 94 + "px";
          }
          if (yjl < liheight - imgheight / 2) {
            imgbox.style.top = liheight - imgheight / 2 + "px";
          }
        }
        if (imgwidth > liwidth) {
          if (xjl > imgwidth / 2) {
            imgbox.style.left = imgwidth / 2 + "px";
          }
          if (xjl < liwidth - imgwidth / 2) {
            imgbox.style.left = (liwidth - imgwidth / 2)- 16+ "px";
          }
        }
        if (imgheight > liheight) {
          if (yjl > imgheight / 2) {
            imgbox.style.top = imgheight / 2 + 94 + "px";
          }
          if (yjl < liheight - imgheight / 2) {
            imgbox.style.top = liheight - imgheight / 2 + "px";
          }
        }
      };
      this.wheelimg(this.realnum);
    },
    // 图片的放大缩小
    setimgsize(n, q, event) {
      //取消冒泡
      event = event || window.event;
      if (event && event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      //不管定时器是否运行，先清除定时器
      clearInterval(this.timer);
      this.playpause = false;
      this.opepictureimg = true;
      let ulArr = document.getElementsByClassName("viewshow")[0].children[0]; // ul
      let liArr = ulArr.children[n]; //li数组
      let imgbox = liArr.children[0]; //第几个li
      let img = imgbox.children[0]; //图片
      let imgbigwidth = img.width;
      let imgbigheight = img.height;
      // 放大缩小的倍数
      if (q == "big") {
        //图片放大
        imgbox.style.width = imgbigwidth * 1.1 + "px";
        imgbox.style.height = imgbigheight * 1.1 + "px";
        img.style.width = imgbigwidth * 1.1 + "px";
        img.style.height = imgbigheight * 1.1 + "px";
        // console.log(li.style.width)
      } else {
        //图片缩小
        imgbox.style.width = imgbigwidth / 1.1 + "px";
        imgbox.style.height = imgbigheight / 1.1 + "px";
        img.style.width = imgbigwidth / 1.1 + "px";
        img.style.height = imgbigheight / 1.1 + "px";
      }
      imgbox.style.position = "absolute";
      imgbox.style.top = 50 + "%";
      imgbox.style.left = 50 + "%";
      this.wheelimg(this.realnum);
    },
    //播放暂停
    playing(event) {
      //取消冒泡
      event = event || window.event;
      if (event && event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      this.playpause = true;
      this.timer = setInterval(() => {
        let ulArr = document.getElementsByClassName("viewshow")[0].children[0];
        this.realnum++;
        if (this.realnum > this.imgnumber.length - 1) {
          this.realnum = 0;
        }
        let liArr = ulArr.children;
        let imgbox = liArr[this.realnum].children[0];
        let imgli = imgbox.children[0];
        let imgbigwidth = imgli.width;
        let imgbigheight = imgli.height;
        //如果当前图片的宽高大于可视区的宽高则重置宽高，宽固定，高等比
        if (imgbigwidth > this.cliwidth) {
          imgli.style.width = 786 + "px";
          this.closeimgwidth = 786;
          //获取缩放比例
          let bi = imgbigwidth / 786;
          //等比例设置高
          imgli.style.height = imgbigheight / bi + "px";
          this.closeimgheight = imgbigheight / bi;
        } else {
          imgli.style.width = imgbigwidth + "px";
          imgli.style.height = imgbigheight + "px";
          this.closeimgwidth = imgbigwidth;
          this.closeimgheight = imgbigheight;
        }
        //  设置imgbox盒子的宽高
        imgbox.style.width = this.closeimgwidth + "px";
        imgbox.style.height = this.closeimgheight + "px";
        ulArr.style.transition = "all 0.3s";
        ulArr.style.transform =
          "translateX(" + -this.cliwidth * this.realnum + "px)";
        this.title = this.imgnumber[this.realnum].content; //显示图片名字
        //执行一次居中
        imgbox.style.position = "absolute";
        imgbox.style.top = 50 + "%";
        imgbox.style.left = 50 + "%";
      }, 1000);
      this.wheelimg(this.realnum);
    },
    pause(event) {
      //取消冒泡
      event = event || window.event;
      if (event && event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      this.playpause = false;
      clearInterval(this.timer);
      this.wheelimg(this.realnum);
    },
    //监控鼠标的滚轮滚动滚轮时实现放大缩小
    wheelimg(n) {
      this.opepictureimg = true;

      let ulArr = document.getElementsByClassName("viewshow")[0].children[0]; // ul
      let liArr = ulArr.children[n]; //li数组
      let imgbox = liArr.children[0]; //第几个li
      let img = imgbox.children[0]; //图片
      let scrollFunc = e => {
        e = e || window.event;
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;
        if (e.wheelDelta) {
          //判断浏览器IE，谷歌滑轮事件
          if (e.wheelDelta > 0) {
            //当滑轮向上滚动时
            // alert("滑轮向上滚动");
            let imgbigwidth = img.width;
            let imgbigheight = img.height;

            //设置放大宽
            imgbox.style.width = imgbigwidth * 1.1 + "px";
            imgbox.style.height = imgbigheight * 1.1 + "px";
            img.style.width = imgbigwidth * 1.1 + "px";
            img.style.height = imgbigheight * 1.1 + "px";
          }
          if (e.wheelDelta < 0) {
            //当滑轮向下滚动时
            // alert("滑轮向下滚动");
            let imgbigwidth = img.width;
            let imgbigheight = img.height;

            //设置缩小
            imgbox.style.width = imgbigwidth / 1.1 + "px";
            imgbox.style.height = imgbigheight / 1.1 + "px";
            img.style.width = imgbigwidth / 1.1 + "px";
            img.style.height = imgbigheight / 1.1 + "px";
            //不管定时器是否运行，先清除定时器
          }
        } else if (e.detail) {
          //Firefox滑轮事件
          if (e.detail > 0) {
            //当滑轮向上滚动时
            // alert("滑轮向上滚动");
            let imgbigwidth = img.width;
            let imgbigheight = img.height;

            //设置放大宽
            imgbox.style.width = imgbigwidth * 1.1 + "px";
            imgbox.style.height = imgbigheight * 1.1 + "px";
            img.style.width = imgbigwidth * 1.1 + "px";
            img.style.height = imgbigheight * 1.1 + "px";
            //不管定时器是否运行，先清除定时
          }
          if (e.detail < 0) {
            //当滑轮向下滚动时
            // alert("滑轮向下滚动");
            let imgbigwidth = img.width;
            let imgbigheight = img.height;

            //设置缩小
            imgbox.style.width = imgbigwidth / 1.1 + "px";
            imgbox.style.height = imgbigheight / 1.1 + "px";
            img.style.width = imgbigwidth / 1.1 + "px";
            img.style.height = imgbigheight / 1.1 + "px";
          }
        }
        imgbox.style.position = "absolute";
        imgbox.style.top = 50 + "%";
        imgbox.style.left = 50 + "%";

        //不管定时器是否运行，先清除定时器
        this.pause();
      };
      //给页面绑定滑轮滚动事件
      if (document.addEventListener) {
        document.addEventListener("DOMMouseScroll", scrollFunc, false);
      }
      //添加滚动事件
      ulArr.onmousewheel = scrollFunc;
      // console.log("我是滚轮的"+n+'图片')
    },
    // 关闭模态框
    close(event) {
      //取消冒泡
      event = event || window.event;
      if (event && event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      this.showmodel = false;
      this.pause();
    }
  }
};
</script>

<style scoped>
#modelbox {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  animation: myopacity 1s;
}
.setstyle{
        width:328px!important;
        margin-left:-164px!important;
  }
@keyframes myopacity {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.title {
  position: absolute;
  width: 100%;
  height: 80px;
  text-align: center;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: #553f3a;
  border-bottom: 6px solid #fb8324;
}
.title span {
  text-align: center;
  font-size: 24px;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 80px;
}
#operation {
  position: absolute;
  width: 494px;
  height: 72px;
  left: 50%;
  bottom: 10%;
  margin-left: -247px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 72px;
}
#operation div {
  float: left;
  width: 32px;
  height: 32px;
  margin: 23px 0 0 57px;
}
#leftimg img {
  margin-top: 4px;
}
#rightimg img {
  margin-top: 4px;
}
.viewshow {
  width: 100%;
  height: 100%;
}
.viewshow ul {
  overflow: hidden;
  padding: 0;
  margin: 0;
}
.viewshow ul li {
  /* 动态设置li的宽高 */
  list-style-type: none;
  float: left;
  position: relative;
  overflow: hidden;
}
.viewshow ul li #imgbox {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* width: 300px;
height: 400px; */
}
.viewshow ul li img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
.viewshow ul li .close {
  position: absolute;
  top: -14px;
  right: -14px;
  background-image: url("../../../static/page/assets/pages/img/imgmoudel/icon-close.png");
  width: 28px;
  height: 28px;
}
.headimg {
  position: absolute;
  z-index: 2;
  top: 21px;
  right: 0;
  width: 150px;
  height: 45px;
}
.headimg img {
  width: 45px;
  height: 45px;
  border-radius: 45px;
  float: left;
}
.headimg h1 {
  font-size: 20px;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 44px;
  font-weight: normal;
  margin-left: 10px;
  width: 95px;
  overflow: hidden;
  float: right;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
