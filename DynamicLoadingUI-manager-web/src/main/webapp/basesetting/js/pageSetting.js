$(document).ready(function() {
	loginCheck1();
	clear();
	var p = $('#pagesettingdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [ 15, 20, 25 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页 共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录 共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findList(pageNumber, pageSize);
		}
	});
	findList(1, 15);
});
var id=0;
var key;
var keyid;
var editor = ReadCookie("username");
var adminid = ReadCookie("adminid");
var protection = null;
// 分页查询
function findList(page, rows) {
	$('#pagesettingdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/params/getParams',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			settingType : 5,
			protection : protection,
		},
		success : function(data) {
			if (data.status == "succeed") {
				var obj = {
					total : data.total,
					rows : data.list,
				};
				$('#pagesettingdg').datagrid('loaded');
				$("#pagesettingdg").datagrid('loadData', obj);
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//操作
function formatterCZ(value) {
		return '<a href="javascript:updateParam();" class="audit">编&nbsp;&nbsp;辑</a>';
}
function formatterName(value) {
	if (value == null || value == 0) {
		return '系统初始化数据';
	} else {
		return value;
	}
}
//新增对话框
function addSetting() {
	clear();
	$('#protection').combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		data : [ {
			"id" : "0",
			"name" : "超级管理员",
		}, {
			"id" : "1",
			"name" : "系统管理员"
		}, {
			"id" : "2",
			"name" : "运营人员",
		}, {
			"id" : "3",
			"name" : "完全公开",
			"selected" : true
		} ]
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
	var description = afInfo[2].value;
	$.ajax({
		url : '/gift-fly/system/params/insertSetting',
		dataType : "json",
		type : "post",
		data : {
			key : settingkey,
			protection : protection,
			description : description,
			adminId : adminid,
			settingType : 5,
			node : "页面参数",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#addsetting").dialog("close");
				// 刷新当前页
				$('#pagesettingdg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "添加成功！",
					title : "提示",
				});
				//插入日志
				insertLog(adminid, 1, "新增参数项:" + settingkey, "页面参数");
			} else {
				$('#pagesettingdg').datagrid('loaded');
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
	$("#description").textbox('initValue');
	$("#protection").combobox('clear');
}
//修改对话框
function updateParam() {
	var row = $("#pagesettingdg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要编辑的文章', 'warning');
		return;
	}
	key = row.key;
	 id = row.value;
	 keyid = row.id;
	editor.html("");
	selectText();
	$('#updatesetting').dialog('setTitle', '<font>'+key+'</font>'); 
}
//根据value获取内容
function selectText() {
	$.ajax({
		url : '/gift-fly/system/cms/queryContent',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			id : id,
		},
		success : function(data) {
			editor.html(data.content);
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
	$("#updatesetting").dialog("open");
}
//确定保存修改信息
function saveUpdate() {
	var content = editor.html();
	var type =0;
	var senderName = ReadCookie("username");
	var adminid = ReadCookie("adminid");
	$.ajax({
		url : '/gift-fly/system/cms/insertAndUpdateArticle',
		dataType : "json",
		type : "post",
		data : {
			content : content,
			type :type,
			title : key,
			senderName : senderName,
			node : "页面参数",
			adminid : adminid,
			id : id,
		},
		success : function(data) {
			if (data.status =="succeed") {
					id=data.id;
					savesetting();
					$.messager.show({
						timeout : 500,
						msg : "保存成功！",
						title : "提示"
					});
				insertLog(adminid,1,"修改"+title+"的数据","页面参数");
			}else{
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
	$("#updatesetting").dialog("close");
}
//保存参数设置
function savesetting() {
	var adminid = ReadCookie("adminid");
	$.ajax({
		url : '/gift-fly/system/params/updateParam',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			id : keyid,
			key : key,
			value : id,
			description : "页面参数相关的系统文章",
			adminId : adminid,
			node : "页面参数",
			settingType : 5,
		},
		success : function(data) {
			if(data.status =="succeed"){
				id =0;
				$('#pagesettingdg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "保存成功！",
					title : "提示"
				});
			}else{
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}