<template>
  <div>
    <el-dialog class="dialog-form j-sign dialog-temp" title="导入签到"
               :visible.sync = "dialogImportSign"
               :close-on-click-modal="false"
               :before-close="close"
               @open="opens">

      <!--content_start-->
     <div class="import-temp" id="el-upload" v-loading="loading"  element-loading-text="拼命加载中">
        <p>提示：签到请按模板导入，时间不能重合<a :href="downloadUrl" class="link">模板下载</a></p>
        <div class="upload">
          <span class="choose-file left">文件选择：</span>

          <a href="javascript:;" class="left choose link">
              选择文件
              <input type="file" @change="getFile($event)" id="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" slot="trigger" size="small" class="j-change">
          </a>

           <!--  <label for="file">选择文件</label> -->

          <span class="left">
            <span style="margin-left: 30px; margin-top: 0;"
                v-show = "fileNameFlag"
                id="fileText"
                :class="{name:fileNameFlag}" 
                :alt="fileName"
                :title="fileName">
                {{fileName}}
            </span>
          </span>
          
          

        </div>
        <!-- <div class="require">
            <span v-show="errorMsgFlag">{{errorMsg}}</span>
        </div> -->
        <div class="btn-upload">
           <button @click="!loading&&submitUpload()" class="btn-green-upload">立即上传</button>
        </div>
       <!--  <dl class="cheat clearfix">
            <dt>防作弊模式：</dt>
            <dd>
              <el-switch
                v-model="open"
                active-text=""
                 @change="savePreventCheat"
                inactive-text="">
            </el-switch>
            </dd>
        </dl> -->
       
          <!-- <div class="btn-upload">
            <button @click="submitUpload" class="btn-green-square">立即上传</button>
          </div> -->

      </div>
      <!--content_end-->

      <div slot="footer" class="dialog-footer">
          <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
    <!--上传成功-->


  </div>
</template>
<script>
  import model from '@/model/clazz/signin';
  import {delTipSign} from '@/global/open';
  import api from '@/global/resource';
  import {getToken} from '@/filters/userVerify';
  export default{
    props:["dialogImportSign","clazzId"],
     data(){
       return{
          lock:"on",
          downloadUrl:api.urls.signTempate,
          file:"",
          fileName:"",
          fileNameFlag:false,
          errorMsgFlag:false,
          errorMsg:"",
          dataSuccess:"",
          dataFail:"",
          dataFailUrl:"",
          dialogSuccData:[],
          loading:false,
          dialogSucc:false
       }
     },
     methods:{
        opens() {

          this.loading = false;
        },
        close() {
          this.$emit('update:dialogImportSign', false);
          this.file = "";
          this.fileName = "";
          this.fileNameFlag = false;
        },

         getFile(event) {

            this.file = event.target.files[0];
            //console.log(this.file);
            this.fileName = this.file.name;
            //console.log("filename1" + this.fileName);
            if(this.fileName !=""){
                 this.fileNameFlag = true;
                //console.log("filename2" + this.fileName);
                 this.errorMsgFlag = false;
            }
         },


         submitUpload(){
            //console.log("fielname3" + this.fileName);
            if(this.fileName == ""){
               this.errorMsgFlag = true;
               // this.errorMsg = "请选择需要上传的文件";
               this.$message.error("请选择需要上传的文件");
            }else{

              //判断上传的类型格式
              let type = this.fileName.substr(this.fileName.lastIndexOf(".")+1);
              if(!type){
                  this.errorMsgFlag = true;
                  // this.errorMsg = "导入数据文件只能是excel";
                  this.$message.error("导入数据文件只能是excel");
                  return;
              }else{
                this.uploadSignFile();
              }

            }
         },
         uploadSignFile(){
              this.loading = true;
              var data = {
                file:this.file,
                clazzId:this.clazzId,
                lock:this.lock
              }
               model.importSign(data, (res => {
                  if(res.status == 200) {
                     this.loading = false;
                    let data = res.data;
                    //清除选择文件信息
                    $("#file").val("");

                    this.fileNameFlag = false;

                    this.fileName = "";


                    //成功、失败条数
                    this.dataSuccess = data.success;

                    this.dataFail = data.fail;

                    if(!!data.url){
                       this.dataFailUrl = data.url;
                    }


                    this.$emit("updateImportSign");

                    //关闭弹框
                    this.close();

                    //显示失败页面
                    if(data.exportFlag){
                      // console.log("失败页面");
                        let str = this.dataSuccess + "条数据导入成功,"+this.dataFail + "条数据失败，请查看失败反馈";
                        this.importSignConfirm(str,"下载失败页面","warning");

                    //显示成功页面
                    }else{
                         let str = this.dataSuccess + "条数据导入成功";
                         this.importSignConfirm(str,null,"success");
                    }
                   


                  } else {
                      this.loading = false;
                     this.$message.error(res.message);
                  }
               }));


          },
          importSignConfirm(str,text,type){
             let textWord = "确定";
             if(!!text){
                textWord = "下载失败文件";
             }
             this.$confirm(str, '提示', {
                          confirmButtonText: textWord,
                          showCancelButton: false,
                          type: type,
                          beforeClose: (action, instance, done) => {
                              if (action === 'confirm') {
                                 if(!!text){
                                    window.open(api.urls.exportSignAddFalseExcel+"?excelUrl="+this.dataFailUrl+"&token="+getToken());
                                 }
                                 done();
                              }else{
                                done();
                              }
                          }
                          }).then(() => {
                            //成功
                        }).catch(() => {
                              //取消      
              });
          }
     }
  }
</script>
<style scopped lang="less">
  @import "../../../assets/reset-element-ui/form-reset.css";
  @import "../../../assets/css/import_temp.css";
  .el-loading-mask{
    height: 100px;
  }
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

  .selt{
    
  }

  .cheat{
    font-size: 18px;
    padding-top: 48px;
    dl,dt{
      float: left;
    }
  }

  .j-change{
    position: absolute;
    overflow: hidden;
    width: 65px;
    height: 30px;
    cursor:pointer;
    right: 0;
    top: 0;
    opacity: 0;
    margin-left: 10px;
    font-size: 0;
  }
  
  #el-upload .choose{
    position: relative;
    top: 6px;
  }
  .choose-file {
    margin-top: 7px;
  }
</style>