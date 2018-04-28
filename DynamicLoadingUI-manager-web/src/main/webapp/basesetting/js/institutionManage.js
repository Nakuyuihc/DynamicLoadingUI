$(document).ready(function() {
	loginCheck1();
	findList();
});
var key;
var value;
var editor = ReadCookie("username");
var adminid = ReadCookie("adminid");
// 分页查询
function findList() {
	$('#settingdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/params/getParams',
		dataType : "json",
		type : "post",
		data : {
			param : "OperationParams",
		},
		success : function(data) {
			var obj = {
				rows : data
			};
			$('#settingdg').datagrid('loaded');
			$("#settingdg").datagrid('loadData', obj);
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}

//操作
function formatterCZ(value) {
	if (value) {
		return '<a href="javascript:settingitem();" class="audit">修改参照项</a>';
	} else {
		return '<a href="javascript:updateParam();" class="audit">修&nbsp;&nbsp;改</a>';
	}
}
//参照项详情
function settingitem() {
	var row = $("#settingdg").datagrid("getSelected");
	var settingkey = row.key;
	var time = row.updatedAt;
	var editor = row.nickname;
	var settingid = row.id;
	setCookie("settingkey", settingkey, 1);
	setCookie("settingid", settingid, 1);
	setCookie("time", time, 1);
	setCookie("editor", editor, 1);
	$("#settingitem").dialog("open");
	var middle = document.getElementById("settingitem");
	middle.innerHTML ='<iframe align="center" style="width:100%;height:515px;" src="./settingItemUpdate.html" frameborder="no" scrolling="no"></iframe>';
}
//可见性
function formatterPRO(value) {
	if (value == 0) {
		return '超管';
	} else if (value == 1) {
		return '管理员';
	} else if (value == 2) {
		return '运营';
	} else {
		return '公开';
	}
}

//修改对话框
function updateParam() {
	var row = $("#settingdg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要修改的参数项', 'warning');
		return false;
	}
	key = row.key;
	value = row.value;
	$('#value').html(key);
	$('#updatefromsp').form('load', {
		value : value,
	});
	$("#updateparam").dialog("open");
}
//确定保存修改信息
function update() {
	// 判断表单是否通过验证
	var valid = $('#updatefromsp').form('validate');
	if (!valid) {
		return valid;
	}
	var ffInfo = $("#updatefromsp").serializeArray();
	var newvalue = ffInfo[0].value;
	if (newvalue == value) {
		$.messager.show({
			timeout : 500,
			msg : "修改成功！",
			title : "提示"
		});
		$("#updateparam").dialog("close");
		return;
	}
	$.ajax({
		url : '/gift-fly/system/params/updateParam',
		dataType : "json",
		type : "post",
		data : {
			key : key,
			value : value,
			editor : editor,
			adminid : adminid,
			param : "OperationParams",
			name : editor,
			node : "本机构参数管理",
		},
		success : function(data) {
			if (data == 1) {
				$("#updateparam").dialog("close");
				// 刷新当前页
				$('#settingdg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "修改成功！",
					title : "提示"
				});
				//保存日志
				insertLog(adminid, 1, "将"+key+"的值："+value+",修改成："+newvalue, "运营参数管理:"+key);
			} else if(data == -1){
				$.messager.alert('提示', '您没有修改权限,如需修改请联系超级管理员', 'error');
			}else {
				$('#settingdg').datagrid('loaded');
				$.messager.alert('提示', '修改失败！', 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}

