<template>
    <div id="zdataaftercontent">
          <div class="tablebox">
            <div class="tabletitle">
                <div class="title"><span></span><h1>训后班级（{{totalElements}}）</h1></div>
                <div class="search">
                    <el-input
                        placeholder="班级名/机构名"
                         @blur="handleBlur(searchinput)"
                         @keydown.enter.native="searchdown($event,searchinput)"
                        v-model="searchinput">
                    </el-input>
                    <i slot="prefix" class="el-input__icon el-icon-search" @click="search(searchinput)"></i>
                </div>
                <a @click="downdata"><img src="../../assets/img/admindata/1.png" alt="">下载数据</a>
            </div>
            <div class="tablecontent">

                    <template>
                        <el-table
                            :data="tableData4"
                            max-height="572"
                            style="width: 100%;text-align:center;border:1px solid #E2E8EE;font-size: 16px;color: #333333;"
                            :header-cell-style="{'background':'#EAEDF2','text-align':'center','height':'52px','padding':0,' position':'relative'}"
                             @sort-change="sort"
                             @cell-click="cellclick"
                            tooltip-effect="dark"
                            >                          
                            <el-table-column
                            fixed="left"
                            prop="organizationName"
                            label="机构名"
                            :show-overflow-tooltip='true'
                            width="140"> 
                            </el-table-column>
                            <el-table-column
                            fixed="left"
                            prop="clazzName"
                            label="班级名称"
                            :show-overflow-tooltip='true'
                            width="140"
                           >
                           <template slot-scope="scope">
                                <span style="text-decoration:underline;cursor:pointer">{{scope.row.clazzName}}</span>
                            </template> 
                            </el-table-column>
                            <el-table-column
                                prop="trainingEndDate"
                                label="结束日期"

                                :show-overflow-tooltip='true'
                                width="120">
                                </el-table-column>
                                <el-table-column
                                prop="trainingPeriod"
                                label="培训周期"
                                 :show-overflow-tooltip='true'
                                sortable=custom
                                width="113">
                                </el-table-column>
                                <el-table-column
                                prop="studentCount"
                                label="学员数"
                                 :show-overflow-tooltip='true'
                                sortable=custom
                                width="113">
                                </el-table-column>
                                <el-table-column
                                prop="appLoginRate"
                                label="学员登录率"
                                :show-overflow-tooltip='true'
                                sortable=custom
                                width="113">
                                <template slot-scope="scope">
                                        <span>{{scope.row.appLoginRate | percent}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column
                                prop="signRate"
                                label="签到率"
                                 :show-overflow-tooltip='true'
                                sortable=custom
                                width="113">
                                <template slot-scope="scope">
                                        <span>{{scope.row.signRate | percent}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column
                                prop="homeworkCommitRate"
                                label="作业完成率"
                                 :show-overflow-tooltip='true'
                                sortable=custom
                                width="113">
                                <template slot-scope="scope">
                                        <span>{{scope.row.homeworkCommitRate | percent}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column
                                prop="courseEvaluationCommitRate"
                                label="课程评价提交率"
                                 :show-overflow-tooltip='true'
                                sortable=custom
                                width="113">
                                <template slot-scope="scope">
                                        <span>{{scope.row.courseEvaluationCommitRate | percent}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column
                                prop="clazzEvaluationCommitRate"
                                label="项目评价提交率"
                                 :show-overflow-tooltip='true'
                                sortable=custom
                                width="113">
                                <template slot-scope="scope">
                                        <span>{{scope.row.clazzEvaluationCommitRate | percent}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column
                                prop="photowallJoinRate"
                                label="照片参与率"
                                 :show-overflow-tooltip='true'
                                sortable=custom
                                width="113">
                                <template slot-scope="scope">
                                        <span>{{scope.row.photowallJoinRate | percent}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column
                                prop=""
                                label="讨论组参与率"
                                 :show-overflow-tooltip='true'
                                sortable=custom
                                width="113">
                                <template slot-scope="scope">
                                        <span>{{scope.row.discussJoinRate | percent}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column
                                prop="topicJoinRate"
                                label="同学圈参与率"
                                 :show-overflow-tooltip='true'
                                sortable=custom
                                width="113">
                                 <template slot-scope="scope">
                                        <span>{{scope.row.topicJoinRate | percent}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column
                                prop="avgLearnFinishRate"
                                label="学员任务完成率"
                                 :show-overflow-tooltip='true'
                                sortable=custom
                                width="113">
                                <template slot-scope="scope">
                                        <span>{{scope.row.avgLearnFinishRate | percent}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column
                                prop="totalScore"
                                label="综合评价分"
                                 :show-overflow-tooltip='true'
                                sortable=custom
                                width="113">
                                </el-table-column>
                                <el-table-column
                                prop=""
                                label="对比数据"
                                width="113">
                                    <template slot-scope="scope">
                                            <el-button  type="text" @click.native="viewcontrast(scope.row)">查看</el-button>
                                    </template>
                                </el-table-column>
                            
                        </el-table>
                    </template>
                    
               
                
                <!-- 数据总数 -->
                <div class="datanum">
                   <span>共{{totalElements}}条</span><span>每页20条</span>
                </div>
                <!-- 分页 -->
                <div class="tabpage">
                    <el-pagination
                        layout="prev,pager,next"
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
        tableData4: [],
        view:'查看',
        totalElements:0,
        totalPages:0,
        size:0,
        sidx:'', //排序字段
        sord:'', //排序规则
        number:0, //跳转的页数
        searchinput:'',
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
       this.getafter();
       
    },

    methods: {
       getafter(){
          //默认展示第一页数据
           let data={
               number:1,
           };
           Data.getafterData(data,(res=>{
            //    console.log(res.data)
               if(res.status==200){
                   this.totalElements=res.data.totalElements;
                   this.totalPages=res.data.totalPages;
                   this.size=res.data.size;
                   this.tableData4=res.data.content;
                   this.n=res.data.content.length;
               }
           }))
       }, 
      handleCurrentChange(num){
        //展示第num页数据
        //  console.log("我是点击的第几个：",num)
           this.number=num;
           let data={
               number:this.number,
               sidx:this.sidx,
               sord:this.sord,
                keyword:this.searchinput,
           };
        //    console.log(data)
           Data.getafterData(data,(res=>{
            //    console.log(res.data)
               if(res.status==200){
                   this.tableData4=res.data.content;
                   this.n=res.data.content.length;
               }
           }))
      },
      viewcontrast(row){
          let classid=row.clazzId
          this.$router.push({
					path: '/admindata/admin_data/afterdatadetails',
					query: {
						clazzId:classid,
					}
				})
        //   console.log(classid)
      },
    //   排序数据
      sort(msg ){
             this.sidx=msg.prop;
             this.sord=msg.order;
            if(this.sord=='ascending'){
                this.sord='asc';
            }else{
                this.sord='desc';
            }
            let data={
               number:this.number,
               sidx:this.sidx,
               sord:this.sord,
                keyword:this.searchinput,
           };
           console.log(data)
           Data.getafterData(data,(res=>{
               console.log(res.data)
               if(res.status==200){
                  this.tableData4=res.data.content;
                   this.n=res.data.content.length
                  
               }
           }))
      },
      //搜索
      search(n){
           this.searchinput=n;
           let data={
               keyword:n
           };
           Data.getafterData(data,(res=>{
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
      //导出讯后数据
      downdata(){
        window.open(API.urls.getdownData+"?token="+getToken())
      }
    },

}
</script>
<style lang="less">
#zdataaftercontent{
    width: 100%;
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
            .view{
                color: #3183DA;
                cursor: pointer;
            }
            .el-table .cell{
                // line-height: 18px;
            }
            .el-table .caret-wrapper{
                position: absolute;               
                top:-5px;
                right:-5px;
            } 
            .el-button{
                padding: 0
            } 


            
        }
    }
.has-gutter{
    tr{
        th{
            .cell{
                word-wrap:break-word;
                white-space:pre-wrap;
                }            
            
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
.active{
    background-color: #35a69d;
}
.search{
    width:232px;
    float: left;
    margin-left: 316px;
    .el-input{
        width:188px;
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

