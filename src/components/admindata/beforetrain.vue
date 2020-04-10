<template>
    <div id="zbeforecontent">
          <div class="adddata">
             <h2>训前班级<span>（每日00:00更新）</span></h2>
             <router-link :to="{path:'/admindata/admin_data/beforedatadetails'}">查看全部>></router-link>
             <ul>
                 <li class="borderright">班级数量<span>{{clazzCount}}</span></li>
                 <li class="borderright">学员数量<span>{{studentCount}}</span></li>
                 <li class="borderright">班主任<span>{{managerCount}}</span></li>
                 <li>专家<span>{{professorCount}}</span></li>
             </ul>
          </div>
          <div class="tablebox">
            <div class="tabletitle">
                <div class="title"><span></span><h1>每日训前班级</h1></div>
                <div class="search">
                    <el-input
                        placeholder="班级名/机构名"
                         @blur="handleBlur(searchinput)"
                          @keydown.enter.native="searchdown($event,searchinput)"
                        v-model="searchinput">
                    </el-input>
                    <i slot="prefix" class="el-input__icon el-icon-search" @click="search(searchinput)"></i>
                </div>
                <a @click="getdownData"><img src="../../assets/img/admindata/1.png" alt="">下载数据</a>
            </div>
            <div class="tablecontent">
                    <template>
                        <el-table
                            :data="tableData4"
                            max-height="572"
                            style="width: 100%;text-align:center;border:1px solid #E2E8EE;font-size: 16px;color: #333333;height:auto"
                            :header-cell-style="{'background':'#EAEDF2','text-align':'center','height':'52px','white-space':'pre-wrap'}"
                            @cell-click="cellclick"
                            >                       
                            <el-table-column
                            fixed="left"
                            prop="organizationName"
                            label="机构名"
                            :show-overflow-tooltip=true
                            width="140"                                                       
                            >                            
                            </el-table-column>
                            <el-table-column
                            fixed="left"
                            prop="clazzName"
                            label="班级名称"
                            :show-overflow-tooltip=true
                            width="140"
                            >
                            <template slot-scope="scope">
                                <span style="text-decoration:underline;cursor:pointer">{{scope.row.clazzName}}</span>
                            </template> 
                            </el-table-column>
                                <el-table-column
                                prop="trainingBeginDate"
                                label="开始日期"
                                width="113">
                                </el-table-column>
                                <el-table-column
                                prop="remainingDays"
                                label="倒计时"
                                width="113">
                                </el-table-column>
                                <el-table-column
                                prop="studentCount"
                                label="学员数"
                                width="113">
                                </el-table-column>
                                <el-table-column
                                prop=""
                                label="学员登录率"
                                width="113">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.appLoginRate | percent}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column
                                prop="courseCount"
                                label="课程数"
                                width="113">
                                </el-table-column>
                                <el-table-column
                                prop="multiCourseCount"
                                label="跨天课程"
                                width="113">
                                </el-table-column>
                                <el-table-column
                                prop="signTaskCount"
                                label="签到数"
                                width="113">
                                </el-table-column>
                                <el-table-column
                                prop="resourceCount"
                                label="资源数"
                                width="113">
                                </el-table-column>
                                <el-table-column
                                prop="noticeCount"
                                label="通知数"
                                width="113">
                                </el-table-column>
                                <el-table-column
                                prop="photowallActivityCount"
                                label="照片墙数"
                                width="113">
                                </el-table-column>
                                <el-table-column
                                prop="discussActivityCount"
                                label="讨论组数"
                                width="113"
                                >
                                </el-table-column>
                            
                        </el-table>
                    </template>


                
                <!-- 数据总数 -->
                <div class="datanum">
                   <span>共{{totalElements}}条</span><span>每页{{size}}条</span>
                </div>
                <!-- 分页 -->
                <div class="tabpage" v-show="totalElements!=0">
                    <el-pagination
                        layout="prev, pager, next"
                        :page-size="20"
                        :total="totalElements"
                        @current-change="handleCurrentChange">
                    </el-pagination>
                </div>
            </div>
          </div>

    </div>
