$(function() {
	loginCheck1();
	init();
	findDimensions();
	authorityControl();
	InitLeftMenu();
	init1();
	systemTime();
	var user = ReadCookie("username");
	document.getElementById("showName").innerHTML = "" + user;
	$("#systemtab").css("background-color","#95B8E7");
});
function init1() {
	$("#datastatistics").addClass('inactives');
	$("#subBtn").trigger("click");
	$('.inactive').click(function() {
		if ($(this).siblings('ul').css('display') == 'none') {
			$(this).parent('li').siblings('li').removeClass('inactives');
			$(this).addClass('inactives');
			$(this).siblings('ul').slideDown(100).children('li');
			if ($(this).parents('li').siblings('li').children('ul').css('display') == 'block') {
				$(this).parents('li').siblings('li').children('ul').parent('li').children('a').removeClass('inactives');
				$(this).parents('li').siblings('li').children('ul').slideUp(100);
			}
		} else {
			//控制自身变成+号
			$(this).removeClass('inactives');
			//控制自身菜单下子菜单隐藏
			$(this).siblings('ul').slideUp(100);
			//控制自身子菜单变成+号
			$(this).siblings('ul').children('li').children('ul').parent('li').children('a').addClass('inactives');
			//控制自身菜单下子菜单隐藏
			$(this).siblings('ul').children('li').children('ul').slideUp(100);
			//控制同级菜单只保持一个是展开的（-号显示）
			$(this).siblings('ul').children('li').children('a').removeClass('inactives');
		}
	})
}

// 初始化左侧
function InitLeftMenu() {
	$('ul li a').click(function(e) {
		var tabTitle = $(this).text();
		var url = $(this).attr("href");
		if (url != '#') {
			e.preventDefault();
			addTab(tabTitle, url);
		}
	}).hover(function() {
		$(this).parent().addClass("hover");
	}, function() {
		$(this).parent().removeClass("hover");
	});
	setTabsRightClick();
}

