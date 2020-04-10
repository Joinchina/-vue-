<template>
    <div class="z-content">
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
            <div class="warn">注意：大小需在10M以内</div>				           
        </div>
        <button @click="add_article">确定</button>
    </div>
</template>
<script>
import model from 'model/help/help'
export default {
data() {
      
      return {        
        title:"",
        filename:'',
        files:'',
        ColumnId:0,
        articleId:0,
        wordurl:'',
      };
    },
    created(){
        this.ColumnId=this.$route.query.columnId;
        this.articleId=this.$route.query.articleId;
      },
    mounted(){
        //编辑是拿数据
        if(this.articleId != '00'){
            //console.log(this.articleId)
            let data={
                id:this.articleId
            };
            model.getArticle(data,(res=>{
                //console.log(res)
                if(res.status==200){
                    this.title=res.data.title;
                    if(res.data.originalFileUrl){
                        this.wordurl=res.data.originalFileUrl;
                        if(res.data.fileName){
                            let name=decodeURI(res.data.fileName);
                            let nameType=res.data.originalFileUrl.split('/');
                            let n=nameType[nameType.length-1].split('.').pop();
                            this.filename=name+'.'+n;
                        }else{
                            let nameType=res.data.originalFileUrl.split('/');
                            let n=nameType[nameType.length-1];
                            this.filename=n;
                        }
                        
                    }else{
                        this.wordurl='word正在转码中';
                        this.filename=this.wordurl
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
            //console.log(file)
            this.filename=file.name;                       
            let name=file.name;
            let size=file.size;
            let maxsize=1024*1024*10;
            let format=file.type;
            //console.log(format)
            if(format=='application/vnd.openxmlformats-officedocument.wordprocessingml.document' || format == 'application/msword'){
                if(size<=maxsize){
                      //console.log("格式正确大小合适，往下执行") 
                      this.files=file
                }else{
                    //console.log("视频文件太大了");
                    this.$message.error('文件太大了');
                    this.files='';
                }
            }else{
                //console.log("不是mp4格式")
              
                this.$message.error('格式不对');
                this.files='';
            }      
                        
        },
        add_article(){            
            if (this.title==0) {
                  this.$message.error('文章标题不能为空');
                  return 
            };
            if (this.files=='') {
                  this.$message.error('附件不能为空');
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
                  type:'WORD',
                  file:this.files,
                  columnId:this.ColumnId,
                  id:artid,
            };
            model.postarticle(data,(res=>{
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
               max-width: 300px;
               overflow: hidden;
               text-overflow:ellipsis;
                 white-space:nowrap
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


