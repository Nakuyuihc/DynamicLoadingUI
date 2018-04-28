


$(document).ready(function() {
	var wxcode = GetRequest(); 
	console.log(wxcode['code']);
	
	$.ajax({
		headers: {},
		async: false,
		url: 'http://localhost:8080/gift-fly/cis/wechat/oauth2AccessToken',
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
});
var wx_shareTitle = "【碧桂园豪园七夕节】牛郎织女带你赢豪礼";
var wx_shareDesc = "【碧桂园豪园七夕节】牛郎织女带你赢豪礼";
var wx_shareIcon = "http://logincheck.fzsms.cn/bgynlzn/images/start.jpg";
var wx_shareUrl = "http://logincheck.fzsms.cn/bgynlzn/info.html";

//--------------------------------------------------------------微信初始化-------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
var shareAPPId = "wxc59fd70b0d924740";
function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串 
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}
function signJS_API() {
	var page_url = location.href.split('#')[0];
	var requestParams = {
		url : page_url,
		ticket : (new Date()).getTime()
	};
	$.ajax({
		url : 'http://localhost:8080/gift-fly/cis/wechat/signwechat',
		type : "post",
		data : requestParams,
		success : function(data) {
			//调用成功后的结果处理
			if (data.success) {
				if (data.signature) {
					wx.config({
						debug : false,
						appId : data.appId,
						timestamp : data.timestamp,
						nonceStr : data.nonceStr,
						signature : data.signature,
						jsApiList : [
							'checkJsApi',
							'onMenuShareTimeline', //分享到朋友圈
							'onMenuShareAppMessage', //分享给好友
							'hideMenuItems',
							'showMenuItems',
							'hideOptionMenu',
							'showOptionMenu',
							'getNetworkType',
							'previewImage'
						]
					});

					//微信JS_SDK初始化
					wx.ready(function() {
						//显示右上角菜单
						//document.getElementById('bgmusic').play();

						//判断当前版本是否支持指定 JS 接口
						//							wx.checkJsApi({
						//							  jsApiList: [
						//								'getNetworkType',
						//								'previewImage'
						//							  ],
						//							  success: function (res) {
						//								alert(JSON.stringify(res));
						//							  }
						//							});

						//分享给朋友
						wx.onMenuShareAppMessage({
							title : wx_shareTitle,
							desc : wx_shareDesc,
							link : wx_shareUrl,
							imgUrl : wx_shareIcon,
							trigger : function(res) {
								// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
								//alert('用户点击发送给朋友');
							},
							success : function(res) {
								toShareTimeLine();
							},
							cancel : function(res) {
								//alert('已取消');
							},
							fail : function(res) {
								//alert(JSON.stringify(res));
							}
						});

						//分享到朋友圈
						wx.onMenuShareTimeline({
							title : wx_shareTitle,
							link : wx_shareUrl,
							imgUrl : wx_shareIcon,
							trigger : function(res) {
								// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
								//alert('用户点击分享到朋友圈');
							},
							success : function(res) {
								toShareTimeLine();
							},
							cancel : function(res) {
								//alert('已取消');
							},
							fail : function(res) {
								//alert(JSON.stringify(res));
							}
						});
					});
				}
			}
		},
		error : function(data) {
			errorFun(data);
		}
	});
}


//分享功能
function toShareTimeLine() {
	Ext.Ajax.request({
		url : '../webs/ajaxZMC_HBDZPShareTimeline.action',
		params : {
			'tmp' : (new Date()).getTime()
		}, //参数列表
		success : function(response, opts) { //调用成功后的结果处理

			var obj = Ext.decode(response.responseText);
			if (obj.status == "ok") { //分享成功
				//alert(obj.msg);
				swal("温馨提示", obj.msg, "success");
			}
		},
		failure : function(response, opts) { //调用失败后的处理
			//alert('网络连接失败，请检查网络是否连接良好！');
		}
	});
}

function backFunction() {
	window.location = "info.html";
}
(function() {
	var calc = function() {
		var docElement = document.documentElement;
		var clientWidthValue = docElement.clientWidth;
		docElement.style.fontSize = 10 * (clientWidthValue / 320) + 'px';
	}
	calc();
	window.addEventListener('resize', calc);
})();