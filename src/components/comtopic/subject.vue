<style scoped lang="less">
	@import "../../assets/less/activity.less";
	@import "../../assets/less/icon.less";
	.tab-link{
		float: left;
		overflow: hidden;
		.tab_box{
			overflow: hidden;
			float: left;
			.tab_btn_1,.tab_btn_2{
				float: left;
				width: 120px;
				height: 40px;
				background: #EEF1F6;
				font-size: 18px;
				color: #8E9BAE;				
			}
			.tab_btn_1{
				img{
					width: 17px;
					float: left;
					margin: 15px 4px 0 14px;
				}
				span{
					float: left;
					line-height: 40px;
				}
			}
			.tab_btn_2{
				img{
					width: 17px;
					float: left;
					margin: 12px 4px 0 23px;
				}
				span{
					float: left;
					line-height: 40px;
				}
			}
			.add-clazz{
				width: 120px;
				height: 40px ;
				position: absolute;
				top:-10px;
				right: 0;
				border-radius: 5px!important;
				background: #35a69d;
				color: #fff;
				line-height: 40px;
				i{
					float: left;
					margin: 12px 6px 0 16px;
				}
				span{
					float: left;
				}
			}			
		}
	}
	.btn-green-line{
		width:auto;
		padding-left: 15px;
		padding-right: 18px;

	}
	.x-view{
		width: 100%!important;
		margin-top: 40px;
		min-height: 200px;
		i{
			margin-right: 0;
			vertical-align: middle;
		}
		.x-ques{
			padding: 40px 20px;
			dl{
				padding:0;
			}
			// 新增模板样式
			ul{
				width: 100%;
				overflow: hidden;
				li{
					width: 225px;
					height: 92px;
					background: #FFFFFF;
					box-shadow: 0 2px 17px 0 rgba(0,0,0,0.06);
					border-radius: 10px;
					margin-right: 20px;
					margin-bottom: 10px;
					margin-top: 10px;
					float: left;
					cursor: pointer;
					.notemplete{
						width: 100%;
						height: 100%;
						overflow: hidden;
						border: 1px dashed  #CDCDD3;
						border-radius: 4px;
						i{
							width: 30px;
							height: 30px;
							background: url('../../assets/img/help/add.png') no-repeat center center;
							background-size: contain;
							margin: 0 auto;
							margin-top: 18px;
							display: block;
						}
						span{
							text-align: center;
							font-size: 16px;
							color: #2F4163;
							width: 100%;
							line-height: 40px;
    						display: block;
						}
					}
					.templete{
						width: 100%;
						height: 100%;
						overflow: hidden;
						border-radius: 4px;
						transition: all 0.2s;
						border: 1px solid #ffffff;
						img{
							height: 38px;
							float: left;
							margin-top: 27px;
							margin-left: 30px;
							float: left;
						}
						h1{
							font-size: 18px;
							color: #2F4163;
							line-height: 92px;
							margin-left: 25px;
							float: left;
							width: 120px;
							overflow:hidden;
							text-overflow:ellipsis;
							white-space:nowrap
						}
					}
					.templete:hover{
						transition: all 0.2s;
						border: 1px solid #0079FF
					}
				}
			}
			.templatedetail{
				width: 100%;
				overflow: hidden;
				.title{
					width: 100%;
					overflow: hidden;
					border-bottom:1px solid #dddddd;
					.back{
						margin: 20px 40px 10px 0;
					} 
				}
				.questionbox{
					overflow: hidden;
					margin-top: 20px;
				}
			}
		}
	}

	.tit_rg{
		float: right;
		margin: 20px 40px 10px 0;
	}
	.w-list{
		padding: 0!important;
		background-color:#f7f7f7!important; 
		box-shadow:none!important; 
	}
	.btn-blue{
		display: inline-block;
		padding-left: 10px;
		padding-right: 15px;
		border-radius: 5px!important;
		background: #35a69d;
		color: #fff!important;
		font-size: 16px;
	}
	
	.del{
		background: url("../../assets/img/template/del.png") no-repeat!important;
		width: 15px;
		height: 15px;
		display: inline-block;
		vertical-align: middle;
		transition: all .2s;
	}
	.del:hover{
		background: url("../../assets/img/template/del-hover.png") no-repeat!important;
		width: 15px;
		height: 15px;
		display: inline-block;
		vertical-align: middle;
	}
	.back{
		display: inline-block;
		// width: 300px;
		height: 40px;
		.icon-goback {
			display: inline-block;
			width: 18px;
			height: 18px;
			background: url("../../assets/img/icon/icon-goback.png") 0 0 no-repeat;
			background-size: 100% 100%;
			vertical-align: middle;
			margin-right: 3px;
		}
		a{
			font-size: 14px;
			color: #666666;
			line-height: 40px;
		}
	}
