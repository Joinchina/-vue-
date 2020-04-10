<template>
    <!-- 作业签到界面 -->
    <div class="allcontent">
        <h1>作业名称全部显示</h1>
        <div class="detail_box">
            <div class="detail_left">
                <ul>
                    <li>
                        <h2>17</h2>
                    </li>
                    <li>
                        <h3>
                            提交人数
                            <a href="">查看详情</a>
                        </h3>                        
                    </li>
                    <li>
                        <h4>优秀作业：12份<a href="">查看详情</a></h4>
                        
                    </li>
                </ul>
            </div>
            <div class="detail_right" id="testDiv">
                <ul>
                    <li v-for="(item,index) in items" :key="index">
                        <div class="imgbox">
                            <img :src="item.img" alt="" v-if="item.img.length>0">
                            <img src="../../assets/img/screen/homework.png" alt="" v-else>
                            <h1 v-show="item.img.length==0">{{item.name | namefilter}}</h1>
                        </div>
                        <h2>{{item.name}}</h2>                      
                    </li>                                       
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
           items:[
               {
                   img:'',
                   name:'张松涛'
               },
               {
                   img:'',
                   name:'张松涛'
               },
               {
                   img:'',
                   name:'张松涛'
               },
               {
                   img:'',
                   name:'张松涛'
               },
               {
                   img:'',
                   name:'张松涛'
               },
               {
                   img:'',
                   name:'张松涛'
               },
               {
                   img:'',
                   name:'张松涛'
               },
               {
                   img:'',
                   name:'张松涛'
               },
               {
                   img:'',
                   name:'张松涛'
               },
               {
                   img:'',
                   name:'张松涛'
               },
               {
                   img:'',
                   name:'张松涛'
               },
               {
                   img:'',
                   name:'张松涛'
               },
               {
                   img:'',
                   name:'张松涛'
               }
           ],
           timer:null, 
        }
    },
    filters: {
        namefilter:function(val) {
            return val.substr(val.length-1,1)
        }
    },
    mounted () {
        let newArr={
            img:"",
            name:"张松涛"
        };
        if (this.items.length>20) {
            clearInterval(this.timer)
        }
        // this.timer=setInterval(() => {
        //     this.items.push(newArr);
        //     this.scrollend();
        // }, 2000);        
    },
    methods: {
        //执行滚动条滚动到底部
        scrollend(){
            var div = document.getElementById('testDiv');
            div.scrollTop = div.scrollHeight;
        }
    }
}
</script>
<style lang="less" scoped>
    .allcontent{
        width:98%;
        margin-left: 1%;
        margin-top: 1%;
        background: rgba(23,51,85,0.39);
        border-radius: 18px;
        h1{
            font-family: PingFangSC-Medium;
            text-align: center;
            font-size: 38px;
            color: #FFFFFF;
            letter-spacing: -0.02px;
            padding-top: 34px;
        }
        .detail_box{
            width: 100%;
            display: block;
            margin-top:70px;
            .detail_left{
                width: 40%;
                float: left;
                height: 100%;
                ul{
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    li{
                        width: 100%;
                        height: 33.33%;
                        position: relative;
                        overflow: hidden;
                        h2{
                            font-family: PingFangSC-Medium;
                            position: absolute;
                            font-size: 104px;
                            color: #FFA5D3;
                            letter-spacing: -0.04px;
                            text-align: center;
                            font-weight: 600;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                        }
                        h3{
                            font-family: PingFangSC-Medium;
                            font-size: 36px;
                            color: #FFFFFF;
                            letter-spacing: -0.01px;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                            a{
                                text-align: center;
                                width: 144px;
                                height: 46px;
                                display: block;
                                background: #284278;
                                border: 1px solid #081D49;
                                border-radius: 29px;
                                font-size: 28px;
                                color: #FFFFFF;
                                margin: 0 auto;
                                margin-top: 33px;
                            }
                        }
                        
                        h4{
                            font-family: PingFangSC-Regular;
                            font-size: 24px;
                            color: #FFFFFF;
                            letter-spacing: -0.01px;
                            width: 290px;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                            a{
                                opacity: 0.57;
                                font-family: PingFangSC-Regular;
                                font-size: 24px;
                                color: #A9CFFF;
                                letter-spacing: -0.01px;
                                margin-left: 20px;                               
                            }
                        }                        
                    }
                }
            }
             /* for Chrome */
            .detail_right::-webkit-scrollbar {
                display: none;
            }
            .detail_right{
                width: 60%;
                float: left;
                height: 100%;
                overflow-x: hidden;
                overflow-y: scroll;
                ul{
                    width: 100%;
                    height: 100%;
                    li{
                        width:20%;
                        height: 33.33%;
                        float: left;
                        position: relative;
                        .imgbox{
                            width: 100%;
                            border-radius: 100%;
                            overflow: hidden;
                            position: relative;
                            margin: 20px 50px 0 50px;
                            img{
                               display: block;
                               width: 100%;
                               height: 100%;
                               border-radius: 100%;
                            }
                            h1{
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%,-50%);
                                font-size: 60px;
                                color: #FFFFFF;
                                padding-top: 0;
                            }
                        }
                        h2{
                            font-size: 22px;
                            color: #FFFFFF;
                            text-align: center;
                            margin-top: 14px;
                        }
                    }
                }
            }
        }
    }
</style>

