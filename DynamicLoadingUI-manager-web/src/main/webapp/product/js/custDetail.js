/**
 * 添加商品对话框
 */
function addProduct() {
	editor.html("");
	templateimgid=0;
	templateimgurl = null;
	$("#addprodname").textbox("initValue");
	$("#addprodantistop").textbox("initValue");
	$("#adddescription").textbox("initValue");
	$("#addgeneralInfo").show();
	$("#addproductImg").hide();
	$("#addprodSpecified").hide();
	$("#addprodPack").hide();
	$("#toptd1").css({
		color : "#27A9E3"
	}, {
		fontSize : "15px"
	});
	$("#toptd2").css({
		color : "#BBB"
	}, {
		fontSize : "14px"
	});
	$("#toptd3").css({
		color : "#BBB"
	}, {
		fontSize : "14px"
	});
	$("#toptd4").css({
		color : "#BBB"
	}, {
		fontSize : "14px"
	});
	$.ajax({
		url : '/gift-fly/system/mallWeb/findProdPackByOrgId',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			page : 1,
			rows : 99,
			orgId : orgId,
		},
		success : function(data) {
			if (data.status == "succeed") {
				$('#addpacking').combobox({
					panelHeight : 'auto',
					multiple : "true", 
					valueField : 'id',
					textField : 'name',
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
	$('#addpacking').combobox('setValues', []);
	$("#addcustproductinfo").dialog("open");
}
var senderName = ReadCookie("username");
var orgId = ReadCookie("orgId");
var articleId=0;
var content;
var packids;
var id; //spuId

function nextstep() {
	var valid = $('#addMfrom').form('validate');
	if (!valid) {
		$.messager.alert('提示', '请完善商品基本信息', '');
		return;
	}
	var content = editor.html();
	if (content.length == 0) {
		$.messager.alert('提示', '请填写商品详情信息', '');
		return;
	}
	// 获取表单af中的值并转化
	var spuName =$("#addprodname").val();
	var prodCatId = 0;
	var spuSeachKey = $("#addprodantistop").val();
	var packing = $("#addpacking").combobox("getValues");
	var summery = $("#adddescription").val();
	var packIds = packing.toString();
	var type = 0;
	$.ajax({
		url : '/gift-fly/system/cms/insertAndUpdateArticle',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			content : content,
			type : type,
			title : spuName,
			senderName : senderName,
			node : "定制商品列表",
			adminid : adminid,
		},
		success : function(data) {
			if (data.status == "succeed") {
				articleId = data.id;
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
	var tagIds = 0;
	$.ajax({
		url : '/gift-fly/system/mallWeb/addSpu',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			spuName : spuName,
			spuType : 5,
			prodCatId : prodCatId,
			summery : summery,
			spuSeachKey : spuSeachKey,
			articleId : articleId,
			tagIds : tagIds,
			orgId : orgId,
			adminid : adminid,
			weight : 0,
			packIds : packIds,
			node : "定制商品列表",
		},
		success : function(data) {
			if (data.status == "succeed") {
				id = data.spuId;
				insertTemplateInfo();
				$("#showImg div").remove();
				$("#addproductImg").show();
				$("#addgeneralInfo").hide();
				$("#addprodSpecified").hide();
				$("#addprodPack").hide();
				$("#toptd1").css({
					color : "#BBB"
				}, {
					fontSize : "14px"
				});
				$("#toptd2").css({
					color : "#27A9E3"
				}, {
					fontSize : "15px"
				});
				$("#toptd3").css({
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
				insertLog(adminid, 1, "新增定制商品:" + spuName, "定制商品列表");
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//新增模版
function insertTemplateInfo() {
	var title = $("#addtitle").val();
	var templateType = $("#templateType").combobox("getValue");
	$.ajax({
		url : '/gift-fly/system/custom/insertTemplateInfo',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			title : title,
			spuId : id,
			type : templateType,
			imageId : templateimgid,
			node : "定制商品列表",
			adminid : adminid,
		},
		success : function(data) {
			if (data.status == "succeed") {
				templateId = data.id;
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//查看商品
function checkDetail() {
	var row = $("#custproductdg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要查看的商品', 'warning');
		return;
	}
	templateimgid=0;
	templateimgurl = null;
	$("#showuptemplateimg img").remove();
	id = row.id;
	selectProdDetail(id);
	selectTemplate(id);
	$("#productDetail").dialog("open");
	$("#productImg").hide();
	$("#prodSpecified").hide();
	$("#prodPack").hide();
	$("#generalInfo").show();
}
//显示模版信息
function selectTemplate(id) {
	$.ajax({
		url : '/gift-fly/system/custom/selectTemplateBySpuId',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			spuid : id,
		},
		success : function(data) {
			if (data.status == "succeed") {
				var uptitle = data.entity.title;
				console.log(uptitle);
				$('#uptitle').textbox('setText',uptitle);
				$("#templateType").combobox('setValue',data.entity.type);
				$("#showuptemplateimg").append(
						'<img src="' + data.entity.imageUrl + '"style="width: 140px;height:140px;">' +
						'<img onclick="deltemplateimgurl()" style="position:absolute;right:10px; top:10px;width:16px;height:16px;cursor:pointer;"' +
				' src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			/*$.messager.alert('提示', err.msg, 'error');*/
		}
	});
}
function selectProdDetail(id) {
	$.ajax({
		url : '/gift-fly/system/mallWeb/findDitailById',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			id : id,
		},
		success : function(data) {
			if (data.status == "succeed") {
				toUpload(data.entity);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
//加载到页面上
function toUpload(entity) {
		packids= entity.packIds;
		articleId = entity.articleId;
	url="https://api.who168.com/gift-fly/dist/index#/goodDetail?promId=0&skuId="+entity.skuId+
	"&spuId="+entity.spuId+"&type="+entity.spuType;	
	$('#qrcode').html("");
	$("#qrcode").qrcode({
		width : 120,
		height : 120,
		text : url,
	});
	$("#save").click(function(){ 
		$("#download").attr("download",entity.spuName+".jpg"); 
		$("#download").attr('href', '');
		var canvas = $('#qrcode').find("canvas").get(0); 
		var url = canvas.toDataURL('image/jpeg'); 
		$("#download").attr('href', url).get(0).click(); 
		window.location.reload();
		});
	$("#uppacklist").combobox('setValues',entity.packList);
	$('#upusesign').tree({
		animate : true,
		checkbox : true,
		data : entity.uses,
	});
	$('#upfestivalsign').tree({
		animate : true,
		checkbox : true,
		data : entity.festervals,
	});
	$(".tree-indent").remove();
	$(".tree-file").remove();
	editor2.html("");
	content = entity.content;
	editor2.html(content);
	$.ajax({
		url : '/gift-fly/system/mallWeb/findAllChildCat',
		dataType : "json",
		type : "post",
		async : false,
		data : {},
		success : function(data) {
			if (data.status == "succeed") {
				$('#upprodtype').combobox({
					//panelHeight : 'auto',
					valueField : 'id',
					textField : 'name',
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
	$.ajax({
		url : '/gift-fly/system/mallWeb/findProdPackByOrgId',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			page : 1,
			rows : 99,
			orgId : orgId,
		},
		success : function(data) {
			if (data.status == "succeed") {
				$('#uppacklist').combobox({
					panelHeight : 'auto',
					multiple : "true", 
					valueField : 'id',
					textField : 'name',
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
	$('#uppacklist').combobox('setValues', entity.packList);
	$('#productDetailform').form('load', {
		prodname : entity.spuName,
		prodantistop : entity.spuSeachKey,
		description : entity.summery,
	});
	var arr = entity.images;
	$("#upshowImg div").remove();
	$.each(arr, function(n, value) {
		$("#upshowImg").append('<div id="' + n + '" style="position:relative;float:left;">' +
			'<img id=' + value.id + ' class="upgiftpic" style="width:150px;height:120px;margin:5px 20px;" src="' + value.accessUrl + '"/>' +
			'<img onclick="delProImg(' + n + ',' + value.id + ')" style="position:absolute;right:10px; top:1px;width:16px;height:16px;cursor:pointer;" src="../common/jquery-easyui-1.5.3/themes/icons/cancel.png"/></div>');
	});
}
function delProImg(i, id) {
	var url = $("#" + id).attr("src");
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : url,
			id : id,
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#" + i).remove();
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
function generalInfo() {
	$("#productImg").hide();
	$("#prodSpecified").hide();
	$("#prodPack").hide();
	$("#generalInfo").show();
}
function productImg() {
	$("#productImg").show();
	$("#prodSpecified").hide();
	$("#prodPack").hide();
	$("#generalInfo").hide();
}
function prodSpecified() {
	$('#showgiftspecified').datagrid('loading');
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
				$('#showgiftspecified').datagrid('loaded');
				$("#showgiftspecified").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
	$("#productImg").hide();
	$("#prodSpecified").show();
	$("#prodPack").hide();
	$("#generalInfo").hide();
}
function addupSpec() {
	//clearSpecInfo();
	$("#addspecimg").filebox("initValue");
	$("#addspeclogo").filebox("initValue");
	$("#addsizelogo").filebox("initValue");
	$("#showspecimg img").remove();
	$("#showspeclogo img").remove();
	$("#showsizelogo img").remove();
	$("#addspec").dialog("open");
}

//清除查看时的规格对话框的缓存
function clearSpecInfo() {
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
}
function upPreview() {
	var file = document.getElementById('upimgs').files;
	var imglist = $(".upgiftpic");
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
			$("#progressBarID").progressbar("setValue", 100);
			$("#upload-progressbar").window("close");
			var imgentity = jQuery.parseJSON(xhr.responseText).list;
			for (var i in imgentity) {
				$("#upshowImg").append('<div style="float:left;position:relative;">' +
					'<img class="upgiftpic" id="' + imgentity[i].id + '" style="width:150px;height:120px;margin-right:5px;" src="' + imgentity[i].url + '"/>' +
					'<img onclick="delupgiftpic(' + imgentity[i].id + ')" style="position:absolute;right:10px; top:5px;width:16px;height:16px;cursor:pointer;" src="/MerchantSystem/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/><div>');
			}
		}
	};
	//设置超时时间    
	xhr.timeout = 30000;
	xhr.ontimeout = function(event) {
		alert('请求超时！');
	}
}
function delupgiftpic(id) {
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
function saveprod1() {
	var valid = $('#productDetailform').form('validate');
	if (!valid) {
		$.messager.alert('提示', '请完善商品基本信息', '');
		return;
	}
	var newcontent = editor2.html();
	// 获取表单af中的值并转化
		var afInfo = $("#productDetailform").serializeArray();
		var spuName = afInfo[0].value;
		var prodCatId = afInfo[1].value;
		var spuSeachKey = afInfo[2].value;
		var packing = $("#uppacklist").combobox("getValues");
		var summery = $("#updescription").val();
		var packIds = packing.toString();
		var type = 0;
		var signArray = [];
	if (newcontent.length == 0) {
		$.messager.alert('提示', '请填写商品详情信息', '');
	}
		$.ajax({
			url : '/gift-fly/system/cms/insertAndUpdateArticle',
			dataType : "json",
			type : "post",
			async : false,
			data : {
				id : articleId,
				content : newcontent,
				type : type,
				title : spuName,
				senderName : senderName,
				node : "商品列表",
				adminid : adminid,
			},
			success : function(data) {
				if (data.status == "succeed") {
					articleId = data.id;
					//
					$("#productDetail").dialog("close");
				} else {
					$.messager.alert('提示', data.msg, 'error');
					return;
				}
			},
			error : function(err) {
				$.messager.alert('提示', '系统异常！', 'error');
			}
		});
	//获取用途标签
	var usenodes = $('#upusesign').tree('getChecked');
	if (usenodes.length > 0) {
		for (var i = 0; i < usenodes.length; i++) {
			signArray.push(usenodes[i].id);
		}
	}
	//获取节日标签
	var festivalsigns = $('#upfestivalsign').tree('getChecked');
	if (festivalsigns.length > 0) {
		for (var i = 0; i < festivalsigns.length; i++) {
			signArray.push(festivalsigns[i].id);
		}
	}
	var tagIds = signArray.toString();
	$.ajax({
		url : '/gift-fly/system/mallWeb/updateSpuEntity',
		dataType : "json",
		type : "post",
		data : {
			spuId : id,
			spuName : spuName,
			packIds : packIds,
			spuType : 1,
			prodCatId : prodCatId,
			summery : summery,
			spuSeachKey : spuSeachKey,
			articleId : articleId,
			tagIds : tagIds,
			orgId : orgId,
			adminid : adminid,
			weight : 0,
			node : "商品列表",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$('#custproductdg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "保存成功！",
					title : "提示"
						
				});
				$('#productDetail').dialog('close');
				insertLog(adminid, 1, "修改商品基本信息:" + spuName, "商品列表");
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
function saveprod2() {
	//保存图片id到spu中
	var images=[];
	$(".upgiftpic").each(function(){
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
			async : false,
			data : {
				spuId : id,
				imageIds : imageIds,
				adminid : adminid,
				node : "商品列表",
			},
			success : function(data) {
				if (data.status == "succeed") {
					$.messager.show({
						timeout : 500,
						msg : "保存成功！",
						title : "提示"
					});
					insertLog(adminid, 1, "修改id为:" + id + "的商品相册:" + imageIds, "商品列表");
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
		return;
	}
}
function saveprod3() {
	$.messager.show({
		timeout : 500,
		msg : "保存成功！",
		title : "提示"
	});
}
function saveprod4() {
	$('#custproductdg').datagrid('getPager').pagination('select');
	$("#productDetail").dialog("close");
	$.messager.show({
		timeout : 500,
		msg : "编辑成功！",
		title : "提示"
	});
}
function saveInfo() {
	$("#addcustproductinfo").dialog("close");
	$('#custproductdg').datagrid('getPager').pagination('select');
	$.messager.show({
		timeout : 500,
		msg : "添加成功！",
		title : "提示"
	});
}