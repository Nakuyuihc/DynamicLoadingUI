$(document).ready(function() {
	loginCheck1();
	$("#tr_Reason").show();
	var p = $('#applyListDg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [ 20, 30, 40 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			let search_Name = $("#search_Name").val();
			let action = $('#cmb_Action').combobox('getValue');
			findApplyList(pageNumber, pageSize, action, search_Name);
		},
	});
	findApplyList(1, 20, 1, "")
	$("#search_Name").val("");
	$(":radio").click(function() {
		let status = $(this).val()
		if (status == 2) {
			$("#tr_Reason").show();
		} else {
			$("#tr_Reason").hide();
		}
	});
	$("#cmb_Action").combobox({
		onChange : function(n, o) {
			if (n == 1) {
				$('#search_Name').searchbox({
					prompt : '请输入用户名称进行查询'
				});
			} else {
				$('#search_Name').searchbox({
					prompt : '请输入学校名称进行查询'
				});
			}
		}
	});
});

function findApplyListByNameAndAction() {
	let action = $('#cmb_Action').combobox('getValue');
	let search_Name = $("#search_Name").val();
	console.log(action);
	console.log(search_Name);
	var p = $('#applyListDg').datagrid('getPager');
	var options = p.data("pagination").options;
	var rows = options.pageSize;
	findApplyList(1, rows, action, search_Name);
}
//分页查询
function findApplyList(page, rows, action, name) {
	var applyListService = new ApplyListService();
	applyListService.findList(name, action, page, rows, function(data) {
		if (data.total != null && data.total != "") {
			var pageObjApply = {
				total : data.total,
				rows : data.list
			};
			$('#applyListDg').datagrid('loaded');
			$("#applyListDg").datagrid('loadData', pageObjApply);
		} else {
			nullData();
		}

	}, function(data) {
		nullData();
	})
}
var applyId = 0;
function showApplyInfo() {
	var row = $("#applyListDg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要查看的圈子记录', 'warning');
		return;
	}
	applyId = row.id;
	console.log(row);
	$('#td_ActivityOrgName').html("");
	$('#td_NickName').html("");
	$('#td_SubmiterName').html("");
	$('#td_Tel1').html("");
	$('#td_MemberNames').html("");
	$('#td_ApplyDesc').html("");
	//var schooltype = $('.radio_view input[name="hot"]:checked ').val();
	$('#td_Tel1').html("");
	$('#td_MemberNames').html("");
	$('#td_ApplyDesc').html("");
	
	$('#imageUrls img').remove();
	$('#idCardImages img').remove();
	$('#schoolCardImages img').remove();
	
	let imageUrls = '<img class="authorImagePath" alt="" src="'+row.imageUrls+'">'
	let idCardImages = '<img class="authorImagePath" alt="" src="'+row.idCardImages+'">'
	let schoolCardImages = '<img class="authorImagePath" alt="" src="'+row.schoolCardImages+'">'
	$('#imageUrls').append(imageUrls);
	$('#idCardImages').append(idCardImages);
	$('#schoolCardImages').append(schoolCardImages);
	
	$('#td_ActivityOrgName').append(row.activityOrgName);
	$('#td_NickName').append(row.nickName);
	$('#td_SubmiterName').append(row.submiterName);
	$('#td_Tel1').append(row.tel1);
	$('#td_MemberNames').append(row.memberNames);
	$('#td_ApplyDesc').append(row.applyDesc);
	$(":radio[name='status']").each(function() {
		var $this = $(this);
		if (row.status == $this.val()) {
			$this.attr("checked", "checked");
		}
	});
	if (row.status == 2) {
		$("#tr_Reason").show();
	} else {
		$("#tr_Reason").hide();
	}
	$('#showApplyDetailInfo').dialog('open');
}

function updateStatus() {
	let status = $('input[name="status"]:checked ').val();
	let reason = $("#upReason").val();
	if (status == 2) {
		if (reason == "" || reason == null) {
			$.messager.alert('提示', '请填写不通过的理由', 'warning');
			return;
		}
	} else {
		reason = "";
	}
	let id = applyId;
	var applyListService = new ApplyListService();
	applyListService.updateStatus(id, status, reason, function(data) {
		if (data.status == "succeed") {
			$.messager.alert('提示', '审核成功', 'warning');
			$('#showApplyDetailInfo').dialog('close');
			findApplyListByNameAndAction();
		} else {
			$.messager.alert('提示', '审核失败', 'warning');
		}
	}, function(data) {
		$.messager.alert('提示', '请求服务器失败', 'warning');
	});
}
function nullData() {
	var pageObjApply = {
		total : 0,
		rows : []
	};
	$('#applyListDg').datagrid('loaded');
	$("#applyListDg").datagrid('loadData', pageObjApply);
}
function formatterCZ(value, row, index) {
	return '<a href="javascript:showApplyInfo();" class="audit">查看信息</a>';
}

function formatterZT(value, row, index) {
	//0待审核，1审核通过，2审核不通过 
	if (value == 1) {
		return "审核通过";
	} else if (value == 2) {
		return "审核不通过";
	} else {
		return "待审核";
	}
}
//清除搜索框
function clearSerachbox(value, name) {
	if (value == null || value == "") {
		return;
	}
	$('#search_Name').searchbox('clear');
	var p = $('#applyListDg').datagrid('getPager');
	var options = p.data("pagination").options;
	var rows = options.pageSize;
	findApplyList(1, rows, 1, "");
}
//接口请求服务
function ApplyListService() {
	// 请求url
	this.selectUrl = "system/activity/findApplyList";
	this.updaUrl = "system/activity/updateStatus";
}
;
ApplyListService.prototype = {
	findList : function(name, action, page, rows, successFun, errorFun) {
		var params = {
			name : name,
			action : action,
			page : page,
			rows : rows
		};
		new RequestService().ajaxRequestPost(this.selectUrl, params,
			successFun, errorFun);
	},
	updateStatus : function(id, status, reason, successFun, errorFun) {
		let node = "申请列表";
		let adminId = ReadCookie("adminid");
		var params = {
			node : node,
			adminid : adminId,
			id : id,
			status : status,
			reason : reason
		};
		new RequestService().ajaxRequestPost(this.updaUrl, params,
			successFun, errorFun);
	},
}