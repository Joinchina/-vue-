<template>
  <div id="waddProfessor">
    <el-dialog class="dialog-form j-add-clazz w-wang" title="新增专家"
               :visible.sync = "dialogAddProfessor"
               :close-on-click-modal="false"
               :before-close="close"
               @open="open">
      <el-form :model="ruleAddProfessor" :rules="rules" ref="ruleAddProfessor" v-loading="loading"
               element-loading-text="拼命加载中">
        <h1><span></span>基本信息</h1>
        <el-form-item label="姓名：" :label-width="labelWidth" prop="name">
          <el-input v-model.trim="ruleAddProfessor.name" placeholder="" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别：" :label-width="labelWidth" prop="sex">
          <el-radio-group v-model="ruleAddProfessor.sex">
            <el-radio label="男" checked="checked"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号：" :label-width="labelWidth" prop="phone">
          <el-input v-model.trim="ruleAddProfessor.phone" placeholder="" auto-complete="off"></el-input>
        </el-form-item>

        <h1><span></span>附加信息</h1>
        <el-form-item label="专家照片：" :label-width="labelWidth"  prop="photo" class="avatar-uploader">

          <img v-if="imageUrl" :src="imageUrl" id="avatarProfessor" class="avatar">

          <div v-else class="avatar"><i class="el-icon-plus"></i></div>

          <label for="file" class="sel2">选择照片</label>
          <input class="sel1" id="file"  type="file" name="ruleAddProfessor.photo" accept="image/png,image/gif,image/jpeg"  @change="selAvatar($event)">

        </el-form-item>

        <el-form-item label="专家职称：" :label-width="labelWidth" prop="title">
          <el-input v-model.trim="ruleAddProfessor.title" placeholder="" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="任职单位：" :label-width="labelWidth" prop="workPlace">
          <el-input v-model.trim="ruleAddProfessor.workPlace" placeholder="" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="专家简介：" :label-width="labelWidth" prop="description">
          <!-- <el-input type="textarea" v-model.trim="ruleAddProfessor.description"  placeholder="20000字以内"></el-input> -->
          <div id="edit_menup3" class="toolbar"></div>
          <div id="edit_contentp3" class="text"></div> 
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="!loading &&submitForm('ruleAddProfessor')">创建</el-button>
        <el-button  @click="close">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 添加成功 -->
    <add-succ
      :dialogAddSucc.sync = "dialogAddSucc"
      title="新增专家"
      :name="name"
      :username="username"
      :userPassword = "userPassword"></add-succ>
  </div>
</template>

<script>
  import model from 'model/members/members'
  import addSucc from 'components/user/add_succ'

  import aliyunDir from 'model/organization/list'
  import E from 'wangeditor'
  import ailiyunUpload from 'model/aliyun/index'

  export default {
    data() {
      return {
        username: "",
        name: "",
        userPassword: "",
        imageUrl: "",
        dialogAddSucc: false,
        ruleAddProfessor: {
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
          ],
          title:[
            { max: 30, message: '职称不能超过30字', trigger: 'blur'}
          ],
          workPlace:[
            { max: 30, message: '任职单位不能超过30字', trigger: 'blur'}
          ]
        },
        loading:false,
        labelWidth: "120px",

        // 阿里云上传
        editorProfessor3: {},
        percentage: 0,
        aliyunName: '',
        originalUrl: '',
        loadingText:0,
      }
    },
    props: ['dialogAddProfessor', 'clazzId', 'role'],
    created(){
        //alert("新增专家");
    },
    methods: {
      open() {
        this.loading = false;
        this.$nextTick(() => {

            if(this.editorProfessor3.id) {
              this.editorProfessor3.txt.html("");
          } else {
            this.wangEditp3();
          }
        })
      },
      wangEditp3() {
        let editorProfessor3 = new E('#edit_menup3', '#edit_contentp3')
            
            editorProfessor3.customConfig.menus = [
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
            editorProfessor3.customConfig.customUploadImg = (files, insert) => {
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

            editorProfessor3.customConfig.onchange = (html) => {
                var str=html.toString();
								var num=str.indexOf('<!--[if gte mso 9]>')
	              var endnum=str.indexOf("<![endif]-->")
								var newstr = str.substring(num + 1,endnum)
								var a=str.split(newstr).join("")
                this.ruleAddProfessor.description = a
            };
            editorProfessor3.customConfig.zIndex = 1;
            editorProfessor3.create();
            this.editorProfessor3 = editorProfessor3;

      },
      close () {
        this.$emit('update:dialogAddProfessor', false);
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.addProfessor();
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
          _this.ruleAddProfessor.photo = event.target.files[0];
          let objUrl = event.target.files[0];
          let windowURL = window.URL || window.webkitURL;
          let imageUrl = windowURL.createObjectURL(objUrl);
          _this.imageUrl = imageUrl

        }

      },

      addProfessor () {
        this.loading = true;
        let data = {
          clazzId: this.clazzId,
         // role: this.role,
          name: this.ruleAddProfessor.name,
          sex: this.ruleAddProfessor.sex,
          phone: this.ruleAddProfessor.phone,
          file: this.ruleAddProfessor.photo,
          title: this.ruleAddProfessor.title,
          workPlace: this.ruleAddProfessor.workPlace,
          description: this.ruleAddProfessor.description
        }
        model.createSaveProfessor(data, ( res => {
          if( res.status == 200) {
            this.loading = false;
            this.username = res.data.username;
            this.name = res.data.name;
            this.userPassword = res.data.userPassword;
            this.close();
            this.$emit("updateProfessorUserList");

            // 初始值清空
            this.ruleAddProfessor.name="";
            this.ruleAddProfessor.sex="女";
            this.ruleAddProfessor.phone="";
            this.ruleAddProfessor.title="";
            this.ruleAddProfessor.workPlace="";
            this.ruleAddProfessor.description="";
            this.imageUrl = "";
            this.ruleAddProfessor.photo="";
            $("#file").val("");


            // 显示成功弹出框
            this.dialogAddSucc = true;
          } else {
            this.loading = false;
            this.$message.error(res.message);
          }
        }));
      }
    },

    components: {
      addSucc
    }
  }

</script>
<style scoped="" lang="less">
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
  #waddProfessor {
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
  .dialog-form {
    h1 {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      span {
        background: #ffad57;
        width: 5px;
        height: 18px;
        overflow: hidden;
        margin-right: 10px;
        display: inline-block;
        vertical-align: middle;
      }

    }
  }
  .el-form{
    width: 95%;
    margin:0 auto;
  }
  .dialog-form .el-form-item{
    margin-bottom: 20px;
  }
</style>
