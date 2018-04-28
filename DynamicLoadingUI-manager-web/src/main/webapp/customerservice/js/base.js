//解决IE8之下document不支持getElementsByClassName方法
if (!document.getElementsByClassName) {
	document.getElementsByClassName = function(className, element) {
		var children = (element || document).getElementsByTagName('*');
		var elements = new Array();
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			var classNames = child.className.split(' ');
			for (var j = 0; j < classNames.length; j++) {
				if (classNames[j] == className) {
					elements.push(child);
					break;
				}
			}
		}
		return elements;
	};
}
//点击登录按钮(独立模式)
function independentModeLogin() {
	let node = "客服";
	let adminId = ReadCookie("adminid");
	$.ajax({
		url : '/gift-fly/system/tx/getUserSig',
		dataType : "json",
		type : "post",
		data : {
			node : node,
			adminid : adminId
		},
		success : function(data) {
			if (data.status == "succeed") {
				loginInfo.identifier = 'IM'+adminId;
				loginInfo.userSig = data.usersig;
				webimLogin();
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}

//初始化demo

function initApp() {
	$("body").css("background-color", '#2f2f2f');
	document.getElementById("webim_index").style.display = "block"; //展开聊天界面
	document.getElementById("p_my_face").src = loginInfo.headurl;
	if (loginInfo.identifierNick) {
		document.getElementById("t_my_name").innerHTML = webim.Tool.formatText2Html(loginInfo.identifierNick);
	} else {
		document.getElementById("t_my_name").innerHTML = webim.Tool.formatText2Html(loginInfo.identifier);
	}

	//菜单
	$("#t_my_menu").menu();

	$("#send_msg_text").focus();
	//初始化我的加群申请表格
	initGetApplyJoinGroupPendency([]);
	//初始化我的群组系统消息表格
	initGetMyGroupSystemMsgs([]);
	//初始化我的好友系统消息表格
	initGetMyFriendSystemMsgs([]);
	//初始化我的资料系统消息表格
	initGetMyProfileSystemMsgs([]);
	//初始化好友和群信息
	initInfoMap(initInfoMapCallbackOK);

}

function initInfoMap(cbOk) {
	//读取我的好友列表
	initInfoMapByMyFriends(
		//读取我的群组列表
		initInfoMapByMyGroups(
			cbOk
		)
	);
}

function initInfoMapCallbackOK() {
	initRecentContactList(initRecentContactListCallbackOK);
}

//初始化我的最近会话列表框回调函数

function initRecentContactListCallbackOK() {
	onSelSess(selType, selToID);

}

//判断str是否只包含数字

function validNumber(str) {
	if (!str) {
		str = str.toString();
		return str.match(/(^\d+$)/g);
	} else {
		return str;
	}
}



function onAppliedDownloadUrl(data) {
	console.debug(data);
}