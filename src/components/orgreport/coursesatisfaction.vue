<template>
	<div class="w-coursesat">

		<section class="handle clearfix">
			
			<span>
				<Goback passtitle="课程满意度" ></Goback>
				<span class="tip2">（注：数据统计截止到昨日）</span>
			</span>
			<div class="right">
				<el-select v-model="searchType" placeholder="请选择">
				    <el-option
				      	v-for="item in options"
				      	:key="item.value"
				      	:label="item.label"
				      	:value="item.value">
				    </el-option>
				</el-select>
				<div class="search">
					<input type="text" placeholder="请输入内容"  v-model="keyword" @keyup.13="searchData"/><i class="el-icon-search" @click.stop="searchData"></i>
				</div>
				<button class="btn-green" type="button"  @click="resExport">
					<i class="icon-export-white"></i>
					导出
				</button>
			</div>
		</section>
		
		<template v-if="emptyFlag">
			<empty
				class="round-layout"
				:tip="tip"></empty>
		</template>

		<template v-if="!emptyFlag">
			<section class="wcont round-layout" id="w-table"
				v-loading="loading"
			    :element-loading-text="$globalParam.loadText"
			    :element-loading-spinner="$globalParam.loadSpinner"
			    :element-loading-background="$globalParam.loadText">
				<div class="wtable-wrapper clearfix" >
					<table cellspacing="0" cellpadding="0" border="0" style="table-layout:fixed;" class="table-left wtable">
						<thead>
							<tr>
								<th width="119">课程名称</th>
								<th width="100">专家姓名</th>
								<th width="120">所属班级</th>
								<th width="100">课程日期</th>
								<th width="100">课程时间</th>
								<th width="65" class="clearfix">
									培训<br/>人数
									<div class="oper">
										<i @click="screening('studentCount','asc')" class="el-icon-caret-top" ></i>
										<i @click="screening('studentCount','desc')" class="el-icon-caret-bottom"></i>
									</div>
									
								</th>
								<th width="80" class="clearfix">
									参与评<br/>价人数
									<div class="oper">
										<i @click="screening('submitNum','asc')" class="el-icon-caret-top"></i>
										<i @click="screening('submitNum','desc')" class="el-icon-caret-bottom"></i>
									</div>
									
								</th>
								<th width="80" class="clearfix">
									课程<br/>满意度
									<div class="oper">
										<i @click="screening('satisfiedRate','asc')" class="el-icon-caret-top"></i>
										<i @click="screening('satisfiedRate','desc')" class="el-icon-caret-bottom"></i>
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item,index) in items">
								<td width="119">
									<el-tooltip class="item" effect="dark" :content="item.courseName" placement="bottom-start">
									<div class="cell0">{{item.courseName}}</div>
									</el-tooltip>
								</td>
								<td width="100">
									<el-tooltip class="item" effect="dark" :content="item.professorName" placement="bottom-start">
										<div class="cell0" >{{item.professorName}}</div>
									</el-tooltip>
								</td>
								<td width="120">
									<el-tooltip class="item" effect="dark" :content="item.clazzName" placement="bottom-start">
									<div class="cell0 blue" @click="goClazz(item.clazzId)">{{item.clazzName}}</div>
									</el-tooltip>
								</td>
								<td width="100">{{item.cousreDate}}</td>
								<td width="100">{{item.courseTime}}</td>
								<td width="65">{{item.studentCount}}</td>
								<td width="80">{{item.submitNum}}</td>
								<td width="80">{{item.satisfiedRate | toDecimal}}%</td>
							</tr>
						</tbody>
					</table>
					<div class="table-right">
						<table cellspacing="0" cellpadding="0" border="0" class="wtable" style="width:100%;">
							<thead>
								<tr >
									<th v-for="i in titles"><div class="cell">题干{{i}}</div></th>
								</tr>
							</thead>
							<tbody>
								<template  v-for="(item,index) in items">
									<tr>
										<td v-for="it in item.quesions" v-if="item.quesions">	 
											<div class="cell" v-if="it.type == 'SELECT'">{{it.percent | toDecimal}}%</div>
											<div class="cell" v-else>无法计算</div>
										</td>
										<td v-for="n in (titles-item.quesions.length)">
											<div class="cell">无题目设置</div>
										</td>
									</tr>
								</template>
								
							</tbody>
						</table>
					</div>
					
				</div>
				<p class="page-sum">共{{totalElements}}条 每页10条</p>
				<!-- 分页 -->
				<div class="pagination">
			      	<el-pagination
			        	@current-change ="handleCurrentChange"
			        	:current-page="cur_page"
			        	layout="prev, pager, next"
			        	:page-size ="10"
			        	:total="totalElements">
			      	</el-pagination>
			    </div>
			</section>
		</template>

	</div>
