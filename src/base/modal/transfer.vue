<template>
    <div class="z-content">
        <el-dialog class="dialog-form" title="选择文件夹" 
        :visible.sync="dialogtransfer"
        :close-on-click-modal="false"
		:before-close="close"
        width="40%"
        >
            <el-form :model="form">
                <el-form-item label="文件夹" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="文件夹名字">
                        <el-option label="班级资源列表" value="" v-show="showzi"></el-option>                      
                        <el-option v-for="(item,index) in items" :key="index" :label="item.name" :value="item.id" v-show="showli"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">               
                <el-button type="primary" @click="posttransfer">确 定</el-button>
                <el-button @click="close">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import http from '@/global/request';
import library from 'model/library/library'
export default {
    data(){
        return {
                form: {                    
                    region: '',                    
                },
                formLabelWidth: '120px',
                items:[], //文件夹列表
                url:"",   //转移请求地址
                id:"",    //转移的文件id
                clazzId:'',//..
                showli:false,//是否不显示文件夹列表
                showzi:false,//显示资源
        }
    },
    props: ['dialogtransfer','resId'],
 
    methods:{
        close() {
            this.$emit('update:dialogtransfer', false); 
            this.form.region='';
            this.showli=false;
            this.showzi=false;     								
        },
        getList(api,id,classid,flo){ 
             this.url=api;
             this.id=id; 
             this.clazzId=classid;
             this.getClazzfolder(classid,flo);                                    
        },
        //查询当前班级下的资源文件夹
        getClazzfolder(n,flo){
            let data={
                clazzId:n 
            };
            
            library.resourceFolderlist(data,(res=>{
                if(res.status==200){
                     if(!!flo && flo=='zwai'){
                         this.showli=true;
                         this.form.region=res.data[0].id
                         this.items=res.data;
                     }else if(!!flo && flo=='znei'){
                         this.showli=true;
                        this.showzi=true;
                          this.items=res.data;
                     }else if(!!flo && flo=='FOLDER'){
                         this.showzi=true;
                         this.items=res.data;
                     }else{
                         this.items=res.data;
                          this.showli=true;
                        this.showzi=true;
                     };                                                   
                }
            }))
        },
        //文件的转移和添加至班级操作
        posttransfer(){            
            let url=this.url;
            let data={};
            let tistr='';
            //判断当前的页面是转移还是添加至文件夹
            if(url.indexOf('/library/resource/reference')>-1){
                //添加至文件夹页面
                data={
                    clazzId:this.clazzId, //添加至班级传递的参数
                    libResourceId:this.id,         //添加至班级传递的参数
                    destParentId:this.form.region,          //添加至班级传递的参数
                };
                tistr='添加成功!请至班级-资源管理中查看'
            }else{
                data={
                    resourceId:this.id,  //转移传递的参数
                    targetFolderId:this.form.region,//转移传递的参数                
                };
               tistr='转移成功!'
            }
                     
            http.post(url, data, 'h2', (res)=>{              
                if(res.status == 200){
                    this.close();
                    this.$emit('refreshbizlines',this.resId);
                    this.form.region='';
                    this.$message({
                        type: 'success',
                        message: tistr,                       
                    });                                  
                }else{
                   this.$message.error(res.message);
                }
             })
        },
    },    
}
</script>

<style lang="less" >
@import "../../assets/reset-element-ui/form.css";
.z-content{
    width: 100%;
    overflow: hidden;
    .dialog-form{
        .el-dialog__body {
            padding: 30px 42px 100px 15px!important;
        }
    }
}
</style>

