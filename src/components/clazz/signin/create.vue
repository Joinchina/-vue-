<template>
<div>
  <el-dialog class="dialog-form" title="创建签到"
             :visible.sync="dialogSignCreate"
             :close-on-click-modal="false"
             :before-close="close"
             @open="open">

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" 	v-loading="loading"
             element-loading-text="拼命加载中">
      <el-form-item label="签到日期：" :label-width="labelWidth" prop="signDate">
        <el-date-picker
          v-model="ruleForm.signDate"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions0"
          @change="changData"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="签到时间：" :label-width="labelWidth" required class='item-margin-none'>
        <el-form-item  prop="beginTime" class="sign-time">
          <el-time-picker  
            v-model="ruleForm.beginTime"
            :picker-options="pickerStart"
            format="HH:mm"
            placeholder="开始时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item prop="endTime" class="sign-time sign-time-r">
          <el-time-picker
             prop="beginTime"
            v-model="ruleForm.endTime"
            format="HH:mm"
            :picker-options="pickerEnd"
            placeholder="结束时间">
          </el-time-picker>
        </el-form-item>

      </el-form-item>
      
      <!-- <el-form-item label="防作弊模式" prop="cheat" :label-width="labelWidth">
        <el-switch
          v-model="ruleForm.cheat">
        </el-switch>
      </el-form-item> -->

    </el-form>
    <div slot="footer" class="dialog-footer">

      <el-button type="primary"  @click="!loading && submitForm('ruleForm')">确定</el-button>
      <el-button @click="close">关闭</el-button>
    </div>

  </el-dialog>
  <!--创建签到成功-->
  <sign-success
    :dialogSignSuccess.sync="signSuccess"
    :signSuccessDataP="signSuccessData"
  >
  </sign-success>


</div>
</template>
<script>
  import model from 'model/clazz/signin'
  import {dateFormatStr,dateFormatTime} from '@/global/open'
  import signSuccess from 'components/clazz/signin/success'

  export default {
    props: ["dialogSignCreate"],
    data () {
      return {
        value1: [],
        lock:"on",
        dataFormat:"",
        clazzId:"",
        signSuccess:false,
        signSuccessData:{},
        loading:false,
        pickerStart:{
          selectableRange: '00:00:00 - 23:59:00'
        },
        pickerEnd:{
          selectableRange: '00:00:00 - 23:59:00'
        },
        pickerOptions0: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7;
          },
        },

        ruleForm: {
          signDate: '',
          beginTime:'',
          endTime: '',
        },
        labelWidth: "120px",
        rules: {
          signDate: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' },
          ],
          beginTime:[
            { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
          ],
          endTime:[
            { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
          ],

        }
      }
    },
    created () {
      this.clazzId = this.$route.query.clazzId;
    },
    methods: {
      open() {
        this.loading = false;
      },
      deFaultTime(){
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hour = date.getHours();
        var minites = date.getMinutes();
        return new Date(year, month, day, hour, minites)
      },
      close () {
        this.$emit('update:dialogSignCreate', false);
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createSign();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      changData(val){
        this.dataFormat = dateFormatStr(val);

        //当前时间对比
        var curDate = dateFormatStr(new Date());
        var inputDate = dateFormatStr(this.ruleForm.signDate);
        //当前时间
        if(curDate == inputDate){
            //this.ruleForm.beginTime = this.deFaultTime();
            this.ruleForm.beginTime = "";
            this.ruleForm.endTime = "";
            var curTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
            this.pickerStart.selectableRange = curTime+" - 23:59:00";
            this.pickerEnd.selectableRange = curTime+" - 23:59:00";
        }else{
          //非当前时间
          //this.ruleForm.beginTime = new Date(2016, 9, 10, 0, 0);
          this.ruleForm.beginTime = "";
          this.ruleForm.endTime = "";
          this.pickerStart.selectableRange = "00:00:00 - 23:59:00";
          this.pickerEnd.selectableRange = "00:00:00 - 23:59:00";
        }
      },
      createSign(){

        this.loading = true;

        var data = {
          signDate:this.dataFormat,
          beginTime:dateFormatTime(this.ruleForm.beginTime),
          endTime:dateFormatTime(this.ruleForm.endTime),
          lock:this.lock,
          clazzId: this.clazzId
        }
        model.signSave(data, (res => {
          if(res.status == 200) {
            this.loading = false;
            this.signSuccess = true;
            this.signSuccessData = res.data;
            this.close();

              //值清空
              this.dataFormat = "";
              this.ruleForm.signDate = "";
              this.ruleForm.beginTime = new Date(2016, 9, 10, 0, 0);
              this.ruleForm.endTime = new Date(2016, 9, 10, 23, 59);
              this.pickerStart.selectableRange = "00:00:00 - 23:59:00";
              this.pickerEnd.selectableRange = "00:00:00 - 23:59:00";

          } else {
            this.loading = false;
            this.$message.error(res.message);
          }
        }));
      }
    },
    components:{
      signSuccess
    }
  }
</script>
<style  lang="less">
.sign-time{
  float: left;
}
.sign-time-r{
  padding-left: 8px;
}
.item-margin-none{
  margin-bottom: 0;
}
.el-time-panel__content::after, .el-time-panel__content::before{
  margin-top: -7px!important;
}

</style>