</template>
<script>
	import orgReport from 'model/orgreport/orgreport'

	import { getCurRole } from '@/filters/userVerify'
	import API from '@/global/resource';
	import { getToken } from '@/filters/userVerify'

	import Empty from 'base/empty/empty'

	import Goback from 'base/goback/goback'

	export default {
		data() {
			return {
				role: getCurRole(),
				items: [],
				content: [],	// 外层数组
				titles: 0,		// 题目题干
				cur_page: 1,	
		        totalElements: 0,
		        options: [{
		          	value: 'course',
		          	label: '课程名称'
		        }, {
		          	value: 'professor',
		          	label: '专家姓名'
		        }],
		        searchType: 'course',
		        keywordType: '',		//搜索，筛选类型
		        sortType: 'desc',
		        keyword: "",

		        tip: "无相匹配的数据！",
		        emptyFlag: false,
		        loading: true,
				loading_font:this.$globalParam.loadText,
			}
		},
		computed: {
			orgId() {
				return this.$route.query.orgId;
			}
		},
		filters: {
			toDecimal(value) {
				let f = parseFloat(value);
				if(isNaN(f)) {
					return;
				}
				f = Math.round(value*10000)/100;
				return f;
			}
		},
		mounted() {
			console.log("总结报告 role ",this.role );
			if(this.role == 'PROJECTADMIN') {
				this.getItemData();
			} else {
				this.getOrgData();
			}
		},
		methods: {
			handleCurrentChange (val) {
				this.cur_page = val;
        		if(this.role == 'PROJECTADMIN') {
					this.getItemData();
				} else {
					this.getOrgData();
				}
        		console.log("number", this.cur_page);
			},
			searchData() {
				this.cur_page = 1;
				this.keywordType = this.searchType;
				this.sortType = "";
				if(this.role == 'PROJECTADMIN') {
					this.getItemData();
				} else {
					this.getOrgData();
				}
			},
			screening(keyType,sortType) {
				this.keywordType = keyType;
				this.sortType = sortType;
				this.keyword = "";
				if(this.role == 'PROJECTADMIN') {
					this.getItemData();
				} else {
					this.getOrgData();
				}
			},
			// 机构-课程满意度
			getOrgData(keyType) {
				let data = {
					keyword: this.keyword,
					keywordType: this.keywordType,
					number: this.cur_page,
					orgId: this.orgId,
					size: 10,
					sortType: this.sortType
				}

				orgReport.RepOrgCourseSat(data, (res => {
					console.log('机构-课程满意度', res);
					if(res.status == 200) {
						this.totalElements = res.data.totalElements;
						this.loading_font=this.$globalParam.dataEmpty;
						this.loading = false;

						this.content = res.data.content;
						// 空页面
						if(this.content.length == 0) {
							this.emptyFlag = true;
						} else {
							this.emptyFlag = false;
						}

						// 培训人数等对象
						this.content.forEach((val, ind, arr) => {
							if(val.questionPaperSatisfaction == null) {
								this.$set(val, "satisfiedRate", 0);
								this.$set(this.content[ind], "studentCount", 0);
								this.$set(this.content[ind], "submitNum", 0);
								this.$set(val, 'quesions', [{percent: 0, type: "SELECT"}]);
								this.$set(val, 'len', 1);		// 题目长度
							} else {
								this.$set(val, "satisfiedRate", val.questionPaperSatisfaction.satisfiedRate);

								this.$set(this.content[ind], "studentCount", val.questionPaperSatisfaction.studentCount);

								this.$set(this.content[ind], "submitNum", val.questionPaperSatisfaction.submitNum);

								this.$set(val, 'quesions', val.questionPaperSatisfaction.questions);

								// 最长的题目长度
								
								let len = val.questionPaperSatisfaction.questions.length;
								this.$set(val, 'len', len);		// 题目长度
							}

						});

						this.items = this.content;
						console.log("课程满意度 content *** ", this.items)

						this.titles = this.getMaxlen(this.items);
						console.log("maxlen", this.titles);
						
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
				}));
			},

			// 项目-课程满意度
			getItemData() {
				let data = {
					keyword: this.keyword,
					keywordType: this.keywordType,
					number: this.cur_page,
					orgId: this.orgId,
					size: 10,
					sortType: this.sortType
				}

				orgReport.RepItemCourseSat(data, (res => {
					console.log('项目-课程满意度', res);
					if(res.status == 200) {
						this.totalElements = res.data.totalElements;
						this.loading_font=this.$globalParam.dataEmpty;
						this.loading = false;

						this.content = res.data.content;
						// 空页面
						if(this.content.length == 0) {
							this.emptyFlag = true;
						} else {
							this.emptyFlag = false;
						}

						// 培训人数等对象
						this.content.forEach((val, ind, arr) => {
							if(val.questionPaperSatisfaction == null) {
								this.$set(val, "satisfiedRate", 0);
								this.$set(this.content[ind], "studentCount", 0);
								this.$set(this.content[ind], "submitNum", 0);
								this.$set(val, 'quesions', [{percent: 0, type: "SELECT"}]);
								this.$set(val, 'len', 1);		// 题目长度
							} else {
								this.$set(val, "satisfiedRate", val.questionPaperSatisfaction.satisfiedRate);

								this.$set(this.content[ind], "studentCount", val.questionPaperSatisfaction.studentCount);

								this.$set(this.content[ind], "submitNum", val.questionPaperSatisfaction.submitNum);

								this.$set(val, 'quesions', val.questionPaperSatisfaction.questions);

								// 最长的题目长度
								
								let len = val.questionPaperSatisfaction.questions.length;
								this.$set(val, 'len', len);		// 题目长度
							}
						});

						this.items = this.content;
						console.log("课程满意度 content *** ", this.items)

						this.titles = this.getMaxlen(this.items);
						console.log("maxlen", this.titles);
						
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
				}));
			},
			goClazz(clazzId) {
				 window.open("#/clazz/index?clazzId="+clazzId)
			},
			resExport() {
				if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
				if(this.role == 'PROJECTADMIN') {
					window.open(API.urls.RepItemExpCourseSat+"?orgId="+this.orgId+"&token="+getToken());
				} else {
					window.open(API.urls.RepOrgExpCourseSat+"?orgId="+this.orgId+"&token="+getToken());
				}
				
			},

			getMaxlen(arrayobj) {
				let max = 0, maxlen;
				arrayobj.forEach((val, index) => {
					if(arrayobj[max].len <= arrayobj[index].len) {
						max = index;
						maxlen = arrayobj[index].len;
					}
				})

				return maxlen;
			}
		},

		components: {
			Empty,
			Goback
		}

	}
</script>
<style scoped lang="less">
	@import "../../assets/less/icon.less";
	@import "../../assets/less/btn-search.less";
	@import "../../assets/reset-element-ui/user-table.css";

	.search {
		background: #fff;
		float: none;
		display: inline-block;
		margin-right: 15px;
	}
	.el-select {
		width: 120px;
		margin-right: 5px;
	}

	.wtable-wrapper {
		width: 100%;

		.table-left {
			box-sizing: border-box;
			width: 765px;
			float: left;
			overflow: hidden;
		}
		.table-right {
			box-sizing: border-box;
			float: left;
			width: 342px;
			overflow: auto;
			> table {
				width: auto;
			}
		}
		.wtable {
			box-sizing: border-box;
			border: 1px solid #dfe6ec;
   			color:#1f2d3d;
   			th {
   				position: relative;
   				z-index: 1;
   				box-sizing: border-box;
   				height: 46px;
				background: #eef1f6;
				color:#1f2d3d;
				border-bottom:1px solid #dfe6ec;
				padding:0 10px;
				font-size: 14px;
				text-align: left;
				.oper {
					box-sizing: border-box;
					width: 17px;
					height: 32px;
					text-align: right;
					font-size: 13px;
					color: #666;
					float: right;
					position: absolute;
				    right: 10px;
				    top: 7px;
				    z-index: 2;
				}
				.el-icon-caret-top {
					cursor: pointer;
				}
				.el-icon-caret-bottom {
					cursor: pointer;
				}
				
   			}
   			td {
   				box-sizing: border-box;
   				height: 52px;
  				border-bottom:1px solid #dfe6ec;
  				padding:0 10px;
  				font-size: 14px;

  				
   			}
   			.cell0 {
   				width: 100%;
				white-space: nowrap; 
			  	overflow: hidden;
			  	text-overflow:ellipsis;
			  	cursor: pointer;
   			}
   			.cell {
   				display: block;
   				width: 80px;
   				text-align: center;
   			}

		}
		
	}
</style>