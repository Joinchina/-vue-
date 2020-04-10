// import { host } from 'components/global/open'
import $ from 'jquery'
export function keys () {
	if (!Object.keys) Object.keys = (function() {
	  var hasOwnProperty = Object.prototype.hasOwnProperty,
	    hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
	    dontEnums = [ 'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor' ],
	    dontEnumsLength = dontEnums.length;
	    return function(obj) {
	      if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null)
	        throw new TypeError('Object.keys called on non-object');
	      var result = [];
	      for(var prop in obj) {
	        if (hasOwnProperty.call(obj, prop)) result.push(prop);
	      }
	      if (hasDontEnumBug) {
	        for(var i=0; i < dontEnumsLength; i++) {
	          if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
	        }
	      }
	      return result;
	    }
	  }
	)();
}

// 洗牌
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

// localStorage 设置过期时间
export function setLocalStorage(key, value) {
    var curTime = new Date().getTime();
    localStorage.setItem(key, JSON.stringify({data: value, time:curTime}));
}
// exp 单位毫秒
export function getLocalStorage(key, exp) {
    // exp 单位秒
    exp = exp*1000 || 60*60*24*30*1000;
    var data = localStorage.getItem(key);
    if (data) {
        var dataObj = JSON.parse(data);
        var newTime = new Date().getTime();
        if (newTime - dataObj.time > exp) {
            // console.log('信息已过期');
            localStorage.clear();
        } else {
            var dataObjDatatoJson = dataObj.data;
            return dataObjDatatoJson;
        }
    }

}


// 获取地址栏参数
export function getQueryString (name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
//获取路径
export function host(){
  var url = window.location.host;
  if(url.indexOf("http") > 0){
    url = url;
  }else{
    url ="http://"+url;
  }
  return url;
}

//截取字符串，多余...
export function cutstr(str, len) {
  var str_length = 0;
  var str_len = 0;
  var str_cut =  new String();
  //str_cut = new String();
  if(!!str){
      str_len = str.length;
      for (var i = 0; i < str_len; i++) {
        var a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
          //中文字符的长度经编码之后大于4
          str_length++;
        }
        str_cut = str_cut.concat(a);
        if (str_length >= len) {
          str_cut = str_cut.concat("...");
          return str_cut;
        }
      }
      //如果给定字符串小于指定长度，则返回源字符串；
      if (str_length < len) {
        return str;
      }
  }

}

export function wordlimit(cname, wordlength) {
  var cname=document.getElementsByClassName(cname);
　 for(var i=0;i<cname.length;i++){
　　　　var nowLength=cname[i].innerHTML.length;
　　　　if(nowLength>wordLength){
　　　　　　cname[i].innerHTML=cname[i].substr(0,wordlength)+' . . . ';
　　　　}

　　}　
  return cname;
};

export function D3round(word){        
				let tagEle = "querySelectorAll" in document ? document.querySelectorAll(".tag") : getClass("tag");
        let paper = "querySelectorAll" in document ? document.querySelector(".tagBall") : getClass("tagBall")[0];
				let RADIUS = 350;
				let fallLength = 820;
				let tags = [];
				let angleX = Math.PI / 1000;
				let angleY = Math.PI / 800;
				let CX = paper.offsetWidth / 2;
				let CY = paper.offsetHeight / 2;
				let EX = paper.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft;
				let EY = paper.offsetTop + document.body.scrollTop + document.documentElement.scrollTop; 
				//定时器
				let timer =null;
				for (let index = 0; index < tagEle.length; index++) {
					tagEle[index].onmouseenter=function(){
						clearInterval(timer)
					}
					tagEle[index].onmouseleave=function(){
						animate();
					}	
				}
				function getClass(className) {
					var ele = document.getElementsByTagName("*");
					var classEle = [];
					for (var i = 0; i < ele.length; i++) {
						var cn = ele[i].className;
						if (cn === className) {
							classEle.push(ele[i]);
						}
					}
					return classEle;
				}
				
				function innit() {
					for (var i = 0; i < tagEle.length; i++) {
						var a, b;
						var k = -1 + (2 * (i + 1) - 1) / tagEle.length;
						var a = Math.acos(k);
						var b = a * Math.sqrt(tagEle.length * Math.PI);
						var x = RADIUS * Math.sin(a) * Math.cos(b);
						var y = RADIUS * Math.sin(a) * Math.sin(b);
						var z = RADIUS * Math.cos(a);
						var t = new tag(tagEle[i], x, y, z);
						// tagEle[i].style.color = "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")";
						tags.push(t);
						t.move();
					}
				}
				Array.prototype.forEach = function(callback) {
					for (var i = 0; i < this.length; i++) {
						callback.call(this[i]);
					}
				}
				
				function animate() {
					clearInterval(timer)
          timer=	setInterval(function() {
						rotateX();
						rotateY();
						tags.forEach(function() {
							this.move();
						})
          },100)
				}
				if ("addEventListener" in window) {
					paper.addEventListener("mousemove", function(event) {
						var x = event.clientX - EX - CX;
						var y = event.clientY - EY - CY;
						angleY = x * 0.0001;
						angleX = y * 0.0001;
					});
				} else {
					paper.attachEvent("onmousemove", function(event) {
						var x = event.clientX - EX - CX;
						var y = event.clientY - EY - CY;
						angleY = x * 0.0001;
						angleX = y * 0.0001;
					});
				}
				
				function rotateX() {
					var cos = Math.cos(angleX);
					var sin = Math.sin(angleX);
					tags.forEach(function() {
						var y1 = this.y * cos - this.z * sin;
						var z1 = this.z * cos + this.y * sin;
						this.y = y1;
						this.z = z1;
					})
				
				}
				
				function rotateY() {
					var cos = Math.cos(angleY);
					var sin = Math.sin(angleY);
					tags.forEach(function() {
						var x1 = this.x * cos - this.z * sin;
						var z1 = this.z * cos + this.x * sin;
						this.x = x1;
						this.z = z1;
					})
				}
				var tag = function(ele, x, y, z) {
					this.ele = ele;
					this.x = x;
					this.y = y;
					this.z = z;
				}
				tag.prototype = {
					move: function() {
						var scale = fallLength / (fallLength - this.z);
						var alpha = (this.z + RADIUS) / (2 * RADIUS);
						this.ele.style.fontSize = 40 * scale + "px";
						this.ele.style.opacity = alpha + 0.1;
						this.ele.style.filter = "alpha(opacity = " + (alpha + 0.1) * 100 + ")";
						this.ele.style.zIndex = parseInt(scale * 100);
						this.ele.style.left = this.x + CX - this.ele.offsetWidth / 2 + "px";
						this.ele.style.top = this.y + CY - this.ele.offsetHeight / 2 + "px";

					}
				}
				innit();
				animate();
}








