<template>
  <div  id="w-table">
    <el-dialog class="dialog-form" title="分配班主任"
               :visible.sync = "dialogAssignClass"
               :close-on-click-modal="false"
               :before-close="close"
               @open="open">
      <div v-loading="loading"
               element-loading-text="拼命加载中">
      <div class="search">
        <input type="text" placeholder="账号/姓名" v-model="searchQuery"  v-on:input="searchData()"/><i class="el-icon-search" @click.stop="searchData()"></i>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData3"
        class="list"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="班主任列表"
          width="120">
        </el-table-column>
        <el-table-column
          prop="username"
          label=""
          width="120">
        </el-table-column>
        <el-table-column
          prop="sex"
          label=""
          width="120">
        </el-table-column>
        <el-table-column
          prop="phone"
          label=""
          width="">
        </el-table-column>
      </el-table>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="!loading && submitForm('ruleSignClass')">确定</el-button>
            <el-button @click="close">关闭</el-button>
          </div>

        </el-dialog>
  </div>
</template>
<script>
  import model from 'model/members/members'
  import bus from '@/global/bus'
  export default {
    props:["dialogAssignClass"],
    data() {
      return {
        searchQuery:"",
        tableData3:[],
        tableData3S:[],
        multipleSelection: [],
        loading:false,
        userIds:[]
      }
    },
    created(){
      var _this = this;
      _this.getClazzAssign();
      //时时监听分配班主任数据
      bus.$on("assignClass",function(proId) {
        _this.getClazzAssign();
        _this.userIds = [];
        _this.tableData3 = [];
        _this.tableData3S = [];
        _this.searchQuery = "";
        _this.multipleSelection = [];
      });
    },
    methods: {
      open() {
        this.loading = false;
      },
      getClazzAssign(){
        var clazzId = this.$route.query.clazzId;
        var data = {
          clazzId:clazzId
        }
        model.clazzManagerAllotList(data, ( res => {
          var _this =this;
          _this.tableData3 = res.data;
          //搜索 -- 筛选数组
          res.data.forEach(function (item,index,arr) {
            var obj = {
              "name":item.name,
              "phone":item.phone,
              "username":item.username,
              "id":item.id
            }
            _this.tableData3S.push(obj);

          })
        }))
      },
      close() {
        this.$emit('update:dialogAssignClass', false);
      },
      toggleSelection(rows) {
        if (rows) {
          //alert(9999);
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
         // alert(33333);
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      submitForm(clazz){
        this.loading = true;
        var clazzId = this.$route.query.clazzId;
        var _this = this;
        this.multipleSelection.forEach(function (item,index,arr) {
          _this.userIds.push(item.id);
        })
        var data = {
          clazzId:clazzId,
          ids:_this.userIds
        }
        model.allotClazzManager(data, ( res => {
          if( res.status == 200) {
            this.loading = false;
            this.close();
            this.$emit("updateClassUserList");
            //清空input
            this.toggleSelection();
          }else{
             this.$message.error(res.message);
          }
        }))

      },
      searchData () {
        let searchQuery = this.searchQuery && this.searchQuery.toLowerCase();
        searchQuery = searchQuery.trim();
        let data = this.tableData3S;
        if (searchQuery) {
          data = data.filter(function (row) {
            return Object.keys(row).some(function (key) {
              return String(row[key]).toLowerCase().indexOf(searchQuery) > -1
            })
          })
          this.tableData3 = data;

        } else {
          this.tableData3 = this.tableData3S;
        }

      }
    }
  }
</script>
<style scoped="" lang="less">
  @import "../../assets/less/icon.less";
  @import "../../assets/less/btn-search.less";
  @import "../../assets/reset-element-ui/user-table.css";
  .search{
    width: 100%;
    margin-right: 0;
    margin-bottom: 24px;
    position: relative;
    i{
      position: absolute;
      right: 0;
    }
  }
  .search > input{
     width: 95%;
  }

</style>
