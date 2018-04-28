$(document).ready(function() {
	loginCheck1();
	chearinfo();
	var p = $('#merchantListdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [ 15, 20, 25 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findMerchantList(pageNumber, pageSize, seachKey, startTime, endTime);
		},
	});
	findMerchantList(1, 15, seachKey, startTime, endTime);
	uploadLogo();
	uploadImg();
	uploadupLogo();
	uploadupImg();
	//上传进度条
	progressBar();
});
var seachKey = null;
var startTime = null;
var endTime = null;
var total;
var adminid = ReadCookie("adminid");
var verifyName;
var addlogoid;
var addlogourl=null;
var addimgid;
var addimgurl=null;
var uplogoid;
var uplogourl=null;
var upimgid;
var upimgurl=null;
var num = '^[0-9]*$';
var id;
function findByMerchantName() {
	var p = $('#merchantListdg').datagrid('getPager');
	var options = p.data("pagination").options;
	var page = options.pageNumber;
	var rows = options.pageSize;
	seachKey = $("#merchantName").val();
	findMerchantList(page, rows, seachKey, startTime, endTime)
}
// 分页查询
function findMerchantList(page, rows, seachKey, startTime, endTime) {
	$('#merchantListdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/cisweb/findMerchantList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			seachKey : seachKey,
			startTime : startTime,
			endTime : endTime,
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 需要传递total总条数和rows列表...
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#merchantListdg').datagrid('loaded');
				$("#merchantListdg").datagrid('loadData', obj);
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
		return '自营商家';
	} else if (value == 2) {
		return '加盟商家';
	}
}
function formatterCZ(value, row, index) {
	return '<a href="javascript:lookOver();" class="audit">查看</a>&nbsp;&nbsp;' +
		'<a href="javascript:account();" class="audit">账户</a>&nbsp;&nbsp;' +
		'<a href="javascript:deleteInfo();" class="audit">删除</a>';
}
//查看信息
function lookOver() {
	$("#merchanttype").val('');
	var row = $("#merchantListdg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要查看的加盟商', 'warning');
		return;
	}
	id = row.id;
	$("#showupimg img").remove();
	$("#showuplogo img").remove();
	var merchanttype;
	if (row.type == 1) {
		merchanttype = '自营商家';
	} else if (row.type == 2) {
		merchanttype = '加盟商家';
	}
	$('#updateMfrom').form('load', {
		id : id,
		orgName : row.orgName,
		merchanttype : merchanttype,
		orgTel : row.orgTel,
		address : row.address,
		contactName : row.contactName,
		contactTel : row.contactTel,
		weight : row.weight,
		username : row.openId,
		description : row.description,
		birthday : row.birthday,
		password : "111111",
	});
	var imgid = row.imageId;
	if(imgid != 0 && imgid != null){
		$.ajax({
			url : '/gift-fly/system/upload/selectImg',
			dataType : "json",
			type : "post",
			data : {
				id : imgid,
			},
			success : function(data) {
				if (data.status == "succeed") {
					uplogourl = data.entity.accessUrl; 
					uplogoid = imgid;
					$("#showuplogo").append(
							'<img src="'+uplogourl+'"style="width: 100px;height:100px;">'+
					'<img onclick="deluplogo()" style="position:absolute;right:0; top:1px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
				}else{
					$.messager.alert('提示', data.msg, 'error');
				}
			},
			error : function(err) {
				$.messager.alert('提示', '系统异常！', 'error');
			}
		});
	}
	$("#showdetailinfo").dialog("open");
}
//保存编辑信息
function saveupdateInfo() {
	// 判断表单是否通过验证
		var valid = $('#updateMfrom').form('validate');
		if (!valid) {
			return ;
		}
		if(uplogourl == null){
			$.messager.alert('提示',"请上传加盟商的logo", '');
			return;
		}
		// 获取表单af中的值并转化
		var afInfo = $("#updateMfrom").serializeArray();
		var orgName = afInfo[0].value;
		var orgTel = afInfo[1].value;
		var address = afInfo[2].value;
		var contactName = afInfo[3].value;
		var contactTel = afInfo[4].value;
		var weight = afInfo[5].value;
		var description = afInfo[6].value;
		$.ajax({
			url : '/gift-fly/system/cisweb/uppdateMerchant',
			dataType : "json",
			type : "post",
			async : false,
			data : {
				id : id,
				orgname : orgName,
				orgTel : orgTel,
				weight : weight,
				description : description,
				address : address,
				contactName : contactName,
				contactTel : contactTel,
				logoid : uplogoid,
				imgid : upimgid,
				adminid : adminid,
				node : "加盟商列表",
			},
			success : function(data) {
				if (data.status == "succeed") {
					$("#showdetailinfo").dialog("close");
					// 刷新当前页
					$('#merchantListdg').datagrid('getPager').pagination('select');
					$.messager.show({
						timeout : 500,
						msg : "修改成功！",
						title : "提示"
					});
					// 插入日志
					insertLog(adminid, 1, "修改加盟商:" + orgName, "加盟商列表");
				}else{
					$.messager.alert('提示', data.msg, 'error');
				}
			},
			error : function(err) {
				$.messager.alert('提示', '系统异常！', 'error');
			}
		});
}
//删除
function deleteInfo() {
	var row = $("#merchantListdg").datagrid("getSelected");
	if (row) {
		var id = row.id;
		$.messager.confirm('请确认', '一旦删除,该加盟商的所有相关信息全部删除,确定删除吗?', function(b) {
			if (b) {
				$.ajax({
					url : '/gift-fly/system/cisweb/deleteOrg',
					dataType : "json",
					type : "post",
					data : {
						id : id,
						adminid : adminid,
						node : "加盟商列表",
					},
					success : function(data) {
						if (data.status == "succeed") {
							$("#merchantListdg").datagrid('unselectAll');
							$('#merchantListdg').datagrid('getPager').pagination('select');
							$.messager.show({
								timeout : 500,
								msg : '删除成功',
								title : '提示',
							});
							//dispostData(orgid);
							insertLog(adminid, 1, "删除加盟商银行帐号：" + row.accountIdcode, "加盟商列表");
						} else {
							$("#merchantListdg").datagrid('rejectChanges');
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
		$.messager.alert('提示', '请选择需要删除的加盟商', 'warning');
	}
}
//添加对话框
function addMerchant() {
	chearinfo();
	/*$("#showlogo img").remove();*/
	$("#showlogo img").remove();
	$('#addlogo').textbox('initValue');	
	$("#showimg img").remove();
	$("#addlogo").textbox("setValue","");
	$('#addtype').combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		data : [ {
			"id" : 1,
			"name" : "自营商家",
			
		}, {
			"id" : 2,
			"name" : "加盟商家",
			"selected" : true
		} ]
	});
	$("#addmerchantinfo").dialog("open");
}
//保存添加的加盟商信息
function saveAddInfo() {
	// 判断表单是否通过验证
	var valid = $('#addMfrom').form('validate');
	if (!valid) {
		return ;
	}
	if(addlogourl == null){
		$.messager.alert('提示',"请上传加盟商的logo", '');
		return;
	}
	// 获取表单af中的值并转化
	var afInfo = $("#addMfrom").serializeArray();
	var orgName = afInfo[0].value;
	var orgTel = afInfo[1].value;
	var address = afInfo[2].value;
	var contactName = afInfo[3].value;
	var contactTel = afInfo[4].value;
	var type = afInfo[5].value;
	var weight = afInfo[6].value;
	var openid = afInfo[7].value;
	var password = afInfo[8].value;
	var description = afInfo[9].value;
	if (type == null || type == '' || type == 0) {
		$.messager.alert('提示',"请选择商家类型", '');
		return;
	} 
	if(num.match(orgTel)){
		
	}
	$.ajax({
		url : '/gift-fly/system/cisweb/insertMerchant',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			orgName : orgName,
			orgFullName : orgName,
			orgTel : orgTel,
			weight : weight,
			description : description,
			address : address,
			type : type,
			regionId : 0,
			contactName : contactName,
			contactTel : contactTel,
			openId : openid,
			addlogoid : addlogoid,
			addimgid : addimgid,
			password : password,
			adminid : adminid,
			node : "加盟商列表",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#showlogo img").remove();
				$("#showimg img").remove();
				$("#addmerchantinfo").dialog("close");
				// 刷新当前页
				$('#merchantListdg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "添加成功！",
					title : "提示"
				});
				// 插入日志
				insertLog(adminid, 1, "新增加盟商:" + orgName, "加盟商列表");
			}else{
				$.messager.alert('提示', data.msg, 'error');
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
	phoneNum: { //验证手机号   
        validator: function(value, param){ 
         return /^1[3-8]+\d{9}$/.test(value);
        },    
        message: '请输入正确的手机号码'   
    },
    
    telNum:{ //既验证手机号，又验证座机号
      validator: function(value, param){ 
          return /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\d3\d3)|(\d{3}\-))?(1[34578]\d{9})$)/.test(value);
         },    
         message: '请输入正确的电话号码,座机请在区号后加上"-"' 
    },
	bankcard : {
		validator : function(value, param) {
			 return /^([1-9]{1})(\d{14}|\d{18})$/.test(value);
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

//新增的logo上传
function uploadLogo() {
	$('#addlogo').filebox({
		buttonText : '选择logo',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png',
		onChange : function() {
			var xhr = new XMLHttpRequest(); //第一步    
			//定义表单变量    
			var file = document.getElementById('filebox_file_id_1').files;
			//新建一个FormData对象    
			var formData = new FormData();
			//追加文件数据    
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			$("#btnID").trigger("click");
			$("#upload-progressbar").window("open");
			//post方式    
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			//发送请求    
			xhr.send(formData); //第三步骤    
			//ajax返回    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
						$("#showlogo img").remove();
					addlogourl = jQuery.parseJSON(xhr.responseText).url; 
					addlogoid = jQuery.parseJSON(xhr.responseText).id;
					$("#showlogo").append(
							'<img src="'+addlogourl+'"style="width: 100px;height:100px;">'+
							'<img onclick="dellogo()" style="position:absolute;right:0; top:1px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
					
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
function dellogo() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : addlogourl,
			id : addlogoid,
		},
	});
	$("#showlogo img").remove();
	$('#addlogo').textbox('initValue');	
}
//新增的广告图上传
function uploadImg() {
	$('#adimg').filebox({
		buttonText : '选择图片',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png',
		onChange : function() {
			var xhr = new XMLHttpRequest(); //第一步    
			//定义表单变量    
			var file = document.getElementById('filebox_file_id_2').files;
			//新建一个FormData对象    
			var formData = new FormData();
			//追加文件数据    
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			$("#btnID").trigger("click");
			$("#upload-progressbar").window("open");
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
					'<img onclick="delimg()" style="position:absolute;right:0; top:1px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
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
//编辑后的logo上传
function uploadupLogo() {
	$('#uplogo').filebox({
		buttonText : '选择logo',
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
			//post方式    
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			//发送请求    
			xhr.send(formData); //第三步骤    
			//ajax返回    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					if (uplogourl != null && uplogoid != null) {
						$.ajax({
							url : '/gift-fly/system/upload/delImg',
							dataType : "json",
							type : "post",
							data : {
								url : uplogourl,
								id : uplogoid,
							},
						});
						$("#showuplogo img").remove();
					}
					uplogourl = jQuery.parseJSON(xhr.responseText).url; 
					uplogoid = jQuery.parseJSON(xhr.responseText).id;
					$("#showuplogo").append(
							'<img src="'+uplogourl+'"style="width: 100px;height:100px;">'+
					'<img onclick="deluplogo()" style="position:absolute;right:0; top:1px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
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
			url : uplogourl,
			id : uplogoid,
		},
	});
	$("#showuplogo img").remove();
	$('#uplogo').textbox('initValue');	
}
//新增的广告图上传
function uploadupImg() {
	$('#upimg').filebox({
		buttonText : '选择图片',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png',
		onChange : function() {
			var xhr = new XMLHttpRequest(); //第一步    
			var file = document.getElementById('filebox_file_id_4').files;
			var formData = new FormData();
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			$("#btnID").trigger("click");
			$("#upload-progressbar").window("open");
			//post方式    
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			//发送请求    
			xhr.send(formData); //第三步骤    
			//ajax返回    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					if (upimgurl != null && upimgid != null) {
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
					'<img onclick="delupimg()" style="position:absolute;right:0; top:1px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
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
/**
 * 清除缓存
 */
function chearinfo() {
	$('#addorgName').textbox('initValue');
	$('#merchantName').textbox('initValue');
	$("#addorgTel").textbox('initValue');
	$("#addAddress").textbox('initValue');
	$("#addcontactName").textbox('initValue');
	$("#addcontactTel").textbox('initValue');
	$("#addtype").combobox("clear");
	$("#addweight").textbox('initValue');
	$("#adduser").textbox('initValue');
	$("#addpassword").textbox('initValue');
	$("#adddescription").textbox('initValue');
}
