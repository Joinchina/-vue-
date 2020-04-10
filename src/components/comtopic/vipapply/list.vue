<template>
    <div class="z-content">
        <div class="handle clearfix">
			<Goback passtitle="vip申请"></Goback>

            <div class="searchBox">
                <el-select v-model="type" placeholder="请选择" @change="searchChange">
                    <el-option
                        v-for="item in types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-input placeholder="机构名称" v-model="orgName" class="input-with-select" @keydown.enter.native="searchChange">
                    <el-button slot="append" icon="el-icon-search" @click="getapply"></el-button>
                </el-input>
                <button  type="button" class="z-add-clazz" @click="exportlist">
                    <i  class="z-icon-export-white"></i>
                    导出
                </button>
            </div>
			
		</div>
        <div class="man_list">
            <template>
                <el-table
                    :data="tableData"
                    :stripe="true"
                    style="width: 100%">
                    <el-table-column
                        prop="orgName"
                        label="机构名称"
                        :show-overflow-tooltip="true"
                        width="150">
                        <template slot-scope="scope">
                           <div class="expertname" @click="getexpertdetail(scope.row)">
                               {{ scope.row.orgName }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="vip"
                        label="当前机构类型"
                        :show-overflow-tooltip="true"
                        width="120">
                        <template slot-scope="scope">
                           <span>
                               {{ scope.row.vip ? "VIP" : "免费" }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="startDate"
                        label="合作开始时间"
                        :show-overflow-tooltip="true"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="endDate"
                        label="到期时间"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        label="剩余时长"
                        :show-overflow-tooltip="true"
                        width="80">
                        <template slot-scope="scope">
                            <span>{{ scope.row.days ? scope.row.days : 0}}天</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="申请类型"
                        :show-overflow-tooltip="true"
                        width="80">
                        <template slot-scope="scope">
                            <span>{{ scope.row.type == "NEW" ? "新申请" : "续约" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="content"
                        label="申请内容"
                        :show-overflow-tooltip="true"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="contact"
                        :show-overflow-tooltip="true"
                        label="联系人">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        :show-overflow-tooltip="true"
                        label="联系电话">
                    </el-table-column>           
                    <el-table-column
                        prop="job"
                        :show-overflow-tooltip="true"
                        label="职位">
                    </el-table-column>     
                </el-table>
            </template>
        </div>
        <!-- 分页组件 -->
        <pagination @getpagedata="getpagedata" :pagesize="pagesize" :totalElements="totalElements"></pagination>
    </div>
</template>
<script>
import Goback from 'base/goback/goback'
import pagination from '@/base/modal/pagination'
import httpRequest from '@/model/vipApply/index'
import { getToken } from '@/filters/userVerify'
import API from '@/global/resource'
export default {
    data () {
        return {
           pagesize:20,//每页显示
           totalElements:0,//总数
           tableData:[],
           pagenumber:1,
           orgName:"",
           type:"", 
           types:[
               {
                   label:"全部",
                   value:""
               },
               {
                   label:"新申请",
                   value:"NEW"
               },
               {
                   label:"续约",
                   value:"CONTINUE"
               },
           ]
        }
    },
    filters:{
        time(val){
            let  dateSpan;
            let  tempDate;
            let  iDays;
            let  sDate1=val.startDate;
            let  sDate2=val.endDate;
            sDate1 = Date.parse(sDate1);
            sDate2 = Date.parse(sDate2);
            dateSpan = sDate2 - sDate1;
            dateSpan = Math.abs(dateSpan);
            iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
            return iDays+'天'
        },
    },
    created(){
        this.getapply()
    },
    methods:{       
        //获取分页点击的页数
        getpagedata(val){
            this.pagenumber = val;
            this.getapply();
        },
        //获取列表
        getapply(){
            let data = {
                size : this.pagesize,
                number : this.pagenumber, 
                orgName : this.orgName,
                type : this.type
            };
            httpRequest.applylist( data , (res)=>{
                if( res.status == 200 ){
                    // console.log(res.data)
                    this.tableData = res.data.content;
                    this.totalElements = res.data.totalElements;
                }
            })
        },
        getexpertdetail(val){
            this.$router.push({
                path:"/expert/detail",
                query:{
                    id:val.expertId
                }
            })
        },
        //导出
        exportlist(){
            window.open(API.urls.exportVipApplyList+"?token="+getToken());
        },
        searchChange(){
            this.getpagedata(1)
        }
    },
    components:{
        Goback,
        pagination,
    }
}
</script>
<style lang="less" scoped>
@import "../../../assets/less/icon.less";
@import "../../../assets/less/btn-search.less";
 @import "../../../assets/reset-element-ui/user-table.css";
 .z-content{
     .z-add-clazz{
      float: right;
      padding: 0 15px;
      height: 36px;
      line-height: 36px;
      color: #fff;
      background-color: #11ADA6;
      border-radius: 6px;
      border: 0;
      cursor: pointer;
      margin-left: 12px;
      font-size: 14px;

     
      .z-icon-export-white{
        display: inline-block;
        vertical-align: middle;
        width: 12px;
        height: 12px;
        background: url('../../../assets/img/common/import.png') center center no-repeat;
        background-size: 100% 100%;
      }
    }
    .man_list{
        overflow: hidden;
        margin-bottom: 20px;
    }
    .expertname{
        cursor: pointer;
        color:#11ADA6;
        text-decoration: underline; 
    }
    .searchBox{
        float: right;
        width: 650px;
        .el-select{
            width: 160px;
        }
        .el-input{
            width: 60%;
        }
    }
 }
</style>


