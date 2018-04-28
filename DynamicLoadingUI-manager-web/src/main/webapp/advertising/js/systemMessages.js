$(document).ready(function() {
	loginCheck1();
	var adp = $('#sysMsgDg').datagrid('getPager');
	$(adp).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [ 15, 20, 25 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findMsgList(pageNumber, pageSize)
		},
	});
	/*<option value="1">用户</option>
	<option value="2">分组</option>
	<option value="3">机构全体</option>
	<option value="4">机构管理员</option>*/
	findMsgList(1, 15);
	sysMsgUploadupPicture();
});
//分页查询
function findMsgList(page, rows) {
	let sysMsgService = new SysMsgService();
	sysMsgService.findMsgList(page, rows, function(data) {
		if (data.status == "succeed") {
			var pageObj = {
				total : data.total,
				rows : data.list
			};
			$('#sysMsgDg').datagrid('loaded');
			$("#sysMsgDg").datagrid('loadData', pageObj);
		} else {
			$.messager.alert('提示', '后台没有数据', 'warning');
			nullData();
		}

	}, function(data) {
		$.messager.alert('提示', '请求后台失败', 'warning');
		nullData();
	})
}
function nullData() {
	let pageObj = {
		total : 0,
		rows : []
	};
	$('#sysMsgDg').datagrid('loaded');
	$("#sysMsgDg").datagrid('loadData', pageObj);
}
var signNotice = 0;
function addSysMsgDialogShow() {
	signNotice = 2;
	$("#msgTitle").textbox("setValue", "");
	$("#showPicMsg img").remove();
	$("#upPictureMsg").textbox("setText", "");
	$('#noticeTitle').textbox('setValue', "");
	$('#addSysMsg').dialog('open');
}
function updateMsgDialogShow(){
	var row = $("#sysMsgDg").datagrid("getSelected");
	$("#showPicMsg img").remove();
	$('#upPictureMsg').textbox('initValue');	
	if (row) {
		$('#cmbType').combobox('setValue', row.type);
		editor.html(row.content);
		$('#msgTitle').textbox('setValue', row.title);
		id = row.id;
		sysMsgPicUrl = row.imageUrl;
		$('#upPictureMsg').textbox('setText', sysMsgPicUrl);
		sysMsgImage_id = row.convered_image_id;
		if (sysMsgPicUrl != null) {
			$("#showPicMsg").append(
				'<img src="' + sysMsgPicUrl + '"style="width:145px;height:100px;">' +
				'<img onclick="delSysMsgPic()" style="position:absolute;left:145px; top:0;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
		}
		$('#addSysMsg').dialog('open');
	}
}
var msgId = 0;
var articleId = 0;
function addMsg() {
	let afInfo = $("#addMsgFrom").serializeArray();
	let title = afInfo[0].value;
	if (title == "" || title == null) {
		$.messager.alert('提示', "标题不能为空", 'warning');
		return;
	}
	let content = editor.html();
	if (content == "" || content == null) {
		$.messager.alert('提示', "内容不能为空", 'warning');
		return;
	}
	let type = $('#cmbType').combobox('getValue');
	let convered_image_id = sysMsgImage_id;
	let articleType = 12; //站内信
	let id = 0;
	let aId = 0;
	if (signNotice == 1) {
		id = msgId;
		aId = articleId;
	}
	let sysMsgService = new SysMsgService();
	sysMsgService.addOrUpdate(id, type,aId, title, content, articleType, convered_image_id, function(data) {
		if (data.status == "succeed") {
			$('#addSysMsg').dialog('close');
			findMsgList(1, 15);
			$.messager.show({
				timeout : 500,
				msg : "操作成功！",
				title : "提示"
			});
			msgId = 0;
			articleId = 0;
		}
	}, function(data) {
		$.messager.alert('提示', data.msg, 'warning');
	})
}
function formatterCZ(value, row, index) {
	return '<a href="javascript:updateMsgDialogShow();" class="audit">查看信息</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
		'<a href="javascript:deleteNotic();" class="audit">删除</a>';
}
var sysMsgPicUrl = "";
var sysMsgImage_id = 0;
//编辑后的logo上传
function sysMsgUploadupPicture() {
	$('#upPictureMsg').filebox({
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
			//post方式    
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			//发送请求    
			xhr.send(formData); //第三步骤    
			//ajax返回    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					if (sysMsgPicUrl != null) {
						$.ajax({
							url : '/gift-fly/system/upload/delImg',
							dataType : "json",
							type : "post",
							data : {
								url : sysMsgPicUrl,
								id : sysMsgImage_id,
							},
						});
						$("#showPicMsg img").remove();
					}
					sysMsgPicUrl = jQuery.parseJSON(xhr.responseText).url;
					sysMsgImage_id = jQuery.parseJSON(xhr.responseText).id;
					$("#showPicMsg").append(
						'<img src="' + sysMsgPicUrl + '"style="width:145px;height:100px;">' +
						'<img onclick="delSysMsgPic()" style="position:absolute;top:0;left:145px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
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
function delSysMsgPic() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : sysMsgPicUrl,
			id : sysMsgImage_id,
		},
	});
	$("#showPicMsg img").remove();
	$('#upPictureMsg').textbox('initValue');
}
//接口请求服务
function SysMsgService() {
	// 请求url
	this.selectUrl = "system/cms/findMsgList";
	this.addOrUpdateUrl = "system/cms/insertAndUpdateMsg";
	this.delUrl = "system/cms/delArticle";
}
;
SysMsgService.prototype = {
	findMsgList : function(page, rows, successFun, errorFun) {
		var params = {
			page : page,
			rows : rows
		};
		new RequestService().ajaxRequestPost(this.selectUrl, params,
			successFun, errorFun);
	},
	deleteNotic : function(id, successFun, errorFun) {
		let adminid = ReadCookie("adminid");
		let node = "公告";
		var params = {
			adminid : adminid,
			node : node,
			id : id
		};
		new RequestService().ajaxRequestPost(this.delUrl, params,
			successFun, errorFun);
	},
	addOrUpdate : function(id, type,articleId, title, content, articleType, convered_image_id, successFun, errorFun) {
		let sender_name = ReadCookie("username");
		let adminid = ReadCookie("adminid");
		let node = "公告";
		var params = {
			adminId : adminid,
			node : node,
			id : id,
			title : title,
			content : content,
			articleType : articleType,
			sender_name : sender_name,
			convered_image_id : convered_image_id,
			articleId : articleId,
			type:type
		};
		new RequestService().ajaxRequestPost(this.addOrUpdateUrl, params,
			successFun, errorFun);
	},
}