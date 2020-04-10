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
                <div class="detail_box">
                    <div class="leftbtn" @click="getleftwork">
                        <img src="../../../assets/img/homework/homework5.png" alt="">
                    </div>
                    <div class="center_content">
                        <div class="center_box" id="centerwheel">
                            <h1>{{homeworkitem.title}}</h1>
                            <p>
                               {{homeworkitem.content}}
                            </p>                            
                            <div class="imgbox">
                                <ul>
                                    <li v-for="(img,index) in homeworkitem.pictureList" :key="index" @click="showmodel(index)"><img :src="img.transUrl" alt=""></li>
                                </ul>                                
                            </div>
                            <div class="fujian">
                                <h2 v-show="homeworkattchurl!=undefined" v-for="(zy,index) in homeworkattchurl" :key="index" @click="getattr(zy)">附件：{{zy.linkUrl}}</h2>
                            </div>                            
                        </div>
                    </div>
                    <div class="rightbtn" @click="getrightwork">
                        <img src="../../../assets/img/homework/homework4.png" alt="">
                    </div>
                    <div class="rightnav">
                        <el-popover
                            placement="left-start"
                            width="300"
                            trigger="click"
                        >
                           <ul>
                               <li v-for="(item,index1) in pagedata" :key="index1" @click="getonehomework(item)">
                                   <h1>{{item.userName}}</h1>
                                   <p>{{item.content}}</p>
                               </li>                                
                           </ul>
                           <div class="pagination">
                                <el-pagination
                                        @current-change ="handleCurrentChange"
                                        layout="prev, pager, next"
                                        :page-size="5"
                                        :total="totalElement">
                                </el-pagination>
                            </div>
                           <img src="../../../assets/img/homework/homework3.png" alt="" slot="reference">
                        </el-popover>
                    </div>
                    <div class="rightimg" v-show="homeworkitem.scoreLevel">
                        <img src="../../../assets/img/homework/h1.png" alt="">
                        <span v-show="homeworkitem.scoreLevel=='A'">优秀</span>
                        <span v-show="homeworkitem.scoreLevel=='B'">较好</span>
                        <span v-show="homeworkitem.scoreLevel=='C'">及格</span>
                        <span v-show="homeworkitem.scoreLevel=='D'">不及格</span>
                    </div>
                </div>
            </div>         
        </section>
        <imgview :passimg="passimg" ref="number"></imgview>
    </div>    
