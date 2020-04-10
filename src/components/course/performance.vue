<template>
    <div class="performance">
        <div class="bread-box">
            <Goback passtitle="课堂表现"></Goback>
            <button type="button" class="btn-export" @click="resExport">
                <i class="icon-export-white"></i>
                导出
            </button>
        </div>
        <div class="search">
            <input type="text" v-model="keyword" placeholder="姓名/手机号" @keyup.13="getList('search')">
            <i class="el-icon-search" @click.stop="getList('search')"></i>
        </div>

        <section class="table" id="w-table">
            <el-table
                :data="items"
                >
                <el-table-column
                    fixed
                    prop="name"
                    label="学员姓名"
                    width="150">
                </el-table-column>
                <el-table-column
                    fixed
                    prop="phone"
                    label="手机号"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="lookLiveTime"
                    label="累计在线时长"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="startLiveCount"
                    label="上课次数"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="liveTime"
                    label="直播时长"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="deviceSet"
                    label="观看设备"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="viewTime"
                    label="回看时长"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="voiceChatCount"
                    label="连线次数"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="onLineRate"
                    label="在线率"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="discussMessageCount"
                    label="讨论次数"
                    width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.discussMessageCount}} {{scope.row.forbiddenMessage ? '被禁言' : ''}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="answerQuestionCount"
                    label="答题次数"
                ></el-table-column>
                <el-table-column
                    prop="sendflowerByOtherCount"
                    label="被奖励次数"
                    width="120">
                </el-table-column>
                
                <el-table-column
                    prop="enterLiveCount"
                    label="进入直播次数"
                    width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.enterLiveCount}} {{scope.row.kickOut ? '被踢出' : ''}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="outLiveCount"
                    label="退出直播次数"
                    width="120">
                </el-table-column>
                <el-table-column
                    label="首次进入时间"
                    width="180">
                    <template slot-scope="scope">
                        <span v-if="scope.row.studentEnterAndOutLiveList">{{scope.row.studentEnterAndOutLiveList[0].enterTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="最后退出时间"
                    width="180">
                    <template slot-scope="scope">
                        <span  v-if="scope.row.studentEnterAndOutLiveList">{{scope.row.studentEnterAndOutLiveList[scope.row.studentEnterAndOutLiveList.length-1].outTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="进入时间明细"
                    width="180">
                    <template slot-scope="scope" v-if="scope.row.studentEnterAndOutLiveList">
                       <el-tooltip placement="top">
                            <div slot="content">
                                 <p class="" v-for="(item,index) in scope.row.studentEnterAndOutLiveList" :key="index">{{item.enterTime}}</p>
                            </div>
                             <span class="" v-for="(item,index) in scope.row.studentEnterAndOutLiveList" :key="index">{{item.enterTime}}...</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    label="退出时间明细"
                    width="180">
                    <template slot-scope="scope" v-if="scope.row.studentEnterAndOutLiveList">
                        <el-tooltip placement="top">
                            <div slot="content">
                                 <p class="" v-for="(item,index) in scope.row.studentEnterAndOutLiveList" :key="index">{{item.outTime}}</p>
                            </div>
                            <span class="" v-for="(item,index) in scope.row.studentEnterAndOutLiveList" :key="index">{{item.outTime}}...</span>
                        </el-tooltip>
                        
                            
                    </template>
                </el-table-column>
            </el-table>

            <!--page-footer-->
            <div class="pages">
                <p>共{{totalElements}}条&nbsp;每页20条</p>
            </div>
            <!--分页-->
            <div class="pagination">
                <el-pagination
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :page-size="20"
                    :total="totalElements">
                </el-pagination>
            </div>
        </section>
    </div>
</template>
<script>
import Goback from 'base/goback/goback'
import Live from 'model/live/live'
import { getToken } from '@/filters/userVerify'
import API from '@/global/resource'

export default {
    data() {
        return {
            totalElements:0,
            cur_page:1,
            loading_font:this.$globalParam.loadText,
            items: [],
            keyword: "",
        }
    },
    computed: {
        clazzId() {
            return this.$route.query.clazzId;
        },
        courseId() {
            return this.$route.query.courseId;
        }
    },
    mounted() {
        this.getList();
    },
    methods: {
        handleCurrentChange(val){
            this.cur_page = val;
            this.getList();
        },
        
        getList(type) {
            let data = {
                clazzId: this.clazzId,
                courseId: this.courseId,
                keyword: this.keyword,
                number: this.cur_page,
                size: 20
            };
            if(type == 'search') {
                data.number = 1;
            }
            Live.livecourseStatistics(data, (res => {
                console.log("课堂表现", res);
                if(res.status == 200) {
                    this.items = res.data.content;
                    this.totalElements = res.data.totalElements;
                } else {
                    this.$message.error(res.message);
                }
            }));
        },

        //导出
        resExport() {
            if(!this.$store.getters.getOrgVipInfo.vip){
                this.$store.state.vipFuncPopFalg = true;
                return;
            }
            window.open(API.urls.livecourseExpExcel+"?clazzId="+this.clazzId+"&courseId="+this.courseId+"&token="+getToken());
        },
    },
    components: {
        Goback,
    }
}
</script>
<style lang="less" scoped>
@import "../../assets/less/btn-search.less";
@import "../../assets/reset-element-ui/user-table.css";
.performance {
    position: relative;
}
.bread-box {
    margin-bottom: 15px;
}
.search {
    position: absolute;
    top: 0;
    right: 100px;
    width: 235px;
    background: #fff;
}
.btn-export {
    background: #368BE2;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 1em;
    position: relative;
    &::after{
        position: absolute;
        right: -10px;
        top: -10px;
        width: 27px;
        height: 15px;
        content: "";
        background: url("../../assets/img/expert/vipLogo.png") center center no-repeat;
        background-size: 27px 14px;
    }
}
.pad {
    padding: 0 10px;
}
.pages {
    p {
        font-size: 14px;
        color: #666666;
        text-align: right;
        padding: 10px 0 0;
    }
}
</style>
