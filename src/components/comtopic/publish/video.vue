<template>
    <div class="z-content" v-loading = "upLoading" :element-loading-text="loadingText+'%'">
        <div class="word_title">
            <el-input v-model="title" placeholder="文章标题（50字之内）"></el-input>
        </div>
        <div class="word_post">
            <div class="post_title">
                <img src="../../../assets/img/help/x.png" alt="">
                <span>选择文件：</span>
            </div>               
            <div class="left pos">
                <input type="file" @change="getFile($event)" id="fileupload"  slot="trigger" size="small" class="sel1" >
                <label for="fileupload" class="sel2" id="sel2" style="margin-top:3px">
                    <span class="icon-dis-add"></span>选择文件
                </label>
                <span class="filename" v-show="filename.length>0">{{filename}}</span>
            </div>
            <div class="warn">注意：视频需在50M以内,格式为MP4</div>			           
        </div>
        <button @click="add_video_article">确定</button>
    </div>
</template>
<script>
import model from 'model/help/help'
import ailiyunUpload from 'model/aliyun/index'
export default {
    data() {      
      return {        
        title:"", //文章标题
        filename:'',
        ColumnId:0,
        // 阿里云上传
	    percentage: 0,
	    aliyunName: '',
        originalUrl: '',
        loadingText:0,
        videourl:'',//视频url
        articleId:0,
        upLoading : false,
      };
    },
    created(){
        this.ColumnId=this.$route.query.columnId;
        this.articleId=this.$route.query.articleId;
    },
    mounted(){
        //编辑是拿数据
        if(this.articleId != '00'){
            let data={
                id:this.articleId
            };
            model.getArticle(data,(res=>{
                console.log(res)
                if(res.status==200){
                    this.title=res.data.title;
                    if(res.data.originalFileUrl){
                        if(res.data.fileName){
                            let name=decodeURI(res.data.fileName);
                            let nameType=res.data.originalFileUrl.split('/');
                            let n=nameType[nameType.length-1].split('.').pop();
                            this.filename=name+'.'+n;
                            this.videourl=res.data.originalFileUrl;
                        }else{
                            let nameType=res.data.originalFileUrl.split('/');
                            let n=nameType[nameType.length-1];
                            this.filename=n;
                             this.videourl=res.data.originalFileUrl;
                        }
                    
                    }                 
                }
            }))             
        }
    },  
    methods: {
        getFile(e){
            let file=e.target.files[0];
            if(file==undefined){
                return
            };
            this.filename=file.name;
            let name=file.name;
            let size=file.size;
            let maxsize=1024*1024*50;
            let format=file.type;
            console.log(format)
            if(format=='video/mp4'){
                if(size<=maxsize){
                      //console.log("格式正确大小合适，往下执行") 
                      this.add_video(); 
                }else{
                    //console.log("视频文件太大了")
                    this.$message.error('视频文件太大了');
                }
            }else{
                //console.log("不是mp4格式")
                this.$message.error('不是mp4格式');
            }                        
        },
        add_video(){
            const _this = this
            let data={
                helpColumnId :this.ColumnId,
            }
            model.helpaddvideo(data,(result=>{
                //console.log("aliyun ",result);
                if(result.status == 200) {
                    this.upLoading = true;
                    const files = document.getElementById("fileupload").files;
                    _this.percentage = 0;
                    ailiyunUpload.aliyunUpload(result.data,files,(percentage, cpt)=>{
                      this.loadingText = Math.round(percentage*100);
                    },'admin').then((results)=>{
                        _this.aliyunName = results.name.split("/").pop();
                        _this.originalUrl = results.res.requestUrls[0];
                        _this.aliyunAttachment(_this.aliyunName, _this.originalUrl);
                        this.$message({
                            message: '恭喜你，视频上传成功',
                            type: 'success'
                        });                                           

                    }).catch((err)=>{
                      this.$message.error('上传错误'+err);

                    }).finally(()=>{
                        this.upLoading = false;
                    })
	        	} else {
	        		this.$message.error(result.message);

	        	}
            }))
        },
        aliyunAttachment(name,url){
           
            //console.log(url.split("?").shift());
            this.videourl=decodeURI(url.split("?").shift());
             console.log( this.videourl);
        },
        add_video_article(){
              if (this.title.length==0) {
                  this.$message.error('文章标题不能为空');
                  return 
              };
              if (this.videourl=='') {
                  this.$message.error('视频附件不能为空');
                  return 
              };
              if(this.videourl.length==0){
                  this.$message.error('视频还在上传中，不能发布文章');
                  return 
              };
              let artid;
              if(this.articleId=='00'){
                  artid=''
              }else{
                 artid=this.articleId; 
              }
              let data={
                  title:this.title,
                  type:'VIDEO',
                  url:this.videourl,
                  columnId:this.ColumnId,
                  id:artid,
              };

              model.postarticle(data,(res=>{
                  //console.log(res)
                  if(res.status==200){
                      this.$message({
                        message: '恭喜你，信息发布成功',
                        type: 'success'
                        });
                        this.$router.push({path:"/comtopic/helpcenter/index"}); 
                  }
              }))
        },
    }    
}
</script>
<style lang="less">
.z-content{
   .word_title{
       width: 100%;
       height: 90px;
       border-bottom: 1px solid #f2f2f2;
       .el-input{
           width: 700px;
           margin:15px 0 0 245px;
           .el-input__inner{
                border: none;
                width: 700px;
                text-align: center;
                font-size: 24px;
                color: #333333;
                height: 60px;
            } 
       }
       
   }
   .word_post{
       width: 100%;
       height:380px;
       position: relative;
       .post_title{
           float: left;
           font-size: 16px;
           color: #333333;
           margin: 40px 0 0 58px;
           img{
               margin: -2px 6px;
            }
       }
       .left{
           margin-top:35px;
           cursor: pointer;
           .sel2{
               background: rgba(67,189,179,0.04);
                border: 1px solid #8DC6C2;
                font-size: 16px;
                color: #319C95;
           }
           .filename{
               float: left;
                  margin: 3px 122px;
                 padding: 6px 14px;
                background: rgba(0,0,0,0.09);
           }
       }
       .warn{
           font-size: 14px;
            color: #999999;
            position: absolute;
            top: 82px;
            left: 177px;
       }
   } 
   button{
       width: 172px;
       line-height: 36px;
       text-align: center;
       background: #35A69D;
       border-radius: 4px;
       color: #ffffff;
       margin: 0 0 46px 509px;
   }
}
</style>


