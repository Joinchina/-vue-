<template>
	<div class="j-net">

		<!--搜索-->
		<header class="title">
			<div class="right">

				<el-dropdown
					:hide-on-click="false"  
					@command="handleCommand"
					ref="messageDrop" 
					trigger="click">

					 <a href="javascript:;" class="btn-green-line">
					 	<i class="icon-net-shop-cur"></i> 已选课程({{unPublishCourse.length}})
					 </a>

					 <el-dropdown-menu
					 	slot="dropdown"
					 	>

					 	<section v-if="unPublishCourse.length > 0">
					 		<ul class="j-item-drop">
							    <el-dropdown-item
							    	v-for = "(item,index) in unPublishCourse"
							    	:key="index"
							    	class="clearfix"
							    	command="a">
								    	<div class="j-del">
										    <i class="icon-net-del" @click="delRquireCourse(item.id,index)"></i>
										</div>
									    <div class="j-name">{{item.name}}</div>
							    	
							    </el-dropdown-item>
							</ul>

						    <!--关闭-->
						    <div class="lay-footer">
						    	<input type="button" value="关闭" class="btn-close" @click="closeLay">
						    	<input type="button" value="选好了" class="btn-green ml10" @click = "chooseOver">
						    </div>
					    </section>

					    <!--暂无已选课程-->
					    <section v-else>

					    	<empty tip = "暂无已选课程" btntext = "关闭" @add = "closeLay"></empty>

					    </section>
					    
  					</el-dropdown-menu>

				</el-dropdown>

			</div>

			<span class="ml18">学段学科</span>  
			<el-cascader
				@change="handleChange"
			    expand-trigger="hover"
			    :options="options"
				v-model="defaultSelected"
			   >
  			</el-cascader>

    		<el-input 
	    		v-model.trim="inputVal" 
	    		class="searchVal ml18" 
	    		placeholder="课程编码">
    		</el-input>

			<el-input 
	    		v-model.trim="courseName" 
	    		class="searchVal ml18" 
	    		placeholder="课程名称">
    		</el-input>

    		<button @click="onSearch('search')" class="ml32 btn-blue">查询</button>
    		 


		</header>

		<!--table列表-->
		<div 
			v-loading="loading"
		    :element-loading-text="$globalParam.loadText"
		    :element-loading-spinner="$globalParam.loadSpinner"
		    :element-loading-background="$globalParam.loadText"
			class="round-layout">
			<el-table
				:data = "tableData"
				:empty-text="emptyData"
				stripe>
				<el-table-column
					prop="number"
					label="序号"
					width="90">
					<template slot-scope = "scope">
					    {{(cur_page-1)*size+scope.$index+1}}
					</template>
				</el-table-column>
				<el-table-column
					prop="code"
					label="课程编码"
					width="160">
				</el-table-column>
				<el-table-column
					label="课程名称"
					
					width="350">
					<template slot-scope="scope">
						<router-link :to="{path:'/resourse/previewCourse',query:{clazzId:clazzId,courseId:scope.row.id}}" class="cursorName" target="_blank">{{scope.row.name}}</router-link>
					</template>
				</el-table-column>
				<el-table-column
					prop="recommendLearnTime"
					label="建议学时"
					width="150">
				</el-table-column>
				<el-table-column
					prop="sectionCount"
					label="微课数量"
					width="110">
				</el-table-column>
				<el-table-column
					prop="teacher"
					label="课程讲师"
					width="150">
				</el-table-column>
				<el-table-column
					prop="operator"
					label="操作">
					<template slot-scope="scope">
						<span v-if="scope.row.selectedInRequired == false">
							<a href="javascript:;" class="blue" @click="getOnlineInfo(scope.row.id)">选择</a>
						</span>
						<span v-else class="gray">
							已选
						</span>
					</template>
				</el-table-column>
			</el-table>

	        <p class="page-sum">共{{totalElements}}条&nbsp;每页20条</p>

	        <!--分页-->
	        <div class="pagination">
	          <el-pagination
	            @current-change ="handleCurrentChange"
	            layout="prev, pager, next"
	            :page-size="size"
	            :total="totalElements">
	          </el-pagination>
	        </div>


    	</div>
		<!-- 必修课剩余不足 -->
		<overLimitPop 
			:overLimitDialog.sync = "overLimit" 
			:text = "'您所属机构的网络课程添加数量已达上限，无法继续添加'" 
			:footerText = "'添加更多课程'" 
			:param="'onlineCompulsory'"></overLimitPop>
	</div>
