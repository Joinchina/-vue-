<template>
  <div class="j-add-plus">
      <el-dialog class="dialog-form" title="加分"
                 :visible.sync="dialogAddPlus"
                 :close-on-click-modal="false"
                 :before-close="close">
        <!--title-->
        <div class="title">
          <div v-if="miniAvatar !== ''"><img :src="miniAvatar" /></div>
           <div v-else><img src="../../../assets/img/activity/example2.png"/></div>
           {{name}}
        </div>
        <!--content-->
        <div class="reason">
          <h2><span class="require">*</span>&nbsp;选择加分原因</h2>
          <div class="errorMsg" style="display: none">请选择加分原因</div>
          <ul class="clearfix reason-ul">
            <li v-for="(item,index) in manualArray"
                :key="index"
                :class="{ 'active':item.activeFlag }"
                :alt="item.value"
                :title="item.value"
                @click="manualMethod(index)">
              {{item.value}}
            </li>
          </ul>
          <h2><span class="require">*</span>&nbsp;选择分值</h2>
          <div class="errorMsg" style="display: none">请选择分值</div>
          <ul class="clearfix reason-ul">
            <li class="gray"
                :class="{ 'active':item.activeFlag }"
                :key="index"
                :alt="item.value"
                :title="item.value"
                v-for="(item,index) in scoresArray"
                @click="scoreMethod(index)">{{item.value}}
            </li>
          </ul>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm()">确定</el-button>
          <el-button @click="close">关闭</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
  import model from 'model/clazz/integral'
  import bus from "@/global/bus";
  export default {
    props: ['dialogAddPlus','userId'],
    data(){
      return {
          scoresArray:[],
          manualArray:[],
          name:"",
          miniAvatar:"",
          rules:{
            score:"",
            manual:""
          }
      }
    },
    created(){
      this.getPlus();
      var _this = this;
      bus.$on("itergralAddPlus",function (value) {
        _this.name = value.name;
        if(!!value.miniAvatar){
          _this.miniAvatar = value.miniAvatar;
        }

      })

    },
    methods: {
      manualArrayM(scoresArray,manualArray){
        var _this = this;
        scoresArray.forEach(function(item,index){
          _this.$set(item,'activeFlag',false);
        })
        manualArray.forEach(function(item,index){
          _this.$set(item,'activeFlag',false);
        })
      },
      getPlus(){
        var data = {}
        model.IntegraDicFindAll(data, ( res => {
          if(res.status == 200) {
            var _this = this;
            _this.scoresArray = res.data.SCORE;
            _this.manualArray = res.data.MANUAL;
            _this.manualArrayM(_this.scoresArray,_this.manualArray);

          }else{
            this.$message.error(res.message);
          }
        }))
      },
      submitForm(){
        if(this.rules.manual == ""){
            $(".errorMsg:eq(0)").show();
            $(".errorMsg:eq(1)").hide();
            return;
        }
        if(this.rules.score == ""){
          $(".errorMsg:eq(1)").show();
          $(".errorMsg:eq(0)").hide();
          return;
        }
        var data = {
          userId:this.userId,
          reason:this.rules.manual,
          integral:this.rules.score
        }
        model.IntegraSave(data, ( res => {
            if(res.status == 200){
              this.rules.manual = "";
              this.rules.score = "";
              this.manualArrayM(this.scoresArray,this.manualArray);
              this.$emit("updatedialogAddPlus");
              $(".errorMsg").hide();
              this.close();
            }else{
              this.$message.error(res.message);
              this.rules.manual = "";
              this.rules.score = "";
              this.manualArrayM(this.scoresArray,this.manualArray);
              $(".errorMsg").hide();
              this.close();
            }
        }))
      },
      beforeDestroy() {
        bus.$off("itergralAddPlus");
      },
      manualMethod(index){
        this.manualArray.forEach(function (item,index) {
          item.activeFlag = false;
        })
        this.manualArray[index].activeFlag = true;
        this.rules.manual = this.manualArray[index].value;
      },
      scoreMethod(index){
        this.scoresArray.forEach(function (item,index) {
          item.activeFlag = false;
        })
        this.scoresArray[index].activeFlag = true;
        this.rules.score = this.scoresArray[index].value;
      },
      close () {
        this.$emit('update:dialogAddPlus', false);
      }
    }
  }
</script>
<style scoped="" lang="less">
  @import "../../../assets/less/clazz";
.j-add-plus .reason{
    padding-top:18px;
}
.j-add-plus .reason h2{
  font-size: 18px;

}
.j-add-plus .reason-ul{
  margin-left: 41px;
  margin-bottom: 8px;
  margin-top:18px;
}
.j-add-plus .reason-ul li{
  float: left;
  margin-right: 26px;
  margin-bottom: 16px;
  border:1px solid #90cec9;
  width: 114px;
  color:#333;
  text-align: center;
  font-size: 14px;
  border-radius: 4px;
  background: #fcfcfc;
  line-height: 42px;
  height: 42px;
  cursor:pointer;
  display: inline-block;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;

}
.j-add-plus .reason-ul .gray{
    width: 85px;
    border: 1px solid #d2d2d2;
    font-size: 16px;
}
.j-add-plus .reason-ul .active{
  background:#5fa9f6;
  border:1px solid #3f99f6;
  color: #fff;
}
.j-add-plus .reason-ul li:hover{
  background:#5fa9f6;
  border:1px solid #3f99f6;
  color: #fff;
}
.j-add-plus .errorMsg{
  color: #ff4949;
  margin-bottom: 18px;
  margin-left: 13px;
}
</style>
