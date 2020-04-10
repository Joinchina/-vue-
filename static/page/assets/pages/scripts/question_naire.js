(function(){
/*
** author:jiajunyan
** data:20170626
** plugins description:
   $(".content").QuestionObj({
		animate:true, //是否进行上移，下移
		editor:false,//是否为编辑页面
		sectionNum:0,//默认数据条数，默认为$(".item_width").length为value
		addAlmostNum:40,//最多添加题目数量
		callback:function(html,thisId){}//回调当前的html以及当前的id,可进行样式修改
	});
*/
function QuestionObj() {
	this.data = [
		{"letter":"A"},
		{"letter":"B"},
		{"letter":"C"},
		{"letter":"D"}
	];
	this.defaults = {
		animate:true,
		addAlmostNum:0
	}
}

QuestionObj.prototype.init =  function(opts){
	var opts = $.extend(this.defaults,opts);
	//初始化数据,追加至文档中
	// if(!opts.editor){
	// 	$(".content").html(this.createProblem(opts.sectionNum));
	// }
	//添加、删除选项
	this.addOptions(opts);

	//添加、删除问题
	this.addQuestion(opts);
	//删除整个标题
	this.delAllitem(opts);
	//上移下移
	if(opts.animate){
		this.moveMehod(opts);
	}
	//单选
	if(opts.animate){
		var sections = $(".content").find(".item_width");
		for(var i = 0;i < sections.length; i++){
			this.typeRadio(opts,"#item_"+i+"");
		}

	}
}

QuestionObj.prototype.typeRadio = function(opts,item){
	var sections = $(item);
	//单选多选问答
	var li = sections.find(".type").children().find("li.type_one");
	li.click(function(){
		$(this).removeClass("multi_nomal");
		$(this).addClass("multi_cur").siblings("li.type_one").removeClass("multi_cur").addClass("multi_nomal");
		var titleChoose = $(this).parents("div.type").prev("div.qu_width").find("input.titleChoose");
		if($(this).text() == "问答题"){
//			titleChoose.attr("maxlength","200");
//			titleChoose.attr("placeholder","请输入题目（200字以内）");
			$(this).parents("div.type").siblings("dl").css("display","none");
		}else{
//			titleChoose.attr("maxlength","100");
//			titleChoose.attr("placeholder","请输入题目（100字以内）");
//			var thisdata = titleChoose.val();
//			if(thisdata.length > 100){
//				var valSub = thisdata.substring(0,100);
//				titleChoose.val(valSub);
//			}
			$(this).parents("div.type").siblings("dl").css("display","block");
		}
	})
	//必答选答
	var li = sections.find(".type").children().find("li.type_two");
	li.click(function(){
		$(this).removeClass("n_nomal");
		$(this).addClass("n_cur").siblings("li.type_two").removeClass("n_cur").addClass("n_nomal");
	})
}

QuestionObj.prototype.addOptions = function(opts){
	if(opts.editor){
		for(var i = 0;i <= opts.sectionNum; i++){
			var lastInput = $("#item_"+i+"").find(".addInput").length - 1;
			var addInput =  $("#item_"+i+"").find(".addInput");
			var zmArray = ["A","B","C","D","E","F","G","H","I","J"];
			clicks(lastInput,addInput,zmArray);
		}
	}else{
		var lastInput = $("#item_"+opts.sectionNum+"").find(".addInput").length - 1;
		var addInput =  $("#item_"+opts.sectionNum+"").find(".addInput");
		var zmArray = ["A","B","C","D","E","F","G","H","I","J"];
		clicks(lastInput,addInput,zmArray);
	}

function clicks(lastInput,addInput,zmArray){
		//最多增加10条数据
	var mostNum = 10;
	//至少两条数据,即0开始
	var lest = 1;

	addInput.each(function(index,item){
		//获得删除对象
		var del = $(this).parents("dd").next("dd").find(".del");
		//清除click缓存
		$(this).unbind("focus").focus(function(){
			//lastInput = $("#item_"+QuestionObj.sectionNum+"").find(".addInput").length - 1;
			//判断当前索引，即在某个模块
			var curItemClass = $(this).parents("section").attr("id");
			var curindex = curItemClass.substr(curItemClass.indexOf("_")+1);
			//点击当前位置判定
			opts.sectionNum = curindex;
			if(index == mostNum - 1){
				if (window.toastr) {
					window.toastr.error("最多只能添加10个");
				}
				//$(this).parents("section.item_width").find("div.errorMsg").text("最多只能添加10个");
				return;
			}
			if(index == lastInput){
				$(this).parents("dl").after(CreateInput(index));
				QuestionObj.addOptions(opts);
			}
		})
		//删除当前标题
		del.unbind("click").click(function(){
			//lastInput = $("#item_"+QuestionObj.sectionNum+"").find(".addInput").length - 1;
			//判断当前索引，即在某个模块
			var curItemClass = $(this).parents("section").attr("id");
			var curindex = curItemClass.substr(curItemClass.indexOf("_")+1);
			//点击当前位置判定
			opts.sectionNum = curindex;
			if(lastInput == 1){
				if (window.toastr) {
					window.toastr.error("至少要有两条数据!");
				}
				return;
			}

			$(this).parents("dl").remove();
			var letters =  $("#item_"+opts.sectionNum+"").find(".letter");
			letters.each(function(i,name){
				$(this).text(zmArray[i]);
			})
			QuestionObj.addOptions(opts);

		})
		//使用enter键进入下个input
		$(this).keypress(function(event){
			//alert(event.keyCode);
			if(event.keyCode == 13){

				focusNextInput(this);
			}
		})

	})
	}

	function focusNextInput(_this){

		var addInput =  $("#item_"+opts.sectionNum+"").find(".addInput");
		for(var i = 0; i < addInput.length; i++){
			if(i == 9){
				return;
			}
			if(_this == addInput[i]){
				 addInput[i+1].focus();
                 break;
			}
		}
	}
	function CreateInput(index){
		var index = index + 1;
		var html = '<dl class="clearfix">'+
					'<dt><span class="letter">'+zmArray[index]+'</span></dt>'+
					'<dd class="qu_width_t"><input type="text" class="form-control  rg_input_h addInput js-text" placeholder = "请输入选项（50字以内）" maxlengths="50"></dd>'+
					'<dd><input type="button" class="del"></dd>'+
				'</dl>';
		//var html = '<div class="items"><span class="letter">'+zmArray[index]+'</span><input type = "text" class="addInput"/><a href="javascript:void(0)" class="del">删除</a></div>';
		return html;
	}
}
QuestionObj.prototype.moveMehod = function(opts){
	$(".content").clickSort({
		opts:opts,
		speed:300,
		callback:function(){
　　　　    QuestionObj.sortIndex();
　　    }
	});
}

QuestionObj.prototype.sortIndex = function(){
		var section = $(".content").find("section");
		section.each(function(i,name){
				if(i == section.length - 1){
					return false;
				}
				$(this).remove("id");
				$(this).attr("id","item_"+i+"");
				$(this).find(".number").text(i+1);
		})
}
QuestionObj.prototype.createProblem = function(number,opts){
		var str = "";
		str +='<section class="con item_width" id = "item_'+number+'">';
		str +='<div class="qu_width">';
		str	+=	'<div class="pull-right">';
		str	+=		'<a href="javascript:void(0)" class="btn_delete delItem"></a>';
		str	+=		'<a href="javascript:void(0)" class="btn_moveup moveup">上移</a>';
		str	+=		'<a href="javascript:void(0)" class="btn_moveup mg_none movedown">下移</a>';
		str	+=	'</div>';
		str	+=	'<span class="index">Q<span class = "number">'+(number + 1)+'</span></span>';
		str	+=	'<div class="question"><input type="text" class="form-control rg_input_h titleChoose js-text"  placeholder = "请输入题目（500字以内）" maxlengths="500"></div>';
		str	+= '</div>';
		str	+= '<div class="type">';
		str	+=	'<ul class="clearfix">';
		str	+=		'<li class="multi_cur type_one">单选题</li>';
		str	+=		'<li class="multi_nomal type_one">多选题</li>';
		str	+=		'<li class="multi_nomal six68_l type_one">问答题</li>';
		str	+=		'<li class="line"></li>';
		str	+=		'<li class="n_cur six68_r type_two">必答</li>';
		str	+=		'<li class="n_nomal type_two">选答</li>';
		str	+=	'</ul>';
		str	+= '</div>';
		str	+=	'<dl class="clearfix">';
		str	+=	  '<dt><span class="letter">A</span></dt>';
		str	+=		'<dd class="qu_width_t"><input type="text" class="form-control  rg_input_h addInput js-text"  placeholder = "请输入选项（50字以内）" maxlengths="50"></dd>';
		str	+=		'<dd><input type="button" class = "del"></dd>';
		str	+=	'</dl>';
		str	+=	'<dl class="clearfix">';
		str	+=	 '<dt><span class="letter">B</span></dt>';
		str	+=		'<dd class="qu_width_t"><input type="text" class="form-control  rg_input_h addInput js-text"  placeholder = "请输入选项（50字以内）" maxlengths="50"></dd>';
		str	+=		'<dd><input type="button" class = "del"></dd>';
		str	+=	'</dl>';
		str	+=	'<dl class="clearfix">';
		str	+=		'<dt><span class="letter">C</span></dt>';
		str	+=		'<dd class="qu_width_t"><input type="text" class="form-control  rg_input_h addInput js-text"  placeholder = "请输入选项（50字以内）" maxlengths="50"></dd>';
		str	+=		'<dd><input type="button" class = "del"></dd>';
		str	+=	'</dl>';
		str	+=	'<dl class="clearfix">';
		str	+=	 '<dt><span class="letter">D</span></dt>';
		str	+=		'<dd class="qu_width_t"><input type="text" class="form-control  rg_input_h addInput js-text"  placeholder = "请输入选项（50字以内）" maxlengths="50"></dd>';
		str	+=		'<dd><input type="button" class = "del"></dd>';
		str	+=	'</dl>';

		str	+= '</section>';
		return str;
}
QuestionObj.prototype.addQuestion = function(opts){
	$("#addQuestion").unbind("click").bind("click",function(){
		if(opts.sectionNum == (opts.addAlmostNum - 1)){
			if (window.toastr) {
				window.toastr.error("最多只能添加"+opts.addAlmostNum+"道题");
			}
			return;
		}
		//sectionNum当前判定后进行重置
		opts.sectionNum = $(".content").find("section").length-1;
		opts.sectionNum++;
		$(".content").append(QuestionObj.createProblem(opts.sectionNum,opts));
		if(opts.callback != undefined){
			opts.callback(QuestionObj.createProblem(opts.sectionNum,opts),"item_"+opts.sectionNum+"");
		}
		QuestionObj.addOptions(opts);
		if(opts.animate){
			QuestionObj.typeRadio(opts,"#item_"+opts.sectionNum+"");
		}
	})

}


//删除整个标题
QuestionObj.prototype.delAllitem = function(opts){
	$(".content").off("click").on("click",".delItem",function(){
		var length = $(".content").find("section").length;
		if(length == 1){
			if (window.toastr) {
				window.toastr.error("至少要有一条数据!");
			}
			return;
		}
		$(this).parents("section").remove();
		//标题按顺序排序
		opts.sectionNum--;
		QuestionObj.delAll();
	})
}

QuestionObj.prototype.delAll = function(){
	$(".number").each(function(i,name){
		$(this).text(i+1);
		$(this).parents("section").attr("id","item_"+i+"")
	})
}


var QuestionObj = new QuestionObj();

$.fn.QuestionObj = function(opts){
	QuestionObj.init(opts);
}

//交换位置动画
$.fn.clickSort = function(opts){
    var defaults = {
        speed:200
    }
    var option = $.extend(defaults,opts);

    this.each(function(){
      var _this = $(this);
      _this.on('click','.moveup',function(){
        var parent = $(this).parents('section');
        var prevItem = parent.prev('section');
        //存储value
        if(opts.opts.animate){
        	 storageVal(parent);
        }
        if(prevItem.length == 0){
        	if (window.toastr) {
				window.toastr.error("不能进行上移");
			}
        	return;
        }
        var parentTop = parent.position().top;
        var prevItemTop = prevItem.position().top;
        parent.css('visibility','hidden');
        prevItem.css('visibility','hidden');
        parent.clone().insertAfter(parent).css({position:'absolute',visibility:'visible',top:parentTop,width:"76.9%"}).animate({top:prevItemTop},option.speed,function(){
          $(this).remove();
          parent.insertBefore(prevItem).css('visibility','visible');
          option.callback();
          });
        prevItem.clone().insertAfter(prevItem).css({position:'absolute',visibility:'visible',top:prevItemTop,width:"76.9%"}).animate({top:parentTop},option.speed,function(){
          $(this).remove();
          prevItem.css('visibility','visible');
          });
        });
      _this.on('click','.movedown',function(){
        var parent = $(this).parents('section');
        var nextItem = parent.next('section');
        //存储value
        if(opts.opts.animate){
        	storageVal(parent);
    	}
        if(nextItem.length == 0){
        	if (window.toastr) {
				window.toastr.error("不能进行下移");
			}
        	return;
        }
        var parentTop = parent.position().top;
        var nextItemTop = nextItem.position().top;
        parent.css('visibility','hidden');
        nextItem.css('visibility','hidden');
        parent.clone().insertAfter(parent).css({position:'absolute',visibility:'visible',top:parentTop,width:"76.9%"}).animate({top:nextItemTop},option.speed,function(){
          $(this).remove();
          parent.insertAfter(nextItem).css('visibility','visible');
          option.callback();
          });
        nextItem.clone().insertAfter(nextItem).css({position:'absolute',visibility:'visible',top:nextItemTop,width:"76.9%"}).animate({top:parentTop},option.speed,function(){
          $(this).remove();
          nextItem.css('visibility','visible');
          });
        });


      });
       function storageVal(_this){
        	var addInput = $(_this).children().find(".addInput");
        	addInput.each(function(index,item){
        		if($(this).val() != ""){
        			$(this).val($(this).val());
        		}
        	})
        }
  }
})(jQuery)
