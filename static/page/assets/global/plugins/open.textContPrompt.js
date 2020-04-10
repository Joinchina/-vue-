(function(){
	$.fn.textContPromt = function(){
		//创建div
		var divCreate = function(_this){
			var div = "<div class ='errorMessag'></div>";
			if(_this.next("div.errorMessag").length == 0){
				_this.after(div);
			}
		}
		//执行方法
		var count = function(){
				var elem = $(this);
				var maxNumber = $(this).attr("maxlengths");
				divCreate($(this));
				var typeMsg = "";
				var valLength = $.trim(elem.val()).length;
				var valCur = elem.attr("placeholder");

				if(valCur.indexOf("标题") > -1){
					typeMsg = "标题";
				}else if(valCur.indexOf("问卷说明") > -1){
					typeMsg = "描述"
				}else if(valCur.indexOf("题目") > -1){
					typeMsg = "题目"
				}else{
					typeMsg = "选项"
				}
				//只有字数限制时时进行校验，其他均是保存进行校验；
				if(valLength >= maxNumber){
						var errorMessag = typeMsg +"不能超过" + maxNumber+"字";
						elem.next("div.errorMessag").text(errorMessag);	
				}else{
						elem.next("div.errorMessag").text("");
				}
				
				
		}
		$(".js-text").each(function(index,item){
			divCreate($(this));
		})
		$(".question_content").on("keyup change",".js-text",count)
			
	}
	$.fn.textContPromt();
})(jQuery)