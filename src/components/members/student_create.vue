<template>
  <div id="waddClass">
    <el-dialog class="dialog-form" title="新增学员"
               :visible.sync = "dialogAddClass"
               :close-on-click-modal="false"
               :before-close="close"
               @open="open">
      <el-form :model="ruleAddClass" :rules="rules" ref="ruleAddClass">
        <h1><span></span>基本信息</h1>
        <el-form-item label="姓名：" :label-width="labelWidth" prop="name">
          <el-input v-model.trim="ruleAddClass.name" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别：" :label-width="labelWidth" prop="sex">
          <el-radio-group v-model="ruleAddClass.sex">
            <el-radio label="男" checked="checked"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号：" :label-width="labelWidth" prop="phone">
          <el-input v-model.trim="ruleAddClass.phone" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位：" :label-width="labelWidth" prop="workPlace">
          <el-input v-model.trim="ruleAddClass.workPlace" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <h1><span></span>附加信息</h1>
        <el-form-item label="添加原因：" :label-width="labelWidth" prop="addReason">
          <el-input v-model.trim="ruleAddClass.addReason" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学科：" :label-width="labelWidth" prop="subject">
        <el-input v-model.trim="ruleAddClass.subject" placeholder="" auto-complete="off"></el-input>
      </el-form-item>
        <el-form-item label="学段：" :label-width="labelWidth" prop="learningStage">
          <el-input v-model.trim="ruleAddClass.learningStage" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" :label-width="labelWidth" prop="IDNumber">
          <el-input v-model.trim="ruleAddClass.IDNumber" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <h2>
          <a href="javascript:void(0)" class="more font18" :title="moreTitle" :alt="moreTitle" @click="moreCick">{{ moreTitle }}</a>
        </h2>
        <div v-show="moreFlag">
          <el-form-item label="职称：" :label-width="labelWidth" prop="title">
            <el-input v-model.trim="ruleAddClass.title" placeholder="" auto-complete="off"></el-input>
          </el-form-item>
        <el-form-item label="职务：" :label-width="labelWidth" prop="duty">
          <el-input v-model.trim="ruleAddClass.duty" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="民族：" :label-width="labelWidth" prop="nation">
          <el-input v-model.trim="ruleAddClass.nation" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="省：" :label-width="labelWidth" prop="province">
          <el-input v-model.trim="ruleAddClass.province" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="市" :label-width="labelWidth" prop="city">
          <el-input v-model.trim="ruleAddClass.city" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="QQ" :label-width="labelWidth" prop="qq">
          <el-input v-model.trim="ruleAddClass.qq" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="区县" :label-width="labelWidth" prop="township">
          <el-input v-model.trim="ruleAddClass.township" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="工作电话" :label-width="labelWidth" prop="workTel">
          <el-input v-model.trim="ruleAddClass.workTel" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" :label-width="labelWidth" prop="email">
          <el-input v-model.trim="ruleAddClass.email" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信号" :label-width="labelWidth" prop="wechat">
          <el-input v-model.trim="ruleAddClass.wechat" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学校类别" :label-width="labelWidth" prop="schoolType">
          <el-input v-model.trim="ruleAddClass.schoolType" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学校所在区域" :label-width="labelWidth" prop="schoolArea">
          <el-input v-model.trim="ruleAddClass.schoolArea" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="证书编号" :label-width="labelWidth" prop="certificateCode">
          <el-input v-model.trim="ruleAddClass.certificateCode" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="最高学历" :label-width="labelWidth" prop="degree">
          <el-input v-model.trim="ruleAddClass.degree" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="毕业院校" :label-width="labelWidth" prop="graduateSchool">
          <el-input v-model.trim="ruleAddClass.graduateSchool" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属专业" :label-width="labelWidth" prop="major">
          <el-input v-model.trim="ruleAddClass.major" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="!loading &&submitForm('ruleAddClass')">确定</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 添加成功 -->
    <add-succ
      :dialogAddSucc.sync = "dialogAddSucc"
      title="新增学员"
      :name="name"
      :username="username"
      :userPassword = "userPassword"></add-succ>
  </div>
</template>

