$(document).ready(function() {
	loginCheck1();
	cleardata();
	var p = $('#afterTheListdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [20,30,40 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findOrderList(pageNumber, pageSize,seachKey,orgId, status,startTime,endTime);
		},
	});
	//findOrderList(1, 20,seachKey,orgId, status,startTime,endTime);
});
var seachKey=null;
var startTime=null;
var endTime=null;
var status;
var orgId=null;
function queryOrderInfo() {
	var p = $('#afterTheListdg').datagrid('getPager');
	var options = p.data("pagination").options;
	var page = options.pageNumber;
	var rows = options.pageSize;
	status = $('#orderstatus').combobox('getValue');
	seachKey = $("#prodOrder").val();
	startTime = $("#startTime").val();
	endTime = $("#endTime").val();
	if (startTime == null && endTime != null) {
		$.messager.alert('提示', '请输入要查询的开始时间','warning');
		return;
	}else if (startTime != null && endTime == null){
		$.messager.alert('提示', '请输入要查询的结束时间','warning');
		return;
	}
	findOrderList(page, rows,seachKey,orgId, status,startTime,endTime);
}
// 分页查询
function findOrderList(page, rows,seachKey,orgId, status,startTime,endTime) {
	$('#afterTheListdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/order/findOrderList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			orgId : orgId,
			seachKey : seachKey,
			status : status,
			startTime : startTime,
			endTime : endTime,
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 需要传递total总条数和rows列表...
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#afterTheListdg').datagrid('loaded');
				$("#afterTheListdg").datagrid('loadData', obj);
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
	$("#prodOrder").val("");
	$("#endTime").val("");
	$("#username").val("");
	$("#orderstatus").combobox('clear');
	seachKey = null;
	$("#orderstatus").combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		value :"全部",
		data : [ {
			"id" : "0",
			"name" : "已取消"
		}, {
			"id" : 1,
			"name" : "待支付"
		}, {
			"id" : 2,
			"name" : "已支付",
		}, {
			"id" : 3,
			"name" : "待发货"
		}, {
			"id" : 4,
			"name" : "发货中"
		}, {
			"id" : 5,
			"name" : "已发货"
		}, {
			"id" : 6,
			"name" : "待收货"
		}, {
			"id" : 7,
			"name" : "已收货"
		}, {
			"id" : 8,
			"name" : "完成"
		}]
	});
}
function formatterZT(value, row, index) {
	if (value == 0) {
		return '已取消';
	} else if(value == 1) {
		return '待支付';
	}else if(value == 2) {
		return '已支付';
	}else if(value == 3) {
		return '待发货';
	}else if(value == 4) {
		return '发货中';
	}else if(value == 5) {
		return '已发货';
	}else if(value == 6) {
		return '待收货';
	}else if(value == 7) {
		return '已收货';
	}else if(value == 8) {
		return '完成';
	}
}
function formatterCZ(value, row, index) {
		return '<a href="javascript:checkOrderDetail();" class="audit1">查看</a>';
}
//订单详情
function checkOrderDetail() {
	var row = $("#afterTheListdg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要查看的订单', 'warning');
		return;
	}
	var id = row.id;
	$.ajax({
		url : '/gift-fly/system/order/findOrderDitail',
		dataType : "json",
		type : "post",
		data : {
			id : id,
		},
		success : function(data) {
			if (data.status == "succeed") {
				toUploadOrder(data.entity);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示',  err.msg, 'error');
		}
	});
}
function toUploadOrder(entity) {
	$("#orderDetail span").remove();
	$("#alliancename").append('<span>'+entity.orgName+'</span>');
	$("#ordernum").append('<span>'+entity.id+'</span>');
	$("#username").append('<span>'+entity.nickname+'</span>');
	$("#phone").append('<span>'+entity.opMobile+'</span>');
	$("#orderstatus").append('<span>'+entity.status+'</span>');
	$("#ordertime").append('<span>'+entity.created+'</span>');
	$("#paytype").append('<span>'+entity+'</span>');
	$("#paytime").append('<span>'+entity.payAt+'</span>');
	$("#consignee").append('<span>'+entity.name+'</span>');
	$("#cphone").append('<span>'+entity.tel1+'</span>');
	$("#address").append('<span>'+entity.addrDetails+'</span>');
	$("#bbs").append('<span>'+entity.leaveMsg+'</span>');
	$("#totalmoney").append('<span>'+entity.goodsAmount+'</span>');
	$("#coupondeduction").append('<span>'+entity.reductionAmount+'</span>');
	$("#dealpayment").append('<span>'+entity.realAmount+'</span>');
}

