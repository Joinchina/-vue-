<template>
  <div class="j-allot">
    <el-dialog class="dialog-form" :title="transferGroupTitle"
               :visible.sync="dialogAllotGroup"
               :close-on-click-modal="false"
               :before-close="close">
      <el-form ref="allotform" :model="allotform" label-width="80px">
        <el-radio-group v-model="allotform.groupId" class="j-leader-choose"  @change="seleceUserId">
            <el-radio
              :label="item.groupId"
              v-for="(item,index) in transferData"
              :key="index">
              {{item.name}}
              <span class="orange" v-if="item.groupId == groupId" style="font-weight: normal;font-size:14px;">（{{ targetGroupText }}）</span>
            </el-radio>

        </el-radio-group>
      </el-form>
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
      props:["dialogAllotGroup","transferGroupTitle","studentIdCur","assigned","transfer"],
      data(){
          return{
            allotform: {
              groupId:""
            },
            clazzId:"",
            studentId:"",
            groupId:"",
            targetGroupId:"",
            targetGroupText:"当前所属小组",
            transferData:[]
          }
      },
       created(){
        this.clazzId = this.$route.query.clazzId;
        this.groupId =  this.$route.query.groupId;
        if(!! this.groupId){
          this.targetGroupId = this.groupId;
          this.allotform.groupId = this.groupId;
        }else{
          this.targetGroupId = "";
          this.allotform.groupId = "";
        }

         //详情 -- 调组
         //未分组 -- 分配小组
         this.getData();

       },
      methods:{
        close () {
          this.$emit('update:dialogAllotGroup', false);
        },
        seleceUserId(item){
          this.targetGroupId = item;
        },
        getData(){
          var _this = this;
          var data = {
            clazzId:this.clazzId
          }
          model.groupList(data, (res => {
            if(res.status == 200) {
              _this.transferData = res.data;
            } else {
              this.$message.error(res.message);
            }
          }));
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if(valid) {
              //调组 （班级管理 -- 小组管理 -- 查看详情)
              if(!!this.transfer){
                this.tansferGroup();
              }
              //分配小组
              if(!!this.assigned){
                if(this.targetGroupId == ""){
                  this.$message.error("请选择小组");
                  return;
                }
                this.assignGroup();
              }

            } else {
              console.log('error submit!!');
              return false;
            }
          })
        },
        studentIdCurM(){
            this.studentId = this.studentIdCur;
        },
        tansferGroup(){
          var data = {
            ids:[""+this.studentId+""],
            clazzId:this.clazzId,
            currentGroupId:this.groupId,
            targetGroupId:this.targetGroupId
          }
          model.groupUserMove(data, (res => {
            if(res.status == 200) {
              this.$emit("groupAssgin");
              this.$message.success('调组成功！');

              //清空数据
              this.allotform.groupId = this.groupId;
              this.close();
            } else {
              this.$message.error(res.message);
            }
          }));
        },
        assignGroup(){
          var data = {
            clazzId:this.clazzId,
            groupId:this.targetGroupId,
            ids:[""+this.studentId+""]
          }
          model.groupUserAdd(data, (res => {
            if(res.status == 200) {
              this.$emit("groupAssgin");
              this.$message.success('分配小组成功！');

              //清空数据
              this.allotform.groupId = "";
              this.groupId = "";
              this.targetGroupId = "";
              this.close();
            } else {
              this.$message.error(res.message);
            }
          }));
        }
      },
      watch:{
        studentIdCur:"studentIdCurM"
      }
  }
</script>
<style scoped="" lang="less">
  @import "../../../assets/reset-element-ui/form.css";
  .j-allot{
    padding-left: 50px;
  }
  .el-radio{
    display: block;
    padding-bottom: 20px;
    margin-left: 15px;
  }
</style>