</template>
<script>
import work from 'model/activity/homework'
import imgview from 'base/modal/imgview'
export default {
    data () {
        return {
            allscreen:true,
            totalElement:0,
            totalPage:0,
            pagedata:[],
            number:1,
            homeworkitem:{},
            passimg:[],
            homeworkattchurl:'',            
        }
    },
    filters:{
        attch:function(val){
            if(!val){
                return '没有附件'
            }else{
                return val[0].name
            }
        },
    },
    computed:{
        activityId(){
            return this.$route.query.activityId
        },
        excellent(){
            return this.$route.query.excellent
        },
        homeworkid(){
            return this.$route.query.id
        }
    },
     mounted () {
        //监听窗口变化
        window.addEventListener('resize',()=> {
            this.getwindiwheight();
        })
        //获取屏幕高
        this.getwindiwheight();
        this.gethomeworkdetail();
        this.getpeople();
    },
    updated () {

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
            $(".detail_box,.center_content").css("height",(allheight)+"px");
                    
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
        //获取作业详情
        gethomeworkdetail(){
            // 获取作业详情有两种情况第一种是全部和优秀作业
            // 第二种是单个人的作业
            if(this.homeworkid){
                this.getgoodwork();
            }else{
                this.getallhomepeople()
            }            
        },
        //获取全部作业和优秀作业
        getallhomepeople(){
            let data={
                activityId:this.activityId,
                direction :'ASC',
                excellent :this.excellent,
            };
            work.gethomeworkdetail(data,(res=>{
                if(res.status==200){
                    // console.log(res.data);
                    if(res.data){
                        this.homeworkitem=res.data;
                        if(res.data.pictureList){
                            this.passimg=res.data.pictureList;
                        };
                        this.gethomeworkattch(res.data)                        
                    }else{
                        this.$message({
                        message: '没有了额~',
                        type: 'warning'
                        });
                    }
                    
                }
            }))
        },
        //获取个人作业详情
        getgoodwork(){
            let data={
                id:this.homeworkid
            };
            work.getstudentcommit(data,(res=>{
                if(res.status==200){
                    if(res.data){
                        this.homeworkitem=res.data;
                        
                        if(res.data.pictureList){
                            this.passimg=res.data.pictureList;
                        }
                        this.gethomeworkattch(res.data)                        
                    }else{
                        this.$message({
                        message: '没有了额~',
                        type: 'warning'
                        });
                    }
                }
            }))
        },
        //获取大屏幕作业提交人
        getpeople(){
            let data={
                activityId:this.activityId,
                excellent :this.excellent,
                number :this.number,
                size:5, 
            };
            work.getpeoplelist(data,(res=>{
                if(res.status==200){
                    console.log(res.data);
                    this.totalElement=res.data.totalElements;
                    this.totalPage=res.data.totalPages;
                    this.pagedata=res.data.content;
                }
            }))
        },
        //左切换获取作业详情
        getleftwork(){
            this.switch('DESC')
        },
        //右切换获取作业详情
        getrightwork(){
            this.switch('ASC')
        },
        switch(n){
            // console.log(this.homeworkitem)
            let data={
                activityId:this.activityId,
                direction :n,
                excellent :this.excellent,
                id:this.homeworkitem.id,
            };
            work.gethomeworkdetail(data,(res=>{
                if(res.status==200){
                    // console.log(res.data);
                    if(res.data){
                        this.homeworkitem=res.data;
                        if(res.data.pictureList){
                            this.passimg=res.data.pictureList;
                        }
                        this.gethomeworkattch(res.data)                        
                    }else{
                        this.$message({
                        message: '没有了额~',
                        type: 'warning'
                        });
                    }
                    
                }
            }))
        },
        //获取单个人的作业
        getonehomework(item){
            let data={
                id:item.id
            };
            work.getstudentcommit(data,(res=>{
                if(res.status==200){
                    if(res.data){
                        this.homeworkitem=res.data;
                        if(res.data.pictureList){
                            this.passimg=res.data.pictureList;
                        } 
                        this.gethomeworkattch(res.data);                       
                    }else{
                       this.$message({
                        message: '没有了额~',
                        type: 'warning'
                        });
                    }
                }
            }))
        },
        //获取当前作业详情的作业福建
        gethomeworkattch(res){
            // console.log(res)
            let data={
                id:res.id
            };
            work.workAttchMentList(data,(res=>{
                if(res.status==200){
                    // console.log(res.data)
                   if(res.data){
                       this.homeworkattchurl=res.data
                   }else{
                        this.homeworkattchurl=undefined
                   }                    
                }
            }))
        },
        //附件下载
        getattr(msg){
            window.open(msg.originalUrl,"_blank")
        },
        //操作图片预览
        showmodel(index) {
            this.$refs.number.getpassindex(index);
        },
        //分业获取提交人数
        handleCurrentChange(num){
            // console.log(num)
            this.number=num;
            this.getpeople();
        },
    },
    components:{
        imgview,
    },
    destroyed () {
         window.removeEventListener("resize",()=>{
              this.getwindiwheight();
         });
    }
}
</script>
<style lang="less" scoped>
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
	width: 8px;
	height: 8px;
  background-color: rgba(0,0,0,.1);
}
 
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
	// -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 6px;
  background-color:rgba(0,0,0,.1);
}
 
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.1);
  background-color: rgba(255,255,255,0.3);
}
    .el-popover{
        height:563px!important;
        ul{
            width: 100%;
            overflow: hidden;
            li:hover{
                h1{
                    color: #409EFF
                }
                p{
                   color: #409EFF 
                }
            }
            li{
                width: 80%;
                margin-left: 10%;
                overflow: hidden;
                height: 93px;
                border-bottom: 1px solid rgba(23,51,85,0.31);
                cursor: pointer;
                
                h1{
                    font-size: 24px;
                    color: #333333;
                    text-align: left;
                    width: 100%;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                    line-height: 50px;
                }
                p{
                    font-size: 22px;
                    color: #666666;
                    width: 100%;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                }
            }
        }
    }
    .el-pagination {
        text-align: center;
    }
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
                .detail_box{
                    width: 100%;
                    display: block;
                    position: relative;
                    .rightimg{
                        position: absolute;
                        top: 90px;
                        right: 10px;
                        width: 80px;
                        img{
                            max-width: 100%;
                        }
                        span{
                            font-size: 20px;
                            color: #D3A14F;
                            position: absolute;
                            font-weight: 600;
                            top: 26px;
                            left: 19px;
                            &:last-child{
                                font-size: 18px;
                                left: 13px;
                            }
                        }
                    }
                    .leftbtn{
                        position: absolute;
                        top: 50%;
                        left:10px;
                        transform: translate(0,-50%);
                        width: 25px;
                        img{
                            max-width: 30px;
                        }
                    }
                    .rightbtn{
                        position: absolute;
                        top: 50%;
                        right:25px;
                        transform: translate(0,-50%);
                        width: 30px;
                        img{
                            max-width: 30px;
                        }
                    }
                    .rightnav{
                        position: absolute;
                        top:23px;
                        right:23px;
                        width: 54px;
                        height: 48px;
                        cursor: pointer;                        
                        img{
                            max-width: 100%;
                        }
                    }
                    // .center_content::-webkit-scrollbar {
                    //     display: none;
                    // }
                    .center_content{
                        width:100%;
                        padding:0 5%;
                        overflow-x: hidden;
                        overflow-y: scroll;
                        .center_box{
                            width: 100%;
                            overflow: hidden;
                            h1{
                                text-align: center;
                                color: #ffffff;
                                font-size: 34px;
                                color: #FFFFFF;
                                font-weight: 600;
                                line-height: 90px;
                            }
                            p{
                                font-size: 22px;
                                color: #FFFFFF;
                                line-height: 44px;
                                text-indent: 46px;
                                word-break:break-all;
                            }
                            .imgbox{
                                width: 100%;
                                overflow: hidden;
                                margin-top: 40px;
                                margin-bottom: 40px;
                                ul{
                                    width: 100%;
                                    overflow: hidden;
                                    li{
                                        width: 24%;
                                        float: left;
                                        height: 280px;
                                        border-radius: 10px;
                                        margin-right: 1%;
                                        cursor: pointer;
                                        overflow: hidden;
                                        margin-top: 14px;
                                        img{                                           
                                            width:100%;
                                        }
                                    }
                                }
                                
                            }
                            h2:hover{
                               text-decoration:underline; 
                            }
                            h2{
                                font-size: 24px;
                                color: #FFFFFF;
                                line-height: 44px;
                                margin-top: 20px;
                                cursor: pointer; 
                            }
                        }
                    }
                }
            }           
        }       
    }
</style>


