$(document).ready(function() {
	addSpecImg();
	addSpecLogo();
	addSizeLogo();
	upSpecImg();
	upSpecLogo();
	upSizeLogo();
});
var addSpecImgid = null;
var addSpecImgurl = null;
var addSpecLogoid = null;
var addSpecLogourl = null;
var addSizeLogoid = null;
var addSizeLogourl = null;
var upSpecImgid = null;
var upSpecImgurl = null;
var upSpecLogoid = null;
var upSpecLogourl = null;
var upSizeLogoid = null;
var upSizeLogourl = null;
var skuId;
function ztpPreview() {
	var file = document.getElementById('addimgs').files;
	var imglist = $(".showImg");
	if (file.length + imglist.length > 6) {
		$.messager.alert('提示', '最多只能上传六张商品图片!', '');
		return;
	}
	$("#btnID").trigger("click");
	$("#upload-progressbar").window("open");
	var xhr = new XMLHttpRequest(); //第一步    
	var formData = new FormData();
	for (i = 0; i < file.length; i++) {
		formData.append("file[" + i + "]", file[i]);
	}
	xhr.open('POST', '/gift-fly/system/upload/imgsUpload'); //第二步骤    
	xhr.send(formData); //第三步骤    
	xhr.onreadystatechange = function() { //第四步    
		if (xhr.readyState == 4 && xhr.status == 200) {
			var imgentity = jQuery.parseJSON(xhr.responseText).list;
			$("#progressBarID").progressbar("setValue", 100);
			$("#upload-progressbar").window("close");
			for (var i in imgentity) {
				$("#showImg").append('<div style="float:left;position:relative;">' +
					'<img class="showImg" id="' + imgentity[i].id + '" style="width:100px;height:100px;margin-right:5px;" src="' + imgentity[i].url + '"/>' +
					'<img onclick="deladdlptp(' + imgentity[i].id + ')" style="position:absolute;right:10px; top:5px;width:16px;height:16px;cursor:pointer;" src="/MerchantSystem/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/><div>');
			}
		}
	};
	//设置超时时间    
	xhr.timeout = 60000;
	xhr.ontimeout = function(event) {
		alert('请求超时！');
	}
}
//下一步,添加商品规格
function nextstep1() {
	//保存图片id到spu中
	var images=[];
	$(".showImg").each(function(){
		images.push($(this).attr("id"));
	}); 
	var imageIds = images.toString();
	if (imageIds.length > 0) {
		if (images.length > 7) {
			$.messager.alert('提示', '最多只能上传六张商品图片!', '');
			return;
		}
		$.ajax({
			url : '/gift-fly/system/mallWeb/updateSpu',
			dataType : "json",
			type : "post",
			data : {
				spuId : id,
				imageIds : imageIds,
				adminid : adminid,
				node : "商品列表",
			},
			success : function(data) {
				if (data.status == "succeed") {
					loadPecified();
					clearSpecInfo();
					$("#addprodSpecified").show();
					$("#addgeneralInfo").hide();
					$("#addproductImg").hide();
					$("#addprodPack").hide();
					$("#toptd1").css({
						color : "#BBB"
					}, {
						fontSize : "14px"
					});
					$("#toptd3").css({
						color : "#27A9E3"
					}, {
						fontSize : "15px"
					});
					$("#toptd2").css({
						color : "#BBB"
					}, {
						fontSize : "14px"
					});
					$("#toptd4").css({
						color : "#BBB"
					}, {
						fontSize : "14px"
					});
					// 插入日志
					insertLog(adminid, 1, "新增id为:" + id + "的商品相册:" + imageIds, "商品列表");
				} else {
					$.messager.alert('提示', data.msg, 'error');
				}
			},
			error : function(err) {
				$.messager.alert('提示', '系统异常！', 'error');
			}
		});
	} else {
		$.messager.alert('提示', '请上传商品图片', '');
	}
}
//加载新增规格
function loadPecified() {
	$('#addshowgiftspecified').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/mallWeb/findSpeclistById',
		dataType : "json",
		type : "post",
		data : {
			id : id,
		},
		success : function(data) {
			if (data.status == "succeed") {
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#addshowgiftspecified').datagrid('loaded');
				$("#addshowgiftspecified").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}

function deladdlptp(id) {
	var upimgurl = $("#" + id).attr("src");
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : upimgurl,
			id : id,
		},
	});
	$("#" + id).parent().remove();
}
//添加规格框
function addProdSpec() {
	$("#addSpecname").textbox("initValue");
	$("#addsize").textbox("initValue");
	$("#addpriceOrigin").numberbox("clear");
	$("#addpriceDiscount").numberbox("clear");
	$("#addstore").numberbox("clear");
	$("#addspecimg").filebox("initValue");
	$("#addspeclogo").filebox("initValue");
	$("#addsizelogo").filebox("initValue");
	$("#showspecimg img").remove();
	$("#showspeclogo img").remove();
	$("#showsizelogo img").remove();
	$("#addspec").dialog("open");
}
function spCZ(value, row, index) {
	if (row.isUp == 1) {
		return '<a href="javascript:updateSpecified();" class="audit1">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp' +
			'<a href="javascript:isdownspec();" class="audit1">下架</a>';
	} else {
		return '<a href="javascript:updateSpecified();" class="audit1">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp' +
			'<a href="javascript:isupspec();" class="audit1">上架</a>';
	}
}
function formatterspecTP(value, row, index) {
	return '<img src="' + value + '"width="80" height="60"/>';
}
function formatterwzml(value, row, index) {
	return '<a href="javascript:showPlace();" class="audit3">定制位置管理</a>';
}
function showPlace() {
	var row = null;
	 row = $("#addshowgiftspecified").datagrid("getSelected");
	if (row == null) {
		row = $("#showgiftspecified").datagrid("getSelected");
		if (row == null) {
			$.messager.alert('提示', '请选择数据！', 'warning');
			return;
		}
	}
	setCookie("skuId", row.skuId, 1);
	$("#showGiftSp").dialog("open");
	var middle = document.getElementById("showGiftSp");
	middle.innerHTML ='<iframe align="center" style="height:600px;width:100%;" src="./customizeplace.html" frameborder="no" scrolling="no"></iframe>';
}
//确定添加规格
function saveSpecified() {
	// 判断表单是否通过验证
	var valid = $('#addspecform').form('validate');
	if (!valid) {
		return valid;
	}
	if (addSpecImgid == null || addSpecImgid == '') {
		$.messager.alert('提示', '请上传规格封面图片', '');
	}
	// 获取表单af中的值并转化
	var afInfo = $("#addspecform").serializeArray();
	var spec = afInfo[0].value;
	var size = afInfo[1].value;
	var priceOrigin = afInfo[2].value;
	var priceDiscount = afInfo[3].value;
	var store = afInfo[4].value;
	$.ajax({
		url : '/gift-fly/system/mallWeb/addOrUpdateSku',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			spuId : id,
			spec : spec,
			size : size,
			priceOrigin : priceOrigin,
			priceDiscount : priceDiscount,
			specImageId : addSpecLogoid,
			imageId : addSpecImgid,
			sizeImageId : addSizeLogoid,
			store : store,
			node : "商品列表",
			adminid : adminid,
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#addspec").dialog("close");
				// 刷新当前页
				loadPecified();
				prodSpecified();
				$.messager.show({
					timeout : 500,
					msg : "添加成功！",
					title : "提示"
				});
				// 插入日志
				insertLog(adminid, 1, "添加id为:" + id + "的商品的商品规格", "商品列表");
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//编辑规格框
function updateSpecified() {
	var row = null;
	 row = $("#addshowgiftspecified").datagrid("getSelected");
	if (row == null) {
		row = $("#showgiftspecified").datagrid("getSelected");
		if (row == null) {
			$.messager.alert('提示', '请选择需要编辑的商品规格！', 'warning');
			return;
		}
	}
	if (row) {
		skuId = row.skuId;
		$("#upshowspecimg img").remove();
		$("#upshowspeclogo img").remove();
		$("#upshowsizelogo img").remove();
		$('#updatespecsp').form('load', {
			spec : row.spec,
			size : row.size,
			priceOrigin : row.priceOrigin,
			priceDiscount : row.priceDiscount,
			store : row.store,
		});
	}
	upSpecImgid = row.imageid;
	upSpecImgurl = row.image;
	upSpecLogoid = row.specImageid;
	upSpecLogourl = row.specImage;
	upSizeLogoid = row.sizeImageid;
	upSizeLogourl = row.sizeImage;
	if (upSpecImgurl != null && upSpecImgurl != '') {
		$("#upshowspecimg").append(
			'<img src="' + upSpecImgurl + '"style="width: 140px;height:100px;">' +
			'<img onclick="delupSpecImg()" style="position:absolute;right:10px; top:1px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');

	}
	if (upSpecLogourl != '' && upSpecLogourl != null) {
		$("#upshowspeclogo").append(
			'<img src="' + upSpecLogourl + '"style="width: 140px;height:100px;">' +
			'<img onclick="delupSpecLogo()" style="position:absolute;right:10px; top:1px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
	}
	if (upSizeLogourl != '' && upSizeLogourl != null) {
		$("#upshowsizelogo").append(
			'<img src="' + upSizeLogourl + '"style="width: 140px;height:100px;">' +
			'<img onclick="delupSizeLogo()" style="position:absolute;right:10px; top:1px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
	}
	$("#updatespec").dialog("open");
}
//保存编辑的规格信息
function updateSpecifiedInfo() {
	// 判断表单是否通过验证
	var valid = $('#updatespecsp').form('validate');
	if (!valid) {
		return valid;
	}
	// 获取表单af中的值并转化
	var afInfo = $("#updatespecsp").serializeArray();
	var spec = afInfo[0].value;
	var size = afInfo[1].value;
	var priceOrigin = afInfo[2].value;
	var priceDiscount = afInfo[3].value;
	var store = afInfo[4].value;
	$.ajax({
		url : '/gift-fly/system/mallWeb/addOrUpdateSku',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			spuId : id,
			skuId : skuId,
			spec : spec,
			size : size,
			priceOrigin : priceOrigin,
			priceDiscount : priceDiscount,
			specImageId : upSpecLogoid,
			imageId : upSpecImgid,
			sizeImageId : upSizeLogoid,
			store : store,
			node : "商品列表",
			adminid : adminid,
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#updatespec").dialog("close");
				// 刷新当前页
				loadPecified();
				prodSpecified();
				$.messager.show({
					timeout : 500,
					msg : "修改成功！",
					title : "提示"
				});
				// 插入日志
				insertLog(adminid, 1, "修改id为:" + id + "的商品的商品规格:" + skuId, "商品列表");
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//上架
function isupspec() {
	var row = null;
	 row = $("#addshowgiftspecified").datagrid("getSelected");
	if (row == null) {
		row = $("#showgiftspecified").datagrid("getSelected");
		if (row == null) {
			$.messager.alert('提示', '请选择需要上架的商品！', 'warning');
		}
	}
	skuId = row.skuId;
	lognote = "将" + skuId + "的状态改为上架";
	toDispostspec(skuId, 1, lognote);
}
//下架
function isdownspec() {
	var row = null;
	 row = $("#addshowgiftspecified").datagrid("getSelected");
	if (row == null) {
		row = $("#showgiftspecified").datagrid("getSelected");
		if (row == null) {
			$.messager.alert('提示', '请选择需要下架的商品！', 'warning');
		}
	}
	skuId = row.skuId;
	lognote = "将" + skuId + "的状态改为下架";
	toDispostspec(skuId, 0, lognote);
}
function toDispostspec(skuId, status, lognote) {
	$.ajax({
		url : '/gift-fly/system/mallWeb/updateSkuIsUp',
		dataType : "json",
		type : "post",
		data : {
			skuId : skuId,
			spuId : id,
			isup : status,
			adminid : adminid,
			node : '商品列表',
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 刷新当前页
				loadPecified();
				prodSpecified();
				$.messager.show({
					timeout : 500,
					msg : "修改成功！",
					title : "提示"
				});
				insertLog(adminid, 1, lognote, "商品列表");
			} else {
				$('#addshowgiftspecified').datagrid('loaded');
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
//规格封面图片上传
function addSpecImg() {
	$('#addspecimg').filebox({
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
					$("#showspecimg img").remove();
					addSpecImgurl = jQuery.parseJSON(xhr.responseText).url;
					addSpecImgid = jQuery.parseJSON(xhr.responseText).id;
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					$("#showspecimg").append(
						'<img src="' + addSpecImgurl + '"style="width: 140px;height:100px;">' +
						'<img onclick="delSpecImg()" style="position:absolute;right:10px; top:1px;width:16px;height:16px;cursor:pointer;"' +
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
function delSpecImg() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : addSpecImgurl,
			id : addSpecImgid,
		},
	});
	$("#showspecimg img").remove();
	$('#addspecimg').textbox('initValue');
}
//规格logo上传
function addSpecLogo() {
	$('#addspeclogo').filebox({
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
					$("#showspeclogo img").remove();
					addSpecLogourl = jQuery.parseJSON(xhr.responseText).url;
					addSpecLogoid = jQuery.parseJSON(xhr.responseText).id;
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					$("#showspeclogo").append(
						'<img src="' + addSpecLogourl + '"style="width: 140px;height:100px;">' +
						'<img onclick="delspeclogo()" style="position:absolute;right:10px; top:10px;width:16px;height:16px;cursor:pointer;"' +
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
function delspeclogo() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : addSpecLogourl,
			id : addSpecLogoid,
		},
	});
	$("#showspeclogo img").remove();
	$('#addspeclogo').textbox('initValue');
}
//尺寸logo上传
function addSizeLogo() {
	$('#addsizelogo').filebox({
		buttonText : '选择logo',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png',
		onChange : function() {
			$("#btnID").trigger("click");
			$("#upload-progressbar").window("open");
			var xhr = new XMLHttpRequest(); //第一步    
			var file = document.getElementById('filebox_file_id_5').files;
			var formData = new FormData();
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			xhr.send(formData); //第三步骤    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					$("#showsizelogo img").remove();
					addSizeLogourl = jQuery.parseJSON(xhr.responseText).url;
					addSizeLogoid = jQuery.parseJSON(xhr.responseText).id;
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					$("#showsizelogo").append(
						'<img src="' + addSizeLogourl + '"style="width: 140px;height:100px;">' +
						'<img onclick="deladdsizelogo()" style="position:absolute;right:10px; top:10px;width:16px;height:16px;cursor:pointer;"' +
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
function deladdsizelogo() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : addSizeLogourl,
			id : addSizeLogoid,
		},
	});
	$("#showsizelogo img").remove();
	$('#addsizelogo').textbox('initValue');
}
//修改规格封面图片上传
function upSpecImg() {
	$('#upspecimg').filebox({
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
					if (upSpecImgurl != null && upSpecImgid != null) {
						$.ajax({
							url : '/gift-fly/system/upload/delImg',
							dataType : "json",
							type : "post",
							data : {
								url : upSpecImgurl,
								id : upSpecImgid,
							},
						});
						$("#upshowspecimg img").remove();
					}
					upSpecImgurl = jQuery.parseJSON(xhr.responseText).url;
					upSpecImgid = jQuery.parseJSON(xhr.responseText).id;
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					$("#upshowspecimg").append(
						'<img src="' + upSpecImgurl + '"style="width: 140px;height:100px;">' +
						'<img onclick="delupSpecImg()" style="position:absolute;right:10px; top:1px;width:16px;height:16px;cursor:pointer;"' +
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
function delupSpecImg() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : upSpecImgurl,
			id : upSpecImgid,
		},
	});
	$("#upshowspecimg img").remove();
	$('#upspecimg').textbox('initValue');
}
//修改规格logo上传
function upSpecLogo() {
	$('#upspeclogo').filebox({
		buttonText : '选择图片',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png',
		onChange : function() {
			$("#btnID").trigger("click");
			$("#upload-progressbar").window("open");
			var xhr = new XMLHttpRequest(); //第一步    
			var file = document.getElementById('filebox_file_id_5').files;
			var formData = new FormData();
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			xhr.send(formData); //第三步骤    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					if (upSpecLogourl != null && upSpecLogoid != null) {
						$.ajax({
							url : '/gift-fly/system/upload/delImg',
							dataType : "json",
							type : "post",
							data : {
								url : upSpecLogourl,
								id : upSpecLogoid,
							},
						});
						$("#upshowspeclogo img").remove();
					}
					upSpecLogourl = jQuery.parseJSON(xhr.responseText).url;
					upSpecLogoid = jQuery.parseJSON(xhr.responseText).id;
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					$("#upshowspeclogo").append(
						'<img src="' + upSpecLogourl + '"style="width: 140px;height:100px;">' +
						'<img onclick="delspeclogo()" style="position:absolute;right:10px; top:10px;width:16px;height:16px;cursor:pointer;"' +
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
function delupSpecLogo() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : upSpecLogourl,
			id : upSpecLogoid,
		},
	});
	$("#upshowspeclogo img").remove();
	$('#upspeclogo').textbox('initValue');
}
//修改尺寸logo上传
function upSizeLogo() {
	$('#upsizelogo').filebox({
		buttonText : '选择logo',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png',
		onChange : function() {
			$("#btnID").trigger("click");
			$("#upload-progressbar").window("open");
			var xhr = new XMLHttpRequest(); //第一步    
			var file = document.getElementById('filebox_file_id_6').files;
			var formData = new FormData();
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			xhr.send(formData); //第三步骤    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					if (upSizeLogourl != null && upSizeLogoid != null) {
						$.ajax({
							url : '/gift-fly/system/upload/delImg',
							dataType : "json",
							type : "post",
							data : {
								url : upSizeLogourl,
								id : upSizeLogoid,
							},
						});
						$("#upshowsizelogo img").remove();
					}
					upSizeLogourl = jQuery.parseJSON(xhr.responseText).url;
					upSizeLogoid = jQuery.parseJSON(xhr.responseText).id;
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					$("#upshowsizelogo").append(
						'<img src="' + upSizeLogourl + '"style="width: 140px;height:100px;">' +
						'<img onclick="delupsizelogo()" style="position:absolute;right:10px; top:10px;width:16px;height:16px;cursor:pointer;"' +
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
function delupSizeLogo() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : upSizeLogourl,
			id : upSizeLogoid,
		},
	});
	$("#upshowsizelogo img").remove();
	$('#upsizelogo').textbox('initValue');
}
