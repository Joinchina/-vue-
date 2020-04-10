
var CreateVote = {
	openmode: 'TIMING',
	init: function(){
		var _this = this;
		$("#back").click(function(){
			var clazzId = $.fn.splitSearchMethod()["clazzId"];
			var courseId = $.fn.splitSearchMethod()["courseId"];
			var type =  $.fn.splitSearchMethod()["type"];
			if(type == "task"){
			    window.location.href = devlopMent()+"/course/task?clazzId="+clazzId;
			}else{
				window.location.href = devlopMent()+"/course/detail?clazzId="+clazzId+"&courseId="+courseId;
			}
		})
		//_this.getCourse();
		_this.bindEle();

		$("input[name='openmode'][value='TIMING']").attr("checked",true); 

		


	},
	bindEle:function(){
		var _this = this;
		$("body").on('click', '#savePublish', _this.releaseVote);
	},
	// getCourse: function() {
	// 	$.ajax({
	// 		type:"GET",
	// 		url:"/course/getList.json",
	// 		dataType: "json",
	// 		success: function(res){
	// 			console.log(res);

	// 			var options = "<option id = 'default'>请选择</option>";
	// 			$.each(res, function(index,obj){
	// 				options +='<option value="'+obj.id+'">'+obj.name+'</option>';
	// 			});
	// 			$("#belongCourse").append(options);

	// 		},
	// 		error: function(){
	// 			console.log("请求错误");
	// 		}
	// 	});
	// },
	errorMessag:function(txt){
		var div = "<div class = 'errorMessag'>"+txt+"</div>";
		return div;
	},

		
	releaseVote: function(){
		//阻止出现离开页面层
	    $(window).unbind("beforeunload");
		var _this = this,
		    title = $.trim($("#title").val()),
		    courseId = $("#belongCourse").val(),
		    flag = true,
        lessTwoFlag = true,
		    newArray = [],
		    questions = [];
		     //班级id
		 var clazzId = $.fn.splitSearchMethod()["clazzId"];
		//课程id
	     var courseId = $.fn.splitSearchMethod()["courseId"];
	     var csrf_token = $.fn.splitSearchMethod()["token"];
		//		限制标题和课程必填
		if(!title) {
			$("#title").next("div.errorMessag").text("请输入投票标题");
			$("#belongCourse").next("div.errorMessag").text("");
			return;
		}else{
	      //字数限制判断,标题
	      var length = $("#title").val().length;
	      if(length >= 50){
	        $("#title").next("div.errorMessag").text("标题不能超过50字");
	        $("#belongCourse").next("div.errorMessag").text("");
	        return;
	      }
	    }
		if(courseId == "请选择"){
			$("#belongCourse").next("div.errorMessag").text("请选择所属课程");
			$("#title").next("div.errorMessag").text("");
			return;
		}
		$('.item_width').each(function(index,item) {
			var selections = [];
			itemArray = 0;
			var obj = [];
			var addInput = $(item).find(".addInput");
			var quesTitle = $.trim($(item).find(".titleChoose").val());
			var titleChoose = $(item).find(".titleChoose");

			if( $.trim(titleChoose.val()) == ""){
				var $thisId = $(this).attr("id");
				var txt = "请输入问题标题";
				$(".errorMessag").remove();
				titleChoose.after(CreateVote.errorMessag(txt));
				flag = false
				return false;
			}else{
		        //题目字数限制
		        var length = $(item).find(".titleChoose").val().length;
		        if(length >= 500){
		          $(item).find(".titleChoose").next("div.errorMessag").text("题目不能超过500字");
		          flag = false;
		          return false;
		        }
		    }
			addInput.each(function(index,item){
				if($.trim($(this).val()) != ""){
		          var length = $(this).val().length;
		          if(length >= 50) {
		            //清除 title 的空
		            $(this).next("div.errorMessag").text("选项不能超过50字");
		            titleChoose.next("div.errorMessag").text("");
		            lessTwoFlag = false;
		            flag = false;
		            return false;
		          }
		          obj.push($(this).val());
		          selections.push($(this).val());
		          itemArray++;


				}
			})
			newArray.push(obj);
			//问答题忽略此校验
			if($(this).find("dl").css("display") == "block"){
				//至少每个选项选择两题
		        if(lessTwoFlag){
		          if(itemArray < 2){
		            var $thisId = $(this).attr("id");
		            var txt = "当前问题至少需要设置两个不同的选项。";
		            $(".errorMessag").remove();
		            titleChoose.after(CreateVote.errorMessag(txt));
		            flag = false;
		            return false;

		          }
		        }

			}
			for(var i = 0; i < newArray.length; i++){
				//判断问题不能重复
				if(isRepeat(newArray[i])){
					var $thisId = $(this).attr("id");
					var txt = "任意两个选项内容不能重复";
					$(".errorMessag").remove();
					titleChoose.after(CreateVote.errorMessag(txt));
					flag = false;
					return false;
				}
			}



		    questions[index] = {};
		    questions[index].question = quesTitle;
		    questions[index].required = true;
		    questions[index].type = "SELECT";
		    questions[index].selections = selections;
		});

		var openmode = $('input[name="openmode"]:checked').val();

		var data = {
			courseId: courseId,
			clazzId:clazzId,
			title:title,
			questions:questions,
			status: "PUBLISH",
		    type: "VOTE",
		    openMode: openmode,
		}
		console.log("data", data, openmode);

		if(!flag){
			//有错误信息
		}else{
			$(".errorMessag").remove();
	      	deleteConfirm(function (){
	        	CreateVote.ajaxSub(data,csrf_token,clazzId);
	      	})

		}

	    function deleteConfirm(callback){
	      bootbox.confirm({
	        message:"发布投票后不能修改，是否确认发布？",
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

	ajaxSub: function(data,csrf_token,clazzId) {
		//token
		$.ajax({
			type:"POST",
			contentType:"application/json",
			url:api() + "/questionpaper/saveQuestionPaper",
			data:JSON.stringify(data),
			dataType: "json",
			headers: {
				"Authorization":csrf_token
			},
			success: function(res) {
				//var paperId = res.data.identification;
				if(res.status == 200) {
          var type =  $.fn.splitSearchMethod()["type"];
          var courseId = $.fn.splitSearchMethod()["courseId"];
          if(type == "task"){
            window.location.href = devlopMent()+"/course/task?clazzId="+clazzId;
          }else{
            window.location.href = devlopMent()+"/course/detail?clazzId="+clazzId+"&courseId="+courseId;
          }

				}
				if(res.status == 205) {
					alert(res.message);
				}
			},
			error: function(){
				console.log("请求错误");
			}
		});
	}

}

$(function(){
	CreateVote.init();
});
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
