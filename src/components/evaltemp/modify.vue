<template>
	<div>
		<el-dialog class="dialog-form dialog-temp" :title="'修改'+title"
			:visible.sync = "dialogTemModify"
			:close-on-click-modal="false"
			:before-close="close"
            @open="open">

            <div v-loading="loading" :element-loading-text="loadingText">
	            <!--上传_start-->
	            <div  class="import-student import-temp" id="el-upload" >
	        		  <p>
	        		  	   <span>导入模板前请下载模板，按模板导入</span>
	        		  	   <span><a :href="downloadUrl" class="link">模板下载</a></span>
	        		  </p>
	        		   <div class="upload clearfix">
				          <div class="choose-file left">文件选择：</div>
				          
				          <div class="left pos">
				            <input type="file" @change="getFile($event)" id="file" accept="text/plain" slot="trigger" size="small" class="sel1" >

				            <label for="file" class="sel2 link">选择文件</label>
                     <span class="word" v-show="!fileNameFlag">（请上传5M以内的txt的文件）</span>
				          </div>

				          <div class="left">
				            <span style="margin-left: 120px; margin-top: -1px;"
				                  v-show = "fileNameFlag"
				                  id="fileText"
				                  :class="{name:fileNameFlag}" 
				                  :alt="fileName"
				                  :title="fileName">
				                  {{fileName}}
				            </span>
				          </div>
	          
					   </div>
              <!-- <div class="require" v-show = "errorMsgFlag">
                  {{errorMsg}}
              </div> -->

						  <div class="btn-upload1">
		            	<button @click="!loading&&submitUpload()" class="btn-green-upload">立即上传</button>
		          </div>

		          <div class="explain">修改此模板后，班级内全部课程均会变成最新上传的模板(仅未开始创建以及新创建的课程)</div>
	      		</div>
	      		<!--上传_end-->

	      		<!--查看通用题目-->

	      		<div class="system" v-if="quesionArray.length > 0">
	      			<h2>系统设定题目<span>(系统设定题目会自动加到修改的模板后)</span></h2>

	      			<div class="question" v-for="(item,index) in quesionArray" >

                <section  v-if="item.type == 'SELECT'">
                      <h3>Q{{index+1}}.{{item.question}}（单选题）（{{item.required?'必答':'选答'}}）</h3>
                        <ul>
                          <li v-for="(sel,index) in item.selections">
                              {{selList[index]}} {{sel}}
                          </li>
                      </ul>
                </section>

                <section  v-else-if="item.type == 'MUILTSELECT'">
                      <h3>Q{{index+1}}.{{item.question}}（多选题）（{{item.required?'必答':'选答'}}）</h3>
                      <ul>
                        <li v-for="(sel,index) in item.selections">
                            {{selList[index]}} {{sel}}
                        </li>
                      </ul>
                </section>

                 <section  v-else-if="item.type == 'SUBJECTIVE'">
                      <h3>Q{{index+1}}.{{item.question}}（问答题）（{{item.required?'必答':'选答'}}）</h3>
                      <ul>
                        <li v-for="(sel,index) in item.selections">
                            {{selList[index]}} {{sel}}
                        </li>
                      </ul>
                </section>
	      			
	      			</div>


	      		</div>
	      	</div>
	         <div slot="footer" class="dialog-footer">
	        		<el-button @click="close">关闭</el-button>
	      	 </div>

      		 
         </el-dialog>
	</div>
