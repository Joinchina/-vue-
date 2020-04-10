<template>
    <div class="z-content">
        <div class="handle clearfix">
			<Goback passtitle="申请专家联系表"></Goback>

			<button  type="button" class="z-add-clazz" @click="exportlist">
                <i  class="z-icon-export-white"></i>
				导出
			</button>
		</div>
        <div class="man_list">
            <template>
                <el-table
                    :data="tableData"
                    :stripe="true"
                    style="width: 100%">
                    <el-table-column
                        prop="expertName"
                        label="专家"
                        :show-overflow-tooltip="true"
                        width="80">
                        <template slot-scope="scope">
                           <div class="expertname" @click="getexpertdetail(scope.row)">
                               {{scope.row.expertName}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="expertPhone"
                        label="专家电话"
                        :show-overflow-tooltip="true"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop=""
                        label="申请人姓名"
                        :show-overflow-tooltip="true"
                        width="120">
                        <template slot-scope="scope">
                           
                                <span>{{scope.row.contact}}</span>
                           
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="telephone"
                        label="联系方式"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="organizationName"
                        label="机构"
                        :show-overflow-tooltip="true"
                        width="150">
                        <template slot-scope="scope">
                            
                                <span>{{scope.row.organizationName}}</span>
                           
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="projectName"
                        label="项目名称"
                        :show-overflow-tooltip="true"
                        width="150">
                        <template slot-scope="scope">
                         
                                <span>{{scope.row.projectName}}</span>
                           
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="projectType"
                        label="项目类型"
                        :show-overflow-tooltip="true"
                        width="150">
                        <template slot-scope="scope">
                            
                                <span>{{scope.row.projectType}}</span>
                         
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="项目周期"
                        width="80">
                        <template slot-scope="scope">
                            {{scope.row | time}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createDate"
                        label="申请时间"
                        width="">
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
import model from'@/model/expert/expert'
import { getToken } from '@/filters/userVerify'
import API from '@/global/resource'
export default {
    data () {
        return {
           pagesize:20,//每页显示
           totalElements:0,//总数
           tableData:[],
           pagenumber:1, 
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
            console.log(val)
            this.pagenumber=val;
            this.getapply();
        },
        //获取列表
        getapply(){
            let data={
                size:this.pagesize,
                number:this.pagenumber, 
            };
            model.applylist(data,(res)=>{
                if(res.status==200){
                    // console.log(res.data)
                    this.tableData=res.data.content;
                    this.totalElements=res.data.totalElements;
                }
            })
        },
        getexpertdetail(val){
            console.log(val)
            this.$router.push({
                path:"/expert/detail",
                query:{
                    id:val.expertId
                }
            })
        },
        //导出
        exportlist(){
            window.open(API.urls.applyexport+"?token="+getToken());
        },
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
 }
</style>


