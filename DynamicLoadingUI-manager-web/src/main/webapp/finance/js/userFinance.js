$(document).ready(function() {
	loginCheck1();
	$("#typename").combobox('clear');
	cleardata();
	var p = $('#userlogdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [ 20, 30, 40 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findUserLogList(pageNumber, pageSize, username, type, stratDate, endDate);
		},
	});
	findUserLogList(1, 20, username, type, stratDate, endDate);
});
var username = null;
var stratDate = null;
var endDate = null;
var type = null;

function queryInfo() {
	var p = $('#userlogdg').datagrid('getPager');
	var options = p.data("pagination").options;
	var page = options.pageNumber;
	var rows = options.pageSize;
	username = $("#username").val();
	stratDate = $("#startTime").val();
	endDate = $("#endTime").val();
	if (stratDate == "" && endDate != "") {
		stratDate = endDate;
	}else if (stratDate != "" && endDate == ""){
		endDate = stratDate;
	}
	type = $('#typename').combobox('getValue');
	findUserLogList(page, rows, username, type, stratDate, endDate);
}
// 分页查询
function findUserLogList(page, rows, username, type, stratDate, endDate) {
	$('#userlogdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/fina/findUserLogList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			username : username,
			type : type,
			stratDate : stratDate,
			endDate : endDate,
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 需要传递total总条数和rows列表...
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#userlogdg').datagrid('loaded');
				$("#userlogdg").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
//清除数据缓存
function cleardata() {
	$("#startTime").val("");
	$("#endTime").val("");
	$("#username").val("");
	username = null;
	stratDate = null;
	endDate = null;
	$("#typename").combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		data : [ {
			"id" : 3,
			"name" : "我的钱包"
		}, {
			"id" : 4,
			"name" : "线下银行卡虚拟账户"
		}, {
			"id" : 5,
			"name" : "线下对公虚拟账户",
		}, {
			"id" : 11,
			"name" : "积分"
		}, {
			"id" : 12,
			"name" : "鸟蛋"
		}, {
			"id" : 13,
			"name" : "爱心"
		} ]
	});
}
/**
 * 导出文件
 */
function exportUserLogExcel() {
	$.ajax({
		url : '/gift-fly/system/fina/exportUserlogExcel',
		dataType : "json",
		type : "post",
		data : {
			username : username,
			type : type,
			stratDate : stratDate,
			endDate : endDate,
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#download").attr("href", data.path);
				$("#subBtn").trigger("click");
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}