$(document).ready(function() {
	loginCheck1();
	var p = $('#craftdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [15, 20, 25],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findList(pageNumber, pageSize);
		},
	});
	findList(1, 15);
	uploadImg();
	uploadupLogo();
	//上传进度条
	progressBar();
});
var id;
var type = 0;
var adminid = ReadCookie("adminid");
var orgId = ReadCookie("orgId");
var addimgid=0;
var addimgurl=null;
var upimgid=0;
var upimgurl=null;

function findList(page,rows) {
	$('#craftdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/custom/selectCraftList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			orgId : orgId,
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 需要传递total总条数和rows列表...
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#craftdg').datagrid('loaded');
				$("#craftdg").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
function formatterIMG(value, row, index) {
	return '<img class="imgmargin" src="'+ value +'"width="80" height="60"/>';
}
function formatterCZ(value, row, index) {
		return '<a href="javascript:update();" class="audit1">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp' +
			'<a href="javascript:deleteinfo();" class="audit1">删除</a>';
}
// 添加对话框
function addCraftInfo() {
	$("#name").textbox('setValue', "");
	$("#price").textbox('setValue', "");
	$("#showimg img").remove();
	$("#addCraft").dialog("open");
}
// 确定添加
function saveCraft() {
	// 判断表单是否通过验证
	var valid = $('#addfrom').form('validate');
	if (!valid) {
		return valid;
	}
	// 获取表单af中的值并转化
	var afInfo = $("#addfrom").serializeArray();
	var name = afInfo[0].value;
	var price = afInfo[1].value;
	$.ajax({
		url : '/gift-fly/system/custom/insertOrUpdateCraft',
		dataType : "json",
		type : "post",
		data : {
			orgId : orgId,
			craftName : name,
			price : price,
			imageId : addimgid,
			adminid : adminid,
			node : "工艺列表",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#addCraft").dialog("close");
				// 刷新当前页
				$('#craftdg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "添加成功！",
					title : "提示",
				});
				insertLog(adminid, 1, "新增定制工艺:"+name, "工艺列表");
			} else {
				$('#craftdg').datagrid('loaded');
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
	var row = $("#craftdg").datagrid("getSelected");
	if (row) {
		id = row.id;
		upimgurl = row.imageUrl;
		upimgid = row.imageId;
		$('#updatefrom').form('load', {
			name : row.craftName,
			price : row.price,
		});
	}
	if (upimgurl != null) {
		$("#showupImg").append(
		'<img src="'+upimgurl+'"style="width: 145px;height:100px;">'+
		'<img onclick="deluplogo()" style="position:absolute;right:5px; top:5px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
	}
	$("#updateCraft").dialog("open");
}
//保存编辑信息
function updateCraft() {
	var valid = $('#updatefrom').form('validate');
	if (!valid) {
		return valid;
	}
	var ffInfo = $("#updatefrom").serializeArray();
	var name = ffInfo[0].value;
	var price = ffInfo[1].value;
	if (upimgid == 0) {
		$.messager.alert('提示', '请上传工艺图片', '');
		return;
	}
	$.ajax({
		url : '/gift-fly/system/custom/insertOrUpdateCraft',
		dataType : "json",
		type : "post",
		data : {
			id : id,
			craftName : name,
			price : price,
			imageId : upimgid,
			adminid : adminid,
			node : "工艺列表",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#updateCraft").dialog("close");
				$('#craftdg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "编辑成功！",
					title : "提示",
				});
				insertLog(adminid, 1, "编辑定制工艺:"+name, "工艺列表");
			} else {
				$('#craftdg').datagrid('loaded');
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
    var row = $("#craftdg").datagrid("getSelected");
    if (row) {
    	id = row.id;
    	$.messager.confirm('请确认', '确定要删除该工艺吗？', function(b) {
    	    if (b) {
    	    	$.ajax({
    	    		url : '/gift-fly/system/custom/deleteCraft',
    	    		dataType : "json",
    	    		type : "post",
    	    		data : {
    	    			id : id,
    	    			orgId : orgId,
    	    			adminid : adminid,
    	    			node : "工艺列表",
    	    		},
    	    		success : function(data) {
    	    			if (data.status == "succeed") {
    	    				$('#craftdg').datagrid('getPager').pagination('select');
    	    				$.messager.show({
    	    					timeout : 500,
    	    					msg : '删除成功',
    	    					title : '提示',
    	    				});
    	    				insertLog(adminid, 1, "删除工艺:"+row.craftName, "工艺列表");
    	    			} else {
    	    				$('#craftdg').datagrid('loaded');
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
					if (upimgid != null && upimgurl != null) {
						$.ajax({
							url : '/gift-fly/system/upload/delImg',
							dataType : "json",
							type : "post",
							data : {
								url : upimgurl,
								id : upimgid,
							},
						});
						$("#showupImg img").remove();
					}
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
