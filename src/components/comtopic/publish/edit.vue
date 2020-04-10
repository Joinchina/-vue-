<template>
    <div class="z-content">
        <div id="edit_menu" class="toolbar">
        </div>
        <div class="word_title">
            <el-input v-model="title" placeholder="文章标题（50字之内）"></el-input>
        </div>
        <div id="edit_content" class="text">

        </div>
        <button v-on:click="getContent" class="btn">确定</button>
    </div>
</template>
<script>
import { getToken } from '@/filters/userVerify'
import API from '@/global/resource';
import model from 'model/help/help'
import E from 'wangeditor'
import ailiyunUpload from 'model/aliyun/index'
export default {
      data () {
        return {
          title:'',
          editorContent: '',
          ColumnId:0,
          // 阿里云上传
            percentage: 0,
            aliyunName: '',
            originalUrl: '',
            loadingText:0,
            posturl:'',
            articleId:0,
        }
      },
      created(){
        this.ColumnId=this.$route.query.columnId;
        this.articleId=this.$route.query.articleId;
      },
      methods: {
        getContent: function () {
           // console.log(this.editorContent);//内容            
              if (this.title.length==0) {
                  this.$message.error('文章标题不能为空');
                  return 
              };
              if(this.editorContent==''){
                  this.$message.error('内容不能为空');
                  return
              }
              let artid;
              if(this.articleId=='00'){
                  artid=''
              }else{
                 artid=this.articleId; 
              }
              let data={
                  title:this.title,
                  type:'TEXT',
                  columnId:this.ColumnId,
                  content:this.editorContent,
                  id:artid,
              };
              model.postarticle(data,(res=>{
                  //console.log(res);
                  if(res.status==200){
                      this.$message({
                        message: '恭喜你，信息发布成功',
                        type: 'success'
                        });
                        this.$router.push({path:"/comtopic/helpcenter/index"});
                  }
              }))
           
        },  
      },
      mounted() {  
        var editor = new E('#edit_menu', '#edit_content')
        editor.customConfig.menus = [
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
        editor.customConfig.customUploadImg =  (files, insert)=> {
                let data={
                    helpColumnId:this.ColumnId,
                };
                model.helpaddimg(data,(result=>{
                    if(result.status == 200) {
                        this.percentage = 0;
                        ailiyunUpload.aliyunUpload(result.data,files,(percentage, cpt)=>{
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
                        this.$message.error(result.message);

                    }
                }))

        };

        editor.customConfig.onchange = (html) => {
          this.editorContent = html
        };
        editor.create();
        //编辑是拿数据
        if(this.articleId != '00'){
            let data={
                id:this.articleId
            };
            model.getArticle(data,(res=>{
                //console.log(res)
                if(res.status==200){
                    this.title=res.data.title;
                    // this.editorContent=res.data.content;
                    editor.txt.html(res.data.content);
                }
            }))             
        }

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
    .btn{
       width: 172px;
       line-height: 36px;
       text-align: center;
       background: #35A69D;
       border-radius: 4px;
       color: #ffffff;
       margin: 20px 0 46px 509px;
   }
    .toolbar {
        background: #FCFDFF;
        border: 1px solid #F2F0F0;
        height: 54px;
    }
    .toolbar:first-child{
        padding-left: 366px;
    }
    .text {
        min-height: 330px;
    }
    .w-e-toolbar{
        .w-e-menu{
            padding: 17px 10px;
        }
        
    } 
}

</style>