</style>
<template>
	<div>
		<div class="tab-link">
			<div class="tab_box">
				<button  class="tab_btn_1" @click="tab_switch('general')">
					<img src="../../assets/img/icon/tong1.png" alt="" v-if="general">
					<img src="../../assets/img/icon/tong2.png" alt="" v-else>
					<span>通用题目</span>
				</button>
				<button class="tab_btn_2" @click="tab_switch('template')">
					<img src="../../assets/img/icon/tong4.png" alt="" v-if="template">
					<img src="../../assets/img/icon/tong3.png" alt="" v-else>
					<span>模板库</span>
				</button>
			</div>
		</div>
		<main class="x-view" id="quesView" v-loading="loadingD"
      :element-loading-text="$globalParam.loadText"
      :element-loading-spinner="$globalParam.loadSpinner"
      :element-loading-background="$globalParam.loadText">
			<div class="tit_rg" v-if="general==true">
				<el-button class="btn-green-line" @click="addTopics">
					<i class="icon-tem-add"></i>
					增加题目
				</el-button>
				<el-button class="btn-blue" @click="saveQuestions">
					<i class="icon-tem-save"></i>
					保存
				</el-button>
			</div>

			<!--空页面-->
		    <empty v-if="quesionArray.length == 0  && general==true" v-show= "showFlag"></empty>
			<!--具体题目-->
			<section class="x-ques" v-if="quesionArray.length > 0 && general==true">
				<template v-for="(item,index) in quesionArray">
					<dl v-if="item.type=='SELECT'">
						<dt>
							<h2>
								<span class="q" >Q{{index+1}}.</span>
								{{item.question}}

								<span class="type">
									（单选题）({{item.required?'必答':'选答'}})
								</span>

								<span class="del" @click="delQuestion(index)"></span>
							</h2>
						</dt>
						<dd v-for="(sel,index) in item.selections">
							<!-- <i class="icon-radio"></i> -->
							<label for="" >{{selList[index]}} {{sel}}</label>
						</dd>
							
					</dl>
					<dl v-else-if="item.type=='MUILTSELECT'">
						<dt>
							<h2>
								<span class="q" >Q{{index+1}}.</span>{{item.question}}
								<span class="type">
								（多选题）（{{item.required ? '必答' : '选答'}}）
								</span>
								<span class="del" @click="delQuestion(index)"></span>
							</h2>
						</dt>
						<dd v-for="(sel, index) in item.selections">
							<!-- <i class="icon-checkbox"></i> -->
							<label for="" >{{selList[index]}}  {{sel}}</label>
						</dd>
					</dl>
					<dl v-else-if="item.type == 'SUBJECTIVE'">
						<dt>
							<h2>
								<span class="q" >Q{{index+1}}.</span>{{item.question}}
								<span class="type">
								（问答题）（{{item.required ? '必答' : '选答'}}）
								</span>
								<span class="del" @click="delQuestion(index)"></span>
							</h2>
						</dt>
						<dd>
							<textarea readonly="readonly" class="text" name="" id="" ></textarea>
						</dd>
						
					</dl>
				</template>
			</section>
			<!-- 模板库 -->
			<section class="x-ques" style="padding:20px 0 20px 20px" v-show="templatenav && general==false">
				<!-- 模板按钮 -->
				<template>
					<ul>
						<li v-for="(item,index) in templateArr" :key="index">
							<div class="notemplete" v-if="item.not==false" @click="addtemplate(item.courseSubjectType)">
								<i></i>
								<span>添加{{item.title}}</span>
							</div>
							<div class="templete" v-else @click="gettemplatedetail(item.id)">
								<img :src="item.img" alt="">
								<h1>{{item.title}}</h1>
							</div>
						</li>
					</ul>
				</template>				
			</section>
			<section class="x-ques" v-show="detailshow" style="padding:20px 0 20px 20px">				
				<!-- 模板详情 -->
				<template>
					<div class="templatedetail">
						<div class="title">
							<div class="back" @click="goback">
								<a href="javascript:;" >
									<i class="icon-goback"></i>
									当前： {{passtitle}}
								</a>								
							</div>
							<div class="tit_rg">
								<el-button class="btn-green-line" @click="updatatemplate">
									<i class="icon-tem-add"></i>
									修改模板
								</el-button>
								<el-button class="btn-blue" @click="experttemplate">
									<i class="icon-btn-expert"></i>
									导出
								</el-button>
							</div>
						</div>
						<div class="questionbox">
							<template v-for="(item,index) in templateqArr">
								<dl v-if="item.type=='SELECT'">
									<dt>
										<h2>
											<span class="q" >Q{{index+1}}.</span>
											{{item.question}}

											<span class="type">
												（单选题）({{item.required?'必答':'选答'}})
											</span>										
										</h2>
									</dt>
									<dd v-for="(sel,index) in item.selections">
										<!-- <i class="icon-radio"></i> -->
										<label for="" >{{selList[index]}} {{sel}}</label>
									</dd>
										
								</dl>
								<dl v-else-if="item.type=='MUILTSELECT'">
									<dt>
										<h2>
											<span class="q" >Q{{index+1}}.</span>{{item.question}}
											<span class="type">
											（多选题）（{{item.required ? '必答' : '选答'}}）
											</span>											
										</h2>
									</dt>
									<dd v-for="(sel, index) in item.selections">
										<!-- <i class="icon-checkbox"></i> -->
										<label for="" >{{selList[index]}}  {{sel}}</label>
									</dd>
								</dl>
								<dl v-else-if="item.type == 'SUBJECTIVE'">
									<dt>
										<h2>
											<span class="q" >Q{{index+1}}.</span>{{item.question}}
											<span class="type">
											（问答题）（{{item.required ? '必答' : '选答'}}）
											</span>											
										</h2>
									</dt>
									<dd>
										<textarea readonly="readonly" class="text" name="" id="" ></textarea>
									</dd>
									
								</dl>
							</template>
						</div>
					</div>
				</template>
			</section>
		</main>

		<!--添加题目-->
		<add-topic 
			:dialogAddtopic.sync="addTopicFlag"
			:type="type"
			:level="level"
			@saveOneQuestion = "getDataAdd"
			>			
		</add-topic>
		<!--修改模板-->
		<import-template
		:dialogTemModify.sync="TemModify" 
		@updataEvalTems = "getDataWhile"
		:types="type"
		:titles="passtitle"
		:levels="level"
		:activitys="courseSubjectType"
		:isdetail="isdetail"
		>
       </import-template>
		
	</div>