</template>

<script>
	import {tableNumber} from '@/global/open';
	import Empty from '@/base/empty/empty-lay';
	import Model from '@/model/resource/net';
	import overLimitPop from "@/base/overLimitPop/index"
	export default{
		data(){
			return{
				clazzId:"",
				section:"",
				subject:"",
				inputVal:"",
				courseName:"",
				tableData:[],
				tableDataIndex:[],
				defaultSelected:[],
				unPublishCourse:[],
				unPublishLength:0,

				totalElements:0,
				cur_page:1,
				size:20,

				options:[],
				subjectVal:[],
				loading:false,

				emptyData:"请在上方输入筛选条件进行查询课程",

				vipInfo:{},

				overLimit : false,



			}
		},

		created(){

			this.clazzId = this.$route.query.clazzId;
			//获取学段学科数据
			this.onlineStageAndSubject();

			//已选课程
			this.unPublishOnlineCourseList();


		},

		methods:{

			chooseOver(){
				//console.log("选好了");
				this.$router.push({
					path:"/resource/net/online",
					query:{
						clazzId:this.clazzId
					}
				})
			},
			unPublishOnlineCourseList(){
				let data = {
					clazzId:this.clazzId
				}
				Model.onlineunPublish(data,(res)=>{
					if(res.status == 200){
						//console.log("成功");
						this.unPublishCourse = res.data;


					}else{
						this.$message.error(res.message);
					}
				})
			},

			delRquireCourse(couserId,index){

				//console.log("移除");
				//移除必修课程
				let data = {
					clazzId:this.clazzId,
					onlineCourseId:couserId
				}
				Model.postOnlineRemove(data,(res)=>{
					if(res.status == 200){

						//删除当前行
						this.unPublishCourse.splice(index,1);

						//当前为空不执行
						if(this.inputVal == ""&& this.subjectVal.length == 0&&this.courseName){
      						return;
      					}

						//必修课程列表更新
						this.onSearch();


					}else{
						this.$message.error(res.message);
					}
				})
			},

			chooseCourse(courseId){
				let data = {
					clazzId:this.clazzId,
					onlineCourseId:courseId,
					errCallBack :this.netFailHandler
				}
				Model.addRequiredCourse(data,(res)=>{
					if(res.status == 200){
						
						//选择后置灰
						this.tableData.forEach((item,index) =>{
							if(item.id == courseId){
								item.selectedInRequired = true;
							}
						})



						//已选课程更新
						this.unPublishOnlineCourseList();


					}else{
						if(res.status == 423){
							this.overLimit = true;
						}else{
							this.$message.error(res.message);
						};
					}
				})

				




			},

			handleChange(value){
				this.subjectVal = value;
			},


			handleCommand(){
				//console.log("已选课程");
			},

			netFailHandler(error){
				if(error.status == 423){
					this.overLimit = true;
				}
			},

			onlineStageAndSubject(){

				let data = this.clazzId;
				Model.onlineStageAndSubject(data,(res)=>{
					if(res.status == 200){

						let dataArray = res.data;

						//转换数据
						this.transform(dataArray);
						this.defaultSelected.push(dataArray[0].schoolStageCode,dataArray[0].subjectList[0].subjectCode);
						this.subjectVal=this.defaultSelected;
						this.onSearch();
						this.vipInfo = this.$store.getters.getOrgVipInfo;
					}else{
						this.$message.error(res.message);
					}
				})
			},

			transform(data){

				let choose = {
					value:"全部",
					label:"全部"
				}
				data.forEach((item,index) =>{
					let obj = {};
					let childrens = [];

					item.subjectList.forEach((sub,sq)=>{
						let subject = {};
						subject["value"] = sub.subjectCode;
						subject["label"] = sub.subjectName;
						childrens.push(subject);
					})
					obj["value"] = item.schoolStageCode;
					obj["label"] = item.schoolStageName;
					obj["children"] = childrens;
					
					this.options.push(obj);


				})
				this.options.unshift(choose);
				console.log(this.options);

			},

			handleCurrentChange(val){
		        this.cur_page = val;
		        this.onSearch();
      		},

      		onSearch(type){
      			if(this.inputVal == ""&& this.subjectVal.length == 0&&this.courseName == ""){
      				this.emptyData = "请输入筛选条件";
      				this.$message.error('请输入筛选条件');
      				return;
      			}

      			this.loading = true;
      			
      			if(this.subjectVal[0] == "全部"){
      				this.subjectVal[0] = "";
				  }
				console.log(this.subjectVal)
      			let data = {
      				clazzId:this.clazzId,
      				courseCode:this.inputVal,
      				// number:this.cur_page,
      				size:this.size,
      				schoolStageCode:this.subjectVal[0],
					subjectCode:this.subjectVal[1],
					courseName: this.courseName
      			}

      			if(type == "search"){

      				this.cur_page = 1;
      				data["number"] = this.cur_page;

      			}else{
      				data["number"] = this.cur_page;
      			}

      			Model.searchRequiredCourse(data,(res)=>{
      				if(res.status == 200){

      					this.loading = false;

      					this.tableData = res.data.content;

      					this.totalElements = res.data.totalElements;

      					if(res.data.content.length == 0){
      						this.emptyData = "暂无数据";
      					}

      				}else{

      					this.loading = false;

      					this.$message.error(res.message)
      				}
      			})


			  },
			getOnlineInfo(id) {
				let data = {
					clazzId: this.clazzId
				}

				Model.getOnlineRequireInfo(data, (res => {
					// console.log("已选课程相关信息", res);
					console.log(this.vipInfo.onlineCourseCount);
					if(res.status == 200) {
						if(!(this.vipInfo.onlineCourseCount>res.data.courseCount)||this.vipInfo.onlineCourseCount == 0){
							this.overLimit = true;
							return
						}else{
							this.chooseCourse(id);
						}
						
					} else {
						this.$message.error(res.message);
					}
				}));
			},
      		closeLay(val){
      			this.$refs.messageDrop.hide();
      		}
		},

		components:{
			Empty,
			overLimitPop,
		}


	}