function createFrame(url) {
	var s = '<iframe name="mainFrame" scrolling="auto" frameborder="0"  src="'
		+ url + '" style="width:100%;height:100%;"></iframe>';
	return s;
}
// 权限控制
function authorityControl() {
	var authoritylist = ReadCookie("authoritylist");
	if (authoritylist == "all") {
		return;
	}
	var funrights = authoritylist.split(",");
	var flag;
	var j1 = ["数据概览"];
	if (funrights.indexOf(j1[0]) < 0) {
		document.getElementById('datastatistics').style.display = 'none';
	}
	var j2 = ["会员列表"];
	if (funrights.indexOf(j2[0]) < 0) {
		document.getElementById('user').style.display = 'none';
	}
	var j3 = ["商家列表"];
	if (funrights.indexOf(j3[0]) < 0) {
		document.getElementById('merchant').style.display = 'none';
	}
	var jn = ["推广员申请"];
	if (funrights.indexOf(jn[0]) < 0) {
		document.getElementById('generalize').style.display = 'none';
	}
	var j4=["帐号管理","角色权限","系统日志","短信日志"];
	var n4 = j4.length;
	for (var i = 0; i < j4.length; i++) {
		if (funrights.indexOf(j4[i]) < 0) {
			document.getElementById(j4[i]).style.display = 'none';
			n4 = --n4;
		}
		if (n4 == 0) {
			document.getElementById('system').style.display = 'none';
		}
	}
	var j5 = ["超管参数","系统参数", "运营参数", "财务参数","页面参数","推广返利参数"];
	var n5 = j5.length;
	for (var i = 0; i < j5.length; i++) {
		if (funrights.indexOf(j5[i]) < 0) {
			document.getElementById(j5[i]).style.display = 'none';
			n5 = --n5;
		}
		// n5=0,说明没有该模块权限，去掉该面板
		if (n5 == 0) {
			// 查找一个节点并移除它
			document.getElementById('setting').style.display = 'none';
		}
	}
	var j6=["意见反馈","举报列表"];
	var n6 = j6.length;
	for (var i = 0; i < j6.length; i++) {
		if (funrights.indexOf(j6[i]) < 0) {
			document.getElementById(j6[i]).style.display = 'none';
			n6 = --n6;
		}
		if (n6 == 0) {
			document.getElementById('feedback').style.display = 'none';
		}
	}
	var j7=["商品列表","商品分类","定制商品列表","定制主题","虚拟礼物"];
	var n7 = j7.length;
	for (var i = 0; i < j7.length; i++) {
		if (funrights.indexOf(j7[i]) < 0) {
			document.getElementById(j7[i]).style.display = 'none';
			n7 = --n7;
		}
		if (n7 == 0) {
			document.getElementById('product').style.display = 'none';
		}
	}
	var j8=["商品订单","定制商品订单","售后列表"];
	var n8 = j8.length;
	for (var i = 0; i < j8.length; i++) {
		if (funrights.indexOf(j8[i]) < 0) {
			document.getElementById(j8[i]).style.display = 'none';
			n8 = --n8;
		}
		if (n8 == 0) {
			document.getElementById('order').style.display = 'none';
		}
	}
	var j9 = ["评价列表"];
	if (funrights.indexOf(j9[0]) < 0) {
		document.getElementById('evaluate').style.display = 'none';
	}
	var j10=["广告列表","公告","系统消息","发送推送"];
	var n10 = j10.length;
	for (var i = 0; i < j10.length; i++) {
		if (funrights.indexOf(j10[i]) < 0) {
			document.getElementById(j10[i]).style.display = 'none';
			n10 = --n10;
		}
		if (n10 == 0) {
			document.getElementById('advertising').style.display = 'none';
		}
	}
	var j11=["专区活动","优惠券","新人优惠券"];
	var n11 = j11.length;
	for (var i = 0; i < j11.length; i++) {
		if (funrights.indexOf(j11[i]) < 0) {
			document.getElementById(j11[i]).style.display = 'none';
			n11 = --n11;
		}
		if (n11 == 0) {
			document.getElementById('promotion').style.display = 'none';
		}
	}
	var j12=["学校列表","申请列表"];
	var n12 = j12.length;
	for (var i = 0; i < j12.length; i++) {
		if (funrights.indexOf(j12[i]) < 0) {
			document.getElementById(j12[i]).style.display = 'none';
			n12 = --n12;
		}
		if (n12 == 0) {
			document.getElementById('business').style.display = 'none';
		}
	}
	var j13=["圈子管理","意见反馈"];
	var n13 = j13.length;
	for (var i = 0; i < j13.length; i++) {
		if (funrights.indexOf(j13[i]) < 0) {
			document.getElementById(j13[i]).style.display = 'none';
			n13 = --n13;
		}
		if (n13 == 0) {
			document.getElementById('conent').style.display = 'none';
		}
	}
	var j14=["平台流水","会员财务","加盟商财务","礼物回收记录","会员提现","加盟商提现"];
	var n14 = j14.length;
	for (var i = 0; i < j14.length; i++) {
		if (funrights.indexOf(j14[i]) < 0) {
			document.getElementById(j14[i]).style.display = 'none';
			n14 = --n14;
		}
		if (n14 == 0) {
			document.getElementById('conent').style.display = 'none';
		}
	}
}

function addTab(subtitle, url) {
	if (!$('#tabs').tabs('exists', subtitle)) {
		$('#tabs').tabs('add', {
			title : subtitle,
			content : createFrame(url),
			closable : true,
			width : $('#mainPanle').width() - 10,
			height : $('#mainPanle').height() - 26
		});
	} else {
		$('#tabs').tabs('select', subtitle);
	}
	tabClose();
}



function tabClose() {
	/* 双击关闭TAB选项卡 */
	$(".tabs-inner").dblclick(function() {
		var subtitle = $(this).children("span").text();
		$('#tabs').tabs('close', subtitle);
	});

}


// 从cookie中读取用户名
function init() {
	/*var username = ReadCookie("username");
	if (username && username.length > 0) {
		$("#username").html("当前用户：" + username);
	} else {
		window.location.href = "login.html";
	}*/
}

// 退出
function logout() {
	$.messager.confirm("请确认", "您确定退出吗？", function(r) {
		if (r) {
			delCookie("username");
			delCookie("orgname");
			delCookie("rolecode");
			delCookie("computername");
			delCookie("ip");
			delCookie("authoritylist");
			delCookie("adminid");
			delCookie("orgId");
			window.location.href = "login.html";
		}
	});

}

function findDimensions() //函数：获取尺寸
{
	var winWidth = 0;
	var winHeight = 0;
	//获取窗口宽度
	if (window.innerWidth)
		winWidth = window.innerWidth;
	else if ((document.body) && (document.body.clientWidth))
		winWidth = document.body.clientWidth;
	//获取窗口高度
	if (window.innerHeight)
		winHeight = window.innerHeight;
	else if ((document.body) && (document.body.clientHeight))
		winHeight = document.body.clientHeight;
	//通过深入Document内部对body进行检测，获取窗口大小
	if (document.documentElement && document.documentElement.clientHeight
		&& document.documentElement.clientWidth) {
		winHeight = document.documentElement.clientHeight;
		winWidth = document.documentElement.clientWidth;
	}
	$("#layout").layout({
		width : winWidth - 40,
		height : winHeight - 26
	});
}
//刷新页面
function reload() {
	location = location;
}

