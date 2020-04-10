<template>
	<section>
		<!-- main -->
    	<main class="x-view" id="quesView">

			<nav class="subnav clearfix">
				<Goback :passtitle="title" ></Goback>
				
			</nav>
			
			<article class="x-article">
				<div class="header">
					<h1 v-cloak>{{title}}</h1>
                    <!-- 反思 -->
                    <template v-if="type =='INTROSPECTION' ">
                    <p class="summary" v-cloak><i class="icon-course"></i>所属课程：{{courseName}}</p>
                    <p class="summary" v-cloak><i class="icon-ques-num"></i>题目：共{{quesNum}}道题</p>
                    </template>
				</div>
				
				<section class="x-ques">
					<template v-for="(item, index) in quesList">	
					<dl v-if="item.type == 'SELECT'">
						<dt>
							<h2>
								<span class="q" v-cloak>Q{{index+1}}.</span>{{item.question}}
								<span class="type" v-if="type == 'QUESTIONNAIRE' " v-cloak>
								（单选题）（{{item.required ? '必答' : '选答'}}）
								</span>
							</h2>
						</dt>
						<dd v-for="(option, index) in item.optionStatistics">
							<i v-if="option.selected == true" class="icon-radio-selected"></i>
							<i v-if="option.selected == false" class="icon-radio"></i>
							<label for="" v-cloak>{{selList[index]}} {{option.optionContent}}</label>
						</dd>
						
					</dl>
					<dl v-else-if="item.type == 'MUILTSELECT'">
						<dt>
							<h2>
								<span class="q" v-cloak>Q{{index+1}}.</span>{{item.question}}
								<span class="type" v-if="type == 'QUESTIONNAIRE' " v-cloak>
								（多选题）（{{item.required ? '必答' : '选答'}}）
								</span>
							</h2>
						</dt>
						<dd v-for="(option, index) in item.optionStatistics">
							<i v-if="option.selected == true" class="icon-checkbox-selected"></i>
                            <i v-if="option.selected == false" class="icon-checkbox"></i>
							<label for="" v-cloak>{{selList[index]}}  {{option.optionContent}}</label>
						</dd>
						
					</dl>
					<dl v-else-if="item.type == 'SUBJECTIVE'">
						<dt>
							<h2>
								<span class="q" v-cloak>Q{{index+1}}.</span>{{item.question}}
								<span class="type" v-if="type == 'QUESTIONNAIRE' " v-cloak>
								（问答题）（{{item.required ? '必答' : '选答'}}）
								</span>
							</h2>
						</dt>
						<dd>
							<textarea readonly="readonly" class="text" name="" id="" >  {{item.answers[0]}}</textarea>
						</dd>
						
					</dl>
					</template>
					
				</section>
			</article>
		</main>
    	<!-- /main -->
	</section>
</template>
<script>
	import model from 'model/activity/paperview'
	import Goback from 'base/goback/goback'
	export default {
		data() {
			return {
				title:"",     //文件标题
				type:"",	// 文件类型
				courseName:"",   // 课程名称,
				clazzName:"",   // 班级名称
				quesNum:"", // 问题数量
				endTime:"",  // 结束时间
				description:"",  // 问题描述
				quesList:[],   // 问题列表
				selList:["A","B","C","D","E","F","G","H","I","J"],
				qrcodeUrl:""
			}
		},
		computed: {
			// 页面id
			paperId() {
				return this.$route.query.paperId;
			},
			// 学员用户id
			userId() {
				return this.$route.query.userId;
			}
		},
		created:function() {
			this.getData();
		},
		methods: {
			getData: function() {
				let data = {
					paperId: this.paperId,
					userId: this.userId
				}

				model.getIntroDetail(data , (res => {
					// console.log("getIntroDetail",res)
					if(res.status == 200) {
						this.clazzName = res.data.clazzName;
						this.title = res.data.title;
						this.courseName = res.data.courseName;
						this.quesNum = res.data.questionCount;
						this.quesList = res.data.questions;
						this.type = res.data.type;
						this.endTime = res.data.endTime;
						this.description = res.data.description;
						this.qrcodeUrl = res.data.qrcodeUrl;
					} else {
						this.$message.error(res.message);
					}
				}));

			}
			
		},

		components: {
			Goback
		}
	}
</script>
<style scoped lang="less">
	@import "../../../assets/less/activity.less";
</style>