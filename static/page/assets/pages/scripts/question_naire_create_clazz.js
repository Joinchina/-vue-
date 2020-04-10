(function(){
	$.fn.selectcret=function(){
		// 实名认证开关js
		var div2=document.getElementById("div2");
		var div1=document.getElementById("div1");
		var selectcret=document.getElementById("selectcret");
		selectcret.style.display="none";
		div1.onclick=function(){
		if( selectcret.getAttribute("checked")==="false" ){
			selectcret.setAttribute("checked",true)
			div1.className="open1";
			div2.className="open2";
		}else{
			selectcret.setAttribute("checked",false)
			div1.className="close1";
			div2.className="close2";
		}
		};
	}
  //草稿箱id
  var courseIdDraft = "";
	//clazz级别有所属
	$.fn.initCouseAjax = function(){
		var clazzId = $.fn.splitSearchMethod()["clazzId"];
		//token
		var csrf_token = $.fn.splitSearchMethod()["token"];
		var type =  $.fn.splitSearchMethod()["type"];
		if(type == "clazz"){
			var datas = {
				clazzId:clazzId,
			}
			$.ajax({
				url:api()+"/course/courseListByClazzId",
				method:"get",
				data:datas,
				dataType:"json",
				headers: {
					"Authorization":csrf_token
				},
				success:function(data){
					
					var data = data.data;
					if(data.length > 0){
						var str = "";
						str +="<option id='default'>请选择</option>";
						for(var i = 0;i < data.length;i++){
							str += "<option id = '"+data[i].id+"'>"+data[i].name+"</option>";
						}
						$("#belongCourse").html(str);
					}
					
				}
			})
		}
		
	}

	$.fn.initCouseAjax();


	$.fn.create = function(){

		//发布草稿箱
		var createObj = {

			saveDraft:function(){
				//班级id
				var clazzId = $.fn.splitSearchMethod()["clazzId"];
				var courseId = $.fn.splitSearchMethod()["courseId"];
				var type =  $.fn.splitSearchMethod()["type"];
				//保存至草稿箱
				$("#saveDraft").click(function(){
					var status = "DRAFT";
					var url = devlopMent()+"/questionare/draft?clazzId="+clazzId;
					//阻止提示离开页面层
					$(window).unbind("beforeunload");
					createObj.saveCommon(status,url,"draft","create");
					localStorage.setItem("draft",1);
				});
				//编辑保存至草稿箱
				$("#saveDraftEditor").click(function(){
					var status = "DRAFT";
					//var url = "/questionpaper/questionnaire/list.xhtml";
					var url = devlopMent()+"/questionare/draft?clazzId="+clazzId;
					//阻止提示离开页面层
					$(window).unbind("beforeunload");
					createObj.saveCommon(status,url,"draft","editor");
					localStorage.setItem("draft",1);
				});
				//发布
				$("#savePublish").click(function(){
					var status = "PUBLISH";
					var detail = "";

					var url = devlopMent()+"/clazz/index/questionaire?clazzId="+clazzId;

					//阻止提示离开页面层
					$(window).unbind("beforeunload");

					createObj.saveCommon(status,url,"publish","create");
					//localStorage.setItem("publish",1);
				});
				//编辑发布按钮
				$("#savePublishEditor").click(function(){
					var status = "PUBLISH";

          			var url = devlopMent()+"/clazz/index/questionaire?clazzId="+clazzId;
					//阻止提示离开页面层
					$(window).unbind("beforeunload");
					createObj.saveCommon(status,url,"publish","editor");
					//localStorage.setItem("publish",1);
				});
			    $("#back_edit").click(function(){
			    	window.location.href = devlopMent()+"/clazz/index/questionaire?clazzId="+clazzId;
			    })
			    $("#back").click(function(){
			    	window.location.href = devlopMent()+"/clazz/index/questionaire?clazzId="+clazzId;


			    })
				//点击返回按钮，确认是否保存
//				$("#backMetod").unbind("click").click(function(){
//						var status = "DRAFT";
//						var url = "/questionpaper/questionnaire/list.xhtml";
//						createObj.saveCommon(status,url,"back");
//
//
//				})

			},
//			wordEmit:function(id,total,wordrs){
//					var length = id.val().length;
//					if(length > total){
//						console.log("bunengshuruzi");
//						$(id).next("div.errorMessag").text(wordrs);
//						return;
//					}
//
//			},
			saveCommon:function(status,url,type,create){
				//进行字数校验，如字数超多，提示字数过多
				var flag = true;
				//标题
				var title = $.trim($("#title").val());
				//问卷描述
				var questionDescripion = $.trim($("#questionDescripion").val());
				//所属课程
				var couseBelong = $("#belongCourse").val();
				//截止时间
				var deadLine = $.trim($("#deadLine").val());
				//请选择时间
        var endTime = $.trim($("#endTime").val());
				var itemArray;
				var result = true;
				var lessTwoFlag = true;
				var newArray = [];
				if(title == ""){
					$("#title").next("div.errorMessag").text("请输入问卷标题");
					$("#belongCourse").next("div.errorMessag").text("");
					return;
				}else{
					//字数限制判断,标题
					var length = $("#title").val().length;
					if(length >= 50){
						$("#title").next("div.errorMessag").text("标题不能超过50字");
						return;
					}

				}

				if(endTime == "请选择时间"){
				  	if($("#endTime").next("div.errorMessag").length == 0 ){
				     	var div = "<div class='errorMessag'></div>";
            			$("#endTime").after(div);
          			}
	          		$("#endTime").next("div.errorMessag").text("请选择时间");

	          		return;
        		}else{

        			$("#endTime").next("div.errorMessag").text("");
        		}

				if(questionDescripion != ""){
					//字数限制判断,问卷描述
					var length = $("#questionDescripion").val().length;
					if(length >= 200){
						$("#questionDescripion").next("div.errorMessag").text("描述不能超过200字");
						return;
					}
				}

				if(couseBelong == "请选择"){

					if($("#belongCourse").next("div.errorMessag").length == 0){
						  var div = "<div class='errorMessag'></div>";
            			  $("#belongCourse").after(div);
					}

					$("#belongCourse").next("div.errorMessag").text("请选择所属课程");
					$("#title").next("div.errorMessag").text("");
					return;
				}else{
					$("#belongCourse").next("div.errorMessag").text("");
				}


				$(".item_width").each(function(index,item){
						itemArray = 0;
						var obj = [];
						var addInput = $(item).find(".addInput");
						var titleChoose = $(item).find(".titleChoose");
						if($.trim(titleChoose.val()) == ""){
							var $thisId = $(this).attr("id");
							var txt = "请输入问题标题";
							$(".errorMessag").remove();
							titleChoose.after(createObj.errorMessag(txt));
							result = false
							return false;
						}else{
							//题目字数限制
							var length = $(item).find(".titleChoose").val().length;
							if(length >= 500){
								$(item).find(".titleChoose").next("div.errorMessag").text("题目不能超过500字");
								result = false;
								return false;
							}
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
									titleChoose.after(createObj.errorMessag(txt));
									result = false;
									return false;

								}
							}


						}

						//判断问题不能重复
						for(var i = 0; i < newArray.length;i++){
							if(isRepeat(newArray[i])){
								var $thisId = $(this).attr("id");
								var txt = "任意两个选项内容不能重复";
								$(".errorMessag").remove();
								titleChoose.after(createObj.errorMessag(txt));
								result = false;
								return false;
						   }
						}


				})
				if(!result){
					//显示错误信息
				}else{
					//发布
					if(type == "publish"){
						deleteConfirm(function (){
							successMethod();
						});
					//保存至草稿
					}else if(type == "draft"){
						successMethod();
					//点击back
					}else{
						//暂时不执行
//						$("#backMetod").attr("href","javascript:void(0)");
//						backConfirm(function(callback){
//							if(callback == "save"){
//								//保存至服务器
//								successMethod();
//							}else{
//								//离开当前页面
//								window.history.back(-1);
//							}
//						})
					}
					function successMethod(){
						$(".errorMessag").remove();
						//拼接大数组
						//描述内容
						var description = $("#questionDescripion").val();
						//截止时间
						var deadLine = $("#endTime").val();
						if(deadLine == "永久"){
							var endTime = null;
						}else{
							var endTime = $("#endTime").val();
						}
						//标题
						var title = $("#title").val();
						//试卷类型
						var type = "QUESTIONNAIRE";

						//选项
						var questions = [];
						//创建班级
						//班级id
						var clazzId = $.fn.splitSearchMethod()["clazzId"];
						//课程id
						var courseId = $("#belongCourse").find("option:selected").attr("id");
						
						//token
						var csrf_token = $.fn.splitSearchMethod()["token"];

						//获取实名认证的开关信息
						var realname=selectcret.getAttribute("checked");

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
							questions.push(obj);

						})
						if(create == "create"){
							//创建、保存草稿箱参数传递
							//“couserID 暂时写死”
							var datas = {
									courseId : courseId,
									description : description,
									endTime:endTime,
									//endInTime:endInTime,
									status:status,
									title:title,
									questions:questions,
									type:type,
									clazzId:clazzId,
									realNameFlag:realname
							};;

						}else{
							//编辑参数传递
							//var paperIdSeach = location.search;
							//var paperId = paperIdSeach.substring(paperIdSeach.indexOf("=")+1);
							var paperId = $.fn.splitSearchMethod()["paperId"];
							//课程id
						    var courseId =$("#belongCourse").find("option:selected").attr("id");
						    // var clazzId = $.fn.splitSearchMethod()["clazzId"];
							var datas = {
									courseId : courseId,
									description : description,
									endTime:endTime,
									//endInTime:endInTime,
									status:status,
									title:title,
									questions:questions,
									type:type,
									identification:paperId,
									clazzId:clazzId
							};
						}
						$.ajax({
							// url:host() + "/questionpaper/save.json",
							url:api() + "/questionpaper/saveQuestionPaper",
							method:"post",
							contentType:"application/json",
							data:JSON.stringify(datas),
							dataType:"JSON",
							headers: {
								"Authorization":csrf_token
							},
							success:function(data){
								if(data.status == 200){
									window.location.href =  url ;
									//alert(window.location.href);

								}else{
									if(window.toastr){
										window.toastr.error("发布失败");
									}
								}
							}

						})

					}

				}
				function deleteConfirm(callback){
					bootbox.confirm({
						message:"发布后问卷不能修改，是否确认发布？",
						buttons:{
							confirm:{
								label:"确认发布",
								className:"btn-success",
							},
							cancel:{
								label:"我再想想",
								className:"btn-danger"
							}
						},
					    callback: function (result) {
					    	if(result){
					    		if (typeof callback === "function"){
						            callback();
						        }
					    	}
					    },
					    size:"small",
					    backdrop: true
					});
				}


			function isRepeat(arr){

				var hash = {};

				for(var i in arr) {

					if(hash[arr[i]])

					return true;

					hash[arr[i]] = true;

				}
				return false;
				}
			},
			errorMessag:function(txt){
				var div = "<div class = 'errorMessag'>"+txt+"</div>";
				return div;
			}
		}
		createObj.saveDraft();
	}
	//编辑草稿箱
	$.fn.editorDraft = function(){
		//var paperIdSeach = location.search;
		//var paperId = paperIdSeach.substring(paperIdSeach.indexOf("=")+1);
		//paperId
		var paperId = $.fn.splitSearchMethod()["paperId"];
		//token
		var csrf_token = $.fn.splitSearchMethod()["token"];
		$.ajax({
			url:api()+"/questionpaper/questionsCount",
			method:"get",
			contentType:"application/json",
			dataType:"JSON",
			data:{
				paperId:paperId
			},
			headers: {
				"Authorization":csrf_token
			},
			success:function(data){
				var data = data.data;
				//标签索引
				var zmArray = ["A","B","C","D","E","F","G","H","I","J"];
				//问卷标题
				var title = data.title;
				//问卷描述
				var descripion = data.description;
				//所属课程
				var courseList = data.courseList;
				//课程id
        courseIdDraft = data.courseId;


				$("#belongCourse").html("");
				if(courseList != null && courseList != undefined){
					for(var i = 0; i < courseList.length;i++){
						var option = $("<option id = '"+courseList[i].id+"'>"+courseList[i].name+"</option>");
						$("#belongCourse").append(option);
					}
				}
				//所属课程
				var courseName = data.courseName;
				//截止时间
				var endTime = data.endTime;
				//问题集合
				var questions = data.questions;
				if(title != undefined && title != null){
					$("#title").val(title);
				}
				if(descripion != undefined && descripion != null){
					$("#questionDescripion").val(descripion);
				}
				if(courseName != undefined && courseName != null){
					$("#belongCourse").val(courseName);
				}
				if(endTime != undefined && endTime != null){
					$("#endTime").val(endTime);
					$("#lj_time").val("永久");
				}else{
					$("#endTime").val("永久");
					$("#lj_time").val("定时");
				}
				if(questions != null && questions != undefined){
					var str = "";
					var curClass = "multi_cur";
					var normalClass = "multi_nomal";
					for(var i = 0; i < questions.length;i++){
						str +='<section class="con item_width" id = "item_'+i+'">';
						str +='<div class="qu_width">';
						str	+=	'<div class="pull-right">';
						str	+=		'<a href="javascript:void(0)" class="btn_delete delItem"></a>';
						str	+=		'<a href="javascript:void(0)" class="btn_moveup moveup">上移</a>';
						str	+=		'<a href="javascript:void(0)" class="btn_moveup mg_none movedown">下移</a>';
						str	+=	'</div>';
						str	+=	'<span class="index">Q<span class = "number">'+(i + 1)+'</span></span>';
						str	+=	'<div class="question"><input type="text" class="form-control rg_input_h titleChoose js-text" value = "'+questions[i].question+'" value="请输入选项（50字以内）" maxlengths="50"></div>';
						str	+= '</div>';
						str	+= '<div class="type">';
						str	+=	'<ul class="clearfix">';
						if(questions[i].type == "SELECT"){
							str	+=	'<li class="multi_cur type_one">单选题</li>';
							str	+=	'<li class="multi_nomal type_one">多选题</li>';
							str	+=	'<li class="multi_nomal six68_l type_one">问答题</li>';
						}else if(questions[i].type == "MUILTSELECT"){
							str	+=	'<li class="multi_nomal type_one">单选题</li>';
							str	+=	'<li class="multi_cur type_one">多选题</li>';
							str	+=	'<li class="multi_nomal six68_l type_one">问答题</li>';
						}else{
							str	+=	'<li class="multi_nomal type_one">单选题</li>';
							str	+=	'<li class="multi_nomal type_one">多选题</li>';
							str	+=	'<li class="multi_cur six68_l type_one">问答题</li>';
						}

						str	+=	'<li class="line"></li>';
						if(questions[i].required){
							str	+=	'<li class="n_cur six68_r type_two">必答</li>';
							str	+=	'<li class="n_nomal type_two">选答</li>';
						}else{
							str	+=	'<li class="n_nomal six68_r type_two">必答</li>';
							str	+=	'<li class="n_cur type_two">选答</li>';
						}

						str	+=	'</ul>';
						str	+= '</div>';
						for(var j = 0; j< questions[i].selections.length; j++){
							str	+=	'<dl class="clearfix">';
							str	+=	  '<dt><span class="letter">'+zmArray[j]+'</span></dt>';
							str	+=		'<dd class="qu_width_t"><input type="text" class="form-control  rg_input_h addInput js-text" value = "'+questions[i].selections[j]+'" placeholder="请输入选项（50字以内）" maxlengths="50"></dd>';
							str	+=		'<dd><input type="button" class = "del"></dd>';
							str	+=	'</dl>';
						}
						if(questions[i].type == "SUBJECTIVE"){
							while(questions[i].selections.length < 4){
								str	+=	'<dl class="clearfix" style = "display:none">';
								str	+=	  '<dt><span class="letter">'+zmArray[questions[i].selections.length]+'</span></dt>';
								str	+=		'<dd class="qu_width_t"><input type="text" class="form-control  rg_input_h addInput js-text" placeholder="请输入选项（50字以内）" maxlengths="50"></dd>';
								str	+=		'<dd><input type="button" class = "del"></dd>';
								str	+=	'</dl>';
								questions[i].selections.length++;
							}
						}else{
							while(questions[i].selections.length < 4){
								str	+=	'<dl class="clearfix">';
								str	+=	  '<dt><span class="letter">'+zmArray[questions[i].selections.length]+'</span></dt>';
								str	+=		'<dd class="qu_width_t"><input type="text" class="form-control  rg_input_h addInput js-text" placeholder="请输入选项（50字以内）" maxlengths="50"></dd>';
								str	+=		'<dd><input type="button" class = "del"></dd>';
								str	+=	'</dl>';
								questions[i].selections.length++;
							}
						}


						str	+= '</section>';
			   		}
			   	   $(".content").html(str);
				   	var datalLength = questions.length - 1;
				   	//创建问卷标题
				   	$(".content").QuestionObj({
						animate:true,
						editor:true,
						sectionNum:datalLength,
						addAlmostNum:40
					});
				}

			}

		})

	}
	//$.fn.create();

	//问卷创建成功
	$.fn.qusionnaireSucc = function(){
		var obj = $.fn.splitSearchMethod();
		var paperId = obj["paperId"];
		$.ajax({
			url:api()+"/questionpaper/view.json",
			method:"get",
			contentType:"application/json",
			dataType:"JSON",
			data:{
				paperId:paperId
			},
			headers: {
				"X-CSRF-TOKEN":csrf_token
			},
			success:function(data){
			    var img = "<img src = '"+data.data.qrcodeUrl+"' style = 'width:100%;height:100%'/>";				$("#qrCoad").html(img);
				$("#btn_save").attr("href","/questionpaper/qrcode/download.json?paperId="+paperId+"");
				if(data.data.endTime != null){
					$("#endTime").text(data.data.endTime);
				}else{
					$("#endTime").text("永久");
				}

			}

		})
	}
	//设置时间
	$.fn.setTimeMehod = function(){
		$("#lj_time").click(function(){
			if($(this).val() == "永久"){
				$(this).val("设置");
				$("#endTime").attr("disabled", true);
				$("#endTime").attr("placeholder","永久");
				$("#endTime").val("永久");

			}else{
				$(this).val("");
				$(this).val("永久");
				$("#endTime").attr("disabled", false);
				$("#endTime").attr("placeholder","请选择时间");
				$("#endTime").val("请选择时间");
				$("#endTime").datepicker({
					language : "zh-CN",
					autoclose : true,// 选中之后自动隐藏日期选择框
					format : "yyyy-mm-dd",// 日期格式，详见
					todayHighlight : true,
					startDate : GetDateStr('+1d')

				})
			}

		})
	    // 设置日期
	    function GetDateStr(AddDayCount) {
	    	var dd = new Date();
	    	dd.setDate(dd.getDate() + AddDayCount);// 获取AddDayCount天后的日期
	    	var y = dd.getFullYear();
	    	var m = dd.getMonth() + 1;// 获取当前月份的日期
	    	var d = dd.getDate();
	    	return y + "-" + m + "-" + d;
	    }

	}
	$.fn.setTimeMehod();
	//校验离开窗口前是否进行保存
	$.fn.tipsLeftWindow = function(){
		$(window).bind('beforeunload',function(){
			 var result = true;
			 var el = $(".form-control").not("#endTime").not("#belongCourse");
			 el.each(function(){
					if($.trim($(this).val()) != ""){
						    result = false;
							return false;
					}
				})
				if(!result){
					 return '您输入的内容尚未保存，确定离开此页面吗？';
				}

	   });

	}


})(jQuery)

