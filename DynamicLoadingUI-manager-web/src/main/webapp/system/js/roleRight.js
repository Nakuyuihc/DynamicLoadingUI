$(document).ready(function() {
	loginCheck1();
	var p = $('#roledg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [ 20, 30, 50 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页 共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录 共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findRoleList(pageNumber, pageSize);
		}
	});
	findRoleList(1, 20);
});
var name;
var list;
var id;
var adminid = ReadCookie("adminid");
var verifyName; //检测角色名是否可用
// 分页查询
function findRoleList(page, rows) {
	$('#roledg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/cisrole/getRoleList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			orgId : 0,
			type : 1,
		},
		success : function(data) {
			// 需要传递total总条数和rows列表...
			var obj = {
				total : data.total,
				rows : data.list
			};
			$('#roledg').datagrid('loaded');
			$("#roledg").datagrid('loadData', obj);
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//新增角色对话框
function addRole() {
	$("#add_role_name").textbox("setValue","");
	$("#add_description").textbox("setValue","");
	$('#addngqx').tree({
		url : 'js/jurisdictionlist.json',
		checkbox : true,
		animate : true,
	});
	$("#addRole").dialog("open");
}
//编辑角色对话框
function updateRole() {
	var row = $("#roledg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要编辑的角色！', 'warning');
		return false;
	}
	name = row.name;
	id = row.id;
	$('#updatengqx').tree({
		url : 'js/jurisdictionlist.json',
		checkbox : true,
		animate : true,
		onLoadSuccess : function(node, data) {
			//获取该角色下的所有权限
			$.ajax({
				url : '/gift-fly/system/cisrole/getCisRoleListByName',
				dataType : "json",
				type : "post",
				async : false,
				data : {
					name : name,
					orgId : 0,
					type : 1,
				},
				success : function(data) {
					if (data.list != null) {
						list = data.list;
						for (x in list) {
							if (list[x] == "all") {
								var roots = $('#updatengqx').tree('getRoots');
								for (var i = 0; i < roots.length; i++) {
									var node = $('#updatengqx').tree('find', roots[i].id); //查找节点  
									$('#updatengqx').tree('check', node.target); //将得到的节点选中  
								}
							} else {
								var node = $("#updatengqx").tree("find", list[x]); //重点方法  
								if (node != null) {
									$("#updatengqx").tree("check", node.target);
								}
							}
						}
					}
				},
				error : function(err) {}
			});
		}
	});
	$('#update_fr').form('load', {
		update_role_name : name,
		description : row.description,
	});
	$("#update_role_name").textbox({
		disabled : true
	});

	$("#updateRole").dialog("open");
}
//删除角色
function deleteRole() {
	// 获得选中的项
	var row = $("#roledg").datagrid("getSelected");
	if (row) {
		$.messager.confirm('请确认', '该角色下的用户将失效，您确定要删除当前所选择的角色吗？', function(b) {
			if (b) {
				id = row.id;
				$.ajax({
					url : '/gift-fly/system/cisrole/deleteRole',
					dataType : "json",
					type : "post",
					data : {
						id : id,
						adminid : adminid,
						node : "角色权限",
					},
					success : function(data) {
						if (data.status == "succeed") {
							$("#roledg").datagrid('unselectAll');
							$('#roledg').datagrid('getPager').pagination('select');
							$.messager.show({
								timeout : 500,
								msg : '删除成功',
								title : '提示',
							});
							var name = row.name;
							insertLog(adminid, 1, "删除角色：" + name, "角色权限");
						} else {
							$("#roledg").datagrid('rejectChanges');
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
function forbidden() {
	// 获得选中的项
	var row = $("#roledg").datagrid("getSelected");
	if (row) {
		$.messager.confirm('请确认', '该角色下的用户将失效，您确定要禁用当前所选择的角色吗？', function(b) {
			if (b) {
				id = row.id;
				$.ajax({
					url : '/gift-fly/system/cisrole/updateStatus',
					dataType : "json",
					type : "post",
					data : {
						id : id,
						status : 0,
						adminid : adminid,
						node : "角色权限",
					},
					success : function(data) {
						if (data.status == "succeed") {
							$("#roledg").datagrid('unselectAll');
							$('#roledg').datagrid('getPager').pagination('select');
							$.messager.show({
								timeout : 500,
								msg : '禁用成功',
								title : '提示',
							});
							insertLog(adminid, 1, "禁用角色：" + row.name, "角色权限");
						} else {
							$("#roledg").datagrid('rejectChanges');
							$.messager.alert('错误', '禁用失败!', 'error');
						}
					},
					error : function(err) {
						$.messager.alert('提示', '系统异常！', 'error');
					}
				});
			}
		});
	} else {
		$.messager.alert('提示', '请选择要禁用的角色', 'warning');
	}
}
function startusing() {
	// 获得选中的项
	var row = $("#roledg").datagrid("getSelected");
	if (row) {
		$.messager.confirm('请确认', '该角色下的用户将恢复，您确定要恢复当前所选择的角色吗？', function(b) {
			if (b) {
				id = row.id;
				$.ajax({
					url : '/gift-fly/system/cisrole/updateStatus',
					dataType : "json",
					type : "post",
					data : {
						id : id,
						status : 1,
						adminid : adminid,
						node : "角色权限",
					},
					success : function(data) {
						if (data.status == "succeed") {
							$("#roledg").datagrid('unselectAll');
							$('#roledg').datagrid('getPager').pagination('select');
							$.messager.show({
								timeout : 500,
								msg : '恢复成功',
								title : '提示',
							});
							var name = row.name;
							insertLog(adminid, 1, "恢复角色：" + name, "角色权限");
						} else {
							$("#roledg").datagrid('rejectChanges');
							$.messager.alert('错误', '恢复失败!', 'error');
						}
					},
					error : function(err) {
						$.messager.alert('提示', '系统异常！', 'error');
					}
				});
			}
		});
	} else {
		$.messager.alert('提示', '请选择要恢复的角色', 'warning');
	}
}
function formatterOper(value, row, index) {
		if (row.name == "超级管理员") {
			return "";
		} else if (row.status == 0) {
			return '<a href="javascript:startusing();" class="audit">启&nbsp;&nbsp;用</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
				'<a href="javascript:updateRole();" class="audit">查&nbsp;&nbsp;看</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
				'<a href="javascript:deleteRole();" class="audit">删&nbsp;&nbsp;除</a>';
		} else {
			return '<a href="javascript:forbidden();" class="audit">禁&nbsp;&nbsp;用</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
				'<a href="javascript:updateRole();" class="audit">查&nbsp;&nbsp;看</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
				'<a href="javascript:deleteRole();" class="audit">删&nbsp;&nbsp;除</a>';
		}
}
function formatterstatus(value, row, index) {
	if (value == 1) {
		return '正常'
	} else {
		return '停用'
	}
}
function saveRole() {
	var role_name = $("#add_role_name").val();
	var description = $("#add_description").val();
	var manage;
	if (role_name == "超级管理员") {
		manage = "all";
	} else {
		var array = [];
		// 循环取出tree中权限的编码
		var nodes = $('#addngqx').tree('getChecked');
		if (nodes.length < 1) {
			$.messager.alert('提示', '功能权限没有选', 'error');
			return;
		}
		for (var i = 0; i < nodes.length; i++) {
			array.push(nodes[i].text);
		}
		var manage = array.join(",");
	}
	var node = "角色权限";
	$.ajax({
		url : '/gift-fly/system/cisrole/insertAndUpdateRole',
		dataType : "json",
		type : "post",
		data : {
			name : role_name,
			manage : manage,
			type : 1,
			orgId:0,
			description : description,
			adminid : adminid,
			node : node,
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#addRole").dialog("close");
				$('#roledg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "保存成功！",
					title : "提示"
				});
				insertLog(adminid, 1, "新增角色:"+name, "角色权限");
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常', 'error');
		}
	});
}
function saveupdateRole() {
	var role_name = $("#update_role_name").val();
	var description = $("#up_description").val();
	var array = [];
	// 循环取出tree中权限的编码
	var nodes = $('#updatengqx').tree('getChecked');
	if (nodes.length < 1) {
		$.messager.alert('提示', '功能权限没有选', 'error');
		return;
	}
	for (var i = 0; i < nodes.length; i++) {
		array.push(nodes[i].text);
	}
	var manage = array.join(","); //JSON.stringify(array);
	var node = "角色权限";
	$.ajax({
		url : '/gift-fly/system/cisrole/insertAndUpdateRole',
		dataType : "json",
		type : "post",
		data : {
			name : role_name,
			description : description,
			manage : manage,
			adminid : adminid,
			node : node,
			id : id,
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#updateRole").dialog("close");
				$('#roledg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "修改成功！",
					title : "提示"
				});
				insertLog(adminid, 1, "修改角色:" + name, "角色权限");
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常', 'error');
		}
	});
}
/**
 * 验证扩展
 */
$.extend($.fn.validatebox.defaults.rules, {
	length : {
		validator : function(value, param) {
			var len = $.trim(value).length;
			return len >= param[0] && len <= param[1];
		},
		message : "输入内容长度必须介于{0}和{1}之间！"
	},
	maxlength : {
		validator : function(value, param) {
			return value.length < param[0] + 1;
		},
		message : "不可超过{0}个字符！"
	},
});