//操作tab
function operateTab(menu, type) {
	var allTabs = $("#tabs").tabs('tabs');
	var allTabtitle = [];
	$.each(allTabs, function(i, n) {
		var opt = $(n).panel('options');
		if (opt.closable)
			allTabtitle.push(opt.title);
	});
	var curTabTitle = $(menu).data("tabTitle");
	var curTabIndex = $("#tabs").tabs("getTabIndex", $("#tabs").tabs("getTab", curTabTitle));
	switch (type) {
	case 1:
		$("#tabs").tabs("close", curTabIndex);
		return false;
		break;
	case 2:
		for (var i = 0; i < allTabtitle.length; i++) {
			$('#tabs').tabs('close', allTabtitle[i]);
		}
		break;
	case 3:
		for (var i = 0; i < allTabtitle.length; i++) {
			if (curTabTitle != allTabtitle[i])
				$('#tabs').tabs('close', allTabtitle[i]);
		}
		$('#tabs').tabs('select', curTabTitle);
		break;
	case 4:
		for (var i = 0; i < curTabIndex; i++) {
			$('#tabs').tabs('close', allTabtitle[i]);
		}
		$('#tabs').tabs('select', curTabTitle);
		break;
	case 5:
		for (var i = curTabIndex + 1; i < allTabtitle.length; i++) {
			$('#tabs').tabs('close', allTabtitle[i]);
		}
		$('#tabs').tabs('select', curTabTitle);
		break;
	case 6: //刷新
		$('#tabs').tabs('select', curTabTitle);
		var curTab = $("#tabs").tabs("getTab", curTabTitle);
		var curIframe = $("#tabs").tabs("getTab", curTabTitle).children("iframe");
		var url = curIframe.attr('src');

		$('#tabs').tabs('update', {
			tab : curTab,
			options : {
				title : curTabTitle,
				content : createFrame(url),
				closable : true,
				width : $('#mainPanle').width() - 10,
				height : $('#mainPanle').height() - 26
			}
		});

		tabClose();
		break;
	}
}


function setTabsRightClick() {
	$('#tabs').tabs({
		onContextMenu : function(e, title, index) {
			e.preventDefault(); //preventDefault() 方法阻止元素发生默认的行为（例如，当点击提交按钮时阻止对表单的提交）
			//            if (index > 0) {
			$('#mm').menu('show', {
				left : e.pageX,
				top : e.pageY
			}).data("tabTitle", title);
		//            }
		}
	});
	//    
	//右键菜单click
	$("#mm").menu({
		onClick : function(item) {
			operateTab(this, item.name);
		}
	});
}
//获取系统时间，将时间以指定格式显示到页面。
function systemTime() {
	//获取系统时间。
	var dateTime = new Date();
	var nn = dateTime.getFullYear();
	var yy = dateTime.getMonth();
	var rr = dateTime.getDate();
	var hh = dateTime.getHours();
	var mm = dateTime.getMinutes();
	var ss = dateTime.getSeconds();
	var week = dateTime.getDay();
	//分秒时间是一位数字，在数字前补0。
	yy = extra(yy + 1);
	rr = extra(rr);
	mm = extra(mm);
	ss = extra(ss);
	we = formatWeek(week);
	//将时间显示到ID为time的位置，时间格式形如：19:18:02
	document.getElementById("time1").innerHTML = "当前时间：" + nn + "-" + yy + "-" + rr + "  " + hh + ":" + mm + ":" + ss + " " + we;

	//每隔1000ms执行方法systemTime()。
	setTimeout("systemTime()", 1000);
}

//补位函数。
function extra(x) {
	//如果传入数字小于10，数字前补一位0。
	if (x < 10) {
		return "0" + x;
	} else {
		return x;
	}
}

function formatWeek(n) {
	switch (n) {
	case 1:
		return "星期一";
		break;
	case 2:
		return "星期二";
		break;
	case 3:
		return "星期三";
		break;
	case 4:
		return "星期四";
		break;
	case 5:
		return "星期五";
		break;
	case 6:
		return "星期六";
		break;
	default:
		return "星期天";

	}
}
function changePw() {
	$("#changePW").dialog("open");
}