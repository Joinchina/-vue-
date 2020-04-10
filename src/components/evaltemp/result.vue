<style scoped lang="less">
	@import "../../assets/less/activity.less";
	@import "../../assets/less/icon.less";
	#wview {
		.btn {
			font-size: 16px;
		}
		.empty{
			text-align: center;
			font-size: 18px;
			color: #666;
			line-height: 28px;
			margin-top: 40px;
		}
		.template-empty{
			background: url("../../assets/img/template/empty.png") no-repeat;
			width: 91px;
			height: 107px;
			background-size:100% 100%;
			margin:0 auto;
			margin-top: 5px;
			margin-bottom: 20px;
		}
	}
	.x-article{
		h1{
			width: 95%;
			overflow:hidden;
		    text-overflow:ellipsis;
		    white-space:nowrap;

		}
	}
</style>
<template>
	<div id="wview">
		<!-- main -->
    	<main class="x-view" id="quesView">

			<nav class="subnav clearfix">
				<!-- <a class="back" href="javascript:history.back();"><i class="icon-back"></i>返回</a> -->
				<Goback :passtitle="title" ></Goback>
				<span class="right">
					<el-button @click="TemModify = true" class="btn-blue-n">
						<span class="icon-t-modify"></span> 修改模板
					</el-button>
					<i class="icon-ques" v-popover:tempmodify></i>
				</span>
			</nav>
			
			<article class="x-article" v-loading="loading"
				:element-loading-text="this.$globalParam.loadText"
				:element-loading-spinner="this.$globalParam.loadSpinner"
				:element-loading-background="this.$globalParam.loadBg">
				<div class="header">
					<h1>{{title}}</h1>
	
				</div>
				
				<section class="x-ques" v-if="!emptyFlag">
					<template v-for="(item, index) in quesList">	
					<dl v-if="item.type == 'SELECT'">
						<dt>
							<h2>
								<span class="q" >Q{{index+1}}.</span>{{item.question}}
								<span class="type">
								（单选题）（{{item.required ? '必答' : '选答'}}）
								</span>
							</h2>
						</dt>
						<dd v-for="(sel, index) in item.selections">
							<!-- <i class="icon-radio"></i> -->
							<label for="" >{{selList[index]}} {{sel}}</label>
						</dd>
						
					</dl>
					<dl v-else-if="item.type == 'MUILTSELECT'">
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
					
				</section>
				<section v-else class="empty">
					<div class="template-empty"></div>
					请到课程中查看课程评价内容<br/>
					或点击"修改模板"统一修改班级的课程评价模板	
				</section>
			</article>
			
			<!-- 二维码弹出框 -->
	       

		</main>
    	<!-- /main -->
    	<el-popover
			ref="tempmodify"
			placement="bottom-start"
			width="200"
			trigger="hover"
			:content="popovercontent">
		</el-popover>

		<!--修改模板-->
		<import-template
		:dialogTemModify.sync="TemModify"
		@updataEvalTem = "getData"
		:title="title"
		:type="type"
		:level="level"
		:clazzId = "clazzId">
       </import-template>

	</div>
</template>
<script>
	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'
	import model from 'model/evaltemp/evaltemp'
	import importTemplate from 'components/evaltemp/modify'
	import Goback from 'base/goback/goback'
	export default {
		data () {
			return {
				title:"",
				quesList:[],
				typeName: "",
				selList:["A","B","C","D","E","F","G","H","I","J"],
				popovercontent:"",
				TemModify: false,
				loading:true,
				emptyFlag:false,//模板是否第一次进来
			}
			
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			},
			type(){
				return this.$route.query.type;
				
			},
			level(){
				return this.$route.query.level;
			},
			template(){
				return this.$route.query.template;
			}
		},
		created:function() {
			this.getData();
		},
		methods: {
			getData: function() {
				var data = {
					clazzId:this.clazzId,
					type:this.type,
					level:this.level
				}
				model.paperFindByClazzIdAndTypeAndLevel (data, (res => {
					if(res.status == 200){
						if(res.data){
							let ress = res.data;
							this.title = ress.title;
							this.quesList = ress.questions;
							// this.type = ress.type;
							// this.level = ress.level;
							this.loading=false;
							this.emptyFlag = false;
							let objs = [
								{level:"CLAZZ",type:"EVALUATION",value:"项目评价"},
								{level:"CLAZZ",type:"INTROSPECTION",value:"项目反思"},
								{level:"COURSE",type:"EVALUATION",value:"课程评价"},
								{level:"COURSE",type:"INTROSPECTION",value:"课程反思"},
							]
							objs.forEach((item,index)=>{
								if(this.type == item.type && this.level == item.level){
									this.popovercontent = "统一修改" + item.value;
								}
							})
						}else{
							this.emptyFlag = true;
							this.loading=false;
							this.title='培训'+this.template;

						}
						
						

					}else{
						this.$message.error(res.message);
					}
				}))
			},
			
		},
		watch:{
			$route(to,from){
				this.getData();
			}
		},
		components:{
			importTemplate,
			Goback
		}
	}
</script>