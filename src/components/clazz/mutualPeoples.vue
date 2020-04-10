<template>
    <div class="mutualPeoples">
        <Goback :passtitle="passtitle"></Goback>
        <button data-v-20433bec="" class="btn-export" type="button" @click.stop="exportExcel"><i data-v-20433bec="" class="icon-export-white"></i>
            导出学员名单
        </button>
        <div class="innerBox">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="'已完成('+finishCount+')'" name="first">
                    <el-table
                        :data="finishData"
                        stripe
                        style="width: 100%">
                        <el-table-column
                            prop="username"
                            show-overflow-tooltip
                            label="账号">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            show-overflow-tooltip
                            label="姓名">
                        </el-table-column>
                        <el-table-column
                            prop="phone"
                            show-overflow-tooltip
                            label="手机号">
                        </el-table-column>
                        <el-table-column
                            prop="workPlace"
                            show-overflow-tooltip
                            label="单位">
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            prop="scoreLevel"
                            label="评分"
                            width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.scoreLevel|scoreLevelFilter}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            prop="score"
                            label="作业总得分">
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            prop="managerScore"
                            label="管理者评分">
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            prop="studentScore"
                            label="学员评阅平均分"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click.stop="viewMutualWork(scope.row)">查看作业</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="'未提交('+unCommitCount+')'" name="second">
                    <el-table
                        :data="unCommmitData"
                        stripe
                        style="width: 100%">
                        <el-table-column
                            show-overflow-tooltip
                            prop="username"
                            label="账号"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            prop="name"
                            label="姓名"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            prop="phone"
                            label="手机号">
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="'未评阅('+unReviewCount+')'" name="third">
                    <el-table
                        :data="unReviewData"
                        stripe
                        style="width: 100%">
                        <el-table-column
                            show-overflow-tooltip
                            prop="username"
                            label="账号">
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            prop="name"
                            label="姓名">
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            prop="phone"
                            label="手机号">
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            prop="toScoreCount"
                            label="应评作业数"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            prop="scoredCount"
                            label="实评作业数"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            prop="scoreTime"
                            label="最近评阅时间">
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import Goback from 'base/goback/goback'
    import mutualHttp from 'model/activity/mutual';
    import { getToken, getCurRole } from "@/filters/userVerify";
    import API from "@/global/resource";
    export default {
        data(){
            return {
                passtitle:"学员名单",
                activeName:"first",
                finishData: [],
                unCommmitData:[],
                unReviewData:[],
                finishCount:0,
                unCommitCount:0,
                unReviewCount:0,
            }
        },
        created(){
            this.activeName = this.$route.query.nowIndex;
            this.handleClick();
            let countArr = this.$route.query.count.split(';')
            this.finishCount = countArr[2];
            this.unCommitCount = countArr[0];
            this.unReviewCount = countArr[1];
        },
        computed:{
            activityId(){
                return this.$route.query.activityId
            },
            clazzId(){
                return this.$route.query.clazzId
            },
            courseId(){
                return this.$route.query.courseId
            },
        },
        methods:{
            handleClick(){
                switch (this.activeName) {
                    case "first":
                        this.ReviewgetFinishedUser();
                        break;
                    case "second":
                        this.ReviewgetUnCommitUser();
                        break;
                    case "third":
                        this.ReviewgetUnReviewUser();
                        break;
                
                    default:
                        break;
                }
            },
            /**
             * 已完成人员列表
             */
            ReviewgetFinishedUser(){
                let data= {
                    activityId: this.activityId
                };
                mutualHttp.ReviewgetFinishedUser(data,res=>{
                    if(res.status==200){
                        this.finishData = res.data;
                        this.finishCount = res.data.length;
                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
            /**
             * 未提交人员列表
             */
            ReviewgetUnCommitUser(){
                let data= {
                    activityId: this.activityId
                };
                mutualHttp.ReviewgetUnCommitUser(data,res=>{
                    if(res.status==200){
                        this.unCommmitData = res.data;
                        this.unCommitCount = res.data.length;
                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
            /**
             * 未评阅人员列表
             */
            ReviewgetUnReviewUser(){
                let data= {
                    activityId: this.activityId
                };
                mutualHttp.ReviewgetUnReviewUser(data,res=>{
                    if(res.status==200){
                        this.unReviewData = res.data;
                        this.unReviewCount = res.data.length;
                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
            /**
             * 导出
             */
            exportExcel(){
                if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
                window.open(API.urls.ReviewgetExportUser + "?activityId=" + this.activityId + "&token=" + getToken());
            },
            /**
             * 查看作业
             */
            viewMutualWork(row){
                console.log(row);
                this.$router.push({path:"/clazz/studentMutualDetail",query:{clazzId:this.clazzId,courseId:this.courseId,activityId:this.activityId,homeworkId:row.homeWorkId}})
            }
            
        },
        filters:{
            scoreLevelFilter(type){
                console.log(type);
                let text = '';
                switch (type) {
                    case "A":
                        text="优秀"
                        break;
                    case "B":
                        text="较好"
                        break;
                    case "C":
                        text="及格"
                        break;
                    case "D":
                        text="不及格"
                        break;
                    default:
                        break;
                }
                return text;
            }
        },
        components:{
            Goback
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/less/icon.less";
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
        position: relative;
    }
    .btn-export::after{
        position: absolute;
        right: -6px;
        top: -10px;
        width: 27px;
        height: 15px;
        content: "";
        background: url("../../assets/img/expert/vipLogo.png") center center no-repeat;
        background-size: 27px 14px;
    }
    .btn-export i{
        vertical-align: middle!important;
    }
    .innerBox{
        margin-top: 20px;
        padding: 30px 0;
        background: #fff;
        box-shadow: 0 0 7px 0 rgba(0,0,0,0.03);
    }
</style>
<style lang="less">
    .mutualPeoples{
        .el-tabs__nav-scroll{
            padding: 0 70px;
            .el-tabs__item{
                color: #666;
                font-size: 18px;
            }
            .el-tabs__item.is-active{
                color: #319c95;
            }
            .el-tabs__active-bar{
                height: 3px;
            }
        }
        .el-tabs__content{
            width: 92%;
            margin: 0 auto;
        }
        .el-table--fit{
            border: 1px solid #ebeef5;
            border-bottom: 0 none;
        }
        .el-table thead{
            th{
                background: rgb(238,241,246);
                >.cell{
                    font-weight: normal;
                    color: #333;
                }
            }
        }
        .el-table th>.cell,.el-table td>.cell{
            font-size: 16px;
            white-space: nowrap;
        }
    }
    .el-tabs__item{
        height: 50px!important;
    }
    .el-tabs__nav-wrap::after{
        background:#F2F0F0!important; 
    }
</style>


