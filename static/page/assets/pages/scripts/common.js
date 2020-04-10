//拆分search
	$.fn.splitSearchMethod = function(){
		var obj = {};
		var paperIdSearch = location.search;
		var paperIdSearchQud = paperIdSearch.substring(paperIdSearch.indexOf("?")+1);
		var paperIdArry = paperIdSearchQud.split("&");
		for(var i = 0; i < paperIdArry.length;i++){
			paperIdArry[i] = paperIdArry[i].split("=");
			obj[paperIdArry[i][0]] = paperIdArry[i][1];
		}
		return obj;
	}
	//获取host路径
	function host(){
		var url = window.location.host;
		if(url.indexOf("http") > 0){
			url = url;
		}else{
			url ="http://"+url;
		}
		return url;
	}
    function devlopMent(){
		var virement = "";
		if(host().indexOf('sxb.com') > -1){
			virement = "https://sxb.com/#"
		}else if(host().indexOf('10.98.24.67') > -1){
      		virement = "https://10.98.24.67/index.html#"
    	}else if(host().indexOf("shixunbao.cn:8081") > -1){
			virement="https://mgr.shixunbao.cn:8081/#"
		}else if(host().indexOf("shixunbao.cn")>-1){
			virement="https://mgr.shixunbao.cn/#"
		}
		return virement;
	}
function api() {
  var api = "";
  if(host().indexOf("10.98.24.85") > -1 || host().indexOf("sxb.com") > -1){
    api = "/api";
  }
  return api;

}
