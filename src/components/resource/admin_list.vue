<style Scoped lang="less">
	@import "../../assets/less/icon.less";
	@import "../../assets/less/btn-search.less";
	@import "../../assets/reset-element-ui/user-table.css";
	#wadminRes {
		.round-layout {
			margin-bottom: 20px;
		}
		.handle {
			position: relative;
			height: 55px;
			.search {
				float: left;
				background-color: #fff;
			}
			.btn-green-line {
				display: inline-block;
				position: absolute;
				top:0;
				font-size: 16px;
				padding: 10px 15px;
				border-radius: 5px;
				background-color: #ecf6f5;
			}
			
			.btn-folder {
				right: 0;
			}
			
			i {
				vertical-align: middle;
			}
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
			display: inline-block;
			width: 210px;
			-webkit-appearance: none;
		    -moz-appearance: none;
		    appearance: none;
		    background-color: #fff;
		    background-image: none;
		    border-radius: 4px;
		    border: 1px solid #bfcbd9;
		    box-sizing: border-box;
		    color: #1f2d3d;
		    font-size: inherit;
		    height: 36px;
		    line-height: 1;
		    outline: 0;
		    padding: 3px 10px;
		    transition: border-color .2s cubic-bezier(.645,.045,.355,1);

		}
	}
</style>
<template>
	<div id="wadminRes">
		<section class="round-layout"  v-if="emptyFlag">
			<!-- 没有资源时 -->
		    <empty
		      :tip="tip"
		      :btntext="btntext"
		      @add="emptyAddFolder"></empty>
		    <!-- /没有资源时 -->
		</section>

		<template v-if="!emptyFlag">
			<div class="handle">
				<button class="btn-folder btn-green-line" type="button" @click.prevent.stop="addFolder">
					<i class="icon-add"></i>
					新建文件夹
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

							<template v-if="scope.row.type !=='FOLDER'">
								<i v-if="scope.row.type==='PDF'" class="icon-pdf2"></i>
								<i v-if="scope.row.type==='URL'" class="icon-link"></i>
								<i v-if="scope.row.type==='PPT'" class="icon-ppt"></i>
								<i v-if="scope.row.type==='TEXT'" class="icon-text"></i>
								<i v-if="scope.row.type==='VIDEO'" class="icon-video"></i>
								<i v-if="scope.row.type==='WORD'" class="icon-word2"></i>
								{{scope.row.name}}
							</template>
							
							<template v-if="scope.row.type==='FOLDER'">
								<i class="icon-folder"></i>
								
								<!-- <input type="text" v-if="scope.row.status==='add'" class="folder " id="folderEdit" v-model.trim="scope.row.name" @blur="folderSave(scope.row)" v-focus>
								
								<input type="text" v-if="scope.row.status==='edit'" class="folder " id="folderEdit" v-model.trim="scope.row.name" @blur="folderEdit(scope.row)"  v-focus/> -->

								<span v-if="!scope.row.status" id="folderShow">{{scope.row.name}}</span>
							</template>
						</template>
					</el-table-column>
					<el-table-column
						prop="fileSize"
						label="个数"
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
						prop="display"
						label="展示范围"
						width="130">
						<template slot-scope="scope">
							<span v-if="scope.row.type !=='FOLDER'">

								{{scope.row.display ? scope.row.display: ''}}
							</span>

							<span v-if="scope.row.type ==='FOLDER'">
								{{rangeType[scope.row.display]}}
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
					    	<template v-if="scope.row.status !=='add'">
					    		<el-button  type="text" @click.native="handleView(scope.$index, scope.row)">查看</el-button>
					    		<el-button type="text" @click.native="handleEdit(scope.$index, scope.row)">编辑</el-button>
								<el-button type="text" @click.native="handleDel(scope.$index, scope.row)">删除</el-button> 
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

		<!--创建文件-->
		<create-folder 
			:dialogFolderCreate.sync = "addFolderFlag"
			@foldCreate = "foldCreate">
			
		</create-folder>

		<!--编辑文件夹-->
		<edit-folder 
			:dialogFolderCreate.sync = "addFolderEditFlag"
			:editFolderId = "editFolderId"
			@foldCreate = "foldCreate">
			
		</edit-folder>
	</div>
</template>
<script>
	
	import Empty from 'base/empty/empty'
	import resource from 'model/resource/resource'
	

	import { delTip } from '@/global/open'
	import { getCurRole } from '@/filters/userVerify'

	import createFolder from 'components/resource/create'
	import editFolder from 'components/resource/edit'

	export default {
		data() {
			return {
				items: [],
				details: {},
				cur_page: 1,
				totalElements: 0,
				tip: '还没有上传资源，点击上传吧 ~',			
				btntext: '新建文件夹',
				pId: '',		//文件夹资源id
				resId: '',			//资源 id
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
				
				name: '',		//创建文件夹名称
				emptyFlag: false,

				addFolderFlag:false, //创建文件夹弹层
				addFolderEditFlag:false,//编辑文件夹弹层
				editFolderId:"",

				rangeType:{
					ttManager:"管理端",
					ttStudent:"学员端",
					all:"全部"
				}


			}
		},
		computed: {
			
			role() {
 				return getCurRole();
 			}
		},
		created() {
			this.getCommonRes();
		},
		directives: {
		  focus: {
		    // directive definition
		    inserted: function (el) {
		      el.focus()
		    }
		  }
		},
		methods: {

			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getCommonRes();
			},

			

			getCommonRes(cur_page) {
				let data = {
					id: '',
					number: cur_page || this.cur_page,
					size: '20'
				}

				resource.resCommonList(data, (res => {
					// console.log("通用资源",res);
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
		    	this.resId = row.id;
		    	let str = "删除该文件夹会将文件夹里的资源全部删除，确定删除吗？";
		    	delTip(this, str, this.resDel, index);
		    	
		    },
		    resDel(index) {
		    	let _this = this;
		    	let data = {
		    		id : this.resId
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
			                	
			              	}
			            });
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));
		    },
		    handleView(index, row) {
		    	this.resId = row.id;
		    	if(row.type === 'FOLDER') {
		    		this.$router.push({
		    			path: '/adminres/resdepth',
		    			query: {
		    				resId: row.id
		    			}
		    		});
		    		
		    	}
		    	

		    },
		   
		    getResource(resId) {
		    	let data = {
		    		id: resId
		    	}
		    	resource.resDetails(data, (res => {
		    		// console.log("资源详情",res);
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

		    handleEdit(index,row){

		    	this.editFolderId = row.id;
		    	this.addFolderEditFlag = true;

		    },
		    emptyAddFolder() {
		    	this.totalElements = 1;
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
					this.emptyFlag = false;
		    },

		    foldCreate(val){
		    	this.getCommonRes();
				//this.addFolderData(val);
			},

		    addFolder(event){

		    	//event.target.disabled = true;
		    	this.addFolderFlag = true;
		    },

		    addFolderDia(){
				this.addFolderDia = true;
			},

		    folderEdit(row) {
		    	console.log("编辑");
		    	let data = {
		    		id: row.id,
		    		name: row.name,
		    		type: 'FOLDER',
		    	}
		    	resource.resUpdate(data, (res => {
		    		// console.log('编辑文件夹', res);
		    		if(res.status == 200) {
		    			this.getCommonRes();
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));

		    }
		},
		components: {
			Empty,

			createFolder,

			editFolder
			
		}
	}
</script>