<template>
    <div class="z_content">
         <div class="totle">
              <Goback :passtitle="passtitle"></Goback>
             <button class="add-clazz" type="button"  @click="exportclass">
					<i class="icon-export-white"></i>
					导出
			</button>
         </div>
         <div class="info_table">
            <template>
                        <el-table
                            :data="tableData"
                            :empty-text="loading_font"
                            :stripe="true"
                            style="text-align:center"
                            :header-cell-style="{'text-align':'center'}"
                            tooltip-effect="dark"
                            @sort-change="sort"
                            >                          
                            <el-table-column
                            prop="name"
                            label="班级名称"
                            :show-overflow-tooltip='true'
                            width="140"> 
                            </el-table-column>
                            <el-table-column
                            prop="beginDate"
                            label="开始时间"
                            sortable=custom
                            width="116"
                           >
                            </el-table-column>
                            <el-table-column
                                prop="endDate"
                                label="结束日期"
                                sortable=custom
                                width="116">
                                </el-table-column>
                                <el-table-column
                                prop="studentCount"
                                label="学员数"
                                sortable=custom
                                width="116">
                                </el-table-column>
                                <el-table-column
                                prop="clazzSatisfiedRate"
                                label="项目满意度"
                                sortable=custom
                                width="116">
                                 </el-table-column>
                                <el-table-column
                                prop="historyAvgSignRate"
                                label="历史平均签到率"
                                sortable=custom
                                width="124">
                                 </el-table-column>
                                <el-table-column
                                prop="homeworkCommitRate"
                                label="作业完成率"
                                sortable=custom
                                width="116">
                                </el-table-column>
                                <el-table-column
                                prop="taskCompleteRate"
                                label="任务完成率"                       
                                sortable=custom
                                width="116">
                                </el-table-column>
                                <el-table-column
                                prop="evaluationCommitRate"
                                label="评价率"
                                sortable=custom
                                width="116"> 
                                </el-table-column>
                                
                                <el-table-column
                                prop=""
                                label="操作"
                                >
                                    <template slot-scope="scope">
                                            <el-button  type="text" @click.native="viewcontrast(scope.row)">进入班级</el-button>
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
</template>
<script>
import Goback from '@/base/goback/goback'
import model from 'model/clazz/clazz' //引入接口
import API from '@/global/resource'
import { getToken } from '@/filters/userVerify'
export default {
    data(){
        return {
            passtitle:'班级明细',
            tableData:[],
            loading_font:this.$globalParam.loadText,
            totalElements:0, 
            sidx:'',
            sord:'',
            num:0,           
        }
    },
    filters: {
        //时间格式转化过滤器
        conversion: function (value) {
            if (!value) return '暂无数据';
            return value.replace(/-/g,'/')
        },
        //100%过滤器
        percent:function(value){
           if(!value) return '暂无数据';
            value=value*100;
            value=value.toFixed(0)+'%';
            return value;
        }
    },
     computed:{
        orgId() {
				return this.$route.query.orgId;
			},
    },
    created(){
        this.getClassdetail()
    },
    methods:{
        exportclass(){
            if(!this.$store.getters.getOrgVipInfo.vip){
                this.$store.state.vipFuncPopFalg = true;
                return;
            }
            window.open(API.urls.exportClazzStatistics+"?organizationId="+this.orgId+"&token="+getToken())
        },
        //班级明细
       getClassdetail(){
           let data={
                number:this.num,
                organizationId:this.orgId,
           };
           model.getclassdetail(data,(res=>{
                if(res.status==200){
                    this.loading_font=this.$globalParam.dataEmpty;
                    this.tableData=res.data.content;
                    this.totalElements=res.data.totalElements;
                    //console.log(res.data)
                }
           })
           )
       },
       //班级明细分页
       handleCurrentChange(num){
           this.num=num;
            let data={
                number:num-1,
                organizationId:this.orgId,
                sidx:this.sidx,
                sort:this.sord,
           };
           model.getclassdetail(data,(res=>{
                if(res.status==200){
                    this.loading_font=this.$globalParam.dataEmpty;
                    this.tableData=res.data.content;
                    this.totalElements=res.data.totalElements;
                }
           })
           )
       },
       sort(msg ){
             this.sidx=msg.prop;
             this.sord=msg.order;
            if(this.sord=='ascending'){
                this.sord='ASC';
            }else{
                this.sord='DESC';
            }
            let data={
               number:this.num,
               sidx:this.sidx,
               sort:this.sord,
               organizationId:this.orgId,
           };
           //console.log(data)
           model.getclassdetail(data,(res=>{
               //console.log(res.data)
               if(res.status==200){
                  this.loading_font=this.$globalParam.dataEmpty;
                    this.tableData=res.data.content;
                    this.totalElements=res.data.totalElements;
               }
           }))
      },
      viewcontrast(n){
        window.open("#/clazz/index?clazzId="+n.id)
      }
    },
     components:{
        Goback,
    }
}
</script>
<style lang="less" scoped>
    @import "../../assets/less/btn-search.less";
    @import "../../assets/reset-element-ui/user-table.css";
.z_content{
    width: 100%;
    // overflow: hidden;
    .totle{
        width: 100%;
        // overflow: hidden;
        margin-bottom: 15px;
        a{
            font-size: 16px;
            color: #666666;
             line-height: 40px;
        }
    }
    .info_table{
        width: 100%;
        overflow: hidden;
        background-color: #ffffff;
        border-radius: 4px;
       
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
    .tabpage{

    width: 100%;
    margin: 20px 0;
    text-align: right;
.el-pagination{
        padding: 0
    }

}
    }
}    
.add-clazz{
    position: relative;
    &::after{
      position: absolute;
      right: -6px;
      top: -10px;
      width: 27px;
      height: 15px;
      content: "";
      background: url("../../assets/img/expert/vipLogo.png") center center no-repeat;
      background-size: 27px 14px;
    }
}
</style>


