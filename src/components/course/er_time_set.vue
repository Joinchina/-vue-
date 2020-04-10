<template>
<div>
  <el-dialog class="dialog-form" title="起止时间设置"
             :visible.sync="dialogSetTime"
             :close-on-click-modal="false"
             :before-close="close"
              @open="setTimeClear">
    <el-form :model="ruleSetTime"
             :rules="rules"
             ref="ruleSetTime"
             v-loading="loading"
             element-loading-text="拼命加载中">
      <el-form-item label="开始日期：" :label-width="labelWidth">
        <el-date-picker
          v-model="ruleSetTime.beginTime"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="立即开始"
          @change="curBeginTime"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="截止日期：" :label-width="labelWidth">
        <el-date-picker
          v-model="ruleSetTime.endTime"
          value-format="yyyy-MM-dd"
          type="date"
          :placeholder="forever"
          :picker-options="pickerOptions1"
          @change="curEndTime"
        >
        </el-date-picker>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="!loading && submitForm('ruleSetTime')">确定</el-button>
      <el-button @click="close">关闭</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
  import model from 'model/course/course'
export default {
  props:["dialogSetTime","activityId"],
  data(){
    return{
      forever:"永久",
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      ruleSetTime:{
        beginTime:"",
        endTime:""
      },
      rules:{

      },
      labelWidth:"120px",
      loading:false
    }
  },
  methods:{
    setTimeClear(){
        this.loading = false;
        this.ruleSetTime.beginTime = "";
        this.ruleSetTime.endTime = "";

        //编辑-- 查询时间设置
        this.GetActivityDetail();

    },
    GetActivityDetail(){
      var data = {
        id:this.activityId
      }
      model.courseGetActivityDetail(data, (res => {
        if(res.status == 200) {
          if(!!res.data.beginTime){
              this.ruleSetTime.beginTime = res.data.beginTime;
          }else{
            this.ruleSetTime.beginTime = "";
          }

          if(!!res.data.endTime){
            this.ruleSetTime.endTime = res.data.endTime;
          }else{
            this.ruleSetTime.endTime = "";
          }

        }else{
          this.$message.error(res.message);
        }
      }))
    },
    submitForm:function (formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          this.setTimeCreate();
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    setTimeCreate(){
      this.loading = true;
      var data = {
        activityId:this.activityId,
        beginTime:this.ruleSetTime.beginTime,
        endTime:this.ruleSetTime.endTime
      }
      model.courseTimeSet(data, (res => {

        if(res.status == 200) {
          this.$emit("updateTime",{
            bgTime: data.beginTime,
            edTime: data.endTime || '永久'
          });
          this.loading = false;
          this.close();

          //清空信息
          this.ruleSetTime.beginTime = "";
          this.ruleSetTime.endTime = "";


        }else{
          this.loading = false;
          this.$message.error(res.message);
        }
      }))

    },
    close:function () {
      this.$emit('update:dialogSetTime', false);
    },
    curBeginTime:function (val) {
        this.ruleSetTime.beginTime = val;
        this.pickerOptions1 = {
          disabledDate(time) {
           // console.log("times" + time);
            var valArray = val.split("-");
            var y = valArray[0],m =  valArray[1]-1, d = valArray[2];
            var newChangeDate = new Date(y,m,d).getTime();
            return time.getTime() < newChangeDate;
          }
        }
    },
    curEndTime:function (val) {
      this.ruleSetTime.endTime = val;
    }

  }
}
</script>
<style>

</style>
