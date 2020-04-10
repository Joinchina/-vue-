<template>
    <div class="z-content">
        <div class="handle clearfix">
			<Goback passtitle="专家库"></Goback>

			
            <button  type="button" class="z-add-clazz" @click="downlist">
                <i  class="z-icon-export-white"></i>
				导出
			</button>
            <button class="add-clazz" type="button" @click="addexpert">
				<i class="icon-add-white"></i>
				新增专家
			</button>
            <div class="searchbox">
                <el-input
                    placeholder="专家姓名"
                        @blur="searchdown(searchinput)"
                        @keydown.enter.native="searchdown($event,searchinput)"
                    v-model="searchinput">
                </el-input>
                <i slot="prefix" class="el-input__icon el-icon-search" @click="searchdown(searchinput)"></i>
            </div>
		</div>
        <div class="man_list">
            <template>
                <el-table
                :data="tableData"
                :stripe="true"
                style="width: 100%"
                
                >
                <el-table-column
                    prop="name"
                    label="专家姓名"
                    width="100">
                    <template slot-scope="scope">
                           <div class="expertname" @click="getexpertdetail(scope.row)">
                               {{scope.row.name}}
                            </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="手机号"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="workPlace"
                    :show-overflow-tooltip="true"
                    label="单位"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="titleName"
                    label="职称"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="total"
                    label="综合"
                    width="100">                    
                </el-table-column>
                <el-table-column
                    prop="novelty"
                    label="内容创新性"
                    width="100">                   
                </el-table-column>
                <el-table-column
                    prop="practicability"
                    label="内容实用性"
                    width="100">                   
                </el-table-column>
                <el-table-column
                    prop="interaction"
                    label="课堂互动"
                    width="100">                   
                </el-table-column>
                <el-table-column
                    prop="skill"
                    label="授课技巧"
                    width="100">                   
                </el-table-column>
                <el-table-column
                    prop="curriculumFieldVos.name"
                    label="擅长领域"
                    :show-overflow-tooltip=true
                    width="100"> 
                    <template slot-scope="scope">                        
                            <span>{{scope.row | allfont}}</span>
                    </template>                  
                </el-table-column>    
                <el-table-column
                    label="操作"
                >
                    <template slot-scope="scope">
                        <el-button type="text" @click.native="handleEdit(scope)">编辑</el-button>
                        <el-button type="text" @click.native="handleDelete(scope.row)">删除</el-button> 
                    </template>
                </el-table-column>                
                </el-table>
            </template>
        </div>
        <!-- 分页组件 -->
        <pagination @getpagedata="getpagedata" :pagesize="pagesize" :totalElements="totalElements"></pagination>
        <!-- 新增专家 -->
        <addexpert :addeditshow.sync="addeditshow" @updatalist="updatalist"></addexpert>
        <!-- 编辑专家 -->
        <editexpert :editexpertshow.sync="editexpertshow" @updatalist="updatalist" :expertinfo="expertinfo"></editexpert>
    </div>
</template>
<script>
import Goback from 'base/goback/goback'
import addexpert from './addexpert'
import editexpert from './editexpert'
import pagination from '@/base/modal/pagination'
import model from'@/model/expert/expert'
import { getToken } from '@/filters/userVerify'
import API from '@/global/resource'
export default {
    data () {
        return {
            tableData: [],
            number:1,//当前页数
            pagesize:20,//每页显示
            totalElements:0,//总数
            searchinput:'',//搜索字段
            addeditshow:false,//显示隐藏添加专家模态框
            editexpertshow:false,//显示隐藏编辑专家模态框
            expertinfo:{},
        }
    },
    filters:{
        allfont(val){
            // console.log(val)
            if(!val.curriculumFieldVos){
                return ''
            }else{
                let newArr=[];
                val.curriculumFieldVos.forEach(ele => {
                    newArr.push(ele.name)              
                });
                let str=newArr.join('、');
                return str
            }
        }
    },
    created(){
        this.getexpertlise();
    },
    methods:{
        //分页返回的页数
        getpagedata(val){
            this.number=val;
            this.getexpertlise()
        },
        //编辑当前专家
        handleEdit(val){
            //将信息传递给子组件
            console.log("传递给子组件的数据",val)
            this.expertinfo=val.row;
            this.editexpertshow=true;
        },
        //删除当前专家信息

        handleDelete(val){
            let data={
                id:val.id
            }
            this.$confirm('您确定要删除当前专家信息吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                model.deleteexpert(data,(res)=>{
                if(res.status==200){
                        this.$message({
                        message: '删除成功',
                        type: 'success'
                        });
                        this.getexpertlise();
                    }
                })
            }).catch(() => {
                         
            });
           
            
        },
        //执行搜索
        searchdown(){
            this.getexpertlise()
        },
        //新增专家
        addexpert(){
            this.addeditshow=true
        },
        //export导出
        downlist(){
            window.open(API.urls.exportexpert+"?token="+getToken());
        },
        updatalist(){
            this.getexpertlise();
        },
        //获取专家信息列表
        getexpertlise(){
            let data={
                sord: "desc",
                sidx: "createDate",
                keywords:this.searchinput,
                number:this.number,
                size:this.pagesize, 
            };
            console.log(111)
            model.getexpertlist(data,(res)=>{
                if(res.status==200){
                    this.tableData=res.data.content
                    this.totalElements=res.data.totalElements
                }
            })
        },
        getexpertdetail(val){
            console.log(val)
            this.$router.push({
                path:"/expert/detail",
                query:{
                    id:val.id
                }
            })
        },
    },
    components:{
       Goback,
       addexpert,
       pagination,
       editexpert 
    }
}
</script>

<style lang="less" >
@import "../../../assets/less/icon.less";
@import "../../../assets/less/btn-search.less";
 @import "../../../assets/reset-element-ui/user-table.css";
.z-content{
    .z-add-clazz{
      float: right;
      padding: 0 15px;
      height: 40px;
      line-height: 40px;
      color: #fff;
      background-color: #11ADA6;
      border-radius: 6px;
      border: 0;
      cursor: pointer;
      margin-left: 12px;


     
      .z-icon-export-white{
        display: inline-block;
        vertical-align: middle;
        width: 14px;
        height: 14px;
        background: url('../../../assets/img/common/import.png') center center no-repeat;
        background-size: 100% 100%;
      }
    }
    .searchbox{
        width:232px;
        float: right;
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
    .man_list{
        margin-bottom: 20px;
    }
    .expertname{
        cursor: pointer;
        color:#11ADA6;
        text-decoration: underline; 
    }
}
</style>