</template>



<script type="text/javascript">
	import addTopic from './addtopic'
	import model from 'model/comtpoc/comtopic'
	import empty from './empty'
	import importTemplate from '@/base/modal/templateupdate.vue'
	import API from '@/global/resource'
	import { getToken } from '@/filters/userVerify'
	export default{
		data(){
			return{
				addTopicFlag:false,
				type:"",
				level:"",
				title:"课程评价通用题目",
				quesionArray:[],
				selList:["A","B","C","D","E","F","G","H","I","J"],

				showFlag:false,
				general:true,//通用
				template:false,//模板
				tab_color:{
					'color':'#2885DB',
					'background-color':' #fff'
				},
				templateArr:[],//模板数据
				templateArrcoursein:[
					{'courseSubjectType':'ztjz','title':'专题讲座','img':'../../../static/img/zhuan.png','not':false},
					{'courseSubjectType':'aljx','title':'案例教学','img':'../../../static/img/an.png','not':false},
					{'courseSubjectType':'jxsj','title':'教学实践','img':'../../../static/img/shi.png','not':false},
					{'courseSubjectType':'fajd','title':'方案解读','img':'../../../static/img/fang.png','not':false},
					{'courseSubjectType':'dxfx','title':'到校访学','img':'../../../static/img/dao.png','not':false},
					{'courseSubjectType':'ggsj','title':'跟岗实践','img':'../../../static/img/gen.png','not':false},
					{'courseSubjectType':'jxgm','title':'教学观摩','img':'../../../static/img/guan.png','not':false},
					{'courseSubjectType':'pbhd','title':'破冰活动','img':'../../../static/img/po.png','not':false},
					{'courseSubjectType':'zjfs','title':'总结反思','img':'../../../static/img/fan.png','not':false},
					{'courseSubjectType':'hdjl','title':'互动交流','img':'../../../static/img/hu.png','not':false},
					{'courseSubjectType':'wtyt','title':'问题研讨','img':'../../../static/img/yan.png','not':false},
					{'courseSubjectType':'cgkc','title':'参观考察','img':'../../../static/img/can.png','not':false},
					{'courseSubjectType':'live','title':'直播','img':'../../../static/img/zhi.png','not':false},
					{'courseSubjectType':'other','title':'其他','img':'../../../static/img/qi.png','not':false},
				],//项目反思模板
				templateArrcourse:[
					{'courseSubjectType':'ztjz','title':'专题讲座','img':'../../../static/img/zhuan.png','not':false},
					{'courseSubjectType':'aljx','title':'案例教学','img':'../../../static/img/an.png','not':false},
					{'courseSubjectType':'jxsj','title':'教学实践','img':'../../../static/img/shi.png','not':false},
					{'courseSubjectType':'fajd','title':'方案解读','img':'../../../static/img/fang.png','not':false},
					{'courseSubjectType':'dxfx','title':'到校访学','img':'../../../static/img/dao.png','not':false},
					{'courseSubjectType':'ggsj','title':'跟岗实践','img':'../../../static/img/gen.png','not':false},
					{'courseSubjectType':'jxgm','title':'教学观摩','img':'../../../static/img/guan.png','not':false},
					{'courseSubjectType':'pbhd','title':'破冰活动','img':'../../../static/img/po.png','not':false},
					{'courseSubjectType':'zjfs','title':'总结反思','img':'../../../static/img/fan.png','not':false},
					{'courseSubjectType':'hdjl','title':'互动交流','img':'../../../static/img/hu.png','not':false},
					{'courseSubjectType':'wtyt','title':'问题研讨','img':'../../../static/img/yan.png','not':false},
					{'courseSubjectType':'cgkc','title':'参观考察','img':'../../../static/img/can.png','not':false},
					{'courseSubjectType':'live','title':'直播','img':'../../../static/img/zhi.png','not':false},
					{'courseSubjectType':'other','title':'其他','img':'../../../static/img/qi.png','not':false},
				],//项目课程模板
				templateArrclazz:[
					{'courseSubjectType':'xmpj','title':'','img':'../../../static/img/ping.png','not':false},
				],//为项目时的数据
				passtitle:'',
				templateqArr:[],//上传的模板题目
				detailshow:false,//是否显示模板详情
				templatenav:false,//是否显示模板按钮
				TemModify:false,//更改模板隐藏
				courseSubjectType:"",//更改的哪一个模板
				subjectId:'',//更改模板的id
				isdetail:true,//设置上传是模板还是模板详情，true代表是模板
				loadingD:false,
			}
		},

		created(){
			this.getValue();
			this.getData();
			this.$nextTick(()=>{
				this.click_tab()
			});
			
		},

		methods:{
			//tab切换函数控制样式和显示不同的内容
			click_tab(){
				// console.log("2222222222222222-==================");
				$('.tab_btn_1').css({'color':'#2885DB','background-color':' #fff'})
			},
			tab_switch(val){
				if(val=='general'){
					$('.tab_btn_1').css({'color':'#2885DB','background-color':' #fff'});
					this.general=true;
					this.template=false;
					this.templatenav=false;
					this.detailshow=false;
					$('.tab_btn_2').css({'color':'#8E9BAE','background-color':' #EEF1F6'});					
				}else{
					$('.tab_btn_2').css({'color':'#2885DB','background-color':' #fff'});
					this.general=false;
					this.template=true;
					this.templatenav=true;
					$('.tab_btn_1').css({'color':'#8E9BAE','background-color':' #EEF1F6'});
				}
			},
			//新增模板
			add_template(){

			},
			getValue(){
				this.type = this.$route.query.type;
				this.level = this.$route.query.level;
				if(this.type && this.level){
					this.type = this.type;
					this.level = this.level;
				}else{
					this.type = "evaluation";
					this.level = "course";
				}
				this.curTitle(this.level);
				this.type = this.type.toUpperCase();
				this.level = this.level.toUpperCase();
				this.gettemplate()
			},
			//获取模板信息
			gettemplate(){
				this.loadingD=true
				let data={
					level:this.level,
					type:this.type,
				};
				model.getdefaulttemplate(data,(res=>{
					if(res.status==200){
						this.detailshow=false;
						this.templatenav=true;
						if(this.level=='COURSE'){
							if(this.type=='EVALUATION'){
								//课程评价
								res.data.forEach( ele=> {
									this.templateArrcourse.forEach(val=>{
										if(ele.courseSubjectType==val.courseSubjectType){
											this.$set(val,'not',true);
											this.$set(val,'id',ele.id)
										}
									})
								});
								this.templateArr=this.templateArrcourse
							}else{
								//课程反思
								res.data.forEach( ele=> {
									this.templateArrcoursein.forEach(val=>{
										if(ele.courseSubjectType==val.courseSubjectType){
											this.$set(val,'not',true);
											this.$set(val,'id',ele.id)
										}
									})
								});
								this.templateArr=this.templateArrcoursein
							}
							
						}else{
							//项目
							res.data.forEach( ele=> {
								this.templateArrclazz.forEach(val=>{
									if(ele.level=="CLAZZ" && ele.type=="EVALUATION"){
										this.$set(val,'not',true);
										this.$set(val,'id',ele.id);
										this.$set(val,'title',ele.title);
										this.$set(val,'img','../../../static/img/ping.png');
									}else{
										this.$set(val,'not',true);
										this.$set(val,'id',ele.id);
										this.$set(val,'title',ele.title);
										this.$set(val,'img','../../../static/img/fan.png');
									}
								})
							});
							this.templateArr=this.templateArrclazz;
						}
						this.loadingD=false
					}
				}))
			},
			//模板为空时增加模板
			addtemplate(val){
				console.log(val);
				this.TemModify=true;
				this.courseSubjectType=val;
				this.isdetail=true;
			},
			//获取模板详情
			gettemplatedetail(val){
				this.loadingD=true
				this.subjectId=val;
				let data={
					id:this.subjectId
				};
				model.getdetemplatedetail(data,(res)=>{
					console.log(res)
					if(res.status==200){
						this.templateqArr=res.data.questions;
						this.templatenav=false;
						this.detailshow=true;
						this.courseSubjectType=res.data.courseSubjectType
						this.isdetail=false;
						this.loadingD=false
					}
				})
			},
			//从详情返回
			goback(){
				this.templatenav=true;
				this.detailshow=false;
				this.gettemplate();
			},
			//更改模板关闭
			getDataWhile(val){
				this.TemModify=false;
				if(val=="detail"){
					this.gettemplatedetail(this.subjectId);
				}else{
					this.gettemplate();
				}
				
				

			},
			//更改模板
			updatatemplate(){
				this.TemModify=true;
			},
			//导出模板
			experttemplate(){
				window.open(API.urls.experttemplate+"?id="+this.subjectId+"&token="+getToken());
			},
			curTitle(level){
				switch(level){
					case "course":
					if(this.type == "evaluation"){
						this.title = "课程评价通用题目";
						this.passtitle = "课程评价";
					}else{
						this.title = "课程反思通用题目";
						this.passtitle = "课程反思";
					}	
					break;

					case "clazz":
					if(this.type == "evaluation"){
						this.title = "项目评价通用题目";
						this.passtitle = "项目评价";
					}else{
						this.title = "项目反思通用题目";
						this.passtitle = "项目反思";
					}
					break;

					default:
					this.title = "课程评价通用题目";
				}
			},

			getData(){
				this.click_tab();
				this.tab_switch('general');
				let data = {
					type:this.type,
					level:this.level
				}
				model.comFindByAndTypeAndLevel(data, (res => {
					 if(!!res.data){
					 	let dataObj = res.data;
					 	this.curTitle(res.data.level);
					 	if(!!dataObj.questions && dataObj.questions.length > 0){
					 		this.quesionArray = dataObj.questions;
					 	}
					 
					 //显示空页面	
					 }else{
					 	this.showFlag = true;
					 }

				}))
			},

			getDataAdd(data){
				this.quesionArray.push(data);
			},

			saveQuestions(){
				let data = {
					type:this.type,
					level:this.level,
					questions:this.quesionArray
				}

				model.comSave(data, (res => {
					//console.log(res);
					if(res.status == 200){
						this.$message({
				          message: '保存成功',
				          type: 'success'
				        });
					}else{
						this.$message.error(res.message);
					}
				}))
			},

			delQuestion(index){
				//console.log(index);
				this.quesionArray.splice(index,1)

				//显示空页面
				if(this.quesionArray.length == 0){
					this.showFlag = true;
				}
			},

			addTopics(){
				this.addTopicFlag = true;
			}

		},

		watch: {
			$route (to, from) {
				this.showFlag = false;
				this.getValue();
			    // 执行ajax请求，但只希望在进入时请求，离开时不希望进行请求。
			    this.quesionArray = [];
			    this.getData()
			}
		},


		components:{
			addTopic,
			empty,
			importTemplate,

		}
	}
</script>