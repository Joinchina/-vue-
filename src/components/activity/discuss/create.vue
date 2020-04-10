<template>
  <div>
    <el-dialog class="dialog-form j-add-discuss" title="添加讨论组"
               :visible.sync="dialogAddDiscuss"
               :close-on-click-modal="false"
               :before-close="close"
               @open="open">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="讨论组标题" prop="name">
          <el-input v-model.trim="ruleForm.name" placeholder="30字以内"></el-input>
        </el-form-item>
        <el-form-item label="讨论组说明" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc" placeholder="200字以内(选填)"></el-input>
        </el-form-item>
        <el-form-item :label-width="labelWidth"  prop="photo" class="avatar-uploader" style="margin-top:10px;">
          <label for="file" class="sel2"><span class="icon-dis-add"></span>添加照片</label>
          <input class="sel1 select-file" multiple="true" id="fileName" type="file" name="ruleForm.photo" accept="image/png,image/gif,image/jpeg"  @change="selAvatar($event)">

          <div style="margin-top:60px;margin-left:10px;">
            <ul v-if = "imageUrl.length != ''">
              <li v-for="(item,index) in imageUrl" :key="index">
                <img :src="item" class="avatar" style="width:150px;height: 150px;">
                <span class="icon-dis-error error" @click="deletePic(index,$event)"></span>
              </li>
            </ul>
            <!--<img :src="imageUrl" class="avatar">-->
          </div>
        </el-form-item>
        <el-form-item label="所属课程" prop="course">
          <div v-if="!!taskName">{{taskName}}</div>
          <div v-else>项目任务</div>
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="ruleForm.value1"
            type="date"
            placeholder="永久"
            :picker-options="pickerOptions0">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="权限隐私" prop="permission">
          <el-select v-model="ruleForm.permission" placeholder="隐私">
            <el-option label="隐私" value="PRIVATE"></el-option>
            <el-option label="公开" value="PUBLIC"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参与人" prop="participant" >
          <el-select v-model="ruleForm.members" placeholder="全体成员" @change="memberschange">
            <el-option label="全体成员" value="all"></el-option>
            <el-option label="指定参与人" value="de"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择成员" prop="slectmembers" v-show="dessignFlag">
          <a href="javascript:void(0)" class="icon-dis-choose" @click="studentSelect = true">点击选择成员</a>
          <div class="selectStudent" v-if="selectData.length != 0">
            <ul class="clearfix" >
              <li v-for="(item,index) in selectData" :key="index">{{item.name}}（{{item.id}}）</li>
            </ul>
          </div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="!loading &&submitForm('ruleForm')">发布</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
    <!--选择学员_start-->
    <student-select
      :dialogStudentSelect.sync = "studentSelect"
      :groupTitles = "groupTitle"
      @StudentSelectData="SelectDataMthod"
    ></student-select>
    <!--选择学员_end-->
  </div>