</template>
<script>
import Data from 'model/admindata/admindata'
import API from '@/global/resource'
import { getToken } from '@/filters/userVerify'
export default {
    data() {
      return {
        tableData4:[],
        totalElements:0,  //总条数
        size:0,           //每页默认条数
        totalPages:0,     //总页数
        clazzCount:0,
        studentCount:0,
        managerCount:0,
        professorCount:0,
        searchinput:'', //搜索
        orgid:0,
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
       this.getbeforedata();
       this.getstatbeforeDate();
    },
    methods: {
        //得到训前班级数据 
      getbeforedata(){
        //   默认请求第一页数据
          let data={
              number:1
          }
          Data.getbeforeData(data,(res=>{
              if(res.status==200){
                //   console.log(res)
                  this.totalElements=res.data.totalElements;
                  this.size=res.data.size;
                  this.tableData4=res.data.content;
                  this.n=res.data.content.length;
                  if(this.totalElements==0){
                      this.styleshow=false
                  }
              }
          }))
      },
      //得到训前班级统计数据 
      getstatbeforeDate(){
          let data;
          Data.getstatbeforeDate(data,(res=>{
              if(res.status==200){
                //   console.log(res.data)
                  this.clazzCount=res.data.clazzCount
                    this.studentCount=res.data.studentCount
                    this.managerCount=res.data.managerCount
                    this.professorCount=res.data.professorCount
              }
          }))
      },
      handleCurrentChange(num){
        //展示第num页数据
           let data={
               number:num,
               keyword:this.searchinput,
           };
           Data.getbeforeData(data,(res=>{
            //    console.log(res.data)
               if(res.status==200){
                   this.tableData4=res.data.content;
                   this.n=res.data.content.length;
               }
           }))
      },
      //搜索
      search(n){
          this.searchinput=n;
           let data={
               keyword:n
           };
           Data.getbeforeData(data,(res=>{
            //    console.log(res.data)
               if(res.status==200){
                   this.tableData4=res.data.content;
                   this.totalElements=res.data.totalElements;
                   this.size=res.data.size;
               }
           }))
      },
      handleBlur(n){
          this.search(n)
      },
      searchdown(e,n){
         if(e.which==13){
            this.search(n) 
         }
      },
    //   点击机构名跳转
    cellclick(row, column, cell, event){
        this.orgid=row.clazzId;
        if(column.label=='班级名称'){
            window.open("#/clazz/index?clazzId="+this.orgid)
        }
        
    },
      //下载训前数据
      getdownData(){
          window.open(API.urls.getstatbeforeData+"?token="+getToken())
      }
    },

}
</script>
<style lang="less">
#zbeforecontent{
    width: 100%;
.adddata{
    clear: both;
    margin-top: 20px;
    background-color: #ffffff;
    padding: 20px 20px ;
    border-radius: 5px;
    height: 207px;
    box-shadow: 0 0 7px 0 rgba(0,0,0,0.03);
    h2{
        font-size: 18px;
        color: #333333;
        float: left;
        span{
            font-size: 16px;
            color:#999999;
        }
    }
    a{
        float: right;
        font-size: 18px;
        color: #289CF6;
        letter-spacing: 0;
        text-align: right;
        line-height: 20px;
        margin: 6px 10px 6px 10px;
    }
    ul{
        clear: both;
        background-color: #ffffff;
        border-right: none;
        width: 100%;
        overflow: hidden;
        li{
            float: left;
            width: 25%;
            height: 84px;
            text-align: center;
            margin: 45px 0 0 0;
            font-size: 18px;
            color: #666666;
            span{
                display: block;
                margin-top: 25px;
                font-size: 38px;
                color: #417505;
                letter-spacing: 0;
                line-height: 36px;
                }
            }
        }
    }
.borderright{
 border-right: 1px solid rgba(0, 0, 0,0.1)
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
            height: 76px;
            position: absolute;
            z-index: 3;
            .title{
                float: left;
                width: 300px;
                span{
                    width: 7px;
                    height: 21px;
                    background: #35A69D;
                    float: left;
                    margin: 8px 10px 7px 0;
                }
                h1{
                    font-size: 20px;
                    color: #333333;
                    letter-spacing: 0;
                    line-height: 35px;
                }
            }
            a{
                float: right;
                font-size: 18px;
                color: #1077D7;
                letter-spacing: 0;
                line-height:40px;
                cursor: pointer;
                img{
                    margin-right:4px;
                }
            }
        }
        .tablecontent{
            width: 100%;
            padding:90px 20px 0 20px;
            background-color: #ffffff;
            overflow: hidden;
            margin-bottom: 27px;
            .el-table th div, .el-table th>.cell{
                font-size: 18px;
                font-weight: normal;
                color: #202D3D;;
            }
            .datanum{
                width: 100%;
                text-align: right;
                font-size: 14px;
                color: #666666;
                letter-spacing: 0;
                text-align: right;
                line-height: 14px;
                margin: 20px 0 0 0;
                span{
                    margin-left: 10px;
                }
            }
            .el-table__fixed{
                box-shadow: 0 0 10px  rgba(0,0,0,0.2);
            }
            .el-table__body-wrapper.is-scrolling-left~.el-table__fixed, .el-table__body-wrapper.is-scrolling-none~.el-table__fixed, .el-table__body-wrapper.is-scrolling-none~.el-table__fixed-right, .el-table__body-wrapper.is-scrolling-right~.el-table__fixed-right {
                -webkit-box-shadow: 0 0 7px 0 rgba(0,0,0,0.03);
               box-shadow: 0 0 10px  rgba(0,0,0,0.2);
            } 
            
            .el-table__row{
                height:52px!important;
            }
            .el-table__empty-block{
                
              min-height: 52px;
            }
            .el-table__empty-text{
                margin-left: -296px;
            }
            .el-table__header{
                background-color: #f00!important
            }
        }
    }
.tabpage{

    width: 100%;
    margin: 20px 0;
    text-align: right;
.el-pagination{
        padding: 0
    }

}
.search{
    width:232px;
    float: left;
    margin-left: 316px;
    .el-input{
        width:190px;
        float: left;
        .el-input__inner{
            border-top-right-radius:0px;
            border-bottom-right-radius: 0px; 
        }
    }
    .el-input__icon{
        width: 40px;
        height: 40px;
        border: 1px solid #dcdfe6;
        border-left: none;
        cursor: pointer; 
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }
}
}
</style>

