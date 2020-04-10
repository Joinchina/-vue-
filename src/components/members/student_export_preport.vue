<template>
<div>
  <el-dialog class="dialog-form dialog-report" title="导出个人报告"
             :visible.sync = "dialogExportPreport"
             :close-on-click-modal="false"
             :before-close="close">
    <!--content_start-->
    <el-form :model="ruleAddClass">
    <div class="export_con">
       <h1>请选择导出形式</h1>
      <el-radio-group v-model="ruleAddClass.sex">
        <el-radio label="0">zip包</el-radio>
        <el-radio label="1">excel表</el-radio>
      </el-radio-group>
    </div>
    </el-form>
    <!--content_end-->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="exportZip('ruleAddClass')">导出个人报告</el-button>
      <el-button @click = "close">关闭</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
  import { getToken } from '@/filters/userVerify'
  import API from '@/global/resource'
  export default {
    data(){
      return{
        ruleAddClass: {
          sex: "0"
        }
      }
    },
    props:["dialogExportPreport"],
    methods:{
      exportZip(ruleAddClass){
        this.clazzId = this.$route.query.clazzId;
        if(this.ruleAddClass.sex == "0"){
           window.open(API.urls.exportZipUserStatistics+"?clazzId="+this.clazzId+"&token="+getToken());
        }else{
           window.open(API.urls.exportExcelUserStatistic+"?clazzId="+this.clazzId+"&token="+getToken());
        }

      },
      close() {
        this.$emit('update:dialogExportPreport', false);
      }
    }
  }
</script>
<style scoped>
  .export_con{
    padding:40px 0 40px 0;
    text-align: center;
  }
  .export_con h1{
     font-size: 16px;
     margin-bottom: 20px;
  }
</style>
