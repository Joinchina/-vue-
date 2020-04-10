<template>
<div>
  <el-dialog class="dialog-form" title="添加问答"
             :visible.sync="dialogAddAnswer"
             :close-on-click-modal="false"
             :before-close="close">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="问答标题" prop="name">
        <el-input v-model="ruleForm.name" placeholder="30字以内"></el-input>
      </el-form-item>
      <el-form-item label="问答说明" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc" placeholder="200字以内(选填)"></el-input>
      </el-form-item>
      <el-form-item label="所属课程" prop="course">
        2222222
      </el-form-item>
      <!--<el-button>添加照片</el-button>&nbsp<span class="gray">最多可添加9张</span>-->
      <!--<el-form-item label="专家照片：" :label-width="labelWidth"  prop="photo" class="avatar-uploader">-->

        <!--<img v-if="imageUrl" :src="imageUrl" id="avatarProfessor" class="avatar">-->

        <!--<div v-else class="avatar"><i class="el-icon-plus"></i></div>-->

        <!--<label for="file" class="sel2">选择照片</label>-->
        <!--<input class="sel1" id="file"  type="file" name="ruleAddProfessor.photo" accept="image/png,image/gif,image/jpeg"  @change="selAvatar($event)">-->

      <!--</el-form-item>-->
      <el-form-item :label-width="labelWidth"  prop="photo" class="avatar-uploader">
        <label for="file" class="sel2">选择照片</label>
        <input class="sel1" id="file"  type="file" name="ruleForm.photo" accept="image/png,image/gif,image/jpeg"  @change="selAvatar($event)">
        <div style="margin-top:60px;">
           <img v-for="item in imageUrl" :src="item" class="avatar" style="width:150px;height: 150px;">
          <!--<img :src="imageUrl" class="avatar">-->
        </div>


      </el-form-item>


    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      <el-button @click="close">关闭</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
  import model from 'model/activity/result'
  export default {
    props:["dialogAddAnswer","dialogcourseId"],
    data(){
      return {
        labelWidth: "120px",
        imageUrl: [],
        ruleForm: {
          name: '',
          region: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入问卷标题', trigger: 'blur'},
            {max: 30, message: '问答标题请输入30字以内', trigger: 'blur'}
          ],
          region: [
            { required: false, max:"200", message: '问答请输入200字以内', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      close () {
        this.$emit('update:dialogAddAnswer', false);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
            this.saveQuestion();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      selAvatar (event) {
        let _this = this;
        let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
        alert(extend)
        if (extend == "jpg" || extend == "png" || extend == "gif" || extend == "jpeg") {
          _this.ruleForm.photo = event.target.files;
          let objUrl = event.target.files[0];
          let windowURL = window.URL || window.webkitURL;
          let imageUrl = windowURL.createObjectURL(objUrl);
          _this.imageUrl.push(imageUrl);

        }

      },
      saveQuestion(){
        var data = {
          files:this.ruleForm.photo,
          title:this.ruleForm.name,
          content:this.ruleForm.desc,
          courseId:this.dialogcourseId
        }
        model.answerCreate(data, ( res => {
            if(res.status == 200){
              this.close();
              this.$emit("dialogAddAnswer");
            }else{
              this.$message.error(res.message);
            }
        }))
      }
    }
  }
</script>
<style scoped lang="less">
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
    width: 95px;
    height: 30px;
    background-color: #43bdb3;
    font-size: 14px;
    color: #35a69d;
    color: #fff;
    line-height: 30px;
    text-align: center;
  }
  .sel1 {
    opacity: 0;
  }
  .sel2 {
    margin-left: 10px;
  >i{
    font-size: 12px;
  }
  }
  }
</style>
