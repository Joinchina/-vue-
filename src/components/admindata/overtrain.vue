<template>
    <div id="zovertraincontent">
        <div class="workdata">
          <img src="../../assets/img/admindata/4.png" alt="">
          <h1>每周数据统计<span>（每周五凌晨00:00更新）</span></h1>
          <div class="adddata">
             <h2>每周新增<span>（第{{week}}周：{{beginDate | conversion}}-{{endDate | conversion}}）</span></h2>
             <router-link :to="{path:'/admindata/admin_data/overdatadetails'}">查看更多>></router-link>
             <ul>
                 <li class="borderright">新增机构<span>{{weekorganizationCount}}</span></li>
                 <li class="borderright">新增班级<span>{{weekclazzCount}}</span></li>
                 <li>新增学员<span>{{weekstudentCount}}</span></li>
             </ul>
          </div>
          <div class="addorg">
             <h2>新增机构-类型分布<span>（第{{week}}周：{{beginDate | conversion}}-{{endDate | conversion}}）</span></h2>
             <template>
                <el-table
                    :data="tableData"
                    border
                    :header-cell-style="{'font-size':'18px','color':'#202D3D','font-weight':'500','background':'#f8f9fb'}"                   
                    style="width: 906px;margin-top:35px;float:left;margin-left:21px;border-right:none;border-bottom:none"
                    :cell-style="cell"
                    >
                    <el-table-column
                    prop="orgType"
                    label="机构类型"
                    align="center"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="organizationCount"
                    label="新增机构"
                    align="center"
                    width="268">
                    </el-table-column>
                    <el-table-column
                    prop="clazzCount"
                    label="新增班级"
                    align="center"
                    width="268">
                    </el-table-column>
                    <el-table-column
                    prop="studentCount"
                    label="新增学员"
                    align="center"
                    width="268">
                    </el-table-column>
                </el-table>
             </template>
          </div>
        </div>
        <div class="alldata">
          <img src="../../assets/img/admindata/3.png" alt="">
          <h1>整体数据统计<span>(每日00:00更新)</span></h1>
          <div class="adddata">
             <h2>全部机构<span></span></h2>
             <ul>
                 <li class="borderright">机构数量<span class="allcolor">{{yearorganizationCount}}</span></li>
                 <li class="borderright">班级数量<span class="allcolor">{{yearclazzCount}}</span></li>
                 <li>学员数量<span class="allcolor">{{yearstudentCount}}</span></li>
             </ul>
          </div>
          <div class="addorg">
             <h2>机构分布<span></span></h2>
             <template>
                <el-table
                    :data="tableDataall"
                    border
                    :header-cell-style="{'font-size':'18px','color':'#202D3D','font-weight':'500','background':'#f8f9fb'}"
                    style="width: 906px;margin-top:35px;float:left;margin-left:21px;border-right:none;border-bottom:none"
                    :cell-style="cell"
                    >
                    <el-table-column
                    prop="orgType"
                    label="机构类型"
                    align="center"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="organizationCount"
                    label="机构数量"
                    align="center"
                    width="268">
                    </el-table-column>
                    <el-table-column
                    prop="clazzCount"
                    label="班级数量"
                    align="center"
                    width="268">
                    </el-table-column>
                    <el-table-column
                    prop="studentCount"
                    label="学员数量"
                    align="center"
                    width="268">
                    </el-table-column>
                </el-table>
             </template>
          </div>
        </div>
    </div>
</template>
<script>
import Data from 'model/admindata/admindata'
    export default {
        data() {
            return {
                weekorganizationCount:"",
                weekclazzCount:"",
                weekstudentCount:"",
                tableData: [],
                yearorganizationCount:"",
                yearclazzCount:"",
                yearstudentCount:"",
                tableDataall:[],
                beginDate:0,
                endDate:0,
                week:0,
                }
        },
        created(){
             this.getweekadddata();
             this.getyearadddata()
        },
        mounted(){
        },
        // 时间格式转化过滤器
        filters: {
            conversion: function (value) {
                if (!value) return '';
                 return value.replace(/-/g,'/')
            }
        },
        methods:{
            cell({row, column, rowIndex, columnIndex}){
                if(row){
                    return {'font-size':'16px','color':'#333333'}
                }
            },
            getweekadddata(){
                let data
                Data.getweekAdd(data,(res=>{
                    if(res.status == 200){
                       console.log('周增长数据',res.data);
                       this.weekorganizationCount=res.data.organizationCount;
                       this.weekclazzCount=res.data.clazzCount;
                       this.weekstudentCount=res.data.studentCount;
                       this.tableData=res.data.details;
                       this.beginDate=res.data.beginDate;
                       this.endDate=res.data.endDate;
                       this.week=res.data.week;
                    }
                }))
            },
            getyearadddata(){
                let data
                Data.getyearAdd(data,(res=>{
                    if(res.status == 200){
                    //    console.log('年增长数据',res.data)
                       this.yearorganizationCount=res.data.organizationCount
                       this.yearclazzCount=res.data.clazzCount
                       this.yearstudentCount=res.data.studentCount
                       this.tableDataall=res.data.details
                    }
                }))
            }
        }
    }
</script>
<style lang="less" >
  @import "../../assets/reset-element-ui/user-table.css";
 #zovertraincontent{
     width: 100%;
     margin-bottom: 20px;
     overflow: hidden;
     .workdata{
    width: 100%;
    overflow: hidden;
    margin-top: 10px;
    img{
        float: left;
        margin: 5px 10px 0 0;
    }
    h1{
        font-size: 26px;
        color: #333333;
        position: relative;
 
        span{
            font-size: 16px;
            color: #999999;
            position: absolute;
            top:8px;
            left:196px;
        }
    }
}
.adddata{
    clear: both;
    margin-top: 20px;
    background-color: #ffffff;
    padding: 20px 20px ;
    border-radius: 5px;
    height: 207px;
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
        font-size: 16px;
        color: #289CF6;
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
            width: 33.33%;
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
.addorg{
    background-color: #ffffff;
    margin-top: 20px;
    overflow: hidden;
    padding: 20px 20px ;
    border-radius: 5px;
    h2{
        font-size: 18px;
        color: #333333;
        float: left;
        span{
            font-size: 16px;
            color:#999999;
        }
    }
    
}
.alldata{
    width: 100%;
    overflow: hidden;
    margin-top: 20px;
     img{
        float: left;
        margin: 5px 10px 0 0;
    }
    h1{
        font-size: 26px;
        color: #333333;
          position: relative;
        span{
            font-size: 16px;
            color: #999999;
             position: absolute;
            top:8px;
            left:196px;
        }
    }
}
.is-center:first-child{
    background: rgb(248, 249, 251);
}
 } 

</style>

