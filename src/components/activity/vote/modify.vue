<template>
	<div>
		<el-dialog class="dialog-form dialog-temp" :title="'修改'+title"
			:visible.sync = "dialogTemModify"
			:close-on-click-modal="false"
			:before-close="close"
            @open="open">

            <div v-loading="loading" :element-loading-text="loadingText">
              <!--所属课程-->
              <div class="j-course-b">
                  <h2><span class="icon-describe"></span> 所属课程：{{courseName}}</h2>
                  <!-- <h2><span class="icon-members"></span>  专家：王云飞</h2> -->
              </div>
	            <!--上传_start-->
	            <div  class="import-student import-temp" id="el-upload" >
	        		  <p>
	        		  	   <span>导入模板前请下载模板,按模板导入</span>
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
		            		   <button @click="!loading&&submitUpload()" class="btn-green-square">立即上传</button>
		          </div>

		          <div class="explain">{{prompt}}</div>
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
		props:["dialogTemModify","types","clazzId","courseName","activityId","list"],
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
          level:"",
          type:"",
          title:"",
          prompt:"如果修改前学员已经提交，这些学员不能重新做哦~",   
          quesionArray:[],
          selList:["A","B","C","D","E","F","G","H","I","J"],

			}
		},
    computed:{
       crumbs(){
         if(!!this.$route.query.crumb){
            return this.$route.query.crumb;
         }
         
       }
    },
		created(){
     // console.log(this.types);
      // if(this.type == "EVALUATION" || this.type == "INTROSPECTION"){
      //    this.getComdata();
      // }
     
      
		},
    mounted(){
      
    },
    watch:{
         types(value){
            this.type = value;
            //console.log("type="+this.type+"eval"+this.type);
            if(this.type == "EVALUATION" || this.type == "INTROSPECTION"){

               this.getComdata();
            }

            //班级列表创建评价反思  
            if(this.list){
               this.getComdata2();
            }
         }
      },

		methods:{
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
        if(!!this.crumbs){
           if(this.crumbs == "det"){
              this.level = "COURSE";
              //console.log(this.level);
            }else{
              this.level = "CLAZZ";
            }
           
        //快捷入口评价反思获取
        }else{

             this.level = "COURSE"

             if(this.$route.query.type){
                this.type = this.$route.query.type;
             }
             

        }


        this.titleName();

        if(this.type != ""){
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
            

          }))
        }
         
        
      },


      getComdata2(){
          //班级首页列表列表获取数据
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
              

            }))
      },

      titleName(){
        switch(this.level){
           case "CLAZZ":
           if(this.type == "EVALUATION"){
             this.title = "项目评价";
           }else{
             this.title = "项目反思";
           }
           break;

           case "COURSE":
           if(this.type == "EVALUATION"){
             this.title = "课程评价";
             this.prompt="如果修改前学员已经提交，这些学员必须重新提交哦~"
           }else{
             this.title = "课程反思";
             this.prompt="如果修改前学员已经提交，这些学员必须重新提交哦~"
           }
           break;
           default:

        }
      },

			submitUpload(){

        if(this.fileName == ""){
               this.errorMsgFlag = true;
               this.errorMsg = "请选择需要上传的文件";
               this.$message.error(this.errorMsg);
        }else{


              //判断上传的类型格式
              let type = this.fileName.substr(this.fileName.lastIndexOf(".")+1);
              if(type != "txt"){
                  this.errorMsgFlag = true;
                  this.errorMsg = "请上传内容文本格式为utf-8的txt文件";
                  this.$message.error(this.errorMsg);
                  return;
              }else{

                 let size = this.file.size; //单位是B
                 let MaxSize = 1024 *1024 * 5;
                // console.log(size)
                // console.log(MaxSize)
                 if(size < MaxSize){
                    //上传成功
                    this.uploadSignFile();
                 }else{

                    this.errorMsgFlag = true;
                    this.errorMsg = "请上传5M以内的文件";
                    this.$message.error(this.errorMsg);
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
               activityId:this.activityId,
              }

              
              model.paperUploadCourseTemplate(data,(res)=>{
                //console.log(res);
               if(res.status == 200){

                
                 //console.log("后台返回activity" + res.data.activityId);
                 //this.$emit("updataEvalTems",obj);

                  if(this.list){

                     this.$message.success("修改成功");
                     this.$emit("listEditSuccess","1")

                  }else{

                      let obj = {
                         activityId:res.data.activityId,
                         level:res.data.level,
                         type:res.data.type,
                         crumb:this.$route.query.crumb
                     }
                     this.$emit("updataEvalTems",obj);

                  }
                  
                  this.close();

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
  @import "../../../assets/reset-element-ui/form.css";
  @import "../../../assets/less/icon.less";
  @import "../../../assets/reset-element-ui/form-reset.css";
  @import "../../../assets/css/import_temp.css";
  .import-temp {
    padding: 20px 50px;

    .sel2 {
      margin-top: 3px;
    }
  }
  .dialog-temp {
    .icon-describe {
      width: 11px;
      height: 15px;
      margin-right: 5px;
      vertical-align: text-top;
    }
  }
  .j-course-b{
    border-bottom: 1px solid #e5e9e9;
    h2{
       padding-top: 15px;
       padding-bottom: 15px;
       background: #f2fffe;
       color: #333; 
       padding-left: 50px;
       font-size: 14px;
    }
  }
  // .el-dialog__body{
  //    padding: 20px 42px 30px 15px!important;
  // }
  
  .import-student .upload{
   
    .pos{
      position: relative;
    }
    .word{
       margin-left: 100px;
       margin-top: 3px;
       color: #c3c3c3;
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
  #el-upload .choose-file{
     margin-top: 4px!important;
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
        color: #333!important;
      }
     }
  }

</style>