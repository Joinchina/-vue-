<template>
    <div class="otherMutualDetailBox">
        <Goback :passtitle="passtitle"></Goback>
        <section class="block">
            <div class="inner">
                <div class="personInfo">
                    <img :src="otherDetail.miniAvatar" alt="头像" class="miniAvatar" v-if="Boolean(otherDetail.miniAvatar)">
                    <img src="../../assets/img/activity/example2.png" alt="头像" class="miniAvatar" v-else>
                    <span class="personName">{{otherDetail.userName}}</span>
                    <span class="scoreState">{{otherDetail.score|fixTwo}}</span>
                    <span :class="{scroleLeavel:true,excellent:otherDetail.scoreLevel=='A',good:otherDetail.scoreLevel=='B',qualified:otherDetail.scoreLevel=='C'}" v-if="Boolean(otherDetail.scoreLevel)&&activityStatus=='END'">{{otherDetail|scoreLevelfilter}}</span>
                    <span class="scroleLeavel excellent" v-if="!!otherDetail.managerReviewScoreStatus">待评阅</span>
                    <!-- <em class="noReview" v-if="activityStatus == 'INPROGRESS'">评阅未开始</em> -->
                    <span class="timeText">{{otherDetail.createDate}}</span>
                </div>
                <h2 class="mutualTitle">
                    {{otherDetail.title}}
                </h2>
                <p class="detailText">
                    {{otherDetail.content}}
                </p>
                <ul class="pictureLists" v-if="Boolean(otherDetail.pictureList)&&otherDetail.pictureList.length>0">
                    <li v-for="(item,index) in otherDetail.pictureList" :key="index">
                        <img :src="item.transUrl" alt="" @click="viewImage(item)">
                    </li>
                </ul>
                <div class="distRes" v-for="(item,index) in otherDetail.attachmentList" :key="index" v-if="Boolean(otherDetail.attachmentList)&&otherDetail.attachmentList.length>0">
                    <!-- <span><img src="../../assets/img/icon/icon-fujian.png" alt=""></span> -->
                    <img src="../../assets/img/icon/icon-ppt.png" alt="" v-if="item.type == 'PPT'">
                    <img src="../../assets/img/icon/icon-video.png" alt="" v-else-if="item.type == 'VIDEO'">
                    <img src="../../assets/img/icon/icon-word2.png" alt="" v-else>
                    <!--转码中-->
                    <span v-if="item.transStatus != 'SUCCESS'" class="zm" >{{item.transStatus == 'INPROCESS'?'转码中...':item.transStatus == 'FAILURE'?'转码失败':''}}</span>
                    <!-- <span v-if="item.transStatus == 'FAILURE'" class="zm" >转码失败</span> -->
                    <span  class="viewhomework" @click="viewhonework(item)">		
                       {{item.name}}
                    </span>
                    
                </div>
            </div>
        </section>
        
        <section class="block" v-loading="submitIng">
            <div class="inner">
                <div class="reviewHead">
                    <span class="text">{{activityStatus=='REVIEWING'&&!canReview?'请打分':"请评论"}}</span>
                    <Throttle :wait="300" :isDebounce="true" events="mouseleave">
                        <el-rate 
                            v-model="rate" 
                            allow-half 
                            show-score 
                            text-color="#FD7E23" 
                            :max='5' 
                            v-if="activityStatus=='REVIEWING'&&!canReview"
                            @mousemove.native="rateHandler($event)"
                            @mouseleave.native="mouseLeaveHandler($event)"
                            @change="rateChange" style="display:inline-block;">
                        </el-rate>
                    </Throttle>
                    
                    <span ref="rateText" class="rateScore" v-if="activityStatus=='REVIEWING'&&!canReview">{{rateScore}}分</span>
                    <em class="toScore" v-if="activityStatus=='REVIEWING'&&canReview" @click="canReview=false"><i class="el-icon-edit"></i>重新打分</em>
                    <el-button type="primary" class="submitRate" @click="submitScore">提交</el-button>
                </div>
                <el-input
                    type="textarea"
                    :rows="4"
                    :placeholder="placeholder"
                    v-model.trim="rateText">
                </el-input>
            </div>
        </section>
        <section class="block">
            <div class="inner">
                <div class="reviewHead">
                    <span class="text">评论(<em class="comments">{{homeworkComment.length}}</em>)</span>
                </div>
                <ul class="commentsList" v-if="homeworkComment.length > 0">
                    <li v-for="(item,index) in homeworkComment" :key="index">
                        <div class="avator">
                            <img :src="item.miniAvatar" alt="头像" class="miniAvatar" v-if="Boolean(item.miniAvatar)">
                            <img src="../../assets/img/activity/example2.png" alt="头像" class="miniAvatar" v-else>
                        </div>
                        <div class="commentsDetail">
                            <div class="head">
                                <span class="name">{{item.userName}}</span>
                                <img src="../../assets/img/mutual/class.png" alt="" v-if="item.role=='CLAZZMANAGER'">
                                <img src="../../assets/img/mutual/org.png" alt="" v-if="item.role=='ADMIN'">
                                <img src="../../assets/img/mutual/professor.png" alt="" v-if="item.role=='PROFESSOR'">
                                <span class="time" v-if="Boolean(item.createDate)">{{item.createDate}}</span>
                                <span class="mutualScroe" v-if="Boolean(item.score)">作业打分:{{item.score}}</span>
                            </div>
                            <p class="commentsText">
                                {{item.content}}
                            </p>
                        </div>
                    </li>
                    
                </ul>
                <ul v-else class="commentsList">
                    暂无评论
                </ul>
            </div>
        </section>

        <!-- 查看作业附件 -->
		<modal :show.sync = "filelog" contWidth = '80%' bgColor="transparent">
			<div slot="body" class="w-transparent" style="height:100%;height:100%">        
				<iframe :src="bigfileUrl" id="iframepdf" frameborder="0" width="100%" height="100%"></iframe>			
             </div>
		</modal>
        <!-- 大图弹出框 -->
        <modal :show.sync = "dialogPic" contWidth = '80%'  bgColor="transparent">
            <div slot="body">
                <img id="scheduleShowbigPic" :src="bigUrl">
            </div>
        </modal>
    </div>
