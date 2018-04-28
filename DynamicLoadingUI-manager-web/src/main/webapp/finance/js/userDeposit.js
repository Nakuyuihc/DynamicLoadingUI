$(document).ready(function() {
	loginCheck1();
	cleaninfo();
	var p = $('#userfinacedg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [20,30,40 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findList(pageNumber, pageSize, stratDate, endDate,status);
		},
	});
	box();
	findList(1, 20, stratDate, endDate,status);
	
});
var stratDate = null;
var endDate = null;
var status = 0;
var adminid = ReadCookie("adminid");
var username = ReadCookie("username");
var id;
var toid=-1;
var money="";
var statusBefore;
var statusAfter;
var applyId;
var lognote;
// 分页查询
function findList(page, rows, stratDate, endDate,status) {
	$('#userfinacedg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/fina/findCashApplyList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			stratDate : stratDate,
			endDate : endDate,
			status : status,
			orgId : -1,
			type : 1,
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 需要传递total总条数和rows列表...
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#userfinacedg').datagrid('loaded');
				$("#userfinacedg").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', '数据加载失败!', 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
function formatterZT(value, row, index) {
	if (value == 1) {
		return '申请中';
	} else if (value == 4) {
		return '终审通过';
	} else if (value == 6) {
		return '转账成功';
	} else if (value == 11){
		return '转账失败驳回';
	}
}
function formatterCZ(value, row, index) {
	if (row.status == 1) {
		return '<a href="javascript:pass();" class="audit">通过</a>&nbsp;&nbsp;&nbsp;&nbsp'+
		'<a href="javascript:nopass();" class="audit">不通过</a>';
	} else if (row.status == 4) {
		return '<a href="javascript:transferAccounts();" class="audit">确定转账</a>&nbsp;&nbsp;&nbsp;&nbsp'+
		'<a href="javascript:transferDefeated();" class="audit">转账失败</a>';
	} else {
		return '';
	}
}
function pass() {
	var row = $("#userfinacedg").datagrid("getSelected");
	if (row) {
		$.messager.confirm('请确认', '确认通过该提现申请吗?',function(b) {
			if (b) {
				id = row.id;
				statusBefore = row.status;
				statusAfter = 4;
				applyId = row.applyAccountId;
				lognote="审核会员提现申请:通过申请";
				updateStatus(id,"","",statusBefore,statusAfter,applyId,lognote);
			}
		});
	} else {
		$.messager.alert('提示', '请选择需要审核的数据列', 'warning');
	}
}
function nopass() {
	var row = $("#userfinacedg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要审核的数据列', 'warning');
	}
	id = row.id;
	toid = row.userid;
	money = row.amount;
	statusBefore = row.status;
	statusAfter = 11;
	applyId = row.applyAccountId;
	$("#nopassReason").dialog("open");
}
function transferDefeated() {
	var row = $("#userfinacedg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要审核的数据列', 'warning');
	}
	id = row.id;
	toid = row.userid;
	money = row.amount;
	statusBefore = row.status;
	statusAfter = 11;
	description = "转账失败";
	applyId = row.applyAccountId
	updateStatus(id,"",description,statusBefore,statusAfter,applyId,"转账失败");
}
function saveNopass() {
	var description = $("#description").val();
	lognote="审核会员提现申请:不通过申请,原因"+description;
	updateStatus(id,"",description,statusBefore,statusAfter,applyId,lognote);
}
function transferAccounts() {
	var row = $("#userfinacedg").datagrid("getSelected");
	if (row) {
		$.messager.confirm('请确认', '确认已转账完成了?', function(b) {
			if (b) {
				id = row.id;
				statusBefore = row.status;
				statusAfter = 6;
				applyId = row.applyAccountId;
				lognote="审核会员提现申请:已转账完成";
				updateStatus(id,"","",statusBefore,statusAfter,applyId,lognote);
			}
		});
	} else {
		$.messager.alert('提示', '请选择需要审核的数据列', 'warning');
	}
	}
function updateStatus(id,comment,description,statusBefore,statusAfter,applyId,lognote) {
	$.ajax({
		url : '/gift-fly/system/fina/updateStatus',
		dataType : "json",
		type : "post",
		data : {
			id : id,
			adminid : adminid,
			node : "会员提现",
			comment : comment,
			description : description,
			opUserName : username,
			statusBefore : statusBefore,
			statusAfter : statusAfter,
			applyId : applyId,
			money : money,
			type : 1,
		},
		success : function(data) {
			if (data.status == "succeed") {
				$('#userfinacedg').datagrid('getPager').pagination('select');
				//插入日志
				insertLog(adminid, 1, lognote, "会员提现申请");
				$('#nopassReason').dialog('close')
			} else if(data.status == "fail"){
				$.messager.alert('提示', data.msg, 'error');
			}else {
				$.messager.alert('提示', '数据加载失败!', 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//清除页面的信息缓存
function cleaninfo() {
	$("#startTime").val("");
	$("#endTime").val("");
	 stratDate = null;
	 endDate = null;
	 status = 0;
	}

//下拉列表
function box() {
	$("#statusbox").combobox({
		panelHeight : 'auto',
		editable : false,
		valueField : 'id',
		textField : 'text',
		data : [ {
			"id" : 0,
			"selected":true,   
			"text" : "全部"
		}, {
			"id" : 1,
			"text" : "申请中"
		}, {
			"id" : 2,
			"text" : "初审通过"
		}, {
			"id" : 3,
			"text" : "复审通过"
		}, {
			"id" : 4,
			"text" : "终审通过"
		}, {
			"id" : 11,
			"text" : "审核不通过"
		},{
			"id" : 5,
			"text" : "已转账"
		}, {
			"id" : 6,
			"text" : "转账成功"
		}, {
			"id" : 13,
			"text" : "转账失败"
		}, {
			"id" : 12,
			"text" : "转账取消"
		}]
	});
}
function findByDate() {
	var p = $('#userfinacedg').datagrid('getPager');
	var options = p.data("pagination").options;
	var page = options.pageNumber;
	var rows = options.pageSize;
	stratDate = $("#startTime").val();
	endDate = $("#endTime").val();
	if (stratDate == "" && endDate != "") {
		stratDate = endDate;
	}else if (stratDate != "" && endDate == ""){
		endDate = stratDate;
	}
	status = $('#statusbox').combobox('getValue');
	findList(page, rows, stratDate, endDate,status);
}