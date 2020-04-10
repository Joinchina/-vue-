<template>
	<div>
		<div class="question_naire x-view" style="width: 1150px; margin:0 auto;">
			<!--header_start-->
			<header class="header subnav clearfix">
				<Goback passtitle="编辑问卷" ></Goback>
				<div class="pull-right">
					<a href="javascript:void(0)" class="btn_draft" title="保存到草稿箱" alt = "保存到草稿箱" id="saveDraft" @click="saveDraft('DRAFT')" v-if="!level"></a>
					
					<a href="javascript:void(0)" class="btn_publish" title="发布" alt="发布" id="savePublish" @click="saveDraft('PUBLISH')" v-show="!saveFlag">发布</a>

					<a href="javascript:void(0)" class="btn_publish" v-show="saveFlag">发布中{{saveSeconds}}s</a>

				</div>
			</header>
			<!--header_end-->

			<!--content_start-->
			<div class="question_content ">
				
				<!--title_start-->
				<div class="title">
					<div class="form-group clearfix">
					    <label class="col-md-2 control-label left_dis">问卷标题：</label>
					    <div class="col-md-8 rg_dis">
						     <input type="text" class="form-control rg_input_h js-text" placeholder="请输入标题（50字以内）" id="title" maxlengths="50">
						     <div class = "errorMessag"></div>
					    </div>
					</div>

					<div class="form-group clearfix">
					    <label class="col-md-2 control-label left_dis" >问卷描述：</label>
					    <div class="col-md-8 rg_dis">
						     <textarea rows="5" id="questionDescripion" style = "height:auto;" class="form-control rg_input_h js-text" placeholder="请输入问卷说明（200字以内）"  maxlengths="200"></textarea>
					    </div>
					</div>

					<!--编辑-所属课程-->
					<div class="form-group clearfix" v-if="courseShow&&!template&&urltype!=='clazz'" v-show="!level">
						<div class="form-group clearfix">
						    <label class="col-md-2 control-label left_dis draftEdit" >所属课程：</label>
						    <div class="col-md-2">
							 	 <select class="form-control rg_input_h" id="belongCourse"></select>
							 	  <div class = "errorMessag"></div>
						    </div>
							
							<label class="col-md-2 control-label left_dis" >开放方式：</label>
							<div class="col-md-3">
							 	<label class="insertQuesRadio">
							 		<input name="type" type="radio" v-model="openModeE" value="TIMING" disabled  readonly />
							 		立即开始
							 	</label>
							 	<label class="insertQuesRadio">
						    		<input name="type" type="radio"  v-model="openModeE" value="MANUAL" disabled  readonly />
						    		手动开放
						    	</label>
						    </div>
							
							<template v-if="openModeE == 'TIMING'">
								<label class="col-md-1 control-label" style="width:120px;font-size:18px;float:left;">截止时间：</label>
							    <div class="col-md-2" v-if="!level" style = "padding-left:0;padding-right:0;">
								 	 <el-date-picker
							    	  id = "endTime"
								      v-model="endTime"
								      type="date"
								      :picker-options="pickerOptions1"
								      placeholder="永久">
								    </el-date-picker>
		                        	<div class = "errorMessag"></div>
							    </div>
							</template>
						     
						</div>
					</div>
					<!--创建问卷- 班级首页入口 可选所属课程下拉框  编辑-所属课程-->
					<div class="form-group clearfix" v-else-if="courseShow && !template && urltype == 'clazz'" v-show="!level">
						<div class="form-group clearfix">
						    <label class="col-md-2 control-label left_dis  clazzindexcreate" >所属课程：</label>
						    <div class="col-md-2">
							 	 <select class="form-control rg_input_h" id="belongCourse"></select>
							 	  <div class = "errorMessag"></div>
						    </div>
							
							<label class="col-md-2 control-label left_dis" >开放方式：</label>
							<div class="col-md-3">
							 	<label class="insertQuesRadio">
							 		<input name="type" type="radio" v-model="openmodec" value="TIMING"  />
							 		立即开始 
							 	</label>
							 	<label class="insertQuesRadio">
						    		<input name="type" type="radio"  v-model="openmodec" value="MANUAL"  />
						    		手动开放
						    	</label>
						    </div>
							
							<template v-if="openmodec == 'TIMING'">
								<label class="col-md-1 control-label" style="width:120px;font-size:18px;float:left;">截止时间：</label>
							    <div class="col-md-2" v-if="!level" style = "padding-left:0;padding-right:0;">
								 	 <el-date-picker
							    	  id = "endTime"
								      v-model="endTime"
								      type="date"
								      :picker-options="pickerOptions1"
								      placeholder="永久">
								    </el-date-picker>
		                        	<div class = "errorMessag"></div>
							    </div>
							</template>
						     
						</div>
					</div>


					<!--模板库- 仅限于课程和项目任务入口  编辑-所属课程-->
					<div class="form-group clearfix" v-else-if="courseShow&&template&&type !== 'clazz'" v-show="!level">
						<div class="form-group clearfix">
						    <label class="col-md-2 control-label left_dis  coursetemplate" >所属课程：</label>
						    <div class="col-md-2" style="margin-top:10px;">
							 	{{courseName}}
						    </div>

						    <label class="col-md-2 control-label left_dis" >开放方式：</label>
							<div class="col-md-3">
							 	<label class="insertQuesRadio">
							 		<input name="type" type="radio" v-model="openmodec" value="TIMING" />
							 		立即开始 
							 	</label>
							 	<label class="insertQuesRadio">
						    		<input name="type" type="radio" v-model="openmodec"  value="MANUAL" />
						    		手动开放
						    	</label>
						    </div>
							
							<template v-if="openmodec == 'TIMING'">
								<label class="col-md-1 control-label" style="width:120px;font-size:18px;float:left;">截止时间：</label>
							    <div class="col-md-2" v-if="!level" style="padding-left:0;padding-right:0;">
							    	 <el-date-picker
							    	  id = "endTime"
								      v-model="endTime"
								      type="date"
								      :picker-options="pickerOptions1"
								      placeholder="永久">
								    </el-date-picker>
		                        	<div class = "errorMessag"></div>
								</div>
							</template>
						     <!-- <label class="col-md-1 control-label" style="width:120px;font-size:18px;float:left;">截止时间：</label>
						    <div class="col-md-3" v-if="!level" style = "padding-left:0;padding-right:0;">
							 	 <el-date-picker
						    	  id = "endTime"
							      v-model="endTime"
							      type="date"
							      :picker-options="pickerOptions1"
							      placeholder="永久">
							    </el-date-picker>
	                        	<div class = "errorMessag"></div>
						    </div> -->
						</div>
					</div>
					

					<!--模板库- 班级首页入口 可选所属课程下拉框  编辑-所属课程-->
					<div class="form-group clearfix" v-else-if="courseShow&&template&&type == 'clazz'" v-show="!level">
						<div class="form-group clearfix">
						     <label class="col-md-2 control-label left_dis clazztemplate" >所属课程：</label>
						    <div class="col-md-2">
							 	 <select class="form-control rg_input_h" id="belongCourse"></select>
							 	  <div class = "errorMessag"></div>
						    </div>

						    <label class="col-md-2 control-label left_dis" >开放方式：</label>
							<div class="col-md-3">
							 	<label class="insertQuesRadio">
							 		<input name="type" type="radio" v-model="openmodec" value="TIMING" />
							 		立即开始 
							 	</label>
							 	<label class="insertQuesRadio">
						    		<input name="type" type="radio" v-model="openmodec"  value="MANUAL" />
						    		手动开放
						    	</label>
						    </div>
							
							<template v-if="openmodec == 'TIMING'">
								<label class="col-md-1 control-label" style="width:120px;font-size:18px;float:left;">截止时间：</label>
							    <div class="col-md-2" v-if="!level" style="padding-left:0;padding-right:0;">
							    	 <el-date-picker
							    	  id = "endTime"
								      v-model="endTime"
								      type="date"
								      :picker-options="pickerOptions1"
								      placeholder="永久">
								    </el-date-picker>
		                        	<div class = "errorMessag"></div>
								</div>
							</template>
						    <!--  <label class="col-md-1 control-label" style="width:120px;font-size:18px;float:left;">截止时间：</label>
						    <div class="col-md-3" v-if="!level" style = "padding-left:0;padding-right:0;">
							 	 <el-date-picker
						    	  id = "endTime"
							      v-model="endTime"
							      type="date"
							      :picker-options="pickerOptions1"
							      placeholder="永久">
							    </el-date-picker>
	                        	<div class = "errorMessag"></div>
						    </div> -->
						</div>
					</div>


					<!--创建-课程、项目任务创建 - 无所属课程，只显示所属课程名称-->
					<div class="form-group clearfix" v-else v-show="!level">
						<label class="col-md-2 control-label left_dis coursecreate" >所属课程：</label>
						<div class="col-md-2" style="margin-top:10px;">
							{{courseName}}
						</div>
							
						<label class="col-md-2 control-label left_dis" >开放方式：</label>
						<div class="col-md-3">

						 	<label class="insertQuesRadio">
						 		<input name="type" type="radio" v-model="openmodec" value="TIMING" /> 立即开始 
						 	</label>
						 	<label class="insertQuesRadio">
					    		<input name="type" type="radio" v-model="openmodec"  value="MANUAL" /> 手动开放
					    	</label>
					    </div>
						
						<template v-if="openmodec == 'TIMING'">
							<label class="col-md-2 control-label left_dis" style="margin-left: -10px;">截止时间：</label>
						    <div class="col-md-2" style="padding-left:0;padding-right:0;">
						    	 <el-date-picker
						    	  id = "endTime"
							      v-model="endTime"
							      type="date"
							      :picker-options="pickerOptions1"
							      placeholder="永久">
							    </el-date-picker>
	                        	<div class = "errorMessag"></div>
							</div>
						</template>
					    
					</div>

					<!-- 实名匿名状态 -->
					<div class="form-group clearfix">
							<label class="col-md-2 control-label left_dis" >实名：</label>
							<div class="col-md-8 rg_dis rg_dis_top">
								<el-switch
									v-model="nameStatus"
									@click="switchstatus"
									active-text=""
									inactive-text="">
								</el-switch>
							</div>
					</div>
				</div>
				<!--title_end-->

				<!--content_start-->
				<!--item_start-->
				<div class="content">
					<section class="con item_width" id = "item_0">
						<input type="button" class = "btn_add2" id = "insertQuestion">
						<div class="qu_width">
							<div class="pull-right">
								<a href="javascript:void(0)" class="btn_delete delItem" ></a>
								<a href="javascript:void(0)" class="btn_moveup moveup">上移</a>
								<a href="javascript:void(0)" class="btn_moveup mg_none movedown">下移</a>
							</div>
							<span class="index">Q<span class="number">1</span></span>
							<div class="question"><input type="text" class="form-control rg_input_h titleChoose js-text" placeholder = "请输入题目（500字以内）" maxlengths="500"></div>
							<!-- <div class = "errorMessag"></div> -->
						</div>
						<div class="type">
							<ul class="clearfix">
								<li class="multi_cur type_one">单选题</li>
								<li class="multi_nomal type_one">多选题</li>
								<li class="multi_nomal six68_l type_one">问答题</li>
								<li class="line"></li>
								<li class="n_cur six68_r type_two">必答</li>
								<li class="n_nomal type_two">选答</li>
							</ul>
						</div>
							<dl class="clearfix col-md-12" style="padding-left:0!important;padding-right:0!important;">
								<dt><span class="letter">A</span></dt>
								<dd class="qu_width_t"><input type="text" class="form-control  rg_input_h addInput js-text"  placeholder = "请输入选项（50字以内）" maxlengths="50"></dd>
								<dd><input type="button" class = "del"></dd>
							</dl>
							<dl class="clearfix">
								<dt><span class="letter">B</span></dt>
								<dd class="qu_width_t"><input type="text" class="form-control  rg_input_h addInput js-text" placeholder = "请输入选项（50字以内）" maxlengths="50"></dd>
								<dd><input type="button" class = "del"></dd>
							</dl>
							<dl class="clearfix">
								<dt><span class="letter">C</span></dt>
								<dd class="qu_width_t"><input type="text" class="form-control  rg_input_h addInput js-text" placeholder = "请输入选项（50字以内）" maxlengths="50"></dd>
								<dd><input type="button" class = "del"></dd>
							</dl>
							<dl class="clearfix">
								<dt><span class="letter">D</span></dt>
								<dd class="qu_width_t"><input type="text" class="form-control  rg_input_h addInput js-text" placeholder = "请输入选项（50字以内）" maxlengths="50"></dd>
								<dd><input type="button" class = "del"></dd>
							</dl>
					</section>										
				</div>
			</div>
			<!--content_end-->

			<!--footer_start-->
			<footer class="footer">
				<div class="tit">选项上直接回车就增加下个选项</div>
				<input type="button" class = "btn_add" id = "addQuestion">
			</footer>
			<!--footer_end-->

		</div>
	</div>
