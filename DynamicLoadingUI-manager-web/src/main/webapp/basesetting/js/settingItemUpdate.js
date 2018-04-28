$(document).ready(function() {
	loginCheck1();
	findList();
});
var id;
var name=ReadCookie("nickname");
var value;
var settingkey = ReadCookie("settingkey");
var settingid = ReadCookie("settingid");
var time = ReadCookie("time");
var editor = ReadCookie("username");
var adminid = ReadCookie("adminid");
var node = ReadCookie("node");
var sort;

// 分页查询
function findList() {
	$('#settingkey').html(settingkey);
	$('#settingtime').html(time);
	$('#settingname').html(name);
	$('#itemdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/params/getItemParams',
		dataType : "json",
		type : "post",
		data : {
			key : settingkey,
		},
		success : function(data) {
			var obj = {
				rows : data
			};
			$('#itemdg').datagrid('loaded');
			$("#itemdg").datagrid('loadData', obj);
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}

//操作
function formatterCZ() {
	return '<a href="javascript:updateitem();" class="audit">修&nbsp;&nbsp;改</a>&nbsp;&nbsp;&nbsp;&nbsp' +
		'<a href="javascript:delitem();" class="audit">删&nbsp;&nbsp;除</a>';
}
function delitem() {
	var row = $("#itemdg").datagrid("getSelected");
	if (row) {
		id = row.id;
		$.messager.confirm('请确认', '确定要删除该参照项参数', function(b) {
			if (b) {
				$.ajax({
					url : '/gift-fly/system/params/delItemParams',
					dataType : "json",
					type : "post",
					data : {
						id : id,
						adminid : adminid,
						key : settingkey,
						node : node,
					},
					success : function(data) {
						if (data.status == "succeed") {
							$("#itemdg").datagrid('unselectAll');
							findList();
							$.messager.show({
								timeout : 500,
								msg : '删除成功',
								title : '提示',
							});
							insertLog(adminid, 1, "删除参数项：" + settingkey+"的参数:"+id, node);
						} else {
							$("#itemdg").datagrid('rejectChanges');
							$.messager.alert('错误', data.msg, 'error');
						}
					},
					error : function(err) {
						$.messager.alert('提示', '系统异常！', 'error');
					}
				});
			}
		});
	} else {
		$.messager.alert('提示', '请选择需要删除的参数', 'warning');
	}
}
//修改对话框
function updateitem() {
	var row = $("#itemdg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要修改的参照项', 'warning');
		return false;
	}
	id = row.id;
	name = row.name;
	value = row.value;
	sort = row.sort;
	$('#itemid').html(id);
	$('#itemname').html(name);
	$('#updateitem').form('load', {
		value : value,
		sort : sort,
	});
	$("#updatevalue").dialog("open");
}
//确定保存修改信息
function updateItem() {
	// 判断表单是否通过验证
	var valid = $('#updateitem').form('validate');
	if (!valid) {
		return valid;
	}
	var sort = $("#sort").val();
	var newvalue = $("#val").val();
	$.ajax({
		url : '/gift-fly/system/params/updateItemParams',
		dataType : "json",
		type : "post",
		data : {
			id : id,
			value : newvalue,
			key : settingkey,
			sort : sort,
			adminid : adminid,
			node : node,
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#updatevalue").dialog("close");
				// 刷新当前页
				findList();
				$.messager.show({
					timeout : 500,
					msg : "修改成功！",
					title : "提示"
				});
				//保存日志
				insertLog(adminid, 1, "修改参照项:" + id,node);
			} else {
				$('#itemdg').datagrid('loaded');
				$.messager.alert('提示', '修改失败！', 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}

function addItem() {
	$("#updatevalue").dialog("close");
	$("#updatesort").dialog("close");
	$("#insertinfo").dialog("open");
}
function insertinfo() {
	// 判断表单是否通过验证
	var valid = $('#insertietform').form('validate');
	if (!valid) {
		return valid;
	}
	var info = $("#insertietform").serializeArray();
	var addname = $('#addname').val();
	var value = $("#itemvalue").val();
	var sort = $("#itemsort").val();
	$.ajax({
		url : '/gift-fly/system/params/insertInfo',
		dataType : "json",
		type : "post",
		data : {
			name : addname,
			value : value,
			sort : sort,
			adminid : adminid,
			settingId : settingid,
			key : settingkey,
		},
		success : function(data) {
			if (data == 1) {
				findList();
				$("#insertinfo").dialog("close");
				// 刷新当前页
				$.messager.show({
					timeout : 500,
					msg : "修改成功！",
					title : "提示"
				});
				//保存日志
				insertLog(adminid, 1, "新增：" + addname, "系统参数管理:" + settingkey);
			} else {
				$('#itemdg').datagrid('loaded');
				$.messager.alert('提示', '修改失败！', 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
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
	}
});