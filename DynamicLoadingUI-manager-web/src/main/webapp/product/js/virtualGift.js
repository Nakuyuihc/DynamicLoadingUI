$(document).ready(function() {
	loginCheck1();
	prostatus();
	cleardata();
	uploadImg();
	uploadupImg();
	var p = $('#virtualdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [15, 20, 25],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findVirtualList(pageNumber, pageSize, condition, status);
		},
	});
	findVirtualList(1, 15, condition, status);
	//上传进度条
	progressBar();
});
var condition = null;
var status;
var adminid = ReadCookie("adminid");
var lognote;
var id;
var name;
var priceMarket;
var addimgid;
var addimgurl=null;
var upimgid;
var upimgurl=null;
var isUp;
var upTime=null;
var downTime=null;
function queryInfo() {
	var p = $('#virtualdg').datagrid('getPager');
	var options = p.data("pagination").options;
	var page = options.pageNumber;
	var rows = options.pageSize;
	condition = $("#product").val();
	status = $('#prostatus').combobox('getValue');
	findVirtualList(page, rows, condition, status);
}
// 分页查询
function findVirtualList(page, rows, condition, status) {
	$('#virtualdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/mallWeb/findVirtualList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			condition : condition,
			status : status,
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 需要传递total总条数和rows列表...
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#virtualdg').datagrid('loaded');
				$("#virtualdg").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
//清除数据缓存
function cleardata() {
	$("#product").val("");
	$("#protype").combobox('clear');
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
function formattershowIMG(value, row, index) {
	return '<img class="imgmargin" src="'+ value +'"width="80" height="60"/>';
}
function formatterCZ(value, row, index) {
	if (row.isUp == 1) {
		return '<a href="javascript:checkDetail();" class="audit1">查看</a>&nbsp;&nbsp;&nbsp;&nbsp' +
			'<a href="javascript:isdown();" class="audit1">下架</a>';
	} else {
		return '<a href="javascript:checkDetail();" class="audit1">查看</a>&nbsp;&nbsp;&nbsp;&nbsp' +
			'<a href="javascript:isup();" class="audit1">上架</a>';
	}
}
//状态下拉列表
function prostatus() {
	$('#prostatus').combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		data : [ {
			"id" : "1",
			"name" : "出售中",
		}, {
			"id" : "0",
			"name" : "已下架"
		} ]
	});
}
//批量处理上架
function isup() {
	var row = $("#virtualdg").datagrid("getSelected");
	if (row.length == 0) {
		$.messager.alert('提示', '请选择需要上架的虚拟礼物！', 'warning');
		return;
	}
	id = row.id;
	name = row.name;
	priceMarket = row.priceMarket;
	upimgid = row.imageId;
	upTime = new Date();
	lognote = "将" + name + "的状态改为上架";
	toDispost(id,1, lognote);
}
//批量处理下架
function isdown() {
	var row = $("#virtualdg").datagrid("getSelected");
	if (row.length == 0) {
		$.messager.alert('提示', '请选择需要下架的商品！', 'warning');
		return;
	}
	id = row.id;
	name = row.name;
	priceMarket = row.priceMarket;
	upimgid = row.imageId;
	lognote = "将" + name + "的状态改为下架";
	toDispost(id,0, lognote);
}
function toDispost(id,status, lognote) {
	$.ajax({
		url : '/gift-fly/system/mallWeb/updateVirtual',
		dataType : "json",
		type : "post",
		data : {
			id : id,
			name : name,
			priceMarket : priceMarket,
			imageId:upimgid,
			isUp : status,
			upTime : upTime,
			downTime : downTime,
			adminid : adminid,
			node : "虚拟礼物",
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 刷新当前页
				$('#virtualdg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "修改成功！",
					title : "提示"
				});
				insertLog(adminid, 1, lognote, "虚拟礼物");
			} else {
				$('#virtualdg').datagrid('loaded');
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}

//添加虚拟礼物
function addMerchant() {
	$("#addname").textbox("initValue");
	$("#addpriceMarket").textbox("initValue");
	$("#adimg").filebox("initValue");
	$("#showimg img").remove();
	$("#appvirtualDetail").dialog("open");
}
//保存添加
function savevirtualInfo() {
	// 判断表单是否通过验证
	var valid = $('#addVfrom').form('validate');
	if (!valid) {
		return valid;
	}
	// 获取表单af中的值并转化
	var afInfo = $("#addVfrom").serializeArray();
	var name = afInfo[0].value;
	var priceMarket = afInfo[1].value;
	$.ajax({
		url : '/gift-fly/system/mallWeb/insertVirtual',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			name : name,
			priceMarket : priceMarket,
			imageId : addimgid,
			adminid : adminid,
			node : "虚拟礼物",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#appvirtualDetail").dialog("close");
				// 刷新当前页
				$('#virtualdg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "添加成功！",
					title : "提示"
				});
				// 插入日志
				insertLog(adminid, 1, "新增虚拟礼物:" + name, "虚拟礼物");
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//查看虚拟礼物对话框
function checkDetail() {
	var row = $("#virtualdg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要查看的虚拟礼物', 'warning');
		return;
	}
	$("#showupimg img").remove();
	id = row.id;
	isUp = row.isUp;
	upimgid = row.imageId;
	upimgurl = row.imageUrl;
	$('#updatevfrom').form('load', {
		name : row.name,
		priceMarket : row.priceMarket,
	});
	$("#showupimg").append(
			'<img src="'+upimgurl+'"style="width: 145px;height:100px;">'+
	'<img onclick="delupimg()" style="position:absolute;right:10px; top:10px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
	$("#upvirtualDetail").dialog("open");
}
//保存编辑
function updatevirtualInfo() {
	// 判断表单是否通过验证
	var valid = $('#updatevfrom').form('validate');
	if (!valid) {
		return valid;
	}
	if (upimgid =='' || upimgid == 0) {
		$.messager.alert('提示', '请上传虚拟礼物的图片', '');
		return;
	}
	// 获取表单af中的值并转化
	var afInfo = $("#updatevfrom").serializeArray();
	var name = afInfo[0].value;
	var priceMarket = afInfo[1].value;
	$.ajax({
		url : '/gift-fly/system/mallWeb/updateVirtual',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			id : id,
			name : name,
			priceMarket : priceMarket,
			isUp : isUp,
			imageId : upimgid,
			adminid : adminid,
			node : "虚拟礼物",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#upvirtualDetail").dialog("close");
				// 刷新当前页
				$('#virtualdg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "修改成功！",
					title : "提示"
				});
				// 插入日志
				insertLog(adminid, 1, "编辑虚拟礼物:" + name, "虚拟礼物");
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
	},
	phoneandtel : {
		validator : function(value, param) {
			var v_phone = '^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))|(17[0-9]))\\d{8}$';
			var v_tel = '^(0\\d{2}-\\d{8}(-\\d{1,4})?)|(0\\d{3}-\\d{7,8}(-\\d{1,4})?)$';
			var phone = value.match(v_phone);
			var tel = value.match(v_tel);
			if (phone == null && tel == null) {
				return null;
			}
		},
		message : '请输入正确的电话号码或手机号码'
	},
	userphone : {
		validator : function(value, param) {
			/*var v_phone = '^1[3|4|5|7|8][0-9]\d{4,8}$';
				return value.match(v_phone);*/
			var len = $.trim(value).length;
			return len >= param[0] && len <= param[1];
		},
		message : '请输入正确的手机号码'
	},
	bankcard : {
		validator : function(value, param) {
			/*var v_num = '/^([1-9]{1})(\d{14}|\d{18})$/';
			return value.match(v_num);*/
			var len = $.trim(value).length;
			return len >= param[0] && len <= param[1];
		},
		message : '请输入正确的银行卡号'
	},
	passwordValid : {
		validator : function(value, param) {
			var v_password = '^[A-Za-z0-9_]{4,20}$';
			return value.match(v_password);
		},
		message : '必须是4-20位数字、英文字母、下划线！'
	}
});
//新增虚拟礼物的图片上传
function uploadImg() {
	$('#adimg').filebox({
		buttonText : '选择图片',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png,image/gif',
		onChange : function() {
			$("#upload-progressbar").window("open");
			var xhr = new XMLHttpRequest(); //第一步    
			var file = document.getElementById('filebox_file_id_1').files;
			var formData = new FormData();
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			//post方式    
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			//发送请求    
			xhr.send(formData); //第三步骤    
			//ajax返回    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
						$("#showimg img").remove();
					addimgurl = jQuery.parseJSON(xhr.responseText).url; 
					addimgid = jQuery.parseJSON(xhr.responseText).id;
					$("#showimg").append(
							'<img src="'+addimgurl+'"style="width: 145px;height:100px;">'+
					'<img onclick="delimg()" style="position:absolute;right:10px; top:10px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
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
	});
	$("#showimg img").remove();
	$('#adimg').textbox('initValue');	
}
function uploadupImg() {
	$('#upimg').filebox({
		buttonText : '选择图片',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png,image/gif',
		onChange : function() {
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
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					if (upimgurl != null) {
						$.ajax({
							url : '/gift-fly/system/upload/delImg',
							dataType : "json",
							type : "post",
							data : {
								url : upimgurl,
								id : upimgid,
							},
						});
						$("#showupimg img").remove();
					}
					upimgurl = jQuery.parseJSON(xhr.responseText).url; 
					upimgid = jQuery.parseJSON(xhr.responseText).id;
					$("#showupimg").append(
							'<img src="'+upimgurl+'"style="width: 145px;height:100px;">'+
					'<img onclick="delupimg()" style="position:absolute;right:10px; top:10px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
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
function delupimg() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : upimgurl,
			id : upimgid,
		},
	});
	$("#showupimg img").remove();
	$('#upimg').textbox('initValue');	
}