
<template>
  <div>
    <el-dialog class="dialog-form dialog-temp" title="导入学员"
               :visible.sync = "dialogImportStudent"
               :close-on-click-modal="false"
               :before-close="close">
      <!--content_start-->
      <div class="import-temp" id="el-upload" 	v-loading="loading"  element-loading-text="拼命加载中">
        <p>导入用户前请下载用户信息模板，按模板导入<a :href="apis" class="link blue">模板下载</a></p>
        <div class="upload clearfix">
          <span class=" choose-file">文件选择</span>
          <input type="file" @change="getFile($event)" id="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" slot="trigger" size="small" class="sel1" >
          <label for="file" class="sel2 link">选择文件</label>
          <span style="margin-left: 130px;"
                id="fileText"
                :alt="fileTextContent"
                :title="fileTextContent">
          </span>
        </div>
        <!-- <div class="require" id="errorMsg"></div> -->
          <div class="btn-upload">
            <button @click="submitUpload" class="btn-green-upload">立即上传</button>
          </div>

      </div>
      <!--content_end-->

      <div slot="footer" class="dialog-footer">
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
    <!--上传成功-->
    <!--发布成功-->
    <div id="waddSucc">
      <el-dialog class="dialog-form"
                 title="导入学员"
                 :visible.sync="dialogSucc"
                 :close-on-click-modal="false">

        <dl>
          <dt>
            <img src="../../assets/img/common/pic-succ.png" alt="">
            <h1 class="tip">导入成功</h1>
          </dt>
        </dl>
        <div class="import">
          <div class="header">
            <h1>学员现在可以登录app了，用户登录账号和密码</h1>
            <h1>已经通过短信发给学员</h1>
          </div>
          <div class="footer">

            <p v-for="item in dialogSuccData">{{item}}</p>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary"  @click="!loading && submitForm()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import apis from '@/global/resource';
  import { getToken } from '@/filters/userVerify';
  import bus from '@/global/bus'
  import model from 'model/members/members'

  export default {
    created(){
    },
    data() {
      return {
        file:"",
        fileTextContent:"",
        clazzIds:{
          clazzId:this.clazzId
        },
        loading:false,
        headers:{
          'Authorization': getToken()
        },
        apis:apis.urls.tmplateDowload,
        iapis:apis.urls.importStudents,
        dialogSucc:false,
        dialogSuccData:[]
      };
    },
    props:["dialogImportStudent","clazzId","overLimit"],
    methods:{
      getFile(event) {
        this.file = event.target.files[0];
        this.fileTextContent = event.target.value.substr(event.target.value.lastIndexOf("\\") + 1).toLowerCase();
        $("#fileText").addClass("name");
        $("#fileText").text(this.fileTextContent);

        
        //判断上传格式
        let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
        if(extend == "xlsx" || extend == "xls"){
          //不需要执行
        }else{
          this.$message.error("导入数据文件只能是excel");
          $("#fileText").text("");
          $("#file").val("");
          $("#fileText").removeClass("name");
          return;
        }
      },
      close() {
        this.$emit('update:dialogImportStudent', false);
        $("#fileText").text("");
        $("#file").val("");
        $("#fileText").removeClass("name");
        this.file= "";
        this.fileTextContent = "";
      },
      submitUpload(file) {
        var fileVal = $("#file").val();
        if(fileVal == ""){
          this.$message.error("请选择上传文件");
          return;
        }
        this.loading = true;
        var data = {
          file:this.file,
          clazzId:this.clazzId,
          errCallBack:this.limitHandler
        }
        model.importStudents(data, ( res => {
          //成功层显示
          if(res.status == 200){
            this.loading = false;
            //上传文件清空
            $("#file").val("");
            this.fileTextContent = "";
            $("#fileText").text("");
            $("#fileText").removeClass("name");

            this.close();

            //显示成功弹出层
            this.dialogSucc = true;
            //显示手机号重复信息人员名单
            this.dialogSuccData = [];
            var newMsg = res.message.split(";");
            if(newMsg.length != 0 ){
              for(var i = 0;i < newMsg.length - 1;i++){
                this.dialogSuccData.push(newMsg[i]);
              }
            }


          }else{
            if(res.status == 423){
              this.$emit('update:overLimit' , true)
            }else{
              this.$message.error(res.message);
            }
            this.loading = false;
          }
        }))
      },
      handleRemove(file, fileList) {
        //console.log(file, fileList);
      },
      handlePreview(file) {
      },
      limitHandler(err){
        if(err.response.status == 423){
          this.loading = false;
          this.$emit("update:overLimit",true);
        }
      },
      chooseFile(file, fileList){
        // $(".el-upload-list").html("");
         //上传背景颜色显示
         $(".el-upload-list").show();
      },
      sucessMethod(res, file, fileList){
         //去除关闭按钮
          $(".el-icon-close").remove();
          $(".el-upload-list__item-status-label").remove();
          //成功层显示
          if(res.status == 200){
            //上传文件清空
            this.$refs.upload.clearFiles();
            $(".el-upload-list").hide();
            this.close();
            //显示成功弹出层
            this.dialogSucc = true;
            //显示手机号重复信息人员名单
            var newMsg = res.message.split(";");
            if(newMsg.length != 0 ){
              for(var i = 0;i < newMsg.length - 1;i++){
                this.dialogSuccData.push(newMsg[i]);
              }
            }

          }else{
            this.$message.error(res.message);
          }
      },
      submitForm(){
        this.$emit("updateClassUserList");
        this.dialogSucc = false;
      },
    },

    components:{
      //addSucc
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/reset-element-ui/user-table.css";
  @import "../../assets/css/import_temp.css";
  #waddSucc img {
    display: block;
    width: 136px;
    height: 121px;
    margin: 0 auto;
  }
  #waddSucc .tip {
    font-size: 20px;
    color: #35a69d;
    line-height: 1.6em;
    margin-bottom: 30px;
  }
  #waddSucc dt {
    text-align: center;
  }
  #waddSucc dl {

    overflow: hidden;

  }
  #waddSucc dd {
    display: block;
    margin: 0 auto;
    width: 400px;
    font-size: 16px;
    color: #333;
    line-height: 1.6em;
    text-align: left;
    margin-left: 200px;
  }
  
  
  .import{}
  .import .header{
    padding-top:26px;
  }
  .import .header h1{
    font-size: 16px;
    color: #333;
    line-height:22px;
    padding-bottom: 8px;
  }
  .import .footer{
    padding-top:32px;
  }
  .import .footer p{
    line-height:22px;
    padding-bottom: 8px;
    color: #999;
  }
  
</style>
