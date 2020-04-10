<template>
    <div class="z-content">
        <div class="repository-title">
            <Goback :passtitle="passtitle" :style="gobackstyle"></Goback>                                    
            <div class="addtory">
                <el-dropdown >
                    <el-button type="primary">
                        <i class="icon-circle-add"></i>
                        新建资源
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="addRepository">
                            新建资源
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="createFolder($event)">
                            新建文件夹
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="search" :style="searchstyle">
				<input type="text" placeholder="资源文件名称"  v-model="searchQuery" 
                @keyup.13="searchData(searchQuery)"
                @blur="losesearchData(searchQuery)"/>
                <i class="el-icon-search" @click.stop="searchData(searchQuery)" ></i>
			</div>
        </div>
        <div class="mainbox">
                <el-table class=""
					:data = "items"
                    stripe    
                    :header-cell-style="{'text-align':'center'}"
                    :empty-text = "loadText"
                    >

					<el-table-column
                        show-overflow-tooltip
						label="文件">
                        <template slot-scope="scope">
                            <template v-if="scope.row.type !=='FOLDER'">
                                    <i v-if="scope.row.type==='PDF'" class="icon-pdf2"></i>
                                    <i v-if="scope.row.type==='URL'" class="icon-link"></i>
                                    <i v-if="scope.row.type==='PPT'" class="icon-ppt"></i>
                                    <i v-if="scope.row.type==='TEXT'" class="icon-text"></i>
                                    <i v-if="scope.row.type==='VIDEO'" class="icon-video"></i>
                                    <i v-if="scope.row.type==='WORD'" class="icon-word2"></i>
                                    <i v-if="scope.row.type==='ZIP'" class="icon-zip"></i>
                                    <!-- <i class="icon-yin" v-if="scope.row.clazzRefFlag==true"></i> -->
                                    {{scope.row.name}}
                            </template>
                        
                            <template v-if="scope.row.type==='FOLDER'">
                                <i class="icon-folder"></i>
                                <input type="text" v-if="scope.row.status==='add'"   class="folder " id="folderAdd" v-model.trim="scope.row.name"  @blur="folderSave(scope.row)" v-focus>               
                                <input type="text" v-if="scope.row.status==='edit'"  class="folder " id="folderEdit" v-model.trim="scope.row.name" @blur="folderEdit(scope.row)" v-focus/>
                                <span id="folderShow"  v-if="!scope.row.status" @click="handleView(scope.$index, scope.row)">
                                    <!-- <i class="icon-yin" v-if="scope.row.clazzRefFlag==true"></i> -->
                                    {{scope.row.name}}
                                </span>
                            </template>
                        </template>
					</el-table-column>
					<el-table-column
						prop=""
						label="个数/大小"
						width="100"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <span v-if="scope.row.type!='FOLDER'">{{scope.row.fileSizeFormat}}</span>
                            <span v-if="scope.row.type=='FOLDER'">{{scope.row.fileCount}}</span>
                        </template>
					</el-table-column>
					<el-table-column
						prop=""
						label="类型"
                        align="center"
						width="150">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type=='FOLDER'">文件夹</span>
                            <span v-if="scope.row.type=='PPT'">ppt</span>
                            <span v-if="scope.row.type=='PDF'">pdf</span>
                            <span v-if="scope.row.type=='WORD'">word</span>
                            <span v-if="scope.row.type=='URL'">链接</span>
                            <span v-if="scope.row.type=='TEXT'">文本</span>
                            <span v-if="scope.row.type=='VIDEO'">视频</span>
                        </template>
					</el-table-column>
					<el-table-column
						prop="downloadFlag"
                        align="center"
						label="允许下载"
						width="100">
						<template slot-scope="scope">
                            <span v-if="scope.row.type=='FOLDER'"></span>
                            <span v-else>
                                <span v-if="scope.row.downloadFlag==true">是</span>
                                <span v-else>否</span>    
                            </span>                            
                        </template>
					</el-table-column>
					<el-table-column
						prop=""
                        align="center"
						label="转码状态"
						width="150">
                        <template slot-scope="scope">
							{{transName[scope.row.transStatus]}}
						</template>						
					</el-table-column>										
					<el-table-column
					    label="操作"
                        align="center"
					    width="300">
					    <template slot-scope="scope" >
					    	<template>
					    		<el-button  type="text" @click.native="handleView(scope.$index, scope.row)"  v-show="scope.row.type!='ZIP'">查看</el-button>
                                <el-button type="text" @click.native="transfer(scope.$index, scope.row)" v-if="!!clazzId && scope.row.clazzRefFlag==false" style="width:70px">添加至班级</el-button>
                                <el-button type="text" v-if="!!clazzId && scope.row.clazzRefFlag==true" disabled style="width:70px">已添加</el-button>
					    		<el-button type="text" @click.native="handleEdit(scope.$index, scope.row)" v-show="scope.row.editable==true">编辑</el-button>
								<el-button type="text" @click.native="handleDel(scope.$index, scope.row)" v-show="scope.row.editable==true">删除</el-button>                                                             
					    	</template>
					    </template>
				    </el-table-column>
				</el-table>
                <div class="datanum">
                   <span>共{{totalElements}}条</span><span>每页20条</span>
                </div>
                <!-- 分页 -->
                <div class="tabpage" >
                    <el-pagination
                        layout="prev, pager, next"
                        :page-size="20"
                        :total="totalElements"
                        @current-change="handleCurrentChange">
                    </el-pagination>
                </div>
        </div>
        <!-- 上传资源组件   -->
        <update
			:dialogUpdate.sync="updateShow"
			:clazzId ="clazzId"
            :orgId="orgId"
			:parentId = "pId"
			@updateRes="getlibrarypage">
        </update>
        <!-- 添加至文件夹   -->
        <transFer
            :dialogtransfer.sync="transferShow"
            ref="transfer"
            v-on:refreshbizlines="getlibrarypage"
        >            
        </transFer>
        <!-- 查看pdf -->
		<viewModal :show.sync = "viewPdfShow" contWidth = '80%' bgColor="transparent">
			<div slot="body" class="w-transparent" style="height:100%">
				<iframe v-if="details.type==='WORD' || details.type==='PPT' || details.type==='PDF'" :src="details.linkUrl" id="showIframe" frameborder="0" width="100%" height="100%"></iframe>
				
			</div>
		</viewModal>
        <!-- 查看视频 -->
		<viewModal :show.sync = "viewVideoShow" contWidth = '80%' bgColor="transparent" :before-close="videoClose">
			<div slot="body" style="height:100%">
				<video :src="details.linkUrl" controls="controls"  width="100%" height="100%" id="myVideo">
				您的浏览器不支持video标签
				</video>
			</div>
		</viewModal>
        <!-- 查看资源 url-->
		<view-url
			:dialogViewUrl.sync="viewUrlShow"
			:resId = "resId"
			>
        </view-url>

		<!-- 查看资源 Text-->
		<view-text
			:dialogViewText.sync="viewTextShow"
			:resId = "resId">
        </view-text>

        <!-- 编辑资源 文件类型-->
		<edit-file
			:dialogEditFile.sync="editFileShow"
			:clazzId="clazzId"
            :orgId="orgId"
			:passresIdent = "passresIdent"
			:resType="resType"
			@updateRes="getlibrarypage"></edit-file>

		<!-- 编辑资源 url类型-->
		<edit-url
			:dialogEditUrl.sync="editUrlShow"
			:clazzId="clazzId"
            :orgId="orgId"
			:passresIdent = "passresIdent"
			@updateRes="getlibrarypage"></edit-url>

		<!-- 编辑资源 text类型-->
		<edit-text
			:dialogEditText.sync="editTextShow"
			:clazzId="clazzId"
            :orgId="orgId"
			:passresIdent = "passresIdent"
			@updateRes="getlibrarypage"></edit-text>      
    </div>
