$(document).ready(function() {
	loginCheck1();
	var p = $('#accountdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [ 20, 30, 40 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页 共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录 共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findList(pageNumber, pageSize);
		}
	});
	findList(1, 20);
});
var name;
var list;
var id;
var userid;
var adminid = ReadCookie("adminid");
// 分页查询
function findList(page, rows) {
	$('#accountdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/cisWeb/webAdminList',
		dataType : "json",
		type : "post",
		data : {
			pageIndex : page,
			pageSize : rows,
			orgId : 0,
		},
		success : function(data) {
			// 需要传递total总条数和rows列表...
			var obj = {
				total : data.total,
				rows : data.mapList
			};
			$('#accountdg').datagrid('loaded');
			$("#accountdg").datagrid('loadData', obj);
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//新增帐号对话框
function addAcc() {
	 //角色的下拉列表
		$.ajax({
			url : '/gift-fly/system/cisrole/selectRoleInfo',
			dataType : "json",
			type : "post",
			async: false,
			data : {},
			success : function(data) {
					$('#addyhjs').combobox({
						panelHeight : 'auto',
						valueField : 'id',
						textField : 'name',
						data : data,
						onLoadSuccess : function() {
							var data = $('#addyhjs').combobox('getData');
							if (data.length > 0) {
								$('#addyhjs').combobox('select', data[0].id);
							}
						}
					});
			},
			error : function(err) {
				$.messager.alert('提示', '系统异常！', 'error');
			}
		});
	$("#addname").textbox("setValue", "");
	$("#password").textbox("setValue", "");
	$("#rePassword").textbox("setValue", "");
	$("#addAccount").dialog("open");
	$("#updateAccount").dialog("close");
}
//确定保存
function saveInfo() {
	// 判断表单是否通过验证
	var valid = $('#add_from').form('validate');
	if (!valid) {
		return valid;
	}
	// 获取表单af中的值并转化
	var afInfo = $("#add_from").serializeArray();
	var username = afInfo[0].value;
	var password = afInfo[1].value;
	var rolecode = afInfo[2].value;
	$.ajax({
		url : '/gift-fly/cisWeb/webRegist',
		dataType : "json",
		type : "post",
		data : {
			name : username,
			password : password,
			roleid : rolecode,
			adminid : adminid,
			orgId : 0,
			node : "帐号管理",
		},
		success : function(data) {
			if (data.MSG == "注册成功") {
				$("#addAccount").dialog("close");
				// 刷新当前页
				$('#accountdg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "添加成功！",
					title : "提示",
				});
				//插入日志
				insertLog(adminid, 1, "新增帐号:" + username, "帐号管理");
			} else {
				$('#accountdg').datagrid('loaded');
				$.messager.alert('提示', data.MSG, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//编辑对话框
function updateRole() {
	var row = $("#accountdg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要编辑的帐号！', 'warning');
		return;
	}
	name = row.name;
	id = row.userid;
	// 用户角色的下拉列表
		$.ajax({
			url : '/gift-fly/system/cisrole/selectRoleInfo',
			dataType : "json",
			type : "post",
			async: false,
			data : {},
			success : function(data) {
					$('#upyhjs').combobox({
						panelHeight : 'auto',
						valueField : 'id',
						textField : 'name',
						data : data,
					});
			},
			error : function(err) {
				$.messager.alert('提示', '系统异常！', 'error');
			}
		});
		$('#update_from').form('load', {
			rolecode : row.rolename,
		});
	$("#upname span").remove();
	$("#upname").append("<span>" + name + "</span>");
	$("#updateAccount").dialog("open");
	$("#addAccount").dialog("close");
}
//保存编辑
function updateInfo() {
	var ffInfo = $("#update_from").serializeArray();
	var pw = ffInfo[0].value;
	var roleid = ffInfo[2].value;
	if (pw == '' || pw == null) {
		$.messager.alert('提示', '请输入密码！', 'warning');
		return false;
	}
	$.ajax({
		url : '/gift-fly/cisWeb/webUpdateUser',
		dataType : "json",
		type : "post",
		data : {
			userid : userid,
			password : pw,
			roleid : roleid,
			adminid : adminid,
			adminid : "帐号管理",
		},
		success : function(data) {
			if (data.MSG == "修改成功") {
				$("#updateAccount").dialog("close");
				// 刷新当前页
				$('#accountdg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "修改成功！",
					title : "提示",
				});
				//插入日志
				insertLog(adminid, 1, "修改帐号:" +name, "帐号管理");
			} else {
				$('#accountdg').datagrid('loaded');
				$.messager.alert('提示', data.MSG, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//删除
function deleteRole() {
	// 获得选中的项
	var row = $("#accountdg").datagrid("getSelected");
	if (row) {
		$.messager.confirm('请确认', '删除后该用户将无法使用后台系统吗？', function(b) {
			if (b) {
				userid = row.userid;
				$.ajax({
					url : '/gift-fly/cisWeb/webDeleteUser',
					dataType : "json",
					type : "post",
					data : {
						userid : userid,
						adminid : adminid,
						node : "帐号管理",
					},
					success : function(data) {
						if (data.MSG == "删除成功") {
							$("#accountdg").datagrid('unselectAll');
							$('#accountdg').datagrid('getPager').pagination('select');
							$.messager.show({
								timeout : 500,
								msg : '删除成功',
								title : '提示',
							});
							insertLog(adminid, 1, "删除帐号：" + row.name, "角色权限");
						} else {
							$("#accountdg").datagrid('rejectChanges');
							$.messager.alert('错误', '删除失败!', 'error');
						}
					},
					error : function(err) {
						$.messager.alert('提示', '系统异常！', 'error');
					}
				});
			}
		});
	} else {
		$.messager.alert('提示', '请选择要删除的角色', 'warning');
	}
}
function formatterCZ(value, row, index) {
	if (row.rolename=="超级管理员") {
		return "";
	}else if (value == 1) {
		return '<a href="javascript:forbidden();" class="audit">禁用</a>&nbsp;&nbsp;' +
			'<a href="javascript:updateRole();" class="audit">编辑</a>&nbsp;&nbsp;' +
			'<a href="javascript:deleteRole();" class="audit">删除</a>';
	} else {
		return '<a href="javascript:startusing();" class="audit">启用</a>&nbsp;&nbsp;' +
			'<a href="javascript:updateRole();" class="audit">编辑</a>&nbsp;&nbsp;' +
			'<a href="javascript:deleteRole();" class="audit">删除</a>';
	}
}
function formatterZT(value, row, index) {
	if (value == 1) {
		return '正常'
	} else {
		return '停用'
	}
}
//禁用
function forbidden() {
	updatestatus(2);
}
//启用
function startusing() {
	updatestatus(1);
}
function updatestatus(status) {
	// 获得选中的项
	var row = $("#accountdg").datagrid("getSelected");
	var flag;
	var cont;
	if (status == 2) {
		flag ="您确定要禁用该帐号吗?确定后该帐号将不能正常使用";
		cont="禁用";
	}else{
		flag ="您确定要启用该帐号吗?确定后该帐号立即生效";
		cont="启用";
	}
	if (row) {
		$.messager.confirm('请确认', flag, function(b) {
			if (b) {
				userid = row.userid;
				$.ajax({
					url : '/gift-fly/cisWeb/updateUserStatus',
					dataType : "json",
					type : "post",
					data : {
						userid : userid,
						status : status,
						adminid : adminid,
						node : "帐号管理",
					},
					success : function(data) {
						if (data.STATUS == "SUCCESS") {
							// 刷新当前页
							$('#accountdg').datagrid('getPager').pagination('select');
							$.messager.show({
								timeout : 500,
								msg : "修改成功！",
								title : "提示",
							});
							//插入日志
							insertLog(adminid, 1, cont +":"+row.name, "帐号管理");
						} else {
							$('#accountdg').datagrid('loaded');
							$.messager.alert('提示', data.MSG, 'error');
						}
					},
					error : function(err) {
						$.messager.alert('提示', '系统异常！', 'error');
					}
				});
			}
		});
	} else {
		$.messager.alert('提示', '请选择要'+cont+'的用户', 'warning');
	}
	
}