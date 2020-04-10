<template>
    <div id="z-cpntent">
		<el-dialog class="dialog-form"
		:visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :before-close="handleClose"
        width="50%"
		>
            <h1>{{title}}</h1>
            <div id="content"></div>
            <video :src="videourl" v-show="this.videourl.length!=0"  controls="controls" ></video>
            <p v-for="(item,index) in wordurl" :key="index" v-show="type=='word'">
               <img :src="item" alt="">
            </p>    
            <p v-show="type=='noword'">word转码中暂时无法查看</p>
            
		</el-dialog>		
	</div>
</template>
<script>
import model from 'model/help/help'
export default {
   data(){
       return {
          title:"",
          content:'',
          videourl:'',
          wordurl:'',
          type:'',
       }
   } ,
   props:['dialogVisible','viewcontent'],
   watch:{
     viewcontent:"add_html"  
   },
   methods:{
       handleClose(done) {
          this.$emit('update:dialogVisible', false);
          this.content='';
          $("#content").html('<div id="content"></div>')
          $('video').trigger('pause');
          this.videourl='';
        //   this.wordurl='';
      },
      add_html(){
          if(this.dialogVisible==true){
                    let data={
                            id:this.viewcontent
                    };         
                                       
                model.getArticle(data,(res=>{
                    //console.log(res)
                    if(res.status==200){
                        this.title=res.data.title;
                        if(res.data.type=='TEXT'){
                          this.content=res.data.content;
                          this.type=''
                          $("#content").html(this.content)  
                        }else if(res.data.type=='VIDEO'){
                          this.videourl=decodeURI(res.data.url) 
                          this.type=''  
                        } else{
                            if(res.data.pictures){
                               this.type='word'
                               this.wordurl=res.data.pictures
                               console.log(this.wordurl)
                            }else{
                               this.type='noword'
                               this.wordurl='' 
                            }                              
                        }                       
                    }
                }))             
          }
      },
   }
}
</script>
<style lang="less" >

#z-cpntent {
    .dialog-form{
        .el-dialog__header{
            height: 0!important;
            padding: 0!important;
        }
        h1{
            text-align: center;
            font-size: 18px;
            color: #333;
        }
        .el-dialog__body{
            padding: 30px 42px 30px 42px;
            max-height: 700px;
            iframe{
                margin: 0 auto;
                display: block;
                margin-top: 40px;
            }
        }
        video{
            margin: 0 auto;
            margin-top: 20px;
        }
        img{
            width: 900px;
        }
    }
    #content{
        width: 100%;
        margin-top: 40px;
        p{
            iframe{
                    width: 700px;
                margin: 0 auto;
                display: block;
                height: 500px;
                margin-top: 40px;
            }
        }
    }		         		
}

</style>