</script>

<style lang="less" scoped>
	@import "../../../assets/reset-element-ui/form-reset.css";
	@import "../../../assets/reset-element-ui/user-table.css";
	@import "../../../assets/less/icon.less";
	.j-name{
		width: 295px;
		float: left;
	}
	.j-del{
		width: 40px;
		text-align: center;
		float: right;
	}
	.j-net{
		.title{
			padding: 20px 0;
			font-size: 16px;
			color: #333;
		}
		.searchVal{
			width: 20%;
		}
		.btn-blue {
			display: inline-block;
			font-size: 16px;
			padding: 10px 15px;
			border-radius: 5px;
		}
		.icon-net-shop-cur{
			vertical-align: middle;
		}
		.btn-green-line{
			padding: 8px 20px;
			font-size: 16px;
		}
		.round-layout{
			padding:30px 18px
		}
		.section{
			width:10%; 
		}

		.empty-course{
			padding:10% 0;
			text-align: center;
		}
		.page-sum {
			font-size: 14px;
			color: #666;
			text-align: right;
			padding-top: 15px;
		}


	}

	.j-item-drop{
		max-height: 400px;
		overflow-y:auto;
	}

	.btn-green{
		display: inline-block;
		border-radius: 4px;
		padding:11px 12px;
		font-size: 16px;
	}
	.lay-footer{
		padding:20px 0;
		text-align: center;	
	}

	.el-dropdown-menu li{
		color: #333;
		border-bottom: 1px dashed #cbc9c9!important;
		font-size: 16px;
		padding: 10px 20px!important;
		vertical-align:middle;
		line-height: 24px;
		
	}
	.el-dropdown-menu li:hover{

		background: none!important;
		color:#333!important;
		.icon-net-del{
			display: inline-block;
		    width: 14px;
		    height: 14px;
		    background: url("../../../assets/img/icon/icon-net-del-cur.png") center center no-repeat;
		    background-size: 100% 100%;
		}
	}
	.el-dropdown-menu li:last-child{
		border-bottom: none!important;
	}
	.el-dropdown-menu{
		width: 397px!important;
	}
	.el-table{
		.el-table-column{
		.cursorName{
			cursor: pointer;
			color: #1077D7;
		}
	}
	}
	
	

</style>
