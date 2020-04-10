<style scoped lang="less">
	@import "../../assets/less/icon.less";
	@import "../../assets/less/btn-search.less";
	@import "../../assets/reset-element-ui/user-table.css";
	#wdepthClazz {
		#folderShow{
			cursor: pointer;
		}
		.handle {
			position: relative;
			height: 55px;
			
			.btn-green-line,
			.btn-blue {
				display: inline-block;
				position: absolute;
				top:0;
				font-size: 16px;
				padding: 10px 15px;
				border-radius: 5px;
			}
			.btn-green-line {
				background-color: #ecf6f5;
			}
			.btn-update {
				right: 0;
			}
			i {
				vertical-align: text-bottom;
			}
			
		}

		.wempty {
			box-sizing: border-box;
			margin-bottom: 20px;
		}
		.wres {
			box-sizing: border-box;
			padding: 30px 20px;

			i {
				vertical-align: middle;
				margin-right: 10px;
			}
		}
		.page-sum {
			font-size: 14px;
			color: #666;
			text-align: right;
			padding-top: 15px;
			padding-right: 25px;
		}
		.folder {
			width: 210px;

		}
		
	}
</style>
<template>
	<div id="wdepthClazz">
		<template v-if="emptyFlag">
			<div class="handle">
				<Goback :passtitle="passtitle"></Goback>
	
				<button type="button" class="btn-update btn-blue" @click="updateShow = true">
					<i class="icon-uploading"></i>
					上传资源
				</button>
			</div>
			
			<section class="wempty round-layout">
				<!-- 没有资源时 -->
			    <empty
			      :tip="tip"
			      :btntext="btntext"
			      @add="updateShow = true"></empty>
			    <!-- /没有资源时 -->
			</section>
		</template>

		<template v-if="!emptyFlag">
			<div class="handle">
				<Goback :passtitle="passtitle"></Goback>
				<button type="button" class="btn-update btn-blue" @click="updateShow = true">
					<i class="icon-uploading"></i>
					上传资源
				</button>
			</div>
			
			<section id="w-table" class="wres round-layout">
				<el-table class=""
					:data = "items"
                    stripe    
                    :header-cell-style="{'text-align':'center'}"
					:empty-text = "loadText"
					>
					<el-table-column
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
                                    {{scope.row.name}}
                            </template>
                        
                            <template v-if="scope.row.type==='FOLDER'">
                                <i class="icon-folder"></i>
                                <input type="text" v-if="scope.row.status==='add'"   class="folder " id="folderAdd" v-model.trim="scope.row.name"  @blur="folderSave(scope.row)" v-focus>               
                                <input type="text" v-if="scope.row.status==='edit'"  class="folder " id="folderEdit" v-model.trim="scope.row.name" @blur="folderEdit(scope.row)" v-focus/>
                                <span id="folderShow"  v-if="!scope.row.status" @click="handleView(scope.$index, scope.row)">
                                    {{scope.row.name}}
                                </span>
                            </template>
                        </template>
					</el-table-column>
					<el-table-column
						prop=""
						label="个数/大小"
						width="150"
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
						width="150">
						<template slot-scope="scope">
                            <span v-if="scope.row.downloadFlag==true">是</span>
                            <span v-else>否</span>
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
					    width="250">
					    <template slot-scope="scope" >
					    	<template>
					    		<el-button  type="text" @click.native="handleView(scope.$index, scope.row)" v-if="scope.row.type!='ZIP'">查看</el-button>
					    		<el-button type="text" @click.native="transfer(scope.$index, scope.row)" v-if="!!clazzId&&scope.row.clazzRefFlag==false" style="width:70px">添加至班级</el-button>
                                <el-button type="text" v-if="!!clazzId && scope.row.clazzRefFlag==true" disabled style="width:70px">已添加</el-button>
								<el-button type="text" @click.native="handleEdit(scope.$index, scope.row)" v-show="scope.row.editable==true">编辑</el-button>
								<el-button type="text" @click.native="handleDel(scope.$index, scope.row)" v-show="scope.row.editable==true">删除</el-button>                             
							</template>
					    </template>
				    </el-table-column>
				</el-table>
				<p class="page-sum">共{{totalElements}}条 每页20条</p>

				<!-- 分页 -->
				<div class="pagination">
			      	<el-pagination
			        	@current-change ="handleCurrentChange"
			        	layout="prev, pager, next"
			        	:page-size ="20"
			        	:total="totalElements">
			      	</el-pagination>
			    </div>
			</section>
		</template>
		

		
		<!-- 上传资源 -->
		<update
			:dialogUpdate.sync="updateShow"
			:clazzId ="clazzId"
			:orgId="orgId"
			:parentId = "resId"
			@updateRes="getClazzList">
		</update>
		<!-- 添加至文件夹   -->
        <transFer
            :dialogtransfer.sync="transferShow"
            ref="transfer"
            v-on:refreshbizlines="getClazzList"
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
			@updateRes="getClazzList"></edit-file>

		<!-- 编辑资源 url类型-->
		<edit-url
			:dialogEditUrl.sync="editUrlShow"
			:clazzId="clazzId"
            :orgId="orgId"
			:passresIdent = "passresIdent"
			@updateRes="getClazzList"></edit-url>

		<!-- 编辑资源 text类型-->
		<edit-text
			:dialogEditText.sync="editTextShow"
			:clazzId="clazzId"
            :orgId="orgId"
			:passresIdent = "passresIdent"
			@updateRes="getClazzList"></edit-text>    
	</div>