<script>
  import model from 'model/members/members'
  import addSucc from 'components/user/add_succ'

  export default {
    data() {
      return {
        username: "",
        name: "",
        userPassword: "",
        dialogAddSucc: false,
        moreFlag:false,
        moreTitle:"点击展开更多",
        ruleAddClass: {
          name: "",
          sex: "女",
          phone: "",
          workPlace:"",
          addReason:"",
          subject:"",
          learningStage:"",
          IDNumber:"",
          title:"",
          duty:"",
          nation:"",
          province:"",
          city:"",
          qq:"",
          township:"",
          workTel:"",
          email:"",
          wechat:"",
          schoolType:"",
          schoolArea:"",
          certificateCode:"",
          degree:"",
          graduateSchool:"",
          major:"",
        },
        rules: {
          name: [
            { required: true, message: '请填写姓名', trigger: 'blur'},
            { max: 12, message: '姓名不能超过12字'}
          ],
        },
        loading:false,
        labelWidth: "120px"
      }
    },
    props: ['dialogAddClass', 'clazzId', 'role'],
    created() {

    },
    methods: {
      open() {
        this.loading = false;
      },
      close() {
        this.$emit('update:dialogAddClass', false);
        // 清空初始值
        this.resetForm('ruleAddClass');
      },
      moreCick(){
          this.moreFlag = !this.moreFlag;
          if(this.moreFlag){
            this.moreTitle = "点击收起更多";
          }else{
            this.moreTitle = "点击展开更多";
          }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.addClass();
            // alert('submit');
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },

      addClass (){
        this.loading = true;
        let data = {
          clazzId: this.clazzId,
          role: this.role,
          name: this.ruleAddClass.name,
          sex: this.ruleAddClass.sex,
          phone: this.ruleAddClass.phone,
          workPlace:this.ruleAddClass.workPlace,
          addReason:this.ruleAddClass.addReason,
          subject:this.ruleAddClass.subject,
          learningStage:this.ruleAddClass.learningStage,
          IDNumber:this.ruleAddClass.IDNumber,
          title:this.ruleAddClass.title,
          duty:this.ruleAddClass.duty,
          nation:this.ruleAddClass.nation,
          province:this.ruleAddClass.province,
          city:this.ruleAddClass.city,
          qq:this.ruleAddClass.qq,
          //区县待确认
          township:this.ruleAddClass.township,
          workTel:this.ruleAddClass.workTel,
          email:this.ruleAddClass.email,
          wechat:this.ruleAddClass.wechat,
          schoolType:this.ruleAddClass.schoolType,
          schoolArea:this.ruleAddClass.schoolArea,
          certificateCode:this.ruleAddClass.certificateCode,
          degree:this.ruleAddClass.degree,
          graduateSchool:this.ruleAddClass.graduateSchool,
          major:this.ruleAddClass.major

        }
        model.createSaveStudent(data, ( res => {
          if( res.status == 200) {
            this.loading = false;
            this.username = res.data.username;
            this.name = res.data.name;
            this.userPassword = res.data.userPassword;
            this.close();
            this.$emit("updateClassUserList");

            // 初始值清空
            this.ruleAddClass.name="";
            this.ruleAddClass.sex="女";
            this.ruleAddClass.phone="";
            this.ruleAddClass.workPlace="";
            this.ruleAddClass.addReason="";
            this.ruleAddClass.subject="";
            this.ruleAddClass.learningStage="";
            this.ruleAddClass.IDNumber="";
            this.ruleAddClass.title="";
            this.ruleAddClass.duty="";
            this.ruleAddClass.nation="";
            this.ruleAddClass.province="";
            this.ruleAddClass.city="";
            this.ruleAddClass.qq="";
            this.ruleAddClass.township="";
            this.ruleAddClass.workTel="";
            this.ruleAddClass.email="";
            this.ruleAddClass.wechat="";
            this.ruleAddClass.schoolType="";
            this.ruleAddClass.schoolArea="";
            this.ruleAddClass.certificateCode="";
            this.ruleAddClass.degree="";
            this.ruleAddClass.graduateSchool="";
            this.ruleAddClass.major="";

            // 清空初始值
            this.resetForm('ruleAddClass');

            // 显示成功弹出框
            this.dialogAddSucc = true;
          } else {
            this.loading = false;
            this.$message.error(res.message);
          }
        }));
      },

      resetForm(formName) {
            this.$refs[formName].resetFields();
      }


    },

    components: {
      addSucc
    }
  }
</script>
<style scoped="" lang="less">
  .el-dialog__body{
    height: 500px;
    overflow-y:auto;
  }
  .el-form{
    width: 70%;
    margin:0 auto;
  }
  .dialog-form .el-form-item{
    margin-bottom: 20px;
  }
  .dialog-form{
    h1{
      font-size:18px;
      font-weight:bold;
      margin-bottom: 15px;
      span{
        background:#ffad57;
        width: 5px;
        height: 18px;
        overflow: hidden;
        margin-right: 10px;
        display: inline-block;
        vertical-align: middle;
      }

    }
    h2{
      text-align: center;
      margin-top: 18px;
      margin-bottom: 16px;
      color: #2f88dc;
      font-weight:normal;
      cursor: pointer;
      a{
        color: #2f88dc;
      }
    }
  }

</style>
