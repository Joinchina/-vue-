<template>
  <div>
    <el-dialog class="j-dialog-form dialog-form" title="选择组长"
               :visible.sync="dialogChooseLeader"
               :close-on-click-modal="false"
               :before-close="close"
    @open="choooseLeaderList">
      <div class="j-leader-choose">
         <div class="search-tit">
           <div class="search clearfix">
             <input type="text" v-model="searchQuery" placeholder="请输入姓名" v-on:input="searchData()" /><i class="el-icon-search" @click.stop="searchData()"></i>
           </div>
         </div>

        <div style="clear: both"></div>

        <div class="content">
          <el-form ref="allotform" :model="allotform" label-width="80px">
            <el-radio-group v-model="allotform.userId"  @change="seleceUserId">
              <el-radio :label="item.id"
                        v-for="(item,index) in addStudents"
                        :key="index"

              >
                {{item.name}}
              </el-radio>
            </el-radio-group>
            <div class="j-no-data" v-show="noMssageFlag">暂无数据</div>
          </el-form>
        </div>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('allotform')">确定</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import model from '@/model/clazz/group';
  export default {
    props:["dialogChooseLeader"],
    data(){
      return{
        allotform: {
          userId:""
        },
        addStudents:[],
        addStudents2:[],
        searchQuery:"",
        clazzId:"",
        noMssageFlag:false,
        groupId:"",

      }
    },
    created(){
      this.clazzId = this.$route.query.clazzId;
      this.groupId = this.$route.query.groupId;
      this.assginList();
    },
    methods:{
      close () {
        this.$emit('update:dialogChooseLeader', false);
      },
      choooseLeaderList(){
        this.assginList();
        this.addStudents = [];
        this.addStudents2 = [];
        this.noMssageFlag = false;
        this.allotform.userId = "";
      },
      submitForm(formName) {
        if(this.noMssageFlag == true){
          this.$message.error("暂无数据");
          return;
        }
        if(this.allotform.userId == ""){
          this.$message.error("您还未选择组长");
          return;
        }

        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.assginLeader();
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      seleceUserId(item){
         this.allotform.userId = item;
      },
      assginList(){
        var _this = this;
        var data = {
          clazzId:this.clazzId,
          id:this.groupId
        }

        model.groupUserList(data, (res => {
          if(res.status == 200) {
            if(res.data.length != 0){
              this.addStudents = res.data;
              this.addStudents2 = res.data;
              this.addStudents.forEach(function (item,index) {
                  if(item.isLeader){
                    _this.allotform.userId = item.id;
                  }
              })
            }else{
              //暂无数据
              this.noMssageFlag = true;
            }
          } else {
            this.$message.error(res.message);
          }
        }));
      },
      searchData () {
        var _this = this;
        let searchQuery = this.searchQuery && this.searchQuery.toLowerCase();
        searchQuery = searchQuery.trim();
        let data = this.addStudents2;
        // console.log("searchQuery",searchQuery);
        if (searchQuery) {
          data = data.filter(function (row) {
            return Object.keys(row).some(function () {
              _this.noMssageFlag = false;
              return String(row["name"]).toLowerCase().indexOf(searchQuery) > -1
            })
          })
          if(data.length == 0){
             this.noMssageFlag = true;
          }
          this.addStudents = data;
        } else {
          this.addStudents = this.addStudents2;
          if(data.length == 0){
            this.noMssageFlag = true;
          }else{
            this.noMssageFlag = false;
          }


        }

      },
      assginLeader(){
        var data = {
          clazzId:this.clazzId,
          groupId:this.groupId,
          userId:this.allotform.userId
        }
        model.groupLeaderAssign(data, (res => {
          if(res.status == 200) {

            this.$emit("groupLeaderAssign");

            //清空信息
            this.allotform.userId = "";
            this.addStudents = [];
            this.addStudents2 = [];
            this.noMssageFlag = false;

            this.close();

          } else {
            this.$message.error(res.message);
          }
        }));
      }
    }
  }
</script>
<style scoped="" lang="less">
  @import "../../../assets/less/btn-search.less";
  @import "../../../assets/reset-element-ui/form.css";
.j-leader-choose{
  width: 500px;
  margin: 0 auto;
  border:1px solid #d1dbe6;
}
.j-leader-choose .search-tit{
  border-bottom: 1px solid #d1dbe6;
  text-align: center;
  background: #f2f7fc;
  padding-top: 15px;
  padding-bottom: 15px;

}
.j-leader-choose .content{
  padding-left: 28px;
  padding-top: 18px;
  padding-bottom: 25px;
  font-size: 16px;
}
  .j-leader-choose .search{
      float: none!important;
      margin:0 auto;
      background: #fff;
      width: 310px;
      position: relative;
    i{
      position: absolute;
      right: 0;
      top:0;
    }
    input{
      width: 270px!important;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
 .el-radio{
    display: block;
    padding-bottom: 20px;
    margin-left: 15px;
  }
 .j-no-data{
   text-align: center;
   font-size: 14px;
   line-height: 20px;
 }
</style>
