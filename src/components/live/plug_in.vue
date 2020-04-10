<template>
    <div class="z-content">
        <header>
            <div class="log">
                <img class="iconImg" src="@/assets/img/liveIcon/liveIcon.png" alt="">
                <span class="iconText">云课堂</span>
            </div>
        </header>
        <div class="down_box">
            <h1>屏幕共享插件使用说明</h1>
            <p>使用共享桌面，请用chrome浏览器登录，并按照如下说明安装插件后方可使用</p>
            <button @click="download">下载插件</button>
            <div class="course">
                <div class="title">
                    <h2>操作流程：</h2>
                    <span></span>
                </div>
                <div class="info">
                    <h3>1.使用chrome浏览器58及以上版本，下载插件并解压缩。</h3>
                    <h3>2.点击chrome地址栏右侧的更多按钮，找到“更多工具”，点击“扩展程序”。</h3>
                    <img src="../../assets/img/liveIcon/down1.png" alt="">
                </div>
                <div class="info">
                    <h3>3.打开页面中的开发者模式。</h3>
                     <img src="../../assets/img/liveIcon/down2.png" alt="">
                </div>
                <div class="info">
                    <h3>4.在扩展程序页面中，点击“加载已解压的扩展程序”，选择解压后的文件夹。</h3>
                     <img src="../../assets/img/liveIcon/down3.png" alt="">
                </div>
                <div class="info">
                    <h3>5.返回直播界面，再次点击“屏幕共享”即可使用。</h3>                    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    methods:{
        download(){
             window.location.href="https://opensxb.oss-cn-beijing.aliyuncs.com/resource/static/chrome-extension.zip";
        }
    },
}
</script>
<style lang="less" scoped>
.z-content{
    width: 100%;
    overflow: hidden;
    background-color: #f7f7f7;
    font-family: "FZZZHONGJW--GB1-0","microsoft yahei";
    header{
        width: 100%;
        height: 40px;
        background: #07111B;
        .log{
            width: 1280px;
            margin: 0 auto;
            img{
                width: 70px;
                float: left;
                margin-top: 7px;
            }
            span{
                font-size: 16px;
                color: #1AAB8E;
                line-height: 40px;
                margin-left: 20px;
            }
        }
    }
    .down_box{
        width: 1280px;
        background: #FFFFFF;
        box-shadow: 0 0 7px 0 rgba(0,0,0,0.03);
        border-radius: 10px;
        margin: 0 auto;
        margin-top: 20px;
        margin-bottom: 20px;
        h1{
            font-size: 24px;
            color: #333333;
            text-align: center;
            padding-top: 48px;
        }
        p{
            font-size: 16px;
            color: #333333;
            margin-top: 30px;
            text-align: center;
        }
        button{
            width: 130px;
            height: 36px;
            background-image: linear-gradient(90deg, #4AC9AA 0%, #1CB6C8 100%);
            border-radius: 18px;
            margin: 0 auto;
            margin-top:20px;
            display: block;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 2.24px;
        }
        .course{
            width:900px;
            overflow: hidden;
            margin: 0 auto;
            margin-top: 44px;
            .title{
                position: relative;
                height: 30px;
                h2{
                    font-size: 16px;
                    color: #333333;
                    letter-spacing: 0;
                    position: absolute;
                    top:0;
                    left: 5px;
                    z-index: 2;
                }
                span{
                    opacity: 0.2;
                    background: #009791;
                    position: absolute;
                    top:14px;
                    left: 0;
                    z-index: 1;
                    width: 82px;
                    height: 9px;
                }
            }
            .info{
               margin-top: 18px;
               h3{
                   font-size: 16px;
                   color: #333333;
                   margin-bottom:10px; 
               }
               img{
                   width: 900px;
               } 
            }
        }
    }
}
</style>


