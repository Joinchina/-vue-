<template>
    <div class="z-content">
        <Goback :passtitle="passtitle"></Goback>
        <div class="publish_box">
             <div class="publish_nav">
                <template>
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="word" name="first"></el-tab-pane>
                        <el-tab-pane label="视频" name="second"></el-tab-pane>
                        <el-tab-pane label="文本" name="third"></el-tab-pane>
                    </el-tabs>
                </template>
                <div class="publish_title">
                    <img src="../../../assets/img/help/l.png" alt="">
                    <span>所属栏目：{{Contenttitle}}
                        <span v-if="Whildend=='STUDENT'">（学员端）</span>
                        <span v-else-if="Whildend=='MANAGER'">（管理端）</span>
                        <span v-else>（全部）</span>
                    </span>                    
                </div>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import model from 'model/help/help'
import Goback from 'base/goback/goback'
export default {
    data(){
        return {
           passtitle:"帮助中心" ,
           activeName: 'first',
           ColumnId:0,
           articleId:0,
        }
    },
    computed:{
        Contenttitle(){
            return this.$store.getters.showContenttitle
        },
        Whildend(){
            return this.$store.getters.showwhileend
        },
    },
    created(){
        this.ColumnId=this.$route.query.columnId;
        this.articleId=this.$route.query.articleId;
    },
    updated(){
       this.setactiveName();
    },
    mounted(){
       this.setactiveName();
    },
    methods:{
      handleClick(tab, event) {
          if(tab.name=='first'){
            //路由跳转到文档
            this.$router.push({path:"/comtopic/publish/word?columnId="+this.ColumnId+"&articleId="+this.articleId+""})
          }else if(tab.name=='second'){
             //路由跳转到视频
             this.$router.push({path:"/comtopic/publish/video?columnId="+this.ColumnId+"&articleId="+this.articleId+""})
          }else{
            //路由跳转到编辑
            this.$router.push({path:"/comtopic/publish/edit?columnId="+this.ColumnId+"&articleId="+this.articleId+""})
          }
      },
      setactiveName(){
          // 定位当前的路由选项
        let rou = JSON.stringify(this.$route.path).split("?").shift();
        if (rou.indexOf("word") > -1) {
              this.activeName="first"
        }else if(rou.indexOf("video") > -1){
             this.activeName="second"
        }else{
            this.activeName="third"
        }
      }, 
    },
  components:{
      Goback,
  }  
}
</script>
<style lang="less" >
.z-content{
    .publish_box{
        width: 100%;
        overflow: hidden;
        background-color: #ffffff;
        border-radius: 4px;
        box-shadow: 0 0 7px 0 rgba(0,0,0,0.03);
        .el-tabs__header {
            padding:20px 40px 1px 40px;
            margin: 0;
            }
        .publish_nav{
            background: #FFFFFF;
            box-shadow: 0 4px 7px 1px rgba(0,0,0,0.02);
            overflow: hidden;
            .el-tabs{
                width: 50%;
                float: left;
            }
            .el-tabs__item{
                height:54px;
                font-size: 20px;
            }
            .publish_title{
                float: right;
                height: 74px;
                line-height: 74px;
                font-size: 16px;
                color: #333333;
                margin-right: 36px;
                img{
                    margin-right: 6px;
                    margin-top: -2px; 
                }
            }
        }
        .el-tabs__nav-wrap::after{
            background-color: #ffffff
        }
    }
}
</style>


