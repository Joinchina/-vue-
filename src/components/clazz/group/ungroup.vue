<template>
  <div class="j-ungroup">
    <!--面包屑-->
    <Goback :passtitle="passtitle"></Goback>
    <div class="round-layout">

      <!--头部-->
      <div class="top mg-b16 clearfix">
        <span class="w-sum">未分组学员：{{totalMembers}}人</span>
        <div class="search">
          <input type="text" v-model="searchQuery" placeholder="姓名" @keyup.13="getUngroupList()"/><i class="el-icon-search" @click.stop="getUngroupList()"></i>
        </div>
      </div>

      <!--列表-->
      <div class="el-table-width">
        <el-table class="list"
                   :empty-text="loading_font"
                  :data = "tableData" stripe>
          <el-table-column
            prop="name"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click.native="handleEdit(scope.$index, scope.row)">分配小组</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--footer-->
        <div class="j-page-footer">
           <p class="p-nodis">共{{totalElements}}条&nbsp;每页20条</p>
        </div>
        <!--分页-->
        <div class="pagination">
          <el-pagination
            @current-change ="handleCurrentChange"
            layout="prev, pager, next"
            :page-size="20"
            :total="totalElements">
          </el-pagination>
        </div>
      </div>

    </div>
    <!--分配小组-->
    <allot-group
      :transferGroupTitle = "transferTitle"
      :assigned="1"
      :studentIdCur = "studentId"
      :dialogAllotGroup.sync="allotGroup"
      @groupAssgin = "successMethod">

    </allot-group>


  </div>
</template>
<script>
  import Goback from 'base/goback/goback';
  import allotGroup from 'components/clazz/group/allot';
  import model from 'model/clazz/group'
  export default {
    data(){
      return{
        clazzId:"",
        searchQuery:"",
        studentId:"",
        transferTitle:"分配小组",
        allotGroup:false,
        tableData:[],
        cur_page:1,
        totalElements:0,
        totalMembers:0,
        passtitle:'未分组学员',
        loading_font:this.$globalParam.loadText
      }
    },
    created(){
         this.clazzId = this.$route.query.clazzId;
         this.getUngroupList();

    },
    methods:{
      handleCurrentChange(val){
        this.cur_page = val;
        this.getUngroupList();
      },
      getUngroupList(){
        var data = {
          clazzId:this.clazzId,
          name:this.searchQuery,
          number:this.cur_page,
          size:20
        }
        model.groupUngrouped(data, ( res => {

          if(res.status == 200){
            this.totalElements = res.data.totalElements;
            this.loading_font=this.$globalParam.dataEmpty;
            if(this.searchQuery == ""){
              this.totalMembers = this.totalElements;
            }
            this.tableData = res.data.content;
          }else{
            this.$message.error(res.message)
          }


        }))
      },
      handleEdit(index,row){
        this.studentId = row.id;
        this.allotGroup = true;
      },
      successMethod(){
        this.getUngroupList();
      }
    },
    components:{
      Goback,
      allotGroup
    }

}
</script>
<style scoped="" lang="less">
  @import "../../../assets/less/icon.less";
  @import "../../../assets/less/btn-search.less";
  @import "../../../assets/reset-element-ui/user-table.css";
  .j-ungroup{
     .top{
        padding:16px 44px 16px 20px;
        border-bottom: 1px solid #e6e6e6;
     }
     .w-sum{
        margin-top:8px;
        display: inline-block;
     }
     .el-table-width{
       width: 60%;
       margin-left: 35px;
     }
  }
</style>
