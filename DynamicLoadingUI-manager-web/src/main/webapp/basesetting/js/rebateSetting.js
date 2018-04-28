$(document).ready(function() {
	loginCheck1();
	clear();
	var p = $('#finasettingdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [15,20,25],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页 共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录 共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findList(pageNumber, pageSize);
		}
	});
	findList(1,15);
});
var id;
var key;
var value;
var editor = ReadCookie("username");
var adminid = ReadCookie("adminid");
// 分页查询
function findList(page,rows) {
	$('#finasettingdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/params/getParams',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			settingType : 6,
			protection : 2,
		},
		success : function(data) {
			if (data.status == "succeed") {
			var obj = {
				total : data.total,
				rows : data.list,
			};
			$('#finasettingdg').datagrid('loaded');
			$("#finasettingdg").datagrid('loadData', obj);
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//操作
function formatterCZ(value) {
	if (value) {
		return '<a href="javascript:settingitem();" class="audit">修改参照项</a>&nbsp;&nbsp;' +
			'<a href="javascript:delsetting();" class="audit">删&nbsp;&nbsp;除</a>';
	} else {
		return '<a href="javascript:updateParam();" class="audit">修&nbsp;&nbsp;改</a>&nbsp;&nbsp;' +
			'<a href="javascript:delsetting();" class="audit">删&nbsp;&nbsp;除</a>';
	}
}
function formatterName(value) {
	if (value == null) {
		return '系统初始化数据';
	} else{
		return value;
	}
}
function formatterRatio(value) {
		return value+"％";
}
function delsetting() {
	var row = $("#finasettingdg").datagrid("getSelected");
	if (row) {
		var content;
		var subitem = row.subitem;
		key = row.key;
		id = row.id;
		if (subitem == 1) {
			content = "一旦删除,该参数包含的所有参照项全部删除,确定删除吗?";
		} else {
			content = "一旦删除,该参数将不起作用,确定删除吗?";
		}
		$.messager.confirm('请确认', content, function(b) {
			if (b) {
				$.ajax({
					url : '/gift-fly/system/params/delParam',
					dataType : "json",
					type : "post",
					data : {
						id : id,
						adminid : adminid,
						subitem : subitem,
						key : key,
						node : "推广返利参数",
					},
					success : function(data) {
						if (data.status == "succeed") {
							$("#finasettingdg").datagrid('unselectAll');
							$('#finasettingdg').datagrid('getPager').pagination('select');
							$.messager.show({
								timeout : 500,
								msg : '删除成功',
								title : '提示',
							});
							insertLog(adminid, 1, "删除参数：" + key, "推广返利参数");
						} else {
							$("#finasettingdg").datagrid('rejectChanges');
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
//参照项详情
function settingitem() {
	var row = $("#finasettingdg").datagrid("getSelected");
	var settingkey = row.key;
	var time = row.updatedAt;
	if (row.nickname == null) {
		var editor = "系统初始化数据"
	}else{
		var editor = row.nickname;
	}
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
		return '超级管理员';
	} else if (value == 1) {
		return '系统管理员';
	} else if (value == 2) {
		return '运营人员';
	} else {
		return '完全公开';
	}
}
//新增对话框
function addSetting() {
	clear();
	$('#protection').combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		data : [{    
		    "id":"0",    
		    "name":"超级管理员",
		},{    
		    "id":"1",    
		    "name":"系统管理员"   
		},{    
		    "id":"2",    
		    "name":"运营人员",
		    "selected":true
		     
		},{    
		    "id":"3",    
		    "name":"完全公开"   
		}]  
	});
	$("#addsetting").dialog("open");
}
//保存新增信息
function saveSetting() {
	// 判断表单是否通过验证
		var valid = $('#addform').form('validate');
		if (!valid) {
			return valid;
		}
		// 获取表单af中的值并转化
		var afInfo = $("#addform").serializeArray();
		var settingkey = afInfo[0].value;
		var protection = afInfo[1].value;
		var subitem = afInfo[2].value;
		var settingval = afInfo[3].value;
		var description = afInfo[4].value;
		$.ajax({
			url : '/gift-fly/system/params/insertSetting',
			dataType : "json",
			type : "post",
			data : {
				key : settingkey,
				protection : protection,
				subitem : subitem,
				value : settingval,
				description : description,
				adminId : adminid,
				settingType : 6,
				node : "推广返利参数",
			},
			success : function(data) {
				if (data.status == "succeed") {
					$("#addsetting").dialog("close");
					// 刷新当前页
					$('#finasettingdg').datagrid('getPager').pagination('select');
					$.messager.show({
						timeout : 500,
						msg : "添加成功！",
						title : "提示",
					});
					//插入日志
					insertLog(adminid, 1, "新增返利参数项:" + settingkey, "推广返利参数");
				} else {
					$('#finasettingdg').datagrid('loaded');
					$.messager.alert('提示', data.msg, 'error');
				}
			},
			error : function(err) {
				$.messager.alert('提示', '系统异常！', 'error');
			}
		});
}
//清除新增对话框信息缓存
function clear() {
	$('#settingkey').textbox('initValue');
	$("#settingval").textbox('initValue');
	$("#description").textbox('initValue');
	$("#protection").combobox('clear');
	$("#settingtype").combobox("clear");
}
//修改对话框
function updateParam() {
	$('#upsettingtype').combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		data : [{    
		    "id":1,    
		    "name":"财务参数"   
		},{    
		    "id":2,    
		    "name":"系统参数"   
		},{    
		    "id":3,    
		    "name":"财务参数",    
		},{    
		    "id":4,    
		    "name":"运营参数"   
		},{    
		    "id":5,    
		    "name":"页面参数"   
		},{    
		    "id":6,    
		    "name":"推广返利参数",
		    "selected":true
		}]  
	});
	$('#upprotection').combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		data : [{    
		    "id":"0",    
		    "name":"超级管理员",
		},{    
		    "id":"1",    
		    "name":"系统管理员"   
		},{    
		    "id":"2",    
		    "name":"运营人员",
		    "selected":true
		},{    
		    "id":"3",    
		    "name":"完全公开"   
		}]  
	});
	var row = $("#finasettingdg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要修改的参数项', 'warning');
		return;
	}
	key = row.key;
	id = row.id;
	$('#upsettingform').form('load', {
		settingkey : key,
		protection : row.protection,
		subitem : row.subitem,
		settingval : row.value,
		settingtype : row.settingType,
		description : row.description,
	});
	$("#updatesetting").dialog("open");
}
//确定保存修改信息
function saveUpdate() {
	// 判断表单是否通过验证
	var valid = $('#upsettingform').form('validate');
	if (!valid) {
		return valid;
	}
	var ffInfo = $("#upsettingform").serializeArray();
	var protection = ffInfo[0].value;
	var settingtype = ffInfo[1].value;
	var subitem = ffInfo[2].value;
	var settingval = ffInfo[3].value;
	var description = ffInfo[4].value;
	$.ajax({
		url : '/gift-fly/system/params/updateParam',
		dataType : "json",
		type : "post",
		data : {
			id : id,
			key : key,
			value : settingval,
			description : description,
			adminId : adminid,
			subitem : subitem,
			protection : protection,
			settingType : settingtype,
			node : "推广返利参数",
		},
		success : function(data) {
			if (data.status =="succeed") {
				$("#updatesetting").dialog("close");
				// 刷新当前页
				$('#finasettingdg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "修改成功！",
					title : "提示"
				});
				//保存日志
				insertLog(adminid, 1, "修改参数:"+key, "推广返利参数管理");
			} else {
				$('#finasettingdg').datagrid('loaded');
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}