</template>
<script>
import Goback from 'base/goback/goback'
import update from 'components/questemp/update'
import transFer from 'base/modal/transfer'
import model from 'model/library/library'
import { delTip } from '@/global/open'

import viewModal from 'base/modal/modal'
import viewUrl from 'components/questemp/view_url'
import viewText from 'components/questemp/view_text'

import editFile from 'components/questemp/edit_file'
import editUrl from 'components/questemp/edit_url'
import editText from 'components/questemp/edit_text'

import API from '@/global/resource'
import library from 'model/library/library'
export default {
    data(){
        return {
            gobackstyle:{
                float: 'left'
            },
            searchstyle:{
                backgroundColor: '#ffffff',
                width: '235px',
            },
            transName: {
					'INPROCESS' : '转码进行中',
					'SUCCESS' : '转码成功',
					'FAILURE' : '转码失败',
					'NONE' : ' '
			},
            passtitle:'资源库',
            searchQuery:'',
            items:[],
            updateShow: false,	// 是否上传
            pId: '',		//文件夹资源id
            resId:'',//资源id
            resType:'',//资源类型
            transferShow:false, //转移
            totalElements:0,  //分页信息数
            number:0,// 当前页数

            //班级和机构id
            clazzId:'',
            orgId:'',
            viewUrlShow: false, // 查看链接
            viewTextShow: false,//查看文本
            viewPdfShow: false,//查看pdf
            viewVideoShow: false,//查看视频

            editFileShow: false,
			editUrlShow: false,
			editTextShow: false,

            details: {},//资源详情

            loadText:this.$globalParam.loadText,
            //定义一个文件夹上传
            postflod:true,
            passresIdent:'',
        }
    },
    directives: {
        focus: {
            // directive definition
            inserted: function (el) {
                el.focus()
            }
        }
	},
    created(){
        this.verdictRouter();
    },
    methods:{
        //判断当前路由是机构还是班级
        verdictRouter(){
            //判断页面是机构还是班级
            let router=this.$route.query;
            if(router.orgId){
                this.orgId=router.orgId;
                
            }else{
                this.clazzId=router.clazzId;
                
            }            
            this.getlibrarypage();
        },
        //添加文件夹失去焦点时
        folderSave(msg){
            this.postflod=false;
            let data={
                type:'FOLDER', 
                name:msg.name,
                clazzId: this.clazzId, 
                organizationId:this.orgId,
            };
             
             model.librarysave(data,(res=>{
                    if(res.status==200){
                        //console.log(res.data)
                        this.getlibrarypage();
                        this.postflod=true;
                    }else{
                        this.$message.error('出错了'+res.message);
                    }
                }))
            
        },
        //编辑文件夹失去焦点时
        folderEdit(msg){           
            let data={
                type:'FOLDER', 
                name:msg.name,
                clazzId: this.clazzId, 
                organizationId:this.orgId,
                id:msg.id
            };
            model.libraryupdate(data,(res=>{
                if(res.status==200){
                    //console.log(res.data)
                    this.getlibrarypage();
                }else{
                    this.$message.error('出错了'+res.message);
                }
            }))
        },
        //编辑资源
        handleEdit(num,msg){
            this.resId=msg.id
            this.passresIdent=msg.id
            this.resType=msg.type
            if(msg.type=='FOLDER'){
                if(msg.editable==true){
                    this.$set(this.items[num], 'status', 'edit');
                }else{
                    this.$message({
                        message: '操作失败：无权限',
                        type: 'warning'
                    });
                }                
                
            };
            if(msg.type === 'VIDEO' || msg.type === 'WORD' || msg.type === 'PPT' || msg.type === 'PDF' || msg.type === 'ZIP') {
                if(msg.editable==true){
                    this.editFileShow = true;
                }else{
                    this.$message({
                        message: '操作失败：无权限',
                        type: 'warning'
                    });
                }
               
		    }
            if(msg.type === 'URL') {
                if(msg.editable==true){
                    this.editUrlShow = true;
                }else{
                    this.$message({
                        message: '操作失败：无权限',
                        type: 'warning'
                    });
                }
                
            }

            if(msg.type === 'TEXT') {
                if(msg.editable==true){
                    this.editTextShow = true;
                }else{
                    this.$message({
                        message: '操作失败：无权限',
                        type: 'warning'
                    });
                }
                
            }           
        },
        //分页资源列表
        handleCurrentChange(val){
            this.number=val;
            this.getlibrarypage();
        },
        //第一页数据列表
        getlibrarypage(){
            let data={
                clazzId: this.clazzId,
                organizationId: this.orgId,
                number: this.number,
                size: 20,
            };                    
            model.librarypage(data,(res=>{
                if(res.status==200){
                    //console.log(res.data);
                    this.items=res.data.content;
                    this.totalElements=res.data.totalElements;
                    this.loadText = this.$globalParam.dataEmpty;
                }
            }))
        },
        //搜索
        searchData(n){
            console.log(n);
            let data={
                clazzId: this.clazzId,
                organizationId: this.orgId,
                number: this.number,
                size: 20,
                keyword:n
            };
            model.librarypage(data,(res=>{
                if(res.status==200){
                    console.log(res.data);
                    this.items=res.data.content;
                    this.totalElements=res.data.totalElements;
                }
            }))
        },
        //增加失去焦点和点击键盘enter时执行搜索
        losesearchData(n){
           this.searchData(n) 
        },
        searchdown(e,n){
            if(e.which==13){
                this.searchData(n) 
            }
        },
        // 新建资源
        addRepository() {            
            this.updateShow=!this.updateShow                  
        },
        //新建文件夹函数
        createFolder(event) {
            if(this.postflod==true){
                event.target.disabled = true;                
                let name =  "新建文件夹";
                let o = "";
                o = {
                    'type':'FOLDER', 
                    'name':name, 
                    'fileCount': '0',
                    'status':'add',
                    'folderId': new Date().getTime()
                };
                this.items.unshift(o);                        
                console.log("items",this.items);
                setTimeout(()=>{
                    event.target.disabled = false;
                },500);	
            }else{
                this.$message({
                message: '上个文件夹还没有创建成功额~',
                type: 'warning'
                });
            }            	    				    			    	
        },
        //查看
        handleView(index, row) {
            this.resId = row.id;
            if(row.type === 'FOLDER') {
                if(!this.clazzId){
                    this.$router.push({
                        path: '/org/repository/depth_list',
                        query: {
                            clazzId: this.clazzId,
                            orgId:this.orgId,
                            resId: row.id    //传递文件夹id
                        }
                    });  
                }else{
                    this.$router.push({
                        path: '/resource/questemp/depth_list',
                        query: {
                            clazzId: this.clazzId,
                            orgId:this.orgId,
                            resId: row.id    //传递文件夹id
                        }
                    });
                }
                              
            }
            if(row.type === 'URL') {
                this.viewUrlShow = true;
            }

            if(row.type === 'TEXT') {
                this.viewTextShow = true;
            }
            if(row.type === 'WORD' || row.type === 'PPT' || row.type === 'PDF') {
                let viewPdfId = row.id;
                this.viewPdfShow = true;
                this.getResource(viewPdfId);
                
            }

            if(row.type === 'VIDEO') {
                let viewVideoId = row.id;
                this.viewVideoShow = true;
                this.getResource(viewVideoId);
                
            }

        },
        getResource(id){
            let data={
                libResourceId:id
            };
            model.librarydetail(data,(res=>{
                if(res.status==200){
                    //console.log(res.data);
                    this.details=res.data
                }
            }))
        },
        videoClose() {
            document.getElementById("myVideo").pause();
            this.viewVideoShow = false;
		    	
		},
        //删除
        handleDel(index, row) {
            this.resId = row.id;
            let str = '';
            if(row.type == 'FOLDER') {
                str = "删除文件夹会将文件夹里的资源文件全部删除，确认删除吗？";
            }else {
                str="确定要删除该资源吗？"
            }
            if(row.editable==true){
                delTip(this, str, this.resDel, index);
            }else{
                this.$message({
                    message: '操作失败：无权限',
                    type: 'warning'
                });
            }
            
        },
        resDel(index) {
            let _this = this;
            let data = {
                id : this.resId
            }
            model.librarydelete(data, (res => {
                // console.log("删除资源",res);
                if(res.status == 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功',
                        duration: 1000,
                        onClose() {
                            //console.log(index)
                            _this.items.splice(index, 1);			                				                			                	
                        }  
                    });                       
                } else {
                    this.$message.error(res.message);
                }
            }));
        },
        //添加至班级
        transfer(index, row){
            console.log(index,row)
            //console.log(index,row)

                
                //判断添加的是文件夹还是文件，文件夹直接显示文件夹
                if(row.type=='FOLDER'){
                    //this.$refs.transfer.getList(API.urls.libraryreference,row.id,this.clazzId,'FOLDER');
                    this.libraryreference(row.id,this.clazzId)
                }else{
                    this.transferShow=true;
                    this.$refs.transfer.getList(API.urls.libraryreference,row.id,this.clazzId,'NOFOLDER');
                }
                
            	
        },
        //文件夹直接添加到班级
        libraryreference(id,cla){
            let data={
                destParentId:'',
                clazzId:cla,
                libResourceId:id,
            };
            library.libraryreference(data,(res=>{
                if(res.status==200){
                     this.$message({
                        type: 'success',
                        message:'添加成功!请至班级-资源管理中查看',                       
                    });
                    this.getlibrarypage(); 
                }else{
                    this.$message.error('上传错误'+res.message); 
                }
            }))
        },

    },
    components:{
        Goback,
        update,
        transFer,
        viewModal,
        viewUrl,
        viewText,
        editFile,
        editUrl,
        editText,
    }
}
</script>

