$(document).ready(function() {
	loginCheck1();
	$("#typename").combobox('clear');
	cleardata();
	var p = $('#platformdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [20,30,40 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findUserLogList(pageNumber, pageSize,type, stratDate,endDate);
		},
	});
	findUserLogList(1, 20,type, stratDate,endDate);
});
var stratDate = null;
var endDate = null;
var type = null;

function queryInfo() {
	var p = $('#platformdg').datagrid('getPager');
	var options = p.data("pagination").options;
	var page = options.pageNumber;
	var rows = options.pageSize;
	stratDate = $("#startTime").val();
	endDate = $("#endTime").val();
	if (stratDate == null && endDate != null) {
		$.messager.alert('提示', '请输入要查询的开始时间','warning');
		return;
	}else if (stratDate != null && endDate == null){
		$.messager.alert('提示', '请输入要查询的结束时间','warning');
		return;
	}
	type = $('#typename').combobox('getValue');
	findUserLogList(page, rows,type, stratDate,endDate);
}
// 分页查询
function findUserLogList(page, rows, type, stratDate,endDate) {
	$('#platformdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/fina/findPlatformList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
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
				$('#platformdg').datagrid('loaded');
				$("#platformdg").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示',  err.msg, 'error');
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
		data : [{    
		    "id":1,    
		    "name":"收入"   
		},{    
		    "id":2,    
		    "name":"支出"   
		}]  
	});
}
/**
 * 导出文件
 */
function exportPlatformExcel() {
	$.ajax({
		url : '/gift-fly/system/fina/exportPlatformExcel',
		dataType : "json",
		type : "post",
		data : {
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
			$.messager.alert('提示',  err.msg, 'error');
		}
	});
}
