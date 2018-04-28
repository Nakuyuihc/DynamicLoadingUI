/***
 * @param {string} cookieName Cookie名称
 * @param {string} cookieValue Cookie值
 * @param {number} nDays Cookie过期天数
 */
function setCookie(cookieName, cookieValue, nDays) {
	/*当前日期*/
	var today = new Date();
	/*Cookie有效时间*/
	var validTime = new Date();
	/*如果未设置nDays参数或者nDays为0，取默认值1*/
	if (nDays == null || nDays == 0) {
		nDays = 1
	}
	;
	/*计算Cookie有效时间*/
	validTime.setTime(today.getTime() + 3600000 * 24 * nDays);
	/*设置Cookie值*/
	document.cookie = cookieName + "=" + escape(cookieValue)
	+ ";validTime=" + validTime.toGMTString();
}
/***
*读取指定的Cookie值
*@param {string} cookieName Cookie名称
*/
function ReadCookie(cookieName) {
	var theCookie = "" + document.cookie;
	var ind = theCookie.indexOf(cookieName);
	if (ind == -1 || cookieName == "") {
		return "";
	}
	var ind1 = theCookie.indexOf(';', ind);
	if (ind1 == -1) {
		ind1 = theCookie.length;
	}
	/*读取Cookie值*/
	return unescape(theCookie.substring(ind + cookieName.length + 1, ind1));
}

/**
 * 删除指定cookie
 * @param name cookie名称
 */
function delCookie(name) { //为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间 
	var date = new Date();
	date.setTime(date.getTime() - 10000);
	document.cookie = name + "=a; expires=" + date.toGMTString();
}

//格式化时间
function formatTime(date) {
	date = new Date(date);
	var datetime = date.getFullYear()
	+ "-" // "年"
	+ ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : "0"
	+ (date.getMonth() + 1))
	+ "-" // "月"
	+ (date.getDate() < 10 ? "0" + date.getDate() : date
		.getDate()) //日
	+ " "
	+ (date.getHours() < 10 ? "0" + date.getHours() : date
		.getHours())
	+ ":"
	+ (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
		.getMinutes())
	+ ":"
	+ (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
		.getSeconds());
	return datetime;
}

//将提示框的英文换成中文
jQuery.extend(jQuery.messager.defaults, {
	ok : "确定",
	cancel : "取消"
});

/**
 * 登录检查1
 */
function loginCheck1() {
	var username = ReadCookie("username");
	/*if (username == null || username == "" || username.length == 0) {
		window.top.location = "/gift-fly/login.html";
	}*/
}

/**
 * 登录检查2
 */
function loginCheck2() {
	var username = ReadCookie("username");
	/*if (username == null || username == "" || username.length == 0) {
		window.top.location = "../../login.html";
	}*/
}
/**
 * 控制各系统的显示和隐藏
 */
function system() {
	$("#systemlist").show();
	$("#shoppingmalllist").hide();
	$("#operationlist").hide();
	$("#systemtab").css("background-color","#95B8E7");
	$("#shoptab").css("background-color","#E0ECFF");
	$("#operationtab").css("background-color","#E0ECFF");
	$("#custtab").css("background-color","#E0ECFF");
}
function shoppingmall() {
	$("#systemlist").hide();
	$("#shoppingmalllist").show();
	$("#operationlist").hide();
	$("#systemtab").css("background-color","#E0ECFF");
	$("#shoptab").css("background-color","#95B8E7");
	$("#operationtab").css("background-color","#E0ECFF");
	$("#custtab").css("background-color","#E0ECFF");
}
function operation() {
	$("#systemlist").hide();
	$("#shoppingmalllist").hide();
	$("#operationlist").show();
	$("#systemtab").css("background-color","#E0ECFF");
	$("#shoptab").css("background-color","#E0ECFF");
	$("#operationtab").css("background-color","#95B8E7");
	$("#custtab").css("background-color","#E0ECFF");
}
function customerservice() {
	$("#kefuBtn").trigger("click");
	$("#systemtab").css("background-color","#E0ECFF");
	$("#shoptab").css("background-color","#E0ECFF");
	$("#operationtab").css("background-color","#E0ECFF");
	$("#custtab").css("background-color","#95B8E7");
}