</template>

<script>
    import modal from 'base/modal/modal'
    import mutual from '@/model/activity/mutual'
    import Goback from 'base/goback/goback'
    export default {
        data(){
            return {
                rate:0,      //评分值
                rateText:"",        //评语
                filelog:false,     //预览附件弹窗
                bigfileUrl:"",      //附件地址
                rateArr:[1,2,3,4,5], //遍历
                rateScore:0,            //分数
                leaveTime:null,     //防抖
                otherDetail: {},    //其他作业数据
                homeworkComment:[],  //评论数据
                canReview:false,       //是否可评论
                placeholder: "请输入内容",  
                submitIng: false,
                passtitle:"学员作业",
                dialogPic:false,
                bigUrl:"",
                activityStatus:"",      //活动状态
                allData: {},            //所有数据
            }
        },
        computed:{
            homeworkId(){
                return this.$route.query.homeworkId;
            },
        },
        created(){
            this.getWorkDetail();
        },
        methods:{
            rateChange(){
                console.log(this.rate)
            },

            //下载资源
            gethomework(item) {
				window.open(API.urls.gethomework+"?id="+item.id+"&token="+getToken());
            },
            //预览资源
			viewhonework(item){
            	this.filelog=true;
				this.bigfileUrl=item.linkUrl;
            },
             //预览图片
			viewImage(item){
            	this.dialogPic=true;
				this.bigUrl=item.url;
            },
            getWorkDetail(){
                let data = {
                    id: this.homeworkId,
                };
                mutual.mutualOtherDetail(data,res=>{
                    if(res.status==200){
                        this.allData = res.data;
                        this.otherDetail = res.data.homework;
                        this.homeworkComment = res.data.homeworkComment?res.data.homeworkComment:[];
                        this.canReview = res.data.managerReviewScoreStatus;  
                        this.activityStatus = res.data.activityStatus;
                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
            rateHandler(e){
                let num = document.querySelector('.el-rate__text').innerText;
                this.rateScore = num*2;
                this.changeplaceholder(this.rateScore);
            },
            mouseLeaveHandler(e){
                let num = document.querySelector('.el-rate__text').innerText;
                this.rateScore = num*2;
                this.changeplaceholder(this.rateScore);
            },
            //滑动星星改变占位符
            changeplaceholder(num=0){
                if(num>0&&num<=2){
                    this.rateText = "超级不好，要认真完成作业哦！"
                }else if(num>2&&num<=4){
                    this.rateText = "比较差，要认真完成作业哦！"
                }else if(num>4&&num<=6){
                    this.rateText = "一般般，还需认真完成思考哦！"
                }else if(num>6&&num<=8){
                    this.rateText = "比较好，努把力能冲刺优秀哦！"
                }else if(num>8&&num<=10){
                    this.rateText = "非常棒，我们的榜样，继续保持哦！"
                }else{
                    this.rateText = ""
                }
            },
            /**
             * 提交评分
             */
            submitScore(){
                console.log(this.canReview);
                if(this.activityStatus=='REVIEWING'&&!this.canReview&&!this.rate>0){
                    this.$message.error("请打分");
                    return
                }
                if(!this.rateText){
                    this.$message.error("请输入评论内容");
                    return
                }
                this.submitIng=true;
                let data={
                    comment: this.rateText,
                    homeworkId: this.homeworkId
                };
                if(this.rate>0){
                    data.score = this.rate*2
                }
                mutual.setReviewScore(data,res=>{
                    this.submitIng=false;
                    if(res.status==200){
                          this.$message.success(this.rate>0?"打分成功":"评论成功");
                          this.placeholder = "请输入内容";
                          this.rateText = '';
                          this.rate = 0;
                          this.getWorkDetail();

                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
        },
        filters:{
            scoreLevelfilter(data){
                let text="";
                switch (data.scoreLevel) {
                    case "A":
                        text="优秀";
                        break;
                    case "B":
                        text="较好";
                        break;
                    case "C":
                        text="及格";
                        break;
                    case "D":
                        text="不及格";
                        break;
                
                    default:
                        break;
                }
                return text;
            },
            fixTwo(score){
                let text ='';
                if(!score){
                    text="未评分"
                }else if(~~score==score){
                    text="总得分"+ score+'.00'
                }else{
                    text="总得分"+ score.toFixed(2);
                }
                return text
            }
        },
        components:{
            modal,
            Goback,
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/less/icon.less";
    .otherMutualDetailBox{
        margin-bottom: 20px;
        #scheduleShowbigPic {
            width: 100%;
            height: auto; 
            display: block;
            margin: 0 auto;
        }
        .btn-export{
            float: right;
            padding: 0 15px;
            height: 40px;
            line-height: 40px;
            color: #fff;
            background: #35a69d;
            border-radius: 6px;
            border: 0;
            cursor:pointer;
            margin-left:12px;
        }
        .btn-export i{
            vertical-align: middle!important;
        }

        .block{
            padding: 20px 30px;
            background: #fff;
            margin-top: 20px;
            .inner{
                width: 830px;
            }
            .miniAvatar{
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
            .personInfo{
                .personName{
                    font-size: 16px;
                    color: #333333;
                    margin-left: 10px;
                }
                .scoreState{
                    font-size: 14px;
                    color: #51607C;
                    margin-left: 5px;
                    padding-left: 5px;
                    border-left: 1px solid #CCCCCC;
                    height: 15px;
                    display: inline-block;
                    line-height: 1;
                }
                .scroleLeavel{
                    padding: 0px 7px;
                    display: inline-block;
                    font-size: 14px;
                    border: 1px solid #D6D6D6;
                    height: 18px;
                    border-radius: 4px;
                    margin-left: 10px;
                    padding-bottom: 20px;
                    color: #767676
                }
                .scroleLeavel.excellent{
                    border-color: #FD7866;
                    color: #F96D5A;
                }
                .scroleLeavel.good{
                    border-color: #B7ECD8;
                    color: #1AB974;
                }
                .scroleLeavel.qualified{
                    border-color: #C2D4FA;
                    color: #5786EE;
                }
                .timeText{
                    font-size: 14px;
                    color: #999999;
                    float: right;
                    margin-top: 10px;
                }
                .noReview{
                    padding: 0px 8px;
                    display: inline-block;
                    font-size: 12px;
                    vertical-align: middle;
                    border-radius: 4px;
                    margin-left: 2px;
                    border: 1px solid #FD7866;
                    color: #F96D5A;
                }
            }
            .mutualTitle{
                font-size: 18px;
                color: #333333;
                margin: 16px 0 10px 0;
                // font-weight: bold;
                word-break: break-all;
            }
            .detailText{
                font-size: 14px;
                color: #666666;
                line-height: 22px;
                word-break: break-all;
            }
            .reviewHead{
                font-size: 18px;
                color: #333333;
                padding-left: 4px;
                border-left: 3px solid #35A69D;
                height: 20px;
                line-height: 18px;
                margin-bottom: 20px;
                .comments{
                    color: #666666;
                }
                .toScore{
                    font-size: 15px;
                    color: #1077D7;
                    cursor: pointer;
                    margin-left: 16px;
                }
            }
            .submitRate{
                padding: 7px 20px;
                float: right;
            }
            .commentsListNo{
                text-align: center;
                font-size: 16px;
                padding: 20px 0;
            }
            .commentsList{
                overflow: hidden;
                li{
                    margin-bottom: 18px;
                }
                .avator{
                    float: left;
                    width: 70px;
                    text-align: right;
                }
                .commentsDetail{
                    margin-left: 90px;
                    padding: 10px 10px;
                    background: rgb(240, 245, 250);
                    border-left: 2px solid #9DCECE;
                    .head{
                        height: 20px;
                        .name{
                            font-size: 16px;
                            color: #333333;
                        }
                        .time{
                            font-size: 14px;
                            color: #999999;
                            margin: 0 10px;
                        }
                        .mutualScroe{
                            font-size: 14px;
                            color: #FD7E23;
                        }
                        img{
                            height: 14px;
                            margin-left: 6px;
                            vertical-align: baseline;
                        }
                    }
                    .commentsText{
                        font-size: 14px;
                        color: #333333;
                        margin-top: 18px;

                    }
                }
            }
            .distRes{
                margin-top: 10px;
                .viewhomework,.uploaddown{
                    cursor: pointer;
                    text-decoration: underline;
	                color: #409eff;
                }
                .zm {
                    color: #717171;
                    padding-left: 15px;
                }
            }
            .pictureLists{
                overflow: hidden;
                margin: 20px 0;
                border-bottom: 1px dashed #ccc;
                padding-bottom: 16px;
                li{
                    float: left;
                    margin-left: 10px;
                    img{
                        cursor: pointer;
                        width: 90px;
                        height: 90px;
                        border-radius: 6px;
                    }
                }
            }
            .rateScore{
                color: rgb(253, 126, 35);
                font-size: 14px;
            }
        }
    }
    
</style>
<style lang="less">
    .otherMutualDetailBox{
        .el-rate{
            vertical-align: bottom;
        }
        .el-rate__text{
            display: none;
        }
        .el-button--primary{
            background:  #35A69D;
        }
    }
</style>


