<template>
  <div id="weditClass">
    <el-dialog class="dialog-form" title="编辑学员"
               :visible.sync="dialogEditClass"
               :close-on-click-modal="false"
               :before-close="close"
               @open="getUser">
      <el-form :model="ruleEditClass" :rules="rules" ref="ruleEditClass" class="studentEdit">
        <div class="title" style="font-size: 20px;"><span class="title-icon"></span>基本信息</div>
        <el-form-item label="姓名：" :label-width="labelWidth" prop="name">
          <el-input v-model.trim="ruleEditClass.name" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别：" :label-width="labelWidth" prop="sex">
          <el-radio-group v-model="ruleEditClass.sex">
            <el-radio label="男" checked="checked"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号：" :label-width="labelWidth" prop="phone">
          <el-input v-model.trim="ruleEditClass.phone" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位：" :label-width="labelWidth" prop="workPlace">
          <el-input v-model.trim="ruleEditClass.workPlace" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <div class="title" style="font-size: 20px;"><span class="title-icon"></span>附加信息</div>
        <el-form-item label="添加原因：" :label-width="labelWidth" prop="addReason">
          <el-input v-model.trim="ruleEditClass.addReason" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学科：" :label-width="labelWidth" prop="subject">
          <el-input v-model.trim="ruleEditClass.subject" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学段：" :label-width="labelWidth" prop="learningStage">
          <el-input v-model.trim="ruleEditClass.learningStage" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" :label-width="labelWidth" prop="IDNumber">
          <el-input v-model.trim="ruleEditClass.IDNumber" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <div class="more"><a href="javascript:void(0)" class="blue" @click="flagMethod" :title="moreTitle" :alt="moreTitle">{{ moreTitle }}</a></div>
        <div v-show="flagMore">
        <el-form-item label="职称：" :label-width="labelWidth" prop="title">
          <el-input v-model.trim="ruleEditClass.title" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="职务：" :label-width="labelWidth" prop="duty">
          <el-input v-model.trim="ruleEditClass.duty" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="民族：" :label-width="labelWidth" prop="nation">
          <el-input v-model.trim="ruleEditClass.nation" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="省：" :label-width="labelWidth" prop="province">
          <el-input v-model.trim="ruleEditClass.province" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="市" :label-width="labelWidth" prop="city">
          <el-input v-model.trim="ruleEditClass.city" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="QQ" :label-width="labelWidth" prop="qq">
          <el-input v-model.trim="ruleEditClass.qq" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="区县" :label-width="labelWidth" prop="township">
          <el-input v-model.trim="ruleEditClass.township" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="工作电话" :label-width="labelWidth" prop="workTel">
          <el-input v-model.trim="ruleEditClass.workTel" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" :label-width="labelWidth" prop="email">
          <el-input v-model.trim="ruleEditClass.email" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信号" :label-width="labelWidth" prop="wechat">
          <el-input v-model.trim="ruleEditClass.wechat" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学校类别" :label-width="labelWidth" prop="schoolType">
          <el-input v-model.trim="ruleEditClass.schoolType" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学校所在区域" :label-width="labelWidth" prop="schoolArea">
          <el-input v-model.trim="ruleEditClass.schoolArea" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="证书编号" :label-width="labelWidth" prop="certificateCode">
          <el-input v-model.trim="ruleEditClass.certificateCode" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="最高学历" :label-width="labelWidth" prop="degree">
          <el-input v-model.trim="ruleEditClass.degree" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="毕业院校" :label-width="labelWidth" prop="graduateSchool">
          <el-input v-model.trim="ruleEditClass.graduateSchool" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属专业" :label-width="labelWidth" prop="major">
          <el-input v-model.trim="ruleEditClass.major" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleEditClass')">确定</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import model from 'model/user/user_manage'
  import bus from '@/global/bus'

  export default {
    data() {
      return {
        ruleEditClass: {
          name: "",
          sex: "女",
          phone: ""
        },
        rules: {
          name: [
            { required: true, message: '请填写姓名', trigger: 'blur'},
            { max: 12, message: '姓名不能超过12字'}
          ],
          sex: [
            { required: false, message:'请选择性别', trigger: 'change'}
          ]
        },
        labelWidth: "120px",
        moreTitle:"点击展开更多",
        flagMore:false
      }
    },
    props: ['dialogEditClass', 'clazzId', 'role', 'userId'],
    created() {
      // this.getUser();
    },
    methods: {
      flagMethod(){
         this.flagMore = !this.flagMore;
        if(this.flagMore){
          this.moreTitle = "点击收起更多";
        }else{
          this.moreTitle = "点击展开更多";
        }
      },
      close() {
        this.$emit('update:dialogEditClass', false);
      },
      getUser () {
        let data = {
          id: this.userId
        }
        model.getUser(data, ( res => {
          //console.log("getuser", res);
          if( res.status == 200) {
            this.ruleEditClass.name = res.data.name;
            this.ruleEditClass.sex = res.data.sex;
            this.ruleEditClass.phone = res.data.phone;
            this.ruleEditClass.workPlace = res.data.workPlace;
            this.ruleEditClass.addReason = res.data.addReason;
            this.ruleEditClass.subject = res.data.subject;
            this.ruleEditClass.learningStage = res.data.learningStage;
            this.ruleEditClass.IDNumber = res.data.idnumber;
            this.ruleEditClass.title = res.data.title;
            this.ruleEditClass.duty = res.data.duty;
            this.ruleEditClass.nation = res.data.nation;
            this.ruleEditClass.province = res.data.province;
            this.ruleEditClass.city = res.data.city;
            this.ruleEditClass.qq = res.data.qq;
            this.ruleEditClass.township = res.data.township;
            this.ruleEditClass.workTel = res.data.workTel;
            this.ruleEditClass.email = res.data.email;
            this.ruleEditClass.wechat = res.data.wechat;
            this.ruleEditClass.schoolType = res.data.schoolType;
            this.ruleEditClass.schoolArea = res.data.schoolArea;
            this.ruleEditClass.certificateCode = res.data.certificateCode;
            this.ruleEditClass.degree = res.data.degree;
            this.ruleEditClass.graduateSchool = res.data.graduateSchool;
            this.ruleEditClass.major = res.data.major;
            this.ruleEditClass = JSON.parse(JSON.stringify(this.ruleEditClass));
          } else {
            this.$message.error(res.message);
          }
        }));
      },
      close() {
        this.$emit('update:dialogEditClass', false);
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.editClass();
            // alert('submit');
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },

      editClass (){
        let data = {
          id: this.userId,
          clazzId: this.clazzId,
          role: this.role,
          name: this.ruleEditClass.name,
          sex: this.ruleEditClass.sex,
          phone: this.ruleEditClass.phone,
          workPlace:this.ruleEditClass.workPlace,
          addReason:this.ruleEditClass.addReason,
          subject:this.ruleEditClass.subject,
          learningStage:this.ruleEditClass.learningStage,
          IDNumber:this.ruleEditClass.IDNumber,
          title:this.ruleEditClass.title,
          duty:this.ruleEditClass.duty,
          nation:this.ruleEditClass.nation,
          province:this.ruleEditClass.province,
          city:this.ruleEditClass.city,
          qq:this.ruleEditClass.qq,
          //区县待确认
          township:this.ruleEditClass.township,
          workTel:this.ruleEditClass.workTel,
          email:this.ruleEditClass.email,
          wechat:this.ruleEditClass.wechat,
          schoolType:this.ruleEditClass.schoolType,
          schoolArea:this.ruleEditClass.schoolArea,
          certificateCode:this.ruleEditClass.certificateCode,
          degree:this.ruleEditClass.degree,
          graduateSchool:this.ruleEditClass.graduateSchool,
          major:this.ruleEditClass.major

        }
        model.orgEditUser(data, ( res => {
          if( res.status == 200) {
            this.close();
            this.$emit("updateClassUserList");
            bus.$emit("updateStuUserList", "STUDENT")
          } else {
            this.$message.error(res.message);
          }
        }));
      }


    },

    watch: {
      userId: 'getUser'
    }
  }
</script>
<style scoped="">
  @import "../../assets/reset-element-ui/form.css";
  /*编辑学员层*/
  /*.studentEdit{*/
     /*width: 405px;*/
     /*margin:0 auto;*/
  /*}*/
  .studentEdit .title{
    font-size: 18px;
    color: #333;
    margin-bottom: 19px;
  }
  .studentEdit .title-icon{
    width: 4px;
    height: 18px;
    background: #ffad57;
    overflow: hidden;
    display: inline-block;
    margin-right: 8px;
  }
  .studentEdit .more{
    text-align: center;
    font-size: 18px;
    color:#2f8dcc;
    margin-bottom: 16px;
  }
  .studentEdit .el-form-item{
    margin-bottom: 20px;
  }
</style>