$(function() {
	var arr = $("input[addClear]");
	for (var i = 0; i < arr.length; i++) {
		var oneInput = $(arr[i]);
		var theId = oneInput.attr("id");
		theId = theId.replace('.', '\\.');
		var theClass = oneInput.attr("class");

		if (theClass.indexOf("easyui-textbox") != -1) { //文本框
			addClear4TextBox("#" + theId);
		} else if (theClass.indexOf("easyui-combobox") != -1) { //下拉列表框
			addClear4Combobox("#" + theId);
		} else if (theClass.indexOf("easyui-combogrid") != -1) { //数据表格下拉框
			addClear4Combogrid("#" + theId);
		} else if (theClass.indexOf("easyui-numberbox") != -1) { //数值输入框
			addClear4Numberbox("#" + theId);
		} else if (theClass.indexOf("easyui-datebox") != -1) { //日期选择框
			addClear4Datebox("#" + theId);
		} else if (theClass.indexOf("easyui-datetimebox") != -1) { //日期选择框
			addClear4Datetimebox("#" + theId);
		}
	}
});
/*
* 为‘文本框’列表添加‘清除’图标
* 该实现使用了 onChange 事件，如果用户需要该事件，可传入自定义函数，会自动回调 。
*/
function addClear4TextBox(theId, onChangeFun) {
	var theObj = $(theId);

	//根据当前值，确定是否显示清除图标
	var showIcon = function() {
		var icon = theObj.textbox('getIcon', 0);
		if (theObj.textbox('getValue')) {
			icon.css('visibility', 'visible');
		} else {
			icon.css('visibility', 'hidden');
		}
	};

	theObj.textbox({
		//添加清除图标
		icons : [ {
			iconCls : 'icon-clear',
			handler : function(e) {
				theObj.textbox('clear');
			}
		} ],

		//值改变时，根据值，确定是否显示清除图标
		onChange : function() {
			if (onChangeFun) {
				onChangeFun();
			}
			showIcon();
		}
	});

	//根据目前值，确定是否显示清除图标
	showIcon();
}

/*
* 为‘下拉列表框’添加‘清除’图标
* 该实现使用了 onChange 事件，如果用户需要该事件，可传入自定义函数，会自动回调 。
*/
function addClear4Combobox(theId, onChangeFun) {
	var theObj = $(theId);

	//根据当前值，确定是否显示清除图标
	var showIcon = function() {
		var icon = theObj.combobox('getIcon', 0);
		if (theObj.combobox('getValue')) {
			icon.css('visibility', 'visible');
		} else {
			icon.css('visibility', 'hidden');
		}
	};

	theObj.combobox({
		//添加清除图标
		icons : [ {
			iconCls : 'icon-clear',
			handler : function(e) {
				theObj.combobox('clear');
			}
		} ],

		//值改变时，根据值，确定是否显示清除图标
		onChange : function() {
			if (onChangeFun) {
				onChangeFun();
			}
			showIcon();
		}
	});

	//初始化确认图标显示
	showIcon();
}


/*
* 为‘数据表格下拉框’添加‘清除’图标
* 该实现使用了 onChange 事件，如果用户需要该事件，可传入自定义函数，会自动回调 。
*/
function addClear4Combogrid(theId, onChangeFun) {
	var theObj = $(theId);

	//根据当前值，确定是否显示清除图标
	var showIcon = function() {
		var icon = theObj.combogrid('getIcon', 0);
		if (theObj.combogrid('getValue')) {
			icon.css('visibility', 'visible');
		} else {
			icon.css('visibility', 'hidden');
		}
	};

	theObj.combogrid({
		//添加清除图标
		icons : [ {
			iconCls : 'icon-clear',
			handler : function(e) {
				theObj.combogrid('clear');
			}
		} ],

		//值改变时，根据值，确定是否显示清除图标
		onChange : function() {
			if (onChangeFun) {
				onChangeFun();
			}
			showIcon();
		}
	});

	//初始化确认图标显示
	showIcon();
}