</template>
<script>
	import api from '@/global/resource';
	import model from '@/model/evaltemp/evaltemp';
  import com from 'model/comtpoc/comtopic'
	export default{
		props:["dialogTemModify","type","clazzId","level"],
		data(){
			return{

				  loading:false,
				  downloadUrl:api.urls.paperCourseEvaluation,
          file:"",
          fileName:"",
          fileNameFlag:false,
          errorMsgFlag:false,
          errorMsg:"",
          loadingText:"",

          quesionArray:[],
          title:"",
          selList:["A","B","C","D","E","F","G","H","I","J"],

			}
		},
		created(){
			 this.getComdata();
       this.titleName();
		},
		methods:{
      titleName(){
        let level = this.$route.query.level;
        let type = this.$route.query.type;
        switch(level){
           case "CLAZZ":
           if(type == "EVALUATION"){
             this.title = "项目评价";
           }else{
             this.title = "项目反思";
           }
           break;

           case "COURSE":
           if(type == "EVALUATION"){
             this.title = "课程评价";
           }else{
             this.title = "课程反思";
           }
           break;
           default:

        }
      },

			open(){
				this.loading = false;

         //清除选择文件信息
        $("#file").val("");

        this.fileNameFlag = false;

        this.fileName = "";
			},
			close(){
				this.$emit('update:dialogTemModify', false);
			},

      getComdata(){
        let data = {
          type:this.type,
          level:this.level
        }
        com.comFindByAndTypeAndLevel(data, (res => {
           if(res.status == 200){

                if(!!res.data){
                  let dataObj = res.data;
                  if(!!dataObj.questions && dataObj.questions.length > 0){
                    this.quesionArray = dataObj.questions;
                  }
                }

           }
          
           //console.log(this.quesionArray.length);

        }))
      },

			submitUpload(){

        if(this.fileName == ""){
               this.errorMsgFlag = true;
               // this.errorMsg = "请选择需要上传的文件";
               this.$message.error("请选择需要上传的文件");
        }else{


              //判断上传的类型格式
              let type = this.fileName.substr(this.fileName.lastIndexOf(".")+1);
              if(type != "txt"){
                  this.errorMsgFlag = true;
                  // this.errorMsg = "请上传内容文本格式为utf-8的txt文件";
                  this.$message.error("请上传内容文本格式为utf-8的txt文件");
                  return;
              }else{

                 let size = this.file.size; //单位是B
                 let MaxSize = 1*1024*1024* 5;
                 //console.log(size)
                 //console.log(MaxSize)
                 if(size < MaxSize){
                    //上传成功
                    this.uploadSignFile();
                 }else{

                    this.errorMsgFlag = true;
                    this.errorMsg = "请上传5M以内的文件";
                    this.$message.error("请上传5M以内的文件");
                    return;
                 }
                  
              }

        }
				

			},
			 getFile(event) {
	            this.file = event.target.files[0];
	            this.fileName = this.file.name;
	            if(this.fileName !=""){
	                 this.fileNameFlag = true;
	                 this.errorMsgFlag = false;
	            }
        },
        uploadSignFile(){
              this.loading = true;
              let data = {
               file:this.file,
               level:this.level,
               clazzId:this.clazzId,
               type:this.type
              }

              
              model.paperUploadClazzTemplate(data,(res)=>{

               if(res.status == 200){
                 this.loading = false;

                 this.close();
                 this.$emit("updataEvalTem");
               }else{
                 this.loading = false;
                 this.$message.error(res.message);
               }

              },(res)=>{
                 // 加进度条
                 //console.log(res.total);
                 let progress = Math.round(parseFloat(res.loaded/res.total)*100);
                 this.loadingText = "文件上传中" + progress + '%';
              })
      }
		}
	}
</script>
<style scopped lang="less">
   @import "../../assets/reset-element-ui/form.css";
   @import "../../assets/reset-element-ui/form-reset.css";
   @import "../../assets/css/import_temp.css";
  .import-temp {
    padding: 50px 50px 30px 50px;
  }
  .import-temp .sel2 {
    margin-top: 3px;
  }
  .import-student .upload{
    
    .pos{
      position: relative;
    }
    .word{
       margin-left: 100px;
       margin-top: 3px;
       color: #999;
       font-size: 14px;
       position: absolute;
       top: 0;
       width: 300px;
    }
  }
  .import-student .explain{
  	background:url('/static/page/assets/pages/img/vote/naire_12.png') no-repeat left top;
  	padding-left: 22px;
  	color: #666;
  	margin-top: 14px;
  	font-size: 14px;
  }
  .upload-demo{
    float: left;
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
  #el-upload .choose-file{
     margin-top: 3px!important;
  }
 
  .cheat{
    font-size: 18px;
    padding-top: 48px;
    dl,dt{
      float: left;
    }
  }
  .system{
  	 border: 1px solid #eaeaea;
  	 border-radius: 6px;
  	 padding-top: 22px;
     margin-left: 30px;
     margin-right: 30px;
  	 padding-bottom: 10px;
  	 background: #fafafa;
  	 h2{
  	 	border-left: 4px solid #149588;
  	 	padding-left:10px;

  	 	font-size: 18px;
  	 	margin-left: 20px;
      color: #333;
      font-weight: 400;
  	 	span{
  	 		color: #838383;
  	 		font-size: 14px;
  	 	}
  	 }
  	 .question{
      color: #333;
  	 	h3{
  	 		padding-top: 10px;
  	 		font-size: 16px;
  	 		padding-left: 33px;
  	 		line-height: 35px;
  	 	}
  	 	li{
  	 		padding:8px 0 8px 59px;
  	 	}
  	 }
  }
  .el-dialog__header{
     overflow: hidden;
     width: 100%;
     text-overflow: ellipsis;
     white-space: nowrap;
     color: #fff!important;

  }
   .j-course-b{
     border-bottom: 1px solid #e5e9e9;
     h2{
       padding-top: 15px;
       padding-bottom: 15px;
       background: #f2fffe;
       color: #333;
       padding-left: 40px;
       font-size: 18px;
     }
  }

</style>