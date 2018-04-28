$(document).ready(function() {
	addSampleImg();
	addBgImg();
	upSampleImg();
	upBgImg();
	var p = $('#placedg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [ 15, 25, 30 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findPlaceList(pageNumber, pageSize);
		},
	});
	findPlaceList(1, 15);
	//上传进度条
	progressBar();
});
var adminid = ReadCookie("adminid");
var orgId = ReadCookie("orgId");
var skuId=ReadCookie("skuId");
var id;
var sampleImageId;
var sampleImageUrl=null;
var bgImageId;
var bgImageUrl=null;
// 分页查询
function findPlaceList(page, rows) {
	$('#placedg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/custom/selectPlaceList',
		dataType : "json",
		type : "post",
		data : {
			skuId : skuId,
			orgId : orgId,
		},
		success : function(data) {
			if (data.status == "succeed") {
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#placedg').datagrid('loaded');
				$("#placedg").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
//添加位置对话框
function addplace() {
	clearInfo();
	$.ajax({
		url : '/gift-fly/system/custom/selectCraftList',
		dataType : "json",
		type : "post",
		data : {
			orgId : orgId,
			page : 0,
			rows : 99,
		},
		success : function(data) {
			if (data.status == "succeed") {
				$('#placecraft').combobox({
					valueField : 'id',
					textField : 'craftName',
					panelHeight : 'auto',
					multiple : "true", 
					data : data.list,
				});
			} else {
				$.messager.alert('提示', "数据加载错误", 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
	$("#addplace").dialog("open");
}
//清除规格对话框的缓存
function clearInfo() {
	 sampleImageId=0;
	 sampleImageUrl=null;
	 bgImageId=0;
	 bgImageUrl=null;
	$("#placeName").textbox("initValue");
	$("#adimg").textbox("initValue");
	$("#placeX").numberbox('setValue',0);
	$("#placeY").numberbox('setValue',0);
	$("#placeWidth").numberbox('setValue',0);
	$("#placeHeigth").numberbox('setValue',0);
	$("#degree").numberbox('setValue',0);
	$('#sampleImageId').textbox('initValue');
	$('#bgImageId').textbox('initValue');
	$('.detail-td img').remove();
	$("#requireWidth").numberbox('setValue',0);
	$("#requireHeigth").numberbox('setValue',0);
	$("#requiredpi").numberbox('setValue',0);
	$("#requireformat").textbox('setValue','*.jpg,*.png,*.gif');
	$("#placecraft").combobox('setValue',1);
}
function formatterCZ(value, row, index) {
	return '<a href="javascript:updatePlace();" class="audit1">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp' +
		'<a href="javascript:deletePlace();" class="audit1">删除</a>';
}
function formatterType(value, row, index) {
	if(value == 0){
		return "表面";
	}else{
		return "底层";
	}
}
//保存定制位置
function saveplace() {
	var valid = $('#addplacefrom').form('validate');
	if (!valid) {
		return;
	}
	// 获取表单af中的值并转化
	var afInfo = $("#addplacefrom").serializeArray();
	var placeName = afInfo[0].value;
	var placeType = afInfo[1].value;
	var placeX = afInfo[2].value;
	var placeY = afInfo[3].value;
	var placeWidth = afInfo[4].value;
	var placeHeigth = afInfo[5].value;
	var degree = afInfo[6].value;
	var ruleType = afInfo[7].value;
	var requireWidth = afInfo[8].value;
	var requireHeigth = afInfo[9].value;
	var requiredpi = afInfo[10].value;
	var requireformat = afInfo[11].value;
	var placecraft = $("#placecraft").combobox('getValues');
	$.ajax({
		url : '/gift-fly/system/custom/insertOrUpdatePlace',
		dataType : "json",
		type : "post",
		data : {
			orgId : orgId,
			skuId : skuId,
			placeName : placeName,
			placeType : placeType,
			placeX : placeX,
			placeY : placeY,
			placeWidth : placeWidth,
			placeHeigth : placeHeigth,
			degree : degree,
			sampleImageId : sampleImageId,
			backgroundImageId : bgImageId,
			requireWidth : requireWidth,
			requireHeigth : requireHeigth,
			requireDpi : requiredpi,
			requireFormat : requireformat,
			ruleType : ruleType,
			placecraft : placecraft.toString(),
			node : "定制商品列表",
			adminid : adminid,
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#addplace").dialog("close");
				$('#placedg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "添加成功！",
					title : "提示"
				});
				// 插入日志
				insertLog(adminid, 1, "新增定制商品位置:" + placeName, "定制商品列表");
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}

//编辑定制位置
function updatePlace() {
	var row = $("#placedg").datagrid("getSelected");
	if (row == null) {
		$.messager.alert('提示', '请选择需要编辑的定制位置！', 'warning');
		return;
	}
	sampleImageId=0;
	sampleImageUrl=null;
	bgImageId=0;
	bgImageUrl=null;
	$(".detail-td img").remove();
	id = row.id;
	sampleImageId = row.sampleImageId;
	bgImageId =row.backgroundImageId; 
	sampleImageUrl =row.sampleImageUrl; 
	bgImageUrl =row.backgroundImageUrl; 
	toplacecraft();
	$('#updateplacesp').form('load', {
		placeName : row.placeName,
		placeType : row.placeType,
		placeX : row.placeX,
		placeY : row.placeY,
		placeWidth : row.placeWidth,
		placeHeigth : row.placeHeigth,
		degree : row.degree,
		ruleType : row.ruleType,
		requireWidth : row.requireWidth,
		requireHeigth : row.requireHeigth,
		requiredpi : row.requireDpi,
		requireformat : row.requireFormat,
	});
	var arr = (row.placecraft).split(',');
	$("#upplacecraft").combobox("setValues",arr);
	if(sampleImageUrl != null ){
		$("#upshowsampleImage").append(
				'<img src="'+sampleImageUrl+'"style="width: 145px;height:100px;">'+
		'<img onclick="delupimg()" style="position:absolute;right:0; top:1px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
	}
	if(bgImageUrl != null ){
		$("#upshowsbgImage").append(
				'<img src="'+bgImageUrl+'"style="width: 145px;height:100px;">'+
		'<img onclick="delupimg()" style="position:absolute;right:0; top:1px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
	}
	$("#updateplace").dialog("open");
}

function toplacecraft() {
	$.ajax({
		url : '/gift-fly/system/custom/selectCraftList',
		dataType : "json",
		type : "post",
		async: false,
		data : {
			orgId : orgId,
			page : 0,
			rows : 99,
		},
		success : function(data) {
			if (data.status == "succeed") {
				$('#upplacecraft').combobox({
					valueField : 'id',
					textField : 'craftName',
					panelHeight : 'auto',
					multiple : "true", 
					data : data.list,
				});
			} else {
				$.messager.alert('提示', "数据加载错误", 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
//保存编辑的规格信息
function updateplace() {
	// 判断表单是否通过验证
	var valid = $('#updateplacesp').form('validate');
	if (!valid) {
		return valid;
	}
	// 获取表单af中的值并转化
	var afInfo = $("#updateplacesp").serializeArray();
	var placeType = afInfo[0].value;
	var placeX = afInfo[1].value;
	var placeY = afInfo[2].value;
	var placeWidth = afInfo[3].value;
	var placeHeigth = afInfo[4].value;
	var degree = afInfo[5].value;
	var ruleType = afInfo[6].value;
	var requireWidth = afInfo[7].value;
	var requireHeigth = afInfo[8].value;
	var requiredpi = afInfo[9].value;
	var requireformat = afInfo[10].value;
	var placecraft = $("#upplacecraft").combobox('getValues');
	$.ajax({
		url : '/gift-fly/system/custom/insertOrUpdatePlace',
		dataType : "json",
		type : "post",
		data : {
			id : id,
			placeType : placeType,
			placeX : placeX,
			placeY : placeY,
			placeWidth : placeWidth,
			placeHeigth : placeHeigth,
			degree : degree,
			sampleImageId : sampleImageId,
			backgroundImageId : bgImageId,
			requireWidth : requireWidth,
			requireHeigth : requireHeigth,
			requireDpi : requiredpi,
			requireFormat : requireformat,
			ruleType : ruleType,
			placecraft : placecraft.toString(),
			node : "定制商品列表",
			adminid : adminid,
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#updateplace").dialog("close");
				$('#placedg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "修改成功！",
					title : "提示"
				});
				// 插入日志
				insertLog(adminid, 1, "修改商品定制位置:" + placeName, "定制商品列表");
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//删除
function deletePlace() {
	var row = $("#placedg").datagrid("getSelected");
	if (row == null) {
		$.messager.alert('提示', '请选择需要删除的定制位置！', 'warning');
		return;
	}
	if (row) {
		id = row.id;
		$.messager.confirm('请确认', '确定要删除该定制位置吗?', function(b) {
			if (b) {
				$.ajax({
					url : '/gift-fly/system/custom/deletePlace',
					dataType : "json",
					type : "post",
					data : {
						id : id,
						adminid : adminid,
						node : "定制商品列表",
					},
					success : function(data) {
						if (data.status == "succeed") {
							$('#placedg').datagrid('getPager').pagination('select');
							$.messager.show({
								timeout : 500,
								msg : '删除成功',
								title : '提示',
							});
							insertLog(adminid, 1, "删除商品包装：" + row.placeName, "定制商品列表");
						} else {
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
		$.messager.alert('提示', '请选择需要删除的定制位置', 'warning');
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
	},
});
//新增的样例图片
function addSampleImg() {
	$('#sampleImageId').filebox({
		buttonText : '选择图片',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png',
		onChange : function() {
			$("#btnID").trigger("click");
			$("#upload-progressbar").window("open");
			var xhr = new XMLHttpRequest(); //第一步    
			var file = document.getElementById('filebox_file_id_1').files;
			var formData = new FormData();
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			xhr.send(formData); //第三步骤    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					$("#showsampleImage img").remove();
					sampleImageUrl = jQuery.parseJSON(xhr.responseText).url;
					sampleImageId = jQuery.parseJSON(xhr.responseText).id;
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					$("#showsampleImage").append(
						'<img src="' + sampleImageUrl + '"style="width: 140px;height:100px;">' +
						'<img onclick="delSampleImg()" style="position:absolute;right:10px; top:1px;width:16px;height:16px;cursor:pointer;"' +
						' src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
				}
			};
			xhr.timeout = 6000; //设置超时时间    
			xhr.ontimeout = function(event) {
				alert('请求超时！');
			}
		}
	});
}
function delSampleImg() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : sampleImageUrl,
			id : sampleImageId,
		},
	});
	$("#showsampleImage img").remove();
	$('#sampleImageId').textbox('initValue');
}
//新增的背景图片
function addBgImg() {
	$('#bgImageId').filebox({
		buttonText : '选择图片',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png',
		onChange : function() {
			$("#btnID").trigger("click");
			$("#upload-progressbar").window("open");
			var xhr = new XMLHttpRequest(); //第一步    
			var file = document.getElementById('filebox_file_id_2').files;
			var formData = new FormData();
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			xhr.send(formData); //第三步骤    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					$("#showsbgImage img").remove();
					bgImageUrl = jQuery.parseJSON(xhr.responseText).url;
					bgImageId = jQuery.parseJSON(xhr.responseText).id;
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					$("#showsbgImage").append(
						'<img src="' + bgImageUrl + '"style="width: 140px;height:100px;">' +
						'<img onclick="delbgImage()" style="position:absolute;right:10px; top:10px;width:16px;height:16px;cursor:pointer;"' +
						' src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
				}
			};
			xhr.timeout = 6000; //设置超时时间    
			xhr.ontimeout = function(event) {
				alert('请求超时！');
			}
		}
	});
}
function delbgImage() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : bgImageUrl,
			id : bgImageId,
		},
	});
	$("#showsbgImage img").remove();
	$('#bgImageId').textbox('initValue');
}
//编辑的样例图片
function upSampleImg() {
	$('#upsampleImageId').filebox({
		buttonText : '选择logo',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png',
		onChange : function() {
			$("#btnID").trigger("click");
			$("#upload-progressbar").window("open");
			var xhr = new XMLHttpRequest(); //第一步    
			var file = document.getElementById('filebox_file_id_3').files;
			var formData = new FormData();
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			xhr.send(formData); //第三步骤    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					$("#upshowsampleImage img").remove();
					sampleImageUrl = jQuery.parseJSON(xhr.responseText).url;
					sampleImageId = jQuery.parseJSON(xhr.responseText).id;
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					$("#upshowsampleImage").append(
						'<img src="' + sampleImageUrl + '"style="width: 140px;height:100px;">' +
						'<img onclick="delupsampleImage()" style="position:absolute;right:10px; top:10px;width:16px;height:16px;cursor:pointer;"' +
						' src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
				}
			};
			xhr.timeout = 6000; //设置超时时间    
			xhr.ontimeout = function(event) {
				alert('请求超时！');
			}
		}
	});
}
function delupsampleImage() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : sampleImageUrl,
			id : sampleImageId,
		},
	});
	$("#upshowsampleImage img").remove();
	$('#upsampleImageId').textbox('initValue');
}
//编辑的背景图片
function upBgImg() {
	$('#upbgImageId').filebox({
		buttonText : '选择图片',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png',
		onChange : function() {
			$("#btnID").trigger("click");
			$("#upload-progressbar").window("open");
			var xhr = new XMLHttpRequest(); //第一步    
			var file = document.getElementById('filebox_file_id_4').files;
			var formData = new FormData();
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			xhr.send(formData); //第三步骤    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					$("#upshowsbgImage img").remove();
					bgImageUrl = jQuery.parseJSON(xhr.responseText).url;
					bgImageId = jQuery.parseJSON(xhr.responseText).id;
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					$("#upshowsbgImage").append(
						'<img src="' + bgImageUrl + '"style="width: 140px;height:100px;">' +
						'<img onclick="delupbgImage()" style="position:absolute;right:10px; top:1px;width:16px;height:16px;cursor:pointer;"' +
						' src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
				}
			};
			xhr.timeout = 6000; //设置超时时间    
			xhr.ontimeout = function(event) {
				alert('请求超时！');
			}
		}
	});
}
function delupbgImage() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : bgImageUrl,
			id : bgImageId,
		},
	});
	$("#upshowsbgImage img").remove();
	$('#upbgImageId').textbox('initValue');
}
