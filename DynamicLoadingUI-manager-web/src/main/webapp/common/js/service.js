//接口请求服务
function RequestService() {
	//接口url
	//this.baseUrl = "http://localhost:8080/gift-fly/";
	this.baseUrl ="/gift-fly/";
};
RequestService.prototype = {
	//get 提交
	ajaxRequestGet: function(lastPath, requestParams, successFun, errorFun) {
		$.ajax({
			headers: {},
			async: false,
			url: this.baseUrl+lastPath,
			type: "get",
			dataType: 'json',
			data: requestParams,
			success: function(data) {
				successFun(data);
			},
			error: function(data) {
				errorFun(data);
			}
		});
	},
	ajaxRequestPost: function(lastPath, requestParams, successFun, errorFun) {
		$.ajax({
			headers: {
				//		            'GISTTOKEN': getToken()
			},
			url: this.baseUrl+lastPath,
			type: "post",
			data: requestParams,
			success: function(data) {
				successFun(data);
			},
			error: function(data) {
				errorFun(data);
			}
		});
	},
	ajaxSubmit: function(lastPath, fromId, successFun, errorFun) {
		var option = {
			url: lastPath,
			type: 'POST',
			dataType: 'json',
			data: {},
			headers: {
				"ClientCallMode": "ajax"
			}, //添加请求头部
			beforeSubmit: function() {
				
			},
			beforeSend: function() {
				var percentVal = '0%';
				console.log("percentVal"+percentVal);
//				bar.width(percentVal)
//				percent.html(percentVal);
			},
			uploadProgress: function(event, position, total, percentComplete) { //上传的过程
				//position 已上传了多少
				//total 总大小
				//已上传的百分数
				var percentVal = percentComplete + '%';
				
				$("#percentVal2").width(percentVal);
				console.log(percentVal, position, total);
			},
			success: function(data) {
				successFun(data)
			},
			error: function(data) {
				errorFun(data)
			}
		};
		$("#" + fromId).ajaxSubmit(option);
		return false; //最好返回false，因为如果按钮类型是submit,则表单自己又会提交一次;返回false阻止表单再次提交
	}
};

//设置自定义过期时间cookie
function setCookie(name, value, time) {
	localStorage.setItem(name, value); //存储数据 
	//var msec = getMsec(time); //获取毫秒
	//    var exp = new Date();
	//    exp.setTime(exp.getTime() + time);
	//    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

//读取cookies
function getCookie(name) {
	return localStorage.getItem(name); //读取数据 
	//    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); //正则匹配
	//    if(arr=document.cookie.match(reg)){
	//      return unescape(arr[2]);
	//    }
	//    else{
	//     return null;
	//    }
}

//Window.localStorage.clear();//删除所有数据 

//删除cookies
function delCookie(name) {
	//  var exp = new Date();
	//  exp.setTime(exp.getTime() - 1);
	//  var cval=getCookie(name);
	//  if(cval!=null){
	//    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	//  }
	localStorage.removeItem(name); //删除数据项 
}