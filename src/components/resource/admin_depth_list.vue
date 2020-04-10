<style scoped lang="less">
	@import "../../assets/less/icon.less";
	@import "../../assets/less/btn-search.less";
	@import "../../assets/reset-element-ui/user-table.css";
	#wdepthAdmin {
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
			.btn-green-line{
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
	<div id="wdepthAdmin">
		<template v-if="emptyFlag">
			<div class="handle">
				<bread-crumb	
					:crumbFolderCommon = '1'
					:crumbName = 'name'
					></bread-crumb>

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
				<bread-crumb	
					:crumbFolderCommon = '1'
					:crumbName = 'name'
					></bread-crumb>

				<button type="button" class="btn-update btn-blue" @click="updateShow = true">
					<i class="icon-uploading"></i>
					上传资源
				</button>
			</div>
			
			<section id="w-table" class="wres round-layout">
				<el-table class=""
					:data = "items"
					stripe
					>
					<el-table-column
						
						label="文件">
						<template slot-scope="scope">
							
							<i v-if="scope.row.type==='PDF'" class="icon-pdf2"></i>
							<i v-if="scope.row.type==='URL'" class="icon-link"></i>
							<i v-if="scope.row.type==='PPT'" class="icon-ppt"></i>
							<i v-if="scope.row.type==='TEXT'" class="icon-text"></i>
							<i v-if="scope.row.type==='VIDEO'" class="icon-video"></i>
							<i v-if="scope.row.type==='WORD'" class="icon-word2"></i>
							<i v-if="scope.row.type==='ZIP'" class="icon-zip"></i>
							{{scope.row.name}}
							
						</template>
					</el-table-column>
					<el-table-column
						prop="fileSize"
						label="大小"
						width="130">
						<template slot-scope="scope">
							<span v-if="scope.row.type !=='FOLDER'">
								
								{{scope.row.fileSizes ? scope.row.fileSizes+'M' : ''}}
							</span>
							<span v-if="scope.row.type ==='FOLDER'">
								{{scope.row.fileCount}}
							</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="type"
						label="类型"
						width="110">
					</el-table-column>
					<el-table-column
						
						label="允许下载"
						width="110">
						<template slot-scope="scope">
							{{download[scope.row.downloadFlag]}}
						</template>
					</el-table-column>
					<el-table-column
						prop="viewCount"
						label="查看次数"
						width="110">
					</el-table-column>
					<el-table-column
						prop="downloadCount"
						label="下载次数"
						width="110">
					</el-table-column>
					<el-table-column
						
						label="转码状态"
						width="120">
						<template slot-scope="scope">
							{{transName[scope.row.transStatus]}}
						</template>
					</el-table-column>
					<el-table-column
					    label="操作"
					    width="150">
					    <template slot-scope="scope">
					    	<el-button type="text" @click.native="handleView(scope.$index, scope.row)">查看</el-button>
					    	<el-button type="text" @click.native="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button type="text" @click.native="handleDel(scope.$index, scope.row)">删除</el-button> 
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
			:parentId = "parentId"
			:admin = "'admin'"
			@updateRes="getCommonRes(resId)"></update>

		<!-- 编辑资源 文件类型-->
		<edit-file
			:dialogEditFile.sync="editFileShow"
			:resId = "resId2"
			:resType="resType"
			@updateRes="getCommonRes(resId)"></edit-file>

		<!-- 编辑资源 url类型-->
		<edit-url
			:dialogEditUrl.sync="editUrlShow"
			:resId = "resId2"
			@updateRes="getCommonRes(resId)"></edit-url>

		<!-- 编辑资源 text类型-->
		<edit-text
			:dialogEditText.sync="editTextShow"
			:resId = "resId2"
			@updateRes="getCommonRes(resId)"></edit-text>

		<!-- 查看资源 url-->
		<view-url
			:dialogViewUrl.sync="viewUrlShow"
			:resId = "resId2"
			></view-url>

		<!-- 查看资源 Text-->
		<view-text
			:dialogViewText.sync="viewTextShow"
			:resId = "resId2"></view-text>

		<!-- 查看pdf -->
		<modal :show.sync = "viewPdfShow" contWidth = '80%' bgColor="transparent">
			<div slot="body" style="height:100%">
				<iframe v-if="details.type==='WORD' || details.type==='PPT' || details.type==='PDF'" :src="details.linkUrl" id="showIframe" frameborder="0" width="100%" height="100%"></iframe>
				
			</div>
		</modal>

		<!-- 查看视频 -->
		<modal :show.sync = "viewVideoShow" bgColor="transparent" contWidth = '80%' :before-close="videoClose">
			<div slot="body" style="height:100%">
				<video :src="details.linkUrl" controls="controls"  width="100%" height="100%" id="myVideo">
				您的浏览器不支持video标签
				</video>
			</div>
		</modal>

	</div>
</template>
<script>
	import update from 'components/resource/update'
	import Empty from 'base/empty/empty'
	import resource from 'model/resource/resource'
	import editFile from 'components/resource/edit_file'
	import editUrl from 'components/resource/edit_url'
	import editText from 'components/resource/edit_text'
	import viewUrl from 'components/resource/view_url'
	import viewText from 'components/resource/view_text'
	import Modal from 'base/modal/modal'
	import breadCrumb from 'components/resource/breadcrumb'

	import { delTip } from '@/global/open'
	

	export default {
		data() {
			return {
				items: [],
				details: {},
				updateShow: false,	// 是否上传
				cur_page: 1,
				totalElements: 0,
				tip: '还没有上传资源，点击上传吧 ~',			
				btntext: '上传资源',
				parentId: '',		//文件夹资源id
				resId2: '',		//文件夹内部资源id
				resType: '',		// 资源类型
				search: '',
				download: {
					'true' : '是',
					'false' : '否'
				},
				transName: {
					'INPROCESS' : '转码进行中',
					'SUCCESS' : '转码成功',
					'FAILURE' : '转码失败',
					'NONE' : ' '
				},
				editFileShow: false,
				editUrlShow: false,
				editTextShow: false,
				viewUrlShow: false,
				viewTextShow: false,
				viewPdfShow: false,
				viewVideoShow: false,
				name: '',		//创建文件夹名称
				emptyFlag: false,
				
			}
		},
		computed: {
			
			resId() {
				return this.$route.query.resId;
			}
		},
		created() {
			this.getCommonRes(this.resId);
			this.getFolder(this.resId);
		},

		methods: {
			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getCommonRes(this.resId);
			},
			getCommonRes(parentId, cur_page) {
				this.parentId = parentId ? parentId : '';
				let data = {
					id: this.parentId,
					name: "",
					number: cur_page || this.cur_page,
					size: '20'
				}
				resource.resCommonList(data, (res => {
					// console.log("资源列表",res);
					if(res.status == 200) {
						
						this.items = res.data.content;
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
			handleDel(index, row) {
		    	this.resId2 = row.id;
		    	let str = "确定要删除该资源吗？";
		    	delTip(this, str, this.resDel, index);
		    	
		    },
		    resDel(index) {
		    	let _this = this;
		    	let data = {
		    		id : this.resId2
		    	}

		    	resource.resDelete(data, (res => {
		    		// console.log("删除资源",res);
		    		if(res.status == 200) {
		    			this.$message({
			              	type: 'success',
			              	message: '删除成功',
			              	duration: 1000,
			              	onClose() {
			                	_this.items.splice(index, 1);
			                	// _this.getCommonRes();
			              	}
			            });
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));
		    },
		    handleView(index, row) {
		    	this.resId2 = row.id;
		    	
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
		    videoClose() {
		    	document.getElementById("myVideo").pause();
		    	this.viewVideoShow = false;
		    	
		    },
		    getResource(resId) {
		    	let data = {
		    		id: resId
		    	}
		    	resource.resDetails(data, (res => {
		    		if(res.status == 200) {
		    			this.details = res.data;
		    			if(this.resType === 'FOLDER') {
		    				this.name = res.data.name;
		    			}
		    			
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));

		    },
		    getFolder(resId) {
		    	let data = {
		    		id: resId
		    	}
		    	resource.resDetails(data, (res => {
		    		if(res.status == 200) {
		    			this.name = res.data.name;
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));

		    },
		    handleEdit(index, row) {
		    	this.resId2 = row.id;
		    	this.resType = row.type;
		    	if(row.type === 'FOLDER') {
		    		this.getResource(row.id);
		    		// console.log("index",this.items[index]);
		    		this.$set(this.items[index], 'status', 'edit');
		    		
		    	}
		    	if(row.type === 'VIDEO' || row.type === 'WORD' || row.type === 'PPT' || row.type === 'PDF') {
		    		this.editFileShow = true;
		    	}

		    	if(row.type === 'URL') {
		    		this.editUrlShow = true;
		    	}

		    	if(row.type === 'TEXT') {
		    		this.editTextShow = true;
		    	}

		    },
		    
		    
		    
		},
		components: {
			update,
			Empty,
			editFile,
			editUrl,
			editText,
			viewUrl,
			viewText,
			Modal,
			breadCrumb
		}
	}
</script>

