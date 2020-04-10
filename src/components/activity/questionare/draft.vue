<template>
<div  id="w-table">
  <!--table_stat-->
  <el-table class="list"
            :data = "tableData"
            :empty-text="loading_font"
            stripe
  >
    <el-table-column
      prop="title"
      label="名称"
      width="450">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button type="text" @click.native="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button type="text" @click.native="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!--table_end-->
  <p class="page-sum">共{{totalElements}}条 每页20条</p>
  <!-- 分页 -->
  <div class="pagination">
    <el-pagination
      @current-change ="handleCurrentChange"
      layout="prev, pager, next"
      :page-size ="20"
      :total="totalElements">
    </el-pagination>
  </div>
</div>
</template>
<script>
  import model from 'model/activity/result'
  import { getToken } from '@/filters/userVerify';
  import { delTip } from '@/global/open'
//  import { getApi } from '@/global/util'

  export default {
     created(){
        this.getListdraft();
     },
    data(){
      return {
        tableData:[],
        totalElements: 0,
        cur_page:1,
        paperId:"",
        clazzId:"",
        loading_font:this.$globalParam.loadText
      }
    },
    methods:{
      handleCurrentChange (val) {
        this.cur_page = val;
        this.getListdraft();
      },
      //编辑按钮
      handleEdit(index, row) {
        this.paperId = row.identification;
        this.clazzId = this.$route.query.clazzId;

        this.$router.push({
          path:"/activity/questionare/edit",
          query:{
            type: 'draftEdit',
            clazzId:this.clazzId,
            paperId:this.paperId
          }

        })
        // window.open("/static/page/question_edit.html?clazzId="+this.clazzId+"&paperId="+this.paperId+"&token="+getToken());
      },
      getListdraft(){
        var clazzId = this.$route.query.clazzId;
        var data = {
          clazzId:clazzId,
          number:this.cur_page
        }
        model.draftAct(data, (res => {
          this.tableData = res.data.content;
          this.loading_font=this.$globalParam.dataEmpty
          this.totalElements = res.data.totalElements;
        }))
      },
      //删除
      handleDelete(index,row){
        this.paperId = row.identification;
        let str = "确认删除该问卷草稿吗？";
        delTip(this, str, this.delUser, index);

      },
      delUser(){
        var _this = this;
        var data = {
          paperId:this.paperId
        }
        model.draftDelete(data, (res => {
          if(res.status == 200){
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose() {
                _this.getListdraft();
              }
            });
          }else{
            this.$message.error(res.message);
          }
        }))
      }
    }
  }
</script>
<style scoped>
  @import "../../../assets/reset-element-ui/user-table.css";
</style>
