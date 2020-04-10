<template>
    <div id="zcontent">
        <Goback passtitle="每日训前班级" ></Goback>
        <div class="tablebox">
            <div class="tabletitle">
                <div class="title"><span></span><h1>每日训前班级</h1></div>
                <a @click="downbeforeData"><img src="../../assets/img/admindata/1.png" alt="">下载数据</a>
            </div>
            <div class="tablecontent">
                <template>
                    <el-table
                        :data="tableData"
                        stripe
                        style="width:100%;border:1px solid #ebeef5;border-bottom:none;margin-top:18px;text-align:center;font-size: 16px;color: #333333;"
                        :header-cell-style="{'font-size':'18px','color':'#202D3D','font-weight':'500','background':'#f8f9fb','text-align':'center'}">
                        <el-table-column
                        prop="reportDate"
                        label="时间"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="clazzCount"
                        label="班级数量"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="studentCount"
                        label="学员数量">
                        </el-table-column>
                        <el-table-column
                        prop="managerCount"
                        label="班主任">
                        </el-table-column><el-table-column
                        prop="professorCount"
                        label="专家">
                        </el-table-column>
                    </el-table>
                </template>
                <div class="datanum">
                   <span>共{{totalElements}}条</span><span>每页20条</span>
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
import Goback from 'base/goback/goback'
export default {
  data(){
        return {
            tableData: [],
            totalElements:0,
            totalPages:0, 
        }      
    },
    created(){
        this.getpageData();
    },
    methods:{
        //得到训中的详细分页数据
        getpageData(){
            let data={
                number:1,
                trainingStage:'BEFORE'
            }
            Data.getpageData(data,(res=>{
                if(res.status==200){
                    console.log(res.data);
                    this.tableData=res.data.content;
                    this.totalElements=res.data.totalElements;
                    this.totalPages=res.data.totalPages;
                }
            }))
        },    
        handleCurrentChange(val){
            //分页查询数据
            let data={
                number:val,
                trainingStage:'BEFORE'
            }
            Data.getpageData(data,(res=>{
                if(res.status==200){
                    console.log(res.data);
                    this.tableData=res.data.content;

                }
            }))

        },
        downbeforeData(){
            window.open(API.urls.getdownbeforeData+"?trainingStage="+'BEFORE'+"&token="+getToken())
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
#zcontent{
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

}


</style>


