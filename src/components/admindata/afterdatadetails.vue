<template>
    <div id="aftertailcontent">
        <Goback passtitle="返回" type="返回"></Goback>
        <div class="tablebox">
            <div class="tabletitle">
                <div class="title"><h1>机构名：{{org}}</h1></div>
                <div class="title"><h1>班级名：{{clazz}}</h1></div>
            </div>
            <div class="tablecontent">
                <div class="contenttitle">
                     <h1>学员数：{{studentCount}}</h1>
                     <h1>培训周期：{{trainingPeriod}}</h1>
                     <h1>开始-结束日期：{{trainingBeginDate}}至{{trainingEndDate}}</h1>
                </div>
                <div class="before">
                    <div class="beforetitle">训前</div>
                    <div class="beforetable">
                        <template>
                            <el-table
                                :data="tableData"
                                border
                                style="width:100%;text-align:center">
                                <el-table-column
                                prop="appLoginRate"
                                label="学员登录率"
                                width="107">
                                 <template slot-scope="scope">
                                        <span>{{scope.row.appLoginRate | percent}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column
                                prop="signTaskCount"
                                label="签到数"
                                width="107">
                                </el-table-column>
                                <el-table-column
                                prop="discussActivityCount"
                                label="讨论组数"
                                width="107">
                                </el-table-column>
                                <el-table-column
                                prop="photowallActivityCount"
                                label="照片墙数"
                                width="107">
                                </el-table-column>
                                <el-table-column
                                prop="noticeCount"
                                label="通知数"
                                width="107">
                                </el-table-column>
                                <el-table-column
                                prop="resourceCount"
                                label="资源数"
                                width="107">
                                </el-table-column>
                                <el-table-column
                                prop="courseCount"
                                label="课程数"
                                width="107">
                                </el-table-column>
                                <el-table-column
                                prop="multiCourseCount"
                                label="跨天课程"
                                >
                                </el-table-column>
                            </el-table>
                        </template>

                    </div>
                </div>
                <div class="center">
                    <div class="beforetitle">训中</div>
                    <div class="centertable">
                        <template>
                            <el-table
                                :data="tableData1"
                                border
                                style="width:100%;text-align:center">
                                <el-table-column
                                prop="appLoginRate"
                                label="学员登录率"
                                width="107">
                                <template slot-scope="scope">
                                        <span>{{scope.row.appLoginRate | percent}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column
                                prop="signRate"
                                label="签到率"
                                width="107">
                                <template slot-scope="scope">
                                        <span>{{scope.row.signRate | percent}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column
                                prop="discussMessageCount"
                                label="讨论组发言数"
                                width="107">

                                </el-table-column>
                                <el-table-column
                                prop="photowallPhotoCount"
                                label="照片数"
                                width="107">
                                </el-table-column>
                                <el-table-column
                                prop="topicCount"
                                label="同学圈发帖数"
                                width="107">
                                </el-table-column>
                                <el-table-column
                                prop="homeworkCommitRate"
                                label="作业完成率"
                                width="107">
                                <template slot-scope="scope">
                                        <span>{{scope.row.homeworkCommitRate | percent}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                prop="courseEvaluationCommitRate"
                                label="课程评价提交率"
                                width="107">
                                <template slot-scope="scope">
                                        <span>{{scope.row.courseEvaluationCommitRate | percent}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                prop="avgLearnFinishRate"
                                label="任务完成率"
                                width="107">
                                <template slot-scope="scope">
                                        <span>{{scope.row.avgLearnFinishRate | percent}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                prop="totalScore"
                                label="综合评价得分"
                                >
                                </el-table-column>
                            </el-table>
                        </template>
                        <!-- 模拟滚动条 -->
                        <div class="sildeart" @mousedown="slideart(0,1,1,$event)"></div>
                    </div>    
                </div>
                <div class="after">
                    <div class="beforetitle">训后</div>
                    <div class="aftertable">
                        <template>
                            <el-table
                                :data="tableData2"
                                border
                                style="width:100%;text-align:center">
                                <el-table-column
                                prop="appLoginRate"
                                label="学员登录率"
                                width="107">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.appLoginRate | percent}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column
                                prop="signRate"
                                label="签到率"
                                width="107">
                                <template slot-scope="scope">
                                        <span>{{scope.row.signRate | percent}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                prop="discussJoinRate"
                                label="讨论组参与率"
                                width="107">
                                <template slot-scope="scope">
                                        <span>{{scope.row.discussJoinRate | percent}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                prop="photowallJoinRate"
                                label="照片墙参与率"
                                width="107">
                                <template slot-scope="scope">
                                        <span>{{scope.row.photowallJoinRate | percent}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                prop="topicJoinRate"
                                label="同学圈参与率"
                                width="107">
                                <template slot-scope="scope">
                                        <span>{{scope.row.topicJoinRate | percent}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                prop="homeworkCommitRate"
                                label="作业完成率"
                                width="107">
                                <template slot-scope="scope">
                                        <span>{{scope.row.homeworkCommitRate | percent}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                prop="courseEvaluationCommitRate"
                                label="课程评价提交率"
                                width="107">
                                <template slot-scope="scope">
                                        <span>{{scope.row.courseEvaluationCommitRate | percent}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                prop="clazzEvaluationCommitRate"
                                label="项目评价提交率"
                                width="107">
                                <template slot-scope="scope">
                                        <span>{{scope.row.clazzEvaluationCommitRate | percent}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                prop="avgLearnFinishRate"
                                label="任务完成率"
                                width="107">
                                <template slot-scope="scope">
                                        <span>{{scope.row.avgLearnFinishRate | percent}}</span>
                                </template>
                                </el-table-column>
                                <el-table-column
                                prop="totalScore"
                                label="综合评价得分"
                                >
                                </el-table-column>
                            </el-table>
                        </template>
                    </div>      
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Data from 'model/admindata/admindata'
import API from '@/global/resource'
import Goback from 'base/goback/goback'
export default {
    data() {
        return {
            tableData:[],
            tableData1:[],
            tableData2:[],
            clazzId:'',
            org:'默认',
            clazz:'默认', 
            studentCount:0,
            trainingPeriod:0,
            trainingBeginDate:0,
            trainingEndDate:0,
        }      
    },
    filters: {
        //时间格式转化过滤器
        conversion: function (value) {
            if (!value) return '';
            return value.replace(/-/g,'/')
        },
        //100%过滤器
        percent:function(value){
            if(!value) return 0;
            value=value*100;
            value=value.toFixed(0)+'%';
            return value;
        }
    },
    created(){
        // console.log(classid)
        this.clazzId=this.$route.query.clazzId
        this.getafterdetailData()
    },
    methods:{
        getafterdetailData(){
            let data={
                clazzId:this.clazzId
            }
        Data.getafterdetailData(data,(res=>{
            if(res.status==200){
                 console.log(res.data)
                 this.org=res.data.organizationName
                 this.clazz=res.data.clazzName
                 this.studentCount=res.data.studentCount
                 this.trainingPeriod=res.data.trainingPeriod
                 this.trainingBeginDate=res.data.trainingBeginDate
                 this.trainingEndDate=res.data.trainingEndDate
                // 训前数据
                  let strdata=res.data.beforeTrainingData
                  if(strdata!=undefined){
                        let newArr=[];            
                        let str={};
                        for (const i in strdata) {
                                let key=i;
                                let value=strdata[i];
                                str[key]=value;                      
                        }
                        newArr.push(str);
                        this.tableData=newArr;
                  }
                  
                // 训中数据
                  let strdata1=res.data.inTrainingData
                  if(strdata1!=undefined){
                        let newArr1=[];            
                        let str1={};
                        for (const i in strdata1) {
                                let key=i;
                                let value=strdata1[i];
                                str1[key]=value;                      
                        }
                        newArr1.push(str1);
                        this.tableData1=newArr1;
                  }
                  
                //   讯后数据
                  let strdata2=res.data.afterTrainingData
                  if(strdata2!=undefined){
                        let newArr2=[];            
                        let str2={};
                        for (const i in strdata2) {
                                let key=i;
                                let value=strdata2[i];
                                str2[key]=value;                      
                        }
                        newArr2.push(str2);
                        this.tableData2=newArr2;
                  }
                  
            }
        }))
        },
        // 返回上一页
        goreturn(){
            this.$router.go(-1)
        },
    },

    components: {
        Goback
    }
}
</script>
<style lang="less">
#aftertailcontent{
    width: 100%;
    overflow: hidden;
    .return{
        font-size: 18px;
        color: #666666;
        letter-spacing: 0;
        line-height: 18px;
        margin-top: 22px;
        cursor: pointer;
    }
    .tablebox{
        position: relative;
        margin-top: 20px;
        .tabletitle{
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            box-shadow: 0 4px 7px 1px rgba(0,0,0,0.02);
            height: 96px;
            position: absolute;
            z-index: 3;
            .title{
                width: 100%;
                h1{
                    font-size: 18px;
                    color: #333333;
                    letter-spacing:0;
                    margin-bottom: 10px;
                }
            }
            a{
                float: right;
                font-size: 18px;
                color: #1077D7;
                letter-spacing: 0;
                line-height:40px;
                img{
                    margin-right:4px;
                }
            }
        }
        .tablecontent{
           width: 100%;
            padding:98px 20px 0 20px;
            background-color: #ffffff;
            overflow: hidden;
            margin-bottom: 27px;
            .contenttitle{
                width: 100%;
                overflow: hidden;
                h1{
                    float: left;
                    font-size: 16px;
                    color: #333333;
                    letter-spacing: 0;
                    line-height:82px;
                    margin-right: 60px;
                }
            }
            .before{
               width: 100%;
               overflow: hidden;
               .beforetitle{
                   width: 100px;
                   line-height: 102px;
                   text-align: center;
                   background: #F8FAFF;
                   border: 1px solid #DFE6EC;
                   border-right: none;
                   font-size: 18px;
                    color: #202D3D;
                    float: left;
               }
               .beforetable{
                   float: left;
                   .el-table th{
                       height: 51px;
                       padding: 0;
                       background: #F8FAFF;
                   }
                   .el-table th>.cell {
                        position: relative;
                        word-wrap: normal;
                        text-overflow: ellipsis;
                        vertical-align: middle;
                        width: 100%;
                        box-sizing: border-box;
                        text-align: center;
                        font-size: 18px;
                        color: #333333;
                        font-weight: normal;
                    }
                    .el-table__empty-block{
                        min-height: 51px;
                    }
                    .el-table th.is-leaf {
                        border-bottom: 1px solid #DFE6EC;
                    }
               } 
            }
            .center{
               width: 100%;
               overflow: hidden;
               margin-top: 35px;
               .beforetitle{
                   width: 100px;
                   line-height: 102px;
                    text-align: center;
                   background: #F9FFF6;
                    border: 1px solid #DFE6EC;
                   border: 1px solid #DFE6EC;
                   font-size: 18px;
                  color: #202D3D;
                  float: left;
                  border-right: none;
               }
               .centertable{
                   float: left;
                   width: 830px;
                   position: relative;
                   .el-table th{
                       height: 51px;
                       padding: 0;
                       background: #F9FFF6;
                   }
                   .el-table th>.cell {
                        position: relative;
                        word-wrap: normal;
                        text-overflow: ellipsis;
                        vertical-align: middle;
                        width: 100%;
                        box-sizing: border-box;
                        text-align: center;
                        font-size: 18px;
                        color: #333333;
                        font-weight: normal;
                    }
                    .el-table__empty-block{
                        min-height: 51px;
                    }
                    .el-table th.is-leaf {
                        border-bottom: 1px solid #DFE6EC;
                    }
               } 
            }
            .after{
               width: 100%;
               overflow: hidden;
               margin-top: 35px;
               margin-bottom: 60px;
               .beforetitle{
                   width: 100px;
                   line-height: 102px;
                   text-align: center;
                   background: #FFFBF2;
                    border: 1px solid #DFE6EC;
                   font-size: 18px;
                    color: #202D3D;
                    float: left;
                    border-right:none;
               }
               .aftertable{
                    float: left;
                    width: 830px;
                    position: relative;
                    .el-table th{
                       height: 51px;
                       padding: 0;
                      background: #FFFBF2;
                   }
                   .el-table th>.cell {
                        position: relative;
                        word-wrap: normal;
                        text-overflow: ellipsis;
                        vertical-align: middle;
                        width: 100%;
                        box-sizing: border-box;
                        text-align: center;
                        font-size: 18px;
                        color: #333333;
                        font-weight: normal;
                    }
                    .el-table__empty-block{
                        min-height: 51px;
                    }
                    .el-table th.is-leaf {
                        border-bottom: 1px solid #DFE6EC;
                    }
               } 
            }
            .el-table .cell {
                white-space: normal;
            }
        }
    }

    .el-table__row{
        height: 52px;
    }        
}

</style>