<style lang="less" scoped>
@import "../../assets/reset-element-ui/item.css";
@import "../../assets/less/btn-search.less";
@import "../../assets/reset-element-ui/user-table.css";
@import "../../assets/less/icon.less";	
.z-content{
    #folderShow{
			cursor: pointer;
		}
    .repository-title{
        width: 100%;
        overflow: hidden;
        margin-bottom: 15px;
        .addtory{
            float: right;
            .el-button--primary{
                 color: #fff; 
                 background-color: #35a69d; 
                 border-color: #35a69d;
            }
            .el-button{
                float: right;
                padding: 0 15px;
                height: 40px;
                line-height: 40px;
                color: #fff;
                background-color: #35a69d;
                border-radius: 6px;
                border: 0;
                cursor: pointer;
                margin-left: 12px;
                i{
                    vertical-align: text-bottom;
                }
            }
        }
    }
    .mainbox{
        width: 100%;
        background-color: #ffffff;
        border-radius: 4px;
        overflow: hidden;
        padding: 20px 20px;
        i{
            vertical-align: middle;
             margin-right: 10px;
        }
        .datanum{
            width: 100%;
            text-align: right;
            font-size: 14px;
            color: #666666;
            letter-spacing: 0;
            text-align: right;
            line-height: 14px;
            margin: 20px 0 0 0;
            span{
                margin-left: 10px;
            }
        }
        .tabpage{
            width: 100%;
            margin: 20px 0;
            text-align: right;
            .el-pagination{
                padding: 0
            }
        }
    }
}
</style>


