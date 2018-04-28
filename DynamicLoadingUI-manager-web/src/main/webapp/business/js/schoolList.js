$(document).ready(function() {
	loginCheck1();
	$("#search_schoolName").val("");
	var p = $('#schoolListDg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [ 20, 30, 40 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			var schoolName = $("#search_schoolName").val();
			findSchoolList(pageNumber, pageSize, schoolName)
		},
	});
	findSchoolList(1, 20, "")
});

function findSchoolByName() {
	var schoolName = $("#search_schoolName").val();
	if (schoolName == '') {
		$.messager.alert('提示', '请输入需要查询的用户名', 'warning');
		return;
	}
	var p = $('#schoolListDg').datagrid('getPager');
	var options = p.data("pagination").options;
	var rows = options.pageSize;
	findSchoolList(1, rows, schoolName);
}
var shoolId = 0;
var oldOrdName = "";
var oldAddress = "";
var oldType = 0;
var adminid = ReadCookie("adminid");
//查看信息
function showShoolDetailInfo() {
	var row = $("#schoolListDg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要查看的学校', 'warning');
		return;
	}
	oldOrdName = row.orgName;
	oldAddress = row.address;
	oldType = row.type;
	shoolId = row.id;
	$("#upOrgName").textbox("setValue", row.orgName);
	$("#upAddress").textbox("setValue", row.address);
	$('#upType').combobox('setValue', row.type);
	$("#showShoolDetailinfo").dialog("open");
}

//修改信息
function updataShoolDetailInfo() {
	var schoolService = new SchoolService();
	var orgName = $("#upOrgName").val();
	var address = $("#upAddress").val();
	var type = $('#upType').combobox('getValue');
	if (oldOrdName == orgName &&
		oldAddress == address &&
		oldType == type) {
		$("#showShoolDetailinfo").dialog("close");
	} else {
		if (oldOrdName != orgName) {
			schoolService.checkOrgName(orgName, function(data) {
				if (data.status == "fail") {
					$.messager.alert('提示', data.msg, 'warning');
					return;
				} else {
					updataSchool();
					$.messager.alert('提示', '操作成功', 'warning');
				}
			}, function(data) {
				$.messager.alert('提示', '请求错误', 'warning');
			});
		} else {
			updataSchool();
		}
	}

}

