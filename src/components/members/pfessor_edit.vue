<template>
  <div id="weditProfessor">
    <el-dialog class="dialog-form w-wang" title="编辑专家"
               :visible.sync = "dialogEditProfessor"
               :close-on-click-modal="false"
               :before-close="close"
               @open="open">
      <el-form :model="ruleEditProfessor" :rules="rules" ref="ruleEditProfessor">
        <h2>基本信息</h2>
        <el-form-item label="姓名：" :label-width="labelWidth" prop="name">
          <el-input v-model.trim="ruleEditProfessor.name" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别：" :label-width="labelWidth" prop="sex">
          <el-radio-group v-model="ruleEditProfessor.sex">
            <el-radio label="男" checked="checked"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号：" :label-width="labelWidth" prop="phone">
          <el-input v-model.trim="ruleEditProfessor.phone" placeholder="" auto-complete="off"></el-input>
        </el-form-item>

        <h2>附加信息</h2>
        <el-form-item label="专家照片：" :label-width="labelWidth"  prop="photo" class="avatar-uploader">

          <img v-if="imageUrl" :src="imageUrl" id="avatarProfessor" class="avatar">

          <div v-else class="avatar"><i class="el-icon-plus"></i></div>

          <label for="file" class="sel2">选择照片</label>
          <input class="sel1" id="file"  type="file" name="ruleEditProfessor.photo" accept="image/png,image/gif,image/jpeg"  @change="selAvatar($event)">

        </el-form-item>

        <el-form-item label="专家职称：" :label-width="labelWidth" prop="title">
          <el-input v-model.trim="ruleEditProfessor.title" placeholder="" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="任职单位：" :label-width="labelWidth" prop="workPlace">
          <el-input v-model.trim="ruleEditProfessor.workPlace" placeholder="" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="专家简介：" :label-width="labelWidth" prop="description">
          <!-- <el-input type="textarea" v-model.trim="ruleEditProfessor.description"></el-input> -->
          <div id="edit_menup4" class="toolbar"></div>
          <div id="edit_contentp4" class="text"></div> 
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleEditProfessor')">保存</el-button>
        <el-button  @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import model from 'model/user/user_manage'
  import aliyunDir from 'model/organization/list'
  import E from 'wangeditor'
  import ailiyunUpload from 'model/aliyun/index'
  export default {
    data() {
      return {

        imageUrl: "",
        ruleEditProfessor: {
          name: "",
          sex: "女",
          phone: "",
          photo: "",    // 图标
          title: "",    //专家职称
          workPlace: "",   //任职单位
          description: ""   // 专家简介

        },
        rules: {
          name: [
            { required: true, message: '请填写姓名', trigger: 'blur' },
            { max: 12, message: '姓名不能超过12字'}
          ]
        },
        labelWidth: "120px",
        // 阿里云上传
        editorProfessor4: {},
        percentage: 0,
        aliyunName: '',
        originalUrl: '',
        loadingText:0,
      }
    },
    props: ['dialogEditProfessor', 'clazzId', 'role', 'userId'],
    created(){

    },
    methods: {
      open() {
          this.getUser();
          this.$nextTick(() => {

              if(this.editorProfessor4.id) {
                this.editorProfessor4.txt.html("");
            } else {
              this.wangEditp2();
            }

            
          })
      },
      wangEditp2() {
        let editorProfessor4 = new E('#edit_menup4', '#edit_contentp4')
            
            editorProfessor4.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'foreColor',  // 文字颜色
                'link',  // 插入链接
                'justify',  // 对齐方式
                'quote',  // 引用
                'emoticon',  // 表情
                'image',  // 插入图片
                'video',  // 插入视频
                'undo',  // 撤销
                'redo'  // 重复
            ]

            // 配置服务器端地址
            editorProfessor4.customConfig.customUploadImg = (files, insert) => {
                // aliyun 上传图片
                aliyunDir.getAliyunImg({}, (res => {
                    if(res.status == 200) {
                      ailiyunUpload.aliyunUpload(res.data,files,(percentage, cpt)=>{
                        this.loadingText = Math.round(percentage*100);
                      }).then((results)=>{
                        // 上传完成
                        this.aliyunName = results.name.split("/").pop();
                        this.originalUrl = decodeURI(results.res.requestUrls[0]).split('?')[0];                                   
                        insert(this.originalUrl);                                                              

                      }).catch((err)=>{
                        this.$message.error('上传错误'+err);

                      });
                    } else {
                        this.$message.error(res.message);
                    }
                }))
            };

            editorProfessor4.customConfig.onchange = (html) => {
                // this.ruleEditProfessor.description = html
								var str=html.toString();
								var num=str.indexOf('<!--[if gte mso 9]>')
	              var endnum=str.indexOf("<![endif]-->")
								var newstr = str.substring(num + 1,endnum)
								var a=str.split(newstr).join("")
								this.ruleEditProfessor.description = a
            };
            editorProfessor4.customConfig.zIndex = 1;
            editorProfessor4.create();
            this.editorProfessor4 = editorProfessor4;

      },
      getUser () {
        let data = {
          id: this.userId
        }

        model.getUser(data, ( res => {
          //console.log("getuser", res);
          if( res.status == 200) {
            this.ruleEditProfessor.name = res.data.name;
            this.ruleEditProfessor.sex = res.data.sex;
            this.ruleEditProfessor.phone = res.data.phone;
            this.imageUrl = res.data.photo || "";
            this.ruleEditProfessor.title = res.data.title;
            this.ruleEditProfessor.workPlace = res.data.workPlace;
            this.ruleEditProfessor.description = res.data.description;

            this.editorProfessor4.txt.html(this.ruleEditProfessor.description);
          } else {
            this.$message.error(res.message);
          }
        }));
      },

      close () {
        this.$emit('update:dialogEditProfessor', false);
        this.ruleEditProfessor.photo = "";
        this.imageUrl = "";
        document.getElementById("file").value = "";
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.editProfessor();
            // alert('submit');
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },

      selAvatar (event) {
        let _this = this;
        let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
        if (extend == "jpg" || extend == "png" || extend == "gif" || extend == "jpeg") {
          _this.ruleEditProfessor.photo = event.target.files[0];
          let objUrl = event.target.files[0];
          let windowURL = window.URL || window.webkitURL;
          let imageUrl = windowURL.createObjectURL(objUrl);
          _this.imageUrl = imageUrl

        }

      },

      editProfessor () {

        let data = {
          id: this.userId,
          role: this.role,
          name: this.ruleEditProfessor.name,
          sex: this.ruleEditProfessor.sex,
          phone: this.ruleEditProfessor.phone,
          file: this.ruleEditProfessor.photo,
          photo: this.imageUrl,
          title: this.ruleEditProfessor.title,
          workPlace: this.ruleEditProfessor.workPlace,
          description: this.ruleEditProfessor.description
        }
       // console.log("file",data.file);
        model.orgEditProfessor(data, ( res => {
         // console.log("editProfessor", res);
          if( res.status == 200) {

            this.close();
            this.$emit("updateProfessorUserList");

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
<style scoped lang="less">
  @import "../../assets/reset-element-ui/form.css";
  .w-wang {
      .text {
          width: 100%;
          height: 200px;
          border: 1px solid #F2F0F0;
      }
      .toolbar {
          width: 100%;
          background: #FCFDFF;
          border: 1px solid #F2F0F0;
          height: 50px;
      }
      .w-e-toolbar{
          .w-e-menu{
              padding: 17px 10px;
          }
      } 
  }
  #weditProfessor {
    h2 {
      font-size: 18px;
      color: #333;
      margin-left: 5%;
      margin-bottom: 20px;
    }
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

  }
</style>
