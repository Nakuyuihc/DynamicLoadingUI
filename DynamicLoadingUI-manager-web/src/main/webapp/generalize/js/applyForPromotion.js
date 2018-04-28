$(document).ready(function() {
	loginCheck1();
	var p = $('#applyForPromotiondg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [20,30,40],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findList(pageNumber, pageSize,status);
		},
	});
	box();
	findList(1, 20,status);
	
});
var status = 0;
var adminid = ReadCookie("adminid");
var username = ReadCookie("username");
var id;
var userId;
var toid=-1;
var applyId;
var lognote;
var mobile;
// 分页查询
function findList(page, rows,status) {
	$('#applyForPromotiondg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/mkt/marketerApplyList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			type : status,
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 需要传递total总条数和rows列表...
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#applyForPromotiondg').datagrid('loaded');
				$("#applyForPromotiondg").datagrid('loadData', obj);
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
		return '审核中';
	} else if (value == 2) {
		return '通过';
	} else if (value == 3) {
		return '驳回';
	} else if (value == 4){
		return '完成';
	}else if (value == 5){
		return '取消';
	}else if (value == 6){
		return '转处理';
	}
}
function formatterCZ(value, row, index) {
	if (row.status == 1) {
		return '<a href="javascript:applyInfo();" class="audit">申请信息</a>&nbsp;&nbsp;&nbsp;&nbsp'+
		'<a href="javascript:userInfo();" class="audit">会员详情</a>';
	}else {
		return '<a href="javascript:userInfo();" class="audit">会员详情</a>';
	}
}
function formattersex(value, row, index) {
	if (value ==1) {
		return '男';
	} else if (value == 2) {
		return '女';
	} else {
		return '未知';
	}
}
function applyInfo() {
	var row = $("#applyForPromotiondg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要审核的数据列', 'warning');
	}
	$("#showApplyInfo span").remove();
	$("#IDfront img").remove();
	$("#IDcontrary img").remove();
	id=row.id;
	userId = row.userId;
	statusBefore = row.status;
	var sex;
	if(row.sex ==1){
		sex="男";
	}else if(row.sex ==2){
		sex="女";
	}else{
		sex="未知";
	}
	$("#realname").append("<span>姓名："+row.name+"</span>");
	$("#sex").append("<span>性别："+sex+"</span>");
	$("#job").append("<span>职业："+row.job+"</span>");
	$("#idcard").append("<span>身份证："+row.idCardCode+"</span>");
	$("#email").append("<span>邮箱："+row.email+"</span>");
	$("#phone").append("<span>手机号："+row.openId+"</span>");
	if(row.idCardImageId != 0){
		$.ajax({
			url : '/gift-fly/system/upload/selectImg',
			dataType : "json",
			type : "post",
			data : {
				id : row.idCardImageId,
			},
			success : function(data) {
				if (data.status == "succeed") {
					$("#IDfront").append(
						'<img src="'+data.entity.accessUrl+'"style="width: 160px;height:110px;">');
				}
			},
		});
	}
	if(row.idCardOwnerImageId != 0){
		$.ajax({
			url : '/gift-fly/system/upload/selectImg',
			dataType : "json",
			type : "post",
			data : {
				id : row.idCardOwnerImageId,
			},
			success : function(data) {
				if (data.status == "succeed") {
					$("#IDcontrary").append(
							'<img src="'+data.entity.accessUrl+'"style="width: 160px;height:110px;">');
				}
			},
		});
	}
	$("#showApplyInfo").dialog("open");
}
function pass() {
	var row = $("#applyForPromotiondg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选推广员', 'warning');
		return;
	}
		mobile = row.openId;
		$.messager.confirm('请确认', '确认通过该推广员的申请吗?',function(b) {
			if (b) {
				lognote="审核推广员申请:通过申请";
				updateStatus(id,"","",1,2,applyId,lognote);
			}
		});
}
function noPass() {
	var row = $("#applyForPromotiondg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选推广员', 'warning');
		return;
	}
		mobile = row.openId;
	$("#nopassReason").dialog("open");
}
function saveNopass() {
	var description = $("#description").val();
	lognote="审核推广员申请:不通过申请,原因"+description;
	updateStatus(id,"",description,1,3,applyId,lognote);
}
function updateStatus(id,comment,description,statusBefore,statusAfter,applyId,lognote) {
	$.ajax({
		url : '/gift-fly/system/mkt/updateStatus',
		dataType : "json",
		type : "post",
		data : {
			applyInfoId : id,
			applyUserId : userId,
			adminUserId : adminid,
			opUserName : username,
			statusBefore : statusBefore,
			statusAfter : statusAfter,
			remark : description,
			mobile : mobile,
			node : "推广员申请",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$('#applyForPromotiondg').datagrid('getPager').pagination('select');
				$("#showApplyInfo").dialog("close");
				$('#nopassReason').dialog('close');
				//插入日志
				insertLog(adminid, 1, lognote, "推广员申请");
			} 
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//获取会员的详细信息
function userInfo() {
	var row = $("#applyForPromotiondg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要查看的推广员', 'warning');
		return;
	}
	id = row.id;
	$.ajax({
		url : '/gift-fly/system/mkt/marketerApplyDetail',
		dataType : "json",
		type : "post",
		data : {
			id : id,
		},
		success : function(data) {
			if (data.status == "succeed") {
				showuserInfo(data.entity);
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
	
}

//查看信息
function showuserInfo(entity) {
	$("#headPortrait img").remove();
	$("#cardimg img").remove();
	$("#showdetailinfo span").remove();
	$("#usernickname").append('<span>' + entity.nickname + '</span>');
	$("#userbirthday").append('<span>' +formatTime(entity.birthday)+ '</span>');
	if (entity.sex == 0) {
		$("#usersex").append('<span>' + "未知" + '</span>');
	} else if (entity.sex == 1) {
		$("#usersex").append('<span>' + "男" + '</span>');
	} else {
		$("#usersex").append('<span>' + "女" + '</span>');
	}
	$("#userarea").append('<span>' + entity.city + '</span>');
	$("#userid").append('<span>' + entity.userId + '</span>');
	$("#userphone").append('<span>' + entity.phone + '</span>');
	$("#userregister").append('<span>' +formatTime(entity.register) + '</span>');
	$("#bmoney").append('<span>' + entity.account + '元</span>');
	$("#begg").append('<span>' + entity.birdegg + '</span>');
	$("#blove").append('<span>' + entity.love + '</span>');
	$("#username").append('<span>' + entity.name + '</span>');
	$("#userjob").append('<span>' + entity.job + '</span>');
	$("#usercard").append('<span>' + entity.idCode + '</span>');
	$("#useremail").append('<span>' + entity.email + '</span>');
	var image = entity.userUrl;
	if(entity.userUrl != null){
		$("#headPortrait").append('<img src="' +entity.userUrl + '" style="width: 180px;height: 180px;"/>');
	}
	if(entity.imageUrl != null || entity.ownerImageUrl != null){
		$("#cardimg").append('<img src="'+entity.imageUrl+'"style="width: 200px;height:150px;margin-right:50px;">'+
				'<img src="'+entity.ownerImageUrl+'"style="width: 200px;height:150px;">');
		
	}
	$("#showdetailinfo").dialog("open");
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
			"text" : "审核中"
		}, {
			"id" : 2,
			"text" : "通过"
		}, {
			"id" : 3,
			"text" : "驳回"
		}]
	});
}
function findByDate() {
	var p = $('#applyForPromotiondg').datagrid('getPager');
	var options = p.data("pagination").options;
	var page = options.pageNumber;
	var rows = options.pageSize;
	status = $('#statusbox').combobox('getValue');
	findList(page, rows,status);
}