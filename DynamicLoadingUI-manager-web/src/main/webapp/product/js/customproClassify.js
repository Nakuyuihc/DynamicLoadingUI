$(document).ready(function() {
	loginCheck1();
	prostatus();
	var p = $('#custprotypedg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [15, 20, 25],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findList(pageNumber, pageSize,type);
		},
	});
	findList(1, 15, 0);
	uploadImg();
	uploadupLogo();
	//上传进度条
	progressBar();
});
var id;
var type = 0;
var adminid = ReadCookie("adminid");
var addimgid=0;
var addimgurl=null;
var upimgid=0;
var upimgurl=null;
function queryInfo() {
	var p = $('#custprotypedg').datagrid('getPager');
	var options = p.data("pagination").options;
	var page = options.pageNumber;
	var rows = options.pageSize;
	type = $('#prostatus').combobox('getValue');
	if(type == null || type == ''){
		type = 0;
	}
	findList(page,rows,type);
}
function findList(page,rows,type) {
	$('#custprotypedg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/custom/selectTopicList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			type : type,
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 需要传递total总条数和rows列表...
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#custprotypedg').datagrid('loaded');
				$("#custprotypedg").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
function formatterLX(value, row, index) {
	if (value == 1) {
		return '定制用途';
	} else if (value == 2){
		return '特殊日子';
	}else {
		return '定制类别';
	}
}
function formattershowIMG(value, row, index) {
	return '<img class="imgmargin" src="'+ value +'"width="80" height="60"/>';
}
function formatterCZ(value, row, index) {
		return '<a href="javascript:update();" class="audit1">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp' +
			'<a href="javascript:deleteinfo();" class="audit1">删除</a>';
}
//类型下拉列表
function prostatus() {
	$('#prostatus').combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		data : [ {
			"id" : "1",
			"name" : "定制用途",
		}, {
			"id" : "2",
			"name" : "特殊日子"
		}, {
			"id" : "3",
			"name" : "定制类别"
		}]
	});
}
// 添加对话框
function addTopicInfo() {
	$("#addtitle").textbox('setValue', "");
	$("#description").textbox('setValue', "");
	$("#addimg").textbox('initValue');
	$("#type").combobox("clear");
	$("#org").combobox('setValues','');
	$("#showimg img").remove();
	$.ajax({
		url : '/gift-fly/cisWeb/selectAll',
		dataType : "json",
		type : "post",
		data : {},
		success : function(data) {
			if (data.status == "succeed") {
				$('#org').combobox({
					panelHeight : 'auto',
					multiple :'true',
					valueField : 'id',
					textField : 'orgName',
					data : data.list,
				});
			}
			},
	});
	$('#type').combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		data : [ {
			"id" : "1",
			"name" : "定制用途",
		}, {
			"id" : "2",
			"name" : "特殊日子"
		}, {
			"id" : "3",
			"name" : "定制类别",
			"selected":true
		}]
	});
	$("#addTopic").dialog("open");
}
// 确定添加
function saveTopic() {
	// 判断表单是否通过验证
	var valid = $('#addfrom').form('validate');
	if (!valid) {
		return valid;
	}
	// 获取表单af中的值并转化
	var afInfo = $("#addfrom").serializeArray();
	var title = afInfo[0].value;
	var type = afInfo[1].value;
	var description = afInfo[2].value;
	var packing = $("#org").combobox("getValues");
	var orgid = packing.toString();
	$.ajax({
		url : '/gift-fly/system/custom/insertOrUpdate',
		dataType : "json",
		type : "post",
		data : {
			title : title,
			type : type,
			imageId : addimgid,
			description : description,
			orgIds : orgid,
			adminid : adminid,
			node : "定制主题",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#addTopic").dialog("close");
				// 刷新当前页
				$('#custprotypedg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "添加成功！",
					title : "提示",
				});
				insertLog(adminid, 1, "新增定制主题:"+title, "定制主题");
			} else {
				$('#custprotypedg').datagrid('loaded');
				$.messager.alert('提示', '添加失败！', 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//编辑对话框
function update() {
	$("#showupImg img").remove();
	$("#upimg").textbox('setValue', "");
	var row = $("#custprotypedg").datagrid("getSelected");
	$.ajax({
		url : '/gift-fly/cisWeb/selectAll',
		dataType : "json",
		type : "post",
		async: false,
		data : {},
		success : function(data) {
			if (data.status == "succeed") {
				$('#uporg').combobox({
					panelHeight : 'auto',
					multiple :'true',
					valueField : 'id',
					textField : 'orgName',
					data : data.list,
				});
			}
			},
	});
	$('#uptype').combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		data : [ {
			"id" : "1",
			"name" : "定制用途",
		}, {
			"id" : "2",
			"name" : "特殊日子"
		}, {
			"id" : "3",
			"name" : "定制类别",
		}]
	});
	if (row) {
		id = row.id;
		upimgurl = row.imageUrl;
		upimgid = row.imageId;
		$('#updatefrom').form('load', {
			title : row.title,
			type : row.type,
			description : row.description,
		});
	}
	if(row.orgIds != null){
		var arr = (row.orgIds).split(',');
		$('#uporg').combobox('setValues', arr);
		}
	if (upimgurl != null) {
		$("#showupImg").append(
		'<img src="'+upimgurl+'"style="width: 145px;height:100px;">'+
		'<img onclick="deluplogo()" style="position:absolute;right:5px; top:5px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
	}
	$("#updateTopic").dialog("open");
}
//保存编辑信息
function updateTopic() {
	var valid = $('#updatefrom').form('validate');
	if (!valid) {
		return valid;
	}
	var ffInfo = $("#updatefrom").serializeArray();
	var title = ffInfo[0].value;
	var type = ffInfo[1].value;
	var description = ffInfo[2].value;
	var packing = $("#uporg").combobox("getValues");
	var orgid = packing.toString();
	if (upimgid == 0) {
		$.messager.alert('提示', '请上传主图图片', '');
		return;
	}
	$.ajax({
		url : '/gift-fly/system/custom/insertOrUpdate',
		dataType : "json",
		type : "post",
		data : {
			id : id,
			title : title,
			type : type,
			imageId : upimgid,
			description : description,
			orgIds : orgid,
			adminid : adminid,
			node : "定制主题",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#updateTopic").dialog("close");
				$('#custprotypedg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "编辑成功！",
					title : "提示",
				});
				insertLog(adminid, 1, "编辑定制主题:"+title, "定制主题");
			} else {
				$('#custprotypedg').datagrid('loaded');
				$.messager.alert('提示', '添加失败！', 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
// 删除
function deleteinfo() {
    // 获得选中的项
    var row = $("#custprotypedg").datagrid("getSelected");
    if (row) {
    	id = row.id;
    	
    	$.messager.confirm('请确认', '确定要删除该主题吗？', function(b) {
    	    if (b) {
    	    	$.ajax({
    	    		url : '/gift-fly/system/custom/deleteInfo',
    	    		dataType : "json",
    	    		type : "post",
    	    		data : {
    	    			id : id,
    	    			adminid : adminid,
    	    			node : "定制主题",
    	    		},
    	    		success : function(data) {
    	    			if (data.status == "succeed") {
    	    				$('#custprotypedg').datagrid('getPager').pagination('select');
    	    				$.messager.show({
    	    					timeout : 500,
    	    					msg : '删除成功',
    	    					title : '提示',
    	    				});
    	    				insertLog(adminid, 1, "删除主题:"+row.title, "定制主题");
    	    			} else {
    	    				$('#custprotypedg').datagrid('loaded');
    	    				$.messager.alert('错误', data.msg, 'error');
    	    			}
    	    		},
    	    		error : function(err) {
    	    			$.messager.alert('提示', err.msg, 'error');
    	    		}
    	    	});
    	    }
    	});
    }
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
//新增的图片上传
function uploadImg() {
	$('#addimg').filebox({
		buttonText : '选择图片',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png',
		onChange : function() {
			var xhr = new XMLHttpRequest(); //第一步    
			var file = document.getElementById('filebox_file_id_1').files;
			var formData = new FormData();
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			$("#btnID").trigger("click");
			$("#upload-progressbar").window("open");
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			xhr.send(formData); //第三步骤    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
						$("#showimg img").remove();
					addimgurl = jQuery.parseJSON(xhr.responseText).url; 
					addimgid = jQuery.parseJSON(xhr.responseText).id;
					$("#showimg").append(
							'<img src="'+addimgurl+'"style="width: 145px;height:100px;">'+
					'<img onclick="delimg()" style="position:absolute;right:5px; top:5px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
				}
			};
			//设置超时时间    
			xhr.timeout = 6000;
			xhr.ontimeout = function(event) {
				alert('请求超时！');
			}
		}
	});
}
function delimg() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : addimgurl,
			id : addimgid,
		},
		success : function(data) {
			addimgurl =null;
			addimgid=0;
		},
	});
	$("#showimg img").remove();
	$('#addimg').textbox('initValue');	
}
//编辑后的图片上传
function uploadupLogo() {
	$('#upimg').filebox({
		buttonText : '选择图片',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png',
		onChange : function() {
			var xhr = new XMLHttpRequest(); //第一步    
			var file = document.getElementById('filebox_file_id_2').files;
			var formData = new FormData();
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			$("#btnID").trigger("click");
			$("#upload-progressbar").window("open");
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			xhr.send(formData); //第三步骤    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					$("#showupImg img").remove();
					upimgurl = jQuery.parseJSON(xhr.responseText).url; 
					upimgid = jQuery.parseJSON(xhr.responseText).id;
					$("#showupImg").append(
							'<img src="'+upimgurl+'"style="width: 145px;height:100px;">'+
					'<img onclick="deluplogo()" style="position:absolute;right:5px; top:5px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
				}
			};
			//设置超时时间    
			xhr.timeout = 6000;
			xhr.ontimeout = function(event) {
				alert('请求超时！');
			}
		}
	});
}
function deluplogo() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : upimgurl,
			id : upimgid,
		},
		success : function(data) {
			upimgurl =null;
			upimgid=0;
		},
	});
	$("#showupImg img").remove();
	$('#upimg').textbox('initValue');	
}
