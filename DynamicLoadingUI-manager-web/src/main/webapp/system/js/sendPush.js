$(document).ready(function() {
	loginCheck1();
	var p = $('#senddg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [ 15, 20, 25 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页 共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录 共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findList(pageNumber, pageSize);
		}
	});
	$('#sendtitle').val("");
	$('#sendcontent').val("");
	getTotal();
	findList(1, 15);
});
var name;
var list;
var id;
var total;
var adminid = ReadCookie("adminid");
function getTotal() {
	$.ajax({
		url : '/gift-fly/system/params/getTotal',
		dataType : "json",
		type : "post",
		async : false,
		data : {},
		success : function(data) {
			total = data;
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
// 分页查询
function findList(page, rows) {
	$('#senddg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/params/getNotificationList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
		},
		success : function(data) {
			// 需要传递total总条数和rows列表...
			var obj = {
				total : total,
				rows : data
			};
			$('#senddg').datagrid('loaded');
			$("#senddg").datagrid('loadData', obj);
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//发布推送对话框
function publish() {
	$("#sendtitle").textbox("setValue", "");
	$("#sendcontent").textbox("setValue", "");
	$('#sendrange').combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'text',
		data : [ {
			"id" : 0,
			"text" : "全部"
		}, {
			"id" : 1,
			"text" : "IOS"
		}, {
			"id" : 2,
			"text" : "Android",
		}, {
			"id" : 3,
			"text" : "WindowsPhone"
		}, {
			"id" : 4,
			"text" : "微信"
		}, {
			"id" : 5,
			"text" : "网页"
		}, {
			"id" : 6,
			"text" : "微信小程序"
		} ]
	});
	$("#sendInfo").dialog("open");
}
function saveinfo() {
	var title = $("#sendtitle").val();
	var deviceType = $('#sendrange').combobox('getValue');
	if (deviceType =="") {
		deviceType = 0;
	}
	var content = $("#sendcontent").val();
	var planTime =$("#start").val();
	if(planTime ==null || planTime ==""){
		$.messager.alert('提示', '请计划发送时间', 'warning');
		return;
	}
	$.ajax({
		url : '/gift-fly/system/params/insertNotification',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			title : title,
			deviceType : deviceType,
			content : content,
			node : "发送推送",
			adminId : adminid,
			planTime : planTime,
		},
		success : function(data) {
			if (data > 0) {
				$("#sendInfo").dialog("close");
				getTotal();
				// 刷新当前页
				$('#senddg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "发送成功！",
					title : "提示",
				});
				//插入日志
				insertLog(adminid, 1, "发送推送:" + title, "发送推送");
			}else if(data == -1){
				$.messager.alert('提示', '权限不足！', 'error');
			}else{
				$.messager.alert('提示', '数据保存失败！', 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
function formatterRange(value, row, index) {
	if (value == 0) {
		return '全部';
	} else if (value == 1) {
		return 'IOS';
	} else if (value == 2) {
		return 'Android';
	} else if (value == 3) {
		return 'WindowsPhone';
	} else if (value == 4) {
		return '微信';
	} else if (value == 5) {
		return '网页';
	} else {
		return '微信小程序';
	}
}
function formatterOper(value, row, index) {
	if (value == 1) {
		return '发送成功';
	} else if (value == 2) {
		return '等待发送';
	} else if (value == 3) {
		return '发送中';
	} else {
		return '发送失败';
	}
}