/*
* 为‘数值输入框’添加‘清除’图标
* 该实现使用了 onChange 事件，如果用户需要该事件，可传入自定义函数，会自动回调 。
*/
function addClear4Numberbox(theId, onChangeFun) {
	var theObj = $(theId);

	//根据当前值，确定是否显示清除图标
	var showIcon = function() {
		var icon = theObj.numberbox('getIcon', 0);
		if (theObj.numberbox('getValue')) {
			icon.css('visibility', 'visible');
		} else {
			icon.css('visibility', 'hidden');
		}
	};

	theObj.numberbox({
		//添加清除图标
		icons : [ {
			iconCls : 'icon-clear',
			handler : function(e) {
				theObj.numberbox('clear');
			}
		} ],

		//值改变时，根据值，确定是否显示清除图标
		onChange : function() {
			if (onChangeFun) {
				onChangeFun();
			}
			showIcon();
		}
	});

	//初始化确认图标显示
	showIcon();
}

/*
* 为‘日期选择框’添加‘清除’图标
* 该实现使用了 onChange 事件，如果用户需要该事件，可传入自定义函数，会自动回调 。
*/
function addClear4Datebox(theId, onChangeFun) {
	var theObj = $(theId);

	//根据当前值，确定是否显示清除图标
	var showIcon = function() {
		var icon = theObj.datebox('getIcon', 0);
		if (theObj.datebox('getValue')) {
			icon.css('visibility', 'visible');
		} else {
			icon.css('visibility', 'hidden');
		}
	};

	theObj.datebox({
		//添加清除图标
		icons : [ {
			iconCls : 'icon-clear',
			handler : function(e) {
				theObj.datebox('clear');
			}
		} ],

		//值改变时，根据值，确定是否显示清除图标
		onChange : function() {
			if (onChangeFun) {
				onChangeFun();
			}
			showIcon();
		}
	});

	//初始化确认图标显示
	showIcon();
}


/*
* 为‘日期时间选择框’添加‘清除’图标
* 该实现使用了 onChange 事件，如果用户需要该事件，可传入自定义函数，会自动回调 。
*/
function addClear4Datetimebox(theId, onChangeFun) {
	var theObj = $(theId);

	//根据当前值，确定是否显示清除图标
	var showIcon = function() {
		var icon = theObj.datetimebox('getIcon', 0);
		if (theObj.datetimebox('getValue')) {
			icon.css('visibility', 'visible');
		} else {
			icon.css('visibility', 'hidden');
		}
	};

	theObj.datetimebox({
		//添加清除图标
		icons : [ {
			iconCls : 'icon-clear',
			handler : function(e) {
				theObj.datetimebox('clear');
			}
		} ],

		//值改变时，根据值，确定是否显示清除图标
		onChange : function() {
			if (onChangeFun) {
				onChangeFun();
			}
			showIcon();
		}
	});

	//初始化确认图标显示
	showIcon();
}

//显示当前日期
function formatterDate(date) {
	if (date == null || date == "") {
		date = new Date();
	}
	date = new Date(date);
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"
	+ (date.getMonth() + 1);
	//var hor = date.getHours();
	//var min = date.getMinutes();
	//var sec = date.getSeconds();
	return date.getFullYear() + '-' + month + '-' + day;
};
//上传图片的进度条控制
function progressBar() {
	$("#progressBarID").progressbar({
		width : 500,
		height : 30
	});
	$("#btnID").bind('click', function() {
		timeID = window.setInterval("updateProgressBar()", 400);
		$("#btnID").linkbutton({
			disabled : true
		});
	});
}
function getRandomNum() {
	return Math.floor(Math.random() * 40) + 1;
}
function updateProgressBar() {
	var num = getRandomNum();
	var nowValue = $("#progressBarID").progressbar("getValue");
	if (num + nowValue > 100) {
		$("#progressBarID").progressbar("setValue", 99);
		window.clearInterval(timeID);
		$("#btnID").linkbutton({
			disabled : false
		});
	} else {
		$("#progressBarID").progressbar("setValue", nowValue + num);
	}
}