$(document).ready(function() {
	loginCheck1();
	$("#xm").val("");
	 $("#startTime").val("");
	var p = $('#logdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [15,20,25],
		beforePageText : '第',//页数文本框前显示的汉字  
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			queryPagingInfo(pageNumber, pageSize,username,startTime);
		}
	});
	queryPagingInfo(1, 15,username,startTime);
});
var username ='';
var startTime =''; 
//获取分页日志信息
function queryPagingInfo(page, rows,username,startTime) {
	$('#logdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/log/selectInfo',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			username : username,
			startTime : startTime,
			systemType : 1,
			orgId : 0,
		},
		success : function(data) {
				// 需要传递total总条数和rows列表...
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#logdg').datagrid('loaded');
				$("#logdg").datagrid('loadData', obj);
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//提交表单，查询总记录数，分页查询
function select() {
 var p = $('#logdg').datagrid('getPager');
 var options = p.data("pagination").options;
 var page = options.pageNumber;
 var rows = options.pageSize;
 username = $("#xm").val();
 startTime = $("#startTime").val();
 if (username == '' && startTime == '') {
	$.messager.alert('提示', '请输入要查询的用户名或时间', 'warning');
	return;
 }
 queryPagingInfo(page, rows,username,startTime);
}

//清除表单

function clean() {
	 $("#xm").val("");
	 $("#startTime").val("");
	 var p = $('#logdg').datagrid('getPager');
	 var options = p.data("pagination").options;
	 var page = options.pageNumber;
	 var rows = options.pageSize;
	 queryPagingInfo(page, rows,null,null);
	}
