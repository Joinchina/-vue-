<template>
    <div class="z_content">
        <div class="help_top">
            <Goback :passtitle="passtitle"></Goback>
        </div>        
        <div class="help_info"
            v-loading="loading"
            :element-loading-text="$globalParam.loadText"
            :element-loading-spinner="$globalParam.loadSpinner"
            :element-loading-background="$globalParam.loadText"
        >
            <div class="pro-menu" >
                <ul class="menu-list">
                    <li  v-for="(item,index) in navdata" :key="index" :class="{active:item.isactive}" @click="setstyle(item,index)" :title="item.name">
                        <span class="pro-list" effect="dark" :content="item.name" placement="bottom-start">
                          <span v-if="item.deposition=='STUDENT'">（学）</span>
                          <span v-else-if="item.deposition=='MANAGER'">（管）</span>
                          <span v-else>（全）</span>                                              
                            {{item.name}}
                        </span>
                        <span class="pro-more">
                          <el-dropdown class="more" trigger="click" placement="bottom-start">
                            <span class="el-dropdown-link">
                              <i class="el-icon-more"></i><br/>                           
                            </span>
                            <el-dropdown-menu class="more-menu" slot="dropdown">
                              <el-dropdown-item command="edit" @click.native="savelist(item)">
                                <i class="icon-edit"></i>
                                编辑项目
                              </el-dropdown-item>
                              <el-dropdown-item command="delete" @click.native="deletelist(item)">
                                <i class="el-icon-delete"></i>
                                删除项目
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                      </span>
                    </li>
                             
                </ul>
                <div class="create-pro">
                     <p v-show="navdata.length==0">还没有创建栏目额~</p>
                    <button class="btn-add" type="button" @click="add_nav">
                      <i data-v-4f5560cf="" class="icon-add"></i>
                      创建栏目
                    </button>                    
                </div>
            </div>
            <!-- 为空时显示 -->
            <div id="active" v-if="navdata.length==0">
                <p>暂无数据</p>
                <span>温馨提示：请先创建栏目，然后再发布文章</span>
            </div>
            <div class="pro-content" v-else>
                <section>
                  <h1>{{contenttitle}}</h1>
                  <button class="btn-add" type="button" @click="add_article">
                      <i class="icon-circle-add"></i>
                      新建文章
                  </button>
                </section>
                <div class="helptable">
                   <template>
                                <el-table
                                :data="tableData"
                                style="text-align:center"
                                :stripe="true"                                              
                                :empty-text="loading_font"
                                tooltip-effect="dark"
                                >                          
                                <el-table-column
                                prop=""
                                align="center"
                                type="index"
                                label="顺序"                                
                                width="80"> 
                                </el-table-column>

                                <el-table-column
                                prop=""                                
                                label="文章标题"
                                width="440" 
                                align="left"                               
                                :show-overflow-tooltip='true'
                                >      
                                  <template slot-scope="scope">
                                      <span class="scopetitle"  @click="view_article(scope.row)">{{scope.row.title}}</span>
                                  </template>                           
                                </el-table-column>
                                
                                <el-table-column
                                prop="type"
                                label="类型"
                                align="center"                                
                                width="80">                                    
                                </el-table-column>
                                <el-table-column
                                prop=""
                                align="center"
                                label="操作">
                                <template slot-scope="scope">
                                     <span class="spanbtn" @click="calllink(scope)">复制链接</span>
                                     <span class="spanbtn" @click="edit(scope)">编辑</span>
                                     <span class="spanbtn" style="color: #E94E57;" @click="dele(scope)">删除</span>
                                     <span class="spanbtn" @click="topup(scope)">上移</span>
                                     <span class="spanbtn" @click="bottomup(scope)">下移</span>
                                </template>
                                </el-table-column>                          
                        </el-table>
                    </template>
                </div>
            </div>
        </div>
        <!-- 创建栏目组件 -->
        <Createnav :dialogAddAct.sync="addAct" :defaultFlag = "true" v-on:passnavdata="passnavdata" :editnav_title='editnav_title' :editnav_msg='editnav_msg' ref="childeditnav"></Createnav>
        <!-- 查看文章详情 -->
        <viewArticle :dialogVisible.sync="dialogVisible" :defaultFlag = "true" :viewcontent="viewcontent"></viewArticle>
    </div>
