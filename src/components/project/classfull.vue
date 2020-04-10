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
                            :header-cell-style="{'text-align':'center'}"
                            tooltip-effect="dark"
                            style="text-align:center"
                            :stripe="true"
                            >                          
                            <el-table-column
                            prop="name"
                            label="课程名称"
                            :show-overflow-tooltip='true'
                            width="140"> 
                            </el-table-column>
                            <el-table-column
                            prop="mainTeacherName"
                            label="专家名称"
                            width="116"
                           >
                            </el-table-column>
                            <el-table-column
                                prop="clazzName"
                                label="班级名字"
                                :show-overflow-tooltip='true'
                                width="116">
                                </el-table-column>
                                <el-table-column
                                prop="studentCount"
                                label="培训人数"
                                width="116">
                                </el-table-column>
                                <el-table-column
                                prop="submitCount"
                                label="投票人数"
                                width="116">
                                <template slot-scope="scope">
                                     <span>{{scope.row.submitCount | percent}}</span>
                                 </template>
                                </el-table-column>
                                <el-table-column
                                prop="satisfiedRate"
                                label="课程满意度"
                                width="116">
                                  <template slot-scope="scope">
                                      <span>{{scope.row.satisfiedRate | conversion(scope.row.submitCount,scope.row)}}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                prop="verySatisfied"
                                label="非常满意"
                                width="116">
                                    <template slot-scope="scope">
                                      <span>{{scope.row.verySatisfied | conversion(scope.row.submitCount,scope.row)}}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                prop="satisfied"
                                label="满意"                       
                                width="116">
                                    <template slot-scope="scope">
                                      <span>{{scope.row.satisfied | conversion(scope.row.submitCount,scope.row)}}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                prop="ordinary"
                                label="一般"
                                width="116">
                                 <template slot-scope="scope">
                                      <span>{{scope.row.ordinary | conversion(scope.row.submitCount,scope.row)}}</span>
                                  </template>
                                </el-table-column>                                
                                <el-table-column
                                prop="notSatisfied"
                                label="不满意"
                                >
                                  <template slot-scope="scope">
                                      <span>{{scope.row.notSatisfied | conversion(scope.row.submitCount,scope.row)}}</span>
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
            passtitle:'课程满意度',
            tableData:[],
            loading_font:this.$globalParam.loadText,
            totalElements:0,
        }
    },
    computed:{
        orgId() {
				return this.$route.query.orgId;
			},
    },
    filters: {
        conversion: function (value,n,w) {
            if(n>0){
                if(w.satisfiedRate!='0.00%' || w.verySatisfied!='0.00%' || w.satisfied!='0.00%' || w.ordinary!='0.00%' || w.notSatisfied!='0.00%'){
                    // w中有一个不为0.00%，则匹配上了模板，此时如果value的值为0.00%，则返回0%；
                    if(value == '0.00%') return '0%'
                }else{
                    // w中都为0.00%，，此时如果value的值为0.00%，则返回0%；
                    if(value=='0.00%') return '自设模板'
                }              
            }
            if(!value) return '0%'
            return value    
        },
        percent:function(value){
           if(value=='0') return '0'
            return value;
        }
    },
    created(){
        this.getclazzstatis();
    },
    methods:{
        exportclass(){
            if(!this.$store.getters.getOrgVipInfo.vip){
                this.$store.state.vipFuncPopFalg = true;
                return;
            }
            window.open(API.urls.exportclazzstatis+"?organizationId="+this.orgId+"&token="+getToken())
        },        
        getclazzstatis(){
            let data={
                number:0,
                organizationId :this.orgId,
                size:20
            };
            model.getclazzstatis(data,(res=>{
                if(res.status==200){
                    //console.log(res.data);
                    this.totalElements=res.data.totalElements;
                    this.tableData=res.data.content;
                    this.loading_font=this.$globalParam.dataEmpty
                    
                }
            }))
        },
       //班级明细分页
       handleCurrentChange(num){
            let data={
                number:num-1,
                organizationId:this.orgId,
                size:20
           };
           model.getclazzstatis(data,(res=>{
                if(res.status==200){
                    this.totalElements=res.data.totalElements;
                    this.tableData=res.data.content;
                    this.loading_font=this.$globalParam.dataEmpty
                }
           })
           )
       },
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
            font-size:20px;
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


