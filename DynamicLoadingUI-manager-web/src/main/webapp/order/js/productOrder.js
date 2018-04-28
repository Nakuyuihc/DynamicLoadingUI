$(document).ready(function() {
	loginCheck1();
	cleardata();
	var p = $('#prodorderdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [ 15, 20, 25 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findOrderList(pageNumber, pageSize, seachKey, orgId, status, startTime, endTime);
		},
	});
	findOrderList(1, 15, seachKey, orgId, status, startTime, endTime);
});
var seachKey = null;
var startTime = null;
var endTime = null;
var status;
var id;
var orgId = null;
function queryOrderInfo() {
	var p = $('#prodorderdg').datagrid('getPager');
	var options = p.data("pagination").options;
	var page = options.pageNumber;
	var rows = options.pageSize;
	status = $('#orderstatus').combobox('getValue');
	seachKey = $("#prodOrder").val();
	startTime = $("#startTime").val();
	endTime = $("#endTime").val();
	if (startTime == "" && endTime != "") {
		startTime = endTime;
	} else if (startTime != "" && endTime == "") {
		endTime = startTime;
	}
	findOrderList(page, rows, seachKey, orgId, status, startTime, endTime);
}
// 分页查询
function findOrderList(page, rows, seachKey, orgId, status, startTime, endTime) {
	$('#prodorderdg').datagrid('loading');
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
			spuType : 1,
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 需要传递total总条数和rows列表...
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#prodorderdg').datagrid('loaded');
				$("#prodorderdg").datagrid('loadData', obj);
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
	$('#prodOrder').textbox('initValue');
	$("#startTime").val("");
	$("#endTime").val("");
	$("#orderstatus").combobox('clear');
	seachKey = null;
	$("#orderstatus").combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
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
		} ]
	});
}
function formatterZT(value, row, index) {
	if (value == 0) {
		return '已取消';
	} else if (value == 1) {
		return '待支付';
	} else if (value == 2) {
		return '已支付';
	} else if (value == 3) {
		return '待发货';
	} else if (value == 4) {
		return '发货中';
	} else if (value == 5) {
		return '已发货';
	} else if (value == 6) {
		return '待收货';
	} else if (value == 7) {
		return '已收货';
	} else if (value == 8) {
		return '完成';
	}
}
function formatterCZ(value, row, index) {
	return '<a href="javascript:checkOrderDetail();" class="audit1">查看</a>';
}
//订单详情
function checkOrderDetail() {
	var row = $("#prodorderdg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要查看的订单', 'warning');
		return;
	}
	id = row.id;
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
				$("#orderDetail").dialog("open");
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
function toUploadOrder(entity) {
	$("#orderDetail span").remove();
	selectSp();
	$("#alliancename").append('<span>' + entity.orgName + '</span>');
	$("#ordernum").append('<span>' + entity.tradeNo + '</span>');
	$("#username").append('<span>' + entity.nickname + '</span>');
	var status = entity.status;
	if (status == 0) {
		status = '已取消';
	} else if (status == 1) {
		status = '待支付';
	} else if (status == 2) {
		status = '已支付';
	} else if (status == 3) {
		status = '待发货';
	} else if (status == 4) {
		status = '发货中';
	} else if (status == 5) {
		status = '已发货';
	} else if (status == 6) {
		status = '待收货';
	} else if (status == 7) {
		return '已收货';
	} else if (status == 8) {
		status = '完成';
	}
	var paytype = entity.payType;
	if (paytype == 1) {
		paytype = '平台余额支付';
	} else if (paytype == 2) {
		paytype = '银联支付';
	} else if (paytype == 4) {
		paytype = '支付宝支付';
	}else if (paytype == 5) {
		paytype = '微信支付';
	}else{
		paytype = '未知';
	}
	$("#showstatus").append('<span>' + status + '</span>');
	$("#phone").append('<span>' + entity.opMobile + '</span>');
	$("#ordertime").append('<span>' + entity.created + '</span>');
	$("#paytype").append('<span>' + paytype + '</span>');
	$("#paytime").append('<span>' + entity.payAt + '</span>');
	$("#consignee").append('<span>' + entity.name + '</span>');
	$("#cphone").append('<span>' + entity.tel1 + '</span>');
	$("#address").append('<span>' + entity.addrDetails + '</span>');
	$("#bbs").append('<span>' + entity.leaveMsg + '</span>');
	$("#totalmoney").append('<span>' + entity.goodsAmount + '</span>');
	$("#coupondeduction").append('<span>' + entity.reductionAmount + '</span>');
	$("#dealpayment").append('<span>' + entity.realAmount + '</span>');
	$('#orderspdg').datagrid('loading');
	var obj = {
			total : 1,
			rows : entity.list
		};
		$('#orderspdg').datagrid('loaded');
		$('#orderspdg').datagrid('loadData', obj);
	if (entity.ticklist == null) {
		$("#showlogist").hide();
	}else{
		$("#logistics").append('<span>' + entity.ticklist[0].name + '</span>');
		$("#logisticsnum").append('<span>' + entity.ticklist[0].sn + '</span>');
		if(entity.ticklist[0].sendTime != null){
			$("#deliverytime").append('<span>' + entity.ticklist[0].sendTime + '</span>');
		}
		if (entity.sellerMsg != null) {
			$("#cancelreason").append('<span>' + entity.sellerMsg + '</span>');
		}
		if (entity.cancelTime != null) {
			$("#canceltime").append('<span>' + entity.cancelTime + '</span>');
		}
		}
}
function selectSp() {
	$('#orderspdg').datagrid({
		rownumbers:true,
		singleSelect:true,
		striped:true,
		fitColumns:true,
	    columns:[[    
	        {field:'id',title:'商品编号',width:10,align:'center'},    
	        {field:'skuName',title:'商品名称',width:30,align:'center'},    
	        {field:'spec',title:'规格',width:10,align:'center'},   
	        {field:'size',title:'颜色',width:10,align:'center'},   
	        {field:'packName',title:'包装',width:10,align:'center'},   
	        {field:'priceDiscount',title:'单价',width:10,align:'center'},   
	        {field:'num',title:'购买数量',width:15,align:'center'},   
	        {field:'total',title:'小计',width:10,align:'center'},   
	    ]]    
	});  

}