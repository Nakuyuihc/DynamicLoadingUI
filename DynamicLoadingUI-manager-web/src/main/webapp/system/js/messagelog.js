$(document).ready(function() {
	loginCheck1();
	$("#xm").val("");
	 $("#startTime").val("");
	var p = $('#logdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [20,25,30],
		beforePageText : '第',//页数文本框前显示的汉字  
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			queryPagingInfo(pageNumber, pageSize,username,startTime);
		}
	});
	queryPagingInfo(1, 20,username,startTime);
});
var username ='';
var startTime =''; 
//获取分页日志信息
function queryPagingInfo(page, rows,username,startTime) {
	$('#logdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/cisweb/selectInfo',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			mobile : username,
			startTime : startTime,
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
	$.messager.alert('提示', '请输入要查询的手机号或时间', 'warning');
	return;
 }
 queryPagingInfo(page, rows,username,startTime);
}
function formatterLX(value, row, index) {
	if (value==1) {
		return "用户注册短信验证码";
	}else if (value == 2) {
		return "重新绑定手机";
	}else if (value == 3) {
		return "用户重置登陆密码短信验证码";
	}else if (value == 4) {
		return "用户设置支付密码短信验证码";
	}else if (value == 5) {
		return "第三方注册绑定手机";
	}else if (value == 6) {
		return "平台后台登陆验证码";
	}else if (value == 7) {
		return "后台审核验证码";
	}else if (value == 8) {
		return "邮箱验证";
	}else if (value == 20) {
		return "订单已经开始配送";
	}else if (value == 21) {
		return "机构（门店加盟商）提现验证码";
	}else if (value == 22) {
		return "用户绑定银行卡";
	}else if (value == 23) {
		return "用户提现";
	}
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