function updataSchool() {
	var schoolService = new SchoolService();
	var orgName = $("#upOrgName").val();
	var address = $("#upAddress").val();
	var type = $('#upType').combobox('getValue');
	console.log(shoolId + "," + orgName + "," + address + "," + type)
	schoolService.uptSchool(shoolId, type, orgName, address, function(data) {
		if (data.status == "succeed") {
			$("#showShoolDetailinfo").dialog("close");
			initData();
			$.messager.alert('提示', '操作成功', 'warning');
		} else {
			$.messager.alert('提示', data.msg, 'warning');
		}

	}, function(data) {
		initData();
	});
}
//分页查询
function findSchoolList(page, rows, name) {
	var schoolService = new SchoolService();
	schoolService.findList(name, page, rows, function(data) {
		if (data.total != null && data.total != "") {
			var pageObjSchool = {
				total : data.total,
				rows : data.list
			};
			$('#schoolListDg').datagrid('loaded');
			$("#schoolListDg").datagrid('loadData', pageObjSchool);
		} else {
			nullData();
		}

	}, function(data) {
		nullData();
	})
}
function deleteSchool() {
	var row = $("#schoolListDg").datagrid("getSelected");
	if (row) {
		$.messager.confirm('请确认', '即将删除与' + row.orgName + '学校相关的信息．', function(a) {
			if (a) {
				var id = row.id;
				var schoolService = new SchoolService();
				schoolService.deleteSchool(id, function(data) {
					if (data.status == "succeed") {
						initData();
						$.messager.alert('提示', '删除成功', 'warning');
					}
				}, function() {})
			}
		})
	} else {
		$.messager.alert('提示', '请选择需要解除的学校信息列', 'warning');
	}
}
function initData() {
	var p = $('#schoolListDg').datagrid('getPager');
	var options = p.data("pagination").options;
	var rows = options.pageSize;
	var schoolName = $("#search_schoolName").val();
	findSchoolList(1, rows, schoolName);
}
function nullData() {
	var pageObjSchool = {
		total : 0,
		rows : []
	};
	$('#schoolListDg').datagrid('loaded');
	$("#schoolListDg").datagrid('loadData', pageObjSchool);
}
function formatterCZ(value, row, index) {
	if (value == 1) {
		return '<a href="javascript:freeze();" class="audit">冻结</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
			'<a href="javascript:deleteSchool();" class="audit">删除</a>';
	} else {
		return '<a href="javascript:unfreeze();" class="audit">解冻</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
			'<a href="javascript:deleteSchool();" class="audit">删除</a>';
	}
}
function freeze() {
	var row = $("#schoolListDg").datagrid("getSelected");
	if (row == null) {
		$.messager.alert('提示', '请选择需要冻结的学校', 'warning');
		return;
	}
	shoolId = row.id;
	toDispose(2);
	insertLog(adminid, 1, "冻结的学校：" + row.orgName, "学校列表");
}
function unfreeze() {
	var row = $("#schoolListDg").datagrid("getSelected");
	if (row == null) {
		$.messager.alert('提示', '请选择需要解冻的学校', 'warning');
		return;
	}
	shoolId = row.id;
	toDispose(1);
	insertLog(adminid, 1, "解冻的学校：" + row.orgName, "学校列表");
}
function toDispose(status) {
	$.ajax({
		url : '/gift-fly/system/activity/updateSchoolStatus',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			id : shoolId,
			status : status,
			adminid : adminid,
			node : "学校列表",
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 刷新当前页
				$('#schoolListDg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "修改成功！",
					title : "提示"
				});
				// 插入日志
				insertLog(adminid, 1, "修改加盟商:" + orgName, "加盟商列表");
			}else{
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
function formatterLX(value, row, index) {
	if (value == 3) {
		return '高中';
	} else if (value == 4) {
		return '大学';
	}
}
//清除搜索框
function clearSerachbox(value, name) {
	if (value == null || value == "") {
		return;
	}
	$('#search_schoolName').searchbox('clear');
	var p = $('#schoolListDg').datagrid('getPager');
	var options = p.data("pagination").options;
	var rows = options.pageSize;
	findSchoolList(1, rows);
	p.pagination('refresh', {
		total : count,
		pageNumber : 1
	});
}

//接口请求服务
function SchoolService() {
	// 请求url
	this.selectUrl = "system/activity/findSchoolList";
	this.uptUrl = "system/activity/uptSchoolInfo";
	this.delUrl = "system/activity/delSchoolInfo";
	this.checkUrl = "system/activity/checkOrgName";
}
;
SchoolService.prototype = {
	findList : function(name, page, rows, successFun, errorFun) {
		var params = {
			name : name,
			page : page,
			rows : rows
		};
		new RequestService().ajaxRequestPost(this.selectUrl, params,
			successFun, errorFun);
	},
	deleteSchool : function(id, successFun, errorFun) {
		let node = "学校列表";
		let adminId = ReadCookie("adminid");
		var params = {
			adminid : adminId,
			node : node,
			id : id
		};
		new RequestService().ajaxRequestPost(this.delUrl, params,
			successFun, errorFun);
	},
	uptSchool : function(shoolId, type, orgName, address, successFun, errorFun) {
		let node = "学校列表";
		let adminId = ReadCookie("adminid");
		var params = {
			adminid : adminId,
			node : node,
			id : shoolId,
			name : orgName,
			address : address,
			type : type
		};
		new RequestService().ajaxRequestPost(this.uptUrl, params,
			successFun, errorFun);
	},
	checkOrgName : function(orgName, successFun, errorFun) {
		var params = {
			name : orgName
		};
		new RequestService().ajaxRequestPost(this.checkUrl, params,
			successFun, errorFun);
	},
}