<template>
    <div id="contentdataildata">
        
        <Goback passtitle="周新增数据统计" ></Goback>
        <div class="tablebox">
            <div class="tabletitle">
                <div class="title"><span></span><h1>周新增数据统计</h1></div>
                <a  @click="exportAddweek"><img src="../../assets/img/admindata/1.png" alt="">下载数据</a>
            </div>
            <div class="tablecontent">
                <template>
                    <el-table
                        :data="tableData"
                        stripe
                        style="width:100%;border:1px solid #ebeef5;border-bottom:none;margin-top:18px;text-align:center;font-size: 16px;color: #333333;margin-bottom:20px"
                        :header-cell-style="{'font-size':'18px','color':'#202D3D','font-weight':'500','background':'#f8f9fb','text-align':'center'}">
                        <el-table-column
                        prop=""
                        label="排序"
                        >
                         <template slot-scope="scope">
                             第{{scope.row.week}}周
                          </template> 
                        </el-table-column>
                        <el-table-column
                        prop=""
                        label="时间"
                        width="220">
                          <template slot-scope="scope">
                             {{scope.row.beginDate | conversion}}—{{scope.row.endDate | conversion}}
                          </template>  
                        </el-table-column>
                        <el-table-column
                        prop="organizationCount"
                        label="新增机构">
                        </el-table-column>
                        <el-table-column
                        prop="clazzCount"
                        label="新增班级">
                        </el-table-column><el-table-column
                        prop="studentCount"
                        label="新增学员">
                        </el-table-column>
                    </el-table>
                </template>
               
            </div>
        </div>
    </div>
</template>
<script>
import Data from 'model/admindata/admindata'
import API from '@/global/resource'
import { getToken } from '@/filters/userVerify'
import Goback from 'base/goback/goback'
export default {
    
data() {
        return {
            tableData: [] 
        }      
    },
    created(){
        this.getdata();
    },
    // 时间格式转化过滤器
    filters: {
        conversion: function (value) {
            if (!value) return '';
            return value.replace(/-/g,'/')
        }
    },
    methods:{

        getdata(){
            let data
           Data.getweekAdddetail(data,(res=>{
             if(res.status==200){
                //  console.log(res.data)
                 this.tableData=res.data
             }
           }))
        },
        //  导出数据报表
        exportAddweek(){
           window.open(API.urls.exportAddweek+"?token="+getToken())
        },
        // 返回上一页
        goreturn(){
            this.$router.go(-1)
        }
    },
    components: {
        Goback
    }
}
</script>
<style lang="less">
#contentdataildata{
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
        margin-bottom: 20px;
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
                    margin-right: 10px;
                }
            }
        }
    }
}
.tabpage{
    width: 100%;
.el-pagination {
    text-align: center;
    margin-top: 35px;
    button{
        width:36px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    }
}
.el-pager li{
    width: 44px;
    height: 36px;
    text-align: center;
    line-height: 36px;
}
.el-pager li.active {
    background-color: #35a69d ;
}

.el-pager li:hover {
    color: #35a69d;
}
}

</style>


