$(document).ready(function() {
	loginCheck1();
	cleardata();
	var p = $('#alliancedFdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [20,30,40 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findOrgLogList(pageNumber, pageSize, name,type, stratDate,endDate);
		},
	});
	findOrgLogList(1, 20, name,type, stratDate,endDate);
});
var name = null;
var stratDate = null;
var endDate = null;
var type = null;

function queryInfo() {
	var p = $('#alliancedFdg').datagrid('getPager');
	var options = p.data("pagination").options;
	var page = options.pageNumber;
	var rows = options.pageSize;
	name = $("#name").val();
	stratDate = $("#startTime").val();
	endDate = $("#endTime").val();
	if (stratDate == "" && endDate != "") {
		stratDate = endDate;
	}else if (stratDate != "" && endDate == ""){
		endDate = stratDate;
	}
	type = $('#typename').combobox('getValue');
	findOrgLogList(page, rows, name,type, stratDate,endDate);
}
// 分页查询
function findOrgLogList(page, rows, name,type, stratDate,endDate) {
	$('#alliancedFdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/fina/findOrgLogList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			name : name,
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
				$('#alliancedFdg').datagrid('loaded');
				$("#alliancedFdg").datagrid('loadData', obj);
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
	$("#name").val("");
	name = null;
	stratDate = null;
	endDate = null;
}
function formatterLX(value, row, index) {
	if (value == 0) {
		return '系统内钱包';
	} else if (value == 1) {
		return '线下银行卡虚拟账户';
	} else if (value == 2){
		return '线下对公虚拟账户';
	} else if (value == 11){
		return '积分';
	}
}
/**
 * 导出文件
 */
function exportOrgLogExcel() {
	$.ajax({
		url : '/gift-fly/system/fina/exportOrglogExcel',
		dataType : "json",
		type : "post",
		data : {
			name : name,
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