</template>
<script>
  import model from 'model/activity/result'
  import studentSelect from 'components/activity/discuss/student_select'
  import bus from '../../../global/bus'
  export default {
    props:["dialogAddDiscuss","taskName","dialogcourseId"],
    data(){
      return {
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        groupTitle:["学员列表","已选学员列表"],
        value1: '',
        labelWidth: "120px",
        imageUrl: [],
        dessignFlag:false,
        num:0,
        fileArray:[],
        selectData:[],
        ids:[],
        ruleForm: {
          name: '',
          desc:"",
          region: '',
          members:"all",
          value1:"",
          permission:"PRIVATE",
          photo:[],
        },
        rules: {
          name: [
            {required: true, message: '请输入讨论组标题', trigger: 'blur'},
            {max: 30, message: '讨论组标题请输入30字以内', trigger: 'blur'}
          ],
          desc: [
            { required: false, max:200, message: '作业说明请输入200字以内', trigger: 'change' }
          ]
        },
        loading:false,
        studentSelect:false
      }
    },
    methods: {
      open() {
        this.loading = false;
      },
      close () {
        this.$emit('update:dialogAddDiscuss', false);
      },
      SelectDataMthod(data){
        this.selectData = data;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
             this.saveDiscussion();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      selAvatar (event) {
        if(this.num == 9){
          this.$message.error("最多只能添加9张图片");
          return;
        }
        let _this = this;
        let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
        if (extend == "jpg" || extend == "png" || extend == "gif" || extend == "jpeg") {
         // _this.ruleForm.photo = event.target.files[0];
          let objUrl = event.target.files[0];
         // let objUrlT = event.target.files;
          _this.ruleForm.photo.push(objUrl);
          let windowURL = window.URL || window.webkitURL;
          let imageUrl = windowURL.createObjectURL(objUrl);
          _this.imageUrl.push(imageUrl);
        }

        this.num++;

      },
      saveDiscussion(){
        
        var _this = this;
        _this.ids.length = 0;
        this.selectData.forEach(function(item,index){
          _this.ids.push(item["id"]);
        })

        if(this.ruleForm.members == "all"){

           var specifyStudent = false;
          _this.ids.length = 0;
        }else{
          
          var specifyStudent = true;

          if(_this.ids.length == 0){
            this.$message.error("请选择成员!");
            return;
          }

        }
        

        var courseDate = "";
        if(this.ruleForm.value1){
          var d = new Date(this.ruleForm.value1);
          courseDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        }
        
        let data = {
          //files:this.ruleForm.photo,
          title:this.ruleForm.name,
          content:this.ruleForm.desc,
          courseId:this.dialogcourseId,
          endTime:courseDate,
          specifyStudent:specifyStudent,
          openStatus:this.ruleForm.permission,
          ids:_this.ids
        }
        this.loading = true;
        model.courseDiscussSave(data, ( res => {
          if(res.status == 200){
            this.loading = false;
            this.close();
              bus.$emit('discussSuccess',"1");
             // bus.$emit('discussCreate',"1");
            // 初始值清空
            /*选择成员数值清空*/
            this.selectData = [];
            this.ruleForm.name="";
            this.ruleForm.desc="";
            this.ruleForm.region="";
            this.ruleForm.members="all";
            this.ruleForm.value1="";
            this.ruleForm.permission="PRIVATE";
            this.ruleForm.photo=[];
            this.imageUrl = [];
            this.ids = [];
            $("#fileName").val("");
            this.num = 0;

            //选择学员清空数据
            bus.$emit("studentEmpty","1");


          }else{
            this.loading = false;
            this.$message.error(res.message);
          }
        }),_this.ruleForm.photo)
      },
      memberschange(){
        if(this.ruleForm.members == "all"){
          this.dessignFlag = false;
        }else{
          this.dessignFlag = true;
        }
      },
      deletePic(index,event){
        this.num--;
        if(this.num == 0){
          this.num = 0;
        }
        this.imageUrl.splice(index,1);
        this.ruleForm.photo.splice(index,1);
        $("#fileName").val("");


      },
    },
    components:{
      studentSelect
    }
  }
</script>
<style scoped lang="less">
  @import "../../../assets/reset-element-ui/form.css";
  @import "../../../assets/less/activity.less";
  @import "../../../assets/less/icon.less";

  .avatar-uploader {
    .avatar {
      display: inline-block;
      background-color: #fbfdff;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      // cursor: pointer;
      position: relative;
      overflow: hidden;
      text-align: center;

    }
    .el-icon-plus {
      margin-top: 40px;
      margin-top: 34px;
      font-size: 18px;
      color: #999;
    }
    .avatar {
      width: 88px;
      height: 88px;
    }
    .sel2,
    .sel1 {
      position: absolute;
      display: inline-block;
      width: 108px;
      height: 30px;
      background-color: #f2fbfa;
      border:1px solid #82cac3;
      color: #333;
      font-size: 14px;
      line-height: 30px;
      text-align: center;
      border-radius: 3px;
    }
    .sel1 {
      opacity: 0;
      margin: 0 0 0 12px;
    }
    .sel2 {
      margin-left: 10px;
      >i{
        font-size: 12px;
      }
    }
  }
  .avatar-uploader img{
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .avatar-uploader li{
    float:left;
    position: relative;
  }
  .avatar-uploader .error{
    position: absolute;
    right: 0px;
    top: -5px;
  }
  .dialog-form .selectStudent{
    border: 1px solid #bfcbd9;
    padding:10px 5px 10px 20px;
    margin-top: 10px;
    border-radius: 3px;
    max-height:150px ;
    overflow-y:auto;
  }
  .dialog-form .selectStudent li{
    float: left;
    line-height: 25px;
    color: #5d6a7c;
    padding-right: 15px;
  }
  .el-transfer-panel .el-transfer-panel__header{
    color: #35a69d!important;
  }

</style>
