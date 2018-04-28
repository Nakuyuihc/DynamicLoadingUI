$(document).ready(function() {
	loginCheck1();
	$("#userphone").val("");
	$("#startTime").val("");
	$("#endTime").val("");
	$("#upsfyx").combobox("clear");
	var p = $('#userlistdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [15,30,45],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findUserList(pageNumber, pageSize, phone, stratDate, endDate, status);
		},
	});
	findUserList(1, 15, phone, stratDate, endDate, status);
	upsfyx();
});
var userid;
var phone = null;
var stratDate = null;
var endDate = null;
var status;
var nickname;
var adminid = ReadCookie("adminid");
// 分页查询
function findUserList(page, rows, phone, stratDate, endDate, status) {
	$('#userlistdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/cisweb/findUserList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			phone : phone,
			stratDate : stratDate,
			endDate : endDate,
			status : status,
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 需要传递total总条数和rows列表...
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#userlistdg').datagrid('loaded');
				$("#userlistdg").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', '系统异常！', 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
// 分页查询后显示的是否有效
function formatterZT(value, row, index) {
	if (value == 0) {
		return '未完善信息';
	} else if (value == 1) {
		return '正常';
	} else {
		return '冻结';
	}
}
function formatterYE(value, row, index) {
	return value + '元';
}

function formatterXB(value, row, index) {
	if (value == 0) {
		return '未知';
	} else if (value == 1) {
		return '男';
	} else {
		return '女';
	}
}
function formatterCZ(value, row, index) {
	if (row.status == 0) {
		return '<a href="javascript:detailInfo();" class="audit">查看信息</a>';
	} else if (row.status == 1) {
		return '<a href="javascript:detailInfo();" class="audit">查看信息</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
			'<a href="javascript:blocking();" class="audit">冻结帐号</a>';
	} else {
		return '<a href="javascript:detailInfo();" class="audit">查看信息</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
			'<a href="javascript:relieve();" class="audit">解除帐号</a>';
	}
}
//查看信息
function detailInfo() {
	var row = $("#userlistdg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要查看的用户', 'warning');
		return;
	}
	cleaninfo();
	userid = row.id;
	nickname = row.nickname;
	$("#usernickname").append('<span>' + row.nickname + '</span>');
	$("#userbirthday").append('<span>' + row.birthday + '</span>');
	if (row.sex == 0) {
		$("#usersex").append('<span>' + "未知" + '</span>');
	} else if (row.sex == 1) {
		$("#usersex").append('<span>' + "男" + '</span>');
	} else {
		$("#usersex").append('<span>' + "女" + '</span>');
	}
	$("#userarea").append('<span>' + row.regionInfo + '</span>');
	$("#userid").append('<span>' + row.id + '</span>');
	$("#phone").append('<span>' + row.openid + '</span>');
	$("#userregister").append('<span>' + row.createdAt + '</span>');
	$("#userlostlogin").append('<span>' + row.lastLoginTime + '</span>');
	$("#usersign").append('<span>' + row.sign + '</span>');
	$("#bmoney").append('<span>' + row.bmoney + '元</span>');
	$("#begg").append('<span>' + row.begg + '</span>');
	$("#blove").append('<span>' + row.blove + '</span>');
	var shareimage = row.shareImageIds;
	var image = row.image;
	//获取会员头像和分享图片
	$.ajax({
		url : '/gift-fly/system/cisweb/queryUserImg',
		dataType : "json",
		type : "post",
		data : {
			image : image,
			shareimage : shareimage,
		},
		success : function(data) {
			if (data.status == "succeed") {
				if (data.userimg == "" || data.userimg == null) {
					$("#userimg").append('<img src="/gift-fly/common/images/img.jpg" style="width: 180px;height: 180px;"/>');
				} else {
					$("#userimg").append('<img src="' + data.userimg + '" style="width: 180px;height: 180px;"/>');
				}
				if (data.shareimgs != null) {
					for (var i = 0; i < data.shareimgs.length; i++) {
						$("#showimg").append('<div id="' + i + '" style="float:left;position:relative;"><img class="upgiftpic" style="width:90px;height:90px;margin-right:5px;" src="' + data.shareimgs[i] + '"/>' +
							'<img onclick="dellptp(' + i + ')" style="position:absolute;right:10px; top:5px;width:16px;height:16px;cursor:pointer;" src="../common/jquery-easyui-1.5/themes/icons/cancel.png"/><div>');
					}
				}
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
	$("#showdetailinfo").dialog("open");
}
//冻结帐号
function blocking() {
	var row = $("#userlistdg").datagrid("getSelected");
	if (row) {
		$.messager.confirm('请确认', '即将把' + row.nickname + '进行冻结，冻结后该帐号马上被强制退出，无法登录．', function(b) {
			if (b) {
				userid = row.id;
				nickname = row.nickname;
				torealize(userid, 2);
			}
		})
	} else {
		$.messager.alert('提示', '请选择需要冻结的帐号信息列', 'warning');
	}
}
//解冻帐号
function relieve() {
	var row = $("#userlistdg").datagrid("getSelected");
	if (row) {
		$.messager.confirm('请确认', '即将解除' + row.nickname + '的冻结状态，解除后对方恢复正常登录，马上生效．', function(b) {
			if (b) {
				userid = row.id;
				nickname = row.nickname;
				torealize(userid, 1);
			}
		})
	} else {
		$.messager.alert('提示', '请选择需要冻结的帐号信息列', 'warning');
	}
}
//冻结/解冻帐号操作
function torealize(userid, status) {
	$.ajax({
		url : '/gift-fly/cisWeb/updateUserStatus',
		dataType : "json",
		type : "post",
		data : {
			userid : userid,
			status : status,
			adminid : adminid,
			node : "会员列表",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$('#userlistdg').datagrid('getPager').pagination('select');
				if (status == 2) {
					$.messager.show({
						timeout : 500,
						msg : "已冻结该帐号",
						title : "提示"
					});
					insertLog(adminid, 1, "将" + nickname + "的帐号进行冻结", "会员列表");
				} else {
					$.messager.show({
						timeout : 500,
						msg : "已解冻该帐号",
						title : "提示"
					});
					insertLog(adminid, 1, "将" + nickname + "的帐号进行解冻", "会员列表");
				}
			}else{
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
function upsfyx() {
	$("#upsfyx").combobox({
		panelHeight : 'auto',
		editable : false,
		valueField : 'id',
		textField : 'name',
		data : [ {
			"id" : "0",
			"name" : "未完善信息"
		}, {
			"id" : "1",
			"name" : "正常状态"
		}, {
			"id" : "2",
			"name" : "冻结状态"
		} ],
	});
}
//清除签名
function resetsign() {
	$.messager.confirm('请确认', '即将清除' + nickname + '的签名，清除后该用户的签名将为空．', function(b) {
		if (b) {
			$.ajax({
				url : '/gift-fly/cisWeb/webClearUserSign',
				dataType : "json",
				type : "post",
				data : {
					userid : userid,
					adminid : adminid,
					node : "会员列表",
				},
				success : function(data) {
					if (data.status == "succeed") {
						$('#userlistdg').datagrid('getPager').pagination('select');
						$("#usersign span").remove();
						insertLog(adminid, 1, "清除" + nickname + "的签名", "会员列表");
					} else {
						$.messager.alert('提示', data.msg, 'error');
					}
				},
				error : function(err) {
					$.messager.alert('提示', '系统异常！', 'error');
				}
			});
		}
	})
}
//重置用户头像为默认头像
function resetimg() {
	$.messager.confirm('请确认', '即将重置' + nickname + '的头像为系统默认头像．', function(b) {
		if (b) {
			$.ajax({
				url : '/gift-fly/cisWeb/resetUserDefaultImage',
				dataType : "json",
				type : "post",
				data : {
					userid : userid,
					adminid : adminid,
					node : "会员列表",
				},
				success : function(data) {
					if(data.status =="succeed"){
						$('#userlistdg').datagrid('getPager').pagination('select');
						$("#userimg img").remove();
						$("#userimg").append('<img style="width:180px;height:180px;" src="/gift-fly/common/images/img.jpg" alt="用户默认头像"/>');
						insertLog(adminid, 1, "重置" + nickname + "的头像为系统默认头像", "会员列表");
					}else{
						$.messager.alert('提示', data.msg, 'error');
					}
				},
				error : function(err) {
					$.messager.alert('提示', '系统异常！', 'error');
				}
			});
		}
	})
}
//清除页面的信息缓存
function cleaninfo() {
	$("#infotable td span").remove();
	$("#showimg div").remove();
	$("#userimg img").remove();
}
function queryUserInfo() {
	var p = $('#userlistdg').datagrid('getPager');
	var options = p.data("pagination").options;
	var page = options.pageNumber;
	var rows = options.pageSize;
	phone = $("#userphone").val();
	stratDate = $("#startTime").val();
	endDate = $("#endTime").val();
	status = $('#upsfyx').combobox('getValue');
	if (stratDate != null && endDate == null) {
		endDate = stratDate;
	}
	if (stratDate == null && endDate != null) {
		stratDate = endDate;
	}
	findUserList(page, rows, phone, stratDate, endDate, status);
}