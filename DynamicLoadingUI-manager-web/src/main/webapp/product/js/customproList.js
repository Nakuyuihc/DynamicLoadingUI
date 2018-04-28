$(document).ready(function() {
	loginCheck1();
	//protype();
	prostatus();
	cleardata();
	var p = $('#custproductdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [15,20,25],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findProdList(pageNumber, pageSize,seachKey,isUp);
		},
	});
	findProdList(1, 15,seachKey,isUp);
	//上传进度条
	progressBar();
});
var catId;
var seachKey = null;
var isUp;
var adminid = ReadCookie("adminid");
var orgId = ReadCookie("orgId");
var lognote;
var timeID = null;
var upimgArray = [];
function queryInfo() {
	var p = $('#custproductdg').datagrid('getPager');
	var options = p.data("pagination").options;
	var page = options.pageNumber;
	var rows = options.pageSize;
	seachKey = $("#product").val();
	isUp = $('#prostatus').combobox('getValue');
	findProdList(page, rows,seachKey,isUp);
}
// 分页查询
function findProdList(page, rows,seachKey,isUp) {
	$('#custproductdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/mallWeb/findProdList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			seachKey : seachKey,
			isUp : isUp,
			orgId : orgId,
			spuType : 5,
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 需要传递total总条数和rows列表...
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#custproductdg').datagrid('loaded');
				$("#custproductdg").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示',  err.msg, 'error');
		}
	});
}
//清除数据缓存
function cleardata() {
	$("#product").val("");
	$("#prostatus").combobox('clear');
	seachKey = null;
}
function formatterZT(value, row, index) {
	if (value == 1) {
		return '出售中';
	} else {
		return '已下架';
	}
}
function formatterCZ(value, row, index) {
	if (row.isUp == 1) {
		return  '<a href="javascript:checkDetail();" class="audit1">查看</a>&nbsp;&nbsp;&nbsp;&nbsp'+
		'<a href="javascript:isdown();" class="audit1">下架</a>';
	} else {
		return  '<a href="javascript:checkDetail();" class="audit1">查看</a>&nbsp;&nbsp;&nbsp;&nbsp'+
		'<a href="javascript:isup();" class="audit1">上架</a>';
	}
}
//商品分类
/*function protype() {
	$.ajax({
		url : '/gift-fly/system/mallWeb/findAllChildCat',
		dataType : "json",
		type : "post",
		data : {},
		success : function(data) {
			if (data.status == "succeed") {
				$('#protype').combobox({
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
}*/
//状态下拉列表
function prostatus() {
	$('#prostatus').combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		value:'全部',
		data : [{    
		    "id":"1",    
		    "name":"出售中", 
		},{    
		    "id":"0",    
		    "name":"已下架"   
		}]
	});
}
//批量处理上架
function isup() {
	var row = $("#custproductdg").datagrid("getSelections");
	if (row.length == 0) {
		$.messager.alert('提示', '请选择需要上架的商品！', 'warning');
		return;
	}
	var ids = [];
	for ( var i = 0; i < row.length; i++) {
		ids.push(row[i].id);
	}
	lognote ="将"+ids+"的状态改为上架";
	toDispost(ids.toString(),1,lognote);
}
//批量处理下架
function isdown() {
	var row = $("#custproductdg").datagrid("getSelections");
	if (row.length == 0) {
		$.messager.alert('提示', '请选择需要下架的商品！', 'warning');
		return;
	}
	var ids = [];
	for ( var i = 0; i < row.length; i++) {
		ids.push(row[i].id);
	}
	lognote ="将"+ids+"的状态改为下架";
	toDispost(ids.toString(),0,lognote);
}
function toDispost(ids,status,lognote) {
	$.ajax({
		url : '/gift-fly/system/mallWeb/updateIsUp',
		dataType : "json",
		type : "post",
		data : {
			ids : ids,
			isup : status,
			adminid : adminid,
			node : '商品列表',
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 刷新当前页
				$('#custproductdg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "修改成功！",
					title : "提示"
				});
				insertLog(adminid, 1, lognote, "商品列表");
			} else {
				$('#selfgiftdg').datagrid('loaded');
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示',  err.msg, 'error');
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
//新增的样例图片
function addSampleImg() {
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
//新增的背景图片
function addBgImg() {
	$('#addspeclogo').filebox({
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
//编辑的样例图片
function upSampleImg() {
	$('#addsizelogo').filebox({
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
//编辑的背景图片
function upBgImg() {
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
					$("#upshowspecimg img").remove();
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