</template>
<script type="text/javascript">
	import Questionnaire from '../../global/question_naire.js';
	import textContPrompt from '../../global/open.textContPrompt.js';
	import model from 'model/course/course';
	import Goback from 'base/goback/goback'
	export default{
		data(){
			return{
				endTime:"",
				pickerOptions1: {
		          	disabledDate(time) {
		            	return time.getTime() < Date.now() - 8.64e7;
		        	}
          		},
          		nameStatus:false,
          		title:"",
          		description:"",
          		questions:[],
          		realNameFlag:"",
          		status:"",
          		obj:{},
          		courseName:"",

          		saveFlag: false,  // 多次提交，true 为禁止发布 
          		saveSeconds: 4,		// 可点发布倒计时
          		openmodec: "TIMING",	// 创建问卷 开放方式
			}
		},
		
		props:["courseShow","level","courseId","template","type","switchmessage", "openModeE"],
		computed: {
			urltype () {
				return this.$route.query.type;
			}
		},
		watch: {
			switchmessage:function(newVal,oldVal){
			　　 this.realNameFlag=newVal;
				 this.nameStatus=newVal
			},
		},
		mounted(){
			$.fn.textContPromt();
			// console.log("获取课程id");
			// console.log(this.courseId);
			//获取课程名称
			if(this.courseId){
				this.getCourseName();
			}	
			if(this.openModeE) {
				this.openmodec = this.openModeE;
			}
			console.log("openModeE   ", this.openModeE);
		},

		methods:{
			switchstatus(n){
				this.nameStatus=n;
			},
			getCourseName(){
				let data = {
					courseId: this.courseId
				}
				model.getCourseFindOne(data, (res => {
					if(res.status == 200){
						this.courseName = res.data.name;
					}else{
						this.$message.error(res.message);
					}
				}))
			},
			commitData(result){
				console.log("result", result);
				if(!!result){

					$(".errorMessag").remove();

					let questions = this.saveData();

					this.obj = {
						description:this.questionDescripion,
						title:this.title,
						endTime:this.endTime,
						realNameFlag:this.nameStatus,
						status:this.status,
						questions:this.questions,
						openMode: this.openModeE || this.openmodec,		
					}
					console.log("问卷题目", this.obj);
					if(!this.saveFlag) {
						this.$emit("createQuestion",this.obj);
					}
					if(this.obj.status == 'PUBLISH') {
						this.saveBtn();
					}
					
					
				}
			},
			saveData(){
				this.questions.length = 0;
				//组织数据
				let _this = this;
				$(".item_width").each(function(index,item){
					var obj = {};
					var question = $(this).find(".titleChoose").val();
					//var requireWhether = $("input[name='answer_"+index+"']:checked").val();
					var requireWhether = $(this).find(".n_cur").text();
					if(requireWhether == "必答"){
						var required = true;
					}else{
						var required = false;
					}
					//var typeWheher = $("input[name = 'choose_"+index+"' ]:checked").val();
					var typeWheher = $(this).find(".multi_cur").text();
					if(typeWheher == "单选题"){
						var type = "SELECT";
					}else if(typeWheher == "多选题"){
						var type = "MUILTSELECT";
					}else{
						var type = "SUBJECTIVE";

					}
					obj.question = question;
					obj.required = required;
					obj.type = type;
					obj.selections = [];
					//问答题此selections数组不传
					if($(this).find("dl").css("display")== "block"){
						$(this).find("input.addInput").each(function(index,item){
							if($(this).val() != ""){
								obj.selections.push($(this).val());
							}
						})
					}
					_this.questions.push(obj);
				})

				return _this.qustions;
			},
			errorMessag:function(txt){
				var div = "<div class = 'errorMessag'>"+txt+"</div>";
				return div;
			},
			isRepeat(arr){
				var hash = {};

				for(var i in arr) {

					if(hash[arr[i]])

					return true;

					hash[arr[i]] = true;

				}
				return false;
			},
			saveBtn() {
				// 倒计时5秒
				// let	_this = this;
				let timer = "";
				
				if(this.saveSeconds > 1) {
					this.saveFlag = true;
					this.saveSeconds--;
					timer = setTimeout(() => {
						this.saveBtn();
					}, 1000)
					
				} else {
					this.saveFlag = false;
					this.saveSeconds = 4;
					clearTimeout(timer);
				}
			},
			saveDraft(status){
				// 清空上次的数据
				this.validate(status);
			},
			validate(status){
				let _this = this;
				//进行字数校验，如字数超多，提示字数过多
				var flag = true;
				//标题
				_this.title = $.trim($("#title").val());
				//问卷描述
				_this.questionDescripion = $.trim($("#questionDescripion").val());
				//所属课程
				var couseBelong = $("#belongCourse").val();
				//请选择时间
                _this.endTime = $.trim($("#endTime").val());
                //实名、匿名
                _this.realNameFlag = _this.nameStatus;
                //状态 发布草稿箱 或 发布
                _this.status = status;
				var itemArray;
				var result = true;
				var lessTwoFlag = true;
				var newArray = [];
				//title校验
				if(_this.title == ""){
					console.log(0);
					$("#title").next("div.errorMessag").text("请输入问卷标题");
					return;
				}else{
					console.log(1);
					//字数限制判断,标题
					var length = $("#title").val().length;
					if(length >= 50){
						$("#title").next("div.errorMessag").text("标题不能超过50字");
						return;
					}
				}
				//请选择时间
				if(_this.endTime == "请选择时间"){
				  if($("#endTime").length == 0 ){
				     var div = "<div class='errorMessag'></div>";
			            $("#endTime").append(div);
			        }
			        $("#endTime").next("div.errorMessag").text("请选择时间");
			        return;
			    }
		        //问卷描述校验
		        if(_this.questionDescripion != ""){
					//字数限制判断,问卷描述
					var length = questionDescripion.length;
					if(length >= 200){
						$("#questionDescripion").next("div.errorMessag").text("描述不能超过200字");
						return;
					}
				}
				if(couseBelong == "请选择"){
					$("#belongCourse").next("div.errorMessag").text("请选择所属课程");
					$("#title").next("div.errorMessag").text("");
					return;
				}
				//问题校验
				$(".item_width").each(function(index,item){
					itemArray = 0;
					var obj = [];
					var addInput = $(item).find(".addInput");
					var titleChoose = $(item).find(".titleChoose");
					if($.trim(titleChoose.val()) == ""){
						var $thisId = $(this).attr("id");
						var txt = "请输入问题标题";
						$(".errorMessag").remove();
						titleChoose.after(_this.errorMessag(txt));
						result = false
						return false;


					}else{
						//题目字数限制
						var length = $(item).find(".titleChoose").val().length;
						if(length >= 500){
							$(item).find(".titleChoose").next("div.errorMessag").text("题目不能超过500字");
							result = false;
							return false;
						} else {
							result = true;
						}

						console.log("result===",index, result, length);
					}

					addInput.each(function(index,item){
						if($.trim($(this).val()) != ""){
							var val = $(this).val();
							//输入选项进行字数限制
							var length = $(this).val().length;
							if(length >= 50){
								//清除 title 的空
								$(this).next("div.errorMessag").text("选项不能超过50字");
								titleChoose.next("div.errorMessag").text("");
								result = false;
								lessTwoFlag = false;
								return false;
							}
							obj.push(val);
							itemArray++;
						}
					})
					newArray.push(obj);
					//问答题忽略此校验
					if($(this).find("dl").css("display") == "block"){
						//至少每个选项选择两题,两个文本框为空\
						if(lessTwoFlag){
							if(itemArray < 2){
								var $thisId = $(this).attr("id");
								var txt = "当前问题至少需要设置两个不同的选项。";
								$(".errorMessag").remove();
								titleChoose.after(_this.errorMessag(txt));
								result = false;
								return false;
							}
						}
					}
					//判断问题不能重复
					for(var i = 0; i < newArray.length;i++){
						if(_this.isRepeat(newArray[i])){
							var $thisId = $(this).attr("id");
							var txt = "任意两个选项内容不能重复";
							$(".errorMessag").remove();
							titleChoose.after(_this.errorMessag(txt));
							result = false;
							return false;
					   }
					}
			   })
			   this.commitData(result);
			}
		},

		components: {
			Goback
		}
	}
</script>
<style >
	@import '../../assets/css/questionnaire.css';
	@import '../../assets/reset-element-ui/form.css';
	#insertQuestion{
		background:url('../../assets/img/questionnaire/123.png') no-repeat;		
		background-size: cover;
		width: 98px;
		height:32px;
		border:0;
		margin: 0px 0 20px 0;
		 transition: all 0.2s;
   		 -webkit-transition: all 0.2s; /* Safari */
	}
	#insertQuestion:hover{
		background:url('../../assets/img/questionnaire/456.png') no-repeat;
		background-size: cover;
		transition: all 0.2s;
   		 -webkit-transition: all 0.2s; /* Safari */
	}
	.insertQuesRadio {
		display: inline-block;
		font-size: 16px;
		margin-right: 20px;
		line-height: 42px;
		
	}
	.insertQuesRadio > input {
		vertical-align: 1px;
	}
</style>