</template>
<script>
	import Goback from 'base/goback/goback'
	import Empty from 'base/empty/empty'
	import update from 'components/questemp/update'	
	import model from 'model/library/library'
	
	import viewModal from 'base/modal/modal'
	import viewUrl from 'components/questemp/view_url'
	import viewText from 'components/questemp/view_text'
	import { delTip } from '@/global/open'
	import transFer from 'base/modal/transfer'

	import editFile from 'components/questemp/edit_file'
	import editUrl from 'components/questemp/edit_url'
	import editText from 'components/questemp/edit_text'

	import API from '@/global/resource'
	export default {
		data() {
			return {
				transName: {
					'INPROCESS' : '转码进行中',
					'SUCCESS' : '转码成功',
					'FAILURE' : '转码失败',
					'NONE' : ' '
				},
				passtitle:'资源库',
				items: [],
				details: {},
				updateShow: false,	// 是否上传
				cur_page: 1,  //分页第一页
				totalElements: 0,

				tip: '还没有上传资源，点击上传吧 ~',			
				btntext: '上传资源',
				pId: '',		//文件夹资源id
				search: '',
				transferShow:false, //转移
				editFileShow: false,
				editUrlShow: false,
				editTextShow: false,
				viewUrlShow: false,
				viewTextShow: false,
				viewPdfShow: false,
				viewVideoShow: false,
				name: '',		//文件夹名称
				emptyFlag: false,
				loading_font:this.$globalParam.loadText,

				asyncId:'',//传递给子组件班级/机构id
				//班级和机构id
				clazzId:'',
				orgId:'',
				resId:'', //资源文件夹id
				// 编辑时传递的文件id
				passresIdent:"",
				resType:'',//资源类型
				loadText:this.$globalParam.loadText
			}
		},
		created() {
			this.verdictRouter();
		},

		methods: {
			//判断当前路由是机构还是班级
        	verdictRouter(){
				//判断页面是机构还是班级
				let msgid=this.$route.query;
				if(msgid.clazzId){
					this.clazzId=msgid.clazzId;
				};
				if(msgid.orgId){
					this.orgId=msgid.orgId;
				};
				if(msgid.resId){
					this.resId=msgid.resId;
					sessionStorage.setItem("resId", this.resId);
				}												
				this.getClazzList();
        	},
			//分页
			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getClazzList();
			},
			//获取第一页数据
			getClazzList() {
				// console.log(this.asyncId)
				let data = {
					clazzId: this.clazzId,
					parentId: this.resId,
					organizationId:this.orgId,
					number:this.cur_page,
					size: '20'
				}
				model.librarypage(data, (res => {
					 //console.log("资源列表",res);
					if(res.status == 200) {
						
						 this.items = res.data.content;
						 this.loadText = this.$globalParam.dataEmpty;
						 this.totalElements = res.data.totalElements;
						if(this.items.length == 0) {
							this.emptyFlag = true;
						} else {
							this.emptyFlag = false;
						}
						
					} else {
						this.$message.error(res.message);
					}

				}));

			},
			//查看
			handleView(index, row) {
				this.resId = row.id;
				if(row.type === 'FOLDER') {
					this.$router.push({
						path: '/org/repository/depth_list',
						query: {
							clazzId: this.clazzId,
							orgId:this.orgId,
							resId: row.id    //传递文件夹id
						}
					});                
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
				this.passresIdent = row.id;
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
						showClose: true,
						message: '操作失败：无权限',
						type: 'warning'
					});
				}
				
			},
			resDel(index) {
					let _this = this;
					let data = {
						id : this.passresIdent
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
			//编辑资源
			handleEdit(num,msg){
				this.passresIdent=msg.id
				this.resType=msg.type
				if(msg.editable==true){
					if(msg.type === 'VIDEO' || msg.type === 'WORD' || msg.type === 'PPT' || msg.type === 'PDF') {
					this.editFileShow = true;
					}
					if(msg.type === 'URL') {
						this.editUrlShow = true;
					}

					if(msg.type === 'TEXT') {
						this.editTextShow = true;
					} 
				}else{
					this.$message({
						showClose: true,
						message: '操作失败：无权限',
						type: 'warning'
					});
				}							          
			},
			//添加至班级
			transfer(index, row){
				console.log(index,row)
				//console.log(index,row)
				if(row.editable==true){
					this.transferShow=true;
					this.$refs.transfer.getList(API.urls.libraryreference,row.id,this.clazzId);
				}else{
					this.$message({
						showClose: true,
						message: '操作失败：无权限',
						type: 'warning'
					});
				}		
			},  
		},
		components: {
			update,			
			Goback,
			Empty,
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

