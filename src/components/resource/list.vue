<template>
	<div id="wResClazz" 
		v-loading="loading"
	    :element-loading-text="$globalParam.loadText"
	    :element-loading-spinner="$globalParam.loadSpinner"
	    :element-loading-background="$globalParam.loadText">

		<div class="tab-link clearfix">
			<router-link :to="{ path: '/resource/list', query: {clazzId: clazzId}}">
				<i class="icon-course-res"></i>
				课件资源
			</router-link>
			<router-link :to="{ path: '/resource/net/online', query: {clazzId: clazzId}}">
				<i class="icon-course-net2"></i>
				网络课程
			</router-link>
		</div>

		<template v-if="emptyFlag">
			<div class="handle">
				<button type="button" class="btn-update1 btn-blue" @click="workrepository" v-show="role !== 'PROFESSOR'" style="right: 125px;">
					
					资源库
				</button>
				<div class="addtory" style="margin-right:0">
					<el-dropdown >
						<el-button type="primary">
							<i class="icon-circle-add"></i>
							新建资源
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="updateShow = true">								
								新建资源
							</el-dropdown-item>
							<el-dropdown-item @click.native="createFolder($event)">								
								新建文件夹
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</div>
			
			<section class="wempty round-layout">
				<div class="rules" v-if="role !== 'PROFESSOR'">
					学习要求：
					
					<template v-if="setRulesFlag">
						<span>资源的学习任务还没有配置规则哦～</span>
						<p class="rules-set" @click="rulesFlag = true">
							<i class="icon-learn-set-ora"></i>
							规则配置
						</p>
					</template>
					<template v-else>
						<span>学习数量：{{rulesData.resourceViewCount}}</span>
						<span>学时：{{rulesData.resourceLearnTime}}</span>
						<span>剩余时间：<time-down 
								:endTime='endTime' ref="time"></time-down>
						</span>

						<p class="rules-edit" @click="rulesFlag = true">
							<i class="icon-edit-ora"></i>
							修改要求
						</p>
					</template>
					
				</div>
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
				<div class="search">
					<input type="text" v-model="search" placeholder="资源文件名称" @keyup.13="getsearch('search')" /><i class="el-icon-search" @click.stop="getsearch('search')"></i>
				</div>
				<div class="addtory">
					<el-dropdown >
						<el-button type="primary">
							<i class="icon-circle-add"></i>
							新建资源
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="updateShow = true">								
								新建资源
							</el-dropdown-item>
							<el-dropdown-item @click.native="createFolder($event)">								
								新建文件夹
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
				<!-- <button type="button" class="btn-update2 btn-blue" @click="updateShow = true">
					<i class="icon-uploading"></i>
					上传资源
				</button> -->
				<button type="button" class="btn-update1 btn-blue" @click="workrepository" v-show="role !== 'PROFESSOR'">					
					资源库
				</button>
				<!-- <button type="button" id="addFolder" class="btn-folder1 btn-green-line"  @click.prevent.stop="createFolder($event)">
					<i class="icon-add"></i>
					新建文件夹
				</button> -->
				<button class="btn-exp btn-green-line" type="button" @click="resExport">
					<i class="icon-export-green"></i>
					导出
				</button>
			</div>
			
			<section id="w-table" class="wres round-layout">
				<div class="rules" v-if="role !== 'PROFESSOR'">
					学习要求：
					
					<template v-if="setRulesFlag">
						<span>资源的学习任务还没有配置规则哦～</span>
						<p class="rules-set" @click="rulesFlag = true">
							<i class="icon-learn-set-ora"></i>
							规则配置
						</p>
					</template>
					<template v-else>
						<span>学习数量：{{rulesData.resourceViewCount}}</span>
						<span>学时：{{rulesData.resourceLearnTime}}</span>
						<span>剩余时间：<time-down 
								:endTime='endTime' ref="time"></time-down>
						</span>

						<p class="rules-edit" @click="rulesFlag = true">
							<i class="icon-edit-ora"></i>
							修改要求
						</p>
					</template>
					
				</div>
				<el-table class=""
					:data = "items"
					:empty-text="loading_font"
					:header-cell-style="{'text-align':'center'}"
					stripe
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
								<i class="icon-yin" v-if="scope.row.referenceResourceId"></i>
								{{scope.row.name}}
							</template>
							
							<template v-if="scope.row.type==='FOLDER'">
								<i class="icon-folder"></i>
								<input type="text" v-if="scope.row.status==='add'" class="folder " id="folderAdd" v-model.trim="scope.row.name"  @blur="folderSave(scope.row)" v-focus>
								
								<input type="text" v-if="scope.row.status==='edit'" class="folder " id="folderEdit" v-model.trim="scope.row.name"  @blur="folderEdit(scope.row)" v-focus/>

								<span v-if="!scope.row.status" id="folderShow" @click="handleView(scope.$index, scope.row)">
									<i class="icon-yin" v-if="scope.row.referenceResourceId"></i>
									{{scope.row.name}}
								</span>
							</template>
						</template>
					</el-table-column>
					<el-table-column
						prop=""
						label="个数/大小"
						align="center"
						width="80">
						<template slot-scope="scope">
							<span v-if="scope.row.type !=='FOLDER'">
								{{(!!scope.row.fileSizeFormat && scope.row.fileSizeFormat != 0) ? scope.row.fileSizeFormat: ''}}
							</span>
							<span v-if="scope.row.type ==='FOLDER'">
								{{scope.row.fileCount}}
							</span>
						</template>
					</el-table-column>
					<el-table-column
						prop=""
						label="类型"
						align="center"
						width="100">
						<template slot-scope="scope">
                            <span v-if="scope.row.type=='FOLDER'">文件夹</span>
                            <span v-if="scope.row.type=='PPT'">ppt</span>
                            <span v-if="scope.row.type=='PDF'">pdf</span>
                            <span v-if="scope.row.type=='WORD'">word</span>
                            <span v-if="scope.row.type=='URL'">链接</span>
                            <span v-if="scope.row.type=='TEXT'">文本</span>
                            <span v-if="scope.row.type=='VIDEO'">视频</span>
							<span v-if="scope.row.type=='ZIP'">压缩包</span>
                        </template>
					</el-table-column>
					<el-table-column
						align="center"
						label="允许下载"
						width="80">
						<template slot-scope="scope">
							<span v-if="scope.row.type=='FOLDER'"></span>
                            <span v-else>
                                <span v-if="scope.row.downloadFlag==true">是</span>
                                <span v-else>否</span>    
                            </span>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						label="查看人数"
						width="100">
						<template slot-scope="scope">
							<span v-if="scope.row.type=='FOLDER'"></span>
							<span v-else>
								<router-link class="link" :to="{ path: '/resource/user', query: {clazzId: clazzId, id:scope.row.id} }">{{scope.row.viewPeopleCount}}</router-link>
							</span>
							
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						prop=""
						label="查看次数"
						width="100">
						<template slot-scope="scope">
							<span v-if="scope.row.type=='FOLDER'"></span>
							<span v-else>{{scope.row.viewCount}}</span>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						prop=""
						label="下载次数"
						width="100">
						<template slot-scope="scope">
							<span v-if="scope.row.type=='FOLDER'"></span>
							<span v-else>{{scope.row.downloadCount}}</span>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						label="转码状态"
						width="100">
						<template slot-scope="scope">
							{{transName[scope.row.transStatus]}}
						</template>
					</el-table-column>
					<el-table-column
					    label="操作"
					    width="200">
					    <template slot-scope="scope" >
					    	<template v-if="scope.row.status !=='add'">
					    		<el-button  type="text" @click.native="handleView(scope.$index, scope.row)" v-show="scope.row.type!='ZIP'">查看</el-button>
					    		<el-button type="text" @click.native="handleEdit(scope.$index, scope.row)" v-show="!scope.row.referenceResourceId && scope.row.editable==true">编辑</el-button>
								<el-button type="text" @click.native="handleDel(scope.$index, scope.row)" v-show="scope.row.editable==true">删除</el-button>
								<el-button type="text" @click.native="transfer(scope.$index, scope.row)" v-show="scope.row.type !=='FOLDER'&&scope.row.editable==true">转移</el-button> 
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
			:clazzId="clazzId"
			:parentId = "pId"
			@updateRes="getClazzList"></update>

		<!-- 编辑资源 文件类型-->
		<edit-file
			:dialogEditFile.sync="editFileShow"
			:clazzId="clazzId"
			:resId = "resId"
			:resType="resType"
			@updateRes="getClazzList"></edit-file>

		<!-- 编辑资源 url类型-->
		<edit-url
			:dialogEditUrl.sync="editUrlShow"
			:clazzId="clazzId"
			:resId = "resId"
			@updateRes="getClazzList"></edit-url>

		<!-- 编辑资源 text类型-->
		<edit-text
			:dialogEditText.sync="editTextShow"
			:clazzId="clazzId"
			:resId = "resId"
			@updateRes="getClazzList"></edit-text>

		<!-- 查看资源 url-->
		<view-url
			:dialogViewUrl.sync="viewUrlShow"
			:resId = "resId"
			></view-url>

		<!-- 查看资源 Text-->
		<view-text
			:dialogViewText.sync="viewTextShow"
			:resId = "resId"></view-text>

		<!-- 查看pdf -->
		<modal :show.sync = "viewPdfShow" contWidth = '80%' bgColor="transparent">
			<div slot="body" class="w-transparent" style="height:100%">
				<iframe v-if="details.type==='WORD' || details.type==='PPT' || details.type==='PDF'" :src="details.linkUrl" id="showIframe" frameborder="0" width="100%" height="100%"></iframe>
				
			</div>
		</modal>

		<!-- 查看视频 -->
		<modal :show.sync = "viewVideoShow" contWidth = '80%' bgColor="transparent" :before-close="videoClose">
			<div slot="body" style="height:100%">
				<video :src="details.linkUrl" controls="controls"  width="100%" height="100%" id="myVideo">
				您的浏览器不支持video标签
				</video>
			</div>
		</modal>
		<!-- 规则设置 -->
	    <rules
	    	:dialogRules.sync="rulesFlag"
	    	:clazzId="clazzId"
	    	:curIndexn = '0'
	    	@updateDate="getRules()"></rules>
		<!-- 转移组件   -->
        <transFer
            :dialogtransfer.sync="transferShow"			
			ref="transfer"
			v-on:refreshbizlines="getClazzList"
        >            
        </transFer>	
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
	// 学情配置
	import learncase from 'model/clazz/learncase'
	import rules from 'components/clazz/learncase/rules'
	import timeDown from 'base/countdown/timeDown'

	import { delTip } from '@/global/open'
	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'
	import { getCurRole  } from '@/filters/userVerify'
	import transFer from 'base/modal/transfer'

	export default {
		data() {
			return {
				items: [],
				details: {},
				updateShow: false,	// 是否上传
				cur_page: 1,
				totalElements: 1,
				tip: '还没有上传资源，点击上传吧 ~',			
				btntext: '上传资源',
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
					'NONE' : ''
				},
				editFileShow: false,
				editUrlShow: false,
				editTextShow: false,
				viewUrlShow: false,
				viewTextShow: false,
				viewPdfShow: false,
				viewVideoShow: false,
				transferShow:false, //转移/添加至文件夹
				name: '',		//创建文件夹名称

				rulesData: {},		// 规则配置
				setRulesFlag: false,	// 是否第一次设置
				rulesFlag: false,	//规则配置弹出框
				endTime: '',		// 截止时间
				emptyFlag: false,	
				loading: true,
				loading_font:this.$globalParam.loadText,
				Clazzfolder:'',//班级下的文件夹资源

				operaTion:true,
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			},
			role() {
 				return getCurRole();
			},
			orgidnumber(){
				return this.$store.getters.getClazzorgid;
			},
					
		},		 
		created() {
			this.getClazzList();
			this.getRules();
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
			//跳转至资源库
			workrepository(){				
				this.$router.push({path:"/resource/questemp/reposilist?clazzId="+this.clazzId+""});				
			},
			//分页
			handleCurrentChange (val) {
				this.cur_page = val;
        		this.getClazzList();
			},
			// 获取规则配置
			getRules() {
				let data = {
					clazzId: this.clazzId
				}
				learncase.clazzLearnRuleGet(data, (res => {
					//console.log("rules" ,res)
					if(res.status == 200) {
						this.rulesData = res.data;

						if(this.rulesData.resourceEndTime) {
							this.endTime = res.data.resourceEndTime;
							this.setRulesFlag = false;
						} else {
							this.setRulesFlag = true;
						}
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			//搜索
			//获取第一页数据列表
			getsearch(type, val) {
				
				let data = {
					clazzId: this.clazzId,
					id: this.pId,
					name: this.search,
					number: val || this.cur_page,
					size: '20'
				}
				if(type == 'search') {
					data.number = 1;
				}
				// console.log("搜索参数",this.search);

				resource.resClazzList(data, (res => {
					//console.log("资源列表",res);
					if(res.status == 200) {
						this.totalElements = res.data.totalElements;
						// console.log("totalElements",this.totalElements);
						this.items = res.data.content;
						this.loading_font=this.$globalParam.dataEmpty;
						
						this.loading = false;
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}

				}));

			},
			//获取第一页数据列表
			getClazzList(type, val) {
				
				let data = {
					clazzId: this.clazzId,
					id: this.pId,
					name: this.search,
					number: val || this.cur_page,
					size: '20'
				}
				if(type == 'search') {
					data.number = 1;
				}
				// console.log("搜索参数",this.search);

				resource.resClazzList(data, (res => {
					//console.log("资源列表",res);
					if(res.status == 200) {
						this.totalElements = res.data.totalElements;
						// console.log("totalElements",this.totalElements);
						this.items = res.data.content;
						this.loading_font=this.$globalParam.dataEmpty;
						if(this.items.length == 0) {
							this.emptyFlag = true;
						} else {
							this.emptyFlag = false;
						}
						
						this.loading = false;
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}

				}));

			},
			//删除
			handleDel(index, row) {
				
				if(row.editable==true ){
					this.resId = row.id;
					let str = '';
					if(row.type == 'FOLDER') {
						str = "删除文件夹会将文件夹里的资源文件全部删除，确认删除吗？";
					}else {
						str="确定要删除该资源吗？"
					}
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
			                	if(_this.items.length == 0) {
			                		let val = _this.cur_page-1;
			                		_this.cur_page = val;
			                		_this.getClazzList('page', val);
			                	} else {
			                		_this.getClazzList();
			                	}
			                	
			              	}
			            });
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
		    			path: '/resource/depth_list',
		    			query: {
		    				clazzId: this.clazzId,
							resId: row.id,
							cite:row.referenceResourceId,
		    			}
		    		});
		    		// this.getClazzList(row.id);
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
			//关闭视频
		    videoClose() {
		    	document.getElementById("myVideo").pause();
		    	this.viewVideoShow = false;
		    	
			},
			// 获取查看的资源
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
			// 编辑
		    handleEdit(index, row) {
				
				if(row.editable==true && !row.referenceResourceId){
					this.resId = row.id;
					this.resType = row.type;
					
					if(row.type === 'FOLDER') {
						
						this.getResource(row.id);
						// console.log("index",this.items[index]);
						this.$set(this.items[index], 'status', 'edit');
						
					}
					if(row.type === 'VIDEO' || row.type === 'WORD' || row.type === 'PPT' || row.type === 'PDF' || row.type === 'ZIP') {
						this.editFileShow = true;
					}

					if(row.type === 'URL') {
						this.editUrlShow = true;
					}

					if(row.type === 'TEXT') {
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
			//导出
		    resExport() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
		    	window.open(API.urls.resExp+"?clazzId="+this.clazzId+"&token="+getToken());
			},
			//添加文件夹
		    emptyAddFolder() {

				this.emptyFlag =false;
				this.totalElements=1;		    	

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
			},
			
		    createFolder(event) {

		    	event.target.disabled = true;
				this.emptyFlag = false;
				console.log(111)
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
		    	
		    	
		    	// console.log("items",this.items);

		    	setTimeout(()=>{
		    		event.target.disabled = false;
		    	},500)
		    		
		    	
		    	
		    },
		    folderSave(row) {
		    	
		    	
		    	let data = {
		    		name: row.name,
		    		type: 'FOLDER',
		    		clazzId: this.clazzId
		    	}
		    	let _this = this;
	    		resource.resSave(data,(res => {
		    		// console.log("文件夹创建成功",res);
		    		// console.log("addsave",new Date().getTime());
		    		if(res.status == 200) {
		    			this.getClazzList();
		    			this.$message.success('创建成功！');
		    		} else {
		    			
		    			this.$message.error(res.message);
		    		}
		    	}));

		    	
		    },
		    folderEdit(row) {

		    	let data = {
		    		id: row.id,
		    		name: row.name,
		    		type: 'FOLDER',
		    		clazzId: this.clazzId
		    	}
		    	resource.resUpdate(data, (res => {
		    		// console.log('编辑文件夹', res);
		    		if(res.status == 200) {
		    			this.getClazzList();
		    		} else {
		    			
		    			this.$message.error(res.message);
		    		}
		    	}));

			},
			//转移
			transfer(index, row){
				// console.log(index,row)
				if(row.editable==true){
					this.transferShow=true;
					this.$refs.transfer.getList(API.urls.resourceMove,row.id,this.clazzId,'zwai');
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
			Empty,
			editFile,
			editUrl,
			editText,
			viewUrl,
			viewText,
			Modal,
			rules,
			timeDown,
			transFer
		}
	}
</script>
<style scoped lang="less">
	@import "../../assets/less/icon.less";
	@import "../../assets/less/btn-search.less";
	@import "../../assets/reset-element-ui/user-table.css";
	#wResClazz {
		#folderShow{
			cursor: pointer;
		}
		.addtory{
			float: right;
			margin-right: -356px;
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
				font-size: 15px;
                i{
                    vertical-align: text-bottom;
                }
            }
        }
		.handle {
			position: relative;
			height: 55px;
			.search {
				margin-right: 313px;
				background-color: #fff;
			}
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
				transition: all 0.1s;
				-moz-transition: all 0.1s;
				-webkit-transition: all 0.1s;
				-o-transition: all 0.1s;
			}
			.btn-green-line:hover{
				background-color: #11ADA6;
				color:#fff;
				transition: all 0.1s;
				-moz-transition: all 0.1s;
				-webkit-transition: all 0.1s;
				-o-transition: all 0.1s;
				i{
					transition: all 0.1s;
				-moz-transition: all 0.1s;
				-webkit-transition: all 0.1s;
				-o-transition: all 0.1s;
					background: url('../../assets/img/common/import.png') center center no-repeat;
					background-size: 100% 100%;
				}
			}
			.btn-update {
				right: 155px;
			}
			.btn-folder {
				right: 0;
			}
			.btn-exp {
				right: 0;
				&::after{
					position: absolute;
					right: -6px;
					top: -10px;
					width: 27px;
					height: 15px;
					content: "";
					background: url("../../assets/img/expert/vipLogo.png") center center no-repeat;
					background-size: 27px 14px;
				}
			}
			.btn-update1 {
				right: 98px;
				line-height: 39px;
				padding: 0 15px;
				font-size: 15px;
				transition: all 0.2s;
				-moz-transition: all 0.2s;
				-webkit-transition: all 0.2s;
				-o-transition: all 0.2s;
			}
			.btn-update1:hover{
				background-color: #368BE2;
				transition: all 0.2s;
				-moz-transition: all 0.2s;
				-webkit-transition: all 0.2s;
				-o-transition: all 0.2s;
			}
			.btn-update2 {
				right: 380px;
			}
			.btn-folder1 {
				right: 100px;
			}
			i {
				vertical-align: middle;
			}
		}
		.rules {
			position: relative;
			margin-bottom: 25px;
			text-align: center;
			font-size: 16px;
			color: #333333;
			letter-spacing: 0;
			span {
				font-size: 16px;
				color: #333333;
				margin-left: 15px;
			}
			.rules-set,
			.rules-edit {
				position: absolute;
				right: 0;
				top: 0px;
				font-size: 16px;
				color: #FD7E23;
				cursor: pointer;
				> i {
					margin-right: 0;
					vertical-align: text-top;
				}
			}
		}
		.wempty {
			padding-top: 30px;
			padding-right: 20px;
			margin-bottom: 20px;
		}
		.wres {
			box-sizing: border-box;
			padding: 30px 20px;
	
			i {
				vertical-align: middle;
				margin-right: 10px;
			}
			.link {
				color: #1077D7;
				text-decoration: underline;
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
		
		.round-layout {
			border-radius: 0 6px 6px 6px;
		}
		
	}
	
	.tab-link {
		position: absolute;
		z-index: 10;
	    margin-top: 15px;
		margin-left: 1px;
		width: 246px;
		height: 41px;
		background-color: #EEF1F6;
		border-radius: 6px 6px 0 0;
		font-size: 16px;
		box-shadow: -2px 0 3px #f0f0f0, 2px 0 3px #f0f0f0, 0 -2px 3px #f0f0f0, 0 2px 3px #fff;

		
		a {
			float: left;
			display: inline-block;
			height: 41px;
			line-height: 40px;
			text-align: center;
			width: 122px;
			color: #8E9BAE;
			background-color: #EEF1F6;
			&:first-child {
				border-radius: 6px 0 0 0;
			}
			&:last-child {
				border-radius: 0 6px 0 0;
			}
			i {
				display: inline-block;
				vertical-align: middle;

			}
			.icon-course-res {
				width: 16px;
				height: 15px;
				background: url("../../assets/img/icon/icon-course-res.png") 0 0 no-repeat;
			}
			.icon-course-net2 {
				width: 19px;
				height: 13px;
				background: url("../../assets/img/icon/icon-course-net2.png") 0 0 no-repeat;
			}

			&.active {
				color: #1077D7;
				background-color: #fff;
			}
		}
		
	}
	.handle {
		margin-bottom: 0;
	}
	
</style>