</template>
<script>
import model from 'model/help/help'
import Goback from 'base/goback/goback'
import Createnav from './created_nav'
import viewArticle from './viewarticle'
export default {   
    data(){
        return {
            passtitle:'帮助中心',
            addject:true,
            setheight:76,
            navdata:[],
            tableData:[],
            loading_font:this.$globalParam.loadText,
            addAct: false,
            dialogVisible:false,
            editnav_title:'创建栏目',
            editnav_msg:{},
            ColumnId:0,//帮助中心的id
            contenttitle:'默认', // 栏目标题 
            whileend:'全部',     //栏目展示在哪 
            viewcontent:'', 
            ids:[],//排序后的文章id 
            loading: true,   
        }
    },
    created(){
      this.getlist();
    },
    mounted() {
      
    },
    updated(){
      // this.getlist(); 
    },
    methods:{ 
    add_nav(){
      this.addAct=true;
    },
    view_article(msg){
       this.dialogVisible=true;
       //console.log(msg);
       this.viewcontent=msg.id;
    },      
    setstyle(item,index){      
      this.navdata.forEach(element => {
        this.$set(element,'isactive',false);
      });
      this.$set( this.navdata[index],'isactive',true);
      this.ColumnId=this.navdata[index].id;
      this.contenttitle=this.navdata[index].name;	
      this.whileend=this.navdata[index].deposition
      //console.log(this.ColumnId)
      //请求当前栏目下的文章
      this.gethelpArticle(this.ColumnId);
    },
    calllink(msg){
      //console.log(msg.row);
      let link;
      let copy;
      this.navdata.forEach(element => {
        if(element.isactive==true){
          copy=element.deposition;
          if(copy=='ALL'){
            copy='MANAGER'
          };
        }
      });
      let host=location.host;
      if(host.indexOf('mgr.shixunbao.cn')>-1){
       link='https://www.shixunbao.cn/help/index.html#/help/details?type='+copy+'&columnId='+msg.row.columnId+'&id='+msg.row.id+''
      }else{
       link=' https://10.98.24.67:8003/help/index.html#/help/details?type='+copy+'&columnId='+msg.row.columnId+'&id='+msg.row.id+''
      };
      let textArea = document.createElement("textarea");      
          textArea.value = link;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            let successful = document.execCommand('copy');
            let infomation = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
            this.$message({
              message: infomation,
              type: 'success'
            });
          } catch (err) {
             this.$message.error(infomation);
          } 
          document.body.removeChild(textArea);
    },
    edit(msg){
      //点击编辑页面时路由需要跳转到编辑页面并将内容展示到编辑器中
     // console.log(msg)
     this.$store.state.Contenttitle = this.contenttitle;
     this.$store.state.Whileend = this.whileend;
      if(msg.row.type=='WORD'){
        this.$router.push({path:"/comtopic/publish/word?columnId="+this.ColumnId+"&articleId="+msg.row.id});
      }else if(msg.row.type=='VIDEO'){
        this.$router.push({path:"/comtopic/publish/video?columnId="+this.ColumnId+"&articleId="+msg.row.id});
      }else{
        this.$router.push({path:"/comtopic/publish/edit?columnId="+this.ColumnId+"&articleId="+msg.row.id});
      }
      
    },
    dele(msg){
      let data={
        id:msg.row.id
      };
      model.Deletearticle(data,(res=>{
        if(res.status==200){
          //console.log(res.data)
          this.$message({
          message: '恭喜你，信息删除成功',
          type: 'success'
         });
         this.gethelpArticle()
        }
      }))
    },
    topup(msg){
      let n=msg.$index;
      let newmsg=msg.row;
      if(n==0){
         //console.log('已经是第一位了还上升你吗啊');
         return
      }else{
        this.tableData.splice(n,1); //删除当前数组
        this.tableData.splice(n-1,0,newmsg) //在指定位置添加元素
        // 遍历数组将排序好的集合发给后端
        this.tableData.forEach((item,index)=>{
          this.ids.push(item.id);
        });
        this.sorthelparticle();
      }
    },
    bottomup(msg){
       let n=msg.$index;
       let newmsg=msg.row;
      if(n==this.tableData.length-1){
         //console.log('已经是倒数第一了，你还想倒数第几？');
         return
      }else{
        this.tableData.splice(n,1); //删除当前数组
        this.tableData.splice(n+1,0,newmsg) //在指定位置添加元素
        this.tableData.forEach((item,index)=>{
          this.ids.push(item.id);
        });
        this.sorthelparticle();
      }      
    },
    sorthelparticle(){
      let data={
        ids:this.ids
      };
      model.sorthelparticle(data,(res=>{
        if(res.status==200){
          this.ids=[];
          console.log(res.data)
        }
      }))
    },
    rowClass(){
       return 'text-align:center'
    },
    add_article(){
      this.$router.push({path:"/comtopic/publish/index?columnId="+this.ColumnId+"&articleId=00"});
      // 点击新建文章时将当前栏目存入到vuex中
      this.$store.state.Contenttitle = this.contenttitle;
      this.$store.state.Whileend = this.whileend;
    },
    // 接收来自子组件的数据初始化一下列表
    passnavdata(n){
      // this.navdata.push(n)
      this.getlist();
    },
    //获取栏目列表
    getlist(){
      let data
      model.helpColumnlist(data,(res=>{
        if(res.status==200){
          //console.log(res.data)
          this.loading = false;
          this.navdata=res.data;
          // 同步栏目id
          this.ColumnId=res.data[0].id;
          this.gethelpArticle();
          //同步content标题
          this.contenttitle=res.data[0].name
          this.whileend=res.data[0].deposition
         // console.log(this.ColumnId)
          this.navdata.forEach((element,index) => {
            this.$set(element,'isactive',false);            
          });
          this.$set( this.navdata[0],'isactive',true);
        }
      }))
    },
    //删除项目栏目
    deletelist(num){
      let data={
        id:num.id,
      }
      model.helpColumndelete(data,(res=>{
        if(res.status==200){
           this.getlist(); //删除成功刷新表单
           this.$message({
            message: '栏目删除成功',
            type: 'success'
          });
        }
      }))
    },
    //编辑项目栏目
    savelist(msg){
       this.addAct=true;
       this.editnav_title='编辑栏目';
       this.$refs.childeditnav.editnav(msg);
    },
    //获取栏目下的文章列表
    gethelpArticle(){
      let data={
        columnId:this.ColumnId
      };
      // console.log(data)
      model.gethelpArticle(data,(res=>{
        if(res.status==200){
          //console.log(res)
          this.tableData=res.data;
          this.loading_font=this.$globalParam.dataEmpty;
        }
      })) 
    },
	},
    components:{
        Goback,
        Createnav,
        viewArticle
    }    
}
</script>
<style lang="less" scoped>
@import "../../../assets/less/btn-search.less";
@import "../../../assets/reset-element-ui/user-table.css";
.z_content{
  
    .help_top{
       width: 100%;
    overflow: hidden; 
    }
.help_info{
    width:100%;
    overflow: hidden;  
    .pro-menu {
    width:230px;
    background-color: #ffffff;
    border-radius: 4px;
    float: left;
        overflow: hidden;
     box-shadow: 0 0 7px 0 rgba(0,0,0,0.03);
    .menu-list{
      width: 100%;
      overflow: hidden;      
      li{
        width: 100%;
        line-height: 55px;
        font-size: 16px;
        color: #333333;
        padding-left:12px;
        position: relative;
        cursor: pointer;
        .pro-list{
          width: 196px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: block;
        }
        .pro-more{
          position:absolute;
          top: 0;
          right: 0;
          margin-right: 14px;
          cursor: pointer;
        } 
      }
      li:hover{
        background: #35A69D;
        color: #ffffff !important;
        .el-dropdown{
          color: #ffffff !important;
        }
      }
    }
    .create-pro{
      width: 100%;
      height: 110px;
      background-color: #ffffff;
      p{
        text-align: center;
        font-size: 16px;
      }
      button{
        width: 145px;
        line-height: 36px;
        margin:36px 0 0 43px;
        font-size: 16px;
        color: #319C95;
        border-radius: 6px;
        background:rgba(49,156,149,0.03);
        border:1px solid #319C95;
        cursor: pointer;
        i{
          vertical-align: text-bottom;
        }
      }
    }

  }
}
.active{
  background: #35A69D;
  color: #ffffff !important;
  .el-dropdown{
    color: #ffffff !important;
  }
}
#active{
    width: 940px;
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 0 7px 0 rgba(0,0,0,0.03);
    border-radius: 4px;
    float: right;
    height: 110px;
    p{
    text-align: center;
    color: #999;
    font-size: 24px;
    margin-top: 20px;
    }
    span{
      width: 100%;
      display: block;
      text-align: center;
      color: #999;
      font-size:18px;
      margin-top: 10px;
    } 
}
.pro-content{
    width: 940px;
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 0 7px 0 rgba(0,0,0,0.03);
    border-radius: 4px;
    float: right;
    section{
      box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 68px;
    box-shadow: 0 4px 7px 1px rgba(0,0,0,0.02);
    padding: 23px 16px;
      h1{
        font-size: 18px;
        color: #000;
        border-left: 3px solid #319c95;
        line-height: 1.2em;
        padding-left: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 70%;
        float: left;
      }
    button{
        width: 145px;
        line-height: 36px;
        margin-top: -7px;
        float: right;
        font-size: 16px;
        color: #ffffff;
        border-radius: 6px;
        background:#319C95;
        cursor: pointer;
        i{
          vertical-align: text-bottom;
        }
    }  
      .pro-more{
        position: absolute;
    right:16px;
    top: 18px;
    color: #666;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
      }
    }
    .helptable{
      width: 100%;
      overflow: hidden;
      padding:30px 25px;
      .scopetitle{
        cursor:pointer;
        float:left;
        width: 432px;
        overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;



      }
      .scopetitle:hover{
        color: #3183DA
      }
      .spanbtn{
        font-size: 14px;
        color: #3183DA;
        margin-right: 16px;
        cursor: pointer;
      }
      .el-table{
        border-bottom: none!important;
      }
    }
}
}
</